// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const cors = require('cors');
const client = require("prom-client");
const { httpMetricsMiddleware } = require('./metrics.cjs');
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(httpMetricsMiddleware);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

require('./metrics.cjs');
client.collectDefaultMetrics();

app.get("/api/auth", (req, res, next) => {
    res.json("Auth Server UP!");
});

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const UsersRoutes = require("./routes/users.routes");
app.use("/api/auth/users", UsersRoutes);

// Expose /metrics endpoint for Prometheus to scrape metrics
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        const metrics = await client.register.metrics();
        res.end(metrics);
    } catch (ex) {
        res.status(500).end(ex);
    }
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
