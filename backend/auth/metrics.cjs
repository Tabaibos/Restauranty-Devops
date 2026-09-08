const client = require('prom-client');
const User = require('./models/User.model');

// Create a gauge to track the total number of users.
const userCountGauge = new client.Gauge({
  name: 'users_total',
  help: 'Total number of users',
});

// Function to query and update user count
async function updateUserCount() {
  try {
    const count = await User.countDocuments();
    userCountGauge.set(count);
  } catch (error) {
    console.error('Error updating user count:', error);
  }
}

// Start periodic updates (e.g., every minute)
const UPDATE_INTERVAL_MS = 60000; // one minute
setInterval(updateUserCount, UPDATE_INTERVAL_MS);

updateUserCount();

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