const express = require("express");
const router = express.Router();

const checkController = require("../../controllers/checks/checks.controller");
const checkValidator = require("../../validators/checks/checks.validator");
const checkMiddleware = require("../../middlewares/checks/checks.middleware");

const passport = require("passport");

router.post(
  "/addcheck",
  passport.authenticate("jwt", { session: false }),
  checkValidator.checkValidator,
  checkController.addCheck
);

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  checkController.getUsersChecks
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkValidator.checkValidator,
  checkMiddleware.userIsOwner,
  checkController.updateCheck
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkMiddleware.userIsOwner,
  checkController.deleteCheck
);

module.exports = router;
