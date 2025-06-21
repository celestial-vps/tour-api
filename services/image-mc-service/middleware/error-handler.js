const multer = require('multer');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(e => e.message);
    return res.status(409).json({ error: messages.join(', ') });
  }

  if (err.name === 'CustomError') {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }

  return res.status(500).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
