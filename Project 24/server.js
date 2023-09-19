require('dotenv').config();
const express = require('express');
const fibQueue = require('./queues/fib-queue');

const app = express();

app.get('/fib', async (request, response) => {
  let num = request.query.number;
  fibQueue(num);
  response.send(
    '<h3>The request has been received successfully! We will send an email once your calculation is ready!</h3>'
  );
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () =>
  console.log(`Express App is running on PORT:${PORT}. To exit press CTRL+C`)
);
