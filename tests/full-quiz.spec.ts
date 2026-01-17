import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Full Quiz Completion', () => {
  // Set a very long timeout (20 minutes) to allow completing all ~575 questions
  test.setTimeout(20 * 60 * 1000);

  test('should complete the entire quiz and log results', async ({ page }) => {
    // Setup logging
    const logDir = path.resolve('test-results');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.resolve(logDir, 'quiz_completion.log');
    // Clear previous log
    fs.writeFileSync(logFile, `Starting quiz completion test at ${new Date().toISOString()}\n`);

    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, `${new Date().toISOString()}: ${msg}\n`);
    };

    let quizFinished = false;
    let finalScoreMessage = '';

    // Handle the "Quiz finished" alert
    page.on('dialog', async dialog => {
      const message = dialog.message();
      log(`Dialog appeared: ${message}`);
      if (message.includes('Quiz finished!')) {
        quizFinished = true;
        finalScoreMessage = message;
      }
      await dialog.dismiss();
    });

    log('Navigating to quiz page...');
    await page.goto('/quiz');

    // Wait for loading to finish
    await expect(page.locator('text=Loading Furry Questions')).toBeHidden({ timeout: 15000 });

    // Verify quiz started
    const header = page.locator('header h1').first();
    await expect(header).toBeVisible();

    const headerText = await header.innerText();
    log(`Quiz started. Header: ${headerText}`);

    // Parse total questions from "Question 1 / 575"
    const parts = headerText.split('/');
    if (parts.length < 2) {
        throw new Error(`Could not parse total questions from header: ${headerText}`);
    }
    const totalQuestions = parseInt(parts[1].trim(), 10);
    log(`Total questions detected: ${totalQuestions}`);

    // Loop through all questions
    for (let i = 1; i <= totalQuestions; i++) {
        // Log progress every 10 questions to avoid spamming stdout
        if (i % 10 === 0 || i === 1 || i === totalQuestions) {
            log(`Answering question ${i} / ${totalQuestions}`);
        }

        // Verify we are on the right question index (optional, but good for sanity)
        // Note: The UI updates optimistically, but we should ensure the element is ready.
        // We rely on the "Check Answer" button being enabled or reset.

        // Select the first option (Option A)
        // We click the first button with role="radio"
        const optionA = page.locator('button[role="radio"]').first();
        await optionA.click();

        // Click "Check Answer OwO"
        const checkButton = page.getByText('Check Answer OwO');
        await checkButton.click();

        // Wait for "Next Question" button to appear
        const nextButton = page.getByText('Next Question');
        await expect(nextButton).toBeVisible();

        // Click "Next Question"
        // If it's the last question, this will trigger the alert and reset the quiz.
        await nextButton.click();

        // Small delay to ensure transitions don't get stuck (Playwright is usually fast)
        // verifyAnswer has 50ms delay.
    }

    // Wait for the dialog to be processed
    await page.waitForTimeout(2000);

    if (!quizFinished) {
        throw new Error('Quiz finished dialog did not appear after answering all questions.');
    }

    log(`Quiz completed successfully! Result: ${finalScoreMessage}`);

    // Verify that the quiz reset (back to question 1)
    await expect(page.locator('header h1')).toContainText('Question 1 /');
  });
});
