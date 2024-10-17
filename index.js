const express = require("express");

const app = express();

const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.json("Welcome to VG Journal");
});

app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
