const express = require("express");
const { hello } = require("../controllers/authController");
const router = express.Router();

// AUTHENTICATION ROUTES
router.post("/hello",hello);

module.exports = router;
