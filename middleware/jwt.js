const jwt = require("jsonwebtoken");

const accessToken = (_id, email) => {
  const token = jwt.sign({ _id, email }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = { accessToken };
