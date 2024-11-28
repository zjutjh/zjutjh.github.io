import json
import time
import concurrent.futures
import yaml
import feedparser

with open('../meta.yaml', 'r') as f:
    meta = yaml.full_load(f)

articlesToRemain = 50
threads = []
opml = []
data = []

def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        for _ in executor.map(fetch_feed, meta['blogs']):
            pass

    data.sort(key=lambda x: x['date'], reverse=True)

    with open('../assets/data.json', 'w') as f:
        json.dump(data[:articlesToRemain], f, indent=4, ensure_ascii=False)

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