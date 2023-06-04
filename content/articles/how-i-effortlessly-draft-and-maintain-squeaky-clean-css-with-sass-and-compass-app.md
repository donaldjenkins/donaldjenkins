---
title: "How I effortlessly draft and maintain squeaky-clean CSS with SASS and Compass.app"
categories: ["Tech"]
tags: [app, code, Compass, css, preprocessor, SASS]
seoTitle: "Donald Jenkins: How I effortlessly draft and maintain squeaky-clean CSS with SASS and Compass.app"
date: 2012-03-14T09:14:00+00:00
type: articles
notable: false
layout: "single"
slug: " how-i-effortlessly-draft-and-maintain-squeaky-clean-css-with-sass-and-compass-app"
draft: false
description: "How I effortlessly draft and maintain squeaky-clean CSS with SASS and Compass.app"
summary: "How I effortlessly draft and maintain squeaky-clean CSS with SASS and Compass.app"
featured_image: "1dfa94e8-df85-49be-fa53-74304194dd00"
author: "Donald Jenkins"
showthedate: false
tableofcontents: false
noindex: false
---

One problem I have increasingly faced over the past four years or so, as my websites became more complex, was the need to maintain a large, constantly-evolving and unwieldy set of stylesheets. I’ve been writing all the code for this myself for some time now. Every few months, I have tended to rethink the structure of my main site: design standards evolve so fast that I find I need the constant challenge of starting from scratch, just to keep on top of the phenomenally rapid pace of change in an industry in which nine months are akin to a lifetime.

## The difficulty of maintaining several stylesheets at once

Until now I hadn’t invested much thought in the tools I used for writing and maintaining my code: I did switch from a Textmate/Transmit combo to the all-purpose Coda a couple of years ago, and last year complemented this with Espresso as a way of testing CSS before it went into production. But the current spate of frequent design revamps has put strain on this carefree approach, essentially because I have been maintaining three separate stylesheets for (i) the home page, (ii) the contact form and (iii) posts and pages: there wasn’t that much overlap between these three stylesheets, so it made sense to keep them separate and small — but this came at the cost of considerable pain whenever new versions were required. Ensuring the three stylesheets were consistent ended up wasting so much of my time I spent some time looking into ways of getting the job done more efficiently.

The tech sector isn’t lacking in imagination, and quite a large number of new tools have emerged in the past few months to make code editing and maintenance more efficient. The ones I’m actually using include the following:

- [html5boilerplate](https://html5boilerplate.com/);
- [Modernizr](https://www.modernizr.com/);
- [OOCSS](https://web.archive.org/web/20120303080728/http://oocss.org/).

## What CSS preprocessors can do

Reading about the latter, in particular, set me thinking about ways of making my CSS leaner and more future proof. Essentially this meant making the static content in my stylesheets dynamic, so that the process of drafting, storing and updating them could be made automatic and consistent: and the solution was to switch to using a [CSS preprocessor](https://net.tutsplus.com/tutorials/html-css-techniques/sass-vs-less-vs-stylus-a-preprocessor-shootout/)[^1] with this exact purpose. My objective was pretty well summed up by Aaron Ackerman on his blog NittygrittyJS:

> CSS preprocessors are starting to become more apparent to a lot of developers. The point of them is to write less source code that maps to greater source code, but is hopefully more readable, understandable and programmatic. For example grid layout are very easy when a preprocessor can divide a full content width into a number of columns. Using variables can help keep colors consistent by always referencing a number of preset variables. Using mixins can prevent us from having to rewrite code and letting the preprocessor do it for us. Preprocessor are simply reaching for what CSS should already do. There have been proposals for this to happen in CSS but the indecision for the CSSWG has slowed this down considerably. But why not use some form of it now? We can use a preprocessor syntax can compile to CSS that works today.

## LESS or SASS?

When Alexis Sellier’s [LESS](https://lesscss.org/), was launched I had taken a close look at it, liked it but, doubtless through sheer apathy, never got round to using it. I eventually got kicked into action a couple of weeks ago, after reading a rather thoughtful [post](https://metaskills.net/2012/02/27/too-less-should-you-be-using-sass/) by Ken Collins, who makes a forceful case for SASS and Compass over LESS:

> I want to treat CSS as a language and use features like loops, lists and custom functions.

{{% cite %}}Smashing Magazine{{% /cite %}} published a rather good comparison by Jeremy Hixon, {{% cite %}}[An Introduction to LESS, and Comparison to SASS](https://coding.smashingmagazine.com/2011/09/09/an-introduction-to-less-and-comparison-to-sass/){{% /cite %}}, which decided me in favour of SASS as being the easiest way to migrate my existing CSS, into which I’d already put a lot of effort, to the discipline of a preprocessor.

## The reasons for using Compass

I chose to apply SASS using [Compass](https://web.archive.org/web/20181130213134/http://compass-style.org/), an open-source CSS authoring framework: it comes with a number of built-in modules that you can choose to include in your build, or you can [build your own](https://web.archive.org/web/20211201083557/https://compass-style.org/help/tutorials/extensions/) if preferred. I decided to install Compass.app, a powerful yet unobtrusive menubar utility meticulously developed and maintained by [Handlino](https://web.archive.org/web/20080730115411/http://handlino.com/) for Sass and Compass that helps designers compile stylesheets easily without resorting to command line interface. Compass.app brings support for two additional design frameworks, 960 Grid and html5boilerplate, in addition to Compass’s built-in extensions, Blueprint and Compass[^2]

Compass will set up a directory structure corresponding to the type of project you’re building (960 Grid, html5boilerplate, etc.) and you can then work from those files — in which you’ll be able to use the powerful [SASS markup](https://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html) — to achieve the desired stylesheet while keeping control of it.

## Fine-tuning your code with partials

To make the most of Compass, I found it best to divide up my stylesheet into {{% quote %}}partials{{% /quote %}}, prefixed by an underscore and stored in a separate `partials` folder. Each partial file can be made up of styles fitting a pattern. My current list looks as follows:

- `_author-reset.scss`
- `_banner.scss`
- `_base.scss`
- `_basic-reset.scss`
- `_contact.scss`
- `_fonts.scss`
- `_helpers.scss`
- `_home.scss`
- `_media.scss`
- `_mixins.scss`
- `_overrides.scss`
- `_primary-styles.scss`
- `_search-box.scss`
- `_sidebar.scss`
- `_single.scss`
- `_sitewide-styles.scss`
- `_style.scss`[^3]

The Compass client will continually {{% quote %}}watch{{% /quote %}} the folder in which you’re working for any changes to any of your `.scss` files. Whenever you save them, it will update your actual `.css` files, which are stored in a separate folder:

If a bug finds its way into your `scss` files, it’ll never get into your `css`: SASS will flag them when you save the file, and Compass.app will display a warning message, usually explaining what you got wrong. This is an incredibly useful feature.

## SASS’s most powerful features turn it, effectively, into a dynamic language

SASS is incredibly powerful and there’s almost no limit to what you can make it do dynamically to your css. I made most leverage of two features: variables and conditional statements.

### Variables

In my `_base.scss`, I created a wide range of variables, effectively allowing me to update my css by just applying the change to a single item — with SASS and Compass then doing the hard job of meticulously impacting each selector in all my style sheets accordingly, if required:

The variables stored in my `_base.scss` file include:

- paths for the CDN and image folder;
- the main site proportions and sizes (body width, page width, etc.);
- variables for each colour used, where possible expressed in relation to one another;
- colour definitions for any text not in the default body text colour;
- font sizes and definitions;
- data urls.

### Conditional statements

Possibly the most powerful feature of SASS is its ability to follow conditional statements.

In SASS, after the `@if` keyword, we can put a statement that will be evaluated as either true or false. If the statement is true, whatever is inside the following declaration block will be executed. I made extensive use of this to turn the stylesheets into, effectively, a dynamic code component in much the same way as PHP.

First, I declared three different values in each of my `scss` files for a variable called `$stylesheet-type`: `basic`, `contact` and `home`. For instance the content of the `home.css` file was as follows:

```

<span class="code-comment">/* Define the stylesheet as the home page sheet */</span>
$stylesheet-type: "home";
<span class="code-comment">/* Include all the content of the _style.scss file after processing */</span>
@import "partials/style.scss";

```

I then scanned my `scss` partials, marking up (a Textexpander shortcut made it painless) code according to whether it was required in one, two or three of my `css` style sheets, like this:

```

<span class="code-comment">// < - - - - ONLY INCLUDED IN STYLE.CSS</span>

@if $stylesheet-type == basic {

    <span class="code-comment">/* Any styles appearing here will only be included in style.css */</span>

}

<span class="code-comment">// [END] < - - - - ONLY INCLUDED IN STYLE.CSS</span>

<span class="code-comment">// < - - - - NOT INCLUDED IN HOME.CSS</span>

@if $stylesheet-type != home {

    <span class="code-comment">/* Any styles appearing here will ONLY be included in style.css and contact.css */</span>

}

<span class="code-comment">// [END] < - - - - NOT INCLUDED IN HOME.CSS</span>

```

In this way, once I’ve applied any changes I need to the variables, added, removed or amended selectors in my partials files, the mere click of a button will result in Compass.app compiling three perfectly-drafted stylesheets,one for each `scss` file in the project. Compass.app can be set to output CSS in compressed, compact, extended or nested format, depending on taste. I personally like to put them in production compressed, since the process of drafting and editing them is so heavily automated that this involves no extra work or risk at all. I find that I’m now able to work on new projects much faster than I did before. It’s fair to say that using SASS and Compass has radically changed the way I organise my life.

## Bibliography

- - Hampton Catlin and Michael Lintorn Catlin, [Pragmatic Guide to Sass](http://pragprog.com/book/pg_sass/pragmatic-guide-to-sass), The Pragmatic Bookshelf, 128 pages, December 116th, 2011, ISBN: 978-1-93435-684-5
- [Sass (Syntactically Awesome StyleSheets)](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html): The Sass reference is the most complete documentation for Sass. It contains information on every language feature, all the options, and how to install it as a Rails plugin.
- Wynn Netherland, Nathan Weizenbaum and Chris Eppstein, [Sass and Compass in Action](http://manning.com/netherland/), Manning Early Access Program, 300 pages, Began: April 2011, Softbound print: May 2012 (est.), ISBN: 9781617290145
- Jeremy Hixon, [An Introduction To LESS, And Comparison To Sass](http://coding.smashingmagazine.com/2011/09/09/an-introduction-to-less-and-comparison-to-sass/), Smashing Magazine, September 9th, 2011

[^1]: This article by NetTuts gives the clearest possible definition of what a CSS preprocessor is and what the various options on offer are.
[^2]: You can also [add](https://github.com/handlino/CompassApp/wiki/Use-Compass-Extensions) your own additional third-party extensions to Compass.app if desired.
[^3]: `_style.scss` (with an underscore) is different from `style.scss` (without an underscore), since partials, unlike full `scss` files, are only used as feeders for full SASS files and will not be compiled into `css` files.
