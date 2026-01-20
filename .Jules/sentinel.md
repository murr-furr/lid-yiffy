## 2026-01-20 - Missing Security Headers
**Vulnerability:** The application was missing standard security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), making it potentially vulnerable to clickjacking and MIME sniffing.
**Learning:** React Router v7 applications do not include these headers by default in the `react-router-serve` environment, and they must be explicitly defined in the `headers` export of the root route or in the server adapter.
**Prevention:** Always verify security headers in the production environment and use the `headers` export in `root.tsx` or configure the server entry to include them.
