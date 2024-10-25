const express = require("express");
const {
  getAllPostCategories,
  getPostCategories,
  addPostCategories,
  removePostCategory,
} = require("../controllers/postCategories");
const validateUser = require("../utils/middleware/validateUser");

const router = express.Router();

router.get("/all-post-categories", getAllPostCategories);
router.get("/post-categories/:post_id", getPostCategories);

router.use(validateUser);

router.post("/add-post-category/:post_id", addPostCategories);
router.delete("/remove-post-category/:post_category_id", removePostCategory);

module.exports = router;
