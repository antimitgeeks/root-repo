require("dotenv").config();
const { join } = require("path");
const { readFileSync } = require("fs");
const express = require("express");
const serveStatic = require("serve-static");
const { shopify } = require("./shopify.js");
const bodyParser = require("body-parser");
const PrivacyWebhookHandlers = require("./privacy.js");
const { dbConnection } = require(`./server/config/db.js`);
const routes = require(`./server/routes/index.js`);
const { authenticateUser } = require(`./server/middlewares/auth.middleware.js`);
const http = require("http");
const cors = require("cors");

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);
const STATIC_PATH = process.env.NODE_ENV === "production"
  ? join(process.cwd(), "frontend", "dist")
  : join(process.cwd(), "frontend");

// Initialize Express App
const app = express();

// Connect to Database
dbConnection();

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Shopify Authentication and Webhooks
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

// Verify Shopify Webhooks
app.use(
  shopify.config.webhooks.path,
  bodyParser.raw({ type: "application/json" }),
  (req, res, next) => {
    const crypto = require("crypto"); // Moved inside for better modularity
    const hmac = req.headers["x-shopify-hmac-sha256"];
    const genHash = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET || "c5052ef489304008b4f280e02104161f")
      .update(req.body, "utf8")
      .digest("base64");

    if (genHash !== hmac) {
      return res.status(401).send("Couldn't verify incoming Webhook request!");
    }
    next();
  }
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// Middleware Configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// API Routes with Authentication
app.use("/api/*", shopify.validateAuthenticatedSession(), authenticateUser);
app.use("/api", routes);
app.use("/external/*", authenticateUser);
app.use("/external/", routes);

// Serve Static Files 
app.use(serveStatic(STATIC_PATH, { index: false }));

// Shopify Content Security Policy Headers
app.use(shopify.cspHeaders());

// Catch-All Route to Serve the Frontend
app.use("/*", shopify.ensureInstalledOnShop(), async (req, res, next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
},);

// Start the HTTP Server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`--- Server running on port ${PORT} ---`);
});
