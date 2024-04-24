const { body } = require("express-validator");

const { checkSchema, checkExact } = require("express-validator");

const checkValidator = checkExact(
  checkSchema({
    checkUrl: {
      in: ["body"],
      isURL: {
        options: {
          protocols: ["http", "https"],
          require_tld: true,
          require_protocol: true,
        },
        errorMessage: "Invalid URL",
      },
      exists: {
        errorMessage: "Check URL is required",
      },
    },
  })
);


module.exports = {
  checkValidator,
};
