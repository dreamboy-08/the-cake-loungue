# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-product.spec.ts >> Admin Product Management & Sync >> CRUD Flow: Create, Read, Update, Delete
- Location: tests/admin-product.spec.ts:43:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Add New Product")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Cake Lounge" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e6]:
        - generic [ref=e7]:
          - button "Toggle search" [ref=e8]:
            - img [ref=e9]
          - link "Login" [ref=e12] [cursor=pointer]:
            - /url: /login
          - link "Order Now" [ref=e13] [cursor=pointer]:
            - /url: /checkout
          - button "View Cart" [ref=e14]:
            - img [ref=e16]
        - button "Open menu" [ref=e20]
  - generic [ref=e21]:
    - button [ref=e22]:
      - img [ref=e23]
    - generic [ref=e26]:
      - link "Home" [ref=e27] [cursor=pointer]:
        - /url: /
      - generic [ref=e28]:
        - paragraph [ref=e29]: Categories
        - generic [ref=e31]:
          - text: Cakes
          - img [ref=e32]
        - generic [ref=e35]:
          - text: Bento
          - img [ref=e36]
        - generic [ref=e39]:
          - text: Theme Cakes
          - img [ref=e40]
        - generic [ref=e43]:
          - text: By Relationship
          - img [ref=e44]
        - generic [ref=e47]:
          - text: Desserts
          - img [ref=e48]
        - generic [ref=e51]:
          - text: Birthday
          - img [ref=e52]
        - generic [ref=e55]:
          - text: Anniversary
          - img [ref=e56]
      - generic [ref=e58]:
        - link "Login / Sign Up" [ref=e59] [cursor=pointer]:
          - /url: /login
        - link "Full Menu" [ref=e60] [cursor=pointer]:
          - /url: /menu
        - link "About Us" [ref=e61] [cursor=pointer]:
          - /url: /#about
        - link "Contact" [ref=e62] [cursor=pointer]:
          - /url: /#contact
  - main
  - contentinfo [ref=e63]:
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - generic [ref=e67]: Cake Lounge
          - paragraph [ref=e68]: Crafting moments of sweetness since 2015. Every cake tells a story — let us tell yours.
          - generic [ref=e69]:
            - link [ref=e70] [cursor=pointer]:
              - /url: "#"
              - img [ref=e71]
            - link [ref=e74] [cursor=pointer]:
              - /url: "#"
              - img [ref=e75]
            - link [ref=e77] [cursor=pointer]:
              - /url: "#"
              - img [ref=e78]
            - link [ref=e80] [cursor=pointer]:
              - /url: "#"
              - img [ref=e81]
        - generic [ref=e83]:
          - heading "Quick Links" [level=4] [ref=e84]
          - generic [ref=e85]:
            - link "Home" [ref=e86] [cursor=pointer]:
              - /url: /
            - link "Our Menu" [ref=e87] [cursor=pointer]:
              - /url: /menu
            - link "Custom Cake" [ref=e88] [cursor=pointer]:
              - /url: /custom-cake
            - link "Our Story" [ref=e89] [cursor=pointer]:
              - /url: /#about
            - link "Contact" [ref=e90] [cursor=pointer]:
              - /url: /#contact
        - generic [ref=e91]:
          - heading "Cake Types" [level=4] [ref=e92]
          - generic [ref=e93]:
            - link "Birthday Cakes" [ref=e94] [cursor=pointer]:
              - /url: /menu#birthday
            - link "Wedding Cakes" [ref=e95] [cursor=pointer]:
              - /url: /menu#wedding
            - link "Anniversary" [ref=e96] [cursor=pointer]:
              - /url: /menu#anniversary
            - link "Photo Cakes" [ref=e97] [cursor=pointer]:
              - /url: /menu#photo-cakes
            - link "Eggless Cakes" [ref=e98] [cursor=pointer]:
              - /url: /menu#eggless
        - generic [ref=e99]:
          - heading "Policies" [level=4] [ref=e100]
          - generic [ref=e101]:
            - link "Privacy Policy" [ref=e102] [cursor=pointer]:
              - /url: /policies/privacy-policy
            - link "Terms & Conditions" [ref=e103] [cursor=pointer]:
              - /url: /policies/terms-and-conditions
            - link "Cancellation & Refund" [ref=e104] [cursor=pointer]:
              - /url: /policies/cancellation-refund
            - link "Shipping & Delivery" [ref=e105] [cursor=pointer]:
              - /url: /policies/shipping-delivery
        - generic [ref=e106]:
          - heading "Support" [level=4] [ref=e107]
          - generic [ref=e108]:
            - link "Help Center" [ref=e109] [cursor=pointer]:
              - /url: /#contact
            - link "Track Order" [ref=e110] [cursor=pointer]:
              - /url: /orders
            - link "Policy Index" [ref=e111] [cursor=pointer]:
              - /url: /policies
      - generic [ref=e112]:
        - text: © 2025 Cake Lounge Patisserie. All rights reserved.
        - generic [ref=e113]: Made with ❤️ in India
  - link "Chat on WhatsApp" [ref=e114] [cursor=pointer]:
    - /url: https://wa.me/917703870170
    - img [ref=e115]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   |
  3   | /**
  4   |  * Admin Product CRUD & Sync Verification
  5   |  *
  6   |  * Note: These tests use mocked Firestore and Storage responses to verify the application's
  7   |  * internal logic, routing, and UI synchronization without requiring live Firebase credentials.
  8   |  */
  9   |
  10  | test.describe('Admin Product Management & Sync', () => {
  11  |
  12  |   test.beforeEach(async ({ page }) => {
  13  |     // Mock Firestore for Categories (needed for the form)
  14  |     await page.route('**/firestore.googleapis.com/**/categories*', async route => {
  15  |       await route.fulfill({
  16  |         status: 200,
  17  |         contentType: 'application/json',
  18  |         body: JSON.stringify({
  19  |           documents: [
  20  |             { name: 'projects/p/databases/d/documents/categories/1', fields: { name: { stringValue: 'Birthday Cakes' } } }
  21  |           ]
  22  |         })
  23  |       });
  24  |     });
  25  |
  26  |     // Mock initial empty products list
  27  |     await page.route('**/firestore.googleapis.com/**/products*', async route => {
  28  |       if (route.request().method() === 'GET') {
  29  |         await route.fulfill({
  30  |           status: 200,
  31  |           contentType: 'application/json',
  32  |           body: JSON.stringify({ documents: [] })
  33  |         });
  34  |       } else {
  35  |         await route.continue();
  36  |       }
  37  |     });
  38  |
  39  |     // Navigate to Admin Products
  40  |     await page.goto('http://localhost:3000/admin/products?bypass=true');
  41  |   });
  42  |
  43  |   test('CRUD Flow: Create, Read, Update, Delete', async ({ page }) => {
  44  |     // 1. CREATE
> 45  |     await page.click('button:has-text("Add New Product")');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  46  |     await page.fill('input[placeholder="e.g. Royal Raspberry Birthday Cake"]', 'Verification Cake');
  47  |     await page.fill('input[placeholder="499"]', '499');
  48  |     await page.selectOption('select', 'Birthday Cakes');
  49  |     await page.fill('input[placeholder="https://images.unsplash.com/..."]', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587');
  50  |
  51  |     // Mock successful creation
  52  |     await page.route('**/firestore.googleapis.com/**/products', async route => {
  53  |       if (route.request().method() === 'POST') {
  54  |         await route.fulfill({
  55  |           status: 200,
  56  |           contentType: 'application/json',
  57  |           body: JSON.stringify({ name: 'projects/p/databases/d/documents/products/new-id-123' })
  58  |         });
  59  |       }
  60  |     });
  61  |
  62  |     // Mock the subsequent list fetch with the new product
  63  |     await page.route('**/firestore.googleapis.com/**/products*', async route => {
  64  |       if (route.request().method() === 'GET') {
  65  |         await route.fulfill({
  66  |           status: 200,
  67  |           contentType: 'application/json',
  68  |           body: JSON.stringify({
  69  |             documents: [{
  70  |               name: 'projects/p/databases/d/documents/products/new-id-123',
  71  |               fields: {
  72  |                 name: { stringValue: 'Verification Cake' },
  73  |                 price: { integerValue: '499' },
  74  |                 category: { stringValue: 'Birthday Cakes' },
  75  |                 img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
  76  |                 flavor: { stringValue: 'Vanilla' }
  77  |               },
  78  |               createTime: new Date().toISOString(),
  79  |               updateTime: new Date().toISOString()
  80  |             }]
  81  |           })
  82  |         });
  83  |       }
  84  |     });
  85  |
  86  |     await page.click('button:has-text("Create Product")');
  87  |
  88  |     // Verify visibility in list
  89  |     await expect(page.locator('text=Verification Cake')).toBeVisible();
  90  |     await expect(page.locator('text=₹499')).toBeVisible();
  91  |
  92  |     // 2. UPDATE
  93  |     await page.click('button[title="Edit Product"]');
  94  |     await page.fill('input[value="Verification Cake"]', 'Updated Verification Cake');
  95  |     await page.fill('input[value="499"]', '1299');
  96  |
  97  |     // Mock successful update
  98  |     await page.route('**/firestore.googleapis.com/**/products/new-id-123', async route => {
  99  |       if (route.request().method() === 'PATCH') {
  100 |         await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  101 |       }
  102 |     });
  103 |
  104 |     // Mock list with updated data
  105 |     await page.route('**/firestore.googleapis.com/**/products*', async route => {
  106 |       if (route.request().method() === 'GET') {
  107 |         await route.fulfill({
  108 |           status: 200,
  109 |           contentType: 'application/json',
  110 |           body: JSON.stringify({
  111 |             documents: [{
  112 |               name: 'projects/p/databases/d/documents/products/new-id-123',
  113 |               fields: {
  114 |                 name: { stringValue: 'Updated Verification Cake' },
  115 |                 price: { integerValue: '1299' },
  116 |                 category: { stringValue: 'Birthday Cakes' },
  117 |                 img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
  118 |               }
  119 |             }]
  120 |           })
  121 |         });
  122 |       }
  123 |     });
  124 |
  125 |     await page.click('button:has-text("Save Changes")');
  126 |     await expect(page.locator('text=Updated Verification Cake')).toBeVisible();
  127 |     await expect(page.locator('text=₹1299')).toBeVisible();
  128 |
  129 |     // 3. DELETE
  130 |     await page.click('button[title="Delete Product"]');
  131 |     await page.click('button:has-text("Delete")');
  132 |
  133 |     // Mock successful deletion and empty list
  134 |     await page.route('**/firestore.googleapis.com/**/products/new-id-123', async route => {
  135 |       if (route.request().method() === 'DELETE') {
  136 |         await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  137 |       }
  138 |     });
  139 |
  140 |     await page.route('**/firestore.googleapis.com/**/products*', async route => {
  141 |       if (route.request().method() === 'GET') {
  142 |         await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ documents: [] }) });
  143 |       }
  144 |     });
  145 |
```