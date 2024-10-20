const express = require("express");
const userController = require("../controllers/users");
const checkJwt = require("../utils/middleware/checkJwt");
// const validateUser = require("../utils/middleware/validateUser");

const router = express.Router();

router.get("/get-profile", checkJwt, userController.getProfile);

module.exports = router;

// router.get("/validate-user", validateUser);
