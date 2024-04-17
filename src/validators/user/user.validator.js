const { body, checkExact, checkSchema } = require("express-validator");

const authValidator = checkExact(
  checkSchema({
    email: {
      in: ["body"],
      isEmail: {
        errorMessage: "Invalid email",
      },
      exists: {
        errorMessage: "Email is required",
      },
    },
    password: {
      in: ["body"],
      isStrongPassword: {
        errorMessage:
          "Password must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
      },
      exists: {
        errorMessage: "Password is required",
      },
    },
  })
);

const updateUserValidator = checkSchema({
  name: {
    optional: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "Name must not be empty",
    },
  },
  newPassword: {
    optional: true,
    isStrongPassword: {
      errorMessage:
        "Password must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    },
  },
  previousPassword: {
    custom: {
      options: (value, { req }) => {
        if (req.body.password && !value) {
          throw new Error("Previous password must be specified when updating password");
        }
        return true;
      },
    },
  },
  confirmedPassword: {
    custom: {
      options: (value, { req }) => {
        if (req.body.password && !value) {
          throw new Error("Confirmed password is required when updating password");
        }
        if (req.body.password && value !== req.body.password) {
          throw new Error("Confirmed password does not match new password");
        }
        return true;
      },
    },
  },
});

module.exports = {
  authValidator,
  updateUserValidator,
};
