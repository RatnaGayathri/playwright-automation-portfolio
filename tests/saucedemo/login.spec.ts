import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>
{
    await page.goto('https://www.saucedemo.com/');
   
});
    
//Validating user logins with valid credentials (Expected behaviour:User is directed to Inventory Page)
test ('login with valid credentials', async({page}) =>
{

    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce');
   await page.locator('[data-test="login-button"]').click();
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
});

//Validating login with invalid username (Expected behaviour:Error message is displayed)
test ('login with invalid Username and valid Password', async({page}) =>
{
  await page.locator('[data-test="username"]').fill('standa_ser')
   await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
   await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and password do not match any user in this service")
});

//Validating login with invalid password (Expected behaviour:Error message is displayed)
test ('login with valid Username and invalid Password', async({page}) =>
{

    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_uce');
   await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and password do not match any user in this service")
});


//Validating user logsout succesfully (Expected behaviour:User is redirected to login page)
test('user can log out successfully',async ({page}) =>
    {
  await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce');
   await page.locator('[data-test="login-button"]').click();
  // Open menu
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
     await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
 });

 //Validating the user who is locked out(Expected behaviour:Epic sadface: Sorry, this user has been locked out.)
 test('error message for locked out user',async ({page})=>

{
  await page.locator('[data-test="username"]').fill('locked_out_user')
   await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Sorry, this user has been locked out.");

})