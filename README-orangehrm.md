# OrangeHRM — Playwright Test Automation

UI test suite for the [OrangeHRM](https://opensource-demo.orangehrmlive.com/) open-source HR demo application, built with **Playwright** and **TypeScript**.

The suite covers authentication and a complete employee-record lifecycle: create, search, edit, delete, and verify removal.

---

## Why this project

SauceDemo (my other automation project) is a stable e-commerce demo with clean `data-test` attributes on every element. OrangeHRM is deliberately different: a Vue.js application with **no test attributes**, custom components instead of native HTML controls, and a **shared public database** that other people are changing while your tests run.

That made it a useful second project, because it forces the problems real applications have:

- choosing locators when there are no test hooks
- identifying one row in a table where every row has identical buttons
- generating unique test data so runs do not collide with each other
- asserting against values the server generates and you cannot predict

---

## Tech stack

| | |
|---|---|
| Test framework | Playwright Test |
| Language | TypeScript |
| Application under test | OrangeHRM 5.x (open-source demo) |
| Credentials | `Admin` / `admin123` (public demo account) |

---

## Getting started

**Prerequisites:** Node.js 18 or higher.

```bash
npm install
npx playwright install
```

**Running the tests:**

```bash
npx playwright test                           # all tests
npx playwright test --headed                  # watch them run
npx playwright test --ui                      # interactive UI mode
npx playwright test login.spec.ts             # a single file
npx playwright show-report                    # open the HTML report
```

---

## Test coverage

### `login.spec.ts` — Authentication

| Test | Verifies |
|---|---|
| Valid credentials | User reaches the dashboard |
| Invalid username | "Invalid credentials" shown, user stays on login |
| Invalid password | "Invalid credentials" shown, user stays on login |
| Both invalid | Same generic message — the app does not reveal which field was wrong |
| Empty fields | "Required" appears under both fields; the form does not submit |
| Logout | User is returned to the login page |

The invalid-credential tests are kept separate deliberately: together they document that OrangeHRM returns one generic message regardless of which field is wrong, which is intentional security behaviour rather than a vague error.

### `employee.spec.ts` — Employee lifecycle (end-to-end)

A single test covering the full record lifecycle:

1. **Create** — add a new employee via PIM → Add Employee
2. **Verify** — confirm the success message and the redirect to the personal details page
3. **Search** — find the new employee in the Employee List
4. **Edit** — change the first name and confirm the update
5. **Verify** — search again and confirm the list reflects the change
6. **Delete** — remove the record and confirm the deletion message
7. **Verify** — search once more and confirm "No Records Found"

---

## Problems solved, and how

### Shared test data

The demo database is public, so every run of an "add employee" test leaves a record behind and the next run cannot tell its own employee from the last one's.

**Solution:** generate a unique last name from the clock, and clean up at the end.

```ts
const lastName = 'Derek' + Date.now().toString().slice(-5);   // e.g. Derek21847
```

Because the test deletes the record it created, the database is left as it was found.

### Server-generated values

Saving an employee redirects to `/viewPersonalDetails/empNumber/183` — and the number is different every time.

**Solution:** assert the URL's *shape* rather than an exact string.

```ts
await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/);
```

### Identical controls on every table row

Every row in the Employee List has its own edit and delete icon, so a bare locator matches all of them.

**Solution:** narrow to the row first, then find the control inside it.

```ts
await page.getByRole('row')
          .filter({ hasText: lastName })
          .locator('.oxd-icon.bi-pencil-fill').click();
```

### Two fields sharing one placeholder

The Employee List has both an "Employee Name" and a "Supervisor Name" filter, and both use the placeholder `Type for hints...`.

**Solution:** scope by the surrounding labelled group rather than relying on page order.

```ts
await page.locator('.oxd-input-group', { hasText: 'Employee Name' })
          .getByPlaceholder('Type for hints...').fill(lastName);
```

### No test attributes

OrangeHRM has no `data-test` hooks, and its CSS classes are framework-generated (`oxd-*`) with Vue build artifacts (`data-v-957b4417`) that change on every rebuild.

**Solution:** prefer user-facing locators — `getByRole`, `getByPlaceholder`, `getByText` — and fall back to stable `oxd-` classes only where nothing better exists. Build-artifact attributes are never used.

### A slow public demo server

**Solution:** the lifecycle test raises its timeout to 60 seconds. Playwright's auto-waiting handles the rest.

---

## Notes

- The application under test is a public demo whose data is shared and reset periodically. Tests are written so they do not depend on any pre-existing record.
- Credentials are the publicly documented demo credentials; no private data is used.

---

## Possible next steps

- Refactor to the **Page Object Model** to centralise locators
- Add a separate spec covering the personal-details form — date picker, custom dropdowns and radio buttons
- Add a **GitHub Actions** workflow to run the suite on each push
