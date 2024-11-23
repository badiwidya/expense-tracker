const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const errHandle = require("./middlewares/errorHandling");
const dataRoutes = require("./routes/dataRoutes");
const { authenticate } = require("./middlewares/authValidate");
const server = require("./config/serverConf")

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", authenticate, (req, res) => {
  res.send("Anjay");
});

app.use("/api", userRoutes);
app.use("/api", dataRoutes);

app.use(errHandle);

app.listen(server.port, () => {
  console.log(`Server berjalan di ${server.host}:${server.port}`);
});
