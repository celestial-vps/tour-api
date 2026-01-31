const express = require("express");
const routes = require("./routes");
const { errorHandler } = require("./modules/guardrails/fallback");

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "ai-service" });
});

app.use("/", routes);
app.use(errorHandler);

module.exports = app;
