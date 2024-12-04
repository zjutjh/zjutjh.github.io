import yaml from "js-yaml";
import * as fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { format } from "date-fns";

const articlesToRemain = parseInt(process.env.ARTICLES_TO_REMAIN ?? "50");

/** 获取博客内容
 * @param {string} url 博客 URL
 * */
async function getBlog(url) {
  const res = await fetch(url);
  const text = await res.text();
  return text;
}

const { blogs } = yaml.load(fs.readFileSync("./meta.yaml", "utf8"));

(async () => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_"
  });
  const opml = [];
  const data = [];

  for await (const blog of blogs) {
    const { feed, title, url } = blog;
    try {
      const text = await getBlog(feed);
      const json = parser.parse(text);
      const type = json.rss ? "rss" : "feed";
      opml.push({
        title,
        link: url,
        alive: true
      });
      if (type === "rss") {
        data.push(...json.rss.channel.item.map((item) => ({
          title: item.title,
          date: format(new Date(item.pubDate), "yyyyMMdd"),
          url: item.link,
          siteName: title,
          siteUrl: url
        })));
      } else {
        data.push(...json.feed.entry.map((item) => ({
          title: item.title,
          date: format(new Date(item.published), "yyyyMMdd"),
          url: item.link["_href"],
          siteName: title,
          siteUrl: url
        })));
      }
    } catch (error) {
      console.error(error, title);
      opml.push({
        title,
        link: url,
        alive: false
      });
    }
  }

  data.sort((a, b) => new Date(b.date) - new Date(a.date));
  const dataToWrite = data.slice(0, articlesToRemain);
  // console.log(opml);
  // console.log(data);
  fs.writeFileSync("./assets/data.json", JSON.stringify(dataToWrite, null, 4));
  fs.writeFileSync("./assets/opml.json", JSON.stringify(opml, null, 4));
})();
