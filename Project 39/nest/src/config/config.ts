export default () => ({
  environment: process.env.NODE_ENV,
  database: {
    url: process.env.DB_URL
  },
  server: {
    port: process.env.PORT
  },
  rabbitMQ: {
    host: process.env.AMQP_URL,
    messageExpiration: process.env.TIMEOUT || 15000,
    queues: {
      paymentsRequestQueue: "paymentsRequestQueue",
      cyberSourceRequestQueue: "cyberSourceRequestQueue",
      mpgsRequestQueue: "mpgsRequestQueue",
      testRequestQueue: "testRequestdQueue",
      test2RequestQueue: "test2RequestdQueue"
    }
  }
});