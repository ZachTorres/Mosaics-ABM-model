# How to Revert Homepage Design

If you want to go back to the original homepage design, run this command:

```bash
cp app/page.tsx.backup app/page.tsx
git add app/page.tsx
git commit -m "Revert to original homepage design"
git push origin main
```

This will restore the exact original design from before the Mosaic-tailored changes.

## What Changed

The Mosaic-tailored version includes:
- Clean white background instead of blue gradient
- Professional gray-900 color scheme (matching Mosaic's brand)
- Larger, more prominent headline and Mosaic logo
- More sophisticated input section with clearer instructions
- Dark-themed "Save & Share" bar with white buttons
- Professional typography and spacing
- Reference to "Epicor ECM" in the subheadline
- "25+ years of workflow automation expertise" tagline

The original version had:
- Blue gradient background (from-blue-50 to-indigo-100)
- Blue buttons and accents
- Simpler, more generic styling
- Green "Save & Share" button
- More compact layout
