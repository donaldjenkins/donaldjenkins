---
title: "Improve your WordPress blog with MarsEdit, Amazon Cloudfront and Markdown"
categories: ["Tech"]
tags: [apps, blogging, Cloudfront, ecto, Markdown, Marsedit, Wordpress]
seoTitle: "Donald Jenkins: Improve your WordPress blog with MarsEdit, Amazon Cloudfront and Markdown"
date: 2010-03-20T15:37:02+00:00
type: articles
notable: false
layout: "single"
slug: "improve-your-wordpress-blog-with-marsedit-amazon-cloudfront-and-markdown"
draft: false
description: "How I use MarsEdit for editing posts on my desktop, in combination with WriteRoom and TextMate. I explain how I've started using Amazon Cloudfront to store my images"
summary: "In an update to a post I wrote in 2007 about the tools I use to compose blog posts, I cover using MarsEdit for editing posts on my desktop, in combination with WriteRoom and TextMate. I explain how I've started using Amazon Cloudfront to store my images. I also cover new trends in caching and ways of using Markdown to produce cleaner code including, optionally, using it as the storage format for individual blog posts, using Michel Fortin's PHP Markdown plugin."
featured_image: "609d0038-ccd3-4664-5b2c-e66ff20c5f00"
author: "Donald Jenkins"
showthedate: false
tableofcontents: false
noindex: false
---

I first wrote about the way I write my WordPress blog posts in 2007, and updated the method I described for [using WriteRoom, TextMate and and desktop blogging software](/blogging-sequentially-using-writeroom-textmate-and-ecto-or-marsedit/ "Blogging sequentially using WriteRoom, textMate and ecto or MarsEdit") in 2009. Available tools have changed slightly since then, and I’ve also changed the way I use them. So a short update is needed here.

WordPress itself has improved considerably in the past three years, to the point that writing blog posts in the wp-admin web interface is now a real option for those who want to keep their blogging simple and aren’t interested either in refinements or in using code. Uploading of images, via the media library, in particular, has been made radically better. I haven’t personally gone that way, however: I still find using desktop clients infinitely more comfortable and it gives me greater flexibility. Also, using WordPress’s built-in WYSIWYG editor still doesn’t result in very clean code: so I would recommend disabling it&thinsp;[^1], unless you aren’t bothered with what your underlying HTML looks like. If you are, then you might want to read on. I’ll concentrate, in this post, on saying a bit about how I use three tools (MarsEdit, Cloudfront and Markdown) to make my blogging easier.

## I switched back from ecto to MarsEdit

I’ve switched back to [MarsEdit](https://www.red-sweater.com/marsedit/ "More about MarsEdit") from [ecto](https://illuminex.com/ecto/ "More about excto") for drafting my posts, though: ecto was acquired by a company called Illuminex in 2008, and hasn’t been updated since, effectively becoming [abandonware](https://en.wikipedia.org/wiki/Abandonware "More abut abandonware")&thinsp;[^2], which makes it pretty unusable, in contrast to MarsEdit, which is regularly updated and fixed: it still doesn’t support custom fields, or WordPress’s new featured_image feature out of the box, but using its powerful macros you can actually achieve pretty well anything you want in that respect. The barriers to switching your desktop software are inexistent, so switching is hardly a major issue: you just pull your posts from your blog in whatever you switch to, and you’re up and running in seconds; but currently, MarsEdit definitely has my vote at present.

## The W3 Total Cache plugin and Amazon Cloudfront

I’ve also simplified my storage of images, as part of the change of theme I recently applied to the blog: I now store them on an [Amazon S3 Cloudfront](https://aws.amazon.com/cloudfront/ "More about Amazon Cloudfront") server, which means they’re served to my readers, who are evenly split between the US and Europe, more quickly than if everything were stored on my MediaTemple server.

Rather than explaining how to set up Cloudfront for use with WordPress, I’d suggest referring to Paul Stamatiou’s excellent [tutorial](https://paulstamatiou.com/how-to-getting-started-with-amazon-cloudfront "Paul Stamatiou's tutorial on setting up Cloudfront for use with WordPress").

Doing this, combined with gzipping the files and setting far-ahead headers for them, has considerably cut down the site’s loading time&thinsp;[^3]. A new plugin called [W3 Total Cache](https://wordpress.org/extend/plugins/w3-total-cache/ "More about W3 Total Cache"), which I’ve been testing on a sandbox site, has the potential to cut loading time still further, and is clearly a potentially very impressive solution, including advanced caching features (with an option to use [memcached](https://memcached.org/ "More about Memcached")) as well : I haven’t yet used it with this site, though, because I’m not really comfortable with the way it modifies the WordPress directory structure and quite aggressively takes control of files , to the point you don’t always know where they are meant to be stored. Also, caching can’t at this stage be fine-tuned to apply different refresh times to different sorts of content.

I upload the image files directly to the S3 bucket using Firefox’s S3 add-on, and link to them directly from the blog post HTML, using a MarsEdit macro I wrote for that purpose, which also handles proper formatting of captions. This makes the processing of images really painless.

## Using Markdown

For reasons explained in my [2007 post](/blogging-sequentially-using-writeroom-textmate-and-ecto-or-marsedit/ "Blogging sequentially using WriteRoom, textMate and ecto or MarsEdit"), I’ve been using John Gruber’s [Markdown](https://daringfireball.net/projects/markdown/ "More about Markdown") for three years to compose my blog posts, and I’m still sticking with the method I described in that article: I compose the post in [WriteRoom](https://www.hogbaysoftware.com/products/writeroom "More about Hog Bay Software's WRiteRoom"), using Markdown, which is a fantastic time-saver. As pointed out by [Daniel Jalkut](https://twitter.com/danielpunkass "Daniel Jalkut on Twitter"), the developer of MarsEdit, it’s also a much cleaner way of generating code:

{{% quotation main-title="Red Sweater [blog]" url="https://www.red-sweater.com/blog/324/marsedit-markdown" %}}
I see Markdown as a response to a major problem with WYSIWYG HTML editors: they overpromise and under-deliver, almost guaranteeing disappointment. If you can get your content to look the way you want it to, you’ll probably be horrified to see the HTML code that has been computer-generated to make it happen. Markdown strikes a nice compromise by providing a predictable set of rules so that you know exactly what you’re going to get.
<-source->
Jalkut, Daniel
{{% /quotation %}}

### Using Markdown to _compose_ content

So using Markdown when composing content makes sense, not just because it’s quicker, but also because it generates much cleaner code. To achieve this, you need to convert it to HTML: a number of [excellent tools](https://www.google.com/search?&rls=en&q=convert+markdown+to+html&ie=UTF-8&oe=UTF-8 "Converting Markdown to html") exist to do this.

I still use [Textmate](https://macromates.com/ "More about TextMate") to convert MarkDown to HTML, but I don’t use it for very much else anymore: TextMate is a fantastic application, probably the most brilliant I’ve used on a Mac; [when version 2 is released](https://blog.macromates.com/2010/why-2-0-is-not-developed-in-the-open/ "A clarification by TextMate's developer about the TextMate 2 roadmap"), it will almost certainly turn out to be as brilliant and as indispensable as version 1: in the mean time, though, I’ve switched to [Coda](https://www.panic.com/coda/ "more about Coda") — which, although less polished, integrates editing of files written in most languages including HTML, PHP and javascript, as well as css, together with an FTP/SSH client, all in one application — for practically everything else.

### _Posting content_ in Markdown format

There is one logical step with Markdown that I haven’t yet taken, but that I have been tempted to: actually _posting_ content in Markdown as opposed to just _writing_ it in Markdown and converting it. This is technically possible and is natively supported by MarsEdit, which provides a Markdown filter for previewing your Markdown-formatted content. As WordPress doesn’t support Markdown out of the box, you need to apply a plugin to get it to work if you choose to publish without converting. There is an outstandingly elegant way of doing this, [PHPMarkdown](https://michelf.com/projects/php-markdown/ "PHP Markdown by Michel Fortin"), developed by a French-Canadian, [Michel Fortin](https://twitter.com/michelfortin "Michel Fortin on Twitter"). Installing this plugin means you can compose your posts natively in a desktop client such as MarsEdit, preview them using the appropriate filter, and then post them to your WordPress blog directly without converting them.

I was very tempted to do this as I felt this was a rather elegant solution. My main concern about it was whether the plugin might slow down the site, a price I was unwilling to pay for the convenience of posting in Markdown. I had just done a major effort on the code and cutting down on any dispensable plugins and testing the plugin on a sandbox blog did seem to result in some slowdown.

The second potential issue with which I was concerned was maintenance/compatibility. As there doesn’t seem any indication that WordPress are planning to support Markdown natively, there is always a risk, either that a future version will become incompatible with it and/or that Michel’s plugin will cease to be maintained, resulting in a large stock of blog posts that will then have to be manually converted to HTML to continue being usable. I put these questions to Michel by email.

He very promptly replied to me as follows:

> \[regarding the slowdown issue\] There will be a small slowdown indeed, but I doubt it’ll be very noticeable. WordPress makes it difficult to pre-apply the transformation to posts, so Markdown is called each time a user request a page. But PHP Markdown is pretty fast. \[…\]
>
> \[regarding the future compatibility issue\] Contrary to other systems that supports text formatting plugins natively, WordPress doesn’t support this kind of plugin very well. Making it work correctly was a little tricky. I’m not a developer of WordPress and I can’t assert WordPress won’t make changes that break the plugin. And while I can devote some time to fixing things, if it’s too complicated I’ll have to pass the maintenance job to someone else.
>
> That said, any change susceptible to break Markdown beyond a simple fix will surely break many other plugins, so I think it’s unlikely to happen. It hasn’t happened yet at least.

Eventually, I decided to stick with HTML for my posted blog posts. There was a good case to be made (legibility, simplicity, less pre-posting manipulation) for using the plugin and switching to Markdown. But on balance, I felt my current solution (composing in Markdown, converting to HTML using the TextMate bundle) results in extremely well-coded content that’s easy to compose and highly legible throughout the drafting stage. I seldom retouch my content after I’ve posted it, so knowing it’s then stored in HTML is not a major issue. But if your circumstances are different, you might well want to switch to Markdown using Michel Fortin’s plugin.

All this may change further when [WordPress 3.0](https://wordpress.org/about/roadmap/ "WordPress roadmap") is released: but a combination of Cloudfront, MarsEdit and Markdown had considerably improved the way in which I post to my website.

[^1]: This can be done in wp-admin: check Disable the visual editor when writing, under Users. The setting can be customised for each author of the blog.
[^2]: The developer, who had very conscientiously maintained the application and provided top-notch support prior to selling it, seems very unhappy about this, if his posts on the [user forum](https://web.archive.org/web/20100102133422/https://illuminex.com/forum/viewforum.php?f=11&sid=108ee8390c7fa9e62530d7106f0b5404) are anything to go by.
[^3]: The best way to optimize all these settings is through your .htaccess file, and a good guide to doing it can be found on [Storecrowd](https://via.dj/34xHerY).
