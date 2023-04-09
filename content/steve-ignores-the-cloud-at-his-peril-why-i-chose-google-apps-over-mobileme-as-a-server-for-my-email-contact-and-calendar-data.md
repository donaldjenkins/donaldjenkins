---
title: 'Steve ignores the cloud at his peril: Why I chose Google Apps over MobileMe as a server for my email, contact and calendar data'
date: '2010-04-19T18:47:17+00:00'
status: private
permalink: /steve-ignores-the-cloud-at-his-peril-why-i-chose-google-apps-over-mobileme-as-a-server-for-my-email-contact-and-calendar-data
author: donaldjenkins
excerpt: 'MobileMe felt like deliverance from evil after tinkering with Microsoft Exchange—but it has irritating issues of its own that Apple, which isn’t interested in delivering a credible cloud package, has done nothing to redress. Google Apps, which was only usable for email when I switched to MobileMe in 2008, has quietly improved the reliability and power of its data server systems and made them totally compliant with the Mac, iPhone and iPad. I''ve now switched to Google Apps servers for everything, except for contacts, for the time being, because they''re still in beta and can only be synced with the iPhone via Microsoft Exchange, which produces rather haphazard results. Email uses IMAP and calendar event sync via CalDAV.'
type: post
id: 911
category:
    - Tech
tag:
    - 'Address Book'
    - Apple
    - calendar
    - cloud
    - contacts
    - email
    - Gmail
    - Google
    - 'Google Apps'
    - iCal
    - MobileMe
post_format: []
aktt_notify_twitter:
    - 'yes'
aktt_tweeted:
    - '1'
swp_pinterest_image_url:
    - ''
swp_open_graph_image_data:
    - 'false'
swp_open_graph_image_url:
    - ''
swp_cache_timestamp:
    - '432245'
hefo_before:
    - '0'
hefo_after:
    - '0'
wp_criticalcss_cache:
    - ''
---
Keeping your data in the cloud, to use a current phrase that people don’t always clearly understand, actually means storing your data on a web-based server and accessing the data via the Internet using any combination of desktop and mobile clients. The point of cloud computing, if you use Apple hardware (a Mac at home, a laptop, an iPhone and maybe an iPad), is keeping your data in sync, seamlessly, without having to worry about where you edit your information. I’ve been doing this ever since I first set up my own Microsoft Exchange server—which at that time was the only way of doing it—in 2006. This worked very well with the Blackberry phone I was using at the time; but getting it to sync with my Mac required a series of tiresome compromises and hacks, including using Entourage as my desktop client.

MobileMe felt like deliverance from evil after tinkering with Microsoft Exchange—but it has irritating issues of its own that Apple, which isn’t interested in delivering a credible cloud package, has done nothing to redress
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

It’s now nearly two years since Apple brought out iPhone OS 2.0, which brought over-the-air synchronisation, via [MobileMe](http://www.apple.com/mobileme/ "Apple - MobileMe - Your iPhone, iPad, Mac, and PC. In perfect sync."), to its email, contacts and calendar items. I was able to [ditch Microsoft’s ghastly, outdated proprietary products for ever](https://www.donaldjenkins.com/heres-why-i-ended-up-switching-to-an-iphone-after-all/ "Why I ended up switching to an iPhone after all") and have been using Apple’s [free desktop apps](http://apple.com/ical "Apple - Mac OS X - What is Mac OS X - Mail, iCal, Address Book"), Address Book and iCal, as clients for my contacts and calendar items. Since 2008, [I have been syncing them over-the-air with their iPhone equivalents via MobileMe](https://www.donaldjenkins.com/powerful-clever-mobileme/ "Powerful, clever MobileMe"). As I explained at the time, I haven’t been using MobileMe for email, because it can’t be configured to run on your own domain and because of its grossly inadequate handling of spam. Instead, I’ve used [Google Apps](https://www.google.com/a/ "Google Apps") for email, which I chose to deploy on my own domain using Google’s $50/year [Premier Edition](http://www.google.com/apps/intl/en/business/details.html "Reduce IT costs, get less spam, and improve productivity - Google Apps for Business").

I’ve been reasonably happy with this arrangement, although having perfect sync between my contacts and calendars using native Apple software, while preserving data perfectly, comes at a cost:

- first, there’s a financial cost: MobileMe costs $99/year, which is outrageously expensive considering how bad its email is, meaning that, in effect, is what I pay every year, just to sync my contacts and calendar items;
- second, there *have* been issues with MobileMe: although the service has steadily got more reliable, has shown reasonable uptime and I haven’t experienced data loss, my main gripe is the appalling slowness of the sync process on OSX: MobileMe appears to be perpetually in sync and consumes a vast amount of CPU.

I’ve also been rather annoyed that over the past two years, while Apple has been allocating resources massively to iPhone and iPad development, it has largely neglected its existing software portfolio. Apple’s mastery of servers has always been haphazard at best: its .Mac service which was MobileMe’s direct ancestor and which I had used since I switched in 2003, was a notorious underperformer. I suspect the root of these problems lies in a combination of outdated software, ported from previous system versions, and inadequate scaling. But I basically had to put up with this, because although MobileMe didn’t do the job very well, it *did* sync my contacts and calendars, and I could bypass its unusable mail feature by using Google Apps. And anyway, I was effectively locked in by the lack of any viable, equally reliable and efficient alternative.

Google Apps, which was only usable for email when I switched to MobileMe in 2008, has quietly improved the reliability and power of its data server systems and made them totally compliant with the Mac, iPhone and iPad
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

While Apple ignored the cloud and focused everything on creating newfangled, shiny pieces of hardware, however, Google was busy improving the compatibility of its server applications with Apple’s desktop and mobile clients. At the end of last year, Google introduced a number of improvements to its [Gmail](mail.google.com/ "Gmail: Email from Google"), [Google Calendar](http://www.google.com/calendar "About Google Calendar") and Contacts applications:

- [Google Mail can now push](http://gmailblog.blogspot.com/2009/09/push-gmail-for-iphone-and-windows.html "Official Gmail Blog: Push Gmail for iPhone and Windows Mobile") your email and appointments to the iPhone if you configure it using Microsoft Exchange sync rather than IMAP[§](#bfn-footnotes-140);
- [Address Book contacts can be synced with Google Contacts](http://www.google.com/support/contactsync/bin/answer.py?hl=en&answer=92997 "Google ContactSync help page") and/or MobileMe[§](#bfn-footnotes-140);
- You can now have full access to Google Calendars from both iCal (on your Mac) and the iPhone Calendar app.

Given that Apple has basically done nothing to improve its partly deficient cloud apps, it made sense, two years after I started using MobileMe, to see whether I should switch my contacts and calendar to Google.

I’ve decided to switch my calendar server to Google, using my Apple apps on my Macs and my iPhone as servers. It makes sense to keep my email and my calendar on the same server anyway. [Configuring iCal to do this](http://www.google.com/support/calendar/bin/answer.py?hl=en&answer=99358#ical "Congiguring iCal to act as a client for Google Calendar") is childishly simple:

It’s easy to set up Calendar on your iPhone as a mobile over-the-air client for your Google Calendar. On your iPhone, go to Settings &gt; Mail, Contacts, Calendars &gt; Add Account &gt; Other &gt; Add CalDAV Account.

Now every time you add an event to your iPhone calendar, it will sync with your calendar on Google’s servers and with iCal on all your Macs, and vice versa. You obviously need to have Internet access from your iPad or iPhone for the data to sync.

Google Calendar today is far superior to Apple’s Calendar:

- it can be set to [send SMS reminders to my phone from the server](http://www.google.com/support/calendar/bin/answer.py?hl=en&answer=37242 "Google Calendar Help: Customize your notifications"), which is much better than having them unleashed by the calendar *client*, meaning alarms will sound—and have to be set off—on all your devices at once[§](#bfn-footnotes-140);
- it handles invitations natively at server level too, and because of the large number of people using Google it does so much better than Apple;
- Google Calendar works seamlessly with Google Maps, meaning when you open a calendar item in the web interface, it will automatically link to your event’s location;
- more generally, the web interface for Google Apps has considerably improved in the past two years, while MobileMe’s has stood still. A number of [Gmail Labs](http://mail.google.com/mail/?ui=2&fs=1&view=pu&st=labs "Gmail Labs") features have been made permanent and customization options are now practically endless.

So I’ve now switched my calendar server to Google—accessing it, as before, via the iPhone and Mac clients—leaving only my contacts to sync on MobileMe: the reason I haven’t switched contacts to Google is because Google’s contacts feature, which syncs very well with Address Book, is still buggy with the iPhone; some data gets lost and the number of phone numbers you can associate with each contact is limited.

I chose to leave my email to sync from the iPhone with Google via [IMAP](http://en.wikipedia.org/wiki/Internet_Message_Access_Protocol "Internet Message Access Protocol - Wikipedia, the free encyclopedia"): I find Microsoft Exchange slower and less reliable: it doesn’t properly sync labels, for instance. For the same reason, I sync the iPhone’s Calendar app with Google using the [CalDAV](http://en.wikipedia.org/wiki/CalDAV "CalDAV - Wikipedia, the free encyclopedia") Account option.

Eventually, once Google’s sync with iPhone contacts goes out of beta, I’ll be able to dispense with MobileMe altogether. I have no use for its storage feature, since [Dropbox](https://www.dropbox.com/ "Dropbox - Home - Online backup, file sync and sharing made easy.") does a better job at for a much cheaper price; and MobileMe’s residual sync services[§](#bfn-footnotes-140) are either dispensable or available more cheaply elsewhere. I’m about as loyal an [Apple fanboi](http://osx.iusethis.com/user/astorg "Mac apps I use") as you can get. But MobileMe’s performance relative to the competition, meaning mainly to Google, has been such a combination of complacency and mediocrity that I now can’t wait to finally pull the plug on our seven-year relationship.

<div class="bfn-footnotes" data-container="" data-post-id="140" id="bfn-footnotes-140" style="display: none;">### References


</div>