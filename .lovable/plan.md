# Hide the menu scrollbar

The tab menu (Profile, Experience, Portfolio, Contact) shows a scrollbar on desktop. Hide it, so the menu looks clean on every screen size.

## What changes
- No scrollbar appears under the tabs, on desktop or on phones.
- On narrow phone screens, the tabs can still be swiped sideways if they don't fit.

## Technical details
- In `src/components/SiteHeader.tsx`, the nav's inner `div` uses `overflow-x-auto`. Add a `scrollbar-none` utility to it.
- Define `.scrollbar-none` in `src/index.css` (`@layer utilities`): `scrollbar-width: none; -ms-overflow-style: none;` and `::-webkit-scrollbar { display: none; }`.
- The `-mb-px` on the tabs can trigger a small vertical overflow, so also set `overflow-y-hidden` on that div.
