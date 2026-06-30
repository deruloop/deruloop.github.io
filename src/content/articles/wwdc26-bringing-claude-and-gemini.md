---
title: Bringing Claude and Gemini in Through the Front Door
date: 2026-06-29
excerpt: What a first-class multi-provider setup should look like when external models stop being a side path and become part of the stack.
status: coming-soon
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

_Test article for the WWDC 26 collection._

## The shift

For a long time, bringing in third-party models felt like wiring an escape hatch into an otherwise native app. The developer key path existed, but it felt separate from the "real" platform story.

That framing is fading. If the platform itself acknowledges multiple model tiers and multiple providers, then Claude and Gemini are no longer awkward exceptions. They become explicit parts of the model selection story.

## What changes for developers

The key architectural change is not just provider support. It is normalization.

A good integration layer should make provider choice feel like policy, not branching chaos. The app should be able to say:

- prefer on-device first
- fall back to a developer key when the task demands it
- keep the UX consistent even though the answering model changed

## The front-door test

A provider is "through the front door" when the app does not treat it as a separate feature mode.

The user should not feel that they have entered a hidden Claude screen or a Gemini-only workflow. They should feel that the app picked the right engine for the current request under an understandable policy.

## The practical takeaway

If your code still routes third-party providers through special-case UI, it is probably not integrated yet. It is just attached.
