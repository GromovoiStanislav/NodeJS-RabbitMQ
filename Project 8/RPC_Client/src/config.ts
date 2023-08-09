import 'dotenv/config';

export default {
  rabbitMQ: {
    url: process.env.AMQP_URL || 'amqp://localhost',
    queues: {
      rpcQueue: 'rpc_queue',
    },
  },
};
