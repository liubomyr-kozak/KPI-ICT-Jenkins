const Telegraf = require('telegraf');
const amqp = require('amqplib');

const bot = new Telegraf(process.env.TEACHER_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome!'));

bot.on('text', (ctx) => {
  const message = ctx.update.message.text;
  const senderId = ctx.update.message.from.id;
  if (message.includes('Починаю лекцію...')) {
    // Підключаємося до RabbitMQ
    amqp.connect(process.env.RABBITMQ_URL).then(function(conn) {
      // Створюємо канал
      return conn.createChannel().then(function(ch) {
        // Оголошуємо чергу, яку ми будемо відправляти повідомлення
        const queueName = 'lecture_queue';
        const queueOptions = { durable: true };
        ch.assertQueue(queueName, queueOptions);

        // Формуємо повідомлення, яке будемо відправляти до черги
        const messageToSend = {
          text: message,
          senderId: senderId,
        };

        // Відправляємо повідомлення до черги
        const messageString = JSON.stringify(messageToSend);
        ch.sendToQueue(queueName, Buffer.from(messageString), { persistent: true });
        console.log("Sent message to RabbitMQ: %s", messageString);

        // Закриваємо канал та з'єднання з RabbitMQ
        return ch.close();
      }).finally(function() { conn.close(); });
    }).catch(console.warn);
  }
});

bot.launch();