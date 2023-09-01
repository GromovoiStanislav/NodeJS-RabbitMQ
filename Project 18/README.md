## RabbitMQ callback-api examples (JS)

### Example simple queues

```
npm run hello:recieve
npm run hello:send
```

### Example simple queues

```
npm run work_queues:consume

npm run work_queues:send First message.
npm run work_queues:send Second message..
npm run work_queues:send Third message...
npm run work_queues:send Fourth message....
npm run work_queues:send Fifth message.....
```

### Example RPC with simple queues

```
npm run rpc:server
npm run rpc:client 30
```

### Exchange fanout

```
npm run fanout:receive
npm run fanout:emit message
```

### Exchange headers

```
npm run headers:all
npm run headers:any
npm run headers:emit
```

### Exchange direct

```
npm run direct:receive error
npm run direct:receive info warning error

npm run direct:emit error "Ops..."
npm run direct:emit info Hello
```

### Exchange topic

```
npm run topic:receive "#" //To receive all the logs
npm run topic:receive "kernel.*" //To receive all logs from the facility "kernel"
npm run topic:receive "*.critical" //To receive only about "critical" logs
npm run topic:receive "kernel.*" "*.critical" //can create multiple bindings

npm run topic:emit "anather" "Another error"
npm run topic:emit "anather.critical" "Another critical error"
npm run topic:emit "kernel.anather" "Kernel anather error"
npm run topic:emit "kernel.critical" "Kernel critical error"
```
