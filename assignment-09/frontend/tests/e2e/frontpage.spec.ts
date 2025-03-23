import { test, expect } from '@playwright/test';

test('Frontpage has a tab container with correct elements', async ({ page }) => {

  await page.goto('/');

  const tabContainer = await page.locator('[data-testid="tab-container"]');
  await expect(tabContainer).toBeVisible();

  const ul = tabContainer.locator('ul');
  await expect(ul).toBeVisible();

  const listItems = ul.locator('li');
  await expect(listItems).toHaveCount(2);

  await expect(listItems.nth(0)).toHaveText('Quotes List');
  await expect(listItems.nth(1)).toHaveText('Create Quote');
});
