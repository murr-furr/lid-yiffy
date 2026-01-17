import { test, expect } from '@playwright/test';

test.describe('Quiz Application', () => {
  test('should load the quiz and interact correctly', async ({ page }) => {
    // Navigate to the quiz page
    await page.goto('http://localhost:5173/quiz');

    // Wait for questions to load (handling Suspense fallback)
    await expect(page.locator('text=Loading Furry Questions')).toBeHidden({ timeout: 10000 });

    // Check if the question card is visible
    await expect(page.locator('h1').first()).toContainText('Question 1 /');

    // Verify neural debug hook is present (console logs) - difficult to test in UI, but we test functionality

    // Select an option
    await page.locator('button[role="radio"]').first().click();

    // Check answer
    await page.getByText('Check Answer OwO').click();

    // Expect result to be shown (Correct or Incorrect)
    await expect(page.locator('text=Next Question')).toBeVisible();

    // Click Next
    await page.getByText('Next Question').click();

    // Verify we are on question 2
    await expect(page.locator('h1')).toContainText('Question 2 /');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:5173/quiz');
    await expect(page.locator('text=Loading Furry Questions')).toBeHidden();

    // Tab to options
    await page.keyboard.press('Tab'); // Back link
    await page.keyboard.press('Tab'); // Option A (usually)

    // Select with Enter
    await page.keyboard.press('Enter');

    // Check if selected
    // Note: The specific focus order depends on DOM, but assuming standard flow
  });
});
