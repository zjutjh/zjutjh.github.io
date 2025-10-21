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
1. 支持 https 访问

## 加入方式

1. 使用[在线 RSS 检测工具](https://zjutjh.github.io/check)检查 RSS 订阅源，确保其能被正常解析
1. 修改 [meta.yaml](/meta.yaml), 提交 PR
