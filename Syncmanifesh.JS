/**
 * .github/scripts/sync-manifest.js
 *
 * Reads every .md file in /posts, extracts frontmatter,
 * and rewrites the POSTS_MANIFEST array in assets/script.js.
 *
 * Run automatically by GitHub Actions on every push.
 * You can also run it locally: node .github/scripts/sync-manifest.js
 */

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ── Read all posts ────────────────────────────────────────
const postsDir = path.join(__dirname, '../../posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const entries = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');

  // Extract YAML frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.warn(`⚠️  No frontmatter found in ${file}, skipping.`);
    continue;
  }

  let fm;
  try {
    fm = yaml.load(fmMatch[1]);
  } catch (e) {
    console.warn(`⚠️  YAML parse error in ${file}: ${e.message}, skipping.`);
    continue;
  }

  // Slug = filename without .md (used as the URL)
  const slug = file.replace(/\.md$/, '');

  // Parse tags — support both YAML list and comma-separated string
  let tags = fm.tags || [];
  if (typeof tags === 'string') tags = tags.split(',').map(t => t.trim());

  // Build dateLabel from date if not provided
  let dateLabel = fm.dateLabel || '';
  if (!dateLabel && fm.date) {
    try {
      dateLabel = new Date(fm.date + 'T00:00:00Z').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      });
    } catch { dateLabel = String(fm.date); }
  }

  entries.push({
    id:        fm.id || slug,
    title:     fm.title     || 'Untitled',
    excerpt:   fm.excerpt   || '',
    category:  fm.category  || 'SAP',
    date:      fm.date      ? String(fm.date).slice(0, 10) : '',
    dateLabel: dateLabel,
    read:      fm.read      || '5 min read',
    icon:      fm.icon      || '📄',
    thumb:     fm.thumb     || 'thumb-navy',
    tags:      tags,
  });
}

// Sort newest-first
entries.sort((a, b) => b.date.localeCompare(a.date));

// ── Build the JS array string ─────────────────────────────
function jsStr(s) { return JSON.stringify(String(s || '')); }

const manifestLines = entries.map(e => `  {
    id:        ${jsStr(e.id)},
    title:     ${jsStr(e.title)},
    excerpt:   ${jsStr(e.excerpt)},
    category:  ${jsStr(e.category)},
    date:      ${jsStr(e.date)},
    dateLabel: ${jsStr(e.dateLabel)},
    read:      ${jsStr(e.read)},
    icon:      ${jsStr(e.icon)},
    thumb:     ${jsStr(e.thumb)},
    tags:      ${JSON.stringify(e.tags)},
  }`);

const newManifest = `const POSTS_MANIFEST = [\n${manifestLines.join(',\n')},\n];`;

// ── Patch script.js ───────────────────────────────────────
const scriptPath = path.join(__dirname, '../../assets/script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

const pattern = /const POSTS_MANIFEST = \[[\s\S]*?\];/;

if (!pattern.test(script)) {
  console.error('❌  Could not find POSTS_MANIFEST in assets/script.js');
  process.exit(1);
}

script = script.replace(pattern, newManifest);
fs.writeFileSync(scriptPath, script, 'utf8');

console.log(`✅  POSTS_MANIFEST updated with ${entries.length} posts.`);
entries.forEach(e => console.log(`   • ${e.id} (${e.category})`));
