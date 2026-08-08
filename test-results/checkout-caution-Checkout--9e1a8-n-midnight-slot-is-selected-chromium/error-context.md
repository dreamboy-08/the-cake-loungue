# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout-caution.spec.ts >> Checkout Midnight Delivery Caution >> should show midnight delivery caution only when midnight slot is selected
- Location: tests/checkout-caution.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select')
    - locator resolved to <select required="" class="w-full px-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-bold text-chocolate appearance-none disabled:opacity-50 disabled:cursor-not-allowed">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - option being selected is not enabled
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - option being selected is not enabled
    - retrying select option action
      - waiting 100ms
    47 × waiting for element to be visible and enabled
       - option being selected is not enabled
     - retrying select option action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "The Cake Lounge" [ref=e6] [cursor=pointer]:
        - /url: /
        - text: The Cake
        - generic [ref=e7]: Lounge
      - generic [ref=e9]:
        - button "Toggle search" [ref=e10] [cursor=pointer]:
          - img [ref=e11]
        - link "View Favourites" [ref=e14] [cursor=pointer]:
          - /url: /wishlist
          - img [ref=e15]
        - button "View Cart" [ref=e17] [cursor=pointer]:
          - img [ref=e19]
          - generic [ref=e23]: "1"
        - link "Sign In" [ref=e24] [cursor=pointer]:
          - /url: /login
        - link "Order Now" [ref=e25] [cursor=pointer]:
          - /url: /checkout
  - main [ref=e26]:
    - generic [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]:
          - generic [ref=e32]:
            - button "Go back to previous page" [ref=e33] [cursor=pointer]:
              - img [ref=e34]
              - generic [ref=e36]: Back
            - link "Go to homepage" [ref=e38] [cursor=pointer]:
              - /url: /
              - img [ref=e39]
          - heading "Secure Checkout" [level=1] [ref=e42]
        - generic [ref=e44]:
          - heading "Delivery Addresses" [level=3] [ref=e46]:
            - img [ref=e47]
            - text: Delivery Addresses
          - generic [ref=e50]:
            - heading "Delivery Address" [level=4] [ref=e52]
            - generic [ref=e53]:
              - generic [ref=e54]:
                - textbox "Full Name" [ref=e55]
                - textbox "Phone Number" [ref=e56]
              - generic [ref=e57]:
                - textbox "House / Flat / Office No." [ref=e58]
                - textbox "Street / Road Name" [ref=e59]
              - generic [ref=e60]:
                - textbox "Landmark (Optional)" [ref=e61]
                - textbox "Area / Sector / Locality" [ref=e62]
              - generic [ref=e63]:
                - textbox "City" [ref=e64]
                - textbox "State" [ref=e65]
                - textbox "Zip Code" [ref=e66]
              - generic [ref=e67] [cursor=pointer]:
                - checkbox "Set as default address" [ref=e68]
                - generic [ref=e69]: Set as default address
              - button "Apply Address" [ref=e70] [cursor=pointer]
        - generic [ref=e71]:
          - generic [ref=e72]:
            - heading "Delivery Date & Time" [level=3] [ref=e73]
            - generic [ref=e74]:
              - generic [ref=e75]:
                - generic:
                  - img
                - button "9 Aug 2026" [ref=e76] [cursor=pointer]
              - generic [ref=e77]:
                - combobox [ref=e78]:
                  - option "Select Time Slot" [selected]
                  - option "10:00 AM – 12:00 PM (Unavailable)" [disabled]
                  - option "12:00 PM – 02:00 PM"
                  - option "02:00 PM – 04:00 PM"
                  - option "04:00 PM – 06:00 PM"
                  - option "06:00 PM – 08:00 PM"
                  - option "08:00 PM – 10:00 PM"
                  - option "10:00 PM – 12:00 AM (Midnight Delivery)"
                - generic:
                  - img
            - paragraph [ref=e79]:
              - img [ref=e80]
              - text: Standard Cakes can be delivered as early as tomorrow.
            - generic [ref=e83]:
              - img [ref=e84]
              - generic [ref=e87]:
                - heading "Dynamic Preparation Time Rule" [level=4] [ref=e88]
                - paragraph [ref=e89]: "Preparation Time: This product requires a minimum of 16 hours to prepare. The earliest available delivery slot will be automatically calculated based on your order time."
          - generic [ref=e90]:
            - generic [ref=e91]:
              - img [ref=e93]
              - generic [ref=e95]:
                - heading "🚨 Need Same-Day Delivery?" [level=4] [ref=e96]
                - paragraph [ref=e97]: Same-day delivery is not available through online checkout.
                - paragraph [ref=e98]: Please contact us on WhatsApp. Our team will check availability and assist you manually.
            - link "Contact WhatsApp" [ref=e100] [cursor=pointer]:
              - /url: https://wa.me/917703870170?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Same-Day%20Delivery.
              - img [ref=e101]
              - text: Contact WhatsApp
          - generic [ref=e103]:
            - heading "Delivery Instructions (Optional)" [level=3] [ref=e104]
            - textbox "e.g. Please leave at the gate, call upon arrival, etc." [ref=e105]
        - generic [ref=e106]:
          - heading "Payment Method" [level=3] [ref=e107]:
            - img [ref=e108]
            - text: Payment Method
          - generic [ref=e110]:
            - img [ref=e112]
            - generic [ref=e115]:
              - paragraph [ref=e116]: Secure Online Payment
              - paragraph [ref=e117]: UPI, Cards, NetBanking via Razorpay
            - img [ref=e119]
      - generic [ref=e123]:
        - heading "Order Summary" [level=3] [ref=e124]:
          - img [ref=e125]
          - text: Order Summary
        - generic [ref=e129]:
          - img "Royal Raspberry Birthday Cake" [ref=e131] [cursor=pointer]
          - generic [ref=e132] [cursor=pointer]:
            - heading "Royal Raspberry Birthday Cake" [level=4] [ref=e133]
            - generic [ref=e135]: "Weight: 0.5 Kg"
            - paragraph [ref=e136]: "Quantity: 1"
            - paragraph [ref=e137]: ₹499
        - generic [ref=e138]:
          - generic [ref=e139]:
            - generic [ref=e140]:
              - img [ref=e141]
              - text: Delivery Date
            - generic [ref=e143]: Aug 9, 2026
          - generic [ref=e144]:
            - generic [ref=e145]: Subtotal
            - generic [ref=e146]: ₹499
          - generic [ref=e147]:
            - generic [ref=e148]: Delivery Fee
            - generic [ref=e149]: FREE
          - paragraph [ref=e151]: 🎉 Congratulations! You unlocked FREE Delivery.
          - generic [ref=e152]:
            - generic [ref=e153]: Total Amount
            - generic [ref=e154]:
              - generic [ref=e155]: ₹499
              - paragraph [ref=e156]: Inclusive of all taxes
        - button "Pay Now" [disabled] [ref=e157]:
          - img [ref=e158]
          - text: Pay Now
        - paragraph [ref=e161]: "* Please select a delivery address to proceed"
        - generic [ref=e162]:
          - img "PayPal" [ref=e164]
          - img "Mastercard" [ref=e166]
          - img "Visa" [ref=e168]
        - paragraph [ref=e169]: 100% Secure SSL Encrypted Checkout
  - contentinfo [ref=e170]:
    - generic [ref=e171]:
      - generic [ref=e172]:
        - generic [ref=e173]:
          - generic [ref=e174]: The Cake Lounge
          - paragraph [ref=e175]: Crafting moments of sweetness since 2015. Every cake tells a story — let us tell yours.
          - generic [ref=e176]:
            - link [ref=e177] [cursor=pointer]:
              - /url: "#"
              - img [ref=e178]
            - link [ref=e181] [cursor=pointer]:
              - /url: "#"
              - img [ref=e182]
            - link [ref=e184] [cursor=pointer]:
              - /url: "#"
              - img [ref=e185]
            - link [ref=e187] [cursor=pointer]:
              - /url: "#"
              - img [ref=e188]
        - generic [ref=e190]:
          - heading "Quick Links" [level=4] [ref=e191]
          - generic [ref=e192]:
            - link "Home" [ref=e193] [cursor=pointer]:
              - /url: /
            - link "Our Menu" [ref=e194] [cursor=pointer]:
              - /url: /menu
            - link "Custom Cake" [ref=e195] [cursor=pointer]:
              - /url: /custom-cake
            - link "Our Story" [ref=e196] [cursor=pointer]:
              - /url: /#about
            - link "Contact" [ref=e197] [cursor=pointer]:
              - /url: /#contact
        - generic [ref=e198]:
          - heading "Cake Types" [level=4] [ref=e199]
          - generic [ref=e200]:
            - link "Birthday Cakes" [ref=e201] [cursor=pointer]:
              - /url: /menu#birthday
            - link "Wedding Cakes" [ref=e202] [cursor=pointer]:
              - /url: /menu#wedding
            - link "Anniversary" [ref=e203] [cursor=pointer]:
              - /url: /menu#anniversary
            - link "Photo Cakes" [ref=e204] [cursor=pointer]:
              - /url: /menu#photo-cakes
            - link "Eggless Cakes" [ref=e205] [cursor=pointer]:
              - /url: /menu#eggless
        - generic [ref=e206]:
          - heading "Policies" [level=4] [ref=e207]
          - generic [ref=e208]:
            - link "Privacy Policy" [ref=e209] [cursor=pointer]:
              - /url: /policies/privacy-policy
            - link "Terms & Conditions" [ref=e210] [cursor=pointer]:
              - /url: /policies/terms-and-conditions
            - link "Cancellation & Refund" [ref=e211] [cursor=pointer]:
              - /url: /policies/cancellation-refund
            - link "Shipping & Delivery" [ref=e212] [cursor=pointer]:
              - /url: /policies/shipping-delivery
        - generic [ref=e213]:
          - heading "Support" [level=4] [ref=e214]
          - generic [ref=e215]:
            - link "Help Center" [ref=e216] [cursor=pointer]:
              - /url: /#contact
            - link "Track Order" [ref=e217] [cursor=pointer]:
              - /url: /orders
            - link "Policy Index" [ref=e218] [cursor=pointer]:
              - /url: /policies
      - generic [ref=e219]:
        - generic [ref=e220]: © 2025 The Cake Lounge Patisserie. All rights reserved.
        - generic [ref=e221]:
          - text: Made with
          - generic [ref=e222]: ❤️
          - text: in India
  - link "Chat on WhatsApp" [ref=e223] [cursor=pointer]:
    - /url: https://wa.me/917703870170
    - img [ref=e224]
  - alert [ref=e226]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Checkout Midnight Delivery Caution', () => {
  4  |   test('should show midnight delivery caution only when midnight slot is selected', async ({ page }) => {
  5  |     // 1. Go to Menu page and add a product to the cart
  6  |     await page.goto('http://localhost:3000/menu');
  7  |     await page.waitForTimeout(1000); // Wait for hydration
  8  |
  9  |     const addButton = page.locator("button:has-text('Add')").first();
  10 |     await addButton.click();
  11 |
  12 |     // Verify product added (cart badge shows 1)
  13 |     const cartBadge = page.locator('button[aria-label="View Cart"]').locator('.absolute');
  14 |     await expect(cartBadge).toHaveText('1');
  15 |
  16 |     // 2. Go to Checkout page with bypass=true to skip auth checks
  17 |     await page.goto('http://localhost:3000/checkout?bypass=true');
  18 |     await page.waitForTimeout(2000); // Wait for page load and state initialization
  19 |
  20 |     // 3. Confirm Midnight Delivery Caution is initially HIDDEN
  21 |     const cautionSelector = page.locator('text=⚠ IMPORTANT — Midnight Delivery');
  22 |     await expect(cautionSelector).not.toBeVisible();
  23 |
  24 |     // 4. Select a delivery date
  25 |     // Click the calendar button
  26 |     await page.click('button:has-text("Select Delivery Date")');
  27 |     await page.waitForSelector('.react-datepicker');
  28 |
  29 |     // Click a selectable day that is not disabled or out of range
  30 |     // React-datepicker days have class 'react-datepicker__day'
  31 |     // Let's click the first day cell that is selectable and not disabled or outside month
  32 |     const dayElement = page.locator('.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)').first();
  33 |     await dayElement.click();
  34 |
  35 |     // 5. Select a non-midnight delivery slot (e.g. "10:00 AM – 12:00 PM")
  36 |     const timeSlotDropdown = page.locator('select');
> 37 |     await timeSlotDropdown.selectOption('10:00 AM – 12:00 PM');
     |                            ^ Error: locator.selectOption: Test timeout of 30000ms exceeded.
  38 |
  39 |     // Confirm Caution is STILL HIDDEN
  40 |     await expect(cautionSelector).not.toBeVisible();
  41 |
  42 |     // 6. Select the Midnight Delivery slot
  43 |     await timeSlotDropdown.selectOption('10:00 PM – 12:00 AM (Midnight Delivery)');
  44 |
  45 |     // Confirm Caution is now IMMEDIATELY VISIBLE
  46 |     await expect(cautionSelector).toBeVisible();
  47 |
  48 |     // 7. Select a non-midnight delivery slot again (e.g. "02:00 PM – 04:00 PM")
  49 |     await timeSlotDropdown.selectOption('02:00 PM – 04:00 PM');
  50 |
  51 |     // Confirm Caution is INSTANTLY HIDDEN again
  52 |     await expect(cautionSelector).not.toBeVisible();
  53 |
  54 |     // Take screenshot for visual verification
  55 |     await page.screenshot({ path: '/home/jules/verification/checkout_caution_flow.png', fullPage: true });
  56 |   });
  57 | });
  58 |
```