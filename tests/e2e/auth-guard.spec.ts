import { expect, test } from '@playwright/test'

import { clearSession, mockAuthenticatedApi, mockAuthenticatedSession } from './helpers/session'

test.describe('Auth guard', () => {
  test.beforeEach(async ({ context }) => {
    await clearSession(context)
  })

  test('redirects / to login when unauthenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects arbitrary protected route to login when unauthenticated', async ({ page }) => {
    await page.goto('/some-protected-route')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/login is publicly accessible without authentication', async ({ page }) => {
    await page.goto('/login/')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByTestId('auth-login-email-input')).toBeVisible()
  })

  test('authenticated user can access protected route without redirect', async ({ page }) => {
    await mockAuthenticatedSession(page)
    await mockAuthenticatedApi(page)
    await page.goto('/')
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page).toHaveURL('/')
  })
})
