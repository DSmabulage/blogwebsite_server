const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cores = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cores({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const USERS = new Map();
USERS.set("dileepa001@gmail.com", {
  id: "12345",
  email: "dileepa001@gmail.com",
  password: "dileepa123",
});
USERS.set("supipi676@gmail.com", {
  id: "09876",
  email: "supipi676@gmail.com",
  password: "anuththara123",
});


const SESSIONS = new Map();
module.exports = { SESSIONS };

mongoose
  .set("strictQuery", true)
  .connect(process.env.DATABASE_URL, {})
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

const articleRouter = require("./routes/articles");

app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = USERS.get(email);

  if (user) {
    const sessionId = crypto.randomUUID();
    SESSIONS.set(sessionId, email);
    console.log(SESSIONS);

    res.cookie("sessionId", sessionId, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      // httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.send(`Authed as ${req.body.email}`);
  } else {
    res.status(401).send("Login Failed");
  }
});

app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const username = SESSIONS.get(sessionId);

  if (sessionId && username) {
    SESSIONS.delete(sessionId);
  }
  res.clearCookie("sessionId");
  res.send("Logged out " + username);
});

app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("Hello World!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Example app listening on port 5000!");
});
