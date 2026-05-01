const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    return res.status(400).json({ message });
  }

  // Sequelize duplicate key
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Duplicate field value entered' });
  }

  // Sequelize database error (e.g. invalid UUID format)
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ message: 'Resource not found or invalid format' });
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
