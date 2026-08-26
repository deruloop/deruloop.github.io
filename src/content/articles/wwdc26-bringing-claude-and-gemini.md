---
title: Bringing OpenAI, Claude, and Gemini in Through the Front Door
date: 2026-07-29
excerpt: Connecting models Apple never shipped — OpenAI, Claude, and Gemini — through the public LanguageModel front door on iOS/macOS 27: a streaming executor, users bringing their own account, and the auth wall that turns out to be policy, not protocol.
tags: [AI, WWDC26, Foundation Models]
collection: WWDC 26
collectionSlug: wwdc-26
collectionOrder: 1
track: Foundation Models
trackDisplayTitle: Applying Foundation Models Sessions to a Real Production SDK
trackSlug: foundation-models
trackOrder: 1
lessonOrder: 2
---

*The second piece in the series. Where the first one used a model Apple ships
(Private Cloud Compute), this one is about connecting models Apple has never
heard of — OpenAI, Claude, and Gemini — through the public door Apple opened
on iOS/macOS 27. Written against the iOS/macOS 27 beta (Xcode 27, build
27A5237l) — deliberately a snapshot of the beta season as it stands, published
while it's happening. Some details are beta behaviour; I'll update this piece
as the release approaches and re-verify everything at GA.*

The series rule again: take one WWDC session, actually build what it teaches,
and write down what surfaces. This one follows
[**Bring an LLM provider to the Foundation Models framework**](https://developer.apple.com/videos/play/wwdc2026/339/)
(WWDC 2026, session 339).

## What Apple announced

On iOS/macOS 27 the Foundation Models framework stops being Apple-models-only.
A public protocol, `LanguageModel`, lets *any* model be accepted anywhere the
framework expects one, a `LanguageModelSession` today, a Dynamic Profile
next. That's the "front door" i was talking about: not a side integration, the same entrance
Apple's own on-device and PCC models use. Basically a new protocol we will hear about for a long time to come, which will allow as conformation of any given model.

Apple's expectation, stated in the session, is that vendors will publish Swift
packages that seal that conformation to it, and of course they did: Google ships Gemini for the
framework through its Firebase SDK; Anthropic publishes
`ClaudeForFoundationModels`. But you can also conform *yourself*, which is
what this piece does, implementing what we can call an **executor**. Basically if you already have a REST client for a chat vendor (my VoltaSDK had
three, from the developer-key path), the conformance is mostly *translation* —
take the framework's transcript apart into instructions + history + prompt,
hand that to the client you already trust, stream the answer back. No model
logic gets rewritten.

## What changed in VoltaSDK

Before this work, the SDK could already talk to OpenAI, Claude, and Gemini —
but only on the developer-key path: the developer configures a key, the
developer pays, and the REST clients live off to the side of Apple's
framework. After it, three things are different:

1. Users can bring their own key. A new provider slot lets the user
   connect their own keys and it takes
   its place in the fallback chain like any other provider. This is new
   functionality: before, "AI included" always meant the developer's bill.
2. Cloud models now enter through Apple's front door. The same REST calls
   now run inside a real `LanguageModel`, driven by a `LanguageModelSession` —
   the same machinery as Apple's models. In the chat output this is
   invisible: same prompt, same answer. Its value is what it unlocks — a
   real `LanguageModel` can be handed to anything the framework accepts a
   model into, including a native Dynamic Profile (which is going to be the last article of this series' scope).
3. Official vendor packages plug in. A small public extension point
   (`customModels`) accepts any vendor's `LanguageModel` — Firebase Gemini,
   Anthropic's package, your own conformance, and slots it into the chain
   without the SDK writing a client for it.
4. Streaming instead of one line emitting prompts, which i'm going to explain further in the next chapter.

And one thing that did not change, despite a serious attempt: every one of
these paths still runs on an API key and can't use OAuth.

## Streaming is the primitive

If one design choice defines session 339, it's this: the one method your
executor *must* implement is a streaming one. There's no "take a prompt,
return a string" to fill in — you're handed a channel and you push the answer
into it as fragments (small pieces of the answer), and even a one-word reply
is just "push a single fragment."

The convenient `respond` method — the one that hands you the whole answer at
once — is something Apple builds *on top of* the stream: under the hood it
listens to every fragment and joins them for you. So the stream is the
foundation, not the shortcut, and a conformance that buffers (waits for the
whole answer, then sends it in one go) isn't doing less — it's the same
mechanism in its simplest case: a single fragment. The session also fixes the
order you send things in: metadata and usage first, then the text fragments.

Doing this properly for a cloud vendor means the data changes shape three
times along the way:

1. **The vendor speaks SSE.** Server-sent events: the answer trickles in as
   dozens of small chunks — but each vendor has its own dialect. OpenAI sends
   `delta` chunks and closes with a `[DONE]` marker, Anthropic sends named
   events (`content_block_delta` … `message_stop`), Gemini streams partial
   response objects from `streamGenerateContent`. So: one small SSE parser,
   plus three little decoders.
2. **The executor forwards each chunk into the channel** the moment it
   arrives — exactly what the session shows.
3. **What consumes the stream speaks *snapshots*, not deltas** — and this is
   the part that trips you up, so let's be concrete. A *delta* is only the new
   bit: `"The"` → `" cake"` → `" is"` → `" ready"`. A *snapshot* is the whole
   thing so far: `"The"` → `"The cake"` → `"The cake is"` → `"The cake is
   ready"`. Vendors talk in deltas (increments); but when you read back
   Apple's session stream, it hands you the snapshot each step — the full text
   so far, growing every time. To show only what's new (the typewriter effect,
   without redrawing everything), you turn those snapshots back into deltas.
   So the data gets converted twice: deltas from the vendor → snapshots inside
   the framework → deltas again for the UI. Put simply: vendors *add*, the
   framework *accumulates*, and you translate both ways. Each conversion is
   only a few lines — but you only discover you need them by building it.

The genuinely hard part was what
streaming does to a *fallback* SDK. The whole promise of a resolution chain
is that a failed provider is quietly swapped for the next one. Streaming
splits "failed" into two moments. *Before* the first fragment is on screen,
nothing has been shown yet, so falling through stays invisible — fine.
*After* it, the user has already read half an answer, and quietly
re-answering with a *different* model would retract text they already
trusted — not fine. The rule that settled it: **automatic fallback only
applies until the first fragment is visible; after that, failures surface.**
Visible text is never taken back.

Seen live at both ends of the privacy spectrum: Private Cloud Compute streams
natively through the chain, and a user's own Gemini account types its answer
out across the whole front-door path. One honest note on grain: how big each
fragment is depends on the source — the SSE vendors type in small, almost
token-sized chunks, while the session-backed models can jump ahead in bigger
snapshots. And one transport can't stream at all: Gemini's OAuth (Code Assist)
has no SSE equivalent, so it delivers the entire answer as a single fragment —
which is exactly the degenerate one-fragment case the channel was designed to
allow anyway.

## Problems encountered

Short notes about the implementation problems encountered

- **The credential can't live where you'd first put it.** The executor's
  configuration must be `Hashable` (the framework uses it as a cache key), so
  a token doesn't belong there. It became a per-call token provider on the
  model itself — resolved fresh on every request, never part of the cache key.
- **Error mapping is only honestly partial.** The session says to prefer the
  framework's `LanguageModelError` cases; some map cleanly (rate limits,
  safety refusals), but others demand data a failed REST call doesn't have
  (exact token counts, language codes). Rather than fabricate plausible
  numbers, those stay custom errors — map only what you can map truthfully.

## The OAuth limit

The biggest finding of the whole piece is a closed door. The plan was "sign in
with your Gemini / Claude / ChatGPT account and use your subscription in the
app." The OAuth machinery got built and worked live against Google — sign-in
window, PKCE, token in the Keychain. And then the wall, which turned out to be
**policy at all three vendors, not protocol**:

- **Google:** a perfectly valid, perfectly scoped user token is rejected by
  the Gemini API for generation; the endpoint that accepts one is a private
  API reserved for Google's own tooling. A scope that once existed for exactly
  this use case was deprecated, and a community workaround was made a ToS
  violation with accounts suspended.
- **Anthropic:** Claude Free/Pro/Max OAuth tokens may not be used in other
  products — enforced by blocking; the sanctioned alternative routes through
  Anthropic's own Agent SDK.
- **OpenAI:** "Sign in with ChatGPT" shares identity, not plan-backed
  inference.

Three vendors, one law: **consumer-subscription inference is reserved for the
vendor's own tooling; the third-party path is the vendor's official SDK — or
the user's own API key.** Which reframes Apple's session: when it said vendors
would publish packages, that *was* the answer to the auth question too. The
vendor's package brings its model *and* its auth; anyone else's key is a key.

I tried to give the ability to developer using the VoltaSDK to allow the users to authenticate via OAuth but all the doors have been gradually closed by all the providers through this year. I really find this to be a shame. That skill has been reserved only to Apple for Siri Integration and specific private partners. I think it would've been lit for users to use their own account and tokens they already pay for, inside apps they love, without having to pay another subscription. Hopefully PCC is going to be that sort of thing.

## The session this implements

▶ [**Bring an LLM provider to the Foundation Models framework**](https://developer.apple.com/videos/play/wwdc2026/339/)
— WWDC 2026, session 339. Start there for the protocol tour and the executor
lifecycle; this article is the field report of actually wiring it up.

## Next

The next article — [**Resolution Meets Orchestration: Handing a Model to a Dynamic Profile**](/articles) *(coming soon)* — is the payoff of the front door: handing the
resolved model to a native Dynamic Profile. Also queued: re-attaching the
parked vendor package when a release matching the installed beta ships.

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;
