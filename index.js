const express = require("express");
const app = express();
require('dotenv').config();


app.listen(process.env.PORT, () => {
  console.log(`Server berjalan di ${process.env.HOST}:${process.env.PORT}`);
});
