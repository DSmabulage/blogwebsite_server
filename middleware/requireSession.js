const { SESSIONS } = require("../index.js");

const requireSession = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const cookie = authorization.split(" ")[1];

  console.log("authorization", cookie);

  console.log("cookie", cookie);

  const username = SESSIONS.get(cookie);
  if (username) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = requireSession;




