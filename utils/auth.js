const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = require("../config/authConf");
require("dotenv").config();

function verifyToken(token, type) {
  const secretToken =
    type === "refresh" ? refreshToken.token : accessToken.token;
  return jwt.verify(token, secretToken);
}

function generateToken(userId, username, roles, type) {
  if (type === "access") {
    return jwt.sign(
      {
        id: userId,
        username: username,
        role: roles,
      },
      accessToken.token,
      {
        expiresIn: accessToken.expiresIn,
      }
    );
  } else if (type === "refresh") {
    return jwt.sign(
      {
        id: userId,
        username: username,
        role: roles,
      },
      refreshToken.token,
      {
        expiresIn: refreshToken.expiresIn,
      }
    );
  }
}

module.exports = { generateToken, verifyToken };
