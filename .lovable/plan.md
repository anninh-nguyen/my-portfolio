# Sort Experience by start date and Projects by completed date

## What changes
- Experience page: jobs are listed by start date, newest first. Jobs with no start date go to the bottom.
- Portfolio page: projects in each portfolio are listed by completed date, newest first. Projects with no completed date go to the bottom.
- The admin dashboard lists use the same order, so they match the public pages.

## Technical details
- `src/hooks/usePortfolioData.ts`:
  - `useWorkExperience`: change `.order("sort_order")` to `.order("start_date", { ascending: false, nullsFirst: false }).order("sort_order")`.
  - `useProjects`: change it to `.order("completed_date", { ascending: false, nullsFirst: false }).order("sort_order")`.
- Portfolio groups keep their own manual order. No database changes.
