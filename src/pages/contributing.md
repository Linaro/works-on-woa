---
layout: ../layouts/InfoLayout.astro
title: Contributing
description: How to contribute to this site
---

# Contributing to this site

## How to contribute

You will need your own GitHub account. If you do not already have one, go to https://github.com, click on **Sign up** in the top right corner of the page and follow the instructions from there.

Once you have your account, go to https://github.com/Linaro/works-on-woa/fork to *fork* (i.e. make your own copy) of the repository for this website.

Once you have forked the repository, clone it to your computer with the `git clone` command. See https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository for more guidance if you need it.

Once you have cloned the repository, make the necessary changes to the files. Guidance can be found below on the contents required and optional for each of the different files. If you need help, please create an issue via https://github.com/Linaro/works-on-woa/issues/new and we'll do our best to help.

When you've made your changes, [commit them](https://github.com/git-guides/git-commit) to your own repository and then [push](https://github.com/git-guides/git-push) them back to GitHub.

Finally, create a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) to ask for your changes to be merged into the official repository. Your request will be reviewed and, if approved, merged into the site.

**PLEASE NOTE!** It is **strongly** recommended that you try to build the website locally on your computer before pushing changes back to GitHub. This will ensure that the site builds correctly and you do not have any errors in your contribution. Please see the section *Developer Info* in the README file for instructions on how to do this.

## File content details

For games, there is a defined *schema* to ensure consistency of data across the submissions.

Each entry is stored in a file with a `.md` file extension. Game entries are stored under `src/content/games`.

If you are contributing your own report on an existing entry, it should be stored under `src/content/user_reports_games`.

Each file consists of:

- 3 dashes `---`
- Project-specific information as detailed below
- 3 dashes `---`
- Any additional notes in GitHub Markdown format

### Games schema

| Field | Type | Notes |
|-|-|-|
| `name` | string | The name of the game. |
| `icon` | string | Optional. The path to the icon file to use, relative to `public/icons`. 512x512 maximum. Use SVG if possible. |
| `categories` | list | A list of one or more categories that the game belongs to. A list of categories can be found in `src/content/gamess_categories`. Categories are referenced by their file name in this folder. |
| `publisher` | string | Optional. The name of the game's publisher. |
| `frame_rate` | string | Optional. Frames per second of the game. |
| `device_configuration` | string | Optional. Device used to test the game. |
| `os_version` | string | Optional. OS version used to test the game. |
| `driver_id` | string | Optional. ID of graphics driver used to test the game. |
| `date_tested` | date | Optional. Format is `YYYY-MM-DD` |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | How well the game plays. See help page for more information on how these are defined. |
| `compatibility_details` | string | Optional. Any additional information about the compatibility. |
| `auto_super_resolution` | block | Optional. See example below for syntax. |
| - `compatibility` | enum <ul><li>`yes, out-of-box`<li>`yes, opt-in`<li>`no` <li> `unknown` </ul> | Optional. Indicates compatibility with Auto Super Resolution feature. Opt-in means you need to enable the feature in Windows Settings, and out-of-box means that Auto SR is applied without changing any settings. |
| - `fps_boost` | string | Optional. How much Auto SR boosts the frame rate of a game by. |
| - `opt-in steps` | string | Optional. Steps on how to enable Auto SR for games that are opt-in. |
| `link` | URL | A link to where the software can be downloaded, or the application's main website. |

The `auto_super_resolution` block is optional but, if present, the attribute `compatibility` **must** be present. The block is formatted like this:

```
   auto_super_resolution:
      compatibility: yes, out-of-box
```

### Games User Report schema

Users can add their own findings regarding a game that has been added to this site. The file can have any **unique** filename (with a `.md` extension) and the contents must follow this schema:

| Field | Type | Notes |
|-|-|-|
| `reporter` | string | Optional. Your name. |
| `game` | string | The name of the game from its own filename, i.e. **without** the `.md` extension |
| `device_configuration` | string | Optional. The name of the device that you used. |
| `date_tested` | date | Optional. Format is `YYYY-MM-DD` |
| `os_version` | string | Optional. The OS version on your system. |
| `driver_id` | string | Optional. The graphics driver id on your system. |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | How well the game plays. See help page for more information on how these are defined. |
| `compatibility_details` | string | Your report of how the application ran for you. |
| `auto_super_resolution` | block | Optional. |
| - `compatibility` | enum <ul><li>`yes, opt-in`<li>`no`<li>`unknown`</ul> |  Indicates compatibility with Auto Super Resolution feature. Opt-in means you need to enable the feature in Windows Settings. |
| - `fps_boost` | string | How much Auto SR boosts the frame rate of a game by. |
| - `opt-in steps` | string | Optional. Steps on how to enable Auto SR for games that are opt-in. |

Note that for user game reports, auto super resolution compatibility can only be `yes, opt-in` or `no`, or `unknown`.

### Categories

For the game category list, this is constructed with an open square bracket `[`, one or more categories separated by commas, and a close square bracket `]`.

Categories must match the file name of an `.md` file in the appropriate categories folder as specified earlier.
