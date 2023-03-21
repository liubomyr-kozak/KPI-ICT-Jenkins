require('dotenv').config();
const amqp = require("amqp-connection-manager");


const rabbitmqHost = process.env.RABBITMQ_PROD_URL || '0.0.0.0';

console.log(":: -> rabbitmqHost", rabbitmqHost);

const connection = amqp.connect([`amqp://guest:guest@${rabbitmqHost}`]);

connection.connect((connection, url) => {
  console.log('AMQP connected', connection, url);
});

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const channel = connection.createChannel({
  json: true,
  setup: function (channel) {
    return channel.assertQueue('RMQ_lecture_queue', {
      durable: true, // Зробити чергу стійкою до перезавантаження сервера
      autoDelete: false // Не видаляти чергу автоматично, коли вона буде порожньою
    });
  }
});

const channelReady = new Promise((resolve, reject) => {
  channel.on('connect', function () {
    resolve(channel);
  });

  channel.on('error', function (err) {
    console.error('AMQP channel error:', err.stack);
    reject();
    connection.close();
  });
})

module.exports = {
  sendToQueue: async (message) => {
    const newCh = await channelReady;
    newCh.sendToQueue('RMQ_lecture_queue', message)
  },
  consume: async (callback) => {
    const newCh = await channelReady;
    newCh.consume('RMQ_lecture_queue', (msg) => {
      const message = JSON.parse(msg.content.toString());
      if (message !== null) {
        callback(message, newCh);
      }
    });
  },
  get: async (callBackFn) => {
    const newCh = await channelReady;

    const msg = await newCh.get('RMQ_lecture_queue', { json: true, noAck: true })

    console.log("exports::get -> msg", msg);

    if (msg === false) {
      return;
    }

    const messageContent = msg.content.toString();

    console.log("exports::get -> messageContent", messageContent);

    if (!isValidJSON(messageContent)) {
      return;
    }

    callBackFn(msg);
  }
};