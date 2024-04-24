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

const getUserByEmail = async (email) => {
  let userAccounts = await readJsonFile(userAccountsFile);
  return userAccounts.find((user) => user.email === email);
};

const getUserById = async (userId) => {
  let userAccounts = await readJsonFile(userAccountsFile);
  return userAccounts.find((user) => user.id === userId);
};

const deleteUserAccount = async (userId) => {
  //Removing the user's account
  let userAccounts = await readJsonFile(userAccountsFile);
  let updatedUsers = userAccounts.filter((user) => user.id !== userId);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(userAccountsFile), { recursive: true });
  await fs.writeFile(userAccountsFile, JSON.stringify(updatedUsers));

  //Removing the user's tokens
  let allTokens = await readJsonFile(tokensFilePath);
  let updatedTokens = allTokens.filter((tokenData) => tokenData.userId !== userId);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(tokensFilePath), { recursive: true });
  await fs.writeFile(tokensFilePath, JSON.stringify(updatedTokens));
};

const updateUserAccount = async (userId, accountInfo) => {
  let userAccounts = await readJsonFile(userAccountsFile);
  let userIndex = userAccounts.findIndex((user) => user.id === userId);
  if (userIndex == -1) {
    throw new Error("User not found");
  }

  // Update the user account with the new information
  userAccounts[userIndex] = { ...userAccounts[userIndex], ...accountInfo };

  await fs.writeFile(userAccountsFile, JSON.stringify(userAccounts));
};

const hasToken = async (userId, token) => {
  try {
    const allTokens = await readJsonFile(tokensFilePath);
    const userTokens = allTokens.find((tokenData) => tokenData.userId === userId);
    return userTokens?.tokens.includes(token);
  } catch (error) {
    console.error(`Failed to get tokens for user id: ${userId}: `, error);
  }
};

// This function is used to store a token against the email
const addToken = async (userId, token) => {
  let allTokens = await readJsonFile(tokensFilePath);
  let userToken = allTokens.find((t) => t.userId === userId);

  if (userToken) {
    userToken.tokens.push(token);
  } else {
    userToken = { userId, tokens: [token] };
    allTokens.push(userToken);
  }

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(tokensFilePath), { recursive: true });
  await fs.writeFile(tokensFilePath, JSON.stringify(allTokens));
};

const removeToken = async (userId, token) => {
  let allTokens = await readJsonFile(tokensFilePath);
  let userToken = allTokens.find((t) => t.userId === userId);

  if (userToken) {
    userToken.tokens = userToken.tokens.filter((t) => t !== token);
  } else {
    throw new Error("No token found for the user");
  }

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(tokensFilePath), { recursive: true });
  await fs.writeFile(tokensFilePath, JSON.stringify(allTokens));
};

module.exports = {
  addUserAccount,
  getUserById,
  getUserByEmail,
  updateUserAccount,
  deleteUserAccount,
  hasToken,
  addToken,
  removeToken,
};
