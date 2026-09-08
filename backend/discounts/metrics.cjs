// metrics.js
const client = require('prom-client');
const Campaigns = require('./models/campaigns.model');
const Coupons = require('./models/coupons.model');

// Create a gauge to track the total number of campaigns.
const campaignsCountGauge = new client.Gauge({
  name: 'campaigns_total',
  help: 'Total number of campaigns',
});

// Create a gauge to track the total number of coupons.
const couponsCountGauge = new client.Gauge({
  name: 'coupons_total',
  help: 'Total number of coupons',
});

// Function to query and update user count
async function updateCampaignsCount() {
  try {
    const count = await Campaigns.countDocuments();
    campaignsCountGauge.set(count);
  } catch (error) {
    console.error('Error updating campaigns count:', error);
  }
}

// Function to query and update coupons count
async function updateCouponsCount() {
  try {
    const count = await Coupons.countDocuments();
    couponsCountGauge.set(count);
  } catch (error) {
    console.error('Error updating coupons count:', error);
  }
}

// Start periodic updates (e.g., every minute)
const UPDATE_INTERVAL_MS = 60000; // one minute
setInterval(updateCampaignsCount, UPDATE_INTERVAL_MS);
setInterval(updateCouponsCount, UPDATE_INTERVAL_MS);

updateCampaignsCount();
updateCouponsCount();

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