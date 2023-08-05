const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
// replace the value below with the Telegram token you receive from @BotFather
const token = '6401955517:AAETRP8e9wOtGlu1CGFPFbg5yesfgKJmn7Q';
const webAppUrl = 'https://illustrious-starship-56d3df.netlify.app';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const app = express();
app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === '/start') {
    await bot.sendMessage(chatId, 'Открыть наш интернет магазин', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]],
      },
    });
    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму ', {
      reply_markup: {
        keyboard: [[{ text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' } }]],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
     await bot.sendMessage(chatId,'Спасибо за обратную связь!'+ data?.user);
    } catch (e) {
      console.log(e);
    }
  }
});
app.post('/web-data',async (req,res)=>{
    const {queryId,product,totalPrice}=req.body;
    try {
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Успешная покупка',
            input_message_content:{message_text:'Поздравляю с покупкой, вы приобрели товаров на сумму ' + totalPrice}
        })
        return res.status(200).json({})
    } catch (e) {
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Покупка не удалась ',
            input_message_content:{message_text:'К сожалению, покупка не удалась'}
        })
        return res.status(500).json({})
    }
   

})

const PORT = 8080;
app.listen(PORT,()=>{console.log('server started on PORT '+ PORT)});