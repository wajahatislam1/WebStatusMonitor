const userAccountService = require("../services/UserAccountsService");
const passwordUtils = require("../utils/passwordUtils");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { JWT_SECRET_KEY } = require("../configs/envConfig");

const addUserAccount = async (req, res) => {
  //validating the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const salt = crypto.randomBytes(16);
  // Hashing the password
  const hashedPassword = await passwordUtils.hashPassword(
    req.body.password,
    salt
  );

  // creating the account info object
  accountInfo = {
    email: req.body.email,
    password: hashedPassword,
    salt: salt.toString("hex"),
    source: "local",
  };

  // Calling the service to add the user account
  try {
    await userAccountService.addUserAccount(accountInfo);
    res.status(201).send("User account created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signInUser = async (req, res) => {
  const user = req.user;
  const token = jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: "1h" });
  res.status(200).send({ token });
};

module.exports = {
  addUserAccount,
  signInUser,
};
