import { XMLParser } from "fast-xml-parser";

export interface RssArticle {
  title: string;
  date: Date | null;
  url: string;
}

export interface RssFeedInfo {
  title: string;
  description: string;
  link: string;
}

export interface RssCheckWarning {
  type: "feed-url-mismatch" | "invalid-date" | "missing-url";
  message: string;
  articleTitle?: string;
  articleUrl?: string;
}

export interface RssCheckResult {
  success: boolean;
  message: string;
  details?: {
    type: "RSS" | "Atom";
    feedInfo: RssFeedInfo;
    articleCount: number;
    validDatesCount: number;
    articles: RssArticle[];
    warnings: RssCheckWarning[];
  };
}

/**
 * 解析 RSS/Atom 源中的日期字符串
 */
function parseDate(dateString: string | undefined): Date | null {
  if (!dateString) {
    return null;
  }

  // 清洗字符串:解码常见的 HTML 实体,例如 '&#43;' -> '+'
  const cleanedString = dateString.replace(/&#(\d+);/g, (match, dec) =>
    String.fromCharCode(parseInt(dec))
  );

  const date = new Date(cleanedString);

  // 检查是否为无效日期
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * 从 URL 中提取 host
 */
function extractHost(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * 检查两个 host 是否匹配
 * 支持 www 前缀的宽松匹配
 */
function hostsMatch(host1: string, host2: string): boolean {
  const normalize = (host: string) => host.replace(/^www\./, "");
  return normalize(host1) === normalize(host2);
}

/**
 * 检查 RSS feed
 */
export async function checkRssFeed(rssUrl: string): Promise<RssCheckResult> {
  if (!rssUrl.trim()) {
    return {
      success: false,
      message: "请输入 RSS 订阅链接",
    };
  }

  try {
    // 获取 RSS 内容
    const res = await fetch(rssUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();

    // 解析 XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
    });

    const json = parser.parse(text);

    // 判断是 RSS 还是 Atom
    const type = json.rss ? "rss" : json.feed ? "feed" : null;

    if (!type) {
      throw new Error("无法识别的 feed 格式,请确保是有效的 RSS 或 Atom feed");
    }

    // 提取文章条目
    let entries = type === "rss" ? json.rss.channel?.item : json.feed?.entry;

    if (!entries) {
      throw new Error("未找到任何文章条目");
    }

    if (!Array.isArray(entries)) {
      entries = [entries];
    }

    // 解析 feed 信息
    const feedInfo: RssFeedInfo =
      type === "rss"
        ? {
            title: json.rss.channel?.title || "未知",
            description: json.rss.channel?.description || "无描述",
            link: json.rss.channel?.link || "无链接",
          }
        : {
            title: json.feed?.title || "未知",
            description: json.feed?.subtitle || "无描述",
            link: json.feed?.link?._href || json.feed?.link || "无链接",
          };

    // 检查用户输入的 feed URL 与 feed 声明的 URL 是否一致
    const inputHost = extractHost(rssUrl);
    const feedHost = extractHost(feedInfo.link);
    const warnings: RssCheckWarning[] = [];

    if (inputHost && feedHost && !hostsMatch(inputHost, feedHost)) {
      warnings.push({
        type: "feed-url-mismatch",
        message: `输入的 Feed 地址域名 (${inputHost}) 与 Feed 中声明的域名 (${feedHost}) 不一致`,
      });
    }

    // 解析文章信息并检查
    const articles: RssArticle[] = entries.map((item: any) => {
      const title = item.title || "无标题";
      const date = parseDate(item.pubDate || item.published);
      const url = item.link?._href || item.link || "无链接";

      // 检查日期是否有效
      if (!date && (item.pubDate || item.published)) {
        warnings.push({
          type: "invalid-date",
          message: `文章 "${title}" 的日期格式无法解析`,
          articleTitle: title,
          articleUrl: url,
        });
      }

      // 检查文章链接是否缺失
      if (url === "无链接") {
        warnings.push({
          type: "missing-url",
          message: `文章 "${title}" 缺少有效的链接`,
          articleTitle: title,
        });
      }

      return {
        title,
        date,
        url,
      };
    });

    // 统计信息
    const validDates = articles.filter((a) => a.date !== null).length;

    return {
      success: true,
      message: "✓ RSS Feed 解析成功!",
      details: {
        type: type === "rss" ? "RSS" : "Atom",
        feedInfo,
        articleCount: articles.length,
        validDatesCount: validDates,
        articles: articles.slice(0, 5), // 只显示前 5 篇
        warnings,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `✗ 解析失败: ${error.message}`,
    };
  }
}
