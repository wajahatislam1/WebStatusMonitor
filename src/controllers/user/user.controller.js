const userAccountService = require("../../services/user/user.service");
const passwordUtils = require("../../utils/password.utils");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../configs/env.config");
const uuid = require("uuid");

const { validationResult } = require("express-validator");

const addUserAccount = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const salt = crypto.randomBytes(16);
  const hashedPassword = await passwordUtils.hashPassword(req.body.password, salt);

  // creating the account info object
  userAccount = {
    id: uuid.v4(),
    email: req.body.email,
    password: hashedPassword,
    salt: salt.toString("hex"),
    source: "local",
  };

  // Calling the service to add the user account
  try {
    await userAccountService.addUserAccount(userAccount);
    res.status(201).send("User account created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signInUser = async (req, res) => {
  const user = req.user;
  const token = jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: "1h" });

  try {
    await userAccountService.addToken(user.id, token);
    res.status(200).send({ token });
  } catch (erorr) {
    console.error("Error in storing token: ", error);
    res.status(500).send("Internal server error");
  }
};

const signOutUser = async (req, res) => {
  const user = req.user;
  const token = req.headers.authorization.split(" ")[1];

  try {
    await userAccountService.removeToken(user.id, token);
    res.status(200).send("User signed out successfully");
  } catch (error) {
    console.error("Error in signing out user: ", error);
    res.status(500).send("Internal server error");
  }
};

const updateUserAccount = async (req, res) => {
  //Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let accountInfo = req.body;
  const user = req.user;

  // Check if no fields are provided to update
  if (!accountInfo.name && !accountInfo.password) {
    return res.status(400).send("No fields to update");
  }

  // Check if password is provided
  if (accountInfo.password) {
    //verify if previous password is provided
    if (
      !(await passwordUtils.doPasswordsMatch(
        user.password,
        accountInfo.previousPassword,
        user.salt
      ))
    ) {
      return res.status(400).send("Invalid previous password");
    }

    const salt = crypto.randomBytes(16);
    const hashedPassword = await passwordUtils.hashPassword(accountInfo.password, salt);
    accountInfo.password = hashedPassword;
    accountInfo.salt = salt.toString("hex");
  }

  try {
    await userAccountService.updateUserAccount(user.id, accountInfo);
    res.status(200).send("User account updated successfully");
  } catch (error) {
    console.error("Error in updating user account: ", error);
    res.status(500).send(`Failed to update user account: ${error.message}`);
  }
};

const deleteUserAccount = async (req, res) => {
  const user = req.user;

  try {
    await userAccountService.deleteUserAccount(user.id);
    res.status(200).send("User account deleted successfully");
  } catch (error) {
    console.error("Error in deleting user account: ", error);
    res.status(500).send(`Failed to delete user account: ${error.message}`);
  }
};

module.exports = {
  addUserAccount,
  signInUser,
  signOutUser,
  updateUserAccount,
  deleteUserAccount,
};
