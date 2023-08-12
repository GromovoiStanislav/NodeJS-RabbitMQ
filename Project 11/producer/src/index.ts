import 'dotenv/config';
import express from 'express';
import './services/amqp';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
