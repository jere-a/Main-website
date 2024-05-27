import { test, expect } from '@playwright/test';

test('Main.test', async ({ page }) => {
  await page.goto('/');
  expect(true).toBe(true);
})