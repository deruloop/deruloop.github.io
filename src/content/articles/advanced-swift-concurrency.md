---
title: Advanced Swift Concurrency
date: 2025-01-20
excerpt: Deep dive into async/await, actors, and structured concurrency in Swift.
tags: [Swift, Concurrency, Advanced]
---

Swift's modern concurrency model, introduced in Swift 5.5, brings safety and clarity to asynchronous programming. Before async/await, iOS developers relied heavily on completion handlers, delegation patterns, and third-party libraries like PromiseKit or Combine to manage asynchronous work. While these approaches worked, they often led to deeply nested callbacks, difficult error handling, and subtle bugs related to thread safety. The new concurrency model addresses all of these pain points with first-class language support.

## Async/Await

The `async`/`await` pattern replaces completion handlers with clean, linear code that reads top-to-bottom, just like synchronous code. Functions marked with `async` can suspend execution at `await` points, freeing up the thread to do other work while waiting for a result. This eliminates the "pyramid of doom" that was common with nested completion handlers and makes error handling straightforward with standard `try`/`catch` syntax.

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

One important thing to understand is that `await` doesn't block the current thread — it suspends the current task and allows the system to use that thread for other work. When the awaited operation completes, the task resumes, potentially on a different thread. This is a fundamental difference from blocking I/O in other languages and is key to understanding Swift's concurrency performance characteristics.

## Actors

Actors are a new reference type in Swift that protect their mutable state from data races at compile time. Before actors, developers had to manually synchronize access to shared mutable state using locks, serial dispatch queues, or other synchronization primitives — and getting it wrong would lead to crashes, corrupted data, or subtle bugs that only appeared under heavy load. Actors solve this by ensuring that only one task can access the actor's mutable state at a time.

```swift
actor UserStore {
    private var users: [User] = []
    private var cache: [String: User] = [:]
    
    func add(_ user: User) {
        users.append(user)
        cache[user.id] = user
    }
    
    func getAll() -> [User] {
        return users
    }
    
    func find(byId id: String) -> User? {
        return cache[id]
    }
}
```

When you call a method on an actor from outside, you must use `await` because the call might need to wait for exclusive access. The compiler enforces this, making data races a compile-time error rather than a runtime mystery. The `@MainActor` attribute is a special global actor that ensures code runs on the main thread, which is essential for UI updates and replaces the common `DispatchQueue.main.async` pattern.

## Task Groups

Structured concurrency with task groups enables parallel execution while maintaining clear parent-child relationships between tasks. When a parent task is cancelled, all child tasks are automatically cancelled too. This prevents resource leaks and orphaned work that were common problems with unstructured concurrency approaches like `DispatchQueue.async`.

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

Task groups also support dynamic concurrency limits using `TaskGroup`'s `addTaskUnlessCancelled` method, and you can process results as they arrive rather than waiting for all tasks to complete. This is particularly useful for implementing features like progressive image loading, where you want to show each image as soon as it's downloaded rather than waiting for the entire batch.

## Sendable and Data Safety

The `Sendable` protocol is the foundation of Swift's compile-time data race safety. A type that conforms to `Sendable` is safe to share across concurrency domains — meaning it can be passed between actors and tasks without risk of data races. Value types like structs and enums are implicitly `Sendable` when all their stored properties are also `Sendable`. Classes can conform to `Sendable` if they're `final` and all their stored properties are immutable.

Understanding `Sendable` is crucial because the compiler will increasingly enforce these rules in future Swift versions. When you pass a closure to `Task` or a task group, the compiler checks that everything captured by the closure is `Sendable`. This might feel restrictive at first, but it catches real bugs — bugs that would otherwise manifest as intermittent crashes or corrupted data in production.

The `@Sendable` attribute on closures works hand-in-hand with the protocol. When a closure is marked `@Sendable`, the compiler verifies that it doesn't capture any mutable references to non-`Sendable` types. This is particularly important when working with `Task` and `TaskGroup`, where closures inherently cross concurrency boundaries. Consider the following example where the compiler would flag an issue:

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

To fix this, you'd either make `MutableCounter` an actor, or make it a struct (a value type). In practice, adopting `Sendable` often means rethinking your data model — favoring value types, using actors for shared mutable state, and leveraging `nonisolated` and `@unchecked Sendable` only as escape hatches when you're absolutely sure of your synchronization. The payoff is enormous: the compiler becomes your concurrency safety net, catching race conditions before they ever reach your users.

## Conclusion

Swift concurrency represents a paradigm shift in how we write asynchronous code on Apple platforms. The combination of async/await for linear asynchronous flow, actors for safe mutable state, structured concurrency for managing task lifetimes, and `Sendable` for compile-time safety creates a comprehensive system that eliminates entire categories of bugs.

The migration from GCD and completion handlers takes effort, but the resulting code is safer, more readable, and easier to reason about. Teams that have adopted Swift concurrency report significantly fewer threading-related crashes in production and find that new developers can understand concurrent code much more quickly because the control flow is explicit rather than hidden in callback chains.

One area worth watching is the evolution of strict concurrency checking. Swift 5.10 introduced complete concurrency checking as an opt-in compiler flag, and Swift 6 makes it the default. This means code that compiled without warnings in Swift 5.9 may produce errors in Swift 6 if it passes non-`Sendable` types across isolation boundaries. Preparing for this transition now — by enabling strict concurrency checking in your build settings and resolving warnings incrementally — will make the Swift 6 migration significantly smoother.

Beyond the technical benefits, Swift concurrency also changes how we architect applications. The actor model naturally leads to clearer separation of concerns, where each actor owns a specific piece of state and exposes a well-defined interface. Combined with structured concurrency's automatic cancellation propagation, you get applications that are not only safe but also responsive — cancelling in-flight network requests when a user navigates away, cleaning up resources when a view disappears, and gracefully handling timeouts without manual bookkeeping. As the ecosystem continues to adopt these patterns, they'll become the standard way to write concurrent Swift code across all Apple platforms and beyond.
