## 2025-02-20 - Resource Pattern Enables Trivial Preloading
**Learning:** The "Resource Pattern" (singleton promise cache) used in `questionsResource.ts` decouples data fetching from component lifecycle. This makes performance optimizations like "prefetch on hover" trivial to implement because you can simply import and call the fetch function anywhere, without worrying about context or props.
**Action:** When using Suspense/`use`, prefer lifting the promise creation to a module-level cache (resource) to enable easy preloading from other routes.
