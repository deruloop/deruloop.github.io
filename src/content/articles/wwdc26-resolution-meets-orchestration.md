---
title: Resolution Meets Orchestration: Handing a Model to a Dynamic Profile
date: 2026-06-28
excerpt: Where model resolution should stop, where orchestration should begin, and why that boundary matters more as Apple adds dynamic profiles.
status: coming-soon
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

_Test article for the WWDC 26 collection._

## Two jobs, not one

Model resolution and orchestration are often bundled together because they both happen before an answer appears. But they solve different problems.

Resolution answers: _which model should handle this request?_

Orchestration answers: _how should the system shape and manage the work once a model has been chosen?_

## Why the boundary matters

That distinction becomes more important when a dynamic profile enters the picture.

A resolver should be free to decide that the best available model is on-device, Private Cloud Compute, or a developer-key provider. Once that decision is made, the orchestration layer should receive a concrete model capability and adapt the interaction around it.

If those responsibilities blur together, the system becomes harder to reason about. Every fallback starts dragging prompt behavior, session behavior, and policy behavior along with it.

## A cleaner handoff

The clean architecture is:

1. inspect availability and policy
2. resolve the target model
3. hand the result to a dynamic profile or session layer
4. run the interaction with that profile

This keeps fallback logic composable instead of contagious.

## The practical takeaway

If resolution has to know too much about the conversation layer, it has already become orchestration. That is usually the moment maintainability starts to slip.
