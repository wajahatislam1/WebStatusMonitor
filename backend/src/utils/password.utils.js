const crypto = require("crypto");

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, hashedPassword) => {
      if (err) {
        reject(err);
      }
      resolve(hashedPassword.toString("hex"));
    });
  });
};

const doPasswordsMatch = async (hashedPassword, rawPassword, salt) => {
  newHashedPassword = await hashPassword(rawPassword, Buffer.from(salt,"hex"));

  if (crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(newHashedPassword))) {
    return true;
  }
  return false;
};

module.exports = {
  hashPassword,
  doPasswordsMatch,
};
