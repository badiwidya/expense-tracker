const { verifyToken } = require("../utils/auth");
const { accessToken } = require("../config/authConf");
const { errorRes, successRes } = require("../utils/response");

function authenticate(req, res, next) {
  const authheaders = req.headers.authorization;

  if (!authheaders || !authheaders.startsWith("Bearer ")) {
    return errorRes(res, 401, "Unaothorized.");
  }
  const token = authheaders.split(" ")[1];
  try {
    const decode = verifyToken(token, "access");
    req.user = decode;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorRes(res, 401, "Unauthorized: Token has expired.");
    } else if (err.name === "JsonWebTokenError") {
      return errorRes(res, 403, "Forbidden: Token is invalid.");
    } else {
      return errorRes(res, 500, "Internal server error.");
    }
  }
}

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return errorRes(res, 403, "Forbidden: access is denied.");
    }
    next();
  };
}

module.exports = { authenticate, authorize };
