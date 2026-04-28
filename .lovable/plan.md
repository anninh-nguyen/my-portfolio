# Separate Social Links from Contact

## Overview

On the public portfolio page, split LinkedIn and GitHub out of the Contact section into a dedicated "Social" section. Website URL stays in Contact (since it's a personal site, not a social profile).

## Changes

### `src/pages/Index.tsx`

- **Contact section**: Keep only Email, Phone, Location, and Website. Update the conditional render check accordingly.
- **New Social section**: Added directly after Contact, shown only if LinkedIn or GitHub is set.
  - Heading: "Social" with a small icon (e.g. `Share2` from lucide-react)
  - Renders LinkedIn and GitHub links with their existing icons, using the same flex-wrap layout and styling as Contact.
  - Wrapped in a `<Separator />` for visual consistency with other sections.

No database, admin form, or schema changes — both fields already exist on the profile and are edited in `ProfileForm.tsx`.

## Result

```text
Hero / Bio
─────────
Contact         → Email · Phone · Location · Website
─────────
Social          → LinkedIn · GitHub
─────────
Experience
...
```
