const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: err.errors[0].message });
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
