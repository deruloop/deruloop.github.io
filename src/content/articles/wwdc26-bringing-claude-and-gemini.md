---
title: Bringing OpenAI, Claude, and Gemini in Through the Front Door
date: 2026-07-29
excerpt: Connecting OpenAI, Claude, and Gemini through the public LanguageModel front door on iOS/macOS 27. A streaming executor, users bringing their own account, and the auth wall that comes down to vendor policy.
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

*Second piece in the series. The first one used a model Apple ships, Private
Cloud Compute. This one connects models Apple has never heard of, OpenAI,
Claude, and Gemini, through the public door that opened on iOS/macOS 27. I
wrote it against the iOS/macOS 27 beta (Xcode 27, build 27A5237l), so it's a
snapshot of the beta season while it's still happening. Some of what follows
is beta behaviour, and I'll revisit the piece and re-verify everything closer
to GA.*

The rule for the series stays the same. I take one WWDC session, build what it
teaches, and write down whatever surfaces along the way. This one follows
[Bring an LLM provider to the Foundation Models framework](https://developer.apple.com/videos/play/wwdc2026/339/)
(WWDC 2026, session 339).

## What Apple announced

On iOS/macOS 27 the Foundation Models framework stops being Apple-models-only.
A public protocol called `LanguageModel` lets any model be accepted wherever
the framework expects one, in a `LanguageModelSession` today and a Dynamic
Profile soon. This is the front door I keep mentioning. Any model that
conforms walks in through the same entrance Apple's own on-device and PCC
models use. It's a protocol we'll be hearing about for a long time, since it
opens the framework to essentially anything that conforms.

Apple expects vendors to publish Swift packages that handle that conformance,
and they have. Google ships Gemini for the framework through its Firebase SDK,
and Anthropic publishes `ClaudeForFoundationModels`. A developer can also write
the conformance by hand, which is what this piece does, by implementing what
the session calls an executor. When a REST client for a chat vendor already
exists (my [VoltaSDK](https://github.com/deruloop/VoltaSDK) had three of them
from the developer-key path), most of the conformance is translation work. The
framework hands over a transcript, that transcript gets split into
instructions, history, and a prompt, the existing client generates the answer,
and the answer streams back. None of the model logic gets rewritten.

## What changed in VoltaSDK

Before this work the SDK could already talk to OpenAI, Claude, and Gemini, but
only on the developer-key path. The developer configured a key, the developer
paid, and the REST clients sat off to the side of Apple's framework. Four
things changed after it.

1. Users can bring their own key. A new provider slot lets someone connect
   their own key, and it takes its place in the fallback chain like any other
   provider. This is genuinely new. Until now, "AI included" always meant the
   developer footed the bill.
2. Cloud models now enter through Apple's front door. The same REST calls run
   inside a real `LanguageModel`, driven by a `LanguageModelSession`, the same
   machinery Apple's own models use. In the chat output nothing looks
   different, since the prompt and the answer are the same. The value is in
   what it unlocks. A real `LanguageModel` can be handed to anything the
   framework accepts a model into, including a native Dynamic Profile, which is
   where the last article in this series goes.
3. Official vendor packages plug in. A small public extension point called
   `customModels` accepts any vendor's `LanguageModel`, whether that's Firebase
   Gemini, Anthropic's package, or a hand-written conformance, and slots it
   into the chain without the SDK writing a client for it.
4. Streaming now drives the whole path instead of a single call that emits a
   prompt, and the next section digs into what that means.

One thing didn't change, despite a serious attempt. Every one of these paths
still runs on an API key, and none of them can use OAuth.

## Streaming is the primitive

One design choice defines session 339. The single method an executor has to
implement is a streaming one. There is no "take a prompt, return a string"
method to fill in. The executor receives a channel and pushes the answer into
it as fragments, the small pieces an answer arrives in, and even a one-word
reply goes out as a single fragment.

Apple does provide a `respond` method that returns the whole answer at once,
but it builds that method on top of the stream. Under the hood it listens to
every fragment and joins them together. The stream sits underneath everything.
A conformance that buffers, meaning it waits for the whole answer and then
sends it in one go, runs the same mechanism in its simplest form, with a single
fragment. The session also fixes the order things go out in, metadata and usage
first, then the text fragments.

Doing this properly for a cloud vendor means the data changes shape three times
along the way.

1. **The vendor speaks SSE.** With server-sent events the answer trickles in as
   dozens of small chunks, and each vendor has its own dialect. OpenAI sends
   `delta` chunks and closes with a `[DONE]` marker, Anthropic sends named
   events (`content_block_delta` through `message_stop`), and Gemini streams
   partial response objects from `streamGenerateContent`. That comes down to
   one small SSE parser and three little decoders.
2. **The executor forwards each chunk into the channel** the moment it arrives,
   exactly the way the session shows.
3. **The consuming side speaks snapshots rather than deltas.** This is the part
   that catches people out, so a concrete example helps. A delta is only the
   new bit, so it runs `"The"` → `" cake"` → `" is"` → `" ready"`. A snapshot is
   the whole thing so far, so it runs `"The"` → `"The cake"` → `"The cake is"` →
   `"The cake is ready"`. Vendors talk in deltas, in increments, while Apple's
   session stream hands back a snapshot at each step, the full text so far,
   growing every time. Showing only the new part, the typewriter effect without
   redrawing everything, means converting those snapshots back into deltas. The
   data ends up converted twice, from vendor deltas into framework snapshots and
   then back into deltas for the UI. Vendors add, the framework accumulates, and
   the executor translates in both directions. Each conversion is only a few
   lines of code, and the need for them becomes obvious only once the thing is
   running.

The genuinely hard part was what streaming does to a fallback SDK. A resolution
chain promises that a failed provider gets quietly swapped for the next one.
Streaming splits the idea of failure into two moments. Before the first fragment
reaches the screen nothing has been shown yet, so falling through to the next
provider stays invisible, and that is fine. Once the first fragment has landed,
the reader has already seen part of an answer, and quietly re-answering with a
different model would pull back text they already trusted. The rule I landed on
is simple. Automatic fallback applies only until the first fragment becomes
visible, and after that any failure surfaces to the reader. Visible text never
gets retracted.

I watched this run at both ends of the privacy spectrum. Private Cloud Compute
streams natively through the chain, and a user's own Gemini account types its
answer out across the whole front-door path. Fragment size depends on the
source. The SSE vendors type in small, almost token-sized chunks, while the
session-backed models can jump ahead in bigger snapshots. One transport can't
stream at all. Gemini's OAuth path (Code Assist) has no SSE equivalent, so it
delivers the entire answer as a single fragment, which is the one-fragment case
the channel already handles.

## Problems encountered

A few notes on the problems that came up while wiring this together.

- **The credential can't live in the obvious place.** The executor's
  configuration has to be `Hashable`, because the framework uses it as a cache
  key, so a token has no business sitting there. It ended up as a per-call token
  provider on the model itself, resolved fresh on every request and never part
  of the cache key.
- **Error mapping is only partial, honestly.** The session recommends the
  framework's `LanguageModelError` cases. Some map cleanly, like rate limits and
  safety refusals. Others expect data a failed REST call simply doesn't carry,
  like exact token counts or language codes. Rather than invent plausible
  numbers, I left those as custom errors and mapped only what could be mapped
  truthfully.

## The OAuth limit

The biggest finding of the whole piece is a closed door. The original plan was
to let someone sign in with their Gemini, Claude, or ChatGPT account and use
that subscription inside the app. I built the OAuth machinery and it worked live
against Google, with a sign-in window, PKCE, and the token stored in the
Keychain. Then it hit a wall, and the wall turned out to be about policy rather
than anything technical. All three vendors close the same door.

- **Google.** A perfectly valid, perfectly scoped user token gets rejected by
  the Gemini API for generation. The endpoint that would accept it is a private
  API reserved for Google's own tooling. A scope that once existed for this
  exact case has been deprecated, and a community workaround became a ToS
  violation, with accounts suspended.
- **Anthropic.** Claude Free, Pro, and Max OAuth tokens aren't allowed in other
  products, and that is enforced by blocking. The sanctioned route goes through
  Anthropic's own Agent SDK.
- **OpenAI.** "Sign in with ChatGPT" shares identity only, and it stops short of
  plan-backed inference.

The pattern is the same across all three. Consumer-subscription inference stays
reserved for the vendor's own tooling, and the only sanctioned third-party route
is the vendor's official SDK or the user's own API key. That reframes what Apple
said in the session. When Apple said vendors would publish packages, that was the
answer to the auth question as well. A vendor's package brings its model along
with its auth, and everyone else is left holding an API key.

I wanted to give developers using VoltaSDK a way to let their users sign in with
OAuth, but every provider has gradually closed that door over the past year. I
think it's a real shame. Right now that capability is reserved for Apple, for
Siri integration and a handful of private partners. It would have been great for
people to use the account and the tokens they already pay for inside the apps
they love, without signing up for yet another subscription. Hopefully PCC grows
into something like that.

## The session this implements

▶ [Bring an LLM provider to the Foundation Models framework](https://developer.apple.com/videos/play/wwdc2026/339/),
WWDC 2026, session 339. It's the place to start for the protocol tour and the
executor lifecycle. This article is the field report from actually wiring it up.

## Next

The next article, [Resolution Meets Orchestration: Handing a Model to a Dynamic Profile](/articles) *(coming soon)*, is where the front door pays off. It hands the
resolved model to a native Dynamic Profile. Also on the list is re-attaching the
parked vendor package once a release lands that matches the installed beta.

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;
