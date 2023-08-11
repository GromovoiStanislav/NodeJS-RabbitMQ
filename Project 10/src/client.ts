import 'dotenv/config';
import { AmqpConnection } from './connection';
import { RpcClient } from './rpc/rpc_client';

async function main() {
  const amqpConnection = new AmqpConnection();

  const connection = await amqpConnection.connect();
  if (!connection) {
    throw new Error('Connection error');
  }

  const channel = await amqpConnection.createChannel();

  const queueName = process.env.QUEUE_NAME || 'rpc_queue';

  const rpcClient = new RpcClient({ queueName, connection, channel });
  await rpcClient.run(process.argv[2]);
}

main();
