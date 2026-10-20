import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>
{
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
   
});

//Validating with valid credentials
test('Testing with valid username and password', async({page}) =>
{
await page.getByPlaceholder('Username').fill('Admin');
await page.getByPlaceholder('Password').fill('admin123');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page).toHaveURL(/dashboard/); //user lands on dashborad page
});


//Validating with invalid credentials(invalid username)
test('Testing with invalid credentials(invalid username)', async({page}) =>
{

await page.getByPlaceholder('Username').fill('Jo');
await page.getByPlaceholder('Password').fill('admin123');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByText('Invalid credentials')).toBeVisible();
await expect(page).toHaveURL(/auth\/login/); // user is still on login page
});

//Validating with invalid credentials(invalid password)
test('Testing with invalid credentials(invalid password)', async({page}) =>
{

await page.getByPlaceholder('Username').fill('Admin');
await page.getByPlaceholder('Password').fill('admi993');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByText('Invalid credentials')).toBeVisible();
await expect(page).toHaveURL(/auth\/login/); // user is still on login page

});

//Validating with invalid credentials
test('Testing with invalid credentials', async({page}) =>
{

await page.getByPlaceholder('Username').fill('Ain');
await page.getByPlaceholder('Password').fill('admi993');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByText('Invalid credentials')).toBeVisible();
await expect(page).toHaveURL(/auth\/login/); // user is still on login page

});


//Validating without entering credentials
test('Login is blocked when no credentials are entered', async({page}) =>
{
   await page.getByRole('button', { name: 'Login' }).click();
   await expect(page.getByText('Required')).toHaveCount(2);
   await expect(page).toHaveURL(/auth\/login/); // user is still on login page

});


//validating user logouts 
test('User can log out', async({page}) =>
{
await page.getByPlaceholder('Username').fill('Admin');
await page.getByPlaceholder('Password').fill('admin123');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page).toHaveURL(/dashboard/); //user lands on dashborad page

// click the profile dropdown, then Logout 
await page.locator('.oxd-userdropdown-tab').click();
await page.getByRole('menuitem', { name :'Logout'}).click();
await expect(page).toHaveURL(/auth\/login/); // user lands on login page

});