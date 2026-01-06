// src/server.js
const { loadEnv } = require("./modules/config/env");
loadEnv();  // HARUS sebelum import llm.client

const app = require("./app");

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`[AI-SERVICE] running on port ${PORT}`));
