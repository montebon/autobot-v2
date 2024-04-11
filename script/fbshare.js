const axios = require('axios');

module.exports.config = {
  name: "fbshare",
  version: "1.0.0",
  cooldown: 5,
  role: 0,
  hasPrefix: true,
  aliases: ['fbsharev2'],
  description: "this command will help u to boost ur share on fb through cookies",
  usage: "{pref}[name of cmd] [url] [amounts] [intervals] [cookies]",
  credits: "Ainz"
};

module.exports.run = async ({ api, event, args }) => {

const cookies = args[0];
const url = args[1];
const amounts = args[2];
const intervals = args[3];


try {
  if (!args[0]) {
api.sendMessage(`🔴 | {pref}[name of cmd] [cookies] [url] [amounts] [intervals]`, event.threadID, event.messageID);
return;
  }
    else if (args[0] == "status") {
  api.sendMessage(`🕒 Getting the info of your sharing status on the website. . .`, event.threadID, event.messageID);
        const urlz = await axios.get(`https://gemini-ai-uk.onrender.com/totals`);
        const a = urlz.data[0];
        const sessions = a.session;
        const url = a.url;
        const count = a.count;
        const id = a.id;
        const target = a.target
  return api.sendMessage(`Session: ${sessions}\nUrl: ${url}\nCounts: ${count}/${target}\nFb-post-ID: ${id}`, event.threadID, event.messageID);
    }
    
api.sendMessage(`🕒 Getting response on website. . .`, event.threadID, event.messageID);

       const response = await fetch('https://unknown-apis.onrender.com/share/submit', {
               method: 'POST',
               body: JSON.stringify({
                 cookie: cookies,
                 url: url,
                 amount: amounts,
                 interval: intervals,
               }),
               headers: {
                 'Content-Type': 'application/json',
               },
             });
         const data = await response.json();
         
             if (data.status === 200) {
              api.sendMessage(`🟢 Website say successful here's info:\n\nYour fb-post-url: ${url}\n\nAmounts of sharing: ${amounts}\n\nInterval of sharing: ${intervals}`, event.threadID);    
             } else {
               api.sendMessage(`🔴 error fetching response on the website( https://another-share-boost-api.onrender.com/ ), because ${data.error}.`, event.threadID);
             }
           } catch (e) {
             console.error(e);
           }
         };        

