const { errorRes } = require("../utils/response");

function errHandle(err, req, res, next) {
  return errorRes(
    res,
    err.status || 500,
    err.message || "Internal server error."
  );
}

module.exports = errHandle;
