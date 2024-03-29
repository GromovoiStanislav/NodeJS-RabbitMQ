const amqp = require('amqplib');

const rabbitMQ = {
  url: process.env.AMQP_URL || 'amqp://localhost:5672',
  exchangeName: 'feeExchange',
};

class Producer {
  static instance;
  channel;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Producer();
    }
    return this.instance;
  }

  async createChannel() {
    const connection = await amqp.connect(rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey, message) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, 'direct');

    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };
    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
      `A new ${routingKey} fee have been detected and sent to ${exchangeName}`
    );
  }
}

module.exports = Producer.getInstance();
