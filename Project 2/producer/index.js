import 'dotenv/config';
import express from 'express';
import constrollers from './controller.js';

const app = express();
app.use(express.json());

app.post('/api/send', constrollers.sendMessageToRedis);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
