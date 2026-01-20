import { test, expect } from '@playwright/test';

test('Enter key regression test - Click then Enter', async ({ page }) => {
  // Navigate to the quiz page
  await page.goto('quiz');

  // Wait for questions to load
  await expect(page.locator('text=Loading Furry Questions')).toBeHidden({ timeout: 10000 });
  await expect(page.locator('h1').first()).toContainText('Question 1 /');

  // Click the first option. This should set focus on the button.
  await page.locator('button[role="radio"]').first().click();

  // Verify option is selected
  const checkButton = page.getByRole('button', { name: /Check Answer/i });
  await expect(checkButton).toBeEnabled();

  // Press 'Enter' to submit the answer
  // If focus is on the option button, this might fail if the app ignores Enter on interactive elements
  await page.keyboard.press('Enter');

  // Verify that "Next Question" button appears
  const nextButton = page.getByRole('button', { name: /Next Question/i });
  await expect(nextButton).toBeVisible();

  // Press 'Enter' to proceed to next question
  // Note: "Check Answer" button is removed, so focus is lost (body).
  // But let's see.
  await page.keyboard.press('Enter');

  // Verify we are on Question 2
  await expect(page.locator('h1').first()).toContainText('Question 2 /');
});
