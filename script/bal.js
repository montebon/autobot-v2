module.exports.config = {
  name: "bal",
  version: "1.0.0",
  cooldown: 5,
  role: 0,
  hasPrefix: true,
  aliases: ["game"],
  description: "Balance",
  usage: "{pref}[name of cmd]",
  credits: "Ainz"
};
module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID } = event;
  const { getData, increaseMoney, decreaseMoney } = Currencies;
  const money = await getData(senderID);
  const moneyBalUser = money.money;
  const nameOfUser = money.name;
  api.sendMessage(
    `Hi ${nameOfUser}🌠\nYour balance is ${moneyBalUser}✨`,
    threadID
  );
};
