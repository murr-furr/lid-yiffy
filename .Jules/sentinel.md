## 2026-01-20 - Missing Security Headers
**Vulnerability:** The application was missing standard security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), making it potentially vulnerable to clickjacking and MIME sniffing.
**Learning:** React Router v7 applications do not include these headers by default in the `react-router-serve` environment, and they must be explicitly defined in the `headers` export of the root route or in the server adapter.
**Prevention:** Always verify security headers in the production environment and use the `headers` export in `root.tsx` or configure the server entry to include them.

## 2026-01-21 - Container Root Privilege
**Vulnerability:** The application container was running as the `root` user by default, increasing the potential impact of a container breakout or runtime compromise.
**Learning:** Node.js Alpine images provide a `node` user, but it is not enabled by default. Explicitly switching users is required for defense-in-depth.
**Prevention:** Always include `USER node` (or another non-root user) in the final stage of the Dockerfile, ensuring appropriate file permissions with `chown`.

## 2026-01-23 - Weak Transport Security & Broad Permissions
**Vulnerability:** The application lacked `Strict-Transport-Security` (HSTS) and had a minimal `Permissions-Policy`, potentially allowing downgrade attacks and unnecessary access to powerful browser features.
**Learning:** Even if an application is served via HTTP in a container (e.g., port 3000), adding HSTS is a critical defense-in-depth measure for when it sits behind a TLS-terminating proxy.
**Prevention:** Always enable HSTS with `preload` and explicitly deny all unused browser features in `Permissions-Policy` to minimize the attack surface.
