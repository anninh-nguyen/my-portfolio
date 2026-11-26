# Dark navy blue titles

## What changes
Every title on the Profile and Portfolio pages turns dark navy blue: your name, section headings (Contact, Social, Experience, Education, Certificates, Hobbies, Get in touch), job titles, degree and certificate names, the "Portfolio" heading, group names and project titles. Body text and the tabs stay as they are.

## Technical details
- Add a `--heading` colour token in `src/index.css` (light: about `220 60% 20%`; dark mode: a lighter navy-tinted value so it stays readable) and register `heading` in `tailwind.config.ts`.
- In `src/pages/Index.tsx` and `src/pages/Portfolio.tsx`, swap `text-foreground` / `text-muted-foreground` / `text-primary` on all h1/h2/h3 elements for `text-heading`.
