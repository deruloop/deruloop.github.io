---
title: Private Cloud Compute: What You Need, and What Will Trip You Up
date: 2026-06-30
excerpt: A practical look at adding Apple's free, server-hosted model on iOS/macOS 27, with the setup, entitlement gotcha, and quota handling details the session leaves out.
tags: [AI, WWDC26, Foundation Models]
collection: WWDC 26
collectionSlug: wwdc-26
collectionOrder: 1
track: Foundation Models
trackDisplayTitle: Applying Foundation Models Sessions to a Real Production SDK
trackSlug: foundation-models
trackOrder: 1
lessonOrder: 1
---

_A practical look at adding Apple's free, server-hosted model to an app on iOS/macOS 27: what you have to set up, the one gotcha that can crash your app, and how to handle quotas before they handle you. Against the iOS/macOS 27 beta (Xcode 27, build 27A5209h) - some details are beta behaviour and may change by GA._

This is the first piece in a series with one rule: take a single WWDC session on the Foundation Models framework, actually try to build what it teaches, and share the practical notes that tend to surface only once you do. This one follows [WWDC 2026, session 319](https://developer.apple.com/videos/play/wwdc2026/319/). The API really is as approachable as the session shows - most of what I'll add is the surrounding detail (entitlements, signing, quotas) that a focused talk understandably leaves out.

## What Private Cloud Compute gives you

On iOS/macOS 27, the Foundation Models framework gains a second built-in model alongside the on-device one: **Private Cloud Compute (PCC)**, a large model that runs in Apple's privacy-preserving cloud. It integrates exactly like the on-device model - no API key, no account, no third-party SDK - but it's bigger and more capable, with a ~32K context window and reasoning support, where the on-device model sits around 4-8K and no reasoning. The trade-offs are the obvious ones: PCC needs a network connection, and it's subject to a per-user **daily quota** (higher with iCloud+). For developers in the App Store Small Business Program it's **free** - no per-token cloud cost.

Using it is genuinely a one-line change from the on-device model:

```swift
// On-device
let session = LanguageModelSession()

// Private Cloud Compute
let session = LanguageModelSession(model: PrivateCloudComputeLanguageModel())
```

Structured output (`Generable`), tool calling, and reasoning levels work the same way across both, so most of your generation code doesn't care which model answered. That symmetry is the appeal - and it's also what makes the non-obvious parts surprising, because they're the places where PCC is *not* just a bigger on-device model.

## What you actually need to set up

PCC is free, but it isn't automatic. Three things gate it, and only the first is something your *users* deal with:

1. **An Apple-Intelligence-capable device with Apple Intelligence enabled.**
   This is the user's side, and it's the same prerequisite as the on-device model. Nothing for you to do beyond checking availability at runtime.
2. **The App Store Small Business Program**, with fewer than **2 million**
   first-time App Store downloads across your account's apps. This is the eligibility bar for the free tier.
3. **The `com.apple.developer.private-cloud-compute` entitlement**, which Apple
   assigns to *your developer account*. You request it at
   [Apple's PCC request page](https://developer.apple.com/contact/request/private-cloud-compute/).

That third point is the one to internalize: **the entitlement is yours, the developer's - not your users'.** It lives in your signed app. Your users never request anything; they just need Apple Intelligence on.

### Registering the capability and re-provisioning

Once Apple has assigned PCC to your team, the entitlement still has to make it into a *signed build*, and it's a restricted capability - you can't just paste the key into an `.entitlements` file and expect it to sign. With **automatic signing**, the path is: in Xcode, select your target -> **Signing & Capabilities**, make sure the **Team** is the one Apple granted PCC to, click **+ Capability**, and add **Private Cloud Compute**. Xcode writes the entitlement, enables the capability on the App ID, and regenerates the provisioning profile. With **manual signing or CI**, do it by hand at *Certificates, Identifiers & Profiles*: enable the capability on the App ID, regenerate and install the provisioning profile, then add the entitlement and point `CODE_SIGN_ENTITLEMENTS` at it.

If signing fails with *"provisioning profile doesn't support the Private Cloud Compute capability,"* the grant simply hasn't propagated to that App ID yet - let Xcode retry, or regenerate the profile manually.

One practical consequence worth stating plainly: because the entitlement only lives in a properly signed app, **you cannot exercise PCC from an unsigned binary** - a command-line `swift run`, a bare SwiftPM executable, or anything without a provisioning profile. To test PCC you need a real, signed app target (running on device, a Mac, or via TestFlight/ad-hoc). Test installs don't count toward the 2M-download limit, so trying it before you ship is free.

## The gotcha that can crash your app

This is the part I'd most want to flag, because the failure mode is abrupt and easy to walk into.

You'd reasonably write this:

```swift
let model = PrivateCloudComputeLanguageModel()
if model.isAvailable {
    let session = LanguageModelSession(model: model)
    let reply = try await session.respond(to: prompt)   // 💥
}
```

On a capable device this looks safe - `isAvailable` returns `true`, the quota reads fine, everything says go. But if your app is **not** signed with the PCC entitlement, that `respond` call doesn't throw - it **traps**:

```text
Fatal error: Process is missing required entitlement:
com.apple.developer.private-cloud-compute
```

Two things make this dangerous. First, it's a *fatal error*, not a Swift error - no `do/catch` will save you; the process is gone. Second, **`isAvailable` and `availability` are not entitlement-aware** - they report the *device's* ability to reach PCC, not your *app's* permission to call it. So the obvious guard doesn't protect you, and an app that ships PCC without the entitlement (or with a build configuration that drops it) crashes the first time it tries.

The fix is to check your *own* app's entitlements before you ever make the call. The Security framework lets a process inspect what it was signed with:

```swift
import Security

func hasPCCEntitlement() -> Bool {
    guard let task = SecTaskCreateFromSelf(nil) else { return false }
    let value = SecTaskCopyValueForEntitlement(
        task, "com.apple.developer.private-cloud-compute" as CFString, nil
    )
    return (value as? Bool) ?? (value != nil)
}
```

Gate PCC on that, and a missing entitlement becomes a graceful "PCC unavailable, use something else" instead of a crash. This matters most if you treat PCC as an *opt-in* tier that's on by default for entitled builds: the same code then ships safely to apps that never requested the entitlement, because it quietly skips PCC instead of taking the app down with it.

## Quotas: handle them before *and* during

The pleasant surprise of PCC is that the daily quota is **readable up front**, not just discoverable as an error after a wasted request. Before you call, you can check where the user stands:

```swift
let usage = model.quotaUsage
if usage.isLimitReached {
    // Out for today - usage.resetDate tells you when it returns.
} else if case .belowLimit(let info) = usage.status, info.isApproachingLimit {
    // Still works, but warn the user they're nearing the limit.
}
```

Apple's guidance - and good sense - is to surface limit state as *persistent UI*, not a modal alert, since it's a standing condition rather than a one-off error.

You still need to handle the quota running out **mid-use**, because it can. When it does, PCC throws a distinct error you can tell apart from a transient outage: `PrivateCloudComputeLanguageModel.Error` distinguishes `.quotaLimitReached` (with a `resetDate`) from `.serviceUnavailable` and `.networkFailure`. That distinction is what lets you do the right thing in each case: on a quota hit, fall back to another model (the on-device one is right there) and tell the user they've used today's allowance; on a service blip, retry or fall back without implying they did anything wrong. **Plan for a fallback either way** - a tier that can disappear at runtime is one to keep a safety net behind.

## Privacy is a user-facing decision

PCC sits at a privacy level *between* fully on-device and a third-party cloud: data is processed in Apple's verified environment and not stored, but it does leave the device. That's a meaningful distinction to the person typing, and the framework treats it as one. If your app can answer either on-device or via PCC, it's worth being clear about which one did - a small badge or disclosure goes a long way. Treating the move from on-device to PCC as something to surface, rather than an implementation detail to leave unspoken, seems like the respectful default.

## In short

Adding Private Cloud Compute is mostly a pleasure - a capable, free, private model that drops into existing Foundation Models code with a one-line change. The work that *isn't* in the one-liner is the rest of it: getting the entitlement assigned and into a signed build, guarding against the uncatchable crash when it's missing, and treating the daily quota as a runtime-variable condition with a fallback behind it. Handle those, and PCC settles in as an extra tier that steps aside gracefully when it isn't there. One last practical note: the SDK's `.swiftinterface` is the precise reference for the types and errors, but some behaviour - like `availability` not reflecting the entitlement - only shows up on a real device, so test on one before you ship.

## A real production example

If you want to see PCC wired into a real production-oriented SDK, take a look at [VoltaSDK](https://github.com/deruloop/VoltaSDK) on the `xcode27` branch. It is the codebase where I have been applying these Foundation Models sessions in practice, including the model-resolution and fallback concerns that become important once PCC is one tier among several.

## The session this implements

▶ [WWDC 2026, session 319](https://developer.apple.com/videos/play/wwdc2026/319/) - It's the best place to start for the API tour: `PrivateCloudComputeLanguageModel`, the `isAvailable` / `quotaUsage` checks, and the eligibility requirements. This article is meant to sit alongside it, adding the entitlement, signing, and quota details that came out of actually wiring it up.

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;
