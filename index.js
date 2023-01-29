const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cores = require("cors");

const app = express();
app.use(express.json());
app.use(cores());
app.use(express.urlencoded({ extended: false }));

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

app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Example app listening on port 3000!");
});
