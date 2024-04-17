const { readJsonFile } = require("../../utils/file.utils");

let path = require("path");
let checksFilePath = path.join(__dirname, "../../../data/urls/urls.json");
let fs = require("fs").promises;

const addUrl = async (url) => {
  const urls = await readJsonFile(checksFilePath);
  urls.push(url);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(checksFilePath), { recursive: true });
  await fs.writeFile(checksFilePath, JSON.stringify(urls));
};

const getUrl = async (urlId) => {
  const urls = await readJsonFile(checksFilePath);
  const url = urls.find((c) => c.urlId === urlId);

  if (!url) {
    throw new Error("This url is not added to the checks list.");
  }
  return url;
};

const getUrlId = async (url) => {
  const urls = await readJsonFile(checksFilePath);
  const storedUrl = urls.find((c) => c.url === url);

  if (!storedUrl) {
    return null;
  }

  return storedUrl.id;
};

const removeUrl = async (urlId) => {
  let urls = await readJsonFile(checksFilePath);
  urls = urls.filter((c) => c.urlId !== urlId);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(checksFilePath), { recursive: true });
  await fs.writeFile(checksFilePath, JSON.stringify(urls));
};

const getAllUrls = async () => {
  return await readJsonFile(checksFilePath);
};

module.exports = { addUrl, getUrl, getUrlId, removeUrl, getAllUrls };
