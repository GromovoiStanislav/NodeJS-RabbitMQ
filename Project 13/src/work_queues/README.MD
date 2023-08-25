## Work queues

Using RabbitMQ as a work queue; new_task creates a task, and worker processes tasks. Multiple worker process will share the tasks among them. Long-running tasks are simulated by supplying a string with dots, e.g., '...' to new_task. Each dot makes the worker "work" for a second.

```
npm run work_queues:worker
```

```
npm run work_queues:send First message.
npm run work_queues:send Second message..
npm run work_queues:send Third message...
npm run work_queues:send Fourth message....
npm run work_queues:send Fifth message.....
```
