import yaml from "js-yaml";
import * as fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { addMonths, format } from "date-fns";

const articlesToRemain = parseInt(process.env.ARTICLES_TO_REMAIN ?? "50");
const monthLimit = parseInt(process.env.MONTH_LIMIT ?? "4");

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
          date: new Date(item.pubDate),
          // date: format(new Date(item.pubDate), "yyyyMMdd"),
          url: item.link,
          siteName: title,
          siteUrl: url
        })));
      } else {
        data.push(...json.feed.entry.map((item) => ({
          title: item.title,
          date: new Date(item.published),
          // date: format(new Date(item.published), "yyyyMMdd"),
          url: item.link["_href"],
          siteName: title,
          siteUrl: url
        })));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.error("获取失败", title, url);
      opml.push({
        title,
        link: url,
        alive: false
      });
    }
  }

  data.sort((a, b) => new Date(b.date) - new Date(a.date));
  const monthData = addMonths(new Date(), monthLimit);
  const dataToWrite = ((() => {
    const dataToWrite = data.filter((item) => item.date >= monthData);
    if (dataToWrite.length < articlesToRemain) {
      return data.toSpliced(articlesToRemain);
    }
    return dataToWrite;
  })()).map((item) => ({
    title: item.title,
    date: format(item.date, "yyyyMMdd"),
    url: item.url,
    siteName: item.siteName,
    siteUrl: item.siteUrl
  }));
  fs.writeFileSync("./assets/data.json", JSON.stringify(dataToWrite, null, 4));
  fs.writeFileSync("./assets/opml.json", JSON.stringify(opml, null, 4));
})();
