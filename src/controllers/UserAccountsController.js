const userAccountService = require("../services/UserAccountsService");
const passwordUtils = require("../utils/passwordUtils");
const crypto = require("crypto");

const addUserAccount = async (req, res) => {
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
  };

  // Calling the service to add the user account
  try {
    userAccountService.addUserAccount(accountInfo);
    res.status(201).send("User account created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addUserAccount,
};
