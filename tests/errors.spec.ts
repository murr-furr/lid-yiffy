import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display furry 404 page for unknown routes', async ({ page }) => {
    // Navigate to a non-existent route
    const response = await page.goto('unknown-route-uwu');

    // Check status code (React Router might return 404 status for the document request)
    // Note: In some SPA/SSR setups, the initial status might be 200 or 404 depending on how it's served.
    // Since we throw Response(404) in loader, the server should return 404.
    expect(response?.status()).toBe(404);

    // Verify furry content
    await expect(page.locator('h1')).toContainText('OwO? Path not found!');
    await expect(page.locator('body')).toContainText("We sniffed everywhere but couldn't find this page");
    await expect(page.locator('text=😿')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Return to Safety 🐾' })).toBeVisible();
  });

  // Testing POST 405 via browser navigation is tricky as browsers only do GET for navigation.
  // We can try to use page.evaluate to fetch using POST and check the response text/status if possible,
  // but Playwright's page.request is better for API testing.

  test('should return 405 for POST requests to unknown routes', async ({ request }) => {
    const response = await request.post('unknown-route-uwu');
    expect(response.status()).toBe(405);
    const text = await response.text();
    // The response body should contain the HTML with furry error
    expect(text).toContain('Nu-uh! Method not allowed!');
    expect(text).toContain('*baps paw*');
  });

  test('should return 405 for POST requests to existing routes without action', async ({ request }) => {
    // /quiz exists but has no action
    const response = await request.post('quiz');
    expect(response.status()).toBe(405);
    const text = await response.text();
    // The response body should contain the HTML with furry error
    expect(text).toContain('Nu-uh! Method not allowed!');
  });
});
