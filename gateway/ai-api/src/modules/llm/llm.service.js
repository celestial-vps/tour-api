// src/llm/llm.service.js
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { MODEL_NAME } = require("../config/ai.config");

async function callLLM({ systemPrompt, userPrompt }) {
  try {
    console.log("[LLM INPUT] systemPrompt:", systemPrompt);
    console.log("[LLM INPUT] userPrompt:", userPrompt);

    const res = await client.responses.create({
      model: MODEL_NAME,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    console.log("[LLM OUTPUT]", res.output_text);
    return res.output_text;
  } catch (err) {
    console.error("[LLM ERROR]", err);
    throw err; // biar fallback di controller aktif
  }
}

module.exports = { callLLM };
