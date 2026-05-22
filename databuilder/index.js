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
      if (/<head>\s*<title>Just a moment\.\.\.<\/title>/i.test(text)) {
        console.warn("抓取受阻 [Cloudflare]", url);
        return null;
      }
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
    try {
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
    } catch (e) {
      console.error(`解析失败: ${blog.title}`, e);
    }
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

  // Generate RSS feed
  const generateRSSFeed = () => {
    const rssItems = dataToWrite.map(item => {
      const pubDate = new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
      return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <description><![CDATA[来自 ${item.siteName}]]></description>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <source url="${item.siteUrl}">${item.siteName}</source>
    </item>`;
    }).join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>精弘网络技术团队博客</title>
    <link>https://zjutjh.github.io</link>
    <description>精弘网络技术团队成员博客聚合</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>zjutjh.github.io RSS Generator</generator>
${rssItems}
  </channel>
</rss>`;
    return rss;
  };

  fs.writeFileSync("./public/rss.xml", generateRSSFeed());
})();
