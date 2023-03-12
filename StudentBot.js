const Telegraf = require('telegraf');
const amqp = require('amqplib');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Підключаємося до RabbitMQ
amqp.connect(process.env.RABBITMQ_URL).then(function(conn) {
  // Створюємо канал
  return conn.createChannel().then(function(ch) {
    // Оголошуємо чергу, з якої ми будемо отримувати повідомлення
    const queueName = 'lecture_queue';
    const queueOptions = { durable: true };
    ch.assertQueue(queueName, queueOptions);

    // Встановлюємо таймер на 15 хвилин
    const interval = 15 * 60 * 1000;

    // Функція, яка відправляє повідомлення користувачу Telegram
    function sendTelegramMessage(message) {
      bot.telegram.sendMessage(process.env.USER_ID, message);
    }

    // Функція, яка перевіряє наявність повідомлень у черзі та відправляє їх до користувача Telegram
    function checkQueue() {
      ch.get(queueName, { noAck: true }).then(function(message) {
        if (message !== null) {
          const messageContent = JSON.parse(message.content.toString());
          const senderId = messageContent.senderId;
          const text = messageContent.text;
          const lectureStarted = new Date().toLocaleTimeString();

          const telegramMessage = `Викладач почав віддалену пару із ${lectureStarted}: ${text} ${senderId}`;

          sendTelegramMessage(telegramMessage);
        }
      });
    }

    // Перевіряємо чергу при запуску бота
    checkQueue();

    // Перевіряємо чергу кожні 15 хвилин
    setInterval(checkQueue, interval);

    // Закриваємо канал та з'єднання з RabbitMQ
    return ch.close();
  }).finally(function() { conn.close(); });
}).catch(console.warn);

bot.start((ctx) => ctx.reply('Welcome!'));

bot.launch();