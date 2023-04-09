---
title: 'Making sense of link sharing: Goo.gl, t.co and the URL shortener debacle'
date: '2010-10-11T13:38:50+00:00'
status: private
permalink: /making-sense-of-link-sharing-goo-gl-t-co-and-the-url-shortener-debacle
author: donaldjenkins
excerpt: 'Google’s recent announcement that it was making its goo.gl URL shortener available to anyone has revived discussion about URL shortening services—which has been an on-again, off-again subject for much of the past two years. It hasn’t, though, changed the way in which I use them, basically because in their persent state they aren’t very important to me. And the real issue here is not actually URL shortening, which will always remain a low-end, commodity service. The real challenge to the tech sector is providing users with convenient and intelligent ways of storing and sharing information—altogether a much more exciting proposition. In due course, link sharing can be expected to become less of a jungle as more standardised and user-friendly ways of sharing information—on Twitter, Facebook, Google Reader or Instapaper to name the main current available options—become available. URL shorteners, although they have been the subject of much media interest recently and are clearly indispensable in Twitter, are only a part of the picture in the much wider—and admittedly crucial—subject of link sharing.'
type: post
id: 1190
category:
    - Tech
tag:
    - apps
    - Evernote
    - Google
    - 'Google Reader'
    - Instapaper
    - Internet
    - link
    - Twitter
    - 'URL shortener'
    - web
post_format: []
aktt_notify_twitter:
    - 'yes'
aktt_tweeted:
    - '1'
wp_criticalcss_cache:
    - ''
---
Google’s recent [announcement](http://googlesocialweb.blogspot.com/2010/09/google-url-shortener-gets-website.html) that it was making its goo.gl URL shortener available to anyone has revived discussion about URL shortening services—which has been an on-again, off-again subject for much of the past two years. It hasn’t, though, changed the way in which I use them, basically because in their present state they aren’t very important to me. And the real issue here is not actually URL shortening, which will always remain a low-end, commodity service. The real challenge to the tech sector is providing users with convenient and intelligent ways of storing and sharing information—altogether a much more exciting proposition. In due course, link sharing can be expected to become less of a jungle as more standardised and user-friendly ways of sharing information—on Twitter, Facebook, Google Reader or Instapaper to name the main current available options—become available.

URL shorteners, although they have been the subject of much media interest recently and are clearly indispensable in Twitter, are only a part of the picture in the much wider—and admittedly crucial—subject of link sharing.

URL shorteners are a commodity feature: their only real use is with Twitter
---------------------------------------------------------------------------

I started using url shorteners very reluctantly. For a long time couldn’t see their point, since HTML, which one uses to format almost anything one posts online, allows to hide the actual link behind the description of your choosing,using this basic code that can be made to display online in exactly the length you like:

`<a HREF="http://mysupercoollittlelink.com">My link</a>`

So one may as well admit it and get on with life: URL shorteners are only actually of any use to you if you can’t use HTML to bring a long link down to a reasonable size. In other words, when you can’t use HTML and are restricted to plain text, as really only happens when posting updates in Twitter or, occasionally, Facebook. This also used to happen with old mail clients that broke lines and ended up making long links unclickable, but that issue belongs to the past really. And of course, it’s only really an issue with Twitter, because of that service’s 140-character restriction on posts.

There are three major consequences of this:

- since you’ll only really be needing URL shorteners in Twitter, it’s unlikely people will be clicking on them very long after you’ve created them; until Twitter becomes a proper, searchable and indexed repository (which, admittedly, may happen someday), anything you link to will only really need to be available while it’s still relatively fresh news;
- in practice, you’ll need your Twitter client to support your URL shortener of choice; it looks better if all your links are shortened with the same service;
- for the same reason, you’ll want your URL shortener to provide you with statistics on how much, where and from where your links were clicked.

Twitter’s dithering and lack of of a clear strategy on URL shortening is an illustration of the company’s amateurish approach to its development and may give rise to privacy concerns
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Twitter haven’t been helping with this process: [bit.ly](http://www.bit.ly/) became Twitter’s ‘default’ URL shortening service on May 6, 2009, replacing [TinyURL](http://www;tin,yurl.com/), once one of the most popular services on the web, but now much less so. Several competing services, such as [Trim](http://tr.im/), shut down their services after they found that it was difficult to compete with bit.ly on Twitter.

Of course, the reason for this was financial: Twitter, whose financial strategy has always been extremely muddled and really met success by sheer accident rather than through astute planning, needs to find ways of monetising its service, and last year appears to have taken the view that there was a correlation between that difficulty and the relative openness, to date of its platform, with its widely used API. URL shortening seemed the obvious way to look for this, because, as [oreilly.com](http://radar.oreilly.com/2010/09/why-twitters-recent-announceme.html) put it:

> Unlike other URL shorteners, Twitter can force everyone to use their service simply because they control the platform. Your URLs can be shortened (and their engagement tracked by Twitter) whether you like it or not.

And also:

> Because the interested reader is forced to go to the URL shortener to map the short URL to the real one, whoever owns the shortener sees the engagement between the audience and the content, no matter where it happens. That’s why URLs are the new cookies.

Twitter’s implementation of that view, however, has been characteristically muddled and laden with blunders: in December 2009, Twitter broke off its formerly close relationship with Bit.ly, and its CEO Mr Evan Williams [told developers at the Chirp conference in San Francisco](http://gigaom.com/2010/04/15/what-i-learned-at-twitters-first-chirp-conference/) that it would be developing its own URL shortener; Twitter then starting very slowly rolling out [t.co](http://support.twitter.com/groups/31-twitter-basics/topics/111-features/articles/109623-about-twitter-s-link-service-http-t-co), its own in-house URl shortener: this is only used on links posted on twitter.com and is not available for any other use, meaning you can’t use it on any third-party clients even when posting to Twitter.

Twitter [posted an announcement](http://blog.twitter.com/2010/06/links-and-twitter-length-shouldnt.html) about the change in June 2010, saying that ‘When this is rolled out more broadly to users this summer, all links shared on Twitter.com or third-party apps will be wrapped with a t.co URL.’ Four months later, nothing has happened. Ironically, Twitter for iPhone, the ‘official’ iPhone client for Twitter developed out of Tweetie after it was acquired by Twitter, offers a choice between bit.ly, TinyURL, is.gd, l.pr, u.nu or Linkyy, but not t.co:

<div class="outer-container"><div class="centering-container"><div class="inner-container"><div class="caption-box" style="width: 333px"><div> ![Twitter for iPhone doesn't offer t.co](http://cloud.donaldjenkins.com/images/blog-posts/url-shorteners-1.jpg "Twitter for iPhone doesn't offer t.co") </div><div class="caption-text"> Twitter for iPhone doesn’t offer t.co among the list of url shorteners that you can use by default in your tweets. </div></div></div></div></div>Twitter for iPad doesn’t seem to offer any URL shortening options at all, apart from bit.ly’s new j.mp service[§](#bfn-footnotes-140). A [Google Groups post](http://groups.google.com/group/twitter-api-announce/browse_thread/thread/14d5474c13ed84aa) Twitter released about the same time for the benefit of developers was, if anything, even more cryptic about the subject and gave the distinct impression that Twitter’s engineers didn’t really know where they were heading.

Twitter’s intention of logging *all* incoming links and filtering them through t.co has also [raised privacy concerns](http://www.esecurityplanet.com/features/article.php/3901956/Twitter-Retools-App-Link-Policies-Sparks-Privacy-Worries.htm) similar to those that had arisen about Facebook. It seems obvious that the real motive behind Twitter’s plan is not to guard users against malware, but rather to be able to monetise tweets more effectively. Given Twitter’s lackluster technical record (it’s long been famous for its inability to scale properly and for its prolonged and frequent downtime), t.co URL shortening sounds altogether like an amateurish, unclear project with no clear direction.

In other words, Twitter’s attempt to corner the URL shortening segment, so far, is a mess, and I doubt that it will ever turn out to be the game-changer that everyone was predicting eralier this year. It’s hard to see why Twitter has taken so long to roll out t.co, given its obvious competitive advantage in controlling what is posted to its site, and I wonder whether Twitter clients will ever start offering it when Twitter’s in-house clients dont. I’ve so far continued using bit.ly to shorten my tweets, because I can do so with a single click on my iPhone, iPad or from my preferred RSS reader, [Reeder](http://www.reederapp.com/).

The real significance of link shortening is the wider issue of sharing
----------------------------------------------------------------------

goo.gl and bit.ly both provide excellent statistics for your links, with Google’s service having the advantage of being linked to your main Google account. There also seems to be some uncertainty owing to the fact that the .ly domain is controlled by the loopy Libyan government, which [doesn’t seem the most relaible jurisdiction](http://arstechnica.com/web/news/2010/10/libya-beginning-to-police-ly-domains-for-morality.ars) to host anything you post online. It’s probably just as well that bit.ly recently started using the more reliable (and shorter) j.mp domain in preference to the Libyan one.

In the longer term, though, there might be a more exciting future for URL shortening and indexing. It would make sense for users to be able to store all the links they find of interest in a single place. I currently use [Evernote](http://www.evernote.com/) to store links for my own private future reference[§](#bfn-footnotes-140). For links I want to share, I use three services:

- [Google Reader](http://www.google.com/reader/shared/donaldbdjenkins) for news stories that don’t require comment;
- Twitter for links that only need a short 140-character comment;
- Facebook for anything I only want to share with my friends—I make extensive use of Facebook’s [friend list](http://www.facebook.com/help.php?page=768) feature for this, to target links I share on only those friends known to have a specific interest in the subject.

To make the public/private link distinction easier, I also display *all* my public links (currently only Twitter and Google Reader) on a single [links page](http://links.donaldjenkins.com/) on my website. I had to use a combination of [Yahoo Pipes](http://pipes.yahoo.com/) feeds to get the links to display exactly as I wanted, as a list readers can click on to open the linked page directly, regardless of where it originates.

One of the reasons I’m a fan of Silvio Rizzi’s [Reeder](http://www.reederapp.com/) RSS client for Google Reader is that it makes it possible to share interesting links with any of the above services with just one click, using the URL shortener of your choice, or to store stuff in an [Instapaper](http://www.instapaper.com/) account for reading later if I don’t have time to do so right away. Instapaper is actually quite a powerful link management application in its own right, since you can create folders in it, make some of them public and associate a RSS feed with them, much in the same way as you can in Google Reader.

<div class="outer-container"><div class="centering-container"><div class="inner-container"><div class="caption-box" style="width: 333px"><div> ![Reeder offers a wide range of sharing options](http://cloud.donaldjenkins.com/images/blog-posts/url-shorteners-2.jpg "Reeder offers a wide range of sharing options") </div><div class="caption-text"> [Reeder for iPhone and iPad](http://itunes.apple.com/us/app/reeder/id325502379?mt=8) is a good example of a RSS client that allows you to share links with any social network or storage service of your choice: I’ve set it to offer me the option of sharing on Googkle Reader, Instapaper or Twitter, using j.mp to shorten links in the latter case. </div></div></div></div></div>I’d expect the web to gradually evolve into something that made sharing of links less of a jungle. People ought to be able to easily share links with anyone they choose or keep them for their own private use, and it doesn’t make sense that they should have to jungle between the maze of URL shorteners, Twitter, Google, Instapaper, Evernote or Facebook[§](#bfn-footnotes-140) to do this. My bet is that Google will eventually win this war, because it’s the best placed of the three current main players to be firmly placed at the crossroads of the web in a way that neither Twitter nor Facebook are.

<div class="bfn-footnotes" data-container="" data-post-id="140" id="bfn-footnotes-140" style="display: none;">### References


</div>