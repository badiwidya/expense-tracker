require("dotenv").config();

const accessToken = {
  token: process.env.SECRET_TOKEN,
  expiresIn: "15m",
};
const refreshToken = {
  token: process.env.SECRET_REFRESH_TOKEN,
  expiresIn: "7d",
};

module.exports = { accessToken, refreshToken };
