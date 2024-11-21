const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server berjalan di ${process.env.HOST}:${process.env.PORT}`);
});
