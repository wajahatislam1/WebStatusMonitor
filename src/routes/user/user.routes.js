const express = require("express");
const router = express.Router();
const passport = require("passport");
const userAccountController = require("../../controllers/user/user.controller");
const userValidator = require("../../validators/user/user.validator");

router.post("/signup", userValidator.authValidator, userAccountController.addUserAccount);

router.post(
  "/signin/local",
  passport.authenticate("local", { session: false }),
  userValidator.authValidator,
  userAccountController.signInUser
);

router.get("/signin/google", passport.authenticate("google", { session: false }));

router.get(
  "/signin/google/callback",
  passport.authenticate("google", { session: false }),
  userAccountController.signInUser
);

router.get(
  "/signout",
  passport.authenticate("jwt", { session: false }),
  userAccountController.signOutUser
);

router.put(
  "/",
  [passport.authenticate("jwt", { session: false }), userValidator.updateUserValidator],
  userAccountController.updateUserAccount
);
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  userAccountController.deleteUserAccount
);

router.get("/tokenValid", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.status(200).send("Token is valid, and your request is Authorized.");
});

module.exports = router;
