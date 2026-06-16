---
title: VoltaSDK: one stable API for every AI model your iOS app can reach
date: 2026-06-16
excerpt: On-device first, cloud when it makes sense — VoltaSDK resolves which model to use per call at runtime, with privacy-aware fallback designed to grow into iOS 27.
tags: [iOS, AI, Swift, SDK]
---

_On-device first, cloud when it makes sense, free where it can be — and designed to grow into iOS 27 new model_

---

## Why I built this

WWDC made one thing obvious: the question for app developers is no longer _"should my app use AI?"_ but _"which model should answer **this** call, **right now**?"_

With Apple opening the Foundation Models stack — the on-device model, the new Foundation Model Utilities SDK, and the iOS 27 roadmap (Private Cloud Compute, multi-provider models, Dynamic Profiles) — an app suddenly has a _menu_ of models to choose from. On-device is free and private but small and not always available. A cloud key is powerful but costs money and leaves the device. Tomorrow there will be a free-but-quota-limited server tier, and user-account providers on top.

Picking between them is not a one-time setup decision. It changes **at runtime**: Apple Intelligence may be off, the device may be ineligible, a context window may overflow, a quota may run dry mid-conversation. Every app that touches AI ends up writing the same brittle `if/else` ladder to handle this — and gets the privacy implications subtly wrong.

So I built **VoltaSDK** to own exactly that one job, and nothing more: **resolving which model to use, per call, at runtime.**

## What it is (and what it deliberately is not)

**VOLTA** stands for _Versatile Orchestration Layer for Tiered AI_. This is also a reference to Alessandro Volta, who invented the battery — a **stack of cells** where, when one layer alone isn't enough, the stack still delivers the power. That is precisely what the framework is: a **fallback chain** across models, where the next layer takes over the moment the current one can't. I know it's a stretch but I love to find these connections 😭

It is **not** an agent framework. It owns no sessions, no conversations, no "agent" abstraction. Its single responsibility is **model resolution**: given availability, privacy policy, context window, and the developer's preference, hand back the concrete model that should answer — or walk the chain until one can.

That narrow scope is the whole point. Apple already gives you `LanguageModelSession` and (on iOS 27) Dynamic Profiles for _running_ AI.

## How resolution works

You configure the orchestrator once, at launch:

```swift
import VoltaSDK

AIOrchestrator.configure {
    $0.enableOnDevice = true
    // One slot, any vendor — auto-detected from the key format:
    $0.developerKey = Bundle.main.object(forInfoDictionaryKey: "AI_API_KEY") as? String
    $0.preference = .preferOnDevice            // on-device first, then the key
    $0.privacyDisclosure = .notify { downgrade in
        print("Answered by \(downgrade.provider) at \(downgrade.to)")
    }
}
```

Then you just ask for a response:

```swift
let answer = try await AIOrchestrator.active.respond(
    to: "Plan a weekend in Rome",
    instructions: "You are a concise travel expert."
)
```

Behind that single call, Volta builds an **ordered chain** of providers from your preference and walks it at runtime: it skips providers that are unavailable, runs a token pre-flight, applies the privacy gate, and falls through to the next provider on any _recoverable_ error. If on-device is present and healthy, it answers — privately, for free. If it isn't, the call flows to your configured key, and you're told about the privacy change.

If you'd rather resolve **without** executing — for example to feed a model into something else — that primitive is public too:

```swift
let provider = try await AIOrchestrator.active.resolveProvider()
```

## The design decisions that matter

A few principles shape everything, and they're worth calling out because they're what make the SDK safe to adopt today and safe to grow tomorrow.

### One vendor-agnostic key

There is a single `developerKey` slot. It accepts an **OpenAI, Anthropic (Claude), or Google (Gemini)** key, and the vendor is **auto-detected** from the key's format (`sk-ant-…` → Claude, `AIza…` → Gemini, `sk-…` → OpenAI). The model name travels _with_ the key, because a model string only means something to the vendor that issued it. Which vendor backs your app's AI is a business decision — the framework refuses to privilege one.

### Privacy is a first-class, disclosed event

Every provider has a privacy level: on-device is the most private, then Apple's cloud, then external providers. When a fallback would cross _below_ the privacy level of your chain's first provider — say a transient on-device failure that would re-send the user's prompt to OpenAI — Volta applies a **disclosure policy** you choose: stay silent, notify, ask the user, or refuse the downgrade entirely.

Crucially, content that Apple's on-device guardrails block is **never** auto-forwarded to a cloud provider. Privacy isn't an afterthought bolted on for iOS 27; it ships today.

### Stateless core, transcript-transparent conversations

Volta **never remembers** a conversation. Instead, every call _accepts_ the prior turns as input, owned and supplied by your app:

```swift
var history: [ChatTurn] = []
let first  = try await kit.respond(to: "Plan a weekend")
history += [.user("Plan a weekend"), .assistant(first)]
let second = try await kit.respond(to: "Change day 2", history: history)
```

This sounds like a limitation; it's actually the key insight. Because every call is **self-contained**, a provider can die mid-conversation — quota exhausted, rate-limited — and the _next_ provider in the chain picks up the exact same history and continues seamlessly. Conversation portability across providers falls out of the architecture for free, privacy disclosure included.

### Proactive token awareness

From iOS/macOS 26.4, Volta counts tokens exactly on-device and runs a **pre-flight**: if a call cannot fit a provider's context window, that provider is skipped _before_ paying for a doomed generation, and the chain falls over to one with more room. You can also ask how full the window is and decide when to trim:

```swift
if let usage = await kit.contextUsage(history: history), usage.fraction > 0.8 {
    // Your call: trim the oldest turns, or summarize them.
}
```

### The UI is optional by construction

The core has **zero** UI dependencies. You can build any interface you like on top of its public state. But if you want drop-in components, they live in a separate `VoltaSDKUI` product — take them or leave them.

## The reusable UI components

For teams that want a head start, `VoltaSDKUI` ships ready-made SwiftUI views. The centerpiece is **`ModelSelector`** — a user-facing picker that lets _your users_ choose which model to use.

![ModelSelector component demo](/blog/VoltaComponent.gif)

It's collapsed by default — a single row showing the active choice — and expands to the full list on tap, so it scales to a long provider list without growing its resting footprint. Options derive from the orchestrator's _real_ state: providers you didn't configure never appear, and unavailable ones show _why_.

The component carries one deliberate **safety invariant**: nothing is ever committed without passing through your `onSelection` handler — _including its own initial state_. With no prior choice, it auto-selects the on-device model **only** (the single provider with no business gate behind it: free, private, no account), and even that goes through your handler.

Cloud providers are **never** preselected, because a configuration preference must not masquerade as a user activation when a subscription — or, later, an OAuth login — sits behind it. Selection is a three-way conversation: `.activate` commits now, `.deny` refuses with a message, and `.deferred` hands control to _your_ flow (a paywall, a settings page) that commits later.

The library also ships `AIPlaygroundView` (a full conversational view with provenance and a context-pressure indicator), `ProviderStatusList` (the live fallback chain for a settings or debug screen), and public building blocks like `ModelSelectorRow` and `PrivacyLevelBadge` so you can recompose your own layout.

## Try it: the demo apps

The package ships a demo that mirrors a **real integration's two roles** — a _Developer_ side (configuration, privacy policy, a simulated subscription entitlement) and a _User_ side (the chat with the selector beneath it) — so you can see the result of any configuration × user-preference combination.

On macOS it's a split view; run it with a single command:

```bash
swift run VoltaSDKDemo
```

![The macOS demo — developer configuration on the left, the user chat and selector on the right.](/blog/macosVolta.png)

On iPhone and iPad the same UI adapts into tabs. Open `Examples/iOSDemo/iOSDemo.xcodeproj` and run it on a device or simulator. On a device with Apple Intelligence the on-device provider is real and answers carry an "On device" badge; on the simulator the list shows the unavailability reason and the developer-key fallback takes over — with the privacy downgrade surfaced.

![The iOS demo — the Developer tab and the User tab side by side, showing the chat and the model selector.](/blog/iosVolta.png)

## Available today

The full **iOS / macOS 26** base is shipping and open-source right now:

- **On-device + vendor-agnostic developer key**, automatic fallback, typed recoverable/terminal errors.
- **Privacy-downgrade disclosure** and **transcript-transparent** multi-turn conversations.
- **Token-aware pre-flight** and context-usage reporting (the 26.4 tier lights up on its own).
- The optional **SwiftUI components** and the **demo apps**.

A note for adopters: building requires **Xcode 26.4 or newer** (the 26.4 token-counting API is referenced behind a runtime gate), while the package _runs_ on iOS/macOS **26.0+**. It's versioned under a pre-1.0 policy — `1.0.0` is intentionally **reserved** for the complete feature set, including the iOS 27 work.

👉 https://github.com/deruloop/VoltaSDK — try it, run the demo, and open issues.

## The future: iOS 27

This is where it gets exciting, and where the whole design pays off.

On iOS 27, Apple opens the Foundation Models stack much further, and Volta's chain simply **grows**:

- **Private Cloud Compute (PCC)** — a large server model that integrates like on-device: **no API key, no account**, built into the OS, free for the developer with a per-user **daily quota**. The critical implication: that quota can run out _mid-use_, at runtime. This is the single best argument for automatic, runtime fallback rather than a static setup choice — and Volta is built around exactly that.
- **A public `LanguageModel` protocol** — making **multi-provider** real: Gemini, Claude, and OpenAI as **user-account** providers (the user pays, via OAuth or their own key), alongside the existing developer-key variants.
- **Dynamic Profiles** — Apple's own declarative, SwiftUI-style API for agents. Volta will _not_ wrap or replace it. Instead it **feeds** it: you write a native Dynamic Profile and drop in `.model(orchestrator.preferred(.reasoning))`, letting Volta resolve the concrete model at runtime while Apple owns the agent. The resolution primitive that exists today (`resolveProvider()`) is designed to become exactly that `preferred(_ need:)` bridge.

The emphasis is unmistakable: **privacy and powerful, free cloud compute.** PCC means an app can offer a server-class model with no key and no per-user billing, and with privacy guarantees close to on-device. Volta's job is to slot it into the chain — on-device → PCC → developer key → user account — and pick the right tier per call, disclosing every privacy crossing along the way.

And here's the promise that makes all of this safe to adopt **now**: it's **additive**. The public API doesn't change. iOS 27 capabilities arrive as whole new provider types that light up when the OS supports them and are silently absent when it doesn't. No rewrite on upgrade. One stable API across every phase.

## What's next

Beyond the iOS 27 work, the near-term roadmap includes **response streaming** (with a clear rule for when a mid-stream failure surfaces vs. falls through), **per-need fallback chains** (`.lightweight` / `.reasoning` / `.largeContext`), and **fetching model lists from the vendor APIs** so a developer picks from a real catalog instead of typing a model string.

I'll be sharing more as it lands. If a clean, privacy-aware resolution layer for Apple's AI stack is your kind of thing, **follow along** — and come build with it.

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
