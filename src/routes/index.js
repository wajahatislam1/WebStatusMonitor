const express = require("express");
const router = express.Router();

const userRouter = require("./user/user.routes");
const checkRouter = require("./checks/checks.routes");

router.use("/users", userRouter);
router.use("/checks", checkRouter);

module.exports = router;
