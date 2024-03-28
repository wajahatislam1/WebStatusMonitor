const crypto = require("crypto");

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      100000,
      64,
      "sha512",
      (err, hashedPassword) => {
        if (err) {
          reject(err);
        }
        resolve(hashedPassword.toString("hex"));
      }
    );
  });
};

module.exports = {
  hashPassword,
};
