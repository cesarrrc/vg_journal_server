const express = require("express");
const cors = require("cors");
const checkJwt = require("./middleware/checkJwt");

const authRouter = require("./routers/auth");
const { logger } = require("./middleware/logger");

const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger)

app.use(authRouter);

app.get("/", (req, res) => {
  res.json("Welcome to VG Journal");
});
app.get("/private", checkJwt, (req, res) => {
  console.log(req.auth, "auth");
  res.json("Welcome to VG Journal");
});

app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
