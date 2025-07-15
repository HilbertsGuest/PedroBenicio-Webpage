# 3D Blowtorch Sandbox - Fixed Version

This is the fixed version of the 3D Blowtorch Sandbox project with naming conflicts resolved.

## Changes Made for Isolation

1. **Renamed files to avoid conflicts:**
   - `index.css` → `blowtorch.css`
   - `index.tsx` → `blowtorch.js` (converted from TypeScript to JavaScript)
   - Updated HTML to reference the new file names

2. **Fixed duplicate references:**
   - Removed duplicate CSS and script tags in HTML
   - Cleaned up file paths

3. **Converted TypeScript to JavaScript:**
   - Removed TypeScript type annotations
   - Simplified for direct browser execution

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Or run directly in browser

Simply open `index.html` in a web browser - the project now uses CDN imports for Three.js and doesn't require a build step for basic functionality.