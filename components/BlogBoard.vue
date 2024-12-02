<script setup lang="ts">
import boardInfo from "../assets/opml.json";
</script>

<template>
  <div class="bg-white rounded-lg m-4 p-4">
    <div class="text-xl text-gray-800 border-b py-2 mx-4 mb-[-2px]">
      博客列表
    </div>
    <div v-for="board in boardInfo" :key="board.link" class="blog-item m-4 truncate">
      <a :href="board.link" target="_blank">
        <div
          class="text-lg"
          :class="{ 'text-gray-400 line-through': !board.alive }"
        >
          {{ board.title }}
        </div>
        <div class="flex items-center">
          <img class="w-4 mr-1" src="/img/link.svg">
          <span class="text-sm text-gray-500">{{ board.link }}</span>
        </div>
      </a>
    </div>
  </div>
</template>