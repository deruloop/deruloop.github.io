---
title: Developing in an AI world (Use Case: Packd)
date: 2026-05-25
excerpt: A real production example of AI Pair Programming, taking Packd from a primitive AI-assisted app to a fully AI-driven trip planner.
tags: [AI, iOS, Packd, Architecture]
---

## Introduction

In this article i will talk about a real production example of **AI Pair Programming**. The app taken in exam is [Packd](https://deruloop.dev/packd/) , my own app currently available on the app stor.

The idea was to challenge myself to apply new developing patterns and AI workflows to understand the true power of what is currently changing the software industry and redifining the role of developers. All of this with the goal of releasing a 2.0 version, with a more articulated UI/UX and important features.

Packd can be considered as the most primitive son of **AI**. It was made in one month when AI was moving his first steps.

The role of AI was at the time basically asking ChatGPT model for coding help, delegating the manual work like localization in all the different languages and that's about it. Now is role has been way much different, it became the core developer, delegating to me the architectural, shaping and managing part. It is truly remarkable what i managed to achieve with this approach in just three weeks.

For this "experiment" 👀 i've used a combination of **Lovable** and **TRAE** (but you can use whatever AI IDE in the industry). I'm going to talk about what changed in the first paragraph and how AI helped me right achieve this right after.

![Packd Trips screen: before and after redesign](/blog/packd-ui-comparison-1.png)

## New architectural approach

In my previous article, [From MVC to Clean SwiftUI](https://deruloop.dev/articles/from-mvc-to-clean-swiftui), I described the path that brought me to a **Clean SwiftUI** setup: Views stay declarative, business logic and side effects move into interactors/services, and data access is abstracted behind repositories with a clear **composition root**. That approach fixed the "massive view controller / massive view model" problem, but it also introduced a new kind of complexity: **protocol-heavy dependency injection** and a lot of boilerplate around wiring and mocking.

Packd is the next step of that same evolution. I kept the Clean boundaries, but switched to a **State/Store + closure-based DI** approach. UI state lives in small observable stores where it makes sense, domain state lives in **SwiftData models**, and Views only emit intent. Side effects remain outside the View layer, inside **feature services**. The main difference is how dependencies are modeled and injected: instead of protocols, services are structs of closures with **live/mock/unimplemented** variants, assembled in a single **Services container** and injected via the SwiftUI environment. This keeps the architecture testable and modular, but drops a large chunk of DI ceremony, making iteration and refactors significantly faster.

## Features: what changed in such a small time amount

What surprised me the most is how much **Packd** evolved in such a short amount of time: in just a few weeks it went from a simpler travel companion to a much richer product. The dashboard, from a simple note taking and weather became a full planning tool with timeline calendar, vault logic and smart overview of the all trip

![Packd Current Trip dashboard](/blog/packd-current-trip.png)

Trips became a deeper flow with explicit routing between planning and **"in-progress"** usage. If there's an active trip for today, the Trips tab boots straight into a dedicated **"Current Trip" dashboard**.

This screen is intentionally not the full workspace. It's a lightweight, glanceable view designed to answer **"what's next?"** without forcing you to open the full trip workspace. It shows your current context, progress through the trip days, and the next scheduled stop/activity (**"Up next"**), so you can use it as the default surface while traveling. From there you still have a fast path into the full workspace when you need to manage packing, plans, budget, or details.

If there isn't an active trip, Trips stays in planning mode, showing upcoming trips and quick actions. When a trip becomes active, planning mode surfaces a clear "Resume current trip" entry so you can jump into the same dashboard. At any time, the Current Trip view provides an explicit "Other trips" action to switch back to the planning list.

CLEAR_FLOAT

Inside a single trip, the UX is organized as a workspace. You always keep basic context visible (where you're going, dates, trip status), plus quick access to edit trip details and open trip actions. The workspace is divided into 4 main sections

![Packd Inventory screen: before and after redesign](/blog/packd-ui-comparison-2.png)

**Day** : The operational itinerary screen. You pick a trip day, see scheduled stops, and place/edit items directly on a timeline grid. The flow is optimized for quick planning: tap a time slot, add the stop, keep moving. You can also attach documents and images to the trip stops so tickets, PDFs, confirmations, and screenshots live inside the trip context.

**Overview** : The **"trip intelligence"** panel. It aggregates weather by day, surfaces conflicts/gaps in your plan, and shows practical destination info like power outlets.

**Vault** : The trip inbox. You can save **"stops to finalize"** without scheduling them yet, keep useful links, and later convert everything into planned itinerary items. Document gathering can also be done here, assigning it to stops later.

**Packing** : The execution checklist. Items are grouped, you can mark packed/unpacked, adjust quantities inline, and remove entries. It also bridges inventory into the trip via **"add from inventory"**, and supports **AI-assisted generation/refinement** to bootstrap a packing list from trip context and your inventory.


Inventory switched from a classic category list into a **chip-driven filter**. Instead of navigating into a category screen, you stay on one surface and use horizontal chips to scope what you're looking at: **"All"** or a specific category. That makes browsing feel instant and keeps **search + filtering** in the same place.

Once a chip is selected, the content updates in place and renders items as a compact grid of cards, optimized for scanning. Adding is always one tap, and when a category chip is selected you can also edit that category directly from the header.

![Packd Inventory screen: before and after redesign](/blog/packd-ui-comparison-3.png)

## AI inside the app: features

The main features of this new version are the **AI-related** ones. Packd already had AI in it, but just to help the user choose what to pack for the amount of days established. The whole app has now become an **AI‑assisted trip planner**, helping you go from an empty schedule to a complete itinerary with just a few taps.

![Packd Inventory screen: before and after redesign](/blog/packd-ui-ai.png)

If you want to plan the whole trip in one go in the Trips screen there is a new fantastic **"Plan with AI"** button that, after choosing where you want to go, automatically generates a full **multi‑day itinerary**, filling every day with coherent activities while trying to keep variety across the trip.

Inside each day of a trip, you can ask AI to suggest stops either when the day is still empty (**"Draft itinerary with AI"**) or at any time from the **"AI"** button next to **"Add stop"**: suggestions appear in a dedicated sheet and you can add them individually to build the day exactly the way you want.

Finally, when you're already in an active trip, **"What can I do next?"** acts like a smart assistant for today: based on what you've already planned and the current time, it proposes a realistic next stop that fits your available gap. All this AI results can be refined with your **personal preferences**, describing your intentions to help the model find the perfect stops for you.

## AI outside the app: tools that helped shape the new version

I went to london two weeks ago and had the pleasure to attend [NSLondon](https://nslondon.com) , an iOS conference. I made a post on linked last week and i could not raccomend more joining a group and speak about your passions. This was my first but will definetly not be my last time at events like this.

Beside the chatting there were also 3 workshops prepared by talented speakers, one of them was specifically aimed to **AI programming**. The most intresting part was of course about controlling the way the agents think and how to route them into acting like you would do, giving them **memory** about how you would like things to be done. The speaker was a senior iOS developer at JustPark, a very popular app in London to handle parking. He pointed to the fact that the **rules** they feed their AI agents change constantly since the tool is evolving and it requires of course a repeated adaptation. So i came out with some **"core prompts"** i am currently using, that might be useful to share here.

Prompt one is about branching and it goes like this:

*"From now on whenever i open a new task on this project, you will commit what you have done after each round, respecting [**conventional commits rules**](https://www.conventionalcommits.org/en/v1.0.0/) . You will distinguish the scope between a feature, a bug, a chore ecc following the guidebook i gave you. It is important for you to choose a scope that is detailed with more than one word so that every task is distinguishable. You only have to commit the files you edit in the current task, to avoid mistakenly committing unfinished changes from other parallel possible tasks."*

Prompt two is about architecture and it goes like this:

*"Read the [From MVC to Clean SwiftUI](https://deruloop.dev/articles/from-mvc-to-clean-swiftui) . The architecture you are using for this project is the one described in paragraphs **"Clean Architecture in SwiftUI"**, **"Where do we go from here?"** **"Closure-based Dependency Injection and Service–Store"**: a pragmatic Clean Architecture variant. Be sure to understand these 3 concept before deciding on the architecture. What you should end up with is a **Clean Architecture Service Store** variant as described in the article."*

This second one reveals what i consider a core principle in **AI programming**, the ability to feed it **articles or personal notes**. This skill really motivates you to write and understand more about what you actually know of a subject, what core lessons you encountered along your journey and shaped the way you develop, in a more understandable way. This gives you control on what you know, but also the ultimate goal is to feed AI with it. This concept extends to every aspect of AI programming, for example as I shape a new feature I tend to write it in a more deep and scoped way, divide it in prompts so that AI can pick on it fast. And this approach is highly scalable in agile environments. 

As you can see both of these prompt above are pretty much concise, but right now they are really doing the job and facilitating my dialog with AI in a way that i find acceptable. My goal is of course to refine them, i could say that this is my actual job now, more than development itself, which is crazy to me to say out loud.

I have another prompt which i use that is deeply connected to the second one and regards **ATDD programming**, but i'm going to discuss all that mess in a future article. These prompt are of course not like a bible and needs to be adapted to your current project. For example it might me possible that in a cross platform environment you would like to have different architectural approaches for the low level part interacting with APIs and the high level frontend part. Or maybe you don't want to give this level of freedom to AI to commit every change to avoid the risk of committing regressions. On this note i have the tendency to squash and review the single commits regarding a same scope or task, in order to be sure i am committing safe code.

I came accross [this post](https://ignatovv.me/blog/coding-agents-for-production-ios/) of an iOS engineer at Anytype (a note taking app i'm also a user of). As Vôva Ignátov mentions in the article the role you play when developing this way is more one of a **techincal and architectural manager** rather then a developer. You spend the day mostly to separate features into tasks, run them simulataneously, review the code instead of writing it, question choices and make sure the architecture you have designed is being respected.

What's fascinating is that is a complete different approach but you still feel **control** over what you are producing, cause you are delegating the **"manual"** job but keeping the **designing and shaping** of the feature. This last part is what is crucial, if you delegate that part too to AI you end up losing control and chasing regressions every day.

## The future of Packd

Packd goal is of course to be a useful trip tool, to me in primis and hopefully to someone else. I feel like the maturity that it reached now places it in a sweet spot, serving more of a guide and a planner rather than a simple packing list.

People can rely on it to save documents, avoid forgetting important infos, but most importantly plan according to personal preferences, through a more wide use of AI features inside the app.

What i'm currently planning on improving is **AI accessibility**. Right now the users are forced to pay a **subscription**, simply because AI is a tool that costs me money to be powered so i need to ask for them to the users using the app.

I wanna keep that door open for people who don't use AI for anything else, but the main idea would be to allow **personal tokens** of the most famous AI tool so that paying user of other AI subscriptions can use it inside my app. Another crucial point would be to permit **AI on device**, for the supported ones, through **Apple Intelligence Foundation model**. I'm really thrilled about what is going to be announced to **WWDC** in two weeks because i believe we'll hear a lot about this topic.

Beside this, the ultimate goal of Packd would be to become a social way to exchange organized trips, curated packing lists and ideas between user and professionist.

That's all for now, thank you very much and i salute you with my favourite app slogan, which i spent a whole day thinking about one year ago.... 👀

# Just in case, Packd!

Got it? case is a shorter, everyday way to refer to a suitcase, so... "Just put it in case, packed!" But it also means i packed something just in case...does it make any sense to you?? Isn't it genial?!? I love it, i could talk a whole day about this, i'm maniac about this stuff... the nurse is coming.... BYE 👋💀

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
