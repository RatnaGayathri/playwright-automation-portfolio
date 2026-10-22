# SauceDemo — Playwright Test Automation

End-to-end UI test suite for [SauceDemo](https://www.saucedemo.com/), an e-commerce demo application, built with **Playwright** and **TypeScript**.

The suite automates the complete purchase journey — login, product browsing, cart management, checkout and order completion — and includes a documented defect found during manual testing.

---

## Project background

This project began as **manual testing**: I wrote test cases covering the application's core flows, executed them, and logged the defects I found. The automation here covers the highest-value cases from that manual suite, so the two bodies of work map onto each other.

One defect found during manual testing (**Bug-005**) is captured in the automated suite as a `test.fixme`, documenting the expected behaviour for when it is fixed.

---

## Tech stack

| | |
|---|---|
| Test framework | Playwright Test |
| Language | TypeScript |
| Browsers | Chromium, Firefox, WebKit |
| CI | GitHub Actions — the suite runs on every push |
| Reporting | Built-in Playwright HTML reporter |

---

## Getting started

**Prerequisites:** Node.js 18 or higher.

```bash
npm install
npx playwright install
```

**Running the tests:**

```bash
npx playwright test                           # all tests, headless
npx playwright test --headed                  # watch them run in a browser
npx playwright test --ui                      # interactive UI mode
npx playwright test login.spec.ts             # a single file
npx playwright test --project=webkit          # one browser only
npx playwright show-report                    # open the HTML report
```

---

## Continuous integration

A GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the suite automatically on every push and pull request. The HTML report is uploaded as a build artefact, so a failing run can be opened and inspected without reproducing it locally.

---

## Test coverage

**38 tests across 6 spec files.**

### `login.spec.ts` — Authentication

| Test | Verifies |
|---|---|
| Valid credentials | User is redirected to the inventory page |
| Invalid username | The correct error message is shown |
| Invalid password | The correct error message is shown |
| Locked-out user | The lockout message is shown |
| Logout | User is returned to the login page |

### `inventory.spec.ts` — Products, sorting and detail page

| Test | Verifies |
|---|---|
| Add / remove from the listing | The button toggles and the badge updates |
| Default sort order | Products load sorted by Name (A–Z) |
| Sort by Name (Z–A) | Order reverses correctly |
| Sort by Price (low → high) | Prices ascend |
| Sort by Price (high → low) | Prices descend |
| Product detail page | Name and description match the listing |
| Add to cart from the detail page | Badge increments |
| Cart badge increments | Count matches the number of products added |
| Cart badge removed when empty | Badge element leaves the DOM entirely |
| "Back to products" | Returns to the inventory page |

### `cart.spec.ts` — Cart contents and navigation

| Test | Verifies |
|---|---|
| Navigate between inventory and cart | Both directions work |
| Badge count matches contents | Badge equals the number of rows listed |
| Cancel checkout | User is returned to the cart |
| Cart contents | Exactly the products added appear |
| Remove a product | Row clears and the badge updates |

### `checkout.spec.ts` — Checkout information form

| Test | Verifies |
|---|---|
| Valid details | User advances to the overview page |
| Cancel | User is returned to the inventory page |
| Missing first name | Required-field error appears |
| Missing last name | Required-field error appears |
| Missing postal code | Required-field error appears |
| Dismiss the error banner | Close button removes the message |

### `overview.spec.ts` — Order overview and completion

| Test | Verifies |
|---|---|
| Cart contents retained | The products carry through to the overview |
| **Item total is correct** | The test sums the individual prices itself and compares — no hardcoded total |
| Finish the order | Confirmation page shown, badge cleared, user returned to products |

### `emptycart.spec.ts` — Empty-cart behaviour

| Test | Verifies |
|---|---|
| Empty cart proceeds to checkout | Documents the current (incorrect) behaviour — Bug-005 |
| `test.fixme` | Asserts checkout *should* be blocked, for when the bug is fixed |

---

## Defect found

**Bug-005 — Checkout proceeds with an empty cart**

| | |
|---|---|
| **Steps** | Log in → open the cart with no items → click Checkout |
| **Expected** | The application prevents checkout and keeps the user on the cart page |
| **Actual** | The user reaches `checkout-step-one.html` and can begin checkout with nothing ordered |
| **Severity** | Medium — allows an invalid order flow to be started |

The suite holds two tests for this: one that **passes**, documenting the behaviour as it is today, and one marked `test.fixme` asserting the behaviour that *should* occur once the bug is fixed. The `fixme` test is reported as skipped rather than failed, so the defect stays visible in the test report without breaking the build — and it will start failing the moment someone fixes the bug and forgets to re-enable it.

---

## Approach and decisions

**Locator strategy.** Tests use SauceDemo's `data-test` attributes throughout. These exist specifically for testing, so they survive styling and layout changes in a way CSS classes do not.

**Setup via hooks.** Each file uses `beforeEach` to establish the state its tests need — logged in for the inventory tests, items in the cart for the cart tests, all the way to the overview page for the order tests. This keeps each test focused on the one thing it verifies.

**Assertions prove outcomes, not actions.** Every test asserts a user-visible result — a URL, a message, an element count — rather than simply performing clicks and assuming they worked.

**Calculated rather than hardcoded values.** The price-total test reads each product price from the page, sums them, and compares against the displayed total:

```ts
const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
const itemPrices = prices.map(price => Number(price.replace('$', '')));
const calculatedTotal = itemPrices.reduce((sum, price) => sum + price, 0);
expect(calculatedTotal).toBe(displayedTotal);
```

The test stays correct regardless of which products are in the cart, and it would catch a genuine calculation bug — an assertion against a fixed `$49.98` would not.

**Element absence vs. visibility.** SauceDemo removes the cart badge from the DOM when the cart empties rather than showing `0`, so those assertions use `toHaveCount(0)` rather than checking for text.

---

## Possible next steps

- Refactor to the **Page Object Model** to centralise locators
- Extend coverage to the `problem_user` and `performance_glitch_user` accounts
