const jwt = require("jsonwebtoken");

const requireToken = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Unauthorized");

    const verified = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);

    req.user = verified._id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = requireToken;
