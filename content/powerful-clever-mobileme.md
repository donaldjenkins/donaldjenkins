---
title: 'Powerful clever MobileMe'
date: '2008-08-21T02:58:34+00:00'
status: private
permalink: /powerful-clever-mobileme
author: donaldjenkins
excerpt: "I’m really pleased with MobileMe. It’s alone in offering an OSX based, centralized personal data center for calendar, contact and email that can be accessed by any desktop, web or mobile device client and push data pretty well instantly in all directions.\n\nThe initial MobileMe glitches, which are evidence, not that the product was badly designed, but just that its launch was not prepared sufficiently, are trivial in comparison with the unique power it offers.\n\nI’m hoping that its two glaring faults, lack of support for own-domain email and poor spam management, will be ironed out in the next release."
type: post
id: 67
category:
    - Tech
tag:
    - Apple
    - email
    - Exchange
    - iPhone
    - Mac
    - MobileMe
    - push
post_format: []
aktt_notify_twitter:
    - 'no'
lead_image:
    - 'https://www.donaldjenkins.com/images/2008/08/h1-mobile-me.jpg'
secondary_image:
    - 'https://www.donaldjenkins.com/images/2008/08/h2-mobile-me.jpg'
wp_criticalcss_cache:
    - ''
---
Update April 19, 2010: I no longer use the configuration described in this article. MobileMe felt like deliverance from evil after tinkering with Microsoft Exchange—but it has irritating issues of its own that Apple, which isn’t interested in delivering a credible cloud package, has done nothing to redress. I’ve now switched to Google Apps servers for everything, except for contacts and written an [updated post on my 2010 configuration](https://www.donaldjenkins.com/steve-ignores-the-cloud-at-his-peril-why-i-chose-google-apps-over-mobileme-as-a-server-for-my-email-contact-and-calendar-data/ "Steve ignores the cloud at his peril: Why I chose Google Apps over MobileMe as a server for my email, contact and calendar data").

Just over a month after the launch of Apple’s [MobileMe](http://mobileme.com "More on MobileMe") cloud computing suite, I have been using the service, coupled with the new iPhone 2.0 software, sufficiently to make an initial assessment, which will be mainly of the software side of things as the new iPhone actually doesn’t offer much over its predecessor in terms of hardware[§](#bfn-footnotes-140). I’m writing this at a time when everyone is slamming Apple for the technical glitches that accompanied the launch, but I actually totally disagree: if you compare MobileMe with the competition, it’s actually innovative, modern and distinctly promising—which doesn’t mean it has no room for improvement.

The arrival of push is just an extra bonus over the fact that MobileMe is the only personal data management system that integrates natively and seamlessly with Macs and can be used to pull IMAP from any other mail account
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Back in November when the iPhone was launched in France, I decided to switch to the iPhone from my Exchange-based Blackberry. My reasoning then was as follows:

1\) Synchronizing data between any mobile device and the Mac had always been asking for trouble[§](#bfn-footnotes-140); so any device designed from scratch to work seamlessly with the Mac was bound to have *huge* bonus value for just that reason;

2\) Because of Google’s recent (and belated) switch to full IMAP support, accessing a Gmail or [Google Apps](http://www.google.com/apps/ "More on Google Apps") domain account from several different clients became a viable proposition;

3\) The lack of push was the main downside to the switch from an Exchange/Blackberry combo to a Google Apps/iPhone one; this wasn’t actually an issue for email, since the iPhone 1.0 could be set to *pull* mail at fifteen-minute intervals[§](#bfn-footnotes-140); it *was* a problem with Contact and Calendar data, which I knew I could only sync by physically connecting a cable to *one* of the several Macs I used at that time.

On balance, while I couldn’t understand why Apple hadn’t provided it, I felt the loss of push sync for Contacts and Calendar was a price worth paying for getting rid of the bloated, old-fashioned, heavy-handed Exchange server that I needed to pay for to run push services on my Blackberry. I closed my Exchange account, transferred the data from my domain’s email account to a new Google Apps account with the same domain, my Contacts to Apple’s Address Book and my appointments to iCal and have been using the corresponding desktop and iPhone apps happily ever since.

MobileMe and the iPhone version 2.0 provide a more powerful, simple and coherent personal data platform than any other available for the same price
---------------------------------------------------------------------------------------------------------------------------------------------------

Nine months later, .Mac’s transformation into MobileMe, coupled with the upgrade to the iPhone 2.0 software, has actually provided me with everything I wanted:

1\) it puts all my contacts in one place; in sharp contrast to Microsoft’s closed-ended Exchange, Apple’s unified Address Book turned contact management into a streamlined OS-level service that was able to later tie into Sync Services[§](#bfn-footnotes-140) and be used by all my desktop applications;

2\) in Mac OS X Leopard, Apple added a centralized calendar store that does for events what Address Book did for contacts; in contrast, Windows Vista also now offers a centralized Windows Calendar, although it does not seem to be finished yet, and neither iTunes nor Vista’s native sync for Windows Mobile can sync to it.

3\) the MobileMe cloud means all these data are kept in one place, can now sync in the background and be accessed from any desktop or iPhone client or from its rather elegant webmail interface.

A frequently overlooked fact is that Apple *also* pushes messages to subscribers’ desktop email, as well as to Address Book and iCal on the Mac OS X desktop. This is still quite a unique feature for any service provider to offer, particularly to consumers. Microsoft’s Hotmail, Google Gmail, and Yahoo Mail all offer push email-only services for mobile users, but nobody currently offers low cost push email, contacts, calendar, and bookmark support as MobileMe does[§](#bfn-footnotes-140).

Critics of MobileMe have been quick to point out that users currently may have to wait up to fifteen minutes for their desktop apps to sync with the cloud, although an immediate sync can be initiated manually as well. And of course, they forget that BlackBerry’s BlackBerry Enterprise Server does not push messages to desktop email, calendar, or contact apps, which MobileMe *does*. Those who complained about downtime are equally disingenuous: even Gmail, that iconic-status web application, frequently suffers downtime, well in excess of the 99.9% uptime they promise to deliver to Premier customers such as myself[§](#bfn-footnotes-140).

Two improvements are needed to MobileMe and the iPhone: using your own domain for email and better spam control
---------------------------------------------------------------------------------------------------------------

MobileMe and the iPhone are still very much work in progress. Just to put in perspective how quickly they have gone, though, AppleInsider, in a [rather incisive and well documented article](http://www.appleinsider.com/articles/08/08/13/inside_mobileme_iphones_exchange_alternative_for_contacts_and_calendar.html "Read Appleinsider's article on MobileMe"), reminds us that:

> In comparison, Microsoft’s Exchange Server began limited internal testing in 1993, and was only launched publicly in the middle of 1996. It would have been a real stretch to describe it as a reliable product anyone could be proud of until at least four and a half years later with the year end release of Exchange Server 2000.

For me aside from some glaring omissions in the actual iPhone software itself (notably the lack of cut-and-paste, which I had used a *lot* on my BlackBerry and is the only thing about it that I am actually missing), the *most* frustrating drawback of MobileMe is one no one has seemingly complained about: no support for using its mail service with your own domain. You can point a domain to content hosted on your MobileMe server[§](#bfn-footnotes-140). But you can’t configure your mobileMe mail to use me@mydomain.com instead of me@me.com. That puts Apple *way* behind Google or Exchange. When I grew fed up with Exchange, I simply changed my DNS and switched to Google, losing no email in the process and keeping the same address. If I ever tire of Google, i will be able to do the same. In contrast, Apple’s email offer ties subscribers who actually use the service to the @me.com address, meaning they are just as locked in as users of free services such as Hotmail or the @gmail.com version of Google mail. This didn’t really matter very much to me before Apple introduced push. But now it does, because lack of push for IMAP mail accounts on the iPhone means I have to set my phone to *pull* mail at frequent intervals, which is costly in service resources. It would make much more sense if i could host all my email on MobileMe using my own domain, which would allow me to actually stop using Google altogether.

The second major drawback (apart from minor glitches in the software which will be ironed out with future revisions) is the iPhone’s poor handling of spam. MobileMe includes a spam filter, which actually doesn’t do a hugely good job. Apple Mail, the Mac desktop client, adds another layer to this with its Junk Mail feature, allowing users to set rules which eventually, once the application has learnt them, enable them to control spam to an acceptable degree. Preferences for junk mail are synced between a user’s various Macs using MobileMe. But oddly enough, there is no synchronization between Mail’s junk mail settings and the actual MobileMe’s mail server’s, meaning that any mail client accessing the server, and of course the MobileMe webmail client itself, will remain dependent on the much poorer server spam control system (which is certainly much inferior to Gmail’s). This causes most bewilderment on the iPhone: mail from senders known to be junk will happily sit in my iPhone me.com inbox and will immediately be sucked away by the junk mail rules when I open Apple Mail on my Mac. I suspect it may be technically challenging for Apple to integrate the desktop Mail junk rules with MobileMe’s spam filter. But I do feel it is badly needed.

<div class="bfn-footnotes" data-container="" data-post-id="140" id="bfn-footnotes-140" style="display: none;">### References


</div>