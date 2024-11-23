require("dotenv").config();

const server = {
  host: process.env.HOST,
  port: process.env.PORT,
};

module.exports = server;
