import yaml from 'js-yaml';
import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

async function getBlog(blog) {
  const res = await fetch(blog);
  const text = await res.text();
  return text;
}

const { blogs } = yaml.load(fs.readFileSync('./meta.yaml', 'utf8'));
const parser = new XMLParser();
const opml = [];
const data = [];

(async () => {

  for await (const blog of blogs) {
    const { feed, title, url } = blog;
    try {
      const text = await getBlog(feed);
      const json = parser.parse(text);
      const type = json.rss ? 'rss' : 'feed'
      opml.push({
        title,
        url,
        alive: true
      });
      if (type === 'rss') {

        data.push(...json.rss.channel.item.map((item) => ({
          title: item.title,
          date: item.pubDate,
          url: item.link,
          siteName: title,
          siteUrl: url
        })));
      } else {
        data.push(...json.feed.entry.map((item) => ({
          title: item.title,
          date: item.published,
          url: item.link,
          siteName: title,
          siteUrl: url
        })));
      }
    } catch (error) {
      console.error(error, title);
      opml.push({
        title,
        url,
        alive: false
      });
    }
  }
  console.log(opml);
  console.log(data);
  fs.writeFileSync('./assets/data.json', JSON.stringify(data, null, 4));
  fs.writeFileSync('./assets/opml.json', JSON.stringify(opml, null, 4));
})();
