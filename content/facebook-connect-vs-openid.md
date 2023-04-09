---
title: 'Facebook Connect vs. OpenID'
date: '2009-01-15T08:35:21+00:00'
status: private
permalink: /facebook-connect-vs-openid
author: donaldjenkins
excerpt: 'I have decided to implement Facebook Connect on this site, instead of OpenID which seems to be confusing users rather than helping them. The Facebook Connect system is still in its infancy, but the range of potential applications is breathtaking.'
type: post
id: 775
category:
    - Tech
tag:
    - blogging
    - 'Facebook Connect'
    - OpenID
    - 'social networks'
    - WordPress
post_format: []
aktt_notify_twitter:
    - 'no'
lead_image:
    - 'https://www.donaldjenkins.com/images/2009/01/h1-facebook-connect.jpg'
secondary_image:
    - 'https://www.donaldjenkins.com/images/2009/01/h2-facebook-connect.jpg'
wp_criticalcss_cache:
    - ''
---
There is an obvious need for an easy, cross-platform secure login and identification system to replace the cumbersome systems implemented on individual blogger sites
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

Login and identification systems on the web are a fast-evolving topic. When I first started blogging in 2005, the option for an individual web actor were pretty simple: you chose a content management system (I started with [Typepad](http://www.typepad.com/ "Blogging Software, Business Blogs & Blog Services at TypePad.com") and quickly switched to a self-hosted [WordPress](http://wordpress.org/ "WordPress › Blog Tool and Publishing Platform") blog) and any visitors to your site would have to enter their details (Name, email address and, optionally, website) in order to comment. If this feature was set, they could also register as one of the identified users whose details would be stored in the log database.

For a while, OpenID looked as if it could provide that system, but its complexity, especially its use of URLs instead of email addresses or logins, has baffled many potential users
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Having to remember a huge number of passwords[§](#bfn-footnotes-140) is very tiresome. This is where [OpenID](http://openid.net/ "OpenID") came in. By setting a standard for users to register their credentials on a trusted third-party site that enabled OpenID, the same credentials can be used to login any other sites that also enable OpenID.

In practice, however, OpenID has turned out to be [too complex for most users](http://www.webmonkey.com/blog/OpenID_Is_HereDOT_Too_Bad_Users_Can_t_Figure_Out_How_It_Works "OpenID Is HereDOT Too Bad Users Can t Figure Out How It Works - Webmonkey"). A lot get confused by the fact that they are required to identify with a URL rather than an email address or user name. The wide range of systems and the lack of a clear, centralised set of procedures has probably deterred most people from the new system. To add to the apparent pointlessness of OpenID, it is in practice not possible to bring any of your personal information with you when you login with it.

Facebook Connect offers bloggers, as well as larger sites, a robust, secure login system opening up access to a 150 million-strong user base together with the information they keep on their profiles
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Enter [Facebook Connect](http://www.facebook.com/news.php?blog=1&story=108 "Facebook Developers | Facebook Developers News"). With its exponentially-growing base of users (150 million at the time of writing), a very high percentage of whom log into their accounts every day and its reputation for taking security and identification issues seriously, Facebook was ideally placed to step in with its own system. Since a lot of bloggers will already have, or be in a position to acquire, a set of exiting or potential readers for their blog out of their Facebook friends, there is an obvious incentive to ditch OpenID in favour of Facebook Connect[§](#bfn-footnotes-140)

I had actually enabled OpenID on my site when I revamped it in July 2007. Since then, however, of the very few commenters who left comments[§](#bfn-footnotes-140), not one ever used OpenID. So after exploring Facebook Connect and testing it for a few days on one of my sites, I decided to implement it on my site, via a dedicated [Facebook application](http://www.facebook.com/apps/application.php?id=45407042147 "Dedicated Facebook application") used only for that purpose:

![Facebook application details](http://cloud.donaldjenkins.com/images/blog-posts/facebook-connect-1.jpg)

These are still early days, and while [Facebook’s API](http://forum.developers.facebook.com/viewforum.php?id=35 "Facebook Developers") supports Facebook Connnect in a very robust, cleverly designed way, few providers have yet implemented it in an intelligent way. I tested three solutions:

1\) direct implementation by inserting the appropriate code and javascript in my site using this [Facebook tutorial](http://mashable.com/2008/12/11/facebook-connect-blog/ "Facebook Connect tutorial"); this actually worked for me in Facebook’s sandbox, but not on my own [Mediatemple](http://mediatemple.net/ "(mt) Media Temple - Web Hosting Built to Scale.") server;

2\) the [Facebook WordPress plugin](http://wordpress.org/extend/plugins/wordbook/ "Facebook WordPress plugin") and the [Sociable! Facebook Connect WordPress Plugin](http://www.sociable.es/facebook-connect/ "Facebook Connect WordPress Plugin - Sociable! - The Social Media Blog"), both of which work reasonably well and can of course be tweaked, I found too obtrusive in their out-of-the-box form to suite my ultra-minimalist site; but they are worth checking out for the more flamboyant;

3\) the solution I ultimately chose was integration *via* the [DISQUS comment system](http://disqus.com/ "DISQUS | Turn Blog Comments into a Webwide Discussion with a Powerful Comment System"); this was a little buggy in its initial implementation, but version 2, available since December 2008, appears stable and does not lock you into the system as your comments continue to be synced with your blog’s hosted database:

![Facebook Connect comment box](http://cloud.donaldjenkins.com/images/blog-posts/facebook-connect-2.jpg)

Although it’s too early to tell whether many Facebook members will be logging into the site using Facebook Connect, I think OpenID’s growth, which was already hindered by the lack of user-friendliness, will be further cannibalised by Facebook Connect, because the latter is so dead-easy to use:

![ectomorphic-vicissitudes-login-window.jpg](http://cloud.donaldjenkins.com/images/blog-posts/facebook-connect-3.jpg)

It’s easy to see how synergy between Facebook and the sites that enable the new login system could evolve in all sorts of exciting ways, with users free to allow—or not—partner sites to be provided with information from their profiles to populate and sync with their third-party profiles. The advantages and wide potential fields that it could be applied to are considerable.

In the meantime, it’s worth reminding anyone who hasn’t done so already to secure their Facebook data by choosing a unique, [secure password](http://www.google.com/search?client=safari&rls=en-us&q=secure+password&ie=UTF-8&oe=UTF-8 "Getting a secure password").

<div class="bfn-footnotes" data-container="" data-post-id="140" id="bfn-footnotes-140" style="display: none;">### References


</div>