---
title: From MVC/MVVM to Clean SwiftUI Architecture
date: 2026-05-06
excerpt: Evoluzione pragmatica dell'architettura iOS tra ViewModel, Dependency Injection, Interactors, AppState, Service–Store e TCA.
tags: [iOS, SwiftUI, Architecture]
---

# From MVC/MVVM to Clean SwiftUI Architecture

Evoluzione pragmatica dell'architettura iOS tra ViewModel, Dependency Injection, Interactors, AppState, Service–Store e TCA.

![Evoluzione delle architetture iOS](/blog/infographic-map.png)

Per anni, quando si parlava di architettura iOS, il punto di partenza quasi obbligato era MVC.

Oggi però MVC può essere letto più come il prototipo primordiale dell'architettura applicativa mobile che come una soluzione davvero sufficiente per applicazioni moderne. L'idea originale era semplice: il Model rappresenta i dati, la View li mostra, il Controller media tra i due.

Il problema è che, nelle app reali, il ruolo del Controller è sempre stato molto più complesso. Dentro un `UIViewController` finivano facilmente navigazione, business logic, chiamate di rete, validazioni, formattazione, stato della schermata, gestione degli errori, persistenza, analytics e coordinamento tra più schermate.

In teoria il Controller era un mediatore. In pratica diventava il posto dove l'app cercava di tenere insieme tutto.

![MVC: il Massive View Controller](/blog/infographic-mvc.png)

Da qui nasce il problema storico del mondo UIKit: il **Massive View Controller**.

Il punto non è che MVC sia sbagliato in assoluto. Il punto è che il ruolo assegnato al Controller è troppo ampio per essere sostenibile in applicazioni complesse.

Da questa frattura nascono molti dei pattern successivi: MVVM, VIPER, Clean Swift, Clean Architecture, Redux-like architectures, Service–Store Architecture e TCA sono tutte risposte diverse alla stessa domanda:

> Come evitiamo che la complessità dell'app si accumuli in un unico oggetto?

Ma c'è anche una seconda domanda, spesso meno esplicita e altrettanto importante:

> Come facciamo arrivare le dipendenze alla business logic senza accoppiare tutta l'app?

Questo secondo punto è fondamentale, perché molte architetture sembrano pulite sulla carta, ma diventano confuse nel momento in cui bisogna decidere chi crea un Repository, chi possiede un Service, chi può usare un APIClient, dove viene configurato un mock, e come si costruisce l'app per preview, test e produzione.

L'evoluzione architetturale non riguarda solo il posto in cui mettiamo lo stato o la business logic. Riguarda anche come componiamo le dipendenze.

## MVVM: alleggerire il Controller spostando la logica verso la View

MVVM nasce come risposta diretta al Massive View Controller. L'idea è spostare parte della logica del Controller dentro un nuovo attore: il ViewModel.

Il ViewModel non è esattamente un sostituto del Controller. È più corretto considerarlo una specializzazione orientata alla View. Il suo obiettivo è rendere la View il più possibile "dumb", cioè priva di logiche complesse.

La View dichiara cosa mostrare. Il ViewModel prepara i dati, espone stato osservabile, gestisce loading, errori, validazioni, mapping dei dati e aggiornamenti dinamici.

Con UIKit questo era molto utile, perché permetteva di alleggerire i `UIViewController`. Con SwiftUI il discorso cambia, ma non scompare.

SwiftUI elimina il ViewController tradizionale e introduce una UI dichiarativa. La View diventa sostanzialmente una funzione dello stato:

```
UI = f(state)
```

Questo rende MVVM apparentemente ancora più naturale. La View osserva un oggetto, il ViewModel aggiorna lo stato, la UI si ridisegna.

```swift
final class TripListViewModel: ObservableObject {
    @Published var trips: [Trip] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    private let tripsRepository: TripsRepository
    init(tripsRepository: TripsRepository) {
        self.tripsRepository = tripsRepository
    }
    func loadTrips() async {
        isLoading = true
        defer { isLoading = false }
        do {
            trips = try await tripsRepository.fetchTrips()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

La View resta leggera:

```swift
struct TripListView: View {
    @StateObject private var viewModel: TripListViewModel
    init(viewModel: TripListViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }
    var body: some View {
        List(viewModel.trips) { trip in
            Text(trip.name)
        }
        .task {
            await viewModel.loadTrips()
        }
    }
}
```

Questa soluzione è semplice, leggibile e funziona bene in molti casi. Il problema emerge quando l'app cresce.

## Il ViewModel come nuovo God Object

MVVM nasce per risolvere il Massive View Controller, ma nella pratica rischia di produrre un nuovo problema: il **Massive ViewModel**.

![MVVM e il rischio del Massive ViewModel](/blog/infographic-mvvm.png)

All'inizio il ViewModel contiene solo lo stato visuale:

```swift
@Published var isLoading = false
@Published var items: [Item] = []
@Published var error: Error?
```

Poi però arrivano nuove responsabilità: networking, validazione, retry, mapping degli errori, formattazione, analytics, navigazione, feature flags, caching, persistenza, sincronizzazione.

A quel punto la separazione diventa:

- **View** = sottile
- **ViewModel** = tutto il resto

Questo non è necessariamente un buon risultato. Abbiamo tolto peso alla View, ma lo abbiamo concentrato in un altro punto.

Il ViewModel, più che sostituire davvero il Controller, spesso ne diventa una complicazione orientata alla View. È un dettaglio architetturale utile, ma non necessariamente una soluzione completa.

La domanda diventa quindi: **se il ViewModel si occupa dello stato della View, chi si occupa del resto?**

Di solito la risposta è: altri oggetti. Coordinator per la navigazione. Manager per servizi generici. Repository per i dati. SessionManager per la sessione. NetworkManager per il networking. LoggerManager per il logging. StateManager per lo stato condiviso.

Il rischio è che l'architettura diventi una costellazione di oggetti con responsabilità poco chiare.

## Il problema nascosto di MVVM: Dependency Injection e composition root

MVVM viene spesso presentato come una soluzione al Massive View Controller, ma raramente viene discusso con sufficiente attenzione il modo in cui le dipendenze arrivano al ViewModel.

Questo è un punto centrale, perché il ViewModel è realmente testabile solo se le sue dipendenze sono esplicite e sostituibili.

MVVM, di per sé, dice solo:

```
View → ViewModel → Model / Services
```

Ma non specifica come il ViewModel riceve i Services, chi crea il ViewModel, chi crea i Repository, come si sostituiscono le dipendenze nei test, come si sostituiscono nelle preview SwiftUI, come si evita che il ViewModel dipenda da singleton globali, dove si trova la composition root dell'app.

Questo è il problema principale.

MVVM non ha un problema intrinseco con la Dependency Injection. Un MVVM ben fatto può usare initializer injection, protocolli, closure-based dependencies, factory o environment injection.

Il problema è che MVVM non impone una strategia.

Questa libertà è comoda all'inizio, ma in app grandi può produrre incoerenza: una feature usa initializer injection, una usa singleton, una usa `EnvironmentObject`, una crea il repository direttamente dentro il ViewModel, una usa una factory, una passa tutto da Coordinator.

Alla fine la dependency injection diventa "all over the place", esattamente come lo state management.

## MVVM con singleton: semplice, ma accoppiato

La versione più comune nelle app cresciute velocemente è questa:

```swift
final class TripListViewModel: ObservableObject {
    @Published var trips: [Trip] = []
    func loadTrips() async {
        do {
            trips = try await TripManager.shared.fetchTrips()
        } catch {
            // handle error
        }
    }
}
```

Oppure:

```swift
final class PackingListViewModel: ObservableObject {
    private let apiClient = APIClient.shared
    private let database = DatabaseManager.shared
    private let analytics = AnalyticsManager.shared
}
```

Qui il ViewModel non riceve davvero le dipendenze. Se le prende.

Il codice sembra semplice, ma il ViewModel è fortemente accoppiato all'infrastruttura dell'app.

Nei test diventa più difficile sostituire `TripManager`, `APIClient`, `DatabaseManager` o `AnalyticsManager`. Devi mockare singleton, resettare stato globale, fare override statici, sperare che altri test non abbiano modificato la stessa istanza.

Il problema non è MVVM in sé. Il problema è MVVM senza dependency injection esplicita.

## MVVM con initializer injection: più pulito, ma verboso in SwiftUI

Una versione migliore è usare initializer injection.

```swift
final class PackingListViewModel: ObservableObject {
    private let neededItemRepository: NeededItemRepository
    private let analyticsService: AnalyticsService
    private let syncService: SyncService
    @Published var items: [NeededItem] = []
    @Published var loadingState: LoadingState = .idle
    init(
        neededItemRepository: NeededItemRepository,
        analyticsService: AnalyticsService,
        syncService: SyncService
    ) {
        self.neededItemRepository = neededItemRepository
        self.analyticsService = analyticsService
        self.syncService = syncService
    }
    func loadItems() async {
        loadingState = .loading
        do {
            items = try await neededItemRepository.fetchItems()
            loadingState = .loaded
        } catch {
            loadingState = .failed(error)
        }
    }
}
```

Qui le dipendenze sono esplicite. Il test diventa molto più semplice:

```swift
let viewModel = PackingListViewModel(
    neededItemRepository: .mock,
    analyticsService: .noop,
    syncService: .mock
)
```

Però in SwiftUI nasce un altro problema pratico: **chi crea il ViewModel?**

Se lo crea la View, la View deve conoscere il grafo delle dipendenze live. Se lo passi dall'esterno, può diventare scomodo con navigation destinations, sheet, preview, deep link e gerarchie complesse.

MVVM con initializer injection è testabile, ma richiede una composition root chiara. Se quella composition root non viene progettata, la costruzione dei ViewModel finisce sparsa tra View, Coordinator, factory e container globali.

## Navigazione: il vuoto lasciato da MVVM

MVVM non definisce in modo chiaro neanche chi debba possedere la navigazione.

In UIKit spesso si introduceva il Coordinator. In SwiftUI, però, la navigazione è essa stessa stato:

```swift
@State private var path: [Route] = []
@State private var selectedTrip: Trip?
@State private var isShowingDetail = false
```

La navigazione deve stare nella View? Nel ViewModel? In un Coordinator? In un AppState globale? In un Router?

Molte implementazioni MVVM finiscono per mettere proprietà come queste nel ViewModel:

```swift
@Published var selectedTrip: Trip?
@Published var isShowingTripDetail = false
@Published var navigationPath: [Route] = []
```

Ma in questo modo il ViewModel diventa accoppiato alla navigazione SwiftUI. MVVM, da solo, non risolve il problema della navigazione: lo sposta.

## VIPER: separare tutto in attori più piccoli

VIPER è una risposta più radicale al problema. Invece di avere View + ViewModel, VIPER divide una feature in più attori: **View, Interactor, Presenter, Entity, Router**.

La View mostra i dati e riceve input. L'Interactor contiene business logic. Il Presenter prepara i dati per la View. L'Entity rappresenta il modello. Il Router gestisce la navigazione.

VIPER ha un merito importante: prende sul serio la separazione delle responsabilità. Anche dal punto di vista della Dependency Injection, VIPER tende a rendere più esplicito il grafo della feature.

```swift
enum PackingListModuleBuilder {
    static func build(
        neededItemRepository: NeededItemRepository,
        analyticsService: AnalyticsService
    ) -> some View {
        let interactor = PackingListInteractor(
            neededItemRepository: neededItemRepository
        )
        let router = PackingListRouter()
        let presenter = PackingListPresenter(
            interactor: interactor,
            router: router,
            analyticsService: analyticsService
        )
        return PackingListView(presenter: presenter)
    }
}
```

Il vantaggio è che la composizione della feature è esplicita. Il costo però è alto: anche una schermata semplice può richiedere molti file, protocolli e passaggi intermedi.

Il rischio opposto rispetto a MVVM è questo:

- MVVM rischia di mettere troppo in pochi oggetti.
- VIPER rischia di distribuire troppo in troppi oggetti.

## Clean Architecture in SwiftUI: cambiare prospettiva

Con SwiftUI la domanda cambia. Non dobbiamo più chiederci soltanto "come alleggerisco il ViewController?", ma: **come organizzo stato, side effects, business logic, navigazione e dipendenze in una UI dichiarativa?**

![Clean SwiftUI Architecture](/blog/infographic-clean.png)

Il progetto *clean-architecture-swiftui* di Alexey Naumov propone una struttura basata su SwiftUI Views, AppState, Interactors e Repositories. Gli Interactors incapsulano la business logic e, insieme ad AppState, formano il Business Logic layer indipendente dalla presentazione e dalle risorse esterne.

La direzione non è più `View + ViewModel`, ma:

- View
- AppState
- Interactors
- Repositories
- DIContainer

Il flusso diventa:

```
View → Interactor → Repository / Service → AppState → View
```

La View non dipende da un ViewModel che contiene tutto. La View legge stato e invia intenti. L'Interactor esegue operazioni. Il Repository astrae l'accesso ai dati. L'AppState contiene lo stato condiviso. Il DIContainer compone il grafo delle dipendenze.

## Dependency Injection in Clean Architecture

In Clean Architecture, la Dependency Injection non è un dettaglio secondario. È parte della struttura. La regola importante è che le dipendenze devono seguire una direzione chiara:

```
View → Interactor → Repository / Service → API / DB / SDK
```

La View non dovrebbe conoscere direttamente l'API client, il database o l'analytics service.

```swift
struct TripListView: View {
    @Environment(\.appState) private var appState
    @Environment(\.interactors) private var interactors
    var body: some View {
        List(appState.trips.items) { trip in
            Text(trip.name)
        }
        .task {
            await interactors.trips.loadTrips()
        }
    }
}
```

L'Interactor riceve le dipendenze basse:

```swift
struct TripsInteractor {
    let appState: AppState
    let tripsRepository: TripsRepository
    let analyticsService: AnalyticsService
    func loadTrips() async {
        appState.trips.loadingState = .loading
        do {
            let trips = try await tripsRepository.fetchTrips()
            appState.trips.items = trips
            appState.trips.loadingState = .loaded
            analyticsService.track(.tripsLoaded)
        } catch {
            appState.trips.loadingState = .failed(error)
        }
    }
}
```

La composizione avviene in un punto più alto:

```swift
struct DIContainer {
    let appState: AppState
    let interactors: Interactors
    let repositories: Repositories
    let services: Services
}
```

Questa è la composition root. Il DIContainer può avere varianti `live`, `preview`, `test`. Il rischio, però, è che il DIContainer diventi un Service Locator. Per evitarlo, è meglio iniettare dipendenze più specifiche per feature, e usare `Environment` con disciplina.

## AppState: una fonte di verità, non un bidone globale

L'AppState serve a modellare lo stato condiviso dell'app.

```swift
struct AppState {
    var auth = AuthState()
    var routing = RoutingState()
    var trips = TripsState()
    var packing = PackingState()
}
```

Il rischio però è reale: AppState può diventare un monolite. Per questo lo stato va diviso per feature.

Una buona regola pratica è:

- Se lo stato serve solo a una View, resta nella View.
- Se lo stato serve a una feature, vive nello stato della feature.
- Se lo stato serve a più feature, vive nell'AppState condiviso.

## Interactors: use case, non ViewModel mascherati

L'Interactor è l'attore che riceve un'intenzione e coordina il lavoro: `loadTrips()`, `createTrip()`, `addItemToPackingList()`, `login()`, `syncData()`.

Un Interactor dovrebbe ricevere intenti dalla View, coordinare Repository o Services, gestire loading/error/success, aggiornare AppState o FeatureState. Non dovrebbe contenere codice UI né conoscere dettagli della View.

```swift
struct PackingInteractor {
    let appState: AppState
    let neededItemRepository: NeededItemRepository
    let analyticsService: AnalyticsService
    let syncService: SyncService
    func markAsPacked(_ itemID: NeededItem.ID) async {
        do {
            try await neededItemRepository.markAsPacked(itemID)
            appState.packing.markAsPacked(itemID)
            analyticsService.track(.itemPacked)
            await syncService.scheduleSync()
        } catch {
            appState.packing.loadingState = .failed(error)
        }
    }
}
```

La divisione sana è: **Interactor** = use case / orchestration, **Repository** = accesso dati, **Service** = integrazione con sistemi esterni, **AppState / FeatureState** = stato osservabile.

## Repositories e Services: isolare i sistemi esterni

La View non dovrebbe parlare direttamente con API client, database, SDK o framework esterni.

```swift
struct TripsRepository {
    var fetchTrips: () async throws -> [Trip]
    var saveTrip: (Trip) async throws -> Void
    var deleteTrip: (Trip.ID) async throws -> Void
}

struct AnalyticsService {
    var track: (AnalyticsEvent) -> Void
}
```

Questa separazione permette di sostituire facilmente implementazioni reali, mock, preview o test. Ed è qui che entra in gioco la closure-based dependency injection.

## Closure-based Dependency Injection: tecnica, non architettura

La closure-based dependency injection non è un'architettura completa. È una tecnica per modellare le dipendenze come valori.

```swift
struct TripsRepository {
    var fetchTrips: () async throws -> [Trip]
}

extension TripsRepository {
    static let live = TripsRepository(
        fetchTrips: { try await apiClient.fetchTrips() }
    )
    static let mock = TripsRepository(
        fetchTrips: { [.mock] }
    )
    static let preview = TripsRepository(
        fetchTrips: { [.romeTrip, .tokyoTrip] }
    )
    static let unimplemented = TripsRepository(
        fetchTrips: { fatalError("unimplemented") }
    )
}
```

Questo approccio è molto vicino alla famiglia di idee resa popolare da Point-Free: dependency as value, implementazioni live/test/preview e sostituzione controllata delle dipendenze.

Questa tecnica può essere usata dentro architetture diverse: MVVM, Clean Architecture, Service–Store, TCA. Quindi non bisogna dire "Closure-based DI sostituisce Clean Architecture", ma piuttosto "Closure-based DI può implementare alcune dipendenze dentro una Clean Architecture".

## Service–Store Architecture: una variante pragmatica SwiftUI

Service–Store Architecture è più vicina a un pattern architetturale. L'idea è separare:

- **Store** = stato osservabile
- **Service** = operazioni / side effects
- **View** = rendering + intenti

![Service–Store Architecture](/blog/infographic-service-store.png)

```swift
@MainActor
@Observable
final class PackingStore {
    var items: [NeededItem] = []
    var loadingState: LoadingState = .idle
}

struct PackingService {
    var loadItems: () async -> Void
    var markAsPacked: (NeededItem.ID) async -> Void
}
```

La View osserva lo Store:

```swift
struct PackingListView: View {
    @Environment(PackingStore.self) private var store
    @Environment(\.packingService) private var service
    var body: some View {
        List(store.items) { item in
            Text(item.name)
        }
        .task {
            await service.loadItems()
        }
    }
}
```

Il flusso è:

```
View → Service → Store mutation → View
```

Questo assomiglia a un flusso Redux-like, ma in forma morbida. Per questo la definirei *Redux-like soft*, oppure *TCA-inspired, but not TCA*.

## Service–Store è meglio o peggio di Clean Architecture?

Non è meglio o peggio in assoluto. È diversa.

- **Clean Architecture** = bussola concettuale generale.
- **Service–Store** = pattern pragmatico SwiftUI.
- **Closure-based DI** = tecnica di implementazione.

Un approccio ibrido sensato: Clean Architecture per decidere i confini, Service–Store per modellare feature SwiftUI, Closure-based DI per ridurre boilerplate.

Il rischio principale di Service–Store è che la leggerezza diventi disordine: un Service può facilmente diventare un nuovo Manager. Per evitarlo, servono confini chiari.

## TCA: il flusso unidirezionale formalizzato

Il closure-based approach è molto vicino alla filosofia Point-Free, ma TCA è molto più specifica. TCA si basa su: **State, Action, Reducer, Effect, Store, Dependencies**.

![TCA: Unidirectional Flow](/blog/infographic-tca.png)

Il flusso è:

```
View sends Action
→ Reducer handles Action
→ Reducer mutates State
→ Reducer returns Effect
→ Effect may send another Action
→ View re-renders
```

In TCA non chiami semplicemente `await service.loadTrips()`, ma invii un'azione:

```swift
store.send(.loadTripsButtonTapped)
```

Poi il reducer decide cosa succede:

```swift
case .loadTripsButtonTapped:
    state.loadingState = .loading
    return .run { send in
        let trips = try await tripsClient.fetchTrips()
        await send(.tripsLoaded(trips))
    }
```

## Dependency Injection in TCA

TCA integra la Dependency Injection direttamente nel suo modello. La View non riceve repository, analytics o API client: invia azioni. Il Reducer legge le dipendenze.

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
                    await send(.itemsLoaded(Result {
                        try await repository.fetchItems()
                    }))
                }
            case let .itemsLoaded(.success(items)):
                state.items = items
                state.loadingState = .loaded
                return .none
            case let .markAsPacked(id):
                return .run { _ in
                    try await repository.markAsPacked(id)
                    analytics.track(.itemPacked)
                }
            case .itemsLoaded(.failure):
                state.loadingState = .failed
                return .none
            }
        }
    }
}
```

Qui la DI non è una decisione lasciata a ogni feature: è parte del sistema. Lo svantaggio è che devi adottare tutto il modello TCA.

## TCA: worth the step?

TCA è probabilmente una delle architetture più rigorose e complete nel mondo Swift moderno. È molto utile quando hai feature complesse, molti stati intermedi, molti side effects, cancellazione di task, debounce, retry, deep link, coordinamento parent-child, team grandi, test deterministici.

Il grande vantaggio è che TCA rende tutto esplicito. Il grande svantaggio è che richiede di accettare il suo modello.

Nel mio caso, per il momento, la risposta potrebbe essere: **TCA is worth the step? Non necessariamente.** Non perché TCA sia sbagliata, ma perché si può ottenere una buona parte dei suoi benefici con una soluzione più leggera: Clean Architecture come bussola, AppState/FeatureState, Interactors o Services, Repositories, closure-based dependencies, Store osservabili dove servono.

## Il punto centrale: stato, side effects e dipendenze

Alla fine, tutti questi pattern cercano di rispondere a tre domande.

**1. Dove vive lo stato?**

In MVVM vive spesso nel ViewModel. In Clean Architecture può vivere in AppState o FeatureState. In Service–Store vive nello Store. In TCA vive nello State del Reducer.

**2. Dove avvengono i side effects?**

In MVVM spesso nel ViewModel. In Clean Architecture negli Interactors o nei Services. In Service–Store nei Services. In TCA negli Effects.

**3. Dove vengono composte le dipendenze?**

In MVVM spesso non c'è una risposta canonica. In VIPER vengono composte in un Builder o Assembly. In Clean Architecture vengono composte nel DIContainer. In Service–Store vengono spesso costruite come closure-based services e iniettate via Environment. In TCA vengono gestite dal sistema di Dependencies.

La qualità di un'architettura dipende molto da quanto queste tre risposte sono chiare. Se non sai dove vive lo stato, avrai bug difficili da tracciare. Se non sai dove avvengono i side effects, avrai codice difficile da testare. Se non sai dove sono composte le dipendenze, avrai coupling nascosto.

## Conclusione

Una buona architettura non è quella con più nomi. È quella che rende più facile capire cosa è successo, chi ha cambiato lo stato, dove vive la logica, quale dipendenza viene usata, chi l'ha creata, come sostituirla in test e preview.

Per questo il passaggio da MVVM/VIPER verso Clean Architecture ha senso: sposta l'attenzione dalla singola schermata al flusso complessivo dell'app. Ma il passaggio successivo non va raccontato come "dopo Clean Architecture arriva Closure-based DI". È più corretto dire:

- **Clean Architecture** mi dà la bussola.
- **Closure-based DI** mi dà una tecnica più leggera.
- **Service–Store** mi dà una forma SwiftUI-native e pragmatica.
- **TCA** mi dà il riferimento più rigoroso, ma non sempre necessario.

In SwiftUI, questa distinzione è fondamentale. La View è già dichiarativa. Lo stato è già centrale. La UI è già una conseguenza dei dati. L'architettura dovrebbe rispettare questa natura, non combatterla.

La forma finale potrebbe essere sintetizzata così:

- **View** = rendering
- **State / Store** = verità osservabile
- **Interactor / Service** = intenzione e side effects
- **Repository** = accesso ai dati
- **Dependency system** = composizione

Il punto non è eliminare MVVM, VIPER o TCA dalla discussione. Il punto è capire cosa ognuno di questi approcci sta cercando di risolvere. Perché il vero nemico non è MVC, MVVM o Clean Architecture. Il vero nemico è sempre lo stesso: **complessità accumulata nel posto sbagliato**.

E spesso quella complessità non riguarda solo lo stato o la business logic. Riguarda anche le dipendenze. Chi le crea. Chi le possiede. Chi può usarle. Chi può sostituirle. E quanto è facile capire tutto questo leggendo il codice.
