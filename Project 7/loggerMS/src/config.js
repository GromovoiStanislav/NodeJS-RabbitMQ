require('dotenv').config();

module.exports = {
  rabbitMQ: {
    url: process.env.AMQP_URL || 'amqp://localhost',
    exchangeName: 'logExchange',
  },
  server: {
    PORT: process.env.PORT || 3000,
  },
};
