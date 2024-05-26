---
title: "Blogging sequentially using Writeroom, TextMate and ecto or MarsEdit"
categories: ["Tech"]
tags: [Apple, apps, blogging, software, TextMate, Wordpress, WriteRoom]
seoTitle: "Donald Jenkins: Blogging sequentially using Writeroom, TextMate and ecto or MarsEdit"
date: 2009-01-20T09:14:33+00:00
type: articles
notable: false
layout: "single"
slug: "blogging-sequentially-using-writeroom-textmate-and-ecto-or-marsedit"
draft: false
description: "In this post we will be looking at ways to get TextMate, MarsEdit or ecto and WriteRoom to work seamlessly together so that you can concentrate on each stage of producing a blog post without being distracted and automate most of the coding and uploading processes."
summary: "In this post we will be looking at ways to get TextMate, MarsEdit or ecto and WriteRoom to work seamlessly together so that you can concentrate on each stage of producing a blog post without being distracted and automate most of the coding and uploading processes."
featured_image: "12806e8f-a563-4332-eeb3-328344831300"
author: "Donald Jenkins"
showthedate: false
tableofcontents: false
noindex: false
---

{{% alert info %}}

## Update 6th November, 2010

This was an updated version of a post published on my previous blog on November 6 2007, and now no longer online because I have switched all my blog posts to this domain. Because the post below is itself now partly out of date and no longer reflects the way in which I write blog posts, you may also want to read two more recent articles I posted on [ways in which I use MarsEdit, Amazon Cloudfront and Markdown with WordPress](/improve-your-wordpress-blog-with-marsedit-amazon-cloudfront-and-markdown/), and the use of iOS apps, Dropbox and Automator to streamline and automate the blogging process.
{{% /alert %}}

Using the most efficient tools to blog is something well worth investing a little bit of time in, at least if you do spend a lot of time blogging, rather than—as happens to me all too often—tweaking your sites to make them look nicer or trendier and not writing any content as a result. Also, the prospect of having to spend hours just coding and formatting a post the wording of which is clear in your mind can be enough to make you postpone the ordeal for long enough that, when you get round to writing, the earlier inspiration has gone. This has happened to me many times.

In this post, I will be looking at the best way to minimise the effort involved in blogging so that you can concentrate on what should, after all, be the main thing, i.e. drafting relevant and well-written content.

One solution to that, of course, is to choose the kind of [Content Management System](https://en.wikipedia.org/wiki/Content_management_system "Wikipedia Entry: Content management system") that requires zero maintenance, if design and tweaking your content is not important to you. If you fall in that category, you probably shouldn’t be reading this but heading towards something like [Typepad](https://www.typepad.com/ "Blogging Software, Business Blogs & Blog Services at TypePad.com") or [Blogger](https://www.blogger.com/ "Blogger"). If, like me, you enjoy having a site that reflects your personality and tweaking it occasionally, but hate it when maintaining that quality starts taking an unreasonable amount of time that could be spent writing, then read on.

## The key to better productivity: separate writing, coding and publishing into clearly distinct sequences and find the best tools for doing each

I came to realise that one of the reasons why I was finding blogging so cumbersome was that it compelled me to mix three very different tasks: (1) writing a post, (2) coding it so that it would display properly and include the necessary information and (3) actually publishing that content on my server. Most online or desktop editing tools actually attempt to cover all three of these functions, yet they are totally unrelated by nature. The synergy between them is next to nil, and I could find no application that carried out all three functions properly

I will be using just three editing tools, [TextMate](https://macromates.com/ "TextMate — The Missing Editor for Mac OS X"), blogging software (your choice of [MarsEdit](https://www.red-sweater.com/MarsEdit/ "MarsEdit 2 - Powerful Blog Publishing For Your Mac") or [ecto](https://illuminex.com/ecto/ "illumineX :: software and games for Mac, iPhone and iPod Touch")) and [WriteRoom](https://www.hogbaysoftware.com/products/writeroom "WriteRoom — Distraction free writing software"), plus [Photoshop](https://www.adobe.com/creativecloud.html "Adobe - Compare Photoshop CS4 Versions") for formatting pictures and [Amadeus Pro](https://www.hairersoft.com/AmadeusPro/ "HairerSoft - Audio editing and recording for MacOS X") for editing audio files.

## ecto vs. MarsEdit: two different philosophies

TextMate and WriteRoom are, in my view, the obvious choices for the purpose of concentrating efficiently and quickly on what they are good at: coding and writing in simple English. MarsEdit, a simple, robust, well-thought out tool, was until recently my preferred blogging software. Version 3.0 ecto is actually a more sophisticated product and offers features that are not available in MarsEdit.

ecto tries to do what I regard as impossible to achieve: do everything within a single interface, writing, coding and publishing. It is basically for you if you want a comprehensive product that will handle all your blogging edition needs:

MarsEdit, which is more Apple-like in spirit, will be more useful to you if you prefer keeping your blogging simple:

I have recently switched to ecto from MarsEdit because, mainly, of its support for custom fields, but current versions of both are excellent and I would not want to force anyone to choose between them.

Version 3.0 of ecto, which is much improved over version 2.0, has support for [custom fields](https://codex.wordpress.org/Using_Custom_Fields "Using Custom Fields « WordPress Codex"), a feature which MarsEdit lacks but which its developer has promised to implement, and the automating of code snippets called custom tags, a feature I dont use in ecto but that may be handy for those who use it as an all inclusive blogging tool:

Regardless of which blogging software you choose, the procedure I suggest using presently involves a sequence of four stages: (1) drafting the post; (2) preparing images and media files; (3) coding the post and (4) posting the finished product to my blog. That might seem unnecessarily convoluted, but actually doing things in this sequence saves time. I’ll explain this now. Let’s examine each of those stages in turn.

## Drafting the post in Markdown: WriteRoom allows you to concentrate on writing

When I want to draft a new post, the first thing I do is open ecto (or MarsEdit), choose the blog I want to post to from the list, fill in the title and then switch to WriteRoom: if using ecto, you are reduced to using copy/paste; in MarsEdit, you can actually designate an {{% quote %}}external editor{{% /quote %}}, although I have found that feature somewhat unreliable in Leopard &thinsp;[^1].

The reason I insist on drafting in WriteRoom is that it allows me to concentrate on writing the post, without distractions: WriteRoom’s soothing, plain full-screen editor obscures everything other than my draft post, allowing me to do just that. It can be customized to look exactly as I want. All my spelling checking tools (which at this stage are all I need apart from keyboard and screen, since all the formatting I’m applying is in [Markdown](https://en.wikipedia.org/wiki/Markdown "Wikipedia Entry: Markdown")) are available in the application. Hitting <span class="shortcuts">ESC</span> allows me to toggle between WriteRoom and the rest of my Mac if I need to do so, for any reason. Of course, if you feel more comfortable drafting in TextMate (and a lot of people, when they get addicted to an application, tend to use it for absolutely everything) then by all means skip this step. I, however, find that WriteRoom allows me to concentrate on the writing part, and that TextMate’s strong point is for coding, which comes later.

Writing my post in WriteRoom does marvels for my productivity and is in no way a luxury compared with writing directly in TextMate. Because it fills the screen and yet is such a powerful writing application, I can concentrate on the quality and structure of my content without being tempted to add a link, change the code or search the web for a picture. Doing things sequentially is really the key.

At this point, I will be writing in [Markdown](https://en.wikipedia.org/wiki/Markdown "Wikipedia Entry: Markdown"), because that saves a lot of time, even though I will be converting the post to HTML well before it gets posted to my blog so that I don’t have to worry about text format at the later stages &thinsp;[^2].

## Preparing images and media files: Use Photoshop, Amadeus and Switch as required

This is actually easy. Pictures may need to be reformatted in Photoshop to make them smaller in size and optimise them for web display. There is a tool in Photoshop to do just that. If you want a cheaper alternative, [Acorn](https://flyingmeat.com/acorn "Acorn, the image editor for humans.") is another, cheaper image-manipulation tool with an optimization tool for web publishing:

Don’t upload anything yet though, as we’ll be automating that process.

On rare occasions when I need to include an audio file, I will usually work in [Amadeus Pro](https://www.hairersoft.com/AmadeusPro/ "Amadeus Pro") to get it the exact length and quality &thinsp;[^3].

I then upload media files using [Transmit](https://www.panic.com/transmit/ "Panic - Transmit 3 - The next-generation Mac OS X FTP client!"), definitely the best FTP desktop client for the Mac in my view.

I could write a bundle to automate this within TextMate, but it hardly seems worth it as I very seldom include media files in my posts nowadays. In any case, taking advantage of the much improved image insertion features in both MarsEdit and ecto, I have recently switched to using [Flickr](https://flickr.com "Flickr") for storing my blog image files and this may be an alternative you will want to look at &thinsp;[^4]. The advantage of storing your blog illustration files on Flickr are that you don’t need to change URLs if you ever change domain names (as happened to me with this blog). Inserting images from a Flickr account on ecto is easy:

A very similar tool is available on MarsEdit.

In addition, the Flickr system works nicely with [LittleSnapper]https://web.archive.org/web/20090308004503/https://www.realmacsoftware.com/littlesnapper/ "LittleSnapper"), a screen and web-snap application for the Mac which can be configured to upload images to Flickr at a click of a mouse and which I used to illustrate this blog post.

For video content, I rely on whatever online video website the content is available on (my preferred one personally being [Vimeo](https://vimeo.com "Vimeo")) because you would be crazy to host them yourself unless you really have a lot of bandwidth to spare. I simply rewrote the embed codes so that they didn’t break my page validation.

## Coding the post: TextMate allows you to automate almost everything

This used to be the most tedious bit and has now become the pleasantest. Once I’m absolutely satisfied with the quality of the draft I’ve prepared in WriteRoom, I copy/paste into TextMate for the code editing stage.

TextMate actually provides its own blogging editor, the Blogging bundle, which works beautifully and would in fact dispense me with using MarsEdit or ecto altogether if only it included posting summarys (which means that you may not need MarsEdit or ecto at all). In order for the full functionality to be available, don’t forget to enter your blog details in the Blogging bundle editing pane though.

TextMate’s strength, as it happens, is automating coding. I use it mainly for the three following tasks:

- insert any links I need in the post, using my own modified versions of the commands provided in the TextMate bundles (this ensures consistency in the way in which my links are displayed);
- insert my images, which is laughingly simple since if you’re using the blogging bundle, all you need to do is drag the picture to wherever you want it to appear in the post; TextMate will then insert the appropriate link and send the image to the folder you specified in whichever blog you choose from those listed in your Blogging bundle editing pane;
- tidy up the post code and layout: as this involves much manipulation that was completely repetitive, I automated by recording a macro, which is childishly simple in TextMate, to do the following, among others: convert code from Markdown to HTML (skip this if you prefer posting in Markdown), adding any missing tags, curly quotes, checking links and image tags for consistency and automatically adding any missing parameters… whatever.

For repetitive code snippets, I use [TextExpander](https://textexpander.com/ "TextExpander: Mac Typing Shortcut Utility Saves You Time!"), a Preferences Pane add-on that allows you to set customized abbreviations for your frequently-used text strings and images.

At this point, my post will already be looking pretty perfect. All I will need to do now is check it in the TextMate preview just in case there is something I overlooked. Since the pictures have already been uploaded, they will display.

This is what the post looks like after the various automated changes have been applied in TextMate. Note that we have now switched to HTML.

## Posting the finished article to the blog: this is where you switch back to MarsEdit or ecto

You can then switch back to your blogging software by copying/pasting your coded text.

Now, all that needs to be done is filling in the optional summary, categories, custom fields (if applicable) and tags. If you are using WordPress, make sure you upgrade to version 2.7 in order to take advantage of the seamless tag integration that was lacking or at best dysfunctional in previous versions.

If you’d rather insert your images using the blogging software rather than in TextMate or Flickr as described above, the current versions of ecto and MarsEdit allow this and are much improved over previous versions.

You’re then ready to publish your post, assuming you’ve set everything accordingly in ecto/MarsEdit. And, of course, if you don’t need to include an summary or custom fields, you can actually dispense with ecto/MarsEdit and use just TextMate and Writedown.

Working out a rigorous, sequential routine to produce, code and publish my content has certainly taken a lot of the stress out of blogging. I’m pleased to have put a bit of effort into organising the way I blog.

[^1]: I used to do this seamlessly using Library Input Managers such as the [bundle](http://blog.macromates.com/2007/inputmanagers-on-leopard/) developed by TextMate. But since Leopard these are unofficially unsupported by Apple, apparently because they are a tempting means for rogue software to exploit. They don’t work for me anymore, and while there are probably workarounds, I find copying and pasting achieves the result, albeit in a less elegant way.
[^2]: On the rare occasions when I need to insert code, I use Elliot Swan’s Postable.
[^3]: If you don’t have Amadeus, [Switch](http://www.nch.com.au/switch/) is perfect for converting and/or encoding to the appropriate mp3 format if required.
[^4]: I store any files used to illustrate my blog on a separate account to my main Flickr account.
