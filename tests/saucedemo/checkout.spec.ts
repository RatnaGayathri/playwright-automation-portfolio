import {test,expect} from '@playwright/test';
    test.beforeEach(async({page})=>
    {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test ="add-to-cart-sauce-labs-bike-light"]').click()
    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')


    });

//Validating checkout 
test('verify user is able to checkout',async ({page})=>
 {
    await page.locator('[data-test="firstName"]').fill('Joe')

   await page.locator('[data-test="lastName"]').fill('ken')

   await page.locator('[data-test="postalCode"]').fill('2345')

    await page.locator('[data-test="continue"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html')

    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    await page.locator('[data-test="cancel"]').click()

      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

})

//Validating cancel button
test('Verify user lands on inventory page after clicking cancel', async({page}) =>
 {
    await page.locator('[data-test="firstName"]').fill('Joe')

   await page.locator('[data-test="lastName"]').fill('ken')

   await page.locator('[data-test="postalCode"]').fill('2345')

    await page.locator('[data-test="continue"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html')
    
    await page.locator('[data-test="cancel"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
})

//Validating error message without entering user First Name
  test('Verify error message is displayed without entering user first Name',async({page}) =>
  {

    await page.locator('[data-test="continue"]').click()
    
  await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required')

  })



//Validating error message without entering user Last Name
test('Verify error message is displayed without entering user Last Name',async({page}) =>
{
  await page.locator('[data-test="firstName"]').fill('Joe')

    await page.locator('[data-test="continue"]').click()
  
 await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required')

})


//Validating error message without entering user Postal code
test('Verify error message is displayed without entering user Postal code',async({page}) =>
{
    await page.locator('[data-test="firstName"]').fill('Joe')

   await page.locator('[data-test="lastName"]').fill('ken')

    await page.locator('[data-test="continue"]').click()
  
await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required')

})



//Validating error message disappears after clicking 'x'
test('error message disappears after clicking x', async ({page}) =>
{
   // trigger the error
   await page.locator('[data-test="continue"]').click()
   await expect(page.locator('[data-test="error"]')).toBeVisible()   // error is shown

   // dismiss it
   await page.locator('[data-test="error-button"]').click()
   await expect(page.locator('[data-test="error"]')).toBeHidden()    // error is gone
})