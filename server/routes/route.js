const express = require("express");
const { hello } = require("../controllers/authController");
const router = express.Router();

// AUTHENTICATION ROUTES
router.get("/hello",hello);

module.exports = router;
