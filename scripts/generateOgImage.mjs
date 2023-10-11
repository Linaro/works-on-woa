import * as puppeteer from "puppeteer";
import * as path from "path";
// Create a browser instance
process.chdir(`${process.cwd()}/dist`);
const browser = await puppeteer.launch({ headless: "new" });

// Create a new page
const page = await browser.newPage();

// Set viewport width and height
await page.setViewport({ width: 1280, height: 720 });

const homepagePath = `file://${process.cwd()}/`;
// const = fs.readFileSync('file:///C:/Users/Mytesting/test.html', { waitUntil: "networkidle2" });
await page.goto(homepagePath, {
  timeout: 15 * 1000,
  waitUntil: ["networkidle0"],
}); // Go to the website

await page.screenshot({
  // Screenshot the website using defined options

  path: "./screenshot.png", // Save the screenshot in current directory

  fullPage: false, // take a fullpage screenshot
});

await page.close(); // Close the website

await browser.close();
