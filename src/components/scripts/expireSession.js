const getUserData = require("./getUserData");
const moment = require("moment");

module.exports = () => {
  const userData = getUserData();
  if (userData.exp) {
    if (moment().isAfter(moment(userData.exp * 1000))) {
      localStorage.removeItem("@psyte/userData");
      window.location.href = "/";
    }
  }
};
