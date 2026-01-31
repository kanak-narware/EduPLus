# Landing Page (Figma-aligned)

A landing page built so **layout, colours, typography, and elements** can match your [Figma design](https://www.figma.com/make/BFj9YtMXUV7ZNKyMyD4SeN/Untitled) exactly.

## Quick start

Open `index.html` in a browser, or run a local server:

```bash
npx serve .
```

## Matching the Figma design exactly

### 1. Colours

In **Figma**: Inspect → copy fill hex values.  
In **`styles.css`**: update the `:root` variables:

- `--color-bg`, `--color-bg-elevated`, `--color-surface` — backgrounds
- `--color-text`, `--color-text-muted` — body and secondary text
- `--color-accent`, `--color-accent-hover` — buttons and highlights
- `--color-border` — borders and dividers

### 2. Typography

In **Figma**: Inspect → font family, size, weight, line height.  
In **`styles.css`**: update `--font-sans` and the `--text-*` / `--leading-*` variables. Change the Google Fonts link in `index.html` if you use a different font.

### 3. Spacing and layout

In **Figma**: use Auto Layout padding/gap values.  
In **`styles.css`**: set `--space-*` and `--container-max` / `--container-padding` to match.

### 4. Images

- Export images from Figma (right‑click → Export), or use the **Framelink MCP** tool `download_figma_images` with your file key and node IDs.
- Put them in `assets/` as `hero-image.jpg` and `about-image.jpg` (or update the `src` in `index.html` to match your filenames).

### 5. Content and sections

Edit `index.html` to match copy, headings, and section order from your Figma frames. Add or remove sections as in the design.

## File structure

```
├── index.html    # Structure and content
├── styles.css    # Design tokens + layout (edit here to match Figma)
├── script.js     # Image fallback, etc.
├── assets/       # hero-image.jpg, about-image.jpg
└── README.md
```

## Figma API note

The file at `figma.com/make/...` may not be accessible via the standard Figma Files API (e.g. 400). To use **Framelink MCP** (`get_figma_data`, `download_figma_images`), open the same design in a normal Figma file (File → Save as .fig or duplicate to a team file) and use that file’s key in the MCP tools.
