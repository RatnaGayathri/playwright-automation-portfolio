    import {test,expect} from '@playwright/test';
    test.beforeEach(async({page})=>
    {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').fill('standard_user')
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    
    });

    //Validating clciking on cart badge navigates to Your cart page
    test('user can navigate between inventory and cart pages', async({page})=>
    {

    await page.locator('[data-test="shopping-cart-link"]').click()

    //asserting user is your cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')

    //user is on your cart page
    await page.locator('[data-test="continue-shopping"]').click()

    //asserting  user is on inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="shopping-cart-link"]').click()

    //asserting user is on your cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    })


    //Validating cart badge count matches number of products in cart
    test('cart badge count matches number of products in cart', async ({ page }) =>
    {
    // Get badge count before opening cart
    const badgeCount = await page.locator('[data-test="shopping-cart-badge"]').textContent()
    // Open cart
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Count products in cart
    const productCount = await page.locator('[data-test="inventory-item"]').count();

    // Compare badge count with cart item count
    expect(Number(badgeCount)).toBe(productCount)
    });

    //Validating user can checkout and navigating back to Your cart page 
    test('user can checkout and navigate back to Your cart page ',async ({ page }) =>
    {
    await page.locator('[data-test="shopping-cart-link"]').click()

    //usee is on your cart page
    await page.locator('[data-test="checkout"]').click()

    //user is on Checkout: Your Information
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')

    //user navigates back to Your cart page
   await page.locator('[data-test="cancel"]').click()

    //asserting user is on your cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    })

//Validating the carts displays the added products
test('cart displays added products', async ({ page }) =>
{
 
await page.locator('[data-test="shopping-cart-link"]').click()
await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(['Sauce Labs Backpack','Sauce Labs Bike Light'])
})

//Validating product is removed from Your Cart page
test('verify user can remove the product', async({page})=>
{
   await page.locator('[data-test="shopping-cart-link"]').click()
   await page.locator('[data-test="remove-sauce-labs-backpack"]').click()

   //asserting the cart badge count decreases
   await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')

   //asserting the removed product is no longer listed
   await expect(page.getByText('Sauce Labs Backpack')).toBeHidden()
})
