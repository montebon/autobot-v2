module.exports.config = {
  name: "slot",
  version: "1.0.0",
  cooldown: 5,
  role: 0,
  hasPrefix: true,
  aliases: ['game'],
  description: "gambling in form of fruit",
  usage: "{pref}[name of cmd] [money]",
  credits: "Ainz"
};


module.exports.run = async function({ api, event, args, Currencies }) {
    const { threadID, messageID, senderID } = event;
  
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
  
  const money = await getData(senderID);

  if (!money || typeof money !== 'object') {
    return;
  }

  const moneyUser = money.money;
  
    var moneyBet = parseInt(args[0]);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage('[ SLOT ] The bet money must not be blank or a negative number', threadID, messageID);
  if (moneyBet > moneyUser) return api.sendMessage('[ SLOT ] The money you betted is bigger than your balance!', threadID, messageID);
  
    var number = [], win = false;
    for (i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
    if (number[0] == number[1] && number[1] == number[2]) {
        moneyBet *= 9;
        win = true;
    }
    else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
        moneyBet *= 2;
        win = true;
    }
    switch (win) {
        case true: {
            api.sendMessage(`🎰 ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}. Congratulations! You've won ${moneyBet}. Your total balance is now ${moneyUser + moneyBet}.`, threadID, messageID);
            await increaseMoney(senderID, moneyBet);
            break;
        }
        case false: {
            api.sendMessage(`🎰 ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}. Sorry, you didn't win this time. You lost ${moneyBet}. Your total balance is now ${moneyUser - moneyBet}.`, threadID, messageID);
            await decreaseMoney(senderID, moneyBet);
            break;
        }
    }
}
