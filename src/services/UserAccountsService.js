let fs = require("fs");
let path = require("path");
let userAccountsFile = path.join(__dirname, "../../data/userAccounts.json");

const addUserAccount = (userAccount) => {
  let userAccounts = [];
  if (
    fs.existsSync(userAccountsFile) &&
    fs.statSync(userAccountsFile).size > 0
  ) {
    userAccounts = JSON.parse(fs.readFileSync(userAccountsFile));
  }

  //checking if the user already exists
  let user = userAccounts.find((user) => user.email === userAccount.email);
  if (user) {
    throw new Error("User already exists");
  }

  userAccounts.push(userAccount);
  fs.writeFileSync(userAccountsFile, JSON.stringify(userAccounts));
};

const getUserAccount = (email) => {
  let userAccounts = [];
  if (
    fs.existsSync(userAccountsFile) &&
    fs.statSync(userAccountsFile).size > 0
  ) {
    userAccounts = JSON.parse(fs.readFileSync(userAccountsFile));
  }

  return userAccounts.find((user) => user.email === email);
};

module.exports = {
  addUserAccount,
  getUserAccount,
};
