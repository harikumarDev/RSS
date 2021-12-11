const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const mongoose = require("mongoose");
const RssFeed = require("./schema");

const app = express();
const parser = new Parser();
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/rss-feed";

app.use(cors());
app.use(express.json());
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
});

app.get("/", async (req, res) => {
  const feed = await parser.parseURL(
    "http://news.google.com/news?ned=us&topic=h&output=rss"
  );
  res.status(200).json({
    data: feed,
  });
});

app.get("/:keyword", async (req, res) => {
  const { keyword: kw } = req.params;
  const keyword = kw.toLowerCase();

  const feeds = await RssFeed.find({ keyword });

  if (feeds.length === 0) {
    console.log("New Request");
    const feed = await parser.parseURL(
      "http://news.google.com/news?ned=us&topic=h&output=rss"
    );

    const filteredFeed = feed.items.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );

    if (filteredFeed.length === 0) {
      res.status(200).json({ message: "No results found" });
    } else {
      const newFeed = new RssFeed({
        keyword,
        data: filteredFeed,
      });
      await newFeed.save();
      res.status(200).json({
        data: filteredFeed,
      });
    }
  } else {
    console.log("From DB");
    const data = feeds[0].data;
    res.status(200).json({
      data,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
