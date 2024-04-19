const checkService = require("../../services/checks/checks.service");
const urlService = require("../../services/checks/urls.service");
const webStatusService = require("../../services/webStatus/webStatus.service");
const uuid = require("uuid");

const { validationResult } = require("express-validator");

const addCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const checkUrl = req.body.checkUrl;
  const user = req.user;

  // Check if this url is already stored in the database
  let storedUrlId = await urlService.getUrlId(checkUrl);
  if (!storedUrlId) {
    const urlStatus = await webStatusService.getWebStatus(checkUrl);
    const urlData = { id: uuid.v4(), url: checkUrl, status: urlStatus };
    await urlService.addUrl(urlData);
    storedUrlId = urlData.id;
  }

  const hasCheck = await checkService.userHasUrl(user.id, storedUrlId);
  if (hasCheck) {
    return res.status(409).send("User already has this check.");
  }

  try {
    const newCheckData = {
      id: uuid.v4(),
      userId: user.id,
      urlId: storedUrlId,
    };
    await checkService.addCheck(newCheckData);
    res.status(200).send("Check added successfully");
  } catch (error) {
    console.error("Error in adding check: ", error);
    res.status(500).send(`Failed to add check: ${error.message}`);
  }
};

const updateCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const checkId = req.params.id;
  const newCheckUrl = req.body.checkUrl;
  const user = req.user;

  // Check if this url is already stored in the database
  let storedUrlId = await urlService.getUrlId(newCheckUrl);
  if (!storedUrlId) {
    const urlStatus = await webStatusService.getWebStatus(newCheckUrl);
    const newUrlData = { id: uuid.v4(), url: newCheckUrl, status: urlStatus };
    await urlService.addUrl(newUrlData);
    storedUrlId = newUrlData.id;
  }

  //If user already has this check, return 409
  const hasCheck = await checkService.userHasUrl(user.id, storedUrlId);
  if (hasCheck) {
    return res.status(409).send("User already has this check.");
  }

  try {
    let check = await checkService.getCheck(checkId);
    check = {
      ...check,
      userId: user.id,
      urlId: storedUrlId,
    };

    await checkService.updateCheck(check);
    res.status(200).send("Check updated successfully");
  } catch (error) {
    res.status(500).send(`Failed to update check: ${error.message}`);
  }
};

const deleteCheck = async (req, res) => {
  const checkId = req.params.id;

  try {
    await checkService.deleteCheck(checkId);
    res.status(200).send("Check deleted successfully");
  } catch (error) {
    console.error("Error in deleting check: ", error);
    res.status(500).send(`Failed to delete check: ${error.message}`);
  }
};

const getUsersChecks = async (req, res) => {
  const user = req.user;

  try {
    let userChecks = await checkService.getUsersChecks(user.id);
    userChecks = await Promise.all(
      userChecks.map(async (check) => {
        const url = await urlService.getUrl(check.urlId);
        return {
          id: check.id,
          url: url.url,
          status: url.status,
        };
      })
    );

    res.status(200).json(userChecks);
  } catch (error) {
    console.error("Error in getting users checks: ", error);
    res.status(500).send(`Failed to get users checks: ${error.message}`);
  }
};

module.exports = {
  addCheck,
  updateCheck,
  deleteCheck,
  getUsersChecks,
};
