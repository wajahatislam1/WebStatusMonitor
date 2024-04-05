let fs = require("fs").promises;
let path = require("path");
let userAccountsFile = path.join(__dirname, "../../../data/users/userAccounts.json");
let { readJsonFile } = require("../../utils/file.utils");
let tokensFilePath = path.join(__dirname, "../../../data/users/tokens.json");

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

const deleteUserAccount = async (email) => {
  //Removing the user's account
  let userAccounts = await readJsonFile(userAccountsFile);
  let updatedUsers = userAccounts.filter((user) => user.email !== email);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(userAccountsFile), { recursive: true });
  await fs.writeFile(userAccountsFile, JSON.stringify(updatedUsers));

  //Removing the user's tokens
  let allTokens = await readJsonFile(tokensFilePath);
  let updatedTokens = allTokens.filter((tokenData) => tokenData.email !== email);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(tokensFilePath), { recursive: true });
  await fs.writeFile(tokensFilePath, JSON.stringify(updatedTokens));
};

// This function is used to get the token from the stored against the email
const hasToken = async (email, token) => {
  try {
    const allTokens = await readJsonFile(tokensFilePath);
    const userTokens = allTokens.find((tokenData) => tokenData.email === email);
    return userTokens?.tokens.includes(token);
  } catch (error) {
    console.error(`Failed to get tokens for email ${email}: `, error);
  }
};

// This function is used to store a token against the email
const addToken = async (email, token) => {
  let allTokens = await readJsonFile(tokensFilePath);
  let userToken = allTokens.find((t) => t.email === email);

  if (userToken) {
    userToken.tokens.push(token);
  } else {
    userToken = { email, tokens: [token] };
    allTokens.push(userToken);
  }

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(tokensFilePath), { recursive: true });
  await fs.writeFile(tokensFilePath, JSON.stringify(allTokens));
};

const removeToken = async (email, token) => {
  let allTokens = await readJsonFile(tokensFilePath);
  let userToken = allTokens.find((t) => t.email === email);

  if (userToken) {
    userToken.tokens = userToken.tokens.filter((t) => t !== token);
  } else {
    throw new Error("No token found for the user");
  }

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(tokensFilePath), { recursive: true });
  await fs.writeFile(tokensFilePath, JSON.stringify(allTokens));
};

const updateUserAccount = async (email, accountInfo) => {
  let userAccounts = await readJsonFile(userAccountsFile);
  let userIndex = userAccounts.findIndex((user) => user.email === email);
  if (!userIndex) {
    throw new Error("User not found");
  }

  // Update the user account with the new information
  userAccounts[userIndex] = { ...userAccounts[userIndex], ...accountInfo };

  await fs.writeFile(userAccountsFile, JSON.stringify(userAccounts));
};

module.exports = {
  addUserAccount,
  getUserAccount,
  updateUserAccount,
  hasToken,
  addToken,
  removeToken,
  deleteUserAccount,
};
