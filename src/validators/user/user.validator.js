const { body } = require("express-validator");

const signupValidators = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
];

module.exports = {
  signupValidators,
};
