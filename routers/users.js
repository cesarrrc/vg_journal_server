const express = require("express");
const userController = require("../controllers/users");
const checkJwt = require("../middleware/checkJwt");
const validateUser = require("../middleware/validateUser");

const router = express.Router();

router.get("/get-profile", checkJwt, userController.getProfile);

module.exports = router;

// router.get("/validate-user", validateUser);