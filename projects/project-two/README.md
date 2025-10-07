# Project Two — Germany Map Fit (Research)

An interactive research project: get 5 random German cities (≥ 150,000 citizens), drag their labels onto a schematic map of Germany, then compute the best scale-only fit that aligns your guesses with the cities’ true locations. The interface reports interesting measurements and decisions: scale factor, pixel/km errors per city, RMSE, pairwise-distance correlation, and outlier hints.

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

This project is configured for GitHub Pages. `vite.config.ts` sets `base: './'` so built assets load correctly from a subfolder.

To deploy:
1. Run `npm run build`
2. Publish the `dist` folder to GitHub Pages
3. Or use GitHub Actions for automation

## What’s Included

- Random city sampler from a curated list (≥150k population)
- Drag-and-drop placement onto a stylized Germany map area
- Scale-only Procrustes fit (centroid-aligned) between true vs. guessed points
- Error metrics: per-city pixel/km error, SSE, RMSE
- Pairwise distance correlation as a shape-preservation signal
- Clear, aesthetically pleasing UI with Tailwind
