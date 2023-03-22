require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const AMPQConnection = require('./AMPQConnection');

const bot = new Telegraf(process.env.TEACHER_BOT_TOKEN);
const studentBot = new Telegraf(process.env.STUDENT_BOT_TOKEN);

bot.action('BOT_start_lecture', ctx => {
  const senderId = ctx.update.callback_query.message.from.id;
  const sender = ctx.update.callback_query.message.from;

  const messageToSend = {
    content: 'Починаю лекцію...',
    senderId: senderId,
    sender: sender,
  };
  
  AMPQConnection.sendToQueue(messageToSend);

  ctx.reply('Відправлено повідомлення про початок лекції')
});


let gueue = [];

function checkQueue(teacherData) {
  AMPQConnection.consume(function (msg) {
    gueue.push(msg)
  });

  setInterval(() => {
    const oldQueue = [...gueue];
    gueue = [];

    oldQueue.forEach((msg) => {
      const msgBody = JSON.parse(msg.content.toString());
      console.log("checkQueue:: -> msgBody", msgBody);
      if (msgBody.content.includes('Студетнт присутній')) {
        const studentName = msgBody.sender.first_name;

        AMPQConnection.ack(msg);

        bot.telegram.getMe().then(() => {
          const teacherMessage = 'Вітає з почаком лекції';

          bot.telegram.sendMessage(teacherData.id, `Студент ${studentName} в мережі`);
          studentBot.telegram.sendMessage(msgBody.senderId, `Викладач ${teacherData.first_name} почав віддалену пару і ${teacherMessage}`);
        });
      }
    })

  }, 3 * 60 * 1000);
}

bot.start((ctx) => {
  const message = 'Вітаю! Використовуйте кнопку нижче, щоб відправити повідомлення "Починаю лекцію..."';
  const triggerButton = Markup.button.callback('Починаю лекцію...', 'BOT_start_lecture');
  const keyboard = Markup.inlineKeyboard([triggerButton]).resize();

  const teacher = ctx.update.message.from;
  checkQueue(teacher);

  console.log("BOT:: checkQueue: start");
  console.log("BOT:: -> hello", ctx.message.from.first_name);

  return ctx.reply(message, keyboard);
})

console.log("BOT: launch");

bot.launch();
