import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>
{
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
   //user lands on dashboard page
    await expect(page).toHaveURL(/dashboard/);
    
    //Click on PIM from Menu Bar
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect(page).toHaveURL(/pim/);

    await page.getByRole('button', { name:'Add'}).click();

    //Validating user lands on Add Employee page
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee');
});

// End-to-end test: creates an employee, finds them, edits them, then deletes them.
// Kept as ONE test so the generated name stays in scope for every step,
// and so the test cleans up after itself instead of leaving records behind.
test('full employee lifecycle', async ({ page }) => {

// 60 seconds instead of the default 30
   test.setTimeout(60000);  

// created once, at the top 
 const lastName = 'Derek' + Date.now().toString().slice(-5);   // e.g. Derek21847      
// Creating employee details
   await page.getByPlaceholder('First Name').fill('Nyla');
   await page.getByPlaceholder('Last Name').fill(lastName);
   await page.getByRole('button', { name: 'Save' }).click();
   await expect(page.getByText('Successfully Saved')).toBeVisible();

// After saving, the app redirects to that employee's personal details page.
// \d+ matches any employee number, because the server generates a new one each time.
   await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/);

//Click on PIM to land on the the employee edit page
  await page.getByRole('link', { name: 'PIM' }).click();

  // Two fields share the placeholder "Type for hints..." (Employee Name and Supervisor Name),
// so scope to the input group labelled "Employee Name" to target the right one.
  await page.locator('.oxd-input-group',{hasText:'Employee Name'}).getByPlaceholder('Type for hints...').fill(lastName);
  await page.getByRole('button', {name:'Search'}).click();

  // Confirms the record we created is actually findable in the system
   await expect(page.getByText(lastName)).toBeVisible();


 // ---------- EDIT ----------
// Every row has its own pencil icon, so first narrow to the row containing OUR employee,
// then click the pencil inside that row.
  await page.getByRole('row').filter({ hasText: lastName }).locator('.oxd-icon.bi-pencil-fill').click();

// Wait for the form to load the existing data before changing it.
// Without this, fill() can run against an empty field that the page
// then overwrites with the loaded value.
   await expect(page.getByPlaceholder('First Name')).toHaveValue('Nyla');

  //Updating the First Name
  await page.getByPlaceholder('First Name').fill('Neela');

   // The page has two forms, each with a Save button (Personal Details and
   // Custom Fields), so scope to the one containing the name fields.
   await page.locator('form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: 'Save' }).click()
   await expect(page.getByText('Successfully Updated')).toBeVisible();


//Click on PIM to land on the the employee edit page
   await page.getByRole('link', { name: 'PIM' }).click();

   //Checking whether the detail(s) are updated
   await page.locator('.oxd-input-group',{hasText:'Employee Name'}).getByPlaceholder('Type for hints...').fill(lastName);
   await page.getByRole('button', {name:'Search'}).click();

//Checking whether the First Name is updated
   await expect(page.getByRole('row').filter({ hasText: lastName })).toContainText('Neela');

//Deleting the employee

  await page.getByRole('row').filter({ hasText: lastName }).locator('.oxd-icon.bi-trash').click();

  await page.getByRole('button', {name:' Yes, Delete '}).click();

  await expect(page.getByText('Successfully Deleted')).toBeVisible();   // confirms the delete worked

  // Searching again should now find nothing — proves the record is really gone
  await page.locator('.oxd-input-group',{hasText:'Employee Name'}).getByPlaceholder('Type for hints...').fill(lastName);
  await page.getByRole('button', {name:'Search'}).click();
  //await expect(page.getByText('No Records Found')).toBeVisible();
});
