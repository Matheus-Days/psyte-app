module.exports = () => {
  try {
    let userData = localStorage.getItem("@psyte/userData");
    userData = JSON.parse(userData);
    if (userData === null) throw Error;
    return userData;
  } catch (err) {
    return {
      id: "",
      name: "",
      email: "",
      admin: "",
      iat: "",
      exp: "",
      token: "",
    };
  }
};
