# Contextual PRM App

A React application for managing personal relationship management with contextual insights.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages. The `vite.config.ts` includes the necessary `base: './'` configuration for proper asset loading on GitHub Pages.

To deploy:
1. Run `npm run build`
2. Deploy the `dist` folder to GitHub Pages
3. Or use GitHub Actions for automatic deployment

## Features

- Contact management with contextual facts
- Interaction tracking and insights
- NLP-based fact extraction
- Dashboard view with analytics