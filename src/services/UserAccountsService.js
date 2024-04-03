let fs = require("fs").promises;
let path = require("path");
let userAccountsFile = path.join(
  __dirname,
  "../../data/users/userAccounts.json"
);
let { readJsonFile } = require("../utils/fileUtils");

const addUserAccount = async (userAccount) => {
  let userAccounts = await readJsonFile(userAccountsFile);
  let user = userAccounts.find((user) => user.email === userAccount.email);
  if (user) {
    throw new Error("User already exists");
  }

  userAccounts.push(userAccount);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(userAccountsFile), { recursive: true });
  await fs.writeFile(userAccountsFile, JSON.stringify(userAccounts));
};

const getUserAccount = async (email) => {
  let userAccounts = await readJsonFile(userAccountsFile);
  return userAccounts.find((user) => user.email === email);
};
module.exports = {
  addUserAccount,
  getUserAccount,
};
