const checkService = require("../../services/checks/checks.service");

const userIsOwner = async (req, res, next) => {
  const checkId = req.params.id;
  const user = req.user;
  const hasCheck = await checkService.isCheckOwner(user.id, checkId);

  if (!hasCheck) {
    return res.status(404).send("User does not have this check.");
  }
  next();
};

module.exports = {
  userIsOwner,
};
