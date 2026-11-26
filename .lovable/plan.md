# Move the contact form to its own "Contact" page

## What changes
- New page at `/contact` with the site cover and tabs, a "Get in touch" title, and the current contact form (same fields and the same check before sending).
- The top tabs become: Profile | Portfolio | Contact.
- The "Get in touch" form section is taken off the bottom of the Profile page. The Profile page keeps showing your email, phone, location and website.
- In the admin area, you can still view and delete messages the same way as now.

## Technical details
- Create `src/pages/Contact.tsx`, which renders `SiteHeader` plus `ContactForm` inside a `max-w-2xl` container. Titles use `text-heading`.
- Add a `/contact` route in `src/App.tsx`.
- Add a Contact `NavLink` in `src/components/SiteHeader.tsx`.
- Remove the ContactForm section and the unused imports from `src/pages/Index.tsx`.
- No changes to the backend.
