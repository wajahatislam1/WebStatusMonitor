const express = require("express");
const router = express.Router();

const userRouter = require("./user/user.routes");

router.use("/users", userRouter);

module.exports = router;
