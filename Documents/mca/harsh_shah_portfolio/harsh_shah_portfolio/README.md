# Harsh Shah — Portfolio Website

A responsive, accessible static portfolio built with HTML, CSS, and vanilla JavaScript. It can be hosted on GitHub Pages, Netlify, Vercel static hosting, or served locally.

## Included
- Responsive dark/light theme with remembered preference
- Actual supplied professional portrait in `assets/harsh-shah-profile.png`
- Mobile navigation, active section highlighting, and smooth scrolling
- Animated role text and reduced-motion support
- Skills, projects, experience, education, and CodeByHarsh sections
- Project filters
- Contact form validation with clear messaging
- SEO and social-sharing metadata

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Keep the `assets` folder alongside `index.html`.

No build process or package installation is required.

## Before publishing
1. Add a verified public email address to `recipient` in `script.js` if you want the contact form to open a prefilled email draft.
2. Add a resume PDF and link it from the navigation if you want a working resume download. A resume was not provided, so no fake download is included.
3. Verify project descriptions, repository links, and which features are implemented before publishing. The project art is illustrative, not a screenshot of a running application.
4. Add verified LinkedIn and certification links if you want them shown.
5. Check all public links and test the site at mobile, tablet, and desktop widths.

## Structure
- `index.html` — content and semantic structure
- `styles.css` — theme, layout, responsive styling, animations
- `script.js` — theme toggle, navigation, filters, reveal effects, form validation
- `assets/harsh-shah-profile.png` — supplied professional portrait

## Contact form
The form currently validates entries and clearly states that a public email address must be configured. It does not send or store messages. To use a backend instead, connect the form to a server endpoint or email service and implement server-side validation and spam protection.
