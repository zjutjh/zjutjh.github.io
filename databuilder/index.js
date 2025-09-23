import yaml from "js-yaml";
import * as fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { subMonths, format } from "date-fns";

const articlesToRemain = parseInt(process.env.ARTICLES_TO_REMAIN ?? "50");
const monthLimit = parseInt(process.env.MONTH_LIMIT ?? "4");

/** 获取博客内容
 * @param {string} url 博客 URL
 * */
async function getBlog(url) {
  for (let i = 0; i < 3; i += 1) {
    try {

      const res = await fetch(url);
      const text = await res.text();
      return text;
    } catch {
      if (i < 2) {
        console.warn("获取失败", `（${i + 1}/3）`, url);
      } else {
        console.error("获取失败", `（${i + 1}/3）`, url);
      }
    }
  }
  return null;
}

/**
 * 解析 RSS/Atom 源中的日期字符串
 * @param {string | undefined} dateString 原始日期字符串
 * @returns {Date | null} 解析成功返回 Date 对象，失败返回 null
 */
function parseDate(dateString) {
  if (!dateString) {
    return null;
  }

  // 清洗字符串：解码常见的 HTML 实体，例如 '&#43;' -> '+'
  const cleanedString = dateString.replace(/&#(\d+);/g, (match, dec) =>
    String.fromCharCode(dec)
  );

  const date = new Date(cleanedString);

  // 检查是否为无效日期 (Invalid Date)
  if (isNaN(date.getTime())) {
    console.warn(`[!] 日期解析失败，已跳过该文章: "${dateString}"`);
    return null;
  }

  return date;
}

const { blogs: blogMetas } = yaml.load(fs.readFileSync("./meta.yaml", "utf8"));

(async () => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_"
  });
  const opml = [];
  const data = [];

  const blogs = await Promise.all(blogMetas.map(async (blog) => ({
    ...blog,
    text: await getBlog(blog.feed)
  })));

  for (const blog of blogs) {
    const { title, url, text } = blog;
    if (!text) {
      opml.push({
        title,
        link: url,
        alive: false
      });
      continue;
    }
    const json = parser.parse(text);
    const type = json.rss ? "rss" : "feed";
    opml.push({
      title,
      link: url,
      alive: true
    });
    let entries = type === "rss" ? json.rss.channel.item : json.feed.entry;
    if (!Array.isArray(entries)) {
      entries = [entries];
    }
    data.push(
      ...entries.map((item) => ({
        title: item.title,
        date: parseDate(item.pubDate || item.published),
        url: item.link?._href || item.link,
        siteName: title,
        siteUrl: url
      }))
    );
  }

  data.sort((a, b) => b.date - a.date);
  const monthData = subMonths(new Date(), monthLimit);
  const dataToWrite = ((() => {
    const temp = data.filter((item) => item.date !== null && item.date >= monthData);
    if (temp.length < articlesToRemain) {
      return data.toSpliced(articlesToRemain);
    }
    return temp;
  })()).map((item) => ({
    ...item,
    date: format(item.date, "yyyyMMdd")
  }));
  opml.sort((a, b) => {
    if (a.alive !== b.alive) {
      return a.alive ? -1 : 1;
    }
    return dataToWrite.filter(item => item.siteUrl === b.link).length - dataToWrite.filter(item => item.siteUrl === a.link).length;
  });
  fs.writeFileSync("./assets/data.json", JSON.stringify(dataToWrite, null, 4));
  fs.writeFileSync("./assets/opml.json", JSON.stringify(opml, null, 4));
})();
