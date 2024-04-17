const fs = require("fs").promises;

const readJsonFile = async (filename) => {
  try {
    const fileContent = await fs.readFile(filename, "utf8");
    if (!fileContent) return [];
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      // file does not exist
      return [];
    }
    throw error;
  }
};

module.exports = {
  readJsonFile,
};
