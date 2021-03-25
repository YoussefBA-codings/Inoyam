const cheerio = require('cheerio');

class CheerioService {
  html;

  constructor(htmlToCheerio) {
    this.html = cheerio.load(htmlToCheerio)
  }

  getHtml() { return this.html }
}

module.exports = CheerioService;