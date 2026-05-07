---
title: Advanced Swift Concurrency
date: 2025-01-20
excerpt: Beyond async/await — how actors, task groups, Sendable, and strict concurrency change the way Swift wants you to think about async work.
tags: [Swift, Concurrency, Advanced]
---

Swift Concurrency is one of those changes that looks simple at first because `async` and `await` are easy to read. Then you start using actors, task groups, `Sendable`, and strict concurrency checking, and you realise the feature is not just a nicer way to write completion handlers.

It changes how Swift wants you to think about asynchronous work.

Before Swift 5.5, most iOS code handled async work with completion closures, delegates, `DispatchQueue`, Combine, or a promise library. All of those approaches worked. Plenty of solid apps were built that way. But the code could get messy fast, especially when several async operations depended on each other.

Error handling ended up split across closures. Cancellation was easy to forget. Shared mutable state was usually protected by convention, not by the compiler. If somebody touched a property from the wrong queue six months later, the bug might only show up on a busy device with bad network conditions.

Swift Concurrency does not magically remove complexity, but it moves a lot of it into the language.

## Async/Await

`async` and `await` let asynchronous code read almost like normal Swift. Instead of passing a completion handler and jumping to another closure when the result is ready, an async function can return a value directly.

```swift
func fetchUser() async throws -> User {
    let url = URL(string: "https://api.example.com/user")!
    let (data, response) = try await URLSession.shared.data(from: url)
    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw NetworkError.invalidResponse
    }
    return try JSONDecoder().decode(User.self, from: data)
}
```

The big thing to remember: `await` does not block the thread.

When the code reaches this line:

```swift
let (data, response) = try await URLSession.shared.data(from: url)
```

the task is suspended. The thread is free to do something else. When the network request finishes, Swift resumes the task. That resume does not have to happen on the same thread.

That detail matters. A lot of older iOS code was written with a mental model based on queues and threads. With Swift Concurrency, it is better to think in terms of tasks, suspension points, and isolation. The thread is an implementation detail most of the time.

This is also why async/await is not just "completion handlers with nicer syntax". The control flow is cleaner, but the runtime behaviour is different too.

## Actors

Actors exist because shared mutable state is where concurrent code usually gets ugly.

Before actors, you would usually protect shared state with a serial queue, a lock, or some custom synchronization rule that lived mostly in people's heads. That works until someone bypasses the rule. Then you get a race condition that is hard to reproduce and even harder to explain.

An actor gives the state an owner.

```swift
actor UserStore {
    private var users: [User] = []
    private var cache: [String: User] = [:]

    func add(_ user: User) {
        users.append(user)
        cache[user.id] = user
    }

    func getAll() -> [User] {
        users
    }

    func find(byId id: String) -> User? {
        cache[id]
    }
}
```

From inside `UserStore`, the actor can read and mutate its own properties normally. From outside, access is isolated. Calling an actor method from another concurrency context requires `await`, because the caller may need to wait for the actor to become available.

That is the useful part: the compiler forces you to respect the boundary.

You cannot casually reach into the actor and mutate its array from some random task. The state belongs to the actor. If another part of the app wants to interact with it, it has to go through the actor's interface.

`@MainActor` uses the same idea for UI work. Instead of writing this everywhere:

```swift
DispatchQueue.main.async {
    self.title = "Loaded"
}
```

you can isolate UI-related code to the main actor. In SwiftUI, this is especially useful for view models or observable types that update state read by the view.

## Task Groups

Task groups are useful when you have several pieces of async work that should run in parallel, but still belong to one parent operation.

Downloading a batch of images is a good example.

```swift
func fetchAllImages(urls: [URL]) async throws -> [UIImage] {
    try await withThrowingTaskGroup(of: (Int, UIImage).self) { group in
        for (index, url) in urls.enumerated() {
            group.addTask {
                let (data, _) = try await URLSession.shared.data(from: url)
                guard let image = UIImage(data: data) else {
                    throw ImageError.invalidData
                }
                return (index, image)
            }
        }

        var images = Array<UIImage?>(repeating: nil, count: urls.count)
        for try await (index, image) in group {
            images[index] = image
        }
        return images.compactMap { $0 }
    }
}
```

The nice part here is not only that the downloads run in parallel. It is that the work is still structured.

The child tasks belong to the task group. If one throws, the group handles that through the throwing task group mechanism. If the parent task is cancelled, the child tasks do not keep running forever in the background like forgotten `DispatchQueue.async` blocks.

The example also keeps the original order of the URLs. Downloads finish whenever they finish, so each child task returns its index together with the image. Without that, the returned array would be ordered by completion time, which is rarely what you want in UI code.

Task groups are also handy when you want to process results as soon as they arrive. For example, a gallery screen could start showing images one by one instead of waiting for the whole batch. You do not always need that, but when you do, task groups fit the problem well.

## Sendable and Data Safety

`Sendable` is where Swift Concurrency starts to feel stricter.

A `Sendable` type is safe to pass across concurrency boundaries. That means it can move between tasks, actors, and isolated contexts without creating obvious data-race problems.

Structs and enums usually fit this model well. If their stored properties are also `Sendable`, Swift can often infer conformance. Classes are harder, because they are reference types. A mutable class instance can be shared by two tasks, and both tasks can touch the same memory.

That is exactly the kind of thing Swift is trying to stop.

```swift
class MutableCounter {
    var count = 0
}

let counter = MutableCounter()
Task {
    // Compiler error: capture of non-Sendable 'counter'
    counter.count += 1
}
```

The compiler complains because `counter` is a mutable reference object being captured by a task. There is no guarantee that another task is not using the same instance at the same time.

A better version depends on what the counter is supposed to do.

If it is shared mutable state, make it an actor:

```swift
actor Counter {
    private var count = 0

    func increment() {
        count += 1
    }

    func value() -> Int {
        count
    }
}
```

If it does not need to be shared, make it a value type and pass copies around.

The temptation with `Sendable` errors is to silence them. Swift gives you tools like `@unchecked Sendable`, and sometimes they are the right answer, especially around older APIs or types that are internally synchronized. But it should feel like taking responsibility, not like adding a random annotation until the warning disappears.

A lot of concurrency warnings are design feedback. They are Swift telling you: "This object crosses a boundary, but I cannot prove it is safe."

That can be annoying. It is also useful.

## Strict Concurrency

Strict concurrency checking is the part that tends to surprise teams during migration.

Code that looked fine in Swift 5.9 can start producing warnings or errors once stricter checking is enabled. The most common problems are non-`Sendable` values crossing actor boundaries, mutable state being captured by `@Sendable` closures, or UI state being touched outside the main actor.

The worst way to handle this is to wait until the Swift 6 migration and then fix everything at once.

A better approach is to turn on stricter checking earlier, module by module if needed, and treat the warnings as cleanup work. Some fixes are small: add `@MainActor`, make a model conform to `Sendable`, change a class to a struct. Others reveal deeper design problems, especially around singleton services, caches, and shared mutable managers.

Those are the places where actors usually help.

## What This Changes in App Architecture

Swift Concurrency nudges code toward clearer ownership.

A networking layer can expose async functions instead of completion handlers. A cache can become an actor. A view model that updates UI state can live on the main actor. A long-running operation can create child tasks and know they will be cancelled when the parent goes away.

That last point is easy to underestimate. In app code, cancellation matters all the time. A user leaves a screen. A search query changes. A cell gets reused. A view disappears. With older patterns, it was common to leave work running and then add checks afterward to avoid applying stale results.

Structured concurrency gives you a cleaner model: the task should live only as long as the thing that needs it.

Swift Concurrency does not make every async problem simple. You still need to understand isolation, cancellation, reentrancy, and the difference between structured and unstructured tasks. But the direction is better. Instead of relying on comments and team discipline, more of the rules are expressed in the type system and checked by the compiler.

The result is a safer async code.

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;
