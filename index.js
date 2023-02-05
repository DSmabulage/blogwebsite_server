const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cores = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(
  cores({
    origin: [
      "http://localhost:3000",
      "https://blogwebsite-client.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
const authRouter = require("./routes/auth");

app.use("/articles", articleRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("Hello World!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Example app listening on port 5000!");
});
