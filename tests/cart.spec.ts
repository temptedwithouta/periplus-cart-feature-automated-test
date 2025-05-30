import { test, expect, Locator } from "@playwright/test";

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

const URL: string = "https://www.periplus.com/";

const EMAIL: string = "danielsulistio1208@gmail.com";

const PASSWORD: string = "daniel1205";

test.describe("Periplus Shopping Cart Functionality", () => {
  test("should add a product to the cart and verify its presence", async ({ page }) => {
    // 1. Opens Google Chrome in a new window and Navigates to https://www.periplus.com/
    await page.goto(URL);

    // Wait for the page to load completely
    await page.waitForLoadState("domcontentloaded");

    // Verify that the page has loaded by checking the title
    await expect(page).toHaveTitle(/Periplus/);

    // 2. Enters a login and password
    // Click on the login/profile icon
    await page.getByRole("link", { name: "Sign In" }).click();

    // Wait for the login page to load
    await page.waitForURL("https://www.periplus.com/account/Login");

    // Enter email and password// Enter email and password
    await page.fill("input[name='email']", EMAIL);

    await page.fill("input[name='password']", PASSWORD);

    // Click login button
    await page.click("input[type='submit'][id='button-login']");

    // Wait for the login to complete
    await page.waitForURL("https://www.periplus.com/account/Your-Account");

    // 3. Searches for a product
    await page.fill("input[id='filter_name'][type='input'][placeholder='Search by title / author / ISBN here...']", "Harry Potter and the Philosopher's Stone");

    await page.keyboard.press("Enter");

    // Wait for the search results to load
    await page.waitForURL("https://www.periplus.com/product/Search?filter_category_id=0&filter_name=Harry+Potter+and+the+Philosopher%27s+Stone");

    // 4. Clicks on the product from the search results
    const searhData: Locator = page.locator("div.row.row-category-grid > .col-xl-3.col-lg-4.col-md-6.col-6");

    await searhData.first().locator(".single-product > .product-img > a").click();

    // Wait for the product page to load
    await page.waitForURL(/https:\/\/www\.periplus\.com\/p\/\d+/);

    const productTitle: string = await page.locator("div.col-lg-5.col-md-5.col-12.quickview-content > h2").innerText();

    // 5. Clicks on the "Add to Cart" button
    await page.click("button.btn.btn-add-to-cart");

    // Wait for the success modal to appear
    await page.locator("div#Notification-Modal > div.modal-dialog.modal-dialog-centered > div.modal-content > div.modal-body > div.modal-text").waitFor({
      state: "visible",
    });

    // Verify that the success message is visible
    await expect(page.locator("div#Notification-Modal > div.modal-dialog.modal-dialog-centered > div.modal-content > div.modal-body > div.modal-text")).toBeVisible();

    // click the close button on the success modal
    await page.locator("div#Notification-Modal > div.modal-dialog.modal-dialog-centered > div.modal-content > div.modal-body").first().locator("button.btn").click();

    // 6. Clicks on the cart icon
    await page.locator("div#show-your-cart > a.single-icon").click();

    // Wait for the cart page to load
    await page.waitForURL("https://www.periplus.com/checkout/cart");

    // 7. Verifies that the product is present in the cart

    const cartProducts: Locator = page.locator("div.shopping-summery > div.row.row-cart-product");

    // Verify that the cart contains at least one product
    expect(await cartProducts.count()).toBe(1);

    // Verify that the product in the cart matches the product added
    const productCartDetail: Locator = cartProducts.first().locator("div.col-lg-10.col-9");

    expect(await productCartDetail.locator("p.product-name > a").innerText()).toBe(productTitle);

    expect(await productCartDetail.locator("div.row.qty > div.input-group > input[type='text']").inputValue()).toBe("1");
  });
});
