const { readJsonFile } = require("../../utils/file.utils");

let path = require("path");
let urlsFilePath = path.join(__dirname, "../../../data/urls/urls.json");
let fs = require("fs").promises;

const addUrl = async (url) => {
  const urls = await readJsonFile(urlsFilePath);
  urls.push(url);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(urlsFilePath), { recursive: true });
  await fs.writeFile(urlsFilePath, JSON.stringify(urls));
};

const getUrl = async (urlId) => {
  const urls = await readJsonFile(urlsFilePath);
  const url = urls.find((c) => c.id === urlId);
  return url;
};

const getUrlId = async (url) => {
  const urls = await readJsonFile(urlsFilePath);
  const storedUrl = urls.find((c) => c.url === url);

  if (!storedUrl) {
    return null;
  }

  return storedUrl.id;
};

const removeUrl = async (urlId) => {
  let urls = await readJsonFile(urlsFilePath);
  urls = urls.filter((c) => c.id !== urlId);

  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(urlsFilePath), { recursive: true });
  await fs.writeFile(urlsFilePath, JSON.stringify(urls));
};

const getAllUrls = async () => {
  return await readJsonFile(urlsFilePath);
};

const saveUpdatedURLs = async (urls) => {
  // Ensure the directory exists, then write the data to file
  await fs.mkdir(path.dirname(urlsFilePath), { recursive: true });
  await fs.writeFile(urlsFilePath, JSON.stringify(urls));
};

module.exports = { addUrl, getUrl, getUrlId, removeUrl, getAllUrls, saveUpdatedURLs };
