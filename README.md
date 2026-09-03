# Renamix Website

Official marketing website for **Renamix**, a Windows batch file renaming
application. Built as static HTML/CSS/JS with no build step, so it can be
deployed directly to GitHub Pages.

## Project structure

```
/
├── index.html                  Landing page (hero, features, screenshots, FAQ, pricing)
├── user-guide.html             Full user guide
├── style.css                   All styles
├── script.js                   Mobile nav, accordion, and guide scroll-spy
├── assets/
│   ├── logo/                   Renamix logo, icon crop, and generated favicons
│   ├── screenshots/            Screenshot placeholders (replace with real screenshots)
│   └── icons/                  (reserved — feature icons are inline SVG in the HTML)
└── README.md
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Choose the branch (e.g. `main`) and the `/ (root)` folder, then save.
5. GitHub will publish the site at `https://<username>.github.io/<repo>/`.

No build tools, package managers, or servers are required.

## Replacing the screenshot placeholders

The screenshots section (`index.html`, `#screenshots`) currently shows three
placeholder SVGs so the layout can be reviewed before real screenshots exist:

- `assets/screenshots/placeholder-main-window.svg`
- `assets/screenshots/placeholder-preview.svg`
- `assets/screenshots/placeholder-filters.svg`

To swap in real screenshots, either:

- Replace those three files with real screenshots **using the same filenames**
  (PNG/JPG both work — just update the file extension in `index.html` if you
  don't keep them as `.svg`), or
- Add your own image files to `assets/screenshots/` and update the `src`
  attributes on the corresponding `<img>` tags in `index.html`.

Recommended screenshot size: roughly 1600×1000px (16:10), so they stay sharp
on high-density displays.

## Connecting the checkout button

The **Buy Renamix** button in the pricing section (`index.html`, `#pricing`)
currently points to `#`. Once you have a Lemon Squeezy checkout link, update
the `href` on the element marked with `data-checkout-link`:

```html
<a class="btn btn-primary btn-block btn-large" href="#" data-checkout-link>Buy Renamix</a>
```

Replace `href="#"` with your Lemon Squeezy checkout URL, for example:

```html
<a class="btn btn-primary btn-block btn-large" href="https://your-store.lemonsqueezy.com/checkout/buy/xxxxxxxx" data-checkout-link>Buy Renamix</a>
```

The two other "Get Renamix — $5" buttons (hero and final CTA) link to the
pricing section by default (`#pricing`). You can point those at the checkout
URL directly too, once it's ready.

## Editing placeholder content

A few sections intentionally use placeholder language until final details are
confirmed:

- FAQ answers for "Do I need Java installed?" and "How do I get updates?"
- The Windows version support note in the User Guide's troubleshooting section
- GitHub, YouTube, and contact links in the footer (`index.html` and
  `user-guide.html`) — currently pointing to placeholder URLs

Search for these in `index.html` and `user-guide.html` and update them once
the information is finalized.

## Logo

The logo files in `assets/logo/` come from the provided source artwork:

- `renamix-logo-full.png` — full logo lockup (icon + wordmark), used in the footer
- `renamix-icon.png` — icon-only mark, used in the sticky navigation
- `favicon.ico`, `icon-*.png` — generated favicon sizes for browsers and devices

These were cropped from the original artwork without altering colors or
proportions. If you receive an updated logo file, regenerate the favicon set
to match.

## Browser support notes

- The FAQ and troubleshooting accordions use native `<details>`/`<summary>`
  with the `name` attribute for "only one open at a time" behavior, with a
  small JavaScript fallback for older browsers.
- Motion is minimal and respects `prefers-reduced-motion`.
- No external fonts or JavaScript libraries are loaded — the site uses the
  operating system's own fonts for fast loading.
