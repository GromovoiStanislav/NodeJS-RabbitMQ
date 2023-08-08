require('dotenv').config();
const express = require('express');
const Producer = require('./producer');
const producer = new Producer();

const app = express();
app.use(express.json());

app.post('/sendLog', async (req, res, next) => {
  const { logType, message } = req.body;
  // logType: Info, Error, Warning

  await producer.publishMessage(logType, message);
  res.send();
});

app.listen(3000, () => {
  console.log('Server started...');
});
