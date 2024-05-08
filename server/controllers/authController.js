const { User } = require("../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectDb } = require("../db/connection");

const login = async (req, res) => {};
const signup = async (req, res) => {};
const checkAuth = async (req, res) => {};

module.exports = { login };
