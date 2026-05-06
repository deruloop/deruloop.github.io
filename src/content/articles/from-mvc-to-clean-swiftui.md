---
title: From MVC/MVVM to Clean SwiftUI Architecture
date: 2026-05-06
excerpt: Evoluzione pragmatica dell'architettura iOS tra ViewModel, Dependency Injection, Interactors, AppState, Service–Store e TCA.
tags: [iOS, SwiftUI, Architecture]
---

# From MVC/MVVM to Clean SwiftUI Architecture

Evoluzione pragmatica dell'architettura iOS tra ViewModel, Dependency Injection, Interactors, AppState, Service–Store e TCA.

![Evoluzione delle architetture iOS](/blog/infographic-map.png)

Per anni il punto di partenza dell'architettura iOS è stato MVC. Oggi è più corretto leggerlo come il prototipo primordiale dell'architettura mobile che come una soluzione sufficiente per app moderne. L'idea era semplice — Model, View, Controller — ma nella pratica dentro il `UIViewController` finivano navigazione, networking, validazione, stato, errori, persistenza, analytics e coordinamento. Il Controller, da mediatore, diventava il posto in cui l'app cercava di tenere insieme tutto.

![MVC: il Massive View Controller](/blog/infographic-mvc.png)

Da qui nasce il problema storico di UIKit: il **Massive View Controller**. MVVM, VIPER, Clean Architecture, Redux-like, Service–Store e TCA sono tutte risposte diverse alla stessa domanda:

> Come evitiamo che la complessità dell'app si accumuli in un unico oggetto?

Ce n'è però una seconda, spesso meno esplicita: **come arrivano le dipendenze alla business logic senza accoppiare tutta l'app?** Molte architetture sembrano pulite sulla carta ma diventano confuse quando bisogna decidere chi crea un Repository, chi possiede un Service, dove si configura un mock, e come si costruisce l'app per preview, test e produzione.

## MVVM: alleggerire il Controller, ma non abbastanza

MVVM sposta parte della logica del Controller dentro il ViewModel: la View dichiara cosa mostrare, il ViewModel prepara i dati, espone stato osservabile e gestisce loading, errori e mapping. Con SwiftUI questo modello sembra ancora più naturale, perché la UI è già una funzione dello stato.

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

Funziona bene su scala piccola. Il problema emerge quando l'app cresce: networking, validazione, retry, mapping errori, formattazione, analytics, navigazione, caching e sync finiscono tutti dentro il ViewModel. Il Massive View Controller diventa un **Massive ViewModel**.

![MVVM e il rischio del Massive ViewModel](/blog/infographic-mvvm.png)

C'è poi un problema meno visibile: MVVM non impone una strategia di **Dependency Injection**. Una feature usa initializer injection, un'altra `EnvironmentObject`, un'altra ancora chiama direttamente `APIClient.shared`. La DI diventa "all over the place" esattamente come lo state management. E la navigazione, che in SwiftUI è essa stessa stato, non ha un proprietario chiaro: View, ViewModel, Coordinator o Router?

MVVM, da solo, non risolve questi problemi: li sposta.

## VIPER: separare tutto in attori più piccoli

VIPER risponde in modo radicale dividendo una feature in **View, Interactor, Presenter, Entity, Router**. Il merito è che prende sul serio la separazione delle responsabilità e rende esplicito il grafo della feature in un Builder/Assembly. Il costo è alto: anche una schermata semplice richiede molti file, protocolli e passaggi.

Il rischio opposto rispetto a MVVM è chiaro: MVVM concentra troppo in pochi oggetti, VIPER distribuisce troppo in troppi.

## Clean Architecture in SwiftUI

Con SwiftUI la domanda cambia: non più "come alleggerisco il ViewController?", ma **come organizzo stato, side effects, business logic, navigazione e dipendenze in una UI dichiarativa?**

![Clean SwiftUI Architecture](/blog/infographic-clean.png)

L'approccio (vedi *clean-architecture-swiftui* di Alexey Naumov) sostituisce `View + ViewModel` con cinque ruoli: **View, AppState, Interactors, Repositories, DIContainer**. La View legge stato e invia intenti; l'Interactor esegue use case; il Repository astrae i dati; l'AppState contiene lo stato condiviso; il DIContainer compone il grafo.

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

La composizione vive in un unico punto — la **composition root**:

```swift
struct DIContainer {
    let appState: AppState
    let interactors: Interactors
    let repositories: Repositories
    let services: Services
}
```

Il DIContainer può avere varianti `live`, `preview`, `test`. Il rischio è che diventi un Service Locator: per evitarlo conviene iniettare dipendenze più specifiche per feature e usare `Environment` con disciplina. La regola sull'AppState è simile: stato locale alla View se serve solo lì, stato di feature se serve a una feature, AppState condiviso solo per ciò che è davvero globale.

## Closure-based Dependency Injection: tecnica, non architettura

Modellare le dipendenze come valori (idea resa popolare da Point-Free) è una **tecnica**, non un'architettura:

```swift
struct TripsRepository {
    var fetchTrips: () async throws -> [Trip]
}

extension TripsRepository {
    static let live = TripsRepository(fetchTrips: { try await apiClient.fetchTrips() })
    static let mock = TripsRepository(fetchTrips: { [.mock] })
    static let preview = TripsRepository(fetchTrips: { [.romeTrip, .tokyoTrip] })
}
```

Si applica dentro architetture diverse — MVVM, Clean, Service–Store, TCA — riducendo il boilerplate dei protocolli e rendendo banale sostituire implementazioni in test e preview.

## Service–Store: una variante pragmatica SwiftUI

Service–Store separa **Store** (stato osservabile), **Service** (operazioni e side effects) e **View** (rendering + intenti).

![Service–Store Architecture](/blog/infographic-service-store.png)

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
```

Il flusso è `View → Service → Store mutation → View`: un Redux-like *soft*, o un *TCA-inspired, but not TCA*. Non è meglio o peggio di Clean Architecture, è diversa: Clean dà la bussola concettuale, Service–Store la forma SwiftUI-native, Closure-based DI la tecnica di implementazione. Il rischio principale è che la leggerezza diventi disordine — un Service può facilmente trasformarsi in un nuovo Manager se non si tengono confini chiari.

## TCA: il flusso unidirezionale formalizzato

TCA è molto più specifica e si basa su **State, Action, Reducer, Effect, Store, Dependencies**.

![TCA: Unidirectional Flow](/blog/infographic-tca.png)

La View non chiama servizi: invia azioni. Il Reducer decide cosa cambia nello stato e quali Effect lanciare. Le dipendenze non sono una scelta lasciata alla feature, sono parte del sistema:

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

TCA è probabilmente l'architettura più rigorosa e completa nel mondo Swift moderno: utile con feature complesse, molti stati intermedi, side effects, cancellazione, debounce, deep link, team grandi e test deterministici. Il vantaggio è che rende tutto esplicito; lo svantaggio è che richiede di adottare l'intero modello. **Worth the step? Non necessariamente.** Si può ottenere gran parte dei suoi benefici con una soluzione più leggera: Clean come bussola, AppState/FeatureState, Interactors o Services, Repositories e closure-based dependencies.

## Conclusione

Tutti questi pattern provano a rispondere a tre domande: **dove vive lo stato, dove avvengono i side effects, dove vengono composte le dipendenze.** La qualità di un'architettura dipende da quanto sono chiare queste tre risposte. Se non sai dove vive lo stato, avrai bug difficili da tracciare; se non sai dove avvengono i side effects, avrai codice difficile da testare; se non sai dove sono composte le dipendenze, avrai coupling nascosto.

Il passaggio da MVVM/VIPER verso Clean Architecture ha senso perché sposta l'attenzione dalla singola schermata al flusso complessivo dell'app. Ma il passaggio successivo non è "dopo Clean arriva Closure-based DI": è più corretto dire che **Clean Architecture dà la bussola, Closure-based DI dà la tecnica, Service–Store dà la forma SwiftUI-native, TCA dà il riferimento più rigoroso**. La forma finale può essere sintetizzata così:

- **View** = rendering
- **State / Store** = verità osservabile
- **Interactor / Service** = intenzione e side effects
- **Repository** = accesso ai dati
- **Dependency system** = composizione

Il vero nemico non è MVC, MVVM o Clean Architecture. È sempre lo stesso: **complessità accumulata nel posto sbagliato**. E quella complessità non riguarda solo lo stato o la business logic — riguarda anche le dipendenze. Chi le crea, chi le possiede, chi può usarle, chi può sostituirle, e quanto è facile capire tutto questo leggendo il codice.
