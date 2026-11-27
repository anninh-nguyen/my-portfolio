# New Experience and Contact pages, bigger project images

## What changes
1. **Experience page** (`/experience`): the Experience list is moved off the Profile page, with the same layout as now.
2. **Contact page** (`/contact`): the Contact information (email, phone, location, website), the Social links (LinkedIn, GitHub) and the "Get in touch" form are moved off the Profile page.
3. **Top tabs**, in this order: Profile -> Experience -> Portfolio -> Contact.
4. **Profile page** keeps your name, title, bio, Education, Certificates and Hobbies.
5. **Portfolio**: each project image gets 30% bigger, from 64px to about 83px square.

## Technical details
- New pages `src/pages/Experience.tsx` and `src/pages/Contact.tsx`. Each one uses `SiteHeader` and the `max-w-2xl` container, and the titles use `text-heading`.
- Add the `/experience` and `/contact` routes in `src/App.tsx`.
- `SiteHeader`: add the NavLinks in the new order.
- `Index.tsx`: remove the sections that moved and the unused imports.
- `Portfolio.tsx`: change the image size from `h-16 w-16` to `h-[83px] w-[83px]`.
- No changes to the backend.
