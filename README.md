# Portfolio

Herald's personal portfolio site, a single page built with React, TypeScript and Vite.

## Tech stack

- **React 19** + **TypeScript**, bundled with **Vite**
- **GSAP** for scroll and reveal animations
- **OGL** (WebGL) for the dithered hero image
- **lucide-react** for icons

## Project structure

```
public/
├── images/              Photos used on the page (hero portrait, selected work)
└── logos/               Logo SVGs

src/
├── main.tsx             Entry point, mounts <App/>
├── App.tsx              Page layout: puts every section in order
├── index.css            Global tokens (colors, fonts, gutter, z-index) and base styles
│
├── sections/            Parts of the page, one file each
│   ├── Preloader.tsx    Intro screen, shown once per browser session
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Greeting.tsx
│   ├── SelectedWork.tsx
│   ├── WorkIntro.tsx    Title and photos at the top of SelectedWork
│   ├── Expertise.tsx
│   └── Footer.tsx
│
├── components/          Reusable building blocks used inside sections
│   ├── Cursor.tsx           Custom cursor
│   ├── Dither.tsx           WebGL dither effect for images
│   ├── ErrorBoundary.tsx    Shows a fallback if a child component crashes
│   ├── HoverExpandList.tsx  Project list that expands on hover
│   ├── Logo.tsx             "HRLD." wordmark
│   ├── Marquee.tsx          Scrolling keyword strip
│   ├── ScrollRevealText.tsx Text that reveals as you scroll
│   ├── TechText.tsx         Animated canvas text for the hero name
│   └── Transition.tsx       Page transition (not used at the moment)
│
├── content/             All text, links and image paths, one file per section
├── styles/              One stylesheet per component or section
├── types/
│   └── site.ts          Types describing the shape of each content file
└── lib/                 Shared non-component code
    ├── cursorTarget.ts  Attributes linking the cursor to project rows
    └── wordmark.ts      SVG path data for the logo (Logo and Footer)
```