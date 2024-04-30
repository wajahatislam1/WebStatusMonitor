const urlsService = require("../../services/checks/urls.service");
const webStatusService = require("../../services/webStatus/webStatus.service");
const checksService = require("../../services/checks/checks.service");
const userService = require("../../services/user/user.service");
const emailService = require("../../services/email/email.service");
const cron = require("node-cron");

const notifySubscribedUsers = async (urlObj) => {
  const checks = await checksService.getChecksForUrl(urlObj.id);
  checks.forEach(async (check) => {
    const user = await userService.getUserById(check.userId);
    const message = `The status of url "${urlObj.url}" that you have been tracking is Now ${urlObj.status}`;
    // Send email only to  a single user to avoid spam in development
    if (user.email === "wajahat407ali@gmail.com") {
      await emailService.sendEmail(user.email, "Url Status Update", message);
    }
  });
};
const checkAllUrlsStatus = () => {
  cron.schedule("*/2 * * * *", async () => {
    const allUrls = await urlsService.getAllUrls();
    console.log("Running cron job.");

    const updatedUrls = await Promise.all(
      allUrls.map(async (urlObj) => {
        const newStatus = await webStatusService.getWebStatus(urlObj.url);
        if (newStatus !== urlObj.status) {
          urlObj.status = newStatus;
          await notifySubscribedUsers(urlObj);
        }
        return urlObj;
      })
    );

    urlsService.saveUpdatedURLs(updatedUrls);
  });
};

module.exports = { checkAllUrlsStatus };
