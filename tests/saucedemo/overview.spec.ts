import {test,expect} from '@playwright/test';

     test.beforeEach(async({page})=>
    {
    await page.goto('https://www.saucedemo.com/')

    await page.locator('[data-test="username"]').fill('standard_user')

    await page.locator('[data-test="password"]').fill('secret_sauce')

    await page.locator('[data-test="login-button"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()

    await page.locator('[data-test ="add-to-cart-sauce-labs-bike-light"]').click()

    await page.locator('[data-test="shopping-cart-link"]').click()

    await page.locator('[data-test="checkout"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')

    await page.locator('[data-test="firstName"]').fill('Joe')

   await page.locator('[data-test="lastName"]').fill('ken')

   await page.locator('[data-test="postalCode"]').fill('2345')

    await page.locator('[data-test="continue"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html')

    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    });


 //Validating cart badge count is equal to no of products
    test('cart badge count matches number of products in cart', async ({page}) =>
{
   
const badgeCount = await page.locator('[data-test="shopping-cart-badge"]').textContent()

const productCount = await page.locator('[data-test="inventory-item"]').count();

expect(Number(badgeCount)).toBe(productCount)  

})

//validating the item total, final total calculation
    test('verify item total, final total calculation', async ({ page }) =>
    {
        const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents(); 

    const itemPrices = prices.map(price =>Number(price.replace('$', ''))  );

    const calculatedTotal = itemPrices.reduce((sum, price) => sum + price,0);

    const itemTotalText = await page.locator('[data-test="subtotal-label"]').textContent();

    const displayedTotal = Number(itemTotalText?.replace('Item total: $', ''));

    expect(calculatedTotal).toBe(displayedTotal);

})

//  Validating user can finish the order
test('Verify user can finsih the order' , async({page})=>
{

await page.locator('[data-test="finish"]').click()

await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html')

await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!')

await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!')

await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')

await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

await page.locator('[data-test="back-to-products"]').click()

await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

});

