# 精弘网络技术团队博客 rss 看板

采用 Nuxt 构建，每日自动抓取 rss 订阅源，生成静态看板

## 数据生成

```bash
pnpm run build:data
```

## 构建

```bash
pnpm run generate
```

## 准入条件

1. 精弘网络技术团队成员
1. 博客文章数量 >= 5
1. 技术文章占比 >= 50%

## 加入方式

修改 [meta.yaml](/meta.yaml), 提交 PR 即可