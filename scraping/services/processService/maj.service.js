module.exports = async (bot) => {
  console.log('Faire un maj du bot', bot);

  const db = new ImmobilierService(`http://localhost:3001`)
  const token = await db.login({ email: 'admin@localhost', password: 'password' })

  const bot = utils.getBotClass(num_bot)
  if (bot === 'all') {
    console.log(`Process for all bot`);
    /**
     * TODO : Process scan for all bot
     */
  } else {
    console.log(`Process for one bot`);
    const processQueue = new ProcessQueueService()
    processQueue.push(bot.firstOnesUrls())
    console.log(processQueue.get())

    const ads = await bot.getDatas(processQueue.pop())
    if (ads.data) {
      if (bot.getConfig().isApi) {
        // Pour les bots API
        // Extraction des donnéés
        // Insertion dans la bdd
        const adsToExtract = bot.extractAdsFromResponce(ads.data)
        adsToExtract.forEach(async (ad) => {
          const adToDB = bot.extraction(ad)
          try {
            const oldAd = await db.get(adToDB.id);
            const oldAdDate = new Date(oldAd.updatedAt)
            const date = new Date();
            if (oldAd) {
              if (date.getUTCDay() - oldAdDate.getUTCDay() > 2) {
                if (JSON.stringify(adToDB) === JSON.stringify(oldAd)) {
                  console.log('Annonce à jour');
                } else {
                  const isUpdated = await db.put(adToDB.id, adToDB);
                  console.log(isUpdated);
                }
              } else {
                console.log('Annonce à jour');
              }
            } else {
              const isAdd = await db.post(adToDB)
              console.log(isAdd);
            }
          } catch (err) {
            console.log(err);
          }
        })
      } else if (!bot.getConfig().isApi && bot.getConfig().isHtml) {
        // faire les opérations cheerio
      } else throw new Error('Data is not HTML or JSON');
    } else throw new Error('No Data !');


    /**
     * TODO : Process maj for one bot
     *    - Declarer la queue
     *    - Get first url et push dans la queue
     *    - Process queue pour recup les datas
     *        - par API ou par cheerio (Dans les classe des bot)
     *    
     */
  }



}