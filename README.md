Sarah Birthday Mini Game

This repo hosts a small interactive birthday game that can be deployed via GitHub Pages.

Structure
- docs/: GitHub Pages site root
  - index.html: Game page
  - styles.css: Styling
  - app.js: Game logic
  - assets/images/: Place the birthday photo here as `photo.jpg`
  - instructions/: Place the original PDF here (kept for reference)

How to Use
1) Put the provided photo into `docs/assets/images/` named `photo.jpg` (or update the path in `index.html`).
2) Put the existing instructions PDF into `docs/instructions/` (any filename).
3) Commit and push to GitHub.
4) In GitHub: Settings → Pages → Build and deployment
   - Source: Deploy from a branch
   - Branch: `main` (or `master`) and Folder: `/docs`
   - Save.
5) Wait for the Pages build to finish; your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

Game Overview
- A sliding puzzle (3×3, 4×4, 5×5) built from the birthday photo.
- Timer and move counter; win screen with celebratory message.
- Keyboard arrow controls and accessible labels for basic a11y.

Customization
- Update the headline and message in `docs/index.html` to personalize it.
- Replace `photo.jpg` with any image; recommended aspect ratio ~4:3 or square.

