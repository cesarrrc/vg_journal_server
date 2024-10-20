const express = require("express");
var cors = require("cors");

const authRouter = require("./routers/auth");

const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use(authRouter);

app.get("/", (req, res) => {
  res.json("Welcome to VG Journal");
});

app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
