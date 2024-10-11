import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const handler = async (event, _context, _callback) => {
  let browser = null;
  let result = null;

  // await chromium.font("/var/task/fonts/NotoColorEmoji.ttf");
  // Recommended if using url
  // await chromium.font(
  //   "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
  // );

  try {
    // Extracting the HTML from the event object
    const html = event.body.html;
    const args = [...chromium.args, "--disable-gpu-sandbox"];

    // creating puppeteer browser instance
    browser = await puppeteer.launch({
      args: args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      dumpio: true,
    });

    // Create a new page
    const page = await browser.newPage();

    // setting the html content
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // If you are using custom fonts
    await page.evaluateHandle("document.fonts.ready");

    // configurations for generating pdfs
    const pdf = await page.pdf({
      // path: "result.pdf",
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });

    // converting pdf to base64
    result = pdf.toString("base64");
  } catch (error) {
    console.log("-----handler---", error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};
