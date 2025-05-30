const express = require('express');
const client = require('prom-client');

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000]
});

app.get('/', (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.send('Hello World!');
  console.log(`Request received on / at ${new Date().toISOString()}`);
  end({ method: req.method, route: req.route.path, code: 200 });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sample app listening on port ${port}`);
});

