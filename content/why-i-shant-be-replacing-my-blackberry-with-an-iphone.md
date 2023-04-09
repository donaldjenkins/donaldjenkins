---
title: 'Why I shan’t be replacing my BlackBerry with an iPhone'
date: '2007-06-07T18:46:02+00:00'
status: private
permalink: /why-i-shant-be-replacing-my-blackberry-with-an-iphone
author: donaldjenkins
excerpt: ''
type: post
id: 360
category:
    - Tech
tag:
    - Apple
    - BlackBerry
    - email
    - Gmail
    - iPhone
    - Mail
post_format: []
aktt_notify_twitter:
    - 'yes'
    - 'no'
wp_criticalcss_cache:
    - ''
---
Stories have been rife on the web of people waiting to queue up to buy iPhones on June 29, when Apple releases the product. I was interested to see that [Paul was not planning to get one](http://paulstamatiou.com/2007/06/04/iphone-on-june-29th-but-not-for-me/ "Read why Paul is not buying an iPhone") despite being about as much of an Apple fanatic as I am. He’s planning to get a BlackBerry Curve instead. While I personally prefer the [BlackBerry Pearl](http://www.blackberrypearl.com/ "More on the BlackBerry Pearl"), which I have been using since Christmas, because it’s smaller than the Curve and I value space, it’s basically the same phone with a slightly different keyboard using SureType, a brilliant text entry recognition system far superior to T9, the system often found on other phones. In my view, the full QWERTY keyboard offered by the Curve isn’t worth the loss in portability.

More to the point, though, is why I won’t be buying an iPhone. The reason, in my case, is data synchronisation. The main point of having a smartphone is that the data it uses is up to date. I did extensive research into what the best system was for a Mac user who, as I, was also a reluctant Windows user at the office and needed to access his data from both locations *and* on his phone. I initially assumed synchronisation tools were the answer and that I would be able to run several sets of data (Exchange via Outlook at the office, Mac application such as Address Book and iCal at home and Google calendar because I wanted to use that as well) and synchronise them using the various web or desktop-based tools available when you [Google](http://www.google.com/search?q=sync+outlook+ical+gmail&ie=utf-8&oe=utf-8&rls=org.mozilla:en-US:unofficial&client=firefox-a "Links when googlizing iCal, Outlook and Gmail synchronisation") synchronisation between all the above. I tested several of these and found that with the exception of the [CompanionLink for Google Calendar](http://www.companionlink.com/products/companionlinkforgoogle.html "More on the CompanionLink for Google Calendar"), a Windows, desktop shareware application that reliably synchronises your Google calendar with Microsoft Outlook, but doesn’t run in background mode, none of these solutions worked. Usually, they generate duplicates and in number of cases, they actually cause severe data corruption. I actually had to manually repair my data files on one occasion, which wasn’t fun at all.

The best solution, therefore, is keeping all your data (contact details, calendar items, emails and tasks) in one place and accessing them from whatever platforms you need to work from. In my case, I needed to access my data from three different platforms: Microsoft Outlook on Windows at the office, Mac OSX at home and from my mobile phone. I needed a setup that would allow me to store and access and synchronise all my data from all those different places. I also didn’t want to have to bother with physical synchronisation: I was determined to rule out having to use cables to get my data up to date. Since over-the-air (OTA) synchronisation was available, I wanted to use it.

Eventually, I found that only the BlackBerry, combined with a [BlackBerry Enterprise Server](http://na.blackberry.com/eng/services/server/exchange/ "More on the BlackBerry Enterprise Server") and a Hosted Microsoft Exchange Server from [Mailstreet](http://mailstreet.net/exchange/whymailstreet.asp "More on Hosted Microsoft Exchange Servers at Mailstreet") running on my own domain, jenkins.fr, and a data plan from my phone operator would meet my needs:

- only Exchange can be accessed directly from both Windows (via Outlook) and Mac OSX (via Entourage) environments;
- only BlackBerry phones are designed to sync seamlessly, instantly and over-the-air with Exchange servers;
- because I wanted to access my emails from within Gmail as well, I added a POP access to my Exchange mail server to my hosted Gmail account.

For those who want it, [Address Book](http://www.apple.com/macosx/features/addressbook/ "More on Address Book") can be synced with Exchange via the application’s preferences.

There is no way, in the short term, that the iPhone is going to offer all those features. It will sync, presumably over-the-air, with the various Mac office applications (Address Book, iCal, Mail), but that won’t be much use to those who need access to their data from the Exchange/Windows environments that predominate in most offices today. If your secretary can’t synchronise her calendar with yours, your smartphone becomes useless. If and when this changes and plugins emerge to reliably sync the iPhone with Exchange (but given the bugs that have plagued all attempts to do anything similar so far, I doubt this will be an easy task), I might consider getting an iPhone.

In the mean time, I’ll be keeping my Pearl. It’s so small I can easily accommodate an iPod in my other pocket.