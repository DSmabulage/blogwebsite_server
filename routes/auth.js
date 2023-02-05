const router = require("express").Router();
const { accessToken } = require("../middleware/jwt");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(404).json({ message: "Missing login credentials" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(404).json({ message: "incorrect email or password" });

    const token = accessToken(user._id, user.email);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, verifyPassword } = req.body;

    if (!email || !password || !verifyPassword)
      return res.status(400).json({ message: "Missing signup credentials" });

    if (password !== verifyPassword)
      return res.status(400).json({ message: "Not matching passwords" });

    const exists = await User.findOne({ email });

    if (exists)
      return res.status(404).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

    const token = accessToken(savedUser._id, savedUser.email);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "success" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/loggedin", (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) return res.json(false);

    jwt.verify(token, process.env.ACCESSTOKEN_SECRET);

    res.send(true);
  } catch (error) {
    res.json(false);
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
});

module.exports = router;
