<script setup lang="ts">
import articleData from '../assets/data.json'

const toMonthTitle = (s: string) => {
    // 20241101 -> 2024年11月
    return s.slice(0, 4) + '年' + s.slice(4, 6) + '月'
}

const toArticleDate = (s: string) => {
    // 20241101 -> 11-01
    return s.slice(4, 6) + '-' + s.slice(6, 8)
}

const titleNeedToShow = (articleData: Array<any>, index: number) => {
    // Test if the month of the current article is different from the previous one
    if (index === 0) {
        return true
    }
    return articleData[index].date.slice(0, 6) !== articleData[index - 1].date.slice(0, 6)
}
</script>

<template>
    <div class="m-4 p-4">
        <div v-for="(article, index) in articleData">
            <div
                v-if="titleNeedToShow(articleData, index)"
                class="text-2xl text-gray-800"
            >
                {{ toMonthTitle(article.date) }}
            </div>
            <div class="article-item flex my-2 text-lg">
                <div class="text-gray-400 mr-2 my-auto">{{ toArticleDate(article.date) }}</div>
                <a class="text-gray-900 md:truncate flex-1"
                    :href="article.url" target="_blank"
                >
                    {{ article.title }}
                </a>
                <a class="ml-auto text-gray-500 hidden md:block"
                    :href="article.siteUrl" target="_blank">
                {{ article.siteName }}
                </a>
            </div>
        </div>
    </div>
</template>