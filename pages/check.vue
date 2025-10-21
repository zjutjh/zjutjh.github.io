<script setup lang="ts">
import { ref } from "vue";
import { checkRssFeed, type RssCheckResult } from "~/utils/rssChecker";

const rssUrl = ref("");
const isLoading = ref(false);
const result = ref<RssCheckResult | null>(null);

async function checkRss() {
  isLoading.value = true;
  result.value = null;

  try {
    result.value = await checkRssFeed(rssUrl.value);
  } catch (error: any) {
    result.value = {
      success: false,
      message: `✗ 发生意外错误: ${error.message}`,
    };
  } finally {
    isLoading.value = false;
  }
}

function reset() {
  rssUrl.value = "";
  result.value = null;
}
</script>

<template>
  <SiteHeader />
  <div class="check-container">
    <div class="check-content">
      <h1 class="title">RSS Feed 格式检查器</h1>
      <p class="description">
        输入你的 RSS 或 Atom 订阅链接，我们将验证其格式是否正确
      </p>

      <div class="input-group">
        <input
          v-model="rssUrl"
          type="url"
          class="rss-input"
          placeholder="请输入 RSS 订阅链接，例如：https://example.com/feed.xml"
          :disabled="isLoading"
          @keyup.enter="checkRss"
        />
        <button class="check-button" :disabled="isLoading" @click="checkRss">
          {{ isLoading ? "检查中..." : "检查" }}
        </button>
        <button
          v-if="rssUrl || result"
          class="reset-button"
          :disabled="isLoading"
          @click="reset"
        >
          重置
        </button>
      </div>

      <div
        v-if="result"
        class="result-box"
        :class="{ success: result.success, error: !result.success }"
      >
        <div class="result-message">
          {{ result.message }}
        </div>

        <div v-if="result.success && result.details" class="result-details">
          <div class="detail-section">
            <h3>Feed 信息</h3>
            <div class="detail-item">
              <span class="label">格式类型:</span>
              <span class="value">{{ result.details.type }}</span>
            </div>
            <div class="detail-item">
              <span class="label">标题:</span>
              <span class="value">{{ result.details.feedInfo.title }}</span>
            </div>
            <div class="detail-item">
              <span class="label">链接:</span>
              <a
                :href="result.details.feedInfo.link"
                target="_blank"
                class="value link"
              >
                {{ result.details.feedInfo.link }}
              </a>
            </div>
          </div>

          <div
            v-if="result.details.warnings.length > 0"
            class="detail-section warnings-section"
          >
            <h3>⚠️ 警告信息 ({{ result.details.warnings.length }})</h3>
            <div
              v-for="(warning, index) in result.details.warnings"
              :key="index"
              class="warning-item"
            >
              <div class="warning-icon">
                <span v-if="warning.type === 'feed-url-mismatch'">🔗</span>
                <span v-else-if="warning.type === 'invalid-date'">📅</span>
                <span v-else-if="warning.type === 'missing-url'">❓</span>
                <span v-else>⚠️</span>
              </div>
              <div class="warning-content">
                <div class="warning-message">
                  {{ warning.message }}
                </div>
                <div v-if="warning.articleUrl" class="warning-meta">
                  文章链接:
                  <a :href="warning.articleUrl" target="_blank">{{
                    warning.articleUrl
                  }}</a>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>文章统计</h3>
            <div class="detail-item">
              <span class="label">文章总数:</span>
              <span class="value">{{ result.details.articleCount }}</span>
            </div>
            <div class="detail-item">
              <span class="label">有效日期数:</span>
              <span class="value">{{ result.details.validDatesCount }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>最新文章预览（前 5 篇）</h3>
            <div
              v-for="(article, index) in result.details.articles"
              :key="index"
              class="article-item"
            >
              <div class="article-title">
                <a :href="article.url" target="_blank">{{ article.title }}</a>
              </div>
              <div class="article-date">
                {{
                  article.date
                    ? new Date(article.date).toLocaleString("zh-CN")
                    : "无日期"
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <SiteFooter />
</template>

<style lang="less" scoped>
.check-container {
  min-height: calc(100vh - 10rem);
  background: #f5f5f5;
  padding: 2rem 1rem;
}

.check-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  color: #d10000;
  margin-bottom: 0.5rem;
  text-align: center;
}

.description {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.rss-input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #d10000;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
}

.check-button,
.reset-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.check-button {
  background: #d10000;
  color: white;

  &:hover:not(:disabled) {
    background: #a00000;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.reset-button {
  background: #666;
  color: white;

  &:hover:not(:disabled) {
    background: #444;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.result-box {
  padding: 1.5rem;
  border-radius: 4px;
  border-left: 4px solid;

  &.success {
    background: #f0f9ff;
    border-color: #22c55e;
  }

  &.error {
    background: #fef2f2;
    border-color: #ef4444;
  }
}

.result-message {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.result-details {
  margin-top: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;

  h3 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #eee;
  }
}

.detail-item {
  display: flex;
  padding: 0.5rem 0;
  gap: 1rem;

  .label {
    font-weight: 500;
    color: #666;
    min-width: 100px;
  }

  .value {
    color: #333;
    flex: 1;
    word-break: break-all;

    &.link {
      color: #d10000;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.article-item {
  padding: 1rem;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  .article-title {
    font-weight: 500;
    margin-bottom: 0.5rem;

    a {
      color: #d10000;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .article-date {
    color: #999;
    font-size: 0.9rem;
  }
}

.warnings-section {
  h3 {
    color: #f59e0b;
    border-color: #fcd34d;
  }
}

.warning-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
  margin-bottom: 0.75rem;

  .warning-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .warning-content {
    flex: 1;
  }

  .warning-message {
    color: #92400e;
    font-weight: 500;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .warning-meta {
    color: #78716c;
    font-size: 0.875rem;

    a {
      color: #d10000;
      text-decoration: none;
      word-break: break-all;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 768px) {
  .check-content {
    padding: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .rss-input,
  .check-button,
  .reset-button {
    width: 100%;
  }

  .detail-item {
    flex-direction: column;
    gap: 0.25rem;

    .label {
      min-width: auto;
    }
  }
}
</style>
