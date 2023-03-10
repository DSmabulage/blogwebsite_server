const router = require("express").Router();
const Article = require("../models/article");
const requireToken = require("../middleware/requireToken");

router.get("/", async (req, res) => {
  try {
    const article = await Article.find().sort({ createdAt: "desc" });
    res.send(article);
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    res.send(article);
  } catch (e) {
    res.send(e.message);
  }
});

router.use(requireToken);

router.post("/new", async (req, res) => {
  let article = new Article({
    user_id: req.user,
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
  });

  try {
    article = await article.save();
    res.send(article);
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.send(article);
  } catch (error) {
    res.send(error.message);
    console.error(error);
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    article = await article.save();
    res.send(article);
  } catch (error) {
    res.send(error.message);
    console.error(error);
  }
});

router.post("/user", async (req, res) => {
  try {
    const user_id = req.user;
    const articles = await Article.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
