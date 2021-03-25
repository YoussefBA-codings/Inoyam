const PuppeteerService = require('../PuppeteerService.js.js');

class CineInKoreaService extends PuppeteerService {
  constructor() {
    super()
  }

  getUrlProcessQueueMockUp() { return this.urlProcessQueueMockUp }
  setUrlProcessQueueMockUp(url) { this.urlProcessQueueMockUp.push(url) }

  async checkSecurityOnSite(page, element = 'html') {
    const html = await super.getHtmlFromElement(page, element);
    if (/Please prove that you are human/.test(html)) {
      console.log('On peut click.');
      await Promise.all([
        page.waitForNavigation(),
        page.click('form > input[type="submit"]')
      ]);
    }
  }

  setDateUrlToQueue(theatre_$, selector, baseUrl) {
    selector.each((day_i, day) => {
      const dayElement = theatre_$(day)
      if (!/Scheduled Dates|today|\u00a0|\u202f/i.test(dayElement.text())) {
        const jour = dayElement.text().replace(/\D+/g, '')
        baseUrl = baseUrl.replace(/(date=\d{4}-\d{2})-\d{2}/, `$1-${jour}`),
          this.setUrlProcessQueueMockUp(baseUrl);
      }
    })
  }

  async getTheater(url) {
    const browser = await super.getBrowser();
    const pageTheater = await browser.newPage()
    await pageTheater.goto(url);

    await this.checkSecurityOnSite(pageTheater, 'p');

    const htmlTheater = await super.getHtmlFromElement(pageTheater, 'table#table>tbody');
    await pageTheater.close();
    return htmlTheater;
  }

  async getMoviesByTheater(url) {
    const browser = await super.getBrowser();
    const pageTheater = await browser.newPage()

    await pageTheater.goto(url);

    await this.checkSecurityOnSite(pageTheater, 'p');
    const htmlTheater = await super.getHtmlFromElement(pageTheater, 'div#container');
    await pageTheater.close();
    return htmlTheater;
  }

  getAllUrlFormAllTheaterPage($) {
    $('a').each((i, el) => {
      const hrefFromAElement = $(el).attr('href')
      const paramsArray = hrefFromAElement.replace(/javascript\:sendTheater\((.+)\)/, '$1').replace(/\'/g, '').split(', ');
      const paramsObj = {
        brand: paramsArray[0],
        theater: paramsArray[1],
        theater_code: paramsArray[2],
        area: paramsArray[3],
        source: paramsArray[4],
        group: paramsArray[5],
        date: paramsArray[6]
      }

      const params = Object.keys(paramsObj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(paramsObj[k])).join('&');
      const urlTheater = `http://cinein.cafe24.com/mobile/movies_wp.php?page_id=464&${params}`;

      this.setUrlProcessQueueMockUp(JSON.parse(JSON.stringify(urlTheater)));
    })
  }

  getSeanceFromCgvBrand($, seancesDivElement, maxSeatsElement = 0) {
    const seances = []
    seancesDivElement.each((k, seanceElement) => {
      /** BOUCLE FILM.SCREEN.SEANCES */
      const seance = {}
      seance.seanceHour = $(seanceElement).find('input').attr('value').trim()
      // const placeObj = {
      //   max: Number(maxSeatsElement.find('span').text().replace(/^.+ (\d{2,})\s?seats$/, '$1')),
      //   left: Number($(seanceElement).find('input').attr('value').trim().replace(/^.+ (\d{1,})\s?left.+$/, '$1')),
      // };
      // seance.places = `${placeObj.left}/${placeObj.max} seats`;
      seances.push(seance)
    })
    return seances
  }

  async extraction($, urlTheater) {
    const hrefAddressElement = $('#body a').attr('href')
    const [address, brand, theaterCity] = hrefAddressElement.replace(/javascript\:sendAddress\((.+)\)/, '$1').split('\', \'')

    /** PROCESS : GET SCEANCE FOR ONE THEATER */
    const films = [];
    const smallLineIdElement = $('#small_line');
    smallLineIdElement.each((i, filmElement) => {
      /** BOUCLE FILMS */
      const nameFilmElement = $(filmElement).next();
      const nameFilm = nameFilmElement.find('strong').text();
      const urlDetailFilm = nameFilmElement.find('a.apple_style').attr('href');
      const voiceFilm = nameFilmElement.find('span').text().replace(/^\s+?voice\s+?\:\s+?(\D+)(?:.+\(.+)?$/, '$1').trim().split(',');

      const urlAfficeFilmElement = nameFilmElement.next()
      const urlAfficeFilm = urlAfficeFilmElement.find('img').attr('src');

      const seanceFilmElement = urlAfficeFilmElement.next();
      const screensElement = seanceFilmElement.find('#narrow_padding')
      const screens = [];
      screensElement.each((j, sreenElement) => {
        /** BOUCLE FILM.SCREENS */
        const screenAllElement = $(sreenElement)
        // const maxSeatsElement = $(sreenElement).next()
        const seancesElement = $(sreenElement).next()

        switch (brand) {
          default:
            const seancesDivElement = seancesElement.find('div')
            const screen = {
              name: screenAllElement.find('span').text().replace(/^.+(screen\s?\d+).+$/, "$1"),
              seances: this.getSeanceFromCgvBrand($, seancesDivElement)
            };
            screens.push(screen)
            break;
        }
      })

      films.push({
        detailUrl: urlDetailFilm,
        name: nameFilm,
        poster: urlAfficeFilm,
        languages: voiceFilm,
        screens
      })
    })

    return {
      brand: brand.replace(/\'/g, '').trim(),
      theaterCity: theaterCity.replace(/\'/g, '').trim(),
      address: address.replace(/\'/g, '').trim(),
      urlTheater,
      films
    }
  }
}


module.exports = CineInKoreaService;