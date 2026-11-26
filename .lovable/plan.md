# Keep the cover at a 4:1 ratio

## What changes
The cover band at the top of both Profile and Portfolio pages will always be 4 times wider than it is tall, on any screen size. Uploaded cover photos fill that band and are cropped evenly from the centre if their shape differs.

## Technical details
- In `src/components/SiteHeader.tsx`, replace the fixed heights `h-40 sm:h-56` on the cover container with `aspect-[4/1]` (keep `w-full overflow-hidden` and the gradient fallback).
- Keep `object-cover` on the image so it fills the 4:1 box without distortion.
