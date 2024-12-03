import json
import time
from datetime import datetime
import concurrent.futures
import yaml
import feedparser
from dateutil.relativedelta import relativedelta

with open('../meta.yaml', 'r') as f:
    meta = yaml.full_load(f)

Month = 4
MinArticlesToRemain = 50
threads = []
opml = []
data = []


def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        for _ in executor.map(fetch_feed, meta['blogs']):
            pass

    data.sort(key=lambda x: x['date'], reverse=True)

    # 做一个字符串比较，保留最近 4 个月的文章
    dataFilteredByDate = list(filter(
        lambda x: x['date'][:-2] >= (datetime.now() - relativedelta(months=Month)).strftime('%Y%m'),
        data
    ))

    # 如果最近 4 个月的文章数量大于 50，则保留最近 4 个月的文章，否则保留最近 50 篇文章
    if len(dataFilteredByDate) > MinArticlesToRemain:
        dataToRemain = dataFilteredByDate
    else:
        dataToRemain = data[:MinArticlesToRemain]

    with open('../assets/data.json', 'w') as f:
        json.dump(dataToRemain, f, indent=4, ensure_ascii=False)

    with open('../assets/opml.json', 'w') as f:
        json.dump(opml, f, indent=4, ensure_ascii=False)


def fetch_feed(blog):
    try:
        feed = feedparser.parse(blog['feed'])
    except:
        alive = False
    else:
        alive = True
    if len(feed.entries) == 0:
        alive = False

    print('获取' + ('成功' if alive else '失败') + '：' + blog['url'])

    opml.append({
        'title': blog['title'],
        'link': blog['url'],
        'alive': alive
    })

    if not alive:
        return

    for entry in feed.entries:
        data.append({
            'title': entry['title'],
            'date': time.strftime('%Y%m%d', entry['published_parsed']),
            'url': entry['link'],
            'siteName': blog['title'],
            'siteUrl': blog['url']
        })


if __name__ == '__main__':
    main()
