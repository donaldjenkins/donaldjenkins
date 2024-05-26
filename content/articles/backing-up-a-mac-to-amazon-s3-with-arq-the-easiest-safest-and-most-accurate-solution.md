---
title: "Backing up a Mac to Amazon S3 with Arq: the easiest, safest and most accurate solution"
categories: ["Tech"]
tags:
  [
    "Amazon S3",
    Apple,
    Arq,
    Backblaze,
    backup,
    ChrashPlan,
    "Jungle Disk",
    Mac,
    Mozy,
  ]
seoTitle: "Donald Jenkins: Backing up a Mac to Amazon S3 with Arq: the easiest, safest and most accurate solution"
date: 2010-11-21T05:44:09+00:00
type: articles
notable: false
layout: "single"
slug: "backing-up-a-mac-to-amazon-s3-with-arq-the-easiest-safest-and-most-accurate-solution"
draft: false
description: "Using Amazon S3, in combination with Arq, provides a much more reliable alternative to backup and restore from a Mac."
summary: "Mac is among the most difficult systems to backup and restore correctly: Macs have peculiarities; resource forks and packages, for example, are unique to the Mac, and not every service handles them well. My experience of the more popular commercial backup services has not been good: they're unreliable, slow and raise privacy and data safety concerns. Using Amazon S3, in combination with a robust yet simple backup tool provided by small startup Arq, which I've just discovered, provides a much more reliable alternative."
featured_image: "3dab134c-059d-4842-34e0-093cd85a8d00"
author: "Donald Jenkins"
showthedate: false
tableofcontents: false
noindex: false
---

Mac is among the most difficult systems to backup and restore correctly: Macs have peculiarities; [resource forks](https://en.wikipedia.org/wiki/Resource_fork) and [packages](https://web.archive.org/web/20090327025909/https://www.macosxtips.co.uk/index_files/peek-inside-mac-os-x-packages.html), for example, are unique to the Mac, and not every service handles them well.

Few people pay much attention to this until they experience data loss through hardware damage, material error, theft or some other act of God the consequences of which can prove impossible to repair.

The characteristic reaction to this, by many users, is simply to ignore the issue altogether and bank on the fact that data loss is unlikely to occur. This is the digital equivalent of driving uninsured or opening a undeclared bank account at a Latvian bank: it can seem a clever idea at the time, but time seldom stands still when risk-taking is involved.

So what backup service to choose? To help one with this, there is a great tool called [Backup Bouncer](https://web.archive.org/web/20150414094852/https://www.n8gray.org/code/backup-bouncer/) that can be used to verify metadata backup and restore for Mac backup software.

## Using Time Machine or Apple’s Time Capsule exposes one to unacceptable risks

Of course you can always use Apple’s [Time Machine](https://www.apple.com/macosx/what-is-macosx/time-machine.html) to create a copy of your data. Time Machine was somewhat buggy and slow in Mac OS X Leopard 10.5. For example, it would say {{% quote %}} preparing backup{{% /quote %}} forever. In Mac OS X 10.6 Snow Leopard, Time Machine is admittedly much faster and more reliable too. Nevertheless, a Time Machine backup drive must remain attached to the computer, or relatively near it. Therefore, it’s exposed to the same risks as the computer: theft, fire, flood. Not something I would want to trust.

Apple offers its own in-house [network-attached storage](https://en.wikipedia.org/wiki/Network-attached_storage) backup device, [Time Capsule](https://www.apple.com/timecapsule/), to use in conjunction with Time Machine: one of its key features is the ability to back up a system and files wirelessly and automatically, which eliminates the need for a separate external drive to be attached. In October 2009, several news sites reported that many Time Capsules were failing after eighteen months. Users have alleged that this is due to a design failure in the power supplies; Apple has [confirmed](https://support.apple.com/kb/TS3351) that certain Time Capsules sold between February 2008 and June 2008 do not power on or may unexpectedly turn off and has offered free repair or replacement to affected units. The risk of using Time Capsule remains, to my mind, unacceptable, as witnessed by the continued existence of the [Apple Time Capsule Memorial Register](https://www.zdnet.com/article/owners-set-up-online-memorial-to-dead-apple-time-capsules/), in witness to all the defunct devices that perished in active service. The same, in reality, is true of any external drive: I’ve owned several, and not a single one of them has not failed me eventually, occasioning data loss. In fact, horror stories about Time Capsule are so numerous that I haven’t been even remotely tempted to try one out, ever. Here’s [one from TUAW](https://web.archive.org/web/20100713172212/https://www.tuaw.com/2010/07/09/my-trip-through-time-capsule-hell-leads-to-a-different-backup-ap/) taken as an example:

> Working with Time Machine in Leopard or Snow Leopard, the Time Capsule updates its backups every hour. This makes perfect sense if you’re just dealing with one Mac wired into the Time Capsule, since it really doesn’t slow anything down. But if you are using it to wirelessly back up multiple Macs, hourly backups slow everything down to a crawl.

TimeMachineEditor (a free utility that I highly recommend), allows you to set Time Machine to back up as frequently or infrequently as you like. I created a setup where, with staggered backups starting between 2am and 4am, each Mac gets backed up once a day. Outside of some errant sparse image problems that required a reformat, all was well. I had long beaten the 18 month Time Capsule funerals that were recently reported… but then things turned ugly.

About two weeks ago, my Time Capsule died, taking my home network down with it. The next day I went to the Apple Store and bought a replacement. I was quite unhappy that many months of backups were gone, but machines do break. I brought the new unit home and configured it. In less than 10 minutes, I was up and running … for a week. Then my unit died again. The Time Capsule showed a solid amber light that could not be corrected with a factory reset. After replacing the cable modem, and being able to successfully plug it into my iMac, the problem persisted. I went through another two Time Capsules that would not complete the start-up sequence.

Although strange, the problem seemed to be the power feeding the Time Capsule. All other devices on the same circuit worked fine, but it took a dedicated power line devoted to the Time Capsule for everything to work properly. This may be related to power issues that impaced many users, or maybe not. It seems that power fluctuations that any other devices would take in stride can wreak havoc with a Time Capsule.

While external drives may often be the only choice for those with large photo libraries (in which case I’d recommend Apple’s [Mac Mini with Snow Leopard Server](https://www.apple.com/macmini/server/), the only realistic solution, to my mind, was off-site backups. The two drawback of these, of course, are (1) that it can take an awfully long time sending one’s initial backup to an offsite server, and (2) that it isn’t altogether reassuring to know that one’s data is stored, even in encrypted form, in the care of a third party.

## Unfortunately, most commercial off-site backup services are slow, and corrupt the data they store on your behalf

Just to make things worse, it turns out a number of commercial backup services corrupt data they store on your behalf. The Mac is among the most difficult systems to backup and restore correctly: on modern filesystems, there is a lot more than just file data on your filesystem. There is lots of metadata information that goes along with your files and can be important to backup and restore in many situations. One example is security information — most desktop users don’t really know about file ownership, security information, and ACLs, but on servers that type of information is important and if lost it could lead to a security leak or permission issues. Fortunately, [Backup Bouncer](https://web.archive.org/web/20150414094852/https://www.n8gray.org/code/backup-bouncer/), which I mentioned earlier, can be used to verify metadata backup and restore for Mac backup software. The results, for most of the commercial services available, are actually pretty disastrous:

| Product                                                                                | Results               | Details                                                                                                                                   |
| -------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [Mozy](https://mozy.com/)                                                              | Failed 16 of 20 tests | [see results](https://web.archive.org/web/20100507222510/https://www.haystacksoftware.com/arq/mozy-backup-bouncer-test.txt)               |
| [Backblaze](https://www.backblaze.com/)                                                | Failed 19 of 20 tests | [see results](https://web.archive.org/web/20100303065503/https://www.haystacksoftware.com/arq/backblaze-backup-bouncer-test.txt)          |
| [Carbonite](https://www.carbonite.com/)                                                | Failed 20 of 20 tests | [see results](https://web.archive.org/web/20100303065724/https://www.haystacksoftware.com/arq/carbonite-backup-bouncer-test.txt)          |
| [Dropbox](https://itunes.apple.com/us/app/droptext-a-text-editor-for/id371880635?mt=8) | Failed 19 of 20 tests | [see results](https://web.archive.org/web/20100420110833/https://www.haystacksoftware.com/arq/dropbox-backup-bouncer-test.txt)            |
| CrashPlan Central                                                                      | Failed 12 of 20 tests | [see results](https://web.archive.org/web/20100628015547/http://www.haystacksoftware.com:80/blog/2010/06/crashplan-restore-analysis)      |
| Jungle Disk                                                                            | Passes all tests      | [see results](https://web.archive.org/web/20091117091529/https://blog.jungledisk.com/2009/11/13/what-does-extended-metadata-backup-mean/) |

Source: [Arq](https://www.arqbackup.com/) website.

The Backup Bouncer data doesn’t, either, take account of the time it takes to carry out one’s initial backup. When I tried to back up a small MacBook with 150GB of data on Backblaze, it took three weeks of continuous use — and considerable CPU slowdown — for my initial upload of files to complete. Crashplan actually offers a service whereby you can [seed your initial backup](https://web.archive.org/web/20091216044246/https://support.crashplan.com/doku.php/feature/seed_service), sending you a drive by post on which to transfer your data before sending it back to them, but they limit this to 1TB, and charge $124.99 for the service. I still think they are the best of the standard commercial backup services, if only because of this useful feature — but even they are hardly perfect.

## Amazon S3 is the cheapest, quickest, most reliable and secure backup medium available

Nonetheless, the best — and by far the cheapest — way of ensuring quick, secure, accurate and truly private backups remains a timeless favourite, [Amazon S3](https://aws.amazon.com/s3/). As Amazon themselves put it:

> The Amazon S3 solution offers a highly durable, scalable, and secure solution for backing up and archiving your critical data. You can use Amazon S3’s Versioning capability to provide even further protection for your stored data. If you have data sets of significant size, you can use AWS Import/Export to move large amounts of data into and out of AWS with physical storage devices. This is ideal for moving large quantities of data for periodic backups, or quickly retrieving data for disaster recovery scenarios.

It’s no coincidence that Jungle Disk is the only of the services surveyed above that passes all of Backup Bouncer’s tests: Amazon’s storage service is the _only_ one that provides absolutely accurate copies of Mac OS X files. It also has the enormous advantage over commercial services that store data on their own or on third-party servers that it protects you from the risk of your backup company going under or suffering from some major unforeseen disaster [§](#bfn-footnotes-140).

I have actually been conducting backups of my various Macs using Amazon S3 ever since [Paul Stamatiou](https://paulstamatiou.com/how-to-bulletproof-server-backups-with-amazon-s3) wrote about it in 2007. But in recent months I’ve become increasingly dissatisfied with Jungle Disk, the client I’ve been relying on to back my data to my server: it tends to occupy a very prominent place in my dock, with its extremely ugly icon, uses its own proprietary file format and causes occasional CPU bottlenecks. After giving up on Backblaze because of its atrocious slowness and poor customer service, I finally removed Jungle Disk, Backblaze and Crashplan and instead opted for the little-known, very lightweight [Arq](https://www.arqbackup.com/) from Haystack Software. Its advantages can be briefly summarised as follows:

- Arq stores your backup data in your own Amazon S3 account, encrypted with your own password — neither Amazon nor Haystack Software have access;
- Arq encrypts your data before it leaves your computer using AES-256, a government and industry standard;
- your backups are stored in an open, documented [format](hhttps://www.arqbackup.com/documentation/arq7/English.lproj/dataFormat.html); they’ve also delivered an open-source command-line utility called [arq_restore](https://arqbackup.github.io/arq_restore/), which is [hosted at github](https://github.com/sreitshamer/arq_restore), so you can read your data anytime without depending on Haystack Software in the event they they suddenly do a vanishing act: _in other words, whatever happens, your data remains yours_.

Arq’s accuracy is on a par with Jungle Disk’s, without the hassle: its Backup Bouncer [results](https://web.archive.org/web/20100303071816/https://www.haystacksoftware.com/arq/arq-backup-bouncer-test.txt) show it passes all tests, and it resides in a small, inconspicuous menu icon, from which you can launch the main application if you need to change a setting. It also has the advantage, over Jungle Disk, of being designed from the ground as a backup solution for the Mac, whereas Jungle Disk’s backup capacity is just one of a number of services, including mirroring files between client and server, that it offers on both Mac and Windows platforms — with the Mac often giving the impression of being the poor relation.

Enquiries to the developer behind Haystack Software, Stefan Reitsamer, yielded extremely prompt and relevant responses and the site has a lively forum&thinsp;[^1] and detailed, well thought-out documentation. Above all, my entire backup for the MacBook Air that currently serves as my only computer was complete in less than a day (and that was on a rather poor, French Internet connection).

## Used in combination with Dropbox, Google Apps and, optionally, MobileMe, Amazon S3 can get you back working exactly where you were if something unexpected happens to your Mac

I continue to use [Dropbox](https://itunes.apple.com/us/app/droptext-a-text-editor-for/id371880635?mt=8) syncs for any data that I need to access simultaneously from several devices, whether computers, iPhones or iPads: this means that my Dropbox copies of this data (essentially my 1Password data, documents, photographs and music) can be regarded as [securely backed up](https://www.dropbox.com/). Better still, [Dropbox keeps a thirty-day history](https://www.dropbox.com/) of every change you make so that you can undo any mistakes and even undelete files if required.

The combination of these two simple tools mean that if I lost access to my computer, its replacement could be rapidly running again with an effectively identical file system using a combination of the actual backups created _via_ Arq and the files stored in [Dropbox](https://itunes.apple.com/us/app/droptext-a-text-editor-for/id371880635?mt=8), while emails and calendar items would be safe in Google Apps and Contacts in MobileMe.

An Arq licence for one computer costs $29, with a five-computer option available at $59. Amazon’s very reasonable monthly charge comes on top of that. You can cap it within Arq’s preferences to whatever suits you, and you’ll be kept within budget by deleting your oldest backups as the new ones come in.

[^1]: Update 2nd June, 2023: This is no longer the case: as often with the passage of time, Arq's support [is now less than stellar](https://www.reddit.com/r/Arqbackup/comments/12xuw2m/feedback_on_recent_interactions_with_arq_support/).
