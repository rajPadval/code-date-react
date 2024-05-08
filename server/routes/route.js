const express = require("express");
const router = express.Router();

// AUTHENTICATION ROUTES
router.get("/hello", (req, res) =>
  res.send("<center> <h1>Hello world</h1> </center>")
);

module.exports = router;
