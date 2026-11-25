import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") return route.continue();
    if (url.hostname === "gist.githubusercontent.com" && url.pathname.endsWith("/to-do-items.json")) {
      return route.fulfill({ json: [{ _id: "fixture", title: "Existing synthetic todo" }] });
    }
    return route.abort();
  });
});

test("the production build opens a deep link and supports adding a todo", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/new-item");
  await expect(page.getByRole("heading", { name: "TodoList" })).toBeVisible();
  const input = page.getByPlaceholder("Enter an item");
  await expect(input).toBeVisible();
  await input.fill("  A synthetic todo  ");
  await page.locator('button[type="submit"]').click();
  await expect(input).toHaveValue("");
  await page.locator('a[href="/"]').click();
  await expect(page.getByText("Existing synthetic todo", { exact: true })).toBeVisible();
  await expect(page.getByText("A synthetic todo", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("the bundled Auth0 SDK sends login to the existing callback without contacting Auth0", async ({ page }) => {
  await page.route("https://altsun.auth0.com/authorize?*", route =>
    route.fulfill({ status: 200, body: "Intercepted Auth0 authorize page" })
  );
  await page.goto("/");
  await page.getByRole("button", { name: /log.?in|sign.?in/i }).click();
  await expect(page.getByText("Intercepted Auth0 authorize page")).toBeVisible();
  const url = new URL(page.url());
  expect(url.pathname).toBe("/authorize");
  expect(url.searchParams.get("redirect_uri")).toBe("http://localhost:3000/callback");
  expect(url.searchParams.get("response_type")).toBe("id_token");
});
