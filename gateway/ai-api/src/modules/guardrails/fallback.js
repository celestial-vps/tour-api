function errorHandler(err, req, res, next) {
  console.error("[AI SERVICE ERROR]", err.message);

  res.status(500).json({
    success: false,
    message: "AI service error",
    fallback: true
  });
}

module.exports = { errorHandler };
