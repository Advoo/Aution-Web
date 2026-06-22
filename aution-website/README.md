# AUTION Website · Multi-Page Project

Ready to use. Edit, deploy, done.

## 📁 Project Structure
```
aution-website/
├── index.html          ← Home page
├── about.html          ← About & story
├── services.html       ← Services offered
├── book.html           ← Booking + Leaflet map
├── team.html           ← Team grid
├── community.html      ← Community signup
├── media.html          ← The Collection podcast
├── contact.html        ← Contact form
├── css/
│   └── style.css       ← All styling (navy/blue theme)
├── js/
│   └── main.js         ← All interactivity (edit your details here)
└── assets/img/
    ├── hero-home.jpg   ← Replace with Cape Town/van photo
    ├── welcome.jpg     ← Replace with founders photo
    ├── about-story.jpg ← Replace with story photo
    ├── banner.jpg      ← Used on inner pages
    ├── cta-bg.jpg      ← Call-to-action background
    ├── service-*.jpg   ← 3 service images (760×540)
    ├── team-1.jpg through team-8.jpg ← Team photos (replace monogram placeholders)
    ├── logo.png        ← AUTION logo (dark)
    ├── logo-white.png  ← AUTION logo (light, footer)
    └── og-image.jpg    ← Social sharing image (1200×630)
```

## ⚡ First Steps

### 1. **Edit Your Contact Details** (js/main.js, top of file)
```javascript
const AUTION = {
  whatsapp: '27846681513',              // ← Your WhatsApp number (digits only)
  email:    'aution.pty.ltd@gmail.com', // ← Your email
  youtube:  '#'                         // ← Paste your YouTube channel link
};
```

### 2. **Update Team Members** (js/main.js, search for "TEAM =")
Replace placeholders with real names, roles, universities and bios:
```javascript
const TEAM = [
  {n:'Your Name', r:'Your Role', u:'Your University', img:'assets/img/team-1.jpg', b:'Your bio here'},
  // ... 8 total
];
```

### 3. **Replace ALL Placeholder Images**
Every image in `assets/img/` has a placeholder showing what it's for. Just overwrite:
- **Hero image** (1920×1080): Cape Town street / van / students
- **Service images** (760×540): Airport, campus, group trip photos
- **Team photos** (520×520): Your 8 directors' headshots
- **Logo** (if needed): Edit SVG in css/style.css `:root` colours or drop new PNG

## 🎨 Styling & Colours

All colours in one place: **css/style.css** `:root`
```css
--navy: #0A1B2E;     /* Dark blue */
--blue: #1E5BFF;     /* Electric blue */
--cyan: #15D6E6;     /* Motion cyan */
--cloud: #F4F7FB;    /* Light bg */
```

Change any colour once, updates everywhere.

## 📱 Pages Explained

| Page | Purpose | Key Edit |
|------|---------|----------|
| **index.html** | Home with hero, services, stats | Update hero headline & CTA |
| **about.html** | Your story & why to trust | Edit mission/vision cards |
| **services.html** | What you offer (airport, campus, groups) | Update service descriptions |
| **book.html** | Interactive booking + Leaflet map | Pre-wired for WhatsApp handoff |
| **team.html** | 8 directors, timeline, story | Edit TEAM array in js/main.js |
| **community.html** | Join newsletter/Discord | Update join opportunities |
| **media.html** | The Collection podcast | Paste YouTube links |
| **contact.html** | Contact form (→ WhatsApp) | Pre-wired, no backend needed |

## 🔗 How Booking & Forms Work

**No backend server needed.** All forms use WhatsApp deep-links:
1. User fills form → clicks button
2. Opens WhatsApp with pre-filled message
3. You confirm on WhatsApp (your real number from `js/main.js`)

Edit WhatsApp number once in `js/main.js`, all forms update.

## 🚀 Deploy (Choose One)

### GitHub Pages (Free, instant)
1. Create a GitHub repo named `aution-website`
2. Push this folder to `main` branch
3. Settings → Pages → Deploy from `main`
4. Live at `username.github.io/aution-website`

### Netlify (Free, faster)
1. Drag-drop this folder to netlify.com
2. Live in 60 seconds

### Any Host
Just upload the folder to your web server. No build step, no dependencies.

## 📝 Making Changes

Every page auto-loads:
- `css/style.css` (all styling)
- `js/main.js` (all interactivity, your details)

Edit a file → refresh → see changes. No build tools needed.

### Key Edits in js/main.js:
- Lines 1–5: Your WhatsApp, email, YouTube
- Search "TEAM =": Edit your 8 directors
- Search "PLACES =": Cape Town neighbourhoods (pre-loaded for booking map)

## ✅ Checklist Before Launch

- [ ] Replace WhatsApp number & email in `js/main.js`
- [ ] Add real team member names & bios in `js/main.js` (TEAM array)
- [ ] Replace all placeholder images in `assets/img/`
- [ ] Test booking map: pick pickup/destination, see route draw
- [ ] Test a form: fill it out, confirm WhatsApp opens with your pre-filled message
- [ ] Check mobile: nav menu, forms, buttons work on phone
- [ ] Update any hardcoded text (headlines, testimonials, episodes)

## 🎯 File Sizes & Performance

- **index.html**: 23 KB (includes nav, hero, services, testimonials)
- **css/style.css**: 32 KB (entire design system)
- **js/main.js**: 16 KB (nav, forms, map, chat widget)
- **Images**: ~500 KB total (pre-optimized)

Total: ~1.2 MB (all 8 pages + assets). Loads in <1.5s on 4G.

## 📞 Customization Ideas

1. **Change hero headline**: Edit the `<h1>` in `index.html`
2. **Add your colours**: Edit `:root` variables in `css/style.css`
3. **Disable floating chat**: Comment out `.fab` and `.chat-panel` in HTML
4. **Change fonts**: Poppins (display) + Inter (body) loaded from Google Fonts in each `<head>`
5. **Add Google Analytics**: Paste tracking code in `<head>` of any page

## ⚠️ Important

- Keep `js/main.js` updated with your real number/email — forms won't work without it
- Placeholder images guide you: "service-airport.jpg = airport photo, 760×540px"
- All 8 pages share the same nav, footer, and floating widget — edit `js/main.js` once, updates everywhere

---

**Questions?** Every HTML file includes comments explaining sections. View the source and follow along.

Open in VS Code, make your edits, deploy. You're live.
