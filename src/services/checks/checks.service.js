const { readJsonFile } = require("../../utils/file.utils");

let path = require("path");
let checksFilePath = path.join(__dirname, "../../../data/checks/checks.json");
let fs = require("fs").promises;

const addCheck = async (check) => {
  const checks = await readJsonFile(checksFilePath);
  checks.push(check);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(checksFilePath), { recursive: true });
  await fs.writeFile(checksFilePath, JSON.stringify(checks));
};

const getCheck = async (checkId) => {
  const checks = await readJsonFile(checksFilePath);
  return checks.find((c) => c.id === checkId);
};

const updateCheck = async (check) => {
  let checks = await readJsonFile(checksFilePath);
  // Update the check
  checks = checks.map((c) => (c.id === check.id ? check : c));

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(checksFilePath), { recursive: true });
  await fs.writeFile(checksFilePath, JSON.stringify(checks));
};

const deleteCheck = async (checkId) => {
  let checks = await readJsonFile(checksFilePath);
  checks = checks.filter((c) => c.id !== checkId);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(checksFilePath), { recursive: true });
  await fs.writeFile(checksFilePath, JSON.stringify(checks));
};

const userHasUrl = async (userId, urlId) => {
  const checks = await readJsonFile(checksFilePath);
  return checks.some((c) => c.userId === userId && c.urlId === urlId);
};

const isCheckOwner = async (userId, checkId) => {
  const checks = await readJsonFile(checksFilePath);
  return checks.some((c) => c.userId === userId && c.id === checkId);
};

const getUsersChecks = async (userId) => {
  const checks = await readJsonFile(checksFilePath);
  return checks.filter((c) => c.userId === userId);
};
module.exports = {
  addCheck,
  getCheck,
  updateCheck,
  deleteCheck,
  userHasUrl,
  isCheckOwner,
  getUsersChecks,
};
