const express = require("express");
const router = express.Router();

const userAccountController = require("../controllers/UserAccountsController");

router.post("/signup", userAccountController.addUserAccount);

module.exports = router;
