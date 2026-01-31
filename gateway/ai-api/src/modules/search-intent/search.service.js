// src/modules/search-intent/search.service.js
const { callLLM } = require("../llm/llm.service");
const { SEARCH_INTENT_PROMPT } = require("./prompt");

async function parseSearchIntent(text) {
  console.log("[SERVICE] parseSearchIntent input:", text);

  const response = await callLLM({
    systemPrompt: SEARCH_INTENT_PROMPT,
    userPrompt: text
  });

  console.log("[SERVICE] parseSearchIntent response:", response);
  return JSON.parse(response);
}

module.exports = { parseSearchIntent };
