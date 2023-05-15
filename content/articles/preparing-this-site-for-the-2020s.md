---
title: "Preparing this site for the 2020s"
categories: ["Tech"]
tags:
  [
    Genesis,
    "Google Cloud Platform",
    Kinsta,
    "Media Temple",
    webdesign,
    WordPress,
  ]
seoTitle: "Donald Jenkins: Preparing this site for the 2020s"
date: 2018-11-29T14:21:00+00:00
type: articles
notable: false
layout: "single"
slug: "preparing-this-site-for-the-2020s"
draft: false
description: "The new design for this site is called Gramercy: I have used a framework for the design and simplified the content, with the biggest change being the merging of the Home page and the About page"
summary: "The new design for this website, the successor to the Belgravia theme I had been using since 2012, which I’m calling Gramercy, and which I hope you will like, goes live this week. But behind the hood quite a lot has changed beyond the design. Instead of writing all the code from scratch, this time, I have used a framework for the design and simplified the content, with the biggest change being the merging of the Home page and the About page."
featured_image: "6ed40368-22a0-445d-1c82-5b6d8f593b00"
author: "Donald Jenkins"
showthedate: false
tableofcontents: false
noindex: false
---

The new design for [this website](/)[^1], the successor to the Belgravia theme I had been using since 2012, which I’m calling Gramercy, and which I hope you will like, goes live this week. But behind the hood quite a lot has changed beyond the design.

In the thirteen years since I started publishing content on this site, I think I’ve measured up to the challenge I identified in my [first online article](/why-ive-decided-to-keep-a-blog/):

> I’m also curious to get to grips with the technical aspects. The Internet, for me, has been the realisation of a childhood dream: making every possible bit of information accessible worldwide. I’m keen that this should not be just a one-way process, and to make my own modest contribution to the system. I hope I’ll be up to the challenge.

The web then was a much less polished place than it is now. Since childhood I had been haunted by the difficulty of sharing thoughts in a paper-based world, and had dreamt of a device that would enable me to be permanently connected.

I certainly jumped into the technicity of the Internet with the alacrity of a novice swimmer jumping into the deep end of the pool. Within a few months, I had learnt html and css, and by the end of the decade I was designing my own themes for my CMS of choice, WordPress. This culminated in 2012 when I wrote a custom theme, which I called, Belgravia, from scratch. I wrote every single line of that theme’s code myself. By that stage, I was using an Apache server that I had entirely set up and was maintaining myself, and using the sharpest-end tools to develop and curate my site design and content. I was so pleased with the design that I did not feel the need to update it for six years.

But the Internet is a very fast-moving place — which is precisely what I like about it, with the challenge posed by wanting to use all the shortcuts and tools in modern web development. As the end of the decade approaches, the complexity of designing a website from scratch has increased vastly: in practice, developing a site in this way, certainly for someone like me, is no longer an option. Most developers — and certainly pretty much _all_ designers now use [frameworks](https://en.wikipedia.org/wiki/Web_framework). So the new design that went into production on this website this week is a completely different kettle of fish from the previous one:

- rather than being written from scratch, it was developed using the [Genesis framework](https://my.studiopress.com/themes/genesis/), which I believe to be currently the best — with [Divi](https://www.elegantthemes.com/documentation/developers/divi-development-environment/) certainly coming a close runner-up — environment[^2] for WordPress;
- I designed the theme deployed on this website using WordPress’s [child theme](https://codex.wordpress.org/Child_Themes) functionality, and the Genesis framework, in just a few days using [Espresso](https://espressoapp.com), [Sketch](https://www.sketchapp.com) and [Affinity Designer](https://affinity.serif.com/en-us/designer/)[^3];
- after twelve years of continuously hosting all my online content with [Media Temple](https://mediatemple.net)[^4], I decided to move the hosting of this website to [Kinsta](https://kinsta.com/plans/?kaid=ZGEANXECLFOU), a small but fast-growing host specialising in hosting only WordPress sites, which I believe to currently be the best host available for the developer-minded[^5];
- the [environment](https://kinsta.com/advanced-features/) used by Kinsta (Nginx, PHP 7, HTTP/2, LXD software containers, MariaDB, and full page caching at the server-level, all deployed using Google [Cloud Platform](https://cloud.google.com))[^6], results in lightning-fast speeds that simply weren’t technically possible using my previous private server at Media Temple.

{{% alert info %}}

## Update

1. In April 2019, I switched from Genesis to [GeneratePress](https://generatepress.com), a pretty amazing, lightweight, very fast theme.
2. In May 2023, I migrated from WordPress to Hugo.
   {{% /alert %}}

Another major change I’ve implemented is merging the About page with the Home page. For a while now I’ve felt that a home page in a personal website served no useful purpose, other than as an index of one’s site. Keeping a separate About page actually results in ambiguity as to where {{% quote %}}about me{{% /quote %}} type links should be sent: to the Home page, since the whole site is really {{% quote %}}about{{% /quote %}} one, or specifically to the About page? Without going to the extreme of making my site a one-page affair, the [Home page](:) now has some more serious content. At the same time, the rest of the site is significantly stripped-down, with just two main areas: [Articles](/articles) (rather than {{% quote %}}blog posts{{% /quote %}}) and [Photos](/photos). I’ve also removed quite a few old articles, in order to thin out the content.

I promise to write more regularly, on the same variety of subjects as in the past, for now on as I embark on a series of very exciting new personal projects.

[^1]: The new Home page, which doubles up as the About page.
[^2]: WP Beginner wrote an instructive [post](https://web.archive.org/web/20210116181039/https://winningwp.com/genesis-vs-divi-how-to-decide-which-to-choose/) outlining the differences between Genesis and Divi.
[^3]: To put this in perspective, designing the previous theme, the Belgravia theme, literally from scratch took me several weeks in 2012.
[^4]: Media Temple is still an exceptionally good web host, especially for developers who want complete control over their working environment and feel comfortable with the command line. Its support team, all based in California, are one of the best in the industry. But it has gone a long way from its nimble beginnings. It was [acquired](https://mediatemple.net/blog/2013/10/15/faqs-about-the-godaddy-acquisition/) by GoDaddy in 2013, while its hosting is still superb, it hasn’t been in a position to move as fast as the rest of the industry in the last few years.
[^5]: Kinsta has not disappointed me since I made the switch. Their support team are professional, passionate about WordPress and extremely flexible.An excellent alternative to Kinsta, for those preferring a larger structure, is [WP Engine](https://wpengine.com/), which also specialises in the WordPress niche but has around 800 employees, compared to Kinsta’s thirty-odd.
[^6]: This is very different from traditional shared, VPS, or dedicated infrastructure: it utilises virtual machines in one of Google Cloud Platform’s multiple data centers. Each machine has up to 96 CPUs and hundreds of gigabytes of RAM. Hardware resources (RAM/CPU) are allocated to each site container automatically, as needed. Kinsta utilizes LXD managed hosts and orchestrated LXC software containers for each site. What this means is that every WordPress site is housed in its own isolated container, which has all of the software resources required to run it (Linux, Nginx, PHP, MySQL). The resources are 100% private and are not shared. And MySQL databases are hosted at localhost, not a remote server. This ensures that there is no latency between machines.
