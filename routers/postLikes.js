const express = require("express");
const {
  getAllLikes,
  getPostLikes,
  likePost,
  removeLike,
  getUserLikes,
} = require("../controllers/postLikes");
const checkJwt = require("../utils/middleware/checkJwt");
const validateUser = require("../utils/middleware/validateUser");

const router = express.Router();

router.get("/all-likes", getAllLikes);
router.get("/all-post-likes/:post_id", getPostLikes);
router.get("/all-user-likes/:user_id", getUserLikes);

router.use(validateUser);

router.post("/like-post/:post_id", likePost);
router.delete("/remove-post-like/:post_id", removeLike);

module.exports = router;
