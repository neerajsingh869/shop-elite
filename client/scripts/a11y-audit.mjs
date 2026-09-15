import { chromium } from "playwright";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve("axe-core");

const BASE = process.env.A11Y_BASE ?? "http://localhost:5173";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

let failures = 0;

async function runAxe(page, name) {
  await page.addScriptTag({ path: AXE_PATH });
  const res = await page.evaluate(
    (tags) => window.axe.run(document, { runOnly: { type: "tag", values: tags } }),
    TAGS,
  );
  const v = res.violations;
  if (v.length === 0) {
    console.log(`  PASS  ${name}  (0 violations, ${res.passes.length} checks passed)`);
  } else {
    failures += v.length;
    console.log(`  FAIL  ${name}  (${v.length} violations)`);
    for (const x of v) {
      console.log(`        [${x.impact}] ${x.id}: ${x.help}`);
      for (const n of x.nodes.slice(0, 3)) {
        console.log(`           ${n.html.slice(0, 120).replace(/\s+/g, " ")}`);
      }
    }
  }
}

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", (e) => console.log(`  !! page error: ${e.message}`));

console.log("\n=== ROUTES ===");
for (const [path, name, waitFor] of [
  ["/", "home", 'a[href="/beauty"]'],
  ["/products", "all products", 'a[href*="/products/"]'],
  ["/smartphones", "category listing", 'a[href*="/smartphones/"]'],
  ["/login", "login", "#password"],
  ["/register", "register", "#confirm-password"],
]) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  // wait for REAL content, not the skeleton - otherwise we audit empty divs
  await page.waitForSelector(waitFor, { timeout: 45000 });
  await page.waitForTimeout(400);
  await runAxe(page, name);
}

console.log("\n=== PRODUCT DETAIL ===");
await page.goto(BASE + "/smartphones", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('a[href*="/smartphones/"]', { timeout: 45000 });
await page.locator('a[href*="/smartphones/"]').first().click();
await page.waitForSelector("h1", { timeout: 45000 });
await page.waitForTimeout(1500);
console.log(`  url: ${page.url()}`);
await runAxe(page, "product detail");

console.log("\n=== OVERLAYS ===");
// cart drawer (add an item first so it is not the empty state)
await page.getByRole("button", { name: /add to cart/i }).click();
await page.waitForTimeout(800);
await runAxe(page, "cart drawer (open)");

// checkout modal
await page.getByRole("button", { name: /make payment/i }).click();
await page.waitForTimeout(800);
await runAxe(page, "checkout modal (open)");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

// search modal
await page.getByRole("button", { name: /search products/i }).first().click();
await page.waitForTimeout(600);
await runAxe(page, "search modal (open)");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

console.log("\n=== KEYBOARD BEHAVIOUR ===");
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('a[href="/beauty"]', { timeout: 45000 });
await page.waitForTimeout(400);

// 1. skip link is the first tab stop
await page.keyboard.press("Tab");
const first = await page.evaluate(() => ({
  tag: document.activeElement?.tagName,
  text: document.activeElement?.textContent?.trim(),
}));
const skipOk = first.text === "Skip to main content";
console.log(`  ${skipOk ? "PASS" : "FAIL"}  first Tab stop is the skip link (got "${first.text}")`);
if (!skipOk) failures++;

// 2. skip link moves focus to <main>
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
const afterSkip = await page.evaluate(() => document.activeElement?.id);
const mainOk = afterSkip === "main-content";
console.log(`  ${mainOk ? "PASS" : "FAIL"}  skip link moves focus to <main> (got "${afterSkip}")`);
if (!mainOk) failures++;

// back to home - Enter on the skip link does not navigate, but be explicit
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('a[href="/beauty"]', { timeout: 45000 });
await page.waitForTimeout(400);

// 3. cart drawer: focus enters, Escape closes and restores focus to trigger
const cartBtn = page.getByRole("button", { name: /open cart/i });
await cartBtn.click();
await page.waitForTimeout(600);
const inDialog = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
console.log(`  ${inDialog ? "PASS" : "FAIL"}  focus moves inside the dialog on open`);
if (!inDialog) failures++;

// 4. background is inert
const inertOk = await page.evaluate(() => document.getElementById("root")?.hasAttribute("inert"));
console.log(`  ${inertOk ? "PASS" : "FAIL"}  #root is inert while the dialog is open`);
if (!inertOk) failures++;

// 5. Tab cannot escape the dialog
let escaped = false;
for (let i = 0; i < 25; i++) {
  await page.keyboard.press("Tab");
  const still = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  if (!still) { escaped = true; break; }
}
console.log(`  ${!escaped ? "PASS" : "FAIL"}  Tab stays trapped in the dialog (25 presses)`);
if (escaped) failures++;

// 6. Escape closes and returns focus to the trigger
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
const restored = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || "");
const restoreOk = /open cart/i.test(restored);
console.log(`  ${restoreOk ? "PASS" : "FAIL"}  Escape restores focus to the trigger (got "${restored}")`);
if (!restoreOk) failures++;

const inertGone = await page.evaluate(() => !document.getElementById("root")?.hasAttribute("inert"));
console.log(`  ${inertGone ? "PASS" : "FAIL"}  inert removed after close`);
if (!inertGone) failures++;

console.log("\n=== TYPING INSIDE A DIALOG (regression guard) ===");
/*
  Modal used to list onClose in its effect dependency array. Every caller
  passes a fresh closure, so one keystroke in a dialog field re-ran the focus
  effect and threw focus onto the close button - the field was unusable.
  axe cannot see this, and the keyboard checks above cannot either, because
  they never type before pressing Escape. So: type first, then assert.
*/
await page.goto(BASE + "/smartphones", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('a[href*="/smartphones/"]', { timeout: 45000 });
await page.locator('a[href*="/smartphones/"]').first().click();
await page.waitForSelector("h1", { timeout: 45000 });
await page.waitForTimeout(1200);

const purchaseBtn = page.getByRole("button", { name: /purchase now/i });
await purchaseBtn.click();
await page.waitForTimeout(900);

const emailSel = '[role="dialog"] input[type="email"]';
await page.waitForSelector(emailSel, { timeout: 20000 });
await page.focus(emailSel);
await page.evaluate((sel) => { document.querySelector(sel).value = ""; }, emailSel);
await page.keyboard.type("abc", { delay: 80 });

// focus must still be in the field we were typing into
const focusHeld = await page.evaluate(
  () => document.activeElement?.getAttribute("type") === "email",
);
console.log(`  ${focusHeld ? "PASS" : "FAIL"}  focus stays in the field while typing`);
if (!focusHeld) failures++;

// and every character must have landed - focus theft silently truncates input
const typed = await page.evaluate((sel) => document.querySelector(sel)?.value, emailSel);
const allTyped = typed === "abc";
console.log(`  ${allTyped ? "PASS" : "FAIL"}  all keystrokes reach the field (got "${typed}")`);
if (!allTyped) failures++;

// closing after typing must still restore focus to the trigger, not <body>
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
const restoredAfterTyping = await page.evaluate(
  () => (document.activeElement?.textContent || "").trim(),
);
const restoreAfterTypingOk = /purchase now/i.test(restoredAfterTyping);
console.log(
  `  ${restoreAfterTypingOk ? "PASS" : "FAIL"}  focus returns to the trigger after typing (got "${restoredAfterTyping.slice(0, 40)}")`,
);
if (!restoreAfterTypingOk) failures++;

console.log("\n=== HEADINGS / LANDMARKS (home) ===");
const outline = await page.evaluate(() => ({
  h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
  landmarks: [...document.querySelectorAll("main, nav, header, footer, [role=dialog]")].map(
    (e) => e.tagName.toLowerCase() + (e.getAttribute("aria-label") ? `[${e.getAttribute("aria-label")}]` : ""),
  ),
}));
console.log(`  h1 count: ${outline.h1.length} -> ${JSON.stringify(outline.h1)}`);
console.log(`  landmarks: ${outline.landmarks.join(", ")}`);
if (outline.h1.length !== 1) { console.log("  FAIL  expected exactly one h1"); failures++; }
else console.log("  PASS  exactly one h1");

await browser.close();
console.log(`\n=== TOTAL FAILURES: ${failures} ===`);
process.exit(failures === 0 ? 0 : 1);
