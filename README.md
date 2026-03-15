# Misham Warsi — SAP Blog

Personal blog with GitHub Pages hosting, clean hash-based permalinks, and Decap CMS for writing articles.

---

## 🚀 One-Time Setup (do this once)

### Step 1 — Push to GitHub

1. Create a new repo on GitHub (e.g. `mishamwarsi-blog` or just your username repo)
2. Push all these files to the `main` branch:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` | Folder: `/ (root)`
4. Click **Save**

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### Step 3 — Update the CMS config

Open `admin/config.yml` and replace the placeholder:
```yaml
backend:
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME   # ← change this
```

### Step 4 — Enable Decap CMS OAuth (one-time)

Decap CMS needs permission to commit to your GitHub repo when you save articles.

1. Go to: **https://api.netlify.com/auth/done**
   *(Yes, Netlify's OAuth gateway — it's free and works with GitHub Pages)*
2. Or register your own GitHub OAuth App:
   - GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://YOUR_USERNAME.github.io/YOUR_REPO`
   - Callback URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/admin`
3. Then use `netlify-cms-github-oauth-provider` (see Decap docs) or use the simpler hosted gateway

**Easiest option:** Use [Netlify Identity + Git Gateway](https://decapcms.org/docs/git-gateway-backend/) for zero-config OAuth. Free Netlify account required but no deployment needed.

### Step 5 — Access the CMS

Once set up, go to:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/admin
```
Login with GitHub → write articles in the visual editor → click **Publish** → article is live in ~30 seconds.

---

## ✍️ Writing a New Article (CMS workflow)

1. Go to `yoursite/admin`
2. Click **New Blog Post**
3. Fill in the fields: Title, Excerpt, Category, Date, Tags, Body
4. Write the article in the rich Markdown editor
5. Click **Publish** (or **Save Draft** to come back later)
6. GitHub Actions automatically updates the site — live in ~30 seconds

---

## ✍️ Writing a New Article (manual workflow)

If you prefer editing files directly on GitHub:

### Step 1 — Create the `.md` file

Create `posts/your-article-slug.md`:

```markdown
---
id: your-article-slug
title: "Your Article Title"
excerpt: "1–2 sentence summary shown on blog cards."
category: SAP
date: 2025-04-15
dateLabel: April 15, 2025
read: 8 min read
icon: ⚙️
thumb: thumb-blue
tags: [SAP, S/4HANA, Tutorial]
---

## Your First Section

Write your article content here in standard Markdown.

> Use blockquotes for tips and callouts.

## Code Example

```abap
REPORT z_example.
WRITE: 'Hello World'.
```

- Bullet points work
- **Bold** and *italic* supported
```

**Categories:** `SAP` · `Tech` · `Tutorial` · `Career`
**Thumb options:** `thumb-blue` · `thumb-navy` · `thumb-green` · `thumb-orange` · `thumb-purple` · `thumb-teal`

### Step 2 — Commit and push

```bash
git add posts/your-article-slug.md
git commit -m "Add article: Your Article Title"
git push
```

GitHub Actions will automatically update `POSTS_MANIFEST` in `script.js` and redeploy. Done!

---

## 📁 File Structure

```
/
├── index.html                        ← Single HTML shell
├── admin/
│   ├── index.html                    ← Decap CMS panel
│   └── config.yml                    ← CMS field definitions ← EDIT THIS
├── assets/
│   ├── style.css                     ← All styles
│   └── script.js                     ← Router + POSTS_MANIFEST + renderers
├── posts/                            ← One .md file per article
│   ├── sap-s4hana-migration-guide-2025.md
│   └── ...
├── .github/
│   ├── workflows/sync-manifest.yml   ← Auto-syncs manifest on push
│   └── scripts/sync-manifest.js      ← The sync script
└── README.md
```

---

## 🔗 URL Structure

| Page | URL |
|------|-----|
| Home | `yoursite/#/` |
| Blog | `yoursite/#/blog` |
| Category | `yoursite/#/blog?cat=SAP` |
| Article | `yoursite/#/blog/sap-s4hana-migration-guide-2025` |
| About | `yoursite/#/about` |
| CMS Admin | `yoursite/admin` |
