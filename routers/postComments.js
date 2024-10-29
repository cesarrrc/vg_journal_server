const express = require("express");
const {
  getAllPostComments,
  getAllCommentsForAPost,
  addPostComment,
  removePostComment,
} = require("../controllers/postComments");
const validateUser = require("../utils/middleware/validateUser");

const router = express.Router();

router.get("/all-post-comments", getAllPostComments);
router.get("/post-comments/:post_id", getAllCommentsForAPost);

router.use(validateUser);

router.post("/add-post-comment/:post_id", addPostComment);
router.delete("/remove-post-comment/:comment_id", removePostComment);

module.exports = router;
