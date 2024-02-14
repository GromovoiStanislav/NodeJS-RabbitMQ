export default {
    rabbitMQ: {
        url: process.env.AMQP_URL || 'amqp://localhost:6572',
        queues: {
            rpcQueue: process.env.QUEUE_NAME || 'rpc_queue',
        },
    },
};
