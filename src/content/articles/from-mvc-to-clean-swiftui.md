---
title: From MVC/MVVM to Clean SwiftUI Architecture
date: 2026-05-07
excerpt: A pragmatic evolution of iOS architecture across ViewModel, Dependency Injection, Interactors, AppState, Service–Store and TCA.
tags: [iOS, Android, SwiftUI, Architecture]
---

![Evolution of iOS architectures](/blog/infographic-map.svg)

One of my many loop thoughts in mobile software development is the choice of the correct architecture to implement.
What i consider to be a perfect architecture is one that addresses this 3 concepts:

- **high scalability** -> it has to be modular enough to implement easily new services, features or tools with the less possibile rewriting of source code
- **robust testing** -> it has to be supported by strong acceptance, integration and unit tests, granting realiablity over time
- **knowledge transfer** -> it has to be clear enough to anyone who needs to touch the code or interact with it

## MVC: where it all started

The starting point of software architecture was of course MVC. Almost every architecture was based on this design pattern and mobile development was encouraged to follow it, associating it to the concept of `UIViewController`.
Today it is more accurate to read it as the primordial prototype of mobile architecture rather than a sufficient solution for modern apps. The idea was simple — Model, View, Controller — but in practice the `UIViewController` ended up holding navigation, networking, validation, state, errors, persistence, analytics and coordination.

![MVC: the Massive View Controller](/blog/infographic-mvc.svg)

This is the origin of UIKit's historical problem: the **Massive View Controller**.

Many structures emerged to solve this problem: MVVM, VIPER, Clean Architecture, Redux-like, Service–Store and TCA are basically all different answers to the same question.

> How do we prevent the app's complexity from accumulating in a single object?

There is also a second, often less explicit one: **how do dependencies reach the business logic without coupling the entire app?** Many architectures look clean on paper but become confusing when you have to decide who creates a Repository, who owns a Service, where a mock is configured, and how the app is assembled for previews, tests and production.

## MVVM: lightening the Controller, but not enough

MVVM introduces a new actor, the ViewModel. This is a specialized actor oriented to the View needs.
Its main purpose is to keep the View as dumb as possible, taking responsibility for preparing the data the View needs, exposing visual state, handling updates, refreshing content, and coordinating the UI state transitions.

With the arrival of SwiftUI, the View became already declarative and state-driven, since SwiftUI Views already know how to refresh themselves when state changes through `@State`, `@Binding`, `@Observable`, `@StateObject`, `@Environment`, and so on.
However, the idea behind the ViewModel did not disappear. In the complex world of a real app in production these tools SwiftUI had naturally embedded did not seem like enought at first. The Combine framework was a very new approach to observe states and not many applications felt confident to use it's true powers.

Another crucial point was the fact that navigation in SwiftUI was very poor at the early stages making people still prefer the UIKit Coordinator pattern approach.
For these main reasons the remaning presence of a Viewmodel helped a lot to "navigate"(pun eheh) the mess of dependecies, presentation logics and state management.

```swift
final class TripListViewModel: ObservableObject {
    @Published var trips: [Trip] = []
    @Published var isLoading = false
    private let tripsRepository: TripsRepository
    init(tripsRepository: TripsRepository) {
        self.tripsRepository = tripsRepository
    }
    func loadTrips() async {
        isLoading = true
        defer { isLoading = false }
        trips = (try? await tripsRepository.fetchTrips()) ?? []
    }
}
```

So where do we keep networking, validation, retry, error mapping, formatting, analytics, navigation, caching and sync?
You guessed it, it all ends up inside the ViewModel. The Massive View Controller becomes a **Massive ViewModel**.

![MVVM and the Massive ViewModel risk](/blog/infographic-mvvm.svg)

MVVM, on its own, is not really the culprit of this problem, but the issue is that it doesn not provide a rule to it.
So what is more likely to happen in a production MVVM app is going to be that a feature uses initializer injection, another `EnvironmentObject`, another calls `APIClient.shared` directly. DI ends up "all over the place" exactly like state management.
And navigation, has no clear owner: View, ViewModel, Coordinator or Router?

## VIPER: splitting everything into smaller actors

VIPER answers radically by dividing a feature into **View, Interactor, Presenter, Entity, Router**. Its merit is that it takes separation of concerns seriously and makes the feature graph explicit, usually through a **Builder, Configurator, or Assembly** that wires all the pieces together.

In this architecture, the **View** only displays UI and forwards user interactions. The **Presenter** handles presentation logic, formats data for the UI, and tells the View what to show. The **Interactor** contains the business logic and coordinates repositories or services. The **Entity** represents the domain/data model. The **Router** owns navigation and screen transitions.

There are also other versions of this approach which involves a **Worker** for low level business logic. Point is that the names may change but the main concept remains. Separate the actor and move responsability constantly from one to another.

The opposite risk to MVVM is clear: MVVM concentrates too much in too few objects, VIPER spreads too much across too many.

## Clean Architecture in SwiftUI

While the architectures before directly hit me, mostly experiencing them on many companies i had the pleasure to work with, this one is when i went exploring and started to overfocus on what was new about architectural patterns. Since the Apple presentation of Combine framework i had this little idea in my head that there was more to know about state management for SwiftUI. Also this framework and the arrival of `NavigationStack` created a firm belief that the time was mature enough to bring this ideas in production and give SwiftUI the main role it deserved.

With SwiftUI the question changes: no longer "how do I lighten the ViewController?", but **how do I organise state, side effects, business logic, navigation and dependencies in a declarative UI?**

![Clean SwiftUI Architecture](/blog/infographic-clean.svg)

The approach i liked the most was [_clean-architecture-swiftui_](https://github.com/nalexn/clean-architecture-swiftui) by Alexey Naumov. This idea is at first similar to VIPER, but with a Combine observability pattern and way more focused to the global state of the app.
The main concepts are this five roles: **View, AppState, Interactors, Repositories, DIContainer**. The View reads state and sends intents; the Interactor executes use cases; the Repository abstracts the data; the AppState holds shared state; the DIContainer composes the graph.

```swift
struct TripListView: View {
    @Environment(\.appState) private var appState
    @Environment(\.interactors) private var interactors
    var body: some View {
        List(appState.trips.items) { Text($0.name) }
            .task { await interactors.trips.loadTrips() }
    }
}

struct TripsInteractor {
    let appState: AppState
    let tripsRepository: TripsRepository
    let analyticsService: AnalyticsService
    func loadTrips() async {
        appState.trips.loadingState = .loading
        do {
            appState.trips.items = try await tripsRepository.fetchTrips()
            appState.trips.loadingState = .loaded
            analyticsService.track(.tripsLoaded)
        } catch {
            appState.trips.loadingState = .failed(error)
        }
    }
}
```

Composition lives in a single place — the **composition root**:

```swift
struct DIContainer {
    let appState: AppState
    let interactors: Interactors
    let repositories: Repositories
    let services: Services
}
```

The DIContainer can have `live`, `preview`, `test` variants to grant the correct environments for testability.
What this approach does mainly is taking into account the dependency injection problem and establish a set of rules to follow, such as inject more specific dependencies per feature and use `Environment` with discipline.
The rule about AppState is similar: local state in the View if it is only needed there, feature state if it is shared across one feature, AppState only for what is truly global.

## Where do we go from here? Closure-based Dependency Injection

As we have already seen Clean Architecture is something between a real architecture and a set of practices to follow. It answers the _structural_ question — who owns state, who runs use cases, who exposes data. It leaves open the _implementation_ question: **how do dependencies actually get into Interactors, Repositories and Services?**
The classic answer, which is also the one that Alexey Naumov chooses, is "protocols + concrete types + a mock for tests". It works, but every dependency costs you a protocol, an implementation, a mock, and often a wrapper just to make initializers compile.

In another article i had the pleasure to read, Kyle Browning explored this exact question in [_Dependency Injection in SwiftUI without the cerimony_](https://kylebrowning.com/posts/dependency-injection-in-swiftui/), arguing that the protocol-heavy approach common in UIKit does not translate well to SwiftUI's value-type, preview-driven world. The article asks a simple question: if SwiftUI previews and tests need lightweight, swappable dependencies, why make the substitution mechanism heavy?

The technique, which is popularised by [_Point-Free_](https://www.pointfree.co), flips this: model a dependency as a **struct of closures**, not as a protocol. The "interface" is the shape of its functions; implementations are just values.

```swift
struct TripsRepository {
    var fetchTrips: () async throws -> [Trip]
    var save: (Trip) async throws -> Void
}

extension TripsRepository {
    static let live = TripsRepository(
        fetchTrips: { try await APIClient.shared.fetchTrips() },
        save:       { try await APIClient.shared.save($0) }
    )
    static let preview = TripsRepository(
        fetchTrips: { [.romeTrip, .tokyoTrip] },
        save:       { _ in }
    )
    static let failing = TripsRepository(
        fetchTrips: { throw URLError(.notConnectedToInternet) },
        save:       { _ in }
    )
}
```

The same Interactor from the Clean section becomes trivial to instantiate in any context — production, SwiftUI previews, unit tests — by swapping a value instead of writing a new class:

```swift
let interactor = TripsInteractor(
    appState: appState,
    tripsRepository: .preview,        // or .live, .failing, custom...
    analyticsService: .noop
)
```

This is a **technique, not an architecture**. It applies inside MVVM, Clean, Service–Store and TCA. It removes protocol boilerplate, makes substitution a one-liner, and turns "configuring the app for tests" into building a different `DIContainer` value. It is the natural bridge between Naumov-style Clean Architecture and the more SwiftUI-native shapes which i found particularly interesting to mention.

## Service–Store: a pragmatic Clean Architecture variant

Another point that caught my interest in Kyle's article, is the pragmatic approach he took to implement Clean Architecture patterns. While Naumov's Clean Architecture is **layer-oriented**: the app is sliced horizontally into View / AppState / Interactors / Repositories / Services, and a feature is a path that crosses all layers. Service–Store is **feature-store-oriented**: the app is sliced vertically by feature, and each feature owns its own observable Store and its own Service.

![Service–Store Architecture](/blog/infographic-service-store.svg)

The Store is the observable truth for _one feature_; the Service is the set of operations that can mutate that Store and trigger side effects; the View renders the Store and sends intents to the Service.

```swift
@MainActor @Observable
final class PackingStore {
    var items: [NeededItem] = []
    var loadingState: LoadingState = .idle
}

struct PackingService {
    var loadItems: () async -> Void
    var markAsPacked: (NeededItem.ID) async -> Void
}

extension PackingService {
    static func live(store: PackingStore,
                     repository: NeededItemRepository) -> PackingService {
        PackingService(
            loadItems: {
                store.loadingState = .loading
                do {
                    store.items = try await repository.fetchItems()
                    store.loadingState = .loaded
                } catch {
                    store.loadingState = .failed(error)
                }
            },
            markAsPacked: { id in
                try? await repository.markAsPacked(id)
                if let i = store.items.firstIndex(where: { $0.id == id }) {
                    store.items[i].isPacked = true
                }
            }
        )
    }
}

struct PackingView: View {
    let store: PackingStore
    let service: PackingService
    var body: some View {
        List(store.items) { item in
            Button(item.name) { Task { await service.markAsPacked(item.id) } }
        }
        .task { await service.loadItems() }
    }
}
```

Compared to Clean Architecture, the trade-off is clear:

- For **Naumov Clean Architecture** a global `AppState` and shared Interactors/Repositories give you a coherent picture of the whole app, at the cost of more ceremony per feature and a single composition root that has to know about everything.
- For **Kyle Service–Store Clean Architecture** each feature is a self-contained `(Store, Service)` pair built on top of the same closure-based dependencies. It scales naturally with the number of features and maps directly onto SwiftUI's `@Observable` world, but it gives up the global compass — there is no single AppState, so cross-feature state has to be designed explicitly.

The flow `View → Service → Store mutation → View` is a _soft_ Redux-like, or _TCA-inspired, but not TCA_. The main risk is that lightness becomes disorder: a Service can easily turn into a new Manager if the feature boundary is not kept honest.

Is also worth to mention that this is the pattern i am actually using, since i find it particulary useful for ATDD development. In this approach of development the acceptance tests are the source of truth and naturally easy to break into feature.

I'm going to talk deeper about ATDD development in another future article

## TCA: the formalised unidirectional flow

It would be wrong to finish this article without talking about the big elephant in the room, **The Composable Architecture**.

TCA is a much more specific and defined architecture built on **State, Action, Reducer, Effect, Store, Dependencies**.

![TCA: Unidirectional Flow](/blog/infographic-tca.svg)

The View does not call services: it sends actions. The Reducer decides what changes in the state and which Effects to launch. Dependencies are not a choice left to the feature, they are part of the system:

```swift
@Reducer
struct PackingFeature {
    @Dependency(\.neededItemRepository) var repository
    @Dependency(\.analytics) var analytics
    struct State: Equatable {
        var items: [NeededItem] = []
        var loadingState: LoadingState = .idle
    }
    enum Action {
        case onAppear
        case itemsLoaded(Result<[NeededItem], Error>)
        case markAsPacked(NeededItem.ID)
    }
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .onAppear:
                state.loadingState = .loading
                return .run { send in
                    await send(.itemsLoaded(Result { try await repository.fetchItems() }))
                }
            case let .itemsLoaded(.success(items)):
                state.items = items; state.loadingState = .loaded
                return .none
            case let .markAsPacked(id):
                return .run { _ in
                    try await repository.markAsPacked(id)
                    analytics.track(.itemPacked)
                }
            case .itemsLoaded(.failure):
                state.loadingState = .failed; return .none
            }
        }
    }
}
```

TCA is probably the most rigorous and complete architecture in the modern Swift world: useful with complex features, many intermediate states, side effects, cancellation, debounce, deep links, large teams and deterministic tests. The advantage is that it makes everything explicit; the downside is that it requires adopting the whole model. **Is this architecture worth the step?** This is really dependant on the projects you work to or personal preferences.
For me it is not for now, you can get most of its benefits with a lighter solution: Clean as the compass, AppState/FeatureState, Interactors or Services, Repositories and closure-based dependencies.
Considering also my latest cross-platforming tendency to use **Kotlin Multiplatform Mobile** for low level services, i fear it would become too heavy to apply such rigids logics.

## Conclusion

All of these patterns try to answer three questions: **where state lives, where side effects happen, where dependencies are composed.** The quality of an architecture depends on how clear these three answers are. If you don't know where state lives, you'll have bugs that are hard to trace; if you don't know where side effects happen, you'll have code that is hard to test; if you don't know where dependencies are composed, you'll have hidden coupling.

It is also important to mention that there is no real final perfect architecture (old me would be so pissed about this sentence), but it really depends on the complexity of what you are building, the services you need and the platforms you are developing for.

The real enemy is not MVC, MVVM or Clean Architecture. It is always the same: **complexity accumulated in the wrong place**.

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
