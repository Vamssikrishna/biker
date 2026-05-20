export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  const status = error.statusCode || res.statusCode || 500;
  const message = error.message || "Something went wrong";
  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
}
