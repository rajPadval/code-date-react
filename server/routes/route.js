const express = require("express");
const { login, signup, checkAuth } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  getFromFav,
  getUsers,
  addToDis,
  addToFav,
} = require("../controllers/userController");
const router = express.Router();

// AUTHENTICATION ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.get("/checkAuth", verifyToken, checkAuth);

// USER ROUTES
router.get("/getUsers", getUsers);
router.put("/addToFav/:id", verifyToken, addToFav);
router.put("/addToDis/:id", verifyToken, addToDis);
router.get("/getFromFav", verifyToken, getFromFav);

module.exports = router;
