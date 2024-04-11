module.exports.config = {
  name: "sendmoney",
  version: "1.0.0",
  cooldown: 2,
  role: 0,
  hasPrefix: true,
  aliases: ['game', 'system'],
  description: "Transfer credits to another user.",
  usage: "{pref}[name of cmd] [uid] [amount]",
  credits: " Ainz"
};

module.exports.run = async ({
  api,
  event,
  args,
  Currencies
}) => {
  const {
    threadID,
    senderID
  } = event;
  if (args.length < 2 || !args[0] || !args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
    api.sendMessage("Invalid usage. Please use the command in the following format: sendmoney [uid] [amount]", threadID);
    return;
  }
  const recipientID = args[0];
  const amount = parseInt(args[1]);
  const senderBalance = await Currencies.getData(senderID);
  if (!senderBalance || senderBalance.money < amount) {
    api.sendMessage("You do not have enough credits to transfer.", threadID);
    return;
  }
  try {
    await Currencies.decreaseMoney(senderID, amount);
    await Currencies.increaseMoney(recipientID, amount);
    api.sendMessage(`Successfully transferred ${amount} credits to ${recipientID}.`, threadID);
  } catch (error) {
    console.error("Error transferring credits:", error);
    api.sendMessage("An error occurred while transferring credits. Please try again later.", threadID);
  }
};
