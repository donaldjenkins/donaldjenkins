---
title: 'Connecting WordPress, Lightroom and Apple Photos'
date: '2019-05-27T20:28:52+00:00'
status: publish
permalink: /connecting-wordpress-lightroom-and-apple-photos
author: donaldjenkins
excerpt: 'When most of your photos are taken using an iPhone, an effective image workflow tightly integrating Apple Photos, the Lightroom ecosystem and WordPress''s Media Library requires careful planning. It can be done, building on Lightroom''s limited connection to iOS photos, the synchronization between the cloud-based Lightroom CC and the desktop-oriented Lightroom Classic CC, and finally Meow Apps''s WP/LR Sync plugin for WordPress.'
type: post
id: 3808
thumbnail: ../uploads/photographer-at-work.jpg
category:
    - Tech
tag:
    - Adobe
    - Apple
    - iPad
    - iPhone
    - Lightroom
    - photos
    - Retina
    - WordPress
post_format: []
wp_criticalcss_cache:
    - ''
wp_criticalcss_manual_css:
    - ''
---
While any serious photographer will use several cameras and lenses, the dramatic improvement in the quality of Apple’s iPhone cameras has led many people, me included, to take the majority of their photographs on their phones. A lot of these pictures may end up on an Instagram or Facebook profile—easily done directly from an iPhone—rather than a WordPress site. But if, like me, you wish to keep your photographs in some semblance of order and also display them on your site, the iPhone will have introduced additional complexity into your workflow.

The complexity grows further if, like me, you want to display your photographs in your WordPress website without using a resource-draining plugin, and retain consistency between the images on your website and those in your Apple [Photos](https://www.apple.com/ios/photos/ "The official Apple Photos for iOS page") Library.

The workflow I’m going to describe in this article involves two successive stages:

1. Automatically pushing all your photographs (whether taken with your iPhone or with an external camera) from Apple Photos to Lightroom.
2. Managing all the photographs, post illustrations and images you display on WordPress, together with all the associated metadata, out of Lightroom.
 
For the first component of this workflow, we’ll be using [Adobe Creative Cloud](https://www.adobe.com/creativecloud.html "What is Creative Cloud?"); for the second component, our tool will be a plugin called [WP/LR Sync](https://meowapps.com/plugin/wplr-sync/ "Home page for WP/LR Sync").

Before I begin describing those two processes, however, I should provide some context to explain the reason why I chose to use this particular workflow.

<div class="wp-block-image"><figure class="aligncenter">![The workflow described in this article](https://cdn.donaldjenkins.com/images/the-workflow-described-in-this-article-868x1024.png?lossy=1&ssl=1)<figcaption>The workflow described in this article: once a photo is taken either with my iPhone or an external camera, it is successively (1) integrated into my Apple Photos Library, either automatically, or by being imported via the Lightning to SD Card Camera Reader, or using Photomyne; (2) imported into Adobe Cloud via the Lightroom CC iOS app; (3) synced with Lightroom Classic CC on my Mac and (4) synced with my WordPress Media Library via WP/LR Sync</figcaption></figure></div>Switching from Lightroom to Apple Photos, then (partly) back to Lightroom
-------------------------------------------------------------------------

Historically, before the iPhone became the camera I used for most of my photos, including most of the serious ones, I organized my photos in [Adobe Lightroom](https://www.adobe.com/products/photoshop-lightroom.html "Adobe Lightroom"), which in those days was, essentially, a closed, desktop app.

But as I started taking most of my photos on my iPhone, I found constantly transferring photos from the Apple ecosystem to the Adobe one inconvenient. So when Apple launched its own new, dramatically-improved photos management system, [Photos](https://www.apple.com/macos/photos/ "Apple Photos"), I decided to switch from the Adobe photo management ecosystem to the Apple Photos one. This was for two primary reasons.

The first was, quite simply, the convenience of using a photo-management ecosystem that was tightly integrated with all my Apple devices. Using Apple Photos as your primary Photo Management system means all your photos are immediately available all your devices, ready to share using all the apps you’ve installed on them. The sharing options available if you store your photos in Adobe Cloud as I did previously, while they exist, are just not quite as extensive. I found the convenience of this impossible to resist, and converted my photo library from Lightroom to Apple Photos.

Around the same time, using [Photomyne](https://photomyne.com "Photomyne App"), I scanned all my old family photos, some of them going back to the first half of the twentieth century, meaning all my photos were available in a single place.

I assigned a location and title to all the scanned photographs, which you can do in Photomyne itself, but is actually also very [easy to do](https://support.apple.com/guide/photos/add-titles-descriptions-and-more-phta4e5a733f/mac "Add titles, descriptions, and more to photos using Photos on Mac") in Apple Photos.

The second reason that prompted me to switch to the Apple Photos ecosystem was that a great deal of the photo editing work that I used to carry out in Lightroom can now be done directly in Apple Photos. This can be done in two ways:

- first, you can use the editing tool built-in to Apple Photos, which allows you to edit a photo directly using any client app that offers built-in support for this feature;
- alternatively, you can edit the photo separately in any third-party app (I personally prefer [Snapseed](https://itunes.apple.com/app/id439438619 "Snapseed")).
 
The Apple Photos ecosystem, however, is a relatively closed one, which results in a large number of constraints when you want to display or move your photographs outside of it. Your shots are not individually identifiable, as files, in the way they are in Lightroom, within Apple’s Photos Library. You can share photos from Apple Photos, but [there is no easy way](https://www.organizepictures.com/2016/01/move-away-from-photos "6 steps to move away from Photos on your Mac") of exporting your photos, individually or collectively, let alone synchronizing them with anything else. From this point of view, the switch to Photos from Lightroom was a step backwards.

For some time I’d been looking for a workflow that gave me the best of both worlds: the ability to store and edit all my photographs on my iPhone, but also for them to be available in the Classic desktop iteration of Lightroom, should I need the more powerful features that system offers, chief among them (as we shall see) the ability to sync with photos published on my WordPress site. New features that became available in the Adobe ecosystem convinced me to partly switch back to using Lightroom to manage my photos, including those I display on my WordPress site.

Using Lightroom Classic CC and Lightroom CC to automatically push photos from Apple Photos to the Adobe Cloud ecosystem
-----------------------------------------------------------------------------------------------------------------------

Adobe reacted to Apple’s new Photos ecosystem, in 2017, by splitting its own Lightroom app into two:

- Lightroom Classic CC, a desktop-only app which continued to manage your library in the same sophisticated way targeted at serious photographers;
- Lightroom CC, the new online cloud-based version of Adobe’s Lightroom application, which can be installed alongside Lightroom Classic CC, can be installed on desktops, laptops, iPad and mobile, and has the ability to sync developed photos easily between all these devices.
 
Confusingly, the photo libraries used by Lightroom Classic CC and Lightroom CC are not identical:

- the Lightroom Classic CC library continues to be stored on your desktop hard drive, in `*.lrcat` format;
- in Lightroom CC, all your photos are stored online by Adobe. You can choose to store them locally too: in this case, however, Lightroom CC stores your entire library in one place.
 
The way in which you organize your work is also different:

- Lightroom Classic CC actually offers two parallel organizational systems. It has a Folders panel for showing where your images are actually stored on your hard disk, and a Collections panel for organizing them ‘virtually’ into Collections, Smart Collections and Collection Sets;
- Lightroom CC has no ‘Folders’ at all, and its only organizational tool is Albums (these can be organized into folders, but these are just virtual containers, not actual folders on a computer).
 
The key difference, however, is plugins: Lightroom Classic CC supports plug-ins like the Nik Collection, Luminar, ON1 Photo RAW and more; so far, there’s no sign of plug-in support in Lightroom CC.

There is one last crucial difference between Lightroom Classic CC and Lightroom CC:

- Lightroom Classic CC is a closed ecosystem: you can import photos into it, and in fact the range of options available to you in that respect is quite broad, since you can choose to reference photos located anywhere, without moving them, or import them and move them to a new location—but you can’t make it sync with anything;
- Lightroom CC, on the other hand, can be made to *automatically* import photos from your camera roll.
 
<div class="wp-block-image"><figure class="aligncenter is-resized">![](https://cdn.donaldjenkins.com/images/auto-add-from-camera-roll-in-lightroom-cc.jpg?lossy=1&quality=90&fit=800%2C1024&ssl=1)<figcaption>Lightroom CC can be set to automatically import everything from your iOS device. This effectively injects all your new photos into the Adobe Cloud ecosystem</figcaption></figure></div>The last point to understand, for our purposes, is that the two versions of Lightroom can be made to work together, allowing us to combine the respective advantages we have just described for each of them. This is because Lightroom Classic CC can sync with Lightroom CC; and since the latter can automatically import images from Apple Photos, we have a way of pushing photos we take with our iPhone all the way to Adobe Lightroom Classic CC on our Mac desktop.

Photos shot on cameras other than my iPhone can easily be incorporated into this workflow. There are several ways if doing this but I find the easiest and most logical to be importing them into Apple Photos by using a [Lightning to SD Card Camera Reader](https://www.apple.com/shop/product/MJYT2AM/A/lightning-to-sd-card-camera-reader "Lightning to SD Card Camera Reader"). This ensures all my photographs, regardless of what device they were taken on, will be available on both the Apple Photos ecosystem and, once imported via Lightroom CC, on Adobe Cloud and, eventually, on Lightroom Classic CC.

This means I now have a complete archive of all my photographs, spanning almost a hundred years, originally contained in Apple Photos and now included, with all their metadata, in my Lightroom Classic CC library.

We now have a workflow whereby all the photographs we take, once they are on one of our iOS devices, are pushed automatically to Lightroom Classic CC on our Mac. The one drawback of this approach is that it is a one-way push, meaning there will be no two-way sync, and any edits we make to these pictures in Lightroom Classic CC will never show up on Apple Photos. But that doesn’t matter for my purposes, since I actually do the editing for my pictures on my iPhone or iPad, and use Lightroom primarily for storing and dispatching them to Flickr and to my WordPress site.

Sync photos between the Mac and WordPress
-----------------------------------------

We now move to the second part of this workflow, which brings the photos I wish to display online to my WordPress site, with all the edits and metadata I wish to include from the originals my photo library, as part of a two-way sync. Once photos from my iOS devices are available on the Mac, I can continue processing them within the Lightroom interface.

In my case, this primarily involves sorting, adding metadata (especially titles, captions, Creative Commons settings, and, occasionally deleting duplicates). Lightroom, with its rich plugin ecosystem, provides an environment to do this that Apple Photos does not.

In a few cases, I might want to edit a picture using editing tools the equivalent of which is not available for mobile devices, such as [Portraiture](http://www.imagenomic.com/Products/Portraiture "Portraiture") or [Silver Efex](https://nikcollection.dxo.com/silver-efex-pro/ "Silver Efex").

The tool I will be using for this second stage of the workflow, to get the photos I want to share on my site all the way to my WordPress Media Library, is Jordy Meow’s [WP/LR Sync](https://meowapps.com/plugin/wplr-sync/ "WP/LR Sync") plugin, which makes use of Lightroom’s very useful Publish Service functionality. Its key feature is that it allows you to synchronize the version of a photo in Lightroom with the version in WordPress. That can be infinitely useful for managing metadata like titles and captions, if you decide to manage these from within Lightroom. It consists of two components:

- one is available in the WordPress repository and has to be installed on your WordPress website;
- the other one is for Lightroom and can be downloaded from your account on the Meow Apps store.
 
The two plugins will communicate and keep everything synchronized, as soon as you hit the Publish button in the WP/LR Sync section of your Lightroom Classic CC library. The settings for the sync allow you to customize the way in which the content of your Lightroom photo library is connected with that of your WordPress Media Library in an almost infinite way. If you decide to change anything in Lightroom subsequently (whether it be metadata, or edits to the image itself), you will be offered the option to republish the modified photo to the WordPress Media Library so that everything stays in sync.

Meow has a very good [tutorial](https://meowapps.com/wplr-sync-tutorial/ "WP/LR Sync: Tutorial") detailing all the options available.

I use a set of Lightroom smart collections to determine which photographs I want to display in WordPress:

 <figure class="wp-block-image">![Lightroom smart collection settings](https://cdn.donaldjenkins.com/images/lightroom-smart-collection-settings-1024x870.jpg?lossy=1&ssl=1)<figcaption>A smart collection is a powerful tool, available in Lightroom Classic CC but not in Lightroom CC. I use it to filter the photographs I want to display in each of my WordPress galleries.</figcaption></figure><div class="wp-block-image"><figure class="aligncenter">![The WP/LR Lightroom interface](https://cdn.donaldjenkins.com/images/the-wplr-lightroom-interface-1024x582.jpg?lossy=1&ssl=1)<figcaption>The WP/LR Sync smart collections in Lightroom Classic CC that I want to sync with my WordPress Media Library</figcaption></figure></div>In my WordPress Media Library, each of these smart collections will correspond to a WordPress gallery: unlike other plugins, WP/LR Sync, and the Meow system of WordPress plugins generally, does not create its own parallel galleries, hooking on instead to the standard WordPress gallery format.

<div class="wp-block-image"><figure class="aligncenter">![](https://cdn.donaldjenkins.com/images/the-wplr-collections-synced-with-the-wordpress-media-library.jpg?lossy=1&quality=90&fit=1024%2C624&ssl=1)<figcaption>The collections I chose to sync from my Lightroom Classic CC Library using WP/LR Sync are now incorporated in my WordPress Media Library, with an optional navigation tool on the left to switch between them</figcaption></figure></div>At this point, in addition to being grouped in galleries mirroring the collections in your Lightroom Library, the images are in your WordPress Media Library: you can use them in any way you like. The collections you create in Lightroom will be directly usable in the WordPress Gallery shortcode, like this:

 ```
[ gallery wplr-collection="1" ] 
[ gallery wplr-keywords="10, 20" ]
```

There is a <q>Collections &amp; Keywords</q> screen in WP/LR Sync in WordPress that helps the users to create those shortcodes.

<div class="wp-block-image"><figure class="aligncenter">![WP/LR galleries in WordPress](https://cdn.donaldjenkins.com/images/wplr-galleries-in-wordpress-1024x546.jpg?lossy=1&ssl=1)<figcaption>The settings panel for the WP/LR Sync plugin for WordPress displays a list of galleries that match the smart collections created in Lightroom Classic CC. unlike other gallery plugins, WP/LR Sync doesn’t create proprietary galleries: instead, it allows you to use attributes (collections=’…’, keywords=’…’) in the standard WP Gallery shortcode to link your galleries to your collections and keywords in Lightoom dynamically</figcaption></figure></div>As you can see from the illustrations in this article, I chose to create additional Lightroom collections to store content that went beyond photographs authored by me: I set up smart collections for featured images, post illustrations, and system images. The advantage of this is that you can set a large number of metadata (such as those relating to copyright and Creative Commons licenses \\xa0 The only limitation on the latter point is due not to WP/LR Sync, but to Lightroom’s policy of converting all PNG files to JPG on export, meaning any PNG or SVG files must be uploaded to your WordPress Media Library separately.

While the open standards scrupulously adhered to by WP/LR Sync’s developer (he rightly stresses that every image in your WordPress must be in the Media Library) mean you are not in any way constrained within his extensive plugin ecosystem when it comes to displaying your photos in WordPress once they have made it there, it actually makes a lot sense to use his [Gallery](https://meowapps.com/plugin/meow-gallery/ "Meow Gallery plugin for WordPress") and [Lightbox](https://meowapps.com/plugin/meow-lightbox/ "Meow Lightbox plugin for WordPress") plugins: they are relatively lightweight (though an option to disable any unused javascript would be welcome in a future version), elegantly designed with photographers in mind, and obviously tightly integrated with WP/LR Sync.

<div class="wp-block-image"><figure class="aligncenter">![The Meow Lightbox with a Retnia Image](https://cdn.donaldjenkins.com/images/the-meow-lightbox-with-a-retina-image-1024x569.jpg?lossy=1&ssl=1)<figcaption>The Meow Lightbox plugin, designed by photographers for photographers, integrates tightly with the rest of the Meow ecosystem. In this example, it displays the metadata from the photograph’s original Lightroom file (if WP/LR Sync is set not to remove the). Optionally, if location data is preserved on sync, the toggle at the top of the window will open a customizable Google Map displaying the photo location</figcaption></figure></div>There is almost no limit to the combinations that you can display using this powerful system: your can either use the standard WordPress gallery [shortcodes](https://codex.wordpress.org/Gallery_Shortcode "Gallery Shortcode in the WordPress.org Codex") or, for adepts of Gutenberg blocks, Meow galleries can be inserted easily within Gutenberg as a block, as the following example demonstrates:

<div class="mgl-square-container"><style>	.mgl-square {		display: none;	}		#mgl-gallery-6430756daffc3 {		margin: -2.5px;	}	#mgl-gallery-6430756daffc3 .mgl-item {		width: 33%;		padding-bottom: 33%;	}		@media screen and (max-width: 460px) {		#mgl-gallery-6430756daffc3 .mgl-item {			width: 50%;			padding-bottom: 50%;		}	}			@media screen and (max-width: 360px) {		#mgl-gallery-6430756daffc3 .mgl-item {			width: 100%;			padding-bottom: 100%;		}	}		#mgl-gallery-6430756daffc3.custom-gallery-class .mgl-item {		padding-bottom: 22% !important;	}	#mgl-gallery-6430756daffc3 .mgl-item .mgl-icon {		padding: 2.5px;	}	#mgl-gallery-6430756daffc3 .mgl-item figcaption {		padding: 2.5px;	}</style><?xml version="1.0"??>
<div class="mgl-gallery mgl-square is-animated colorize captions-none" id="mgl-gallery-6430756daffc3" style=""><figure class="mgl-item"><div class="mgl-icon"><div class="mgl-img-container"> ![Village children in Madagascar](https://cdn.donaldjenkins.com/images/village-children-in-madagascar-1024x768.jpg?lossy=1&ssl=1) </div> </div> <figcaption class="mgl-caption">A large number of charities are active in the south-west of Madagascar, working to provide food and education for these desperately poor people

 </figcaption> </figure><figure class="mgl-item"><div class="mgl-icon"><div class="mgl-img-container"> ![The statue of St. Praxedes](https://cdn.donaldjenkins.com/images/the-statue-of-st.-praxedes-768x1024.jpg?lossy=1&ssl=1) </div> </div> <figcaption class="mgl-caption">This church was built in the honour of the Roman martyr St. Praxedes, on the alleged site of her house, to which, when it was rebuilt by Pope St. Paschal I (the present Santa Prassede), her relics were taken.

 </figcaption> </figure><figure class="mgl-item"><div class="mgl-icon"><div class="mgl-img-container"> ![Driving through the Aral Sea](https://cdn.donaldjenkins.com/images/driving-through-the-aral-sea-1024x767.jpg?lossy=1&ssl=1) </div> </div> <figcaption class="mgl-caption">Karapakalstan is a remote and isolated area, surrounded by desert sands in every direction; a population of traditional livestock-breeders who raised cattle in the waterways and reed beds of the Amu Darya delta

 </figcaption> </figure><figure class="mgl-item"><div class="mgl-icon"><div class="mgl-img-container"> ![A bar-mitzvah at Zion Gate](https://cdn.donaldjenkins.com/images/a-bar-mitzvah-at-zion-gate-1024x685.jpg?lossy=1&ssl=1) </div> </div> <figcaption class="mgl-caption">Zion Gate is one of eight gates in the walls of the Old City of Jerusalem. It was built in July 1540, west of the location of the medieval gate.

 </figcaption> </figure><figure class="mgl-item"><div class="mgl-icon"><div class="mgl-img-container"> ![Bicycle made of wire](https://cdn.donaldjenkins.com/images/bicycle-made-of-wire-1024x768.jpg?lossy=1&ssl=1) </div> </div> <figcaption class="mgl-caption">Found on a table at Momoya on the Upper West Side

 </figcaption> </figure><figure class="mgl-item"><div class="mgl-icon"><div class="mgl-img-container"> ![The Paris Zombie March](https://cdn.donaldjenkins.com/images/the-paris-zombie-march-1024x768.jpg?lossy=1&ssl=1) </div> </div> <figcaption class="mgl-caption">An unexpected sight on the street sof the Marais district in the Parisian autumn

 </figcaption> </figure></div></div>The Meow plugin ecosystem provides several useful (but obviously completely optional) additions that can be usefully integrated into this setup:

- [Gallery Custom Links](https://meowapps.com/plugin/gallery-custom-links/ "Gallery Custom Links for WordPress"), allows you to link images from galleries to a specified URL; you can use it, for instance, to point your gallery images towards the equivalent entry in Flickr or Instagram;
- [WP Retina 2x](https://meowapps.com/plugin/wp-retina-2x/ "WP Retina 2x for WordPress"), as its name indicates, automatically generates the image files required by Retina (or any high-DPI) devices and displays them to site visitors \\xa0;
- [Media File Renamer](https://meowapps.com/plugin/media-file-renamer/ "Media Fie Renamer for WordPress") renames media files, either automatically or manually; I inevitably end up with a relatively untidy jumble of file names in Lightroom, which the latter makes it difficult to tidy up—this makes it possible to have a clean file-name structure in WordPress, where this actually helps with SEO.
 
<div class="wp-block-image"><figure class="aligncenter">![Managing the Retina 2x plugin images](https://cdn.donaldjenkins.com/images/managing-the-retina-2x-plugin-images-1024x451.jpg?lossy=1&ssl=1)<figcaption>If you install the Pro version of Meow’s Retina 2x plugin, it will automatically generate Retina images for each of the images in your WordPress Media Library, providing the size of the image you originally uploaded allows it. With WordPress supporting the srcset attribute, this ensures the right-sized images will be displayed even to users with Retina screens</figcaption></figure></div> <figure class="wp-block-image">![Detailed Retina 2x image setting](https://cdn.donaldjenkins.com/images/detailed-retina-2x-image-setting-1024x1003.jpg?lossy=1&ssl=1)<figcaption>The Retina 2x Pro plugin will give you detailed information of which Retina images it has generated and the reason why some sizes may be missing.</figcaption></figure>An enormous amount of thought was put into developing WP/LR Sync, and because of its adoption of open standards and of the number of options it offers, it is an extremely flexible instrument. Getting it to work in a way that matches your requirements is going to require a lot of work. You should also bear in mind that the sync process is relatively resource-intensive. This is especially true if you have an image optimization procedure set to kick in as soon a new images are uploaded to you site. Sometimes, especially if you’re uploading a large number of images, or if the file sizes involved are large, the sync process may fail and need to be repeated.

But once you have ironed out all the potential pitfalls, the satisfaction of enjoying flawless synchronization between your Media Library and your Lightroom photographs, with any new content you create in the Apple Photos ecosystem automatically being made available for you to use within those platforms, will make the effort of setting it up worthwhile.