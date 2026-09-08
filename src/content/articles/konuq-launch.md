---
title: Konuq, and the rain it is named after
date: 2026-09-08
excerpt: The thinking behind Konuq, a note app named after the finest drizzle. Tags instead of folders, live collections, one tap web publishing, and a feature called Cure that tends notes like a garden.
tags: [Konuq, iOS, KMP, Notes]
featured: true
---

*小糠雨, the drizzle so fine it seems to hang in the air*

小糠雨, konuka-ame, is the Japanese word for the lightest kind of drizzle. The name means rice-bran rain, because the drops are about the size of the powder left behind when rice is milled. Rain like that does not really fall. It hangs in the air, and after a while everything is wet without any single moment when it started.

Thinking arrives to me the same way. Almost nothing shows up as a finished thought. It shows up as a fragment, a detail worth keeping, a half-sentence, a two-item list, something that might be nothing. Every note app I tried asked me to decide where that fragment belonged before it would let me write it down. Which notebook, which folder, which project. The question is small, and it arrives while the thought is still forming, which is exactly when it does the most damage. Often enough I just did not write the thing down.

**Konuq is built so that question never gets asked.** A fragment goes in as it is. Structure comes later, if it comes at all, and it comes out of what was written rather than being decided in advance.

![Konuq hub, a mosaic of collection tiles that fill themselves from tags](/blog/konuq-collections.png)

---

## Tag based system, no folders

**There are no folders in Konuq.** A note is filed by writing a tag inside it, the way a hashtag gets written anywhere else. Typing `#trips` in the body is the whole filing operation.

That choice has a consequence I care about more than the convenience. A note carrying three tags lives in three places at once, and no copy of it exists anywhere. Editing it once updates every place it appears.

Collections are built on top of that. **A collection is a live query dressed as a tile.** It holds one or more tags, and it gathers every note that contains all of them. Nothing is filed into a collection and nothing is maintained. A note written tomorrow with the right tag is already inside it, and removing the tag takes it back out.

Filtering works from the tag bar at the top of the note list. Tapping a tag narrows to notes containing it, and tapping several requires all of them. Double-tapping inverts the tag instead, so it excludes. For example you could filter everything tagged `#work` except anything tagged `#done`.

![The notes list with the tag bar, one note living under several tags](/blog/konuq-tags.png)

The tag parser lives in the shared Kotlin core (`extractTags`), which matters more than it sounds like it should. It comes up again further down.

---

## A hub becomes a website

![The same hub on iPhone, iPad and Mac, and the website it becomes when published](/blog/konuq-hub-devices.png)

Notes live in hubs. A hub is a genuinely separate space rather than a folder, with its own collections and its own purpose, and most people end up with a couple of them.

**Any hub can be published as a website.** Publishing takes a snapshot of the hub, its collections, its notes and its images, writes it as a single payload with the media beside it, and serves it as a static read-only page at a chosen address. A real life example is https://konuq.app, the landing page of the app. That site is itself a published Konuq hub, written on a phone in the same editor used for a shopping list.

You can choose your own address, and that address is editable after the first publishing, and changing it keeps the previous one alive as a redirect, so links already sent to other people do not break. Individual notes get their own URLs too, derived from their titles.

![A hub with the publish menu open, showing the live site address](/blog/konuq-publish.png)

Republishing is one tap and takes seconds, which changes what the thing is for. A site that costs almost nothing to update stops being a publication and starts being a garden, a page that grows by accumulation rather than by release.

---

## Anything can become a note

The share sheet is the fastest way into Konuq, and the one I use most. Sharing a link from a browser, a post from a social app, a paragraph of text or a photo opens a small Konuq sheet that creates the note immediately.

Shared text arrives as **one block per line**, so a copied list stays a list instead of collapsing into a paragraph that has to be broken up by hand. A shared link keeps room for a comment underneath it. A shared image arrives ready to write around.

The part that makes it stick is the **tag picker** sitting in that same sheet. Choosing a tag at the moment of capture means the note lands in the right collection before the app is ever opened, and there is no pile of untagged things waiting to be sorted later. Filing at capture time is cheap. You can also create a new tag right in the text area to start a new collection.

![The share sheet over Instagram, creating a note with a tag typed in](/blog/konuq-share.png)

---

## The editor

The editor is the part I rewrote most. It is a block editor, and the direct inspiration is **Anytype**. Its handling of blocks as independent objects rather than as styled runs of text is something that I really liked.

Every paragraph, heading, checkbox, bullet, code block, toggle and image is its own block with its own identity. Blocks can be reordered, selected in groups, and moved, copied or deleted together with their formatting intact.

![The block editor with a title, checkboxes and an image, markdown as you type](/blog/konuq-editor.png)

**Markdown works while typing** rather than as a separate mode. Typing `# ` turns the row into a title, `- ` into a bullet, `[ ] ` into a checkbox, `---` into a divider and so on. Pasting markdown from elsewhere is parsed the same way, so text arriving from another app keeps its headings and its lists.

I also love dictation, in random free moments or while I'm driving and a thought passes my mind. Speaking into a note transcribes continuously, and a pause starts a new block, so a spoken paragraph comes out already broken into readable pieces roughly where the thinking paused.

The editor is its own Swift package (`KonuqEditorKit`), versioned separately from the app. That separation was originally about build times. It turned out to matter for a different reason, which is the next section.

---

## The nerd speech

Konuq is a Kotlin Multiplatform project. The rule I follow is that **KMP owns the reusable core and native code owns the platform experience**.

The shared Kotlin module holds the domain models, the feature state, the use-cases, the SQLDelight persistence and the cross-platform tests. It also holds the snapshot serialization, which is what turns a hub into the payload that gets published or synced. The Swift side holds the things that are genuinely Apple-specific, which is the SwiftUI interface, navigation, RevenueCat, notifications, and for now the cloud networking and the cryptography.

Each feature has the same shape, from the view down to storage. A SwiftUI view talks to a FeatureStore, which is a thin native adapter that turns shared state into something SwiftUI is comfortable observing. Behind it sit the Feature, the Interactor, the Service and the Repository, all in Kotlin. The layer that changes per platform is the thinnest one. I have already talked about this architecture [here](https://deruloop.dev/articles/from-mvc-to-clean-swiftui), and it is the one I am loving so far.

Centralizing the rules rather than the interface is the point, and tags are the clearest example. There are four ways a tag can get onto a note: typing it, choosing it in the share sheet, receiving it from another app, or having it arrive in imported content. All four end up as `#hashtag` text inside a block, and all four are read by the same `extractTags` function in the shared core. There is one definition of what a tag is. Adding a fifth entry point does not mean writing a fifth parser, and it cannot drift from the other four.

The same holds for the publish payload. The serialization that produces a published site is shared Kotlin, so the day an Android version exists it publishes byte-identical output without that code being written twice. The cloud networking and crypto layer is still Swift-only, and moving it into the shared module would be an ideal goal which I hope to achieve at a later moment.

---

## The kon-verse

Konuq was the first, but during this spring and summer of 2026 I started building other apps, and they kept wanting to write things down. So to complicate my life even further I said "why not use the Konuq editor and have deep integration with it?" (I love centralizing and modularity and hate writing things twice, if you had not noticed.)

**Packd** is a packing and travel app. Somewhere in the middle of building its trip journal I realized I was writing a small, worse note editor inside it, and that a second one would follow in the next app, and a third after that. Rather than reimplement notes everywhere, I made Packd hand its journals to Konuq.

The mechanism is deliberately boring, which is why it works offline and survives being interrupted. Packd writes a job into a container both apps can reach, containing a manifest that describes the note as blocks plus the image files it needs, and then opens a `konuq://import` link. Konuq copies the media into its own store, builds the blocks, creates the note and writes a receipt, then opens a link back into Packd so it knows the job landed and can clean up. Jobs that arrive while Konuq is closed are queued and processed at the next launch, so nothing is dropped.

Two details are worth pointing at. Tags travel as ordinary `#hashtag` blocks in the manifest, which means a journal arriving from Packd is filed by exactly the same shared parser as a note typed by hand, and it lands in the right collection on arrival. And a journal that has already been imported is updated in place rather than duplicated, so editing a trip in Packd and sending it again modifies the same Konuq note.

The result is that a trip journal written in Packd becomes a real Konuq note, which can then be published to the web with the rest of its hub. Written in one app, kept in another, read by anyone, in about three taps.

Packd's journal release is going to be the first of these. One of the apps I mentioned earlier is a recipe and cooking AI assistant manager that of course needs writing down recipes, so Konuq is going to be the link to share them on a personal website and send them to friends asking for your delicious muffins.

Another one is a training and fitness AI manager that makes custom training plans for you, that you can share on your website with anyone who would like to know about your journey or use them.

And so on. This is what I like to call the **kon-verse** (I know there is a famous shoe brand that is very much the same, but they did not invent the word "conversing" so I am not going to care -.-).

The idea behind this universe is that every app converses with Konuq, which becomes the headquarters that brings all of this acquired knowledge (written by you, or your AI assistant, refined with your personal experience of it) right onto the web, visible to anyone you want.

![A trip journal moving from Packd into Konuq and out to the web in three taps](/blog/konuq-packd-to-web.png)

---

## Cure

Most note apps only accept input. Things go in, sink, and a year later there is a large archive that nobody has the patience to scroll. Any vague reference to the Apple Notes app, in which I have so many passwords I do not even remember what they are for, random texts, and parking spot numbers to remember where my car is, is purely casual.

The tool is not really at fault, since capturing is easy and returning is work, so returning quietly stops happening. The mindful concept behind Konuq started with this very feature, the "Cure".

**Cure is the part of Konuq that pushes back on that.** It treats a note collection as a garden that needs tending rather than an archive that needs storage.

**"Left Behind"** deals out notes that have not been touched in a long time, on a card based system. Swiping right keeps a note, swiping left releases it, and opening it is always an option. One card at a time is the entire design. A list of two hundred forgotten notes is a chore that gets closed immediately, while a single card is a question that can actually be answered, and you can always go back to continue your trimming, whenever you want.

![Left Behind in Cure, reviewing an old note one card at a time](/blog/konuq-cure.png)

**"Held in Silence"** is quieter. It gathers notes that have gone unopened for months, oldest silence first, and does nothing else. Some of them turn out to be finished thoughts. Some are seeds worth planting properly. A few are genuinely done with, and releasing those feels good.

More of these are going to arrive in the next weeks. I am also working on an AI assistant that helps you spot which notes are similar and can be unified, which are unclear and can be clarified, and which are useless and can be deleted. Of course this is going to be completely optional and off by default, since it would be able to read your notes. It runs on device wherever it can, which is the most private option there is, and escalates to Apple's Private Cloud Compute when the request is bigger than the device can handle well. On device alone is not reliable enough once you have a lot of notes, so the pair of them is the most private solution that actually works. Which brings me to the next topic.

---

## Privacy and availability

Konuq 1.0 is on iPhone, iPad and on Apple silicon Macs. Notes stay on the device by default and the app works fully offline.

Konuq Pro adds the parts that need a server. Cloud sync is **end-to-end encrypted**, with the key generated on the device and never leaving it, which means the sync server holds ciphertext and cannot read a word of it. Restoring on a new device uses a recovery passphrase that only the account holder knows. Publishing is the deliberate exception to all of that, since a published hub is public by definition.

Konuq 1.0 releases on September 14th, 2026. A version for Android is on the roadmap. If you would like to know what else is, you can visit https://konuq.app/landing/coming-soon

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
