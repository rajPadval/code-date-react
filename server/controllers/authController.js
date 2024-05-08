const { User } = require("../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectDb } = require("../db/connection");

const login = async (req, res) => {};
const signup = async (req, res) => {};
const checkAuth = async (req, res) => {};

const hello = async (req, res) => {
  const token = jwt.sign({ id: "1234" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token);
  return res.send(
    "<center><h1>Cookie sent please check the application tab</h1></center>"
  );
};

module.exports = { login, hello };
