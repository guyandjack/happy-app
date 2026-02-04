const axios = require("axios");

testNotification = async () => {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
      ? process.env.TELEGRAM_BOT_TOKEN
      : null;

    const CHAT_ID = process.env.TELEGRAM_CHAT_ID
      ? process.env.TELEGRAM_CHAT_ID
        : null;
    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        console.Console("variable nulle")
        return false
    }
    
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: CHAT_ID,
      text: "✅ Test notification Telegram OK",
    },
    );
    return true
};

module.exports = testNotification;
