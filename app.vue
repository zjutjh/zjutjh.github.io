<script setup lang="ts">
const title = "博客看板 - 浙江工业大学精弘网络技术团队";
const description = "这里汇聚了成员们的博客精华，通过每日定时更新的博客看板，及时了解成员动态、技术见解和创意分享。";

useSeoMeta({
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description
});
</script>

<template>
  <SiteHeader />
  <SiteContent />
  <SiteFooter />
</template>
