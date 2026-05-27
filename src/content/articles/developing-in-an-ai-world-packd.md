---
title: Developing in an AI world (Use Case: Packd)
date: 2026-05-25
excerpt: A real production example of AI Pair Programming, taking Packd from a primitive AI-assisted app to a fully AI-driven trip planner.
tags: [AI, iOS, Packd, Architecture]
---

## Introduction

In this article I will talk about a real production example of **AI Pair Programming**. The app I am taking into account is [Packd](https://deruloop.dev/packd/), my own app currently available on the App Store.

The idea was to challenge myself to apply new development patterns and AI workflows to understand the true power of what is currently changing the software industry and redefining the role of developers. All of this with the goal of releasing a 2.0 version, with a more articulated UI/UX and important features.

Packd can be considered one of the most primitive sons of **AI**. It was built in one month, when AI was still taking its first steps.

At the time, the role of AI basically meant asking the ChatGPT model for coding help, delegating manual work like localization in different languages, and not much more. Now its role has become very different: it has become the core developer, delegating to me the architectural, shaping, and management side. It is truly remarkable what I managed to achieve with this approach in just two weeks.

For this "experiment" 👀 I've used a combination of **Lovable** and **TRAE** (but you can use whatever AI IDE you prefer). I'm going to talk about what changed in the first part and how AI helped me achieve it right after.

![Packd Trips screen: before and after redesign](/blog/packd-ui-comparison-1.png)

## New architectural approach

In my previous article, [From MVC to Clean SwiftUI](https://deruloop.dev/articles/from-mvc-to-clean-swiftui), I described the path that brought me to a **Clean SwiftUI** setup: Views stay declarative, business logic and side effects move into interactors/services, and data access is abstracted behind repositories with a clear **composition root**. That approach fixed the "massive view controller / massive view model" problem, but it also introduced a new kind of complexity: **protocol-heavy dependency injection** and a lot of boilerplate around wiring and mocking.

Packd is the next step in that same evolution. I kept the Clean boundaries, but switched to a **State/Store + closure-based DI** approach. UI state lives in small observable stores where it makes sense, domain state lives in **SwiftData models**, and Views only emit intent. Side effects remain outside the View layer, inside **feature services**. The main difference is how dependencies are modeled and injected: instead of protocols, services are structs of closures with **live/mock/unimplemented** variants, assembled in a single **Services container** and injected through the SwiftUI environment. This keeps the architecture testable and modular, but drops a large chunk of DI ceremony, making iteration and refactors significantly faster.

## Features: what changed in such a small time amount

What surprised me the most is how much **Packd** evolved in such a short amount of time: in just two weeks it went from a simpler travel companion to a much richer product. The dashboard, which used to be mostly a text-editor to take notes, weather and outlet infos, became a full planning tool with a timeline calendar, vault logic, and a smart overview of the whole trip.

![Packd Current Trip dashboard](/blog/packd-current-trip.png)

Trips became a deeper flow with explicit routing between planning and **"in-progress"** usage. If there's an active trip for today, the Trips tab boots straight into a dedicated **"Current Trip" dashboard**.

This screen is intentionally not the full workspace. It's a lightweight, glanceable view designed to answer **"what's next?"** without forcing you to open the full trip workspace. It shows your current context, progress through the trip days, and the next scheduled stop/activity (**"Up next"**), so you can use it as the default surface while traveling. From there you still have a fast path into the full workspace when you need to manage packing, plans, budget, or details.

If there isn't an active trip, Trips stays in planning mode, showing upcoming trips and quick actions. When a trip becomes active, planning mode surfaces a clear "Resume current trip" entry so you can jump back into the same dashboard. At any time, the Current Trip view provides an explicit "Other trips" action to switch back to the planning list.

CLEAR_FLOAT

Inside a single trip, the UX is organized as a workspace. You always keep the basic context visible (where you're going, the dates, the trip status), plus quick access to edit trip details and open trip actions. The workspace is divided into 4 main sections.

![Packd Inventory screen: before and after redesign](/blog/packd-ui-comparison-2.png)

**Day**: The operational itinerary screen. You pick a trip day, see scheduled stops, and place/edit items directly on a timeline grid. The flow is optimized for quick planning: tap a time slot, add the stop, keep moving. You can also attach documents and images to trip stops so tickets, PDFs, confirmations, and screenshots live inside the trip context.

**Overview**: The **"trip intelligence"** panel. It aggregates weather by day, surfaces conflicts/gaps in your plan, and shows practical destination info like power outlets.

**Vault**: The trip inbox. You can save **"stops to finalize"** without scheduling them yet, keep useful links, and later convert everything into planned itinerary items. Document gathering can also be done here, assigning it to stops later.

**Packing**: The execution checklist. Items are grouped, you can mark packed/unpacked, adjust quantities inline, and remove entries. It also bridges inventory into the trip via **"add from inventory"**, and supports **AI-assisted generation/refinement** to bootstrap a packing list from trip context and your inventory.


Inventory switched from a classic category list into a **chip-driven filter**. Instead of navigating into a category screen, you stay on one surface and use horizontal chips to scope what you're looking at: **"All"** or a specific category. That makes browsing feel instant and keeps **search + filtering** in the same place.

Once a chip is selected, the content updates in place and renders items as a compact grid of cards, optimized for scanning. Adding is always one tap, and when a category chip is selected you can also edit that category directly from the header.

![Packd Inventory screen: before and after redesign](/blog/packd-ui-comparison-3.png)

## AI inside the app: features

The main features of this new version are the **AI-related** ones. Packd already had AI in it, but only to help the user choose what to pack based on the number of days planned. The whole app has now become an **AI-assisted trip planner**, helping you go from an empty schedule to a complete itinerary with just a few taps.

![Packd Inventory screen: before and after redesign](/blog/packd-ui-ai.png)

If you want to plan the whole trip in one go, the Trips screen now includes a fantastic **"Plan with AI"** button that, after choosing where you want to go, automatically generates a full **multi-day itinerary**, filling every day with coherent activities while trying to keep variety across the trip.

Inside each day of a trip, you can ask AI to suggest stops either when the day is still empty (**"Draft itinerary with AI"**) or at any time from the **"AI"** button next to **"Add stop"**. Suggestions appear in a dedicated sheet and you can add them individually to build the day exactly the way you want.

Finally, when you're already in an active trip, **"What can I do next?"** acts like a smart assistant for today: based on what you've already planned and the current time, it proposes a realistic next stop that fits your available gap. All these AI results can be refined with your **personal preferences**, describing your intentions to help the model find the perfect stops for you.

## AI outside the app: tools that helped shape the new version

I went to London two weeks ago and had the pleasure of attending [NSLondon](https://nslondon.com), an iOS conference. I made a post on LinkedIn last week, and I could not recommend more joining a group and talking about your passions. This was my first time, but it definitely will not be my last at events like this.

Besides the chatting, there were also 3 workshops prepared by talented speakers, and one of them was specifically aimed at **AI programming**. The most interesting part was, of course, about controlling the way the agents think and how to guide them into acting as you would, giving them **memory** about how you would like things to be done. The speaker was a senior iOS developer at JustPark, a very popular app in London for handling parking. He pointed out that the **rules** they feed their AI agents change constantly since the tool is evolving and therefore requires repeated adaptation. So I came up with some **"core prompts"** I am currently using, which might be useful to share here.

Prompt one is about branching and it goes like this:

*"From now on, whenever I open a new task on this project, you will commit what you have done after each round, respecting [**conventional commits rules**](https://www.conventionalcommits.org/en/v1.0.0/). You will distinguish the scope between a feature, a bug, a chore, etc., following the guidebook I gave you. It is important for you to choose a scope that is detailed with more than one word so that every task is distinguishable. You only have to commit the files you edit in the current task, to avoid mistakenly committing unfinished changes from other parallel tasks."*

Prompt two is about architecture and it goes like this:

*"Read the [From MVC to Clean SwiftUI](https://deruloop.dev/articles/from-mvc-to-clean-swiftui). The architecture you are using for this project is the one described in the paragraphs **"Clean Architecture in SwiftUI"**, **"Where do we go from here?"**, and **"Closure-based Dependency Injection and Service-Store"**: a pragmatic Clean Architecture variant. Be sure to understand these 3 concepts before deciding on the architecture. What you should end up with is a **Clean Architecture Service Store** variant as described in the article."*

This second one reveals what I consider a core principle in **AI programming**: the ability to feed it **articles or personal notes**. This really motivates you to write down and better understand what you actually know about a subject, what core lessons you encountered along your journey, and what shaped the way you develop. This gives you more control over what you know, but the ultimate goal is also to feed AI with it. This concept extends to every aspect of AI programming. For example, as I shape a new feature, I tend to write it in a deeper and more scoped way, dividing it into prompts so that AI can pick it up quickly. And this approach is highly scalable in agile environments.

As you can see, both of these prompts are pretty concise, but right now they are really doing the job and facilitating my dialogue with AI in a way that I find acceptable. My goal is, of course, to refine them. I could say that this is my actual job now, more than development itself, which is crazy for me to say out loud.

I have another prompt that I use which is deeply connected to the second one and concerns **ATDD programming**, but I'm going to discuss all that mess in a future article. These prompts are, of course, not like a bible and need to be adapted to your current project. For example, it might be possible that in a cross-platform environment you would like to have different architectural approaches for the low-level part interacting with APIs and the high-level frontend part. Or maybe you don't want to give this level of freedom to AI to commit every change, to avoid the risk of committing regressions. On this note, I tend to squash and review the single commits regarding the same scope or task, in order to be sure I am committing safe code.

I came across [this post](https://ignatovv.me/blog/coding-agents-for-production-ios/) by an iOS engineer at Anytype (a note-taking app that I also use). As Vova Ignatov mentions in the article, the role you play when developing this way is more that of a **technical and architectural manager** than of a developer. You spend the day mostly breaking features into tasks, running them simultaneously, reviewing the code instead of writing it, questioning choices, and making sure the architecture you have designed is being respected.

What's fascinating is that it is a completely different approach, but you still feel **control** over what you are producing, because you are delegating the **"manual"** job while keeping the **designing and shaping** of the feature. This last part is what is crucial: if you delegate that part too to AI, you end up losing control and chasing regressions every day.

## The future of Packd

Packd's goal is, of course, to be a useful trip tool, first of all for me, and hopefully for someone else too. I feel like the maturity it has reached now places it in a sweet spot, serving more as a guide and a planner rather than as a simple packing list.

People can rely on it to save documents, avoid forgetting important information, and most importantly, plan according to personal preferences through a wider use of AI features inside the app.

What I'm currently planning to improve is **AI accessibility**. Right now, users are forced to pay a **subscription**, simply because AI is a tool that costs me money to run, so I need to ask the users who use the app to pay for it.

I want to keep that door open for people who don't use AI for anything else, but the main idea would be to allow **personal tokens** for the most popular AI tools, so that paying users of other AI subscriptions can use them inside my app. Another crucial point would be to enable **AI on device**, where supported, through the **Apple Intelligence Foundation model**. I'm really thrilled about what is going to be announced at **WWDC** in two weeks because I believe we'll hear a lot about this topic.

Besides this, the ultimate goal of Packd would be to become a social way to exchange organized trips, curated packing lists, and ideas between users and professionals.

That's all for now, thank you very much, and I leave you with my favourite app slogan, which I spent a whole day thinking about one year ago.... 👀

# Just in case, Packd!

Got it? "Case" is a shorter, everyday way to refer to a suitcase, so... "Just put it in case, packed!" But it also means I packed something just in case... does it make any sense to you?? Isn't it genius?!? I love it, I could talk all day about this, I'm maniacal about this stuff... the nurse is coming.... BYE 👋💀

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
