# Birthday Reveal: 40th Edition 🎂

A mobile-first, tilt-controlled "Dark Nebula" inspired game built for a 40th birthday reveal. Navigate a marble through a neon-cyberpunk maze that subtly forms the number **40**.

## 🕹️ Game Features
- **Motion Controls:** Uses the `DeviceOrientationEvent` API (with iOS permission handling).
- **Physics Engine:** Powered by **Matter.js** for a weighted, snappy marble feel.
- **Cyberpunk Aesthetic:** Dark background with glowing neon walls and obstacles.
- **Sibling Mode:** A toggleable mode where the marble leaves a trail of sibling photos (or hearts) behind it.
- **Victory Sequence:** Celebration with canvas confetti and a reveal card for the ultimate birthday gift.

## 🚀 Deployment
This repository is pre-configured to deploy automatically to **GitHub Pages** via GitHub Actions.

1. Push your changes to the `main` branch.
2. Monitor the progress in the **Actions** tab of your repository.
3. The game will be live at `https://<your-username>.github.io/<repo-name>/`.

## 🛠️ Customization

### Assets
To personalize the game, replace the following files in the `assets/` directory:

- **Photos (`assets/photos/`):**
  - `sibling1.png`, `sibling2.png`, `sibling3.png`: Used for the Sibling Mode trail.
  - `gift.jpg`: The image shown on the final reveal card.
- **Sounds (`assets/sounds/`):**
  - `start.mp3`: Plays when the game begins.
  - `bounce.mp3`: Plays when hitting a wall.
  - `fall.mp3`: Plays when falling into a hole.
  - `win.mp3`: Plays upon reaching the goal.

### Development
Since this is a static site, you can test it locally by simply opening `index.html` in your browser. 
> **Note:** Mobile motion controls usually require a secure (HTTPS) context or a local development server for testing.

## 📦 Tech Stack
- [Matter.js](https://brm.io/matter-js/) (Physics)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) (VFX)
- Vanilla HTML5/CSS3/JavaScript
- GitHub Actions (CI/CD)
