const express = require("express");
const postsController = require("../controllers/postCategories");
const checkJwt = require("../utils/middleware/checkJwt");
const validateUser = require("../utils/middleware/validateUser");

const router = express.Router();
module.exports = router;
