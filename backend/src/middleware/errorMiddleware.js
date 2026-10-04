export const notFound = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === "23505") {
    return res.status(409).json({
      message: "A record with that unique value already exists",
    });
  }

  if (err.code === "23514") {
    return res.status(400).json({
      message: "Database validation failed",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      message: "Referenced record does not exist",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large",
    });
  }

  const statusCode = Number(err.statusCode) || 500;

  res.status(statusCode).json({
    message:
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};
