const express = require("express");
const postsController = require("../controllers/posts");
const checkJwt = require("../utils/middleware/checkJwt");
const validateUser = require("../utils/middleware/validateUser");

const router = express.Router();

router.get("/get-posts", postsController.getAllPosts);
router.get("/get-post/:post_id", postsController.getPostById);
router.get("/get-posts/:user_id", postsController.getPostsByUserId);

router.use(validateUser);

router.get("/get-user-posts/", postsController.getUserPosts);

router.post("/create-post", postsController.createPost);
router.put("/edit-post/:post_id", postsController.editPost);
router.delete("/delete-post/:post_id", postsController.deletePost);

module.exports = router;

// router.get("/validate-user", validateUser);
