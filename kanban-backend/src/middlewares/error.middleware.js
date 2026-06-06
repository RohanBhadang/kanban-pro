import { ApiError } from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = err.message || "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export { errorMiddleware };
