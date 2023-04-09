---
title: 'My site&#8217;s epic switch to html5'
date: '2011-03-15T12:47:58+00:00'
status: private
permalink: /my-sites-epic-switch-to-html5
author: donaldjenkins
excerpt: 'This site is using a new theme as of today, the code for which has been entirely rewritten to integrate html into its underlying structure and semantics. I''ve also worked on enriching it with other new interesting trends, especially the jQuery class of javascript applications. I''ll be writing about all these subjects in greater detail in the next few articles.'
type: post
id: 1821
category:
    - Tech
tag:
    - blogging
    - html5
    - personal
    - web
    - WordPress
post_format: []
dsq_thread_id:
    - '254536561'
aktt_notify_twitter:
    - 'yes'
aktt_tweeted:
    - '1'
wp_criticalcss_cache:
    - ''
---
If you’re reading this in a feed reader—which [I hope you are](http://feeds.feedburner.com/ectomorphicvicissitudes)—you won’t be aware that the template for this theme has been completely changed. Every year, as regularly as clockwork, just before spring, I seem to get inspired to rewrite the code for my theme from scratch. The last time this happened was [last year](/2010/02/my-outrageously-minimalist-new-website/), when I switched to a resolutely minimalist style and a theme that I had entirely written from scratch.

That version of the theme was designed with speed in mind: the front page [loaded in 1.6 seconds](http://cl.ly/5FTJ) on good days, and this was achieved by a combination of relatively clean code, sparing use of plugins and external ressources and, above all, the complete elimination of javascript, with a user interface stripped down to bare bones.

Over the past year, I’ve been looking quite attentively at new trends in blogging and thinking about what it might be interesting to implement in my website. The trend towards minimalism has continued unabated among the more interesting class of designers; but [jQuery](http://jquery.com/) and <abbr>[html5](http://dev.w3.org/html5/spec/Overview.html)</abbr> were the two new technologies that I was most interesting in getting to know better, so I’ve decided to implement them on this site, in this new, [\#444](http://www.color-hex.com/color/444444)-centric theme, effective today.

<div class="image-container" style="width: 580px;"><div class="centered">![The Chelsea theme](http://cloud.donaldjenkins.com/images/blog-posts/the-chelsea-theme-1.jpg "The Chelsea theme")</div>The new site home page, which I’m calling the Chelsea theme, is really just a base from which to access the rest of my web presence. It integrates a number of innovations, like Google Custom Search.

</div>Since using jQuery and its 70kb library plus assorted plugins meant reversing my previous decision to avoid javascript, it also necessitated rewriting the underlying code again from scratch to avoid compromising speed in the process, and has been an challenging, yet most enjoyable experience. I won’t delve into the details in this post, because html5 and jQuery are sufficiently complex subjects in themselves to deserve individual attention: I was especially interested in the radically new [semantics](http://diveintohtml5.org/) of html5, and just understading them, let alone implemlenting them, has been unexpectedly challenging intellectually to say the least, because they require a radical shift in approach that results in a steeper learning curve than I had anticipated.

The other two changes of significance I’ve I’ve added are a [Custom Google Search](http://www.google.com/cse/home?cx=016991144950118867704:lu94gqfrzzm&hl=en) engine and switching comments—which I find a pain to maintain—to [Disqus](http://disqus.com/): the latter is an experimentation I reserve the right to reverse, as it actually induces a not insignificant drain on the resources that I’ve so painstakingly saved up. Still, by reducing the number of objects served from eleven to just four, I’ve still cut the overall loading time of the site to [just 1.5 seconds](http://cl.ly/5G4r), which is still quite reasonable.

I’ve kept my popular [links](http://links.donaldjenkins.com/) page and, in another innovation which shows imitation is the best form of flattery, I’m planning to integrate the occasional *really interesting* link into the actual blog, [Daring Fireball/Shaun Blanc style](http://shawnblanc.net/2010/09/daring-fireball-linked-list-wordpress-plugin/).

Last but not least, I’ve decided to officially switch the status of the blog articles (but not the theme code) to a [Creative Commons license](https://www.donaldjenkins.com/legal/license/), which merely reflects the reality of how information is exchanged today: I’d have done it earlier if I had been more attentive to the legal niceties.

I’ll be writing about all these subjects in greater detail in the next few days in a series of separate articles.