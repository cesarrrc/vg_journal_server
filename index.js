const express = require("express");
const cors = require("cors");
const checkJwt = require("./utils/middleware/checkJwt");
const { logger } = require("./utils/middleware/logger");

const authRouter = require("./routers/auth");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const postLikes = require("./routers/postLikes");
const postCategories = require("./routers/postCategories");
const postCommentRouter = require("./routers/postComments");
const connection = require("./utils/sql/connection");

const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/likes", postLikes);
app.use("/post-categories", postCategories);
app.use("/post-comment", postCommentRouter);

app.get("/", (req, res) => {
  res.json("Welcome to VG Journal");
});
app.get("/private", checkJwt, (req, res) => {
  console.log(req.auth, "auth middle");
  res.json("Welcome to VG Journal");
});
app.post("/new-comment", (req, res) => {
  console.log(req.auth, "auth middle");
  connection.query(
    `INSERT INTO user_comments (user_id, comment) VALUES('18', 'this is a test comment'); INSERT INTO post_comments (post_id, comment_id) VALUES(LAST_INSERT_ID(), '33');`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.json(results);
      }
      res.json(results);
    }
  );
  res.json("Welcome to VG Journal");
});

app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
