const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
