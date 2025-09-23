<script setup lang="ts">
import articleData from "../assets/data.json";

const toMonthTitle = (s: string) => {
  // 20241101 -> 2024年11月
  return s.slice(0, 4) + "年" + s.slice(4, 6) + "月";
};

const toArticleDate = (s: string) => {
  // 20241101 -> 11-01
  return s.slice(4, 6) + "-" + s.slice(6, 8);
};

const titleNeedToShow = (articleData: Array<any>, index: number) => {
  // Test if the month of the current article is different from the previous one
  if (index === 0) {
    return true;
  }
  return articleData[index].date.slice(0, 6) !== articleData[index - 1].date.slice(0, 6);
};
</script>

<template>
  <div class="blog-content">
    <div v-for="(article, index) in articleData" :key="article.url">
      <h2
        v-if="titleNeedToShow(articleData, index)"
        class="month-title"
      >
        {{ toMonthTitle(article.date) }}
      </h2>
      <div class="article-item">
        <div class="article-date">
          {{ toArticleDate(article.date) }}
        </div>
        <a
          class="article-title"
          :href="article.url"
          target="_blank"
        >
          {{ article.title }}
        </a>
        <a
          class="article-site"
          :href="article.siteUrl"
          target="_blank"
        >
          {{ article.siteName }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.blog-content {
  margin: 1rem 2rem;
}

.month-title {
  font-size: 1.25rem;
  color: #1f2937;
  padding-top: 0.5rem;
}

.article-item {
  display: flex;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.article-date {
  color: #9ca3af;
  margin-right: 0.75rem;
}

.article-title {
  color: #111827;
  flex: 1 1 0%;

  .tablet-up({
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  });
}

.article-site {
  margin-left: auto;
  color: #6b7280;
  display: none;

  .tablet-up({
    display: block;
  });
}
</style>