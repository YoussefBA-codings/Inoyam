const puppeteer = require('puppeteer');

class PuppeteerService {
  browser;
  urlProcessQueueMockUp = [];


  constructor() {
    return (async () => {
      this.browser = await puppeteer.launch({ headless: true }).catch((err) => console.log(err));
      return this;
    })();
  }

  async getBrowser() { return await this.browser }

  async getHtmlFromElement(page, element = 'html') {
    const elementHandle = await page.$(element);
    const html = await page.evaluate(el => el.innerHTML, elementHandle);
    return html;
  }
}


module.exports = PuppeteerService;
