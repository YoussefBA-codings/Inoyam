const ProcessQueueService = require('../ProcessQueueService');
const utils = require('./tools/utils')
const isHtml = require('is-html');
const ImmobilierService = require('../apiService/immobiolier.service');



module.exports = async (num_bot) => {
  console.log('Faire un scan du bot', num_bot);

  const db = new ImmobilierService(`http://localhost:3001`)
  const token = await db.login({ email: 'admin@localhost', password: 'password' })

  const bot = utils.getBotClass(num_bot)
  const configBot = bot.getConfig()
  if (bot === 'all') {
    console.log(`Process for all bot`);
    /**
     * TODO : Process scan for all bot
     */
  } else {
    console.log(`Process for one bot`);
    const processQueue = new ProcessQueueService()
    processQueue.push(bot.firstOnesUrls())
    let queueSize = processQueue.count()
    console.log(processQueue.get())

    while (queueSize > 0) {
      queueSize = processQueue.count()
      console.log(`queueSize: ${queueSize}`)

      const ads = await bot.getDatas(processQueue.pop())
      if (ads.data && bot.isListOfAds(ads.data)) {
        if (configBot.isApi && !configBot.isHtml) {
          const adsToExtract = bot.extractAdsFromResponce(ads.data)
          adsToExtract.forEach(async (ad) => {
            if (configBot.dataInOneAd) {
              const urlAd = bot.extractUrlFromAd(ad)
              processQueue.push(urlAd)
            } else {
              const adToDB = bot.extraction(ad)
              const isAdd = await db.post(adToDB).catch((err) => { throw err.response.data })
              console.log(isAdd.data);
            }
          })
        } else if (!configBot.isApi && configBot.isHtml) {
          // faire les opérations cheerio
        } else throw new Error('Data is not HTML or JSON');
      } else if (ads.data && !bot.isListOfAds(ads.data)) {
        if (configBot.isApi && !configBot.isHtml) {
          const adToDB = bot.extraction(ads.data)
          const isAdd = await db.post(adToDB).catch((err) => { throw err.response.data })
          console.log(isAdd.data);
        } else if (!configBot.isApi && configBot.isHtml) {
          // faire les opérations cheerio
        } else throw new Error('Data is not HTML or JSON');
      } else throw new Error('No Data !');
    }



    console.log('debug');
    /**
     * TODO : Process scan for one bot
     *    - Declarer la queue
     *    - Get first url et push dans la queue
     *    - Process queue pour recup les datas
     *        - par API ou par cheerio (Dans les classe des bot)
     *    
     */
  }
}
