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

.github-icon {
  height: 2rem;
  margin-right: 0.25rem;

  .desktop-up({
    height: 3rem;
  });
}

.github-text {
  font-size: 1.25rem;
  color: white;
  font-weight: 500;
  margin: auto;
}
</style>
