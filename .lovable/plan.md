# Personal Portfolio — Implementation Plan

## Overview

A clean, light-themed single-page portfolio website with a protected admin area for editing your personal data, backed by Supabase.

---

## Public Portfolio Page (Single Scrollable Page)

### Hero / Bio Section

- Your name, title/tagline, and a short bio paragraph
- Optional profile photo

### Contact Info

- Display email, phone, location, and social links (LinkedIn, GitHub, etc.)

### Work Experience

- Timeline-style list showing job title, company, date range, and description
- Ordered by most recent first

### Education & Certificates

- Degrees with institution, field, and graduation year
- Certificates with issuer and date

### Hobbies

- Simple list of hobbies with optional icons

---

## Admin Area (Login Required)

- **Login page** at `/login` with email/password (single admin account)
- **Dashboard** at `/admin` to edit all sections:
  - Bio & contact info form
  - Add/edit/delete work experience entries
  - Add/edit/delete education & certificate entries
  - Add/edit/delete hobbies
- Changes save to Supabase and reflect immediately on the public page

---

## Database (Supabase)

Tables: `profile` (bio, contact info), `work_experience`, `education`, `hobbies` — all linked to the authenticated user and protected with Row-Level Security.

---

## Design

- Light, minimal theme with lots of white space
- Compact layout — no unnecessary padding
- Subtle section dividers, clean typography
- Responsive for mobile and desktop