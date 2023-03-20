require('dotenv').config();
const { Telegraf } = require('telegraf');
const AMPQConnection = require('./AMPQConnection')

const bot = new Telegraf(process.env.STUDENT_BOT_TOKEN);
const users = {};

function checkQueue() {
  AMPQConnection.consume(function (msg) {
    if (msg.content.includes('Починаю лекцію...')) {
      Object.keys(users).forEach(function (key) {
        const user = users[key];
        const userId = user.id;

        bot.telegram.sendMessage(userId, 'Викладач чекає інформацію про присутність студентів', {
          reply_markup: {
            inline_keyboard: [[
              {
                text: 'Повідомити про присутність', callback_data: 'BOT_BTN_notifyStudentIsHere'
              }
            ]]
          }
        });
      })
    }
  });
}

bot.on('callback_query', (ctx) => {
  const data = ctx.update.callback_query.data;

  if (data === 'BOT_BTN_notifyStudentIsHere') {
    const messageContent = {
      senderId: ctx.from.id,
      sender: ctx.from,
      content: 'Студетнт присутній'
    };

    AMPQConnection.sendToQueue(messageContent);

    ctx.reply('Ваш запит успішно надіслано!');
  }
});

bot.start((ctx) => {

  if (!users[ctx.message.from.id]) {
    users[ctx.message.from.id] = ctx.message.from;
  }

  checkQueue();
  ctx.reply('Привіт Студент! ' + ctx.message.from.first_name)
});
bot.launch();
