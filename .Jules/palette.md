## 2024-05-22 - Skip to Content Link
**Learning:** Adding a "Skip to main content" link requires `focus:absolute` and high z-index to be visible only on focus, but also needs `href` pointing to a valid ID on the `<main>` element of *every* page.
**Action:** Always ensure the target ID (`#main-content`) exists on the main container of all route components (including error boundaries) when implementing skip links.
