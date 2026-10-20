
import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>
{
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce');
   await page.locator('[data-test="login-button"]').click();
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    //await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    //await page.locator('#add-to-cart-sauce-labs-bike-light').click()
   
});

//Empty cart should not allow checkout, but it does (Bug-005)
test('user navigates to checkout with an empty cart', async({page}) =>
{
//cart should be empty
 await page.locator('[data-test="shopping-cart-link"]').click()
 await expect(page.locator('[data-test="title"]')).toContainText('Your Cart')
 await expect(page.locator('[data-test="cart-desc-label"]')).toContainText('Description')

 //click on checkout
 await page.locator('[data-test="checkout"]').click()

 //an error message for not filling the information
 await page.locator('[data-test="continue"]').click();
 await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required')

 await page.locator('[data-test="cancel"]').click()
 
 //User land on your cart page
 await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
})

//checkout should be blocked with an empty cart
test.fixme('checkout should be blocked with an empty cart', async({page})=>
{
   await page.locator('[data-test="shopping-cart-link"]').click()
   await page.locator('[data-test="checkout"]').click()
   // Expected: app stays on cart page and blocks checkout
   await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')
})