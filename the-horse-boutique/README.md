# THE HORSE BOUTIQUE — Visual Identity

> ## ⚠️ مجلد معزول — لا علاقة له بهوية مجموعة الشيخة
>
> هذا المجلد **قائم بذاته بالكامل** ولا يشارك في نظام تصميم هذا المستودع:
>
> - **لا يقرأ ولا يعدّل** `brand/design-tokens.css` ولا `brand/identity.html`
>   ولا أي ملف خارج `the-horse-boutique/`.
> - قاعدة «لا لون خام في أي صفحة» في `.kiro/steering/visual-identity.md` تخصّ
>   صفحات المجموعة الخمس (`admin` · `index` · `manager` · `report` ·
>   `balances`). هذا المجلد ليس منها ولا يمسّها.
> - `the-horse-boutique/brand/tokens.css` يعرّف متغيّرات على `:root`، بعض
>   أسماؤها تشبه أسماء متغيّرات المجموعة (`--color-bg` · `--color-primary` ·
>   `--font-sans`). **لا تُحمّل الملفَّين في نفس الصفحة أبداً** — كلٌّ منهما
>   لصفحته الخاصة، ولا تتقاطعان اليوم.
> - **علامة تجارية مختلفة وبلد مختلف:** بوتيك معدّات فروسية، لاتيني فقط.
>   مجموعة الشيخة في قطر، عربي أولاً، ذهب وكحلي.
>
> **تنبيه نشر:** هذا المستودع منشور على GitHub Pages من `main` والمجلد `/`.
> عند الدمج ستصبح هذه الصفحة **علنية** على
> `https://tihou74.github.io/attendnce-/the-horse-boutique/brand/index.html`.
> إن كان هذا غير مرغوب، ضع الهوية في مستودع خاص منفصل بدل دمج هذا الطلب.

Brand identity system for an equestrian equipment retailer. Version 0.1.

**Positioning:** maximum luxury. Oxblood, leather, brass, refined serif. The
reference tier is Hermès / Cavalleria Toscana / Sergio Grasso.

**Language:** Latin only. There is no Arabic wordmark and no bilingual lockup.

---

## Open the guidelines

Everything is static — no build step, no dependencies, no network.

```bash
open brand/index.html          # macOS
xdg-open brand/index.html      # Linux
```

---

## Structure

```
the-horse-boutique/
├── brand/
│   ├── index.html                     Brand guidelines document
│   ├── tokens.css                     Design tokens — single source of truth
│   ├── guidelines.css                 Styles for the guidelines page only
│   └── logo/
│       ├── thb-lockup-horizontal.svg  Primary signature
│       ├── thb-lockup-vertical.svg    Square / portrait signature
│       ├── thb-mark-stirrup.svg       Primary symbol (stirrup + H)
│       ├── thb-crest.svg              Crest seal (provenance device)
│       ├── thb-mark-bit.svg           Snaffle bit (category icon)
│       ├── thb-mark-horseshoe.svg     Horseshoe seal (solid stamp)
│       ├── thb-wordmark.svg           Wordmark, single line
│       ├── thb-wordmark-stacked.svg   Wordmark, two lines
│       └── thb-favicon.svg            Favicon / app icon, redrawn for 16px
└── README.md
```

---

## The mark

A **stirrup iron holding the letter H**. A stirrup is the one object shared by
every discipline and every price point in the catalogue — dressage, jumping,
endurance, or a first pony. It is the point where rider and equipment meet,
which is what a boutique does.

All symbols are **pure SVG path geometry**: no fonts, no raster, no filters.
They render identically at 16 px in a browser tab and at three metres on a
storefront, and they survive foil, deboss, embroidery and laser engraving
without a redraw.

Every symbol inherits `currentColor`, so recolouring is a CSS concern:

```html
<img src="brand/logo/thb-mark-stirrup.svg" width="32" alt="The Horse Boutique" />
```

```html
<!-- Inline, so it takes the surrounding text colour -->
<span style="color: var(--color-primary)">
  <svg viewBox="0 0 240 240" width="32"><use href="#mark-stirrup" /></svg>
</span>
```

---

## Colour

| Token | Hex | Role |
| --- | --- | --- |
| `--thb-oxblood-700` | `#5C1624` | Primary. Fields, headers, the mark. |
| `--thb-leather-600` | `#8A5A2B` | Secondary. Categories, packaging. |
| `--thb-brass-500` | `#B8944F` | Accent — **max 5% of any layout**. |
| `--thb-ivory-100` | `#F8F4EC` | Default surface. Never pure white. |
| `--thb-ink-900` | `#161214` | Body text. Warm near-black. |
| `--thb-green-700` | `#17463A` | Supporting heritage tone. Sparing. |

Target distribution: **ivory 60 / oxblood 25 / leather 10 / brass 5**. The
moment gold spreads past roughly 5%, the brand reads costume rather than
couture.

Consume the **semantic** tokens (`--color-primary`, `--color-bg`,
`--color-text`), never the primitives. That is what keeps the performance
register and dark mode one-file changes.

---

## Typography

Two families, both open-source.

| Role | Face | Notes |
| --- | --- | --- |
| Display / wordmark | **Cormorant Garamond** | High-contrast old-style serif |
| Body / UI | **Jost** | Geometric sans |

The wordmark is tracked to **0.34em**. That wide tracking is its single most
important property — it is what makes the name read as a house rather than a
shop sign. Never tighten it.

### Self-host the fonts

The fonts are **not** bundled and there is no CDN link, by design: a CDN adds a
third-party request, a privacy surface, and a render-blocking dependency on
someone else's uptime. Download the WOFF2 files and serve them yourself:

- Cormorant Garamond — <https://fonts.google.com/specimen/Cormorant+Garamond>
- Jost — <https://fonts.google.com/specimen/Jost>

Place them in `brand/fonts/` and add `@font-face` rules. Until then the page
falls back to Georgia and a system sans, so layout is correct but the
typographic character is not yet visible.

---

## The two registers

One palette, two voices, so a mixed catalogue never splits the brand in half.

| | Heritage (default) | Performance |
| --- | --- | --- |
| Lead face | Serif | Sans |
| Neutrals | Warm ivory | Cool graphite |
| Tracking | Wide | Tighter |
| Radii | Sharp | Flatter |
| Density | Generous | Denser |
| Use for | Saddlery, leather, apparel, gifting | Helmets, protection, technical |

Both registers share the **same hues**. The contemporary edge comes from
typography, tracking, density and neutral temperature — never from a new
colour. Apply per section, category or sub-brand:

```html
<section data-register="performance">…</section>
```

Dark mode ships too, via `data-theme="dark"` or the OS preference. In dark, brass
carries the hierarchy rather than oxblood.

---

## Before production

1. **Outline the wordmark.** `thb-wordmark*.svg` and both lockups use live
   `<text>` so tracking stays editable during approval. Before any print,
   signage, embroidery or foil run, convert type to outlines (Illustrator:
   *Type → Create Outlines*) and archive as `thb-wordmark-outlined.svg`. Live
   text substitutes a fallback face on any machine without the font installed.
2. **Raster exports.** Generate PNG at 1x/2x/3x and a multi-size `.ico` from
   `thb-favicon.svg`.
3. **Spot colour.** Convert oxblood, leather and brass to Pantone with the
   printer, on the actual stock. Do not trust a screen-derived conversion —
   oxblood in particular shifts badly on uncoated paper.
4. **Trademark search.** Clear the name and mark with the Saudi Authority for
   Intellectual Property (SAIP) before committing to signage or packaging.

---

## Open items

**Awaiting the brand roster.** Final calibration depends on the list of brands
carried under contract:

- **Hermès / Cavalleria Toscana / Sergio Grasso tier** → heritage becomes the
  only register, brass moves to real foil, the serif takes every headline.
- **Includes Kask / Samshield performance labels** → the performance register is
  promoted to equal status with its own category architecture.
- **Broad mix** → the dual-register system ships as designed.

Once the roster arrives, this repository gains a *Brands We Carry* section, a
partner-logo lockup rule, and a co-branding clear-space spec.

**Deliberately not shipped: horse-head silhouette.** A head mark was drafted and
rejected. A convincing equine profile depends on the jowl mass and a tight crop;
two drafts read closer to a giraffe than a horse. A weak figurative mark costs
more credibility than the extra asset is worth, and the stirrup, bit and
horseshoe already cover every use it would have served. If a head mark is still
wanted, it should be drawn as a dedicated illustration and reviewed on its own.
