<script setup lang="ts">
import boardInfo from "../assets/opml.json";
</script>

<template>
  <div class="blog-board">
    <div class="board-title">
      博客列表
    </div>
    <div v-for="board in boardInfo" :key="board.link" class="blog-item">
      <a :href="board.link" target="_blank">
        <div
          class="blog-title"
          :class="{ 'blog-title-inactive': !board.alive }"
        >
          {{ board.title }}
        </div>
        <div class="blog-link">
          <img class="link-icon" src="/img/link.svg" alt="link-icon">
          <span class="link-text">{{ board.link }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style lang="less" scoped>
.blog-board {
  background-color: white;
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem;
}

.board-title {
  font-size: 1.25rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: -2px;
}

.blog-item {
  margin: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blog-title {
  font-size: 1.125rem;
  color: #111827;
}

.blog-title-inactive {
  color: #9ca3af;
  text-decoration: line-through;
}

.blog-link {
  display: flex;
  align-items: center;
}

.link-icon {
  width: 1rem;
  margin-right: 0.25rem;
}

.link-text {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>