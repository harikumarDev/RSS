const mongoose = require("mongoose");

const RssFeedSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  data: [
    {
      title: String,
      link: String,
      pubDate: String,
      content: String,
      contentSnippet: String,
      guid: String,
      isoDate: String,
    },
  ],
});

const RssFeed = mongoose.model("RssFeed", RssFeedSchema);

module.exports = RssFeed;
