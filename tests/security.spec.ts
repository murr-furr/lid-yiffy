import { test, expect } from '@playwright/test';

test('Security headers are present', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  const headers = response!.headers();

  // Strict Transport Security (HSTS)
  expect(headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains; preload');

  // Content Security Policy (CSP)
  // Just checking existence and basic directives as the full string is long and might change
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['content-security-policy']).toContain("script-src 'self'");

  // X-Frame-Options
  expect(headers['x-frame-options']).toBe('DENY');

  // X-Content-Type-Options
  expect(headers['x-content-type-options']).toBe('nosniff');

  // Referrer-Policy
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');

  // Permissions-Policy
  // Checking for expanded list
  const pp = headers['permissions-policy'];
  expect(pp).toContain('camera=()');
  expect(pp).toContain('microphone=()');
  expect(pp).toContain('geolocation=()');
  expect(pp).toContain('payment=()');
  expect(pp).toContain('usb=()');
  expect(pp).toContain('accelerometer=()');
  expect(pp).toContain('gyroscope=()');
  expect(pp).toContain('magnetometer=()');
});
