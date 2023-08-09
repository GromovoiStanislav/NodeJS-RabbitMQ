const express = require('express');
const Producer = require('./producer');
const producer = new Producer();
const config = require('./config');

const app = express();
app.use(express.json());

app.post('/sendLog', async (req, res, next) => {
  const { logType, message } = req.body;
  // logType: Info, Error, Warning

  await producer.publishMessage(logType, message);
  res.send();
});

app.listen(config.server.PORT, () => {
  console.log('Server started...');
});
