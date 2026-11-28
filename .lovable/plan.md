# Sort Experience by start date

## What changes
- On the Experience page, jobs are listed by start date, newest first (most recent job at the top).
- Jobs without a start date go to the bottom.
- The work experience list in the admin dashboard uses the same order, so it matches the public page.

## Technical details
- In `src/hooks/usePortfolioData.ts`, `useWorkExperience` currently orders by `sort_order`. Change it to `.order("start_date", { ascending: false, nullsFirst: false })`, with `sort_order` as a tiebreaker.
- No database changes. `sort_order` is still written on insert but no longer decides display order.
