const axios = require("axios");

const getWebStatus = async (url) => {
  try {
    if (!url.startsWith("http")) url = "https://" + url;
    const response = await axios.get(url);

    if (response.status === 200) {
      return "UP";
    }
    return "DOWN";
  } catch (error) {
    return "DOWN";
  }
};

module.exports = {
  getWebStatus,
};
