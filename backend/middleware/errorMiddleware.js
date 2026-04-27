//this middleware catches any error thrown in controllers
//and sends a clean JSON response instead of crashing

const errorHandler = (err, req, res, next) => {
  //if status code is still 200, change to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    //only show full error stack in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = { errorHandler };
