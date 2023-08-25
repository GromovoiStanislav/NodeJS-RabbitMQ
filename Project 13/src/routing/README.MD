## Routing

Using RabbitMQ as a routing ('somecast') mechanism. emit_log_direct sends a log message with a severity, and all receive_logs_direct processes receive log messages for the severities on which they are listening.

```
npm run routing:receive
```

```
npm run routing:emit error "Run. Run. Or it will explode"
npm run routing:emit info Hello
```
