function validateInput(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input text");
  }
}

module.exports = { validateInput };
