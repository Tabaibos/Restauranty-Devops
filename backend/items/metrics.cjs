// metrics.js
const client = require('prom-client');
const Dietary = require('./models/dietary.model');
const Item = require('./models/Item.model');

// Create a gauge to track the total number of dietaries.
const dietariesCountGauge = new client.Gauge({
  name: 'dietaries_total',
  help: 'Total number of dietaries',
});

// Create a gauge to track the total number of items.
const itemsCountGauge = new client.Gauge({
  name: 'items_total',
  help: 'Total number of items',
});

// Function to query and update dietary count
async function updateDietaryCount() {
  try {
    const count = await Dietary.countDocuments();
    dietariesCountGauge.set(count);
  } catch (error) {
    console.error('Error updating dietaries count:', error);
  }
}

// Function to query and update item count
async function updateItemCount() {
  try {
    const count = await Item.countDocuments();
    itemsCountGauge.set(count);
  } catch (error) {
    console.error('Error updating items count:', error);
  }
}

// Start periodic updates (e.g., every minute)
const UPDATE_INTERVAL_MS = 60000; // one minute
setInterval(updateDietaryCount, UPDATE_INTERVAL_MS);
setInterval(updateItemCount, UPDATE_INTERVAL_MS);

updateDietaryCount();
updateItemCount();

// Overall HTTP requests counter without labels.
const totalHttpRequestsCounter = new client.Counter({
  name: 'http_requests_overall_total',
  help: 'Overall total number of HTTP requests',
});

// Counter with labels for detailed HTTP request tracking.
const httpRequestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests with labels',
  labelNames: ['method', 'route', 'statusCode'],
});

// Express middleware to update both HTTP requests counters.
function httpMetricsMiddleware(req, res, next) {
  res.on('finish', () => {
    const method = req.method;
    const route = req.originalUrl || req.url;
    const statusCode = res.statusCode.toString();

    // Increment the detailed counter.
    httpRequestsCounter.labels(method, route, statusCode).inc();

    // Increment the overall counter.
    totalHttpRequestsCounter.inc();
  });
  next();
}

module.exports = {
  httpMetricsMiddleware,
};