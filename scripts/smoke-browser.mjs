import { chromium } from "playwright-core";
import { readFile, stat, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";

const vars = await readFile("services/api/.dev.vars", "utf8");
const token = vars.match(/^ADMIN_TOKEN=(.+)$/m)?.[1];
assert(token, "Local ADMIN_TOKEN required; value is never printed.");
const root = resolve("apps/client/dist");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".png": "image/png",
  ".ico": "image/x-icon",
};
const server = createServer(async (req, res) => {
  try {
    const path = resolve(
      root,
      "." + new URL(req.url, "http://localhost").pathname,
    );
    if (path !== root && !path.startsWith(root + "/")) {
      res.writeHead(403).end();
      return;
    }
    const target = (await stat(path)).isDirectory()
      ? resolve(path, "index.html")
      : path;
    res.setHeader(
      "Content-Type",
      types[extname(target)] ?? "application/octet-stream",
    );
    res.end(await readFile(target));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(8081, "127.0.0.1", resolve));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1360, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const itemIds = [];
let stagedPath;
try {
  await page.goto("http://127.0.0.1:5173");
  await page.getByLabel("Lokalni admin token").fill(token);
  await page.getByRole("button", { name: "Poveži Studio" }).click();
  await page.getByText("● Povezano").waitFor();
  await page.getByRole("button", { name: "Učitaj demo nacrt" }).click();
  const editor = page.getByLabel("JSON iz ChatGPT-a");
  const content = JSON.parse(await editor.inputValue());
  content.title = "SMOKE EAT " + Date.now();
  content.factsVerified = true;
  content.allergensVerified = true;
  content.image.rightsConfirmed = true;
  await editor.fill(JSON.stringify(content, null, 2));
  await page
    .locator("input[type=file]")
    .setInputFiles("apps/client/assets/demo-eat.png");
  await page
    .getByRole("link", { name: "Preuzmi optimiziranu sliku" })
    .waitFor();
  const stagedContent = JSON.parse(await editor.inputValue());
  stagedPath = resolve("services/api/public" + stagedContent.image.path);
  const downloading = page.waitForEvent("download");
  await page.getByRole("link", { name: "Preuzmi optimiziranu sliku" }).click();
  await (await downloading).saveAs(stagedPath);
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await fetch(
      "http://127.0.0.1:8787" + stagedContent.image.path,
    );
    if (
      response.ok &&
      response.headers.get("Content-Type")?.startsWith("image/")
    ) {
      ready = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert(ready, "Staged static image must be served before publishing");
  await page.route("**/admin/content", async (route) => {
    if (route.request().method() === "POST")
      await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page
    .getByRole("button", { name: "Sačuvaj nacrt", exact: true })
    .click();
  assert(await editor.isDisabled(), "Studio editor must be locked during save");
  assert(
    await page.getByRole("button", { name: "Novi nacrt +" }).isDisabled(),
    "Studio navigation must be locked during save",
  );
  await page.getByText("Nacrt je sačuvan.", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Na pregled", exact: true }).click();
  await page
    .getByRole("button", { name: "Odobri i objavi" })
    .waitFor({ state: "visible" });
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Odobri i objavi" }).click();
  await page.getByRole("button", { name: "Povuci iz objave" }).waitFor();
  const catalog = await (await fetch("http://127.0.0.1:8787/catalog")).json();
  const item = catalog.items.find((i) => i.title === content.title);
  assert(item, "Published item must be visible through public API");
  itemIds.push(item.id);
  await page.screenshot({
    path: "/tmp/random-studio-smoke.png",
    fullPage: true,
  });
  // Exercise BOOK in the same editorial workflow.
  await page.getByRole("button", { name: "Novi nacrt +" }).click();
  await page.getByRole("button", { name: "BOOK", exact: true }).click();
  await page.getByRole("button", { name: "Učitaj demo nacrt" }).click();
  const book = JSON.parse(await editor.inputValue());
  book.title = "SMOKE BOOK " + Date.now();
  book.factsVerified = true;
  book.image.rightsConfirmed = true;
  await editor.fill(JSON.stringify(book, null, 2));
  await page
    .getByRole("button", { name: "Sačuvaj nacrt", exact: true })
    .click();
  await page.getByRole("button", { name: "Na pregled", exact: true }).waitFor();
  await page.getByRole("button", { name: "Na pregled", exact: true }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Odobri i objavi" }).click();
  await page.getByRole("button", { name: "Povuci iz objave" }).waitFor();
  const bookCatalog = await (
    await fetch("http://127.0.0.1:8787/catalog")
  ).json();
  const publishedBook = bookCatalog.items.find((i) => i.title === book.title);
  assert(publishedBook);
  itemIds.push(publishedBook.id);
  // With EXPO_PUBLIC_API_URL configured this tests the just-published D1 content;
  // otherwise the explicitly labelled local demo must still work.
  await page.goto("http://127.0.0.1:8081");
  await page.route("**/spin", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.getByRole("button", { name: "SPIN ↗" }).click();
  assert(
    await page.getByRole("button", { name: "Tvoj izbor" }).isDisabled(),
    "Allergen preferences must be locked during SPIN",
  );
  await page.getByRole("button", { name: "Idemo kuhati →" }).waitFor();
  await page.getByRole("button", { name: "Idemo kuhati →" }).click();
  await page.getByText("Sastojci", { exact: true }).waitFor();
  await page.screenshot({
    path: "/tmp/random-client-smoke.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/tmp/random-client-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Tvoj izbor" }).click();
  await page.getByRole("checkbox", { name: "☐ Bez mlijeka" }).click();
  await page.getByRole("button", { name: "Gotovo" }).click();
  await page.getByRole("button", { name: "SPIN ↗" }).click();
  await page.getByText("Nema nove preporuke", { exact: false }).waitFor();
  await page.getByRole("button", { name: "BOOK / dobra knjiga" }).click();
  await page.getByRole("button", { name: "SPIN ↗" }).click();
  await page.getByRole("button", { name: "Upoznaj knjigu →" }).waitFor();
  await page.getByRole("button", { name: "Upoznaj knjigu →" }).click();
  await page.getByText("Zašto ova knjiga?", { exact: true }).waitFor();
  await page.getByRole("button", { name: "SPIN AGAIN ↻" }).click();
  await page.getByText("Nema nove preporuke", { exact: false }).waitFor();
  assert.deepEqual(errors, [], "No unhandled browser errors");
  console.log(
    "Browser smoke passed: image optimize/download/static serving, EAT+BOOK import/review/publish, public D1 catalog, Expo web SPIN/details, allergy and exhaustion fallback, editor/SPIN race guards, mobile viewport.",
  );
} finally {
  for (const itemId of itemIds) {
    const state = await (
      await fetch("http://127.0.0.1:8787/admin/content", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();
    const current = state.items.find((i) => i.id === itemId);
    if (current)
      await fetch(`http://127.0.0.1:8787/admin/content/${itemId}/unpublish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "If-Match": `"${current.version}"`,
        },
      });
  }
  if (stagedPath) await unlink(stagedPath).catch(() => {});
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
