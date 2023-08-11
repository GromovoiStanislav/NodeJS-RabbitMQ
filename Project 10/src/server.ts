import { AmqpConnection } from './connection'
import { RpcServer } from './rpc/rpc_server'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  const amqpConnection = new AmqpConnection()

  const connection = await amqpConnection.connect()
  if (!connection) throw new Error('Connection error')
  
  const channel = await amqpConnection.createChannel()

  const queueName = process.env.QUEUE_NAME || 'rpc_queue'

  const rpcServer = new RpcServer({ queueName, channel })
  await rpcServer.run()
}

main()
