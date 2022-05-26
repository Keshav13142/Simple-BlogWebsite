const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const posts = [];
const app = express();
const cred = require(__dirname + "/credentials.js");
mongoose.connect(cred.mongoUrl);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const blogSchema = mongoose.Schema({
  heading: String,
  body: String,
});

const Blog = new mongoose.model("blog", blogSchema);

const homeStartingContent =
  "Hello and thankyou for showing interest in this project.This is a simple webiste that allows people to share their thoughts as small blog posts.To create a new post click on the compose button.Have a great day :) ♥ And try not to spam ....";
const aboutContent =
  "I am a computer science graduate and I'm practicing my WebDev skills by building small websites like these.";
const contactContent =
  "If you'd like to share your opinion or give some suggestions please use these to get in touch with me";

app.get("/", (req, res) => {
  Blog.find({}, (err, data) => {
    res.render("home", { starter: homeStartingContent, posts: data });
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contact: contactContent });
});

app.get("/about", (req, res) => {
  res.render("about", { about: aboutContent });
});

app.get("/compose", (req, res) => {
  res.render("compose", {});
});

app.post("/compose", (req, res) => {
  const post = new Blog({
    heading: req.body.title,
    body: req.body.post,
  });
  post.save();
  res.redirect("/");
});

app.get("/post/:id", (req, res) => {
  const id = req.params.id;
  Blog.findOne({ _id: id }, (err, data) => {
    if (!err) {
      res.render("post", { post: data });
    } else {
      res.send("<h1>Post not found</h1>");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server has started successfully");
});
