const Utils = require('./../services/processService/tools/utils')
const UtilsForExtract = require('./../services/processService/tools/utilsForExtract')

class PapBot {
  constructor() {
    console.log(`Pap Bot`);
    this.config = {
      isApi: true,
      isHtml: false,
      dataInOneAd: true, // true: Faire requete pour récup les datas | false: les datas de la liste des annonces sont suffisant
      reqOptions: {
        method: 'get',
        baseUrl: 'https://ws.pap.fr/',
        headers: {
          Host: 'ws.pap.fr',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
          'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      }
    };
  }

  getConfig() { return this.config }

  firstOnesUrls() {
    const arrParams = []
    const paramsQs = { 'recherche[produit]': 'vente', page: 1 };
    arrParams.push({ url: 'immobilier/annonces', searchParams: paramsQs })
    return arrParams
  }

  async getDatas(url) {
    const AxiosService = require('./../services/AxiosService')
    const as = new AxiosService(this.config.reqOptions.baseUrl)
    const data = await as.doRequest(`get`, url.url, url.searchParams).catch((e) => { throw e; });
    return data;
  }

  createQsWithData(options, data) {
    const arrayOfParams = [];
    const max_page = 100;
    const query = options;
    if (data.page_nb_items !== 0) {
      for (let p = 2; p <= max_page; p++) {
        query.searchParams = query.searchParams.replace(/(?<=&page=)\d+/gi, p);
        arrayOfParams.push(JSON.parse(JSON.stringify(query)));
      }
      return arrayOfParams;
    } else {
      console.log('problème de pagination revoir les filtres (cas pas prévu)');
    }
  }

  // getMajUrl(item) {
  //   const url = { url: `immobilier/annonces/${item.publication_id}` };
  //   return url;
  // }
  extractAdsFromResponce(data) {
    return data['_embedded'].annonce
  }

  isListOfAds(data) {
    return data['_embedded']?.annonce ? true : false
  }

  extractUrlFromAd(ad) {
    return ad.id ? { url: `immobilier/annonces/${ad.id}` } : null
  }

  extraction(item) {
    try {
      const ad = {
        id_site_source: 1,
        seller_type: 'particulier',
        extra: []
      }

      Object.keys(item).forEach(key => {
        const value = item[key]

        switch (key) {
          case 'id': ad.publication_id = value; break;
          case 'typebien': ad.category = value; break;
          case 'releaseDate': ad.publicationDate = value; break;
          case 'nb_pieces': ad.rooms = value; break;
          case 'nb_chambres_max': ad.bedrooms = value; break;
          case 'surface': ad.surface = value; break;
          case 'floorNumber': ad.etage_bien = value; break;
          case 'prix': ad.price = value; break;
          case 'texte': ad.description = value; break;
          case '_links':
            if (value?.desktop?.href)
              ad.url = value.desktop.href
            break;
          case '_embedded':
            ad.medias = {}
            if (value?.photo && value?.photo[0]._links?.self?.href) {
              ad.medias.thumb = value.photo[0]._links.self.href
              ad.medias.images = UtilsForExtract.makePhotoArray(value.photo)
            }
            ad.code_postal = UtilsForExtract.getLocationCode(value.place[0])
            ad.city = UtilsForExtract.getLocationName(value.place[0])
            break;
          default: break;
        }
      })

      if (!ad.title)
        ad.title = `${Utils.toCapitalizedCase(ad.category)} à ${ad.city} (${ad.code_postal}), ${ad.rooms} pièce(s), ${ad.bedrooms} chambre(s)`;

      switch (true) {
        case /location/gi.test(ad.description): ad.type = 'location'; break;
        case /viager/gi.test(ad.description): ad.type = 'viager'; break;
        case /copro/gi.test(ad.description): ad.extra.push('copro'); break;
        case /(?:louée?|appartement|maison) meublée?/gi.test(ad.description): ad.extra.push('meuble'); break;
        case /coloc/gi.test(ad.description): ad.colocation = true; break;
        default: ad.type = 'vente'; break;
      }
      ad.extra = ad.extra.join(',');
      ad.category = UtilsForExtract.categories(ad.category);


      if (ad.price && ad.surface) ad.pricePerSquareMeter = ad.price / ad.surface;
      if (ad.surface && ad.city && ad.title && ad.category)
        return ad;
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = PapBot;
