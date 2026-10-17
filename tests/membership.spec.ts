import { expect, test, type Page } from '@playwright/test'
import {
  EMPTY_MEMBERSHIP_FORM,
  parseEuroAmount,
  toMembershipApplication,
  validateMembershipForm,
} from '../src/lib/membership'
import type { MembershipFormValues } from '../src/types/content'
import { MEMBERSHIP_TEST_ENDPOINT } from './membership-endpoint'

const VALID: MembershipFormValues = {
  ...EMPTY_MEMBERSHIP_FORM,
  firstName: 'Ada',
  surname: 'Lovelace',
  street: 'Universitätsstraße 30',
  postalCity: '95447 Bayreuth',
  email: 'ada@example.org',
  membershipType: 'full',
  declarationAccepted: true,
  privacyNoted: true,
  adultConfirmed: true,
  confirmationName: 'Ada Lovelace',
}

test('euro amounts accept a decimal point or comma', () => {
  expect(parseEuroAmount('25')).toBe(25)
  expect(parseEuroAmount(' 25,5 ')).toBe(25.5)
  expect(parseEuroAmount('25.50')).toBe(25.5)
  for (const input of ['', 'twenty', '25.505', '1.000,00', '-20']) {
    expect(parseEuroAmount(input)).toBeNull()
  }
})

test('an empty form reports every required answer', () => {
  expect(validateMembershipForm(EMPTY_MEMBERSHIP_FORM)).toEqual({
    firstName: 'required',
    surname: 'required',
    street: 'required',
    postalCity: 'required',
    email: 'required',
    membershipType: 'required',
    declarationAccepted: 'unchecked',
    privacyNoted: 'unchecked',
    adultConfirmed: 'unchecked',
    confirmationName: 'required',
  })
  expect(validateMembershipForm(VALID)).toEqual({})
  expect(validateMembershipForm({ ...VALID, email: 'ada@example' })).toEqual({ email: 'email' })
})

test('conditional answers are required only while they apply', () => {
  const legal = { ...VALID, membershipType: 'supporting-legal' as const }
  expect(validateMembershipForm(legal)).toEqual({ organisation: 'required', chosenFee: 'required' })
  expect(
    validateMembershipForm({
      ...legal,
      organisation: 'Example GmbH, Grace Hopper',
      chosenFee: '49,99',
    }),
  ).toEqual({ chosenFee: 'minimum' })

  const individual = { ...VALID, membershipType: 'supporting-individual' as const }
  expect(validateMembershipForm({ ...individual, chosenFee: '20' })).toEqual({})
  expect(validateMembershipForm({ ...individual, chosenFee: 'twenty' })).toEqual({
    chosenFee: 'amount',
  })

  expect(validateMembershipForm({ ...VALID, whatsapp: true })).toEqual({ mobile: 'required' })
  expect(validateMembershipForm({ ...VALID, whatsapp: true, mobile: '12 34' })).toEqual({
    mobile: 'phone',
  })
  expect(
    validateMembershipForm({ ...VALID, whatsapp: true, mobile: '+49 (151) 234-56789' }),
  ).toEqual({})

  // A hidden field left over from an earlier choice never blocks the form.
  expect(validateMembershipForm({ ...VALID, organisation: 'x'.repeat(500) })).toEqual({})
})

test('only answers that still apply are sent', () => {
  const leftovers = {
    ...VALID,
    firstName: '  Ada ',
    organisation: 'Left over',
    chosenFee: '99',
    mobile: '0151 2345678',
    feeReductionRequest: 'Left over',
  }
  expect(toMembershipApplication(leftovers, 'de')).toEqual({
    language: 'de',
    firstName: 'Ada',
    surname: 'Lovelace',
    street: 'Universitätsstraße 30',
    postalCity: '95447 Bayreuth',
    email: 'ada@example.org',
    membershipType: 'full',
    feeReduction: false,
    emailList: false,
    whatsapp: false,
    declarationAccepted: true,
    privacyNoted: true,
    adultConfirmed: true,
    confirmationName: 'Ada Lovelace',
    website: '',
  })

  const supporting = toMembershipApplication(
    {
      ...VALID,
      membershipType: 'supporting-legal',
      organisation: ' Example GmbH ',
      chosenFee: '75,50',
      whatsapp: true,
      mobile: '+49 151 2345678',
    },
    'en',
  )
  expect(supporting).toMatchObject({
    organisation: 'Example GmbH',
    chosenFee: 75.5,
    mobile: '+491512345678',
  })
})

async function fillValidApplication(page: Page) {
  await page.getByLabel('First name').fill('Ada')
  await page.getByLabel('Surname').fill('Lovelace')
  await page.getByLabel('Street and number').fill('Universitätsstraße 30')
  await page.getByLabel('Postal code and city').fill('95447 Bayreuth')
  // By role: the footer's email icon link is also labelled "Email".
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('ada@example.org')
  await page.getByRole('radio', { name: /^Full member/ }).check()
  await page.getByRole('checkbox', { name: /^I hereby apply for membership/ }).check()
  await page.getByRole('checkbox', { name: /^I have read and noted/ }).check()
  await page.getByRole('checkbox', { name: /at least 18 years old/ }).check()
  await page.getByLabel('Full name as confirmation').fill('Ada Lovelace')
}

test.describe('membership application page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membership')
    // The page is inert under the site's loading screen at first, so typing would go nowhere.
    await expect(page.getByRole('status', { name: 'Loading Bayreuth AI Association' })).toHaveCount(
      0,
    )
    await expect(
      page.getByText('Online applications aren’t open yet.', { exact: false }),
      'Start the dev server with VITE_MEMBERSHIP_FORM_URL set; see the README.',
    ).toHaveCount(0)
  })

  test('the Join Us page links to the application', async ({ page }) => {
    await page.goto('/apply')
    await page.getByRole('link', { name: 'Apply for membership' }).click()
    await expect(page).toHaveURL(/\/membership$/)
    await expect(page.getByRole('heading', { name: 'Membership application' })).toBeVisible()
  })

  test('switching to German translates the form and its errors', async ({ page }) => {
    await page.getByRole('button', { name: 'Deutsch' }).click()
    await expect(page.getByRole('heading', { name: 'Mitgliedsantrag' })).toBeVisible()
    await expect(page.locator('div[lang="de"]')).toHaveCount(1)

    await page.getByRole('button', { name: 'Antrag absenden' }).click()
    await expect(page.getByLabel('Vorname')).toBeFocused()
    await expect(page.getByText('Bitte füllen Sie dieses Feld aus.').first()).toBeVisible()
    await expect(page.getByText('Bitte prüfen Sie die markierten Felder.')).toBeVisible()
  })

  test('conditional fields appear only when they apply', async ({ page }) => {
    const organisation = page.getByLabel('Organisation and contact person')
    const fee = page.getByLabel('Chosen annual fee (in €)')
    await expect(organisation).toHaveCount(0)

    await page.getByRole('radio', { name: /legal entity/ }).check()
    await expect(organisation).toBeVisible()
    await expect(fee).toBeVisible()
    await page.getByRole('radio', { name: /^Full member/ }).check()
    await expect(organisation).toHaveCount(0)
    await expect(fee).toHaveCount(0)

    await page.getByRole('checkbox', { name: /^WhatsApp group/ }).check()
    await expect(page.getByLabel('Mobile phone number')).toBeVisible()
    await page.getByRole('checkbox', { name: /reduction or waiver/ }).check()
    await expect(page.getByLabel('Your request (optional)')).toBeVisible()
  })

  test('a valid application is sent and confirmed', async ({ page }) => {
    let sent: unknown
    await page.route(MEMBERSHIP_TEST_ENDPOINT, async (route) => {
      sent = route.request().postDataJSON()
      await route.fulfill({ status: 200, json: { ok: true } })
    })
    await fillValidApplication(page)
    await page.getByRole('button', { name: 'Send application' }).click()

    await expect(
      page.getByRole('heading', { name: 'Thank you for your application.' }),
    ).toBeFocused()
    await expect(page.getByText('IBAN: DE90 8306 5408 0007 0227 78')).toBeVisible()
    expect(sent).toEqual({
      language: 'en',
      firstName: 'Ada',
      surname: 'Lovelace',
      street: 'Universitätsstraße 30',
      postalCity: '95447 Bayreuth',
      email: 'ada@example.org',
      membershipType: 'full',
      feeReduction: false,
      emailList: false,
      whatsapp: false,
      declarationAccepted: true,
      privacyNoted: true,
      adultConfirmed: true,
      confirmationName: 'Ada Lovelace',
      website: '',
    })
  })

  test('failures and rate limits are reported', async ({ page }) => {
    let status = 500
    await page.route(MEMBERSHIP_TEST_ENDPOINT, (route) => route.fulfill({ status }))
    await fillValidApplication(page)

    await page.getByRole('button', { name: 'Send application' }).click()
    await expect(
      page.getByText('Your application could not be sent.', { exact: false }),
    ).toBeVisible()

    status = 429
    await page.getByRole('button', { name: 'Send application' }).click()
    await expect(
      page.getByText('Too many applications have been sent', { exact: false }),
    ).toBeVisible()
  })

  test('the paper form can be downloaded', async ({ page }) => {
    // File signatures rather than content types: Vite's dev server sends none for .docx.
    for (const [name, signature] of [
      ['PDF', '%PDF'],
      ['Word (.docx)', 'PK'],
    ]) {
      const link = page.getByRole('link', { name })
      await expect(link).toHaveAttribute('download', '')
      const response = await page.request.get((await link.getAttribute('href'))!)
      expect(response.ok()).toBe(true)
      expect((await response.body()).subarray(0, signature.length).toString('latin1')).toBe(
        signature,
      )
    }
  })
})
