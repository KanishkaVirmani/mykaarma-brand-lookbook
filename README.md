# myKaarma brand lookbook

The complete static website, ready for GitHub Pages or another static host. There is no build step, package installation, backend, or database.

## Consistent artwork hover

The same subtle 1.8% hover zoom is retained on all artwork using animated dimensions instead of nested image transforms. The social tile uses a full-resolution, opaque lossless copy of the original artwork. Click-to-enlarge is unchanged.

## Chrome cache fix

This package uses content-versioned CSS and JavaScript filenames, including both imported modules. Upload all files together so Chrome requests matching resources instead of reusing the previous filenames. The chosen third logo animation and slide 10 design are unchanged.

## November 4 update

- Slide 5: 36 bold, longer raspberry, lavender, and orange strokes play out over 1.15 seconds behind the final black logo after a 0.5-second pause, then disappear. Replay with R. Reduced-motion viewing retains the final black logo without the burst.
- Slide 10: the single supplied Automation social artwork sits beside the headline; the swag collage below includes the caps, jotters, pointers, and socks. Both open at full size on click.
- This package is for one manual GitHub update; the live sites have not been changed.
- Before copying these files into your existing local repository, click Fetch origin / Pull origin in GitHub Desktop to retrieve any changes made on GitHub. Copy the contents of this folder into that repository, replace matching files, then commit and push. Keep any existing hosting settings.

## What is included

- `index.html`: the 12 presentation pages.
- `styles.css`: layout, colours and typography.
- `app.js`: presenter controls and animations.
- `model.js`: page titles, presenter notes, and animation timing.
- `reveal-burst.js`: the brief brand-pattern accent behind the final black logo.
- `assets/`: supplied images, logos, silent video excerpts, fonts, and media manifest. Keep this folder intact.
- `.nojekyll`: tells GitHub Pages to serve the supplied static files directly.

Slide 2 finishes its complete collage entrance in 10 seconds, followed by a 3-second hold during automatic playback.

## Before publishing

Standard GitHub Pages sites are public. A private repository does not by itself make the hosted website private. If these board materials need restricted access, keep the repository private and arrange protected hosting, or confirm whether your company has eligible GitHub Enterprise Pages access controls. Publishing code to GitHub and publishing a website are separate steps.

## Recommended: let ChatGPT help push the files

1. Add/connect the GitHub integration in ChatGPT and allow access to the intended repository.
2. On GitHub, create a new repository named `mykaarma-brand-lookbook`. Start private while transferring the files. If using an existing repository, supply its exact link instead.
3. Send the repository link in the same ChatGPT conversation. The website files can then be pushed after the connection and write access are confirmed.
4. For GitHub Pages, agree on the website audience first. Then use the publishing settings below.

## Manual upload without coding: GitHub Desktop

Use this alternative if you prefer to handle the upload yourself.

1. Download GitHub Desktop from https://desktop.github.com/ and sign in with your GitHub account.
2. If you already have a repository, use File > Clone repository, select it, and choose a local folder. For a new repository, use File > New repository, name it `mykaarma-brand-lookbook`, and create it in a folder of your choice.
3. Extract this ZIP. Open the extracted `mykaarma-lookbook` folder.
4. Copy the CONTENTS of that folder into the local repository folder. The repository root must contain `index.html` and `assets/`, not another enclosing `mykaarma-lookbook` folder. Preserve the files inside `assets/`.
5. Return to GitHub Desktop. Review the changed files, enter `Add myKaarma brand lookbook` in Summary, and click Commit to main (or the branch name shown). If no changes are shown for a newly created repository, the files may already be in its initial commit.
6. For a new repository, click Publish repository. Keep this code private selected while transferring the files. Choose the correct personal account or company organization, then publish. For an existing repository, click Push origin.
7. Choose Repository > View on GitHub to verify that `index.html`, `styles.css`, `app.js`, `model.js`, and `assets/` are present at the top level.

Do not upload the ZIP itself as the website. GitHub Pages needs its extracted contents. GitHub Desktop handles this folder's many assets in one push, avoiding the browser uploader's per-upload file-count limit.

## Publish with GitHub Pages

Only do this after confirming that the site's visibility is appropriate and the account/repository plan supports Pages.

1. Open the repository on GitHub.
2. Go to Settings > Pages.
3. Under Build and deployment, set Source to Deploy from a branch.
4. Select the branch containing the website (usually `main`), select `/(root)`, and click Save.
5. Wait for the Pages deployment to finish. GitHub shows the actual website URL in Settings > Pages; open that URL and use it for sharing. Do not guess the URL.
6. If deployment fails, check the repository's Actions tab and the Pages build log. If Pages is unavailable for your private repository, do not make it public without deciding whether public access is acceptable.

There is no build command or dependency installation to configure. No custom domain is required.

## Presenter controls

- Right / Left arrow: next / previous beat. On New brand launch, these step through the four Cs before leaving the page.
- Click an artwork: open the full-size image. Close or Escape returns to the presentation.
- P: play/pause the opening.
- R: replay the current beat.
- N: presenter notes.
- F: fullscreen.
- The menu and top timeline provide direct navigation.

## Local viewing

Opening `index.html` directly from your file manager may fail because browsers restrict JavaScript modules and fetching local files. View it through a web server or the published website. If Python is installed, run `python -m http.server 8000` from this folder, then visit http://localhost:8000/.

## Typography and content

The new design uses DM Sans loaded from Google Fonts, with Arial as a fallback. Suisse Int'l was not supplied. Lato is bundled for the old-brand opening. Videos are silent. Certain future campaign visuals and testimonials are illustrative concepts and are labelled accordingly.

## Official setup references

- GitHub Desktop: https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop
- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub Pages visibility: https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site
