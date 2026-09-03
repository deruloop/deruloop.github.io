---
title: Resolution Meets Orchestration: Handing a Model to a Dynamic Profile
date: 2026-09-03
excerpt: Handing resolved models to Apple's new Dynamic Profiles on iOS/macOS 27. Per-need resolution, warm-session reuse, one conversation driven two ways, and the unexplained orchestrator object in Apple's own sample.
tags: [AI, WWDC26, Foundation Models]
collection: WWDC 26
collectionSlug: wwdc-26
collectionOrder: 1
track: Foundation Models
trackDisplayTitle: Applying Foundation Models Sessions to a Real Production SDK
trackSlug: foundation-models
trackOrder: 1
lessonOrder: 3
---

*The third piece in the series, and the payoff of the second. Part 2 brought
outside models in through Apple's front door; this one hands them to the
framework's new agent system, Dynamic Profiles, and answers a question that
Apple's own sample app quietly leaves open. Written against the iOS/macOS 27
beta (Xcode 27, build 27A5237l), as a snapshot of the beta season, published
while it happens. Some details are beta behaviour; I'll update the piece as
the release approaches and re-verify everything at GA.*

The rule of this series stays the same. Take one WWDC session, actually build
what it teaches, and write down what surfaces. This one follows
[**Build agentic app experiences with the Foundation Models framework**](https://developer.apple.com/videos/play/wwdc2026/242/)
(WWDC 2026, session 242).

## What Apple announced

Dynamic Profiles are SwiftUI for agents. A `Profile` bundles instructions,
tools, and modifiers (`.model(...)`, `.temperature(...)`,
`.reasoningLevel(...)`); a `DynamicProfile`'s `body` is re-evaluated on every
prompt, so one session can swap hats between agents mid-conversation; and a
session is born from a profile, together with existing history, via
`LanguageModelSession(profile:history:)`. Around that core, the session
teaches history transforms, lifecycle hooks, orchestration patterns, and one
blunt performance rule. Appending to a transcript preserves the model's
internal cache and keeps time-to-first-token low, while rewriting history
invalidates it.

The session's demo app switches models per phase like this:

```swift
case .brainstorming:
    Profile { BrainstormFacilitator(…) }
        .model(orchestrator.pccLanguageModel)      // ← an "orchestrator"
case .reviewing:
    Profile { CraftCoach() }
        .model(orchestrator.systemLanguageModel)   // ← again
```

Apple's sample reads its models off an object it names **`orchestrator`**,
and never shows what is inside it. Where does `pccLanguageModel` come from?
What happens when PCC's daily quota is gone, when the device has no Apple
Intelligence, when the user brought a personal Gemini key? The framework
gives every profile a `.model(...)` slot and gives the developer nothing that
decides what goes in it. **Apple's demo assumes someone will build that
object. [VoltaSDK](https://github.com/deruloop/VoltaSDK) is that object.**

## What changed in VoltaSDK

All of it exists to fill that slot.

1. **`preferred(_ need:)`, the bridge.** The chain walk that already powers
   the SDK's own answers now has a second output, the winning provider as a
   native `any LanguageModel`, ready for `.model(...)`. Every built-in
   provider exposes one. On-device hands back `SystemLanguageModel.default`;
   PCC hands back its entitled model instance (nil-gated, so an unentitled
   process is skipped rather than trapped); a connected user account or a
   vendor package hands back itself; and the developer-key REST providers
   wrap themselves in the Part 2 conformance. Custom providers join by
   adopting one small protocol.
2. **Per-need resolution.** The optional need (`.lightweight`, `.reasoning`,
   `.largeContext`) reorders the chain for one call and never replaces it.
   `.lightweight` keeps everything local-first. `.reasoning` and
   `.largeContext` lead with the capable tiers, PCC and then external with
   larger known windows first, and keep on-device only as the final
   fallback. The token pre-flight still guards every window reactively, so
   ordering never sends a call somewhere it cannot fit.
3. **One conversation, two drivers.** The demo's chat gained a switch
   between "VoltaSDK chain" (the SDK drives, with fallback, privacy gates,
   and pre-flight) and "Dynamic Profile" (Apple drives a native profile,
   re-resolved each turn). The same conversation continues across the
   switch, because the app owns its history and a small public converter
   replays it into either engine. The same history and the same resolution
   flow through two consumption modes, and that single gesture carries the
   whole article.
4. **Warm-session reuse.** Session 242's performance rule, honoured by a
   stateless SDK. Each session-backed provider keeps its last session warm
   and reuses it only when the next call continues exactly the conversation
   the session has absorbed; then only the new prompt is processed, matching
   a natively held session. Any divergence rebuilds, and that is precisely
   what makes an app-side trim take effect (trimming history is a feature,
   and the model must actually forget what was trimmed). The cache verifies
   the continuation instead of assuming it.
5. **Privacy fallbacks are no longer invisible.** The disclosure policy's
   default moved from silent to logged, so every privacy-crossing fallback
   now writes a line to the unified log. This was self-criticism made code.
   A privacy-first SDK whose default let a journal entry silently reach a
   cloud vendor had the wrong default, and a log line reaches no end user
   and costs nothing.

One thing deliberately did not change. The agent half (tools, tool-calling
modes, the session's baton-pass and phone-a-friend orchestration patterns,
profile-scoped state) still belongs to the app, in Apple's API. VoltaSDK's
founding rule is that it does model resolution and nothing else, and session
242 is the session that finally shows why that restraint pays.

## How a model actually gets chosen

The resolution runs in two phases with very different characters.

**Phase 1, the reorder, is deterministic.** Given a configuration and a
need, the ranking is pure. Same inputs, same list, every time. With
on-device, PCC and a Gemini key configured, choosing `.reasoning` always
yields PCC → Gemini → on-device. The demo now shows this live; a line under
the need picker reads `Chain: private-cloud-compute → gemini → (on-device)`,
updating as the control changes, with parentheses marking whatever is
currently unavailable.

**Phase 2, the walk, is dynamic on everything at its disposal.** The list is
walked top to bottom, and each candidate faces the current instant. Is it
available right now (Apple Intelligence enabled, PCC's daily quota not yet
exhausted, a key present)? Does this exact call fit its window, with tokens
counted or estimated and the response reserve added? Does the privacy policy
allow the crossing? Only then is it tried. A recoverable failure before any
visible text moves the walk to the next candidate, while a failure after the
first fragment surfaces, because text a person has already read is never
silently retracted and re-answered by a different model.

So the same `.reasoning` call can land on PCC at 9 AM and on Gemini at 9 PM,
with nothing changed but a quota.

## Choosing a door

These changes leave the SDK with two ways to consume the same chain, and
the choice belongs to each feature rather than to the whole app.

| The feature | Use | Who drives | VoltaSDK contributes |
|---|---|---|---|
| a chat, a one-shot generation | `respond` / `streamDetailed` | VoltaSDK | everything, fallback, privacy, pre-flight, streaming |
| an agent with tools, hooks, personas | a native `DynamicProfile` + `.model(preferred(...))` | Apple | one expression, which model |

For plain chat, the SDK's driver is simply the better tool. A Dynamic
Profile adds nothing there (a profile is declarative sugar over the same
session the SDK already drives) and it would subtract the chain's mid-turn
protections. The profile door earns its keep the moment a feature wants what
profiles are for, tools, lifecycle hooks, composable personas.

Under Apple's driver the model is pinned for the session's life; there is no
mid-turn fallback, because the chain is not running the call. The pattern
that gets both worlds is to resolve once when a conversation starts, hold
the session (Apple keeps the state, and each turn processes only the new
prompt), and re-resolve only at real boundaries, a failure or a new
conversation, replaying the app-owned history into the fresh session. A
replay at a model switch is unavoidable; no API migrates a conversation's
internal memory between different models.

## What survives the vendors

Building this piece forced an uncomfortable audit. Handing models to Apple's
agent system raises the obvious question of how much of a resolution SDK
remains once everyone ships their own piece of it.

The vendor clients (the REST code, the SSE parsing, the executors from
Part 2) are scaffolding. Anthropic and Google will maintain better versions
of their own endpoints than any third party ever will, and the SDK's plug-in
point exists precisely to receive those official packages as they stabilise.
That code paid for itself as tuition, and it is written to be deleted.

The Apple-models tier (on-device, PCC, and the fallback between them) sits
one OS checkbox away from absorption. If a future release lets a session
fall back to Apple's cloud on its own, that provider pair shrinks to a thin
wrapper, and the SDK is built to shrug when it happens.

The arbitration layer has no other owner. Which credential pays, where the
data goes, what this device supports today, what the quota allows this hour,
what the user connected. Apple arbitrates only between Apple's models, and
no vendor will ever ship a fallback to a competitor, so the layer between
the parties stays structurally ownerless. Apple's own sample, with its
unexplained `orchestrator` object, reads like the framework admitting that
the layer has to come from somewhere. The full version of this audit
deserves its own piece after GA; the short version is that the object in
Apple's slide is the product.

## Problems encountered

- **The flagship syntax needs one extra line.** The dream was
  `.model(orchestrator.preferred(.reasoning))` inline in a profile's body.
  It cannot be written that way, because resolution is async (availability
  checks, quota reads) while a profile's modifiers are synchronous. The
  working pattern is resolve-then-declare,
  `let model = try await orchestrator.preferred(.reasoning)` first and the
  declarative part around the value. Since a profile's body is re-evaluated
  per prompt, an observable "current model" that the resolver keeps fresh
  fits Apple's design naturally.
- **The Swift 6 trap, third appearance.** The session initializer's
  `profile:` parameter is `sending`, meaning the profile must be
  transferable, but a profile declared inside a `@MainActor` view silently
  inherits the actor's isolation through its instructions closure and can
  never leave. The underlying lesson is the one the OAuth completion handler
  taught in Part 2, and so is the fix, building the profile in a
  `nonisolated` context. By the third encounter this deserves a name. Under
  Swift 6, any closure handed to a system framework was probably born with
  an isolation nobody chose.
- **Statefulness against a stateless SDK.** Apple's sessions remember; a
  resolution SDK that replays history every turn pays a growing
  time-to-first-token tax exactly where session 242 says not to (cache
  invalidation). The reuse rule above resolved the tension without giving up
  statelessness, and dictated its own boundaries. An errored or
  mid-stream-failed session never re-enters the cache, and concurrent calls
  can never share one.
- **A June design rule died in contact with a September doubt.** The
  original `.largeContext` design kept on-device first, on principle,
  because a hint must never cause a privacy crossing by itself. Building the
  per-need chains surfaced the counter-doubt. Is the small on-device model
  reliable enough for long-context work, even when the call technically fits
  its window? The doubt won. `.largeContext` now ranks on-device last, and
  the relaxation of the June rule is recorded as a deliberate amendment (the
  crossing lands on Apple's own cloud first, and the new logging default
  keeps any further crossing visible). It is worth being honest about what
  the amendment is, an unmeasured belief encoded as an ordering. More on
  that in a moment.

## Limits found

- **No mid-turn fallback under Apple's driver.** A profile's session holds
  one model; if it dies mid-conversation, Apple's machinery errors. The
  chain's silent step-down exists only while the SDK drives, which is the
  trade "Choosing a door" states plainly.
- **Needs are tier heuristics.** `.reasoning` ranks PCC above external above
  on-device because that is what the tiers are today. No per-model
  capability metadata sits behind the ordering, and the `.largeContext`
  amendment above shows the ordering already encodes untested assumptions.
- **The agent half is deliberately unimplemented,** as covered above. An app
  that needs baton-pass orchestration finds it taught natively in session
  242; VoltaSDK will only ever say which model each hat should wear.

## The session this implements

▶ [**Build agentic app experiences with the Foundation Models framework**](https://developer.apple.com/videos/play/wwdc2026/242/),
WWDC 2026, session 242. It is the place to start for profiles, modifiers,
and the orchestration patterns; this article is the field report of feeding
that system its models.

## Next

The next article, [How Good Is Good Enough? Evaluating a Model You Can't Unit-Test](/articles) *(coming soon)*, turns this piece's unmeasured
beliefs into numbers with Apple's new Evaluations framework, starting with
whether quality holds when the chain switches providers and whether
on-device really is the wrong model for long context. Also on the list are
re-verifying every beta-derived claim at GA and re-attaching the parked
vendor package once a matching release lands.

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;
