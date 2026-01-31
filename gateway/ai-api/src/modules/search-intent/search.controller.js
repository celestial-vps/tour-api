// src/modules/search-intent/search.controller.js
const searchService = require("./search.service");
const { validateInput } = require("../../modules/guardrails/validation");

async function parse(req, res, next) {
  try {
    const { text } = req.body;
    validateInput(text);

    // memanggil service
    const result = await searchService.parseSearchIntent(text);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("[AI SERVICE ERROR]", err);
    res.json({
      success: false,
      message: "AI service error",
      fallback: true
    });
  }
}

module.exports = { parse };
