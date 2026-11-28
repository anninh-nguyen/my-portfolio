# Auto-hiding page scrollbar on desktop

The page scrollbar on desktop will act like it does on phones. It stays hidden, shows up as a thin bar while you scroll, and fades out about a second after you stop.

## What changes
- No scrollbar shows when the page is idle.
- A thin, rounded bar appears in the theme's muted color while you scroll, then fades out.
- Scrolling still works the same way: mouse wheel, trackpad and keyboard.
- Phones stay the same.

## Technical details
- Hide the native scrollbar on `html` with the existing `.scrollbar-none` rules (`scrollbar-width: none`, `::-webkit-scrollbar { display:none }`).
- Add `src/components/ScrollIndicator.tsx`, a fixed bar on the right edge (`w-1.5 rounded-full bg-muted-foreground/40`). Its height and position come from `scrollY / scrollHeight`. It listens to `scroll` and `resize` events.
- On scroll it sets opacity to 1, and a 1s timeout brings it back to 0 with a CSS transition. It is `pointer-events-none` and is not shown when the page doesn't overflow.
- Mount it once in `App.tsx`.
