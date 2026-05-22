<template>
  <div id="header" class="header">
    <img
      class="header-logo"
      src="/img/logo.webp"
      alt="精弘网络"
    >
    <div class="header-title">
      浙江工业大学精弘网络技术团队
    </div>
    <a
      href="/rss.xml"
      target="_blank"
      class="header-rss"
      title="订阅 RSS"
    >
      <img class="rss-icon" src="/img/rss.svg" alt="rss-icon">
    </a>
    <a
      href="https://github.com/zjutjh"
      target="_blank"
      class="header-github"
    >
      <img class="github-icon" src="/img/github.svg" alt="github-icon">
      <div class="github-text">
        Github
      </div>
    </a>
  </div>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  background: #D10000;
}

.header-logo {
  height: 3rem;
  margin: 1rem;

  .desktop-up({
    height: 4rem;
  });
}

.header-title {
  display: none;
}

.header-github {
  margin-left: auto;
  margin-right: 1rem;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
}

.header-rss {
  margin-right: 1rem;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  align-items: center;
}

.rss-icon {
  height: 2rem;

  .desktop-up({
    height: 3rem;
  });
}

.github-icon {
  height: 2rem;
  margin-right: 0.25rem;

  .desktop-up({
    height: 3rem;
  });
}

.github-text {
  font-size: 1.75rem;
  color: white;
  font-weight: 500;
  margin: auto;
}
</style>
