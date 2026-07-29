import sys
import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 1000})
        page = context.new_page()

        # Listen to console logs
        page.on("console", lambda msg: print(f"[BROWSER CONSOLE] {msg.type}: {msg.text}"))

        print("Navigating to /menu...")
        page.goto("http://localhost:3000/menu")
        page.wait_for_load_state("networkidle")

        print("Clicking first product title...")
        first_product_title = page.locator("h3").first
        print(f"Product title text: {first_product_title.text_content()}")
        first_product_title.click()

        # Wait for url transition
        try:
            page.wait_for_url(r"**/shop/*", timeout=5000)
            print(f"Navigated to URL: {page.url}")
        except Exception as e:
            print(f"Navigation error or timeout: {e}")
            page.screenshot(path="debug_menu_after_click.png")
            print("Saved debug screenshot of menu after click to debug_menu_after_click.png")
            browser.close()
            return

        page.wait_for_load_state("networkidle")
        time.sleep(3)

        # Let's take a screenshot of the product page to see if it loaded, or has an error
        page.screenshot(path="debug_shop_page.png")
        print("Saved product page screenshot to debug_shop_page.png")

        # Let's check for any heading element
        h1s = page.locator("h1").all()
        for i, h1 in enumerate(h1s):
            print(f"H1 {i}: {h1.text_content()}")

        h2s = page.locator("h2").all()
        for i, h2 in enumerate(h2s):
            print(f"H2 {i}: {h2.text_content()}")

        # Let's check if there is an error message
        text_content = page.content()
        if "Product Not Found" in text_content:
            print("Found text: Product Not Found")
        if "catalog" in text_content.lower():
            print("Found catalog text")

        browser.close()

if __name__ == "__main__":
    main()
