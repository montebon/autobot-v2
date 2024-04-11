const axios = require("axios");

module.exports.config = {
  name: "tempnumber",
  version: "1.0.0",
  cooldown: 5,
  role: 0,
  hasPrefix: true,
  aliases: ['info'],
  description: "this command may help you create a temporary mobile number from random country",
  usage: "{pref}[name of cmd] [inbox/generate] [number]",
  credits: "Ainz"
};
module.exports.run = async ({ api, args, event }) => {
    const command = args[0];

    try {
      if (command === "generate") {
        let num = args[1];
       
        num = num || 1;

        if (isNaN(num) || num < 1 || num > 100) {
          return api.sendMessage("Please provide a valid number between 1 and 100 for generating temporary phone numbers.", event.threadID);
        }

        const response = await axios.get(`https://for-devs.onrender.com/api/tempnum/gen?num=${num}&apikey=fuck`);
        const tempNumbers = response.data;

        
        const formattedNumbers = tempNumbers.map((tempNum) => {
          return `╭───⧼ TEMPORARY NUMBER ⧽✧\n│─ Country: ${tempNum.country}\n┃─ Number: ${tempNum.number}\n│─ Generated ${tempNum.time}\n╰─────✦`;
        });

        return api.sendMessage(`✨ Here's generated temporary numbers:\n\n${formattedNumbers.join("\n\n")}`, event.threadID);

      } else if (command === "inbox") {
        let [phone, num] = args.slice(1).join(" ").split("|").map((str) => str.trim());

        if (!phone || isNaN(phone)) {
          return api.sendMessage("🔴 Please provide a valid phone number for retrieving inbox messages.", event.threadID);
        }
       
        num = num || 1;

        if (isNaN(num)) {
          return api.sendMessage("🔴 Please provide a valid number for retrieving inbox messages.", event.threadID);
        }

        const inboxResponse = await axios.get(`https://for-devs.onrender.com/api/tempnum/inbox?phone=${phone}&num=${num}&apikey=fuck`);
        const inboxMessages = inboxResponse.data;
      
        const formattedMessages = inboxMessages.map((message) => {
          return `${message.sms} - From: ${message.sender}`;
        });

        return api.sendMessage(`✨ Inbox messages for ${phone}:\n\n${formattedMessages.join("\n\n")}\n\n`, event.threadID);

      } else {
        return api.sendMessage("🔴 Invalid command. Use {pref}generate (1-10) or {pref}inbox (number) | (1-10).", event.threadID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("🔴 An error occurred. Please try again later.", event.threadID);
    }
  };