let timestamp;

module.exports.config = {
  name: "ping",
  version: "1.0.0",
  cooldown: 2,
  role: 0,
  hasPrefix: true,
  aliases: ['system'],
  description: "Check the bot's latency.",
  usage: "{pref}[name of cmd]",
  credits: " Ainz"
};

// Start Execution
module.exports.run = async ({ api, event }) => {
const nowTime = Date.now();
let callbackMS;
 api.sendMessage("Pinging...", event.threadID, (err, info) => {
      timestamp = info.timestamp;
      callbackMS = Date.now();
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  const latency = timestamp - nowTime;
    const callbackTime = callbackMS - nowTime;

    // End Of Execution
    await api.sendMessage(`🕒 Pong!\nLatency: Input = ${latency} ms\nCallback = ${callbackTime} ms Input & Callback Difference:
(Callback - Input) =
${callbackTime - latency} ms`, event.threadID);
   };
