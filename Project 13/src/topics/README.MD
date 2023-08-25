## Topics

Extends the "routing-direct" to routing with wildcarded patterns.

```
npm run topics:receive "#" //To receive all the logs
npm run topics:receive "kernel.*" //To receive all logs from the facility "kernel"
npm run topics:receive "*.critical" //To receive only about "critical" logs
npm run topics:receive "kernel.*" "*.critical" //can create multiple bindings
```

```
npm run topics:emit "anather" "Another error"
npm run topics:emit "anather.critical" "Another critical error"
npm run topics:emit "kernel.anather" "Kernel anather error"
npm run topics:emit "kernel.critical" "Kernel critical error"
```
