import amqp from 'amqplib';

// Define configuration options
const RABBITMQ_HOST = 'localhost';
const RABBITMQ_PORT = '5672';
const RABBITMQ_USERNAME = 'username';
const RABBITMQ_PASSWORD = 'password';
const RABBITMQ_VHOST = 'myhost';

// Define connection URL
// const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VHOST}`;
const RABBITMQ_URL = process.env.AMQP_URL;

class RabbitMQConfig {
  constructor() {
    this.channel = null;
  }

  async connect() {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      this.channel = await conn.createChannel();
      console.log(`✅ Connected to RabbitMQ server at ${RABBITMQ_URL}`);
    } catch (error) {
      console.log(
        `❌ Failed to connect to RabbitMQ server at ${RABBITMQ_URL}: ${error}`
      );
      //throw error;
    }
  }

  async createQueue(queueName, options) {
    try {
      await this.channel.assertQueue(queueName, options);
      console.log(`✅ Create a Queue ${queueName}`);
    } catch (error) {
      console.log(`❌ Failed to create Queue ${queueName}: ${error}`);
      //throw error;
    }
  }

  async publishToQueue(queueName, message) {
    await this.channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`✅  Send Message to ${queueName}`);
  }

  async subscribeToQueue(queueName, callback, options) {
    await this.channel.consume(
      queueName,
      (msg) => {
        const message = msg.content.toString();
        callback(message);
        this.channel.ack(msg);
      },
      options
    );
  }

  async close() {
    await this.channel.close();
  }
}

export default RabbitMQConfig;
