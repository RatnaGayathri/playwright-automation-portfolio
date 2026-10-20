//Finish last two test cases


import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>
{
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce');
   await page.locator('[data-test="login-button"]').click();
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
   
});

//Validating user add and remove the product from cart (Expected behaviour:product is added to cart and can remove the product)
test('user can add and remove a product', async({page}) =>
{
   await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
   // await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(1) 
   await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove')
   await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
   await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toContainText('Add to cart')
    
});
// Verify default sorting option A-Z
test('inventory page loads with default A-Z sorting', async ({ page }) => 
   {

  await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Sauce Labs Backpack');

});

//Validating sorting options--sort by name Z-A'
test('sort by name Z-A', async ({ page }) => 
{
  await page.locator('[data-test="product-sort-container"]').selectOption({label:'Name (Z to A)'});
await expect( page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
})

//Validating sorting options--sort by price low to high
test('sort by price low to high', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption({label:'Price (low to high)'});
 await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Sauce Labs Onesie')
await expect( page.locator('[data-test="inventory-item-price"]').first()).toHaveText('$7.99');
})

//Validating sorting options--sort by price high to low
test('sort by price high to low', async ({ page }) => {
   await page.locator('[data-test="product-sort-container"]').selectOption({label:'Price (high to low)'});
 await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Sauce Labs Fleece Jacket')
await expect( page.locator('[data-test="inventory-item-price"]').first()).toHaveText('$49.99');
});


//Validating product details page
test('Verify product details',async({page}) =>
{

   await page.locator('[data-test="item-4-title-link"]').click();
   await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack')
   await expect(page.locator('[data-test="inventory-item-desc"]'))
   .toContainText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.')
  await page.locator('[data-test="back-to-products"]').click()
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
})

//Validating user is able to add product from product details page
test('Validating user is able to add product from product details page',async({page}) =>
{

   await page.locator('[data-test="item-4-title-link"]').click();
   await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack')
   await page.locator('[data-test="add-to-cart"]').click();
   await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(1) 
   await expect(page.locator('[data-test="remove"]')).toContainText('Remove')
   await page.locator('[data-test="back-to-products"]').click()
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

//Validating cart badge number increases with product count
test('Validating cart badge number increases when product is added to the cart', async ({page}) =>
{
   await page.locator('[data-test="item-4-title-link"]').click();
   await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack')
   await page.locator('[data-test="add-to-cart"]').click();
   await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')   
})
//Validating cart badge number decrese when product is removed
test('Validating cart badge number decrease when product is removed', async ({page}) =>
{
   await page.locator('[data-test="item-4-title-link"]').click();
   await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack')
   await page.locator('[data-test="add-to-cart"]').click();
 await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')  
    await page.locator('[data-test="remove"]').click();
   await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0)
})

//Validating back to products
test('Validating user can navigate to inventory page by clicking on back to products', async ({page}) =>
{
   await page.locator('[data-test="item-4-title-link"]').click();
   await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
   await page.locator('[data-test="back-to-products"]').click();
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
})