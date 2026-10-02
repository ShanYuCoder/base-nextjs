import { expect, test } from '@playwright/test'

import { LOCAL_AUTH_EMAIL } from '../../src/config/local-auth'

import { mockAuthenticatedSession } from './helpers/session'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login/')
  })

  test('shows login form fields', async ({ page }) => {
    await expect(page.getByTestId('auth-login-page')).toBeVisible()
    await expect(page.getByTestId('auth-login-email-input')).toBeVisible()
    await expect(page.getByTestId('auth-login-password-input')).toBeVisible()
    await expect(page.getByTestId('auth-login-submit-btn')).toBeVisible()
  })

  test('shows heading and helper text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    await expect(page.getByText('アカウント情報を入力してください。')).toBeVisible()
  })

  test('shows email validation error for invalid email', async ({ page }) => {
    let loginAttempts = 0
    await page.route('**/api/auth/login*', () => {
      loginAttempts += 1
    })

    await page.getByTestId('auth-login-email-input').fill('not-an-email')
    await page.getByTestId('auth-login-password-input').fill('password123')
    await page.getByTestId('auth-login-submit-btn').click()
    await page.waitForTimeout(500)
    expect(loginAttempts).toBe(0)
  })

  test('shows password validation error for short password', async ({ page }) => {
    let loginAttempts = 0
    await page.route('**/api/auth/login*', () => {
      loginAttempts += 1
    })

    await page.getByTestId('auth-login-email-input').fill(LOCAL_AUTH_EMAIL)
    await page.getByTestId('auth-login-password-input').fill('short')
    await page.getByTestId('auth-login-submit-btn').click()
    await page.waitForTimeout(500)
    expect(loginAttempts).toBe(0)
  })

  test('shows validation errors when empty form is submitted', async ({ page }) => {
    let loginAttempts = 0
    await page.route('**/api/auth/login*', () => {
      loginAttempts += 1
    })

    await page.getByTestId('auth-login-submit-btn').click()
    await page.waitForTimeout(500)
    expect(loginAttempts).toBe(0)
  })

  test('keeps user on login page when credentials are not authenticated', async ({ page }) => {
    await page.getByTestId('auth-login-email-input').fill(LOCAL_AUTH_EMAIL)
    await page.getByTestId('auth-login-password-input').fill('wrongpassword')
    await page.getByTestId('auth-login-form').evaluate((form) => (form as HTMLFormElement).requestSubmit())
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects authenticated user away from login page', async ({ page }) => {
    await mockAuthenticatedSession(page)
    await page.goto('/login/?next=%2F')
    await expect(page).toHaveURL('/')
  })
})
