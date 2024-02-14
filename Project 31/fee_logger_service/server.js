require('dotenv').config();
const express = require('express');
const producer = require('./producer');

const app = express();

app.use(express.json());

app.post('/fee-log', async (req, res, next) => {
  const { feeType, message } = req.body;
  await producer.publishMessage(feeType, message);
  res.send('Ok');
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
