module.exports = {
  toCapitalizedCase: str => str[0].toUpperCase() + str.substr(1),
  getBotClass: (num_bot) => {
    let Bot, botToScrap;
    switch (num_bot) {
      case 0:
        console.log(`Scan : All`)
        bot = 'all'
        break;
      case 1:
        console.log(`Scan : Bot 1`);
        Bot = require(`./../../../bots/001_pap.bot.js`);
        botToScrap = new Bot()
        break;
      default:
        return new Error(`Le bot n'existe pas`)
    }
    return botToScrap
  },
}