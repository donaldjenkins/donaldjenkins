---
title: 'Switching from a (dv) to a (ve) server on Media Temple'
date: '2011-12-15T06:06:01+00:00'
status: publish
permalink: /switching-from-a-dv-to-a-ve-server-on-media-temple
author: donaldjenkins
excerpt: 'After completing the switch to html5, switching from .net to .com, accompanied by a new design, I wanted to update my server configuration, which hadn’t changed for three years.'
type: post
id: 238
thumbnail: ../uploads/people-blogging.jpg
category:
    - Tech
tag:
    - Apache
    - blogging
    - CDN
    - Cloudfront
    - LAMP
    - Linux
    - 'Media Temple'
    - server
    - tutorial
    - WordPress
post_format: []
swp_pinterest_image_url:
    - ''
swp_open_graph_image_data:
    - 'false'
swp_open_graph_image_url:
    - ''
swp_cache_timestamp:
    - '432280'
wp_criticalcss_cache:
    - ''
wp_criticalcss_css_hash:
    - 72f0834e
wp_criticalcss_html_hash:
    - ''
wp_criticalcss_manual_css:
    - ''
---
After completing the switch to html5, switching from `.net` to `.com`, accompanied by a new design, I wanted to update my server configuration, which hadn’t changed for three years.

In this post, I’ll recount how I set up my new (ve) server, combining it with one of Media Temple’s [ProCDN](http://mediatemple.net/webhosting/procdn/) accounts so that tasks are clearly apportioned between the two:

- the (ve) server will be optimized to do what it’s best at, i.e. fetching content from the database and building the dynamic content displayed on my WordPress blog;
- The CDN will host all static content and serve it extremely efficiently from the closest possible location to the user, which in turn is what it’s best at.

I’ve been very happily hosted by [Media Temple](http://mediatemple.net/) since 2006 and, since 2008, I’ve been using one of their [(dv) servers](http://mediatemple.net/webhosting/dv/). I almost invariably get 100 per cent uptime from it, it’s fast and, of course, when needed Media Temple provide live, 24-hour support 365 days a year: I’ve always found their experts reliable, very smart and often happy to provide support—on the rare occasions when I’ve needed it—well beyond the bounds of what is required.

Media Temple recently started offering a service called [SiteMovers](http://mediatemple.net/sitemover/)—a team comprising the company’s sharpest support experts, dedicated to carrying out WordPress site migrations. I knew I probably didn’t need help with the migration, but curiosity got the better of me and I contacted the SiteMovers team to ask if they were interested in helping with migrating my *very* heavily customized WordPress-powered blog. After just a few minutes the team called back to say they’d be delighted to do so—and although I ended up doing most of the migration myself, they provided me with very useful suggestions throughout: the MySQL optimization I set up was entirely the result of their suggestions, and I’d highly recommend using them for anyone who feels uncomfortable about the process described in this post [§](#bfn-footnotes-140).

Whatever you do, back up all your files before editing, deleting or moving anything. I cannot be responsible for anything that happens to your setup as this is only an account of what worked for me. It may not necessarily work for you.

Using a CDN
-----------

It’s useful to have a [CDN](http://www.google.com/search?hl=en&q=what%20is%20a%20content%20delivery%20network) to host your static content so it can be served to your users faster. This applies particularly to me, with roughly half my readers being in the US, and the other half elsewhere, predominantly in Europe.

Since last year, I’ve been using [Amazon Cloudfront](https://www.donaldjenkins.com/improve-your-wordpress-blog-with-marsedit-amazon-cloudfront-and-markdown/) to provide ridiculously cheap and scalable fast access to certain static resources: images, video, css and javascript files, essentially. Because Cloudfront doesn’t support serving gripped content, however, I had to resort to rather [complicated hacks](http://stackoverflow.com/questions/5442011/serving-gzipped-css-and-javascript-from-amazon-cloudfront/5502390#5502390) to optimize the rise of the files while still enjoying the benefit of a CDN.

In recent months, I’ve noticed that Cloudfront wasn’t actually that quick at delivering the content hosted on it: testing my site using [Yslow](http://developer.yahoo.com/yslow/), [Google Page Speed](https://developers.google.com/speed) and [Pingdom](http://tools.pingdom.com/fpt/) showed that objects stored on Cloudfront were those that were loading slowest: moving them back to my Media Temple (dv) server actually resulted in a gain in speed.

My reasons for switching from (dv) to (ve) on Media Temple
----------------------------------------------------------

While I wasn’t unhappy with my (dv) server’s performance, I knew it was running at a fraction of its potential. Yet in the (dv) setup, while fine-tuning is possible, because you have full root access, it isn’t the most convenient thing to do, as the server’s administration passes through a [Plesk](http://www.parallels.com/en/products/plesk/) control panel that is installed by default when the server is configured: and Plesk is one of the most pathetically outdated, bloated and generally dysfunctional pieces of software I have ever handled—I only really put up with it because I don’t spend that much time on server maintenance tasks. But I’d been taking a close look at the (ve) server that Media Temple started offering last year, which is targeted specifically at users who want more control over their setup.

I knew exactly what I wanted: a lean server running only the OS, software and modules I needed, with no bloat, and my resources allocated in a totally optimal way.

Since I wasn’t planning to move away from a WordPress environment, I wanted to continue to separate static content from dynamic content, as I had done with the (dv) and Cloudfront. My choice was to switch all my dynamic content to the (ve) server, and as much as I could of my static content to [Edgecast](http://www.edgecast.com/), which Media Temple has chosen as its CDN partner.

How I switched from (dv) to (ve)
--------------------------------

Media Temple doesn’t encourage you to switch to a (ve) unless you know what you’re doing: they provision it with your choice of Linux OS—Ubuntu, CentOS, Debian, or Fedora, plus root access. Then you do the rest. No bloat or anything you don’t need—meaning a much more effective server in the end. As Media Temple puts it:

> (ve) Server is designed for users who have significant experience with Linux, or for those who are interested in learning. Our goal is to give customers complete control of their Virtual Environment, therefore servers are delivered with SSH only. You will control and install all software.

The process is actually simpler than it sounds. It involved four stages: (1) basic server configuration; (2) installing [LAMP](http://duckduckgo.com/LAMP_(software_bundle)); (3) tweaking your server and (4) migrating WordPress. Media Temple has excellent knowledge base guides for each of these. My comments on how I implemented them follow.

Basic Linux server configuration.
---------------------------------

Media Temple knowledge base article: [Getting started with Ubuntu](http://wiki.mediatemple.net/w/(ve):Get_started_with_Ubuntu)

This was perhaps where the advantage of (ve) over (dv) is most apparent. You can create just one user and give him control over all the essential administration of your server, by giving him the desired permissions and including him in the appropriate group(s). This takes a few seconds using the command line, with the command `root@ve: adduser jsmith` and adding `jsmith ALL=(ALL) ALL` at the appropriate place in the `/etc/sudoers` file (this is detailed in the knowledge base article). This basically turns the user you’ve just created into a [superuser](http://wiki.linuxquestions.org/wiki/Superuser), able to carry out most routine administrative tasks.

I found, however, that in addition to this, it’s useful to decide how you want to organize your permissions, for both groups and individual users: it can make sense to have a single user and group (such as the existing www-data group which is created on setup) to own all resources in `/var/www`, which is where all the data relating to websites you host on your server will be stored, while leaving the ownership of all other directories unchanged. You may want to invest a little time in understanding [Linux directory structure](http://via.dj/t1LebC) *before* you take any decisions on this, as it’s not always ideal having to change your system later on.

It is also well worth following the Media Temple suggestions to secure your server, though these are optional: changing your ssh port, disabling root access and using ip-tables. I found I needed to add to the [default](http://i.via.dj/CdrZ) suggested by Media Temple, however, because of my fondness for using desktop, third-party client for everything: I need to access MySQL remotely from my Mac (my client of choice being the excellent [Sequel Pro](http://www.sequelpro.com/)), as well as ssh from [Coda](http://www.panic.com/coda/), which I use for all my coding and file transfers (and which you can also use to safely edit text files [§](#bfn-footnotes-140) ). If you install [webmin](http://www.webmin.com/)—and Media Temple provide a knowledge base article for this too—, you’ll also need to add `-A INPUT -p tcp -m state –state NEW -m tcp –dport 10000 -j ACCEPT` to your `/etc/iptables.rules` file in order to access the webmin interface.

At this point in the migration I found I could gain substantial time by creating [TextExpander](http://smilesoftware.com/TextExpander/) shortcuts for my ssh logins, for the webmin URL (`https://YOUR<em>DOMAIN</em>IP:10000`) and for restarting Apache (`sudo /etc/init.d/apache2 restart`): considering the number of times one needs to type them in, the combination of the command-line and TextExpander shortcuts is a huge time saver (make sure your Mac is secured by a really secure password and [Filevault](http://en.wikipedia.org/wiki/FileVault), if you do this, obviously).

Installing LAMP
---------------

Media Temple knowledge base article: [(ve):Install LAMP on Ubuntu 9.10](http://wiki.mediatemple.net/w/(ve):Install_LAMP_on_Ubuntu_9.10)

This, I found, was the most straightforward part of the process: I slavishly followed the Media Temple knowledge base article, adding a file with a `<VirtualHost>` section for each of my sites in the `/etc/apache2/sites-available` folder, then creating:

- the corresponding paths :

```
# sudo mkdir -p /var/www/ve-server{1,2}.com/{html,logs}
```

- files:

```
# sudo touch /var/www/ve-server1.com/html/index.html
```

- and content:

```
# sudo echo -e '<html>
<head>
<title>Welcome to apache!</title>
</head>
<body bgcolor="white" text="black">
<center><h1>ve-server1.com is working!</h1></center>
</body>
</html>' > /var/www/ve-server1.com/html/index.html
```

for each site.

Tweaking your server
--------------------

This, not surprisingly, is at once the most enjoyable and the most frustrating stage in the process. Each user will have different requirements, obviously, so my customizations are just one example—but here’s what I needed to set up—not necessarily before I installed WordPress, as I only discovered the issues while I was testing the new install, but I’m including them here before, for convenience.

### Make sure `mod_rewrite` is enabled

Firstly, I found Rewrite is not enabled by default on my server. As a result, any `.htaccess` files in my existing WordPress configuration were being ignored and the custom URLs set in my WordPresss were not working [§](#bfn-footnotes-140). All you need to do to solve this is to ensure that `mod_rewrite` is enabled, as follows:

```
# sudo a2enmod rewrite
```

Then restart Apache:

```
# sudo /etc/init.d/apache2 restart
```

### Configure the server so WordPress can access your FTP credentials

Secondly, I found that, when I tried to download any plugins, I was unable to update FTP details in the WordPress administration panel, in order to download plugins [§](#bfn-footnotes-140): instead I’d get a [error message](http://i.via.dj/CVeD) requesting that I update details—and the corresponding fields would be frozen and not accept updates.

The reason for this—which I discovered thanks to [this blog post](http://envyandroid.com/archives/434/make-wordpress-work-linux)—is that in current versions of WordPress, it checks if the userid it is running under, is the same as the owner of the file or folder it tries to edit: the issue arises at line 876 in the method get*filesystem*method in `wordpress/wp-admin/includes/file.php`:

```
if ( getmyuid() == @fileowner($temp_file_name) )
$method = 'direct';
@fclose($temp_handle);
@unlink($temp_file_name);
```

As a result, when WordPress is running, its userid is `www-data` (`apache2`), but the file owner is `smith` (or whatever user you have created), so it gives an error.

You can solve this issue by creating an extra entry in your `mydomain.com` VirtualHosts:80 entry:

```
<IfModule mpm_itk_module>
AssignUserId jsmith www-data
</IfModule>
```

### Sending email

Servers send email in a variety of ways that you can configure more or less as you like. In all cases, however, they need to have a [Mail Transfer Agent](http://en.wikipedia.org/wiki/Message_transfer_agent) in order to send (and, if desired, receive) mail.

[SendMail](http://en.wikipedia.org/wiki/Sendmail), a a general purpose Internet mail routing facility that supports many kinds of mail-transfer and -delivery methods, is installed by default on a (dv) server—and is what PHP’s Mail hooks into to send emails from your contact forms, for instance, unless you’ve set another MTA in your server. I found that SendMail hadn’t been installed, and that as a result my [contact form](https://www.donaldjenkins.com/contact/) was not working. Since I only needed to send emails, and was using my Google Apps address as the outgoing mail address, I was actually looking for a lightweight alternative that would only handle sending, but would enable my emails to be routed and authentified via gmail’s SMTP server, ensuring that they would not get flagged as spam.

I did it in the following way. First, I installed [sSMTP](https://github.com/ajwans/sSMTP)[§](#bfn-footnotes-140) :

```
# sudo apt-get install ssmtp
```

Next, I configured sSMTP:

```
# cd /etc/ssmtp
```

```
# vim /etc/ssmtp/ssmtp.conf
```

Here’s a possible configuration for sending *via* gmail’s SMTP server:

```
MailHub=smtp.gmail.com:587          <span class="code-comment"># SMTP server hostname and port</span>
UseTLS=YES                             <span class="code-comment"># Gmail requires a secure connection (SSL/TLS)</span>
FromLineOverride=YES                   <span class="code-comment"># Force the From: line</span>
Hostname=mail._YOUR_DOMAIN            <span class="code-comment"># The name of your host</span>
RewriteDomain=mail._YOUR_DOMAIN       <span class="code-comment"># The host the mail appears to be coming from</span>
Root=YOUR_ACCOUNT_NAME                 <span class="code-comment"># Redirect mail for root@ to postmaster@</span>
AuthUser=YOUR_ACCOUNT_NAME@gmail.com   <span class="code-comment"># Your gmail mail account</span>
AuthPass=YOUR_GMAIL_PASSWORD           <span class="code-comment"># The password for the mail account</span>
```

You’ll want to add some `revaliases` to `/etc/ssmtp/revaliases` from which to send email:

```
<span class="code-comment"># Format: local_account:outgoing_address:mailhub</span>
root:alerts@YOUR_DOMAIN:smtp.gmail.com:587
Postmaster:alerts@YOUR_DOMAIN:smtp.gmail.com:587
You:YOUR_ACCOUNT_NAME@YOUR_DOMAIN:smtp.gmail.com:587
```

Optionally, you might want to change the ‘From’ display name on your outgoing emails: to do this, edit the `/etc/passwd` and add or modify the appropriate user alias

```
alerts:Alerts:507:507::/home/alerts:/bin/bash
YOUR_USER_NAME:YOUR_USER_NAME:505:506::/home/YOUR_USER_NAME:/bin/bash
postmaster:POSTMASTER:505:506::/home/postmaster:/bin/bash
```

To ensure sSMTP is used by PHP to send email, you need to edit your `php.ini` file in ```/etc/php5/apache2/php.ini`. In your `php.ini`, find the `sendmail_path=` line, and edit it to:

```
# sendmail_path = /usr/sbin/ssmtp -t
```

PHP requires the -t flag.

Save your `php.ini` and restart Apache. Your `mail()` function should now work, using sSMTP.

If you’re installing sSMTP on a server that *does* have Sendmail installed, you’ll additionally need to remove and disable it:

```
# service sendmail stop
# sudo chkconfig –levels 2345 sendmail off
```

You could also move SendMail and create a symbolic link so any processes that are written send mail using SendMail (which many do) use sSMTP instead.

To do this, move or replace the sendmail and then create a symbolic link for sSMTP to sendmail with authentication:

```
# mv /usr/sbin/sendmail/usr/sbin/sendmail.orig
# ln -s /usr/sbin/ssmtp/usr/sbin/sendmail
```

Migrating WordPress to the new server
-------------------------------------

### Updating server path references

This side of things is extremely simple. You just need to download your theme files and save a copy of your database, and update any paths in them to reflect the (ve) directory structure, which is difference from that in the (dv): the (dv) places your WordPress files in `/var/www/vhosts/YOUR<em>DOMAIN</em>NAME/httpdocs`, whereas the (ve) stores them in `/var/www:YOUR<em>DOMAIN</em>NAME/html`.

There are several ways of doing this: use that which suits you best. Whichever way you choose, of course, make full backups of everything before you change anything [§](#bfn-footnotes-140) You should also compact and repair your database to keep it lean, and remove any tables that are no longer needed (such as those created by old plugins you’ve uninstalled).

I ran a search-and-replace on the saved version of my database in [TextWrangler](http://itunes.apple.com/us/app/textwrangler/id404010395?mt=12), a robust code editor for the Mac that can carry out regex operations on even the most gigantic of files. Then I ran the same operation in [Coda](http://www.panic.com/coda/) for the theme files.

### Installing WordPress on the new server

I made a fresh WordPress install on the new server, reinstalled all my plugins, uploaded the theme files, activated my chosen theme, and added the following to my `config.php` file:

```
<span class="code-comment">//remove this before flipping your DNS</span>
define('WP_HOME','http://YOUR_NEW_IP_ADDRESS'); define('WP_SITEURL','http://YOUR_NEW_IP_ADDRESS');
```

### Improving database performance to take advantage of the (ve) server’s power

Media Temple knowledge base article: [Using MySQLTuner](http://kb.mediatemple.net/questions/70/Using+MySQLTuner#gs)

Now’s the time, if you want to to, to tweak your database settings to take advantage of your customized (ve) server’s power. I used mysqltuner.pl, a script written in Perl that allows you to review a MySQL installation quickly and make adjustments to increase performance and stability. Media Temple has a [knowledge base article](http://kb.mediatemple.net/questions/70/Using+MySQLTuner#gs) about it, which can be used, appropriately adapted, to your (ve) database. Based on the information it provided, I tuned `/etc/mysql/my.cnf` to raise several of my MySQL limits to utilize available resources on the server (again, *make backups* of all files you edit beforehand—and bear in mind your requirements will probably differ from mine as your WordPress database is unlikely to be identical):

```
<span class="code-comment"># * Fine Tuning</span>
#
key_buffer      = 16M
max_allowed_packet  = 16M
thread_stack        = 192K
thread_cache_size       = 64
<span class="code-comment"># This replaces the startup script and checks MyISAM tables if needed
# the first time they are touched</span>
myisam-recover         = BACKUP
max_connections        = 100
wait_timeout           = 60
table_cache            = 128
#thread_concurrency     = 10
#
<span class="code-comment"># * Query Cache Configuration</span>
#
query_cache_type    = 1
query_cache_limit   = 2M
query_cache_size        = 32M
tmp_table_size      = 32M
max_heap_table_size     = 32M 
join_buffer_size    = 32M
key_buffer_size     = 16M
```

I found this induced a noticeable increase in speed in my server.

Moving static content to the CDN
--------------------------------

Media Temple knowledge base article: [Get started with ProCDN](http://kb.mediatemple.net/questions/1849/Get+started+with+ProCDN#procdn)

The final adjustment was moving all static content (CSS, javascript and images, in my case) to the CDN. I chose to store CSS and javascript, which are dependent on your WordPress theme, in the traditional place in a subdirectory of the active theme. Images, however, I decided to store in in a subdirectory of `/var/www/YOUR<em>DOMAIN</em>NAME/html`, since I don’t use the WordPress media management feature, preferring to keep control of my files.

If you want to take advantage of this feature, you first need to add ProCDN to your Media Temple account, though: it costs $20/month, which in my care comes on top of the $50 monthly charge for my (ve) server. But I think the speed improvement justifies it. Setting it up only takes a few minutes and is detailed in a [knowledge base article](http://kb.mediatemple.net/questions/1849/Get+started+with+ProCDN#procdn). Once you’ve done this, you’ll have a super-fast mirror of your site, replicated in Edgecast’s data centers around the world, ready within the time it takes for the settings to propagate (about an hour after you add the necessary `CNAME` to your DNS). You then need to change any references to static files in your theme to reference the CDN (using, say, `cdn.yourdomain.com` instead of `yourdomain.com`, if that is your CNAME for the CDN), and you’re ready to go.

Flipping the DNS
----------------

Once you’re all set up, the final moment is when you’re certain your new server is totally functional and you flip the DNS for your web site from the (dv) server to the (ve) server. This is childishly simple. Media Temple provides a [function](http://i.via.dj/Cdok) in your Account Center which allows you to point your existing DNS zones to the new ip (ip addresses are tied to the particular server cluster on which your domain is hosted at Media Temple, so you’ll necessarily have to change the ip address associated with your domain when you switch from (dv) to (ve\[/footnote\]. Make sure you lower ythe [Time To Live](http://en.wikipedia.org/wiki/Time_to_live) for each of your domains about twelve hours, at least, before you switch, from the default 43,200 seconds to 300 seconds, in the Account Center, and the change in site will propagate within about five minutes of flipping. You can keep the TTL low for a few hours afterwards, too, so you can flip back if you discover something has gone wrong—though obviously in extreme cases only.

<div class="bfn-footnotes" data-container="" data-post-id="140" id="bfn-footnotes-140" style="display: none;">### References


</div></body></html>