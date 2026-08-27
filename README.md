# Gaurav's Personal Website

An editorial-meets-data personal site built with [Astro](https://astro.build) + React.
Warm paper, serif type, and chart-annotation details (mono section labels, axis rules, a
ggplot-style legend for social links).

## Run it

```powershell
npm install     # first time only
npm run dev     # local preview at http://localhost:4321
npm run build   # production build into dist/
```

## Edit your info (one file)

Everything personal lives in **`src/site.config.ts`**:

- your name, tagline, and the About paragraphs
- all social links — replace every `REPLACE_ME` with your real handle

Before deploying, also set your real domain in `astro.config.mjs` (`site:`).

## Write a blog post (the important part)

Create a new markdown file in **`src/content/blog/`** — that's it. The filename
becomes the URL (`my-post.md` → `/blog/my-post/`).

### Organize with folders

Posts can live in folders and subfolders, nested as deep as you like — the
folder path becomes part of the URL, shows as a `dir/` prefix on the blog
index, and every folder automatically appears in the index's `dir` filter
(filtering by a parent folder includes its subfolders):

```
src/content/blog/
├── hello-world.md                     → /blog/hello-world/
├── analysis/
│   └── sports/
│       └── ufc-prediction.md          → /blog/analysis/sports/ufc-prediction/
└── books/
    └── best-of-2026.md                → /blog/books/best-of-2026/
```

Moving a post between folders changes its URL, so avoid reshuffling posts
after people have linked to them.

```markdown
---
title: "My post title"
date: 2026-09-01
description: "One-line summary shown on the index page."
tags: ["analysis", "r"]
---

Write normal markdown here. Headings, code blocks, tables,
images, blockquotes — all styled automatically.
```

Notes:

- `title` and `date` are required; everything else is optional.
- `tags` power the tag filter on /blog — invent any tags you like,
  they appear automatically. Folders and tags are independent axes:
  folders are *where a post lives* (one place), tags are *what it's
  about* (as many as you want).
- Add `draft: true` to the frontmatter to hide a post while writing it.
- Posts are grouped by year and sorted newest-first automatically.
- An RSS feed is generated at `/rss.xml`.

The three posts currently in that folder are samples — replace them.

## Deploy (free options)

The site builds to plain static files, so any static host works:

- **Vercel / Netlify**: push this folder to a GitHub repo, import it,
  framework preset "Astro", done.
- **GitHub Pages**: use Astro's official GitHub Action
  (withastro/action) — see docs.astro.build/en/guides/deploy/github/.
