# Portfolio Page, Projects, and Profile Avatar

## Overview
Add a top menu with two pages: **Profile** (current page, at `/`) and **Portfolio** (new, at `/portfolio`). Portfolio shows completed projects as cards like your example. Profile gets an uploadable avatar in the top-right corner.

## Top Menu
- Slim, light header on both pages: your name on the left, "Profile" and "Portfolio" links on the right (active link highlighted).

## Portfolio Page
- Projects grouped by **Portfolio** (e.g. "Manufacturing", "Fintech") — each group has a name and short intro, then its projects.
- Each project card (matching your screenshot):
  - Title (uppercase, green accent) with project image/logo top-right
  - My role and client location (highlighted)
  - Description (rich text)
  - Technologies
  - Achievements (rich text, arrow-style bullets)
  - Green bottom accent line
- Cards in a compact single column on mobile, two columns on wider screens.

## Profile Page Avatar
- Round avatar in the top-right of the hero, its bottom aligned with your title line.
- Upload a new avatar from the admin Profile form (preview + replace).

## Admin
- New "Portfolios" section: add/edit/delete/reorder portfolio groups.
- New "Projects" section: add/edit/delete projects, choose their portfolio, upload project image.
- Avatar upload added to Profile form.

## Technical Details
- New tables (public read, owner write, with grants + RLS):
  - `portfolios`: user_id, name, description, sort_order
  - `projects`: user_id, portfolio_id (FK, set null on delete), title, image_url, role, client_location, description (HTML), technologies (text), achievements (HTML), completed_date, sort_order
- Storage: public `portfolio-media` bucket; policies allow public read, authenticated users upload/update/delete only under their own `user_id/` folder. Used for avatars and project images; URL saved to `profile.avatar_url` / `projects.image_url`.
- New route `/portfolio` in `App.tsx`, shared `SiteHeader` component, hooks `usePortfolios`/`useProjects`, admin forms `PortfoliosForm`, `ProjectsForm`, reusable `ImageUpload`.
- Avatar alignment: hero uses flex with `items-end` so avatar baseline sits on the title row.
