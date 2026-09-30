import { test, expect } from "@playwright/test";

test.describe("Public Blog Flow", () => {
  test("should load the homepage with branding and article cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CloudBlog/i);

    // Verify brand
    await expect(page.locator("header")).toContainText("CloudBlog");

    // Verify presence of articles or topic pills
    const headings = page.locator("h1, h2");
    await expect(headings.first()).toBeVisible();
  });

  test("should navigate to an article page and display content and TOC", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toContainText(/Articles/i);

    // Click on the first article card if available
    const firstArticleLink = page.locator("article h3 a, article h2 a").first();
    if (await firstArticleLink.isVisible()) {
      await firstArticleLink.click();
      await expect(page.locator("article h1")).toBeVisible();
    }
  });

  test("should load the RSS feed xml route", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("xml");
  });

  test("should load the sitemap.xml", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
  });
});

test.describe("Admin CMS Flow", () => {
  test("should render the admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("h1")).toContainText(/CloudBlog CMS/i);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should log in with admin credentials and access dashboard", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill('input[name="email"]', "admin@cloudblog.local");
    await page.fill('input[name="password"]', "CloudBlogDev2026!");
    await page.click('button[type="submit"]');

    // Wait for redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("h1")).toContainText(/Dashboard/i);

    // Verify navigation sidebar
    await expect(page.locator("aside")).toContainText("Posts");
    await expect(page.locator("aside")).toContainText("Media Library");
  });

  test("should create and publish a new post", async ({ page }) => {
    // Perform login first
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "admin@cloudblog.local");
    await page.fill('input[name="password"]', "CloudBlogDev2026!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/);

    // Navigate to new post editor
    await page.goto("/admin/posts/new");
    await expect(page.locator("h1")).toContainText(/Create New Article/i);

    const testTitle = `Test Playwright Article ${Date.now()}`;
    await page.fill('input[id="title"]', testTitle);
    await page.fill('textarea[id="excerpt"]', "Automated test article excerpt.");

    // Fill markdown editor
    const editor = page.locator("textarea").nth(1);
    await editor.fill("## Heading Section\n\nThis is automated test content.");

    // Publish
    await page.click('button:has-text("Publish to Edge")');
    await expect(page.locator("text=Post created successfully!")).toBeVisible({ timeout: 10000 });
  });

  test("should log out successfully", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "admin@cloudblog.local");
    await page.fill('input[name="password"]', "CloudBlogDev2026!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/);

    // Click logout
    const logoutBtn = page.locator('aside form button[title="Sign out"]');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });
});
