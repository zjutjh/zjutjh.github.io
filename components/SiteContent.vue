<template>
  <div class="site-content">
    <div class="content-main">
      <BlogContent />
    </div>
    <div class="content-sidebar">
      <BlogBoard />
    </div>
  </div>
</template>

<style lang="less" scoped>
.site-content {
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  .desktop-up({
    width: 75%;
  });
}

.content-main {
  grid-column: span 3 / span 3;

  .tablet-up({
    grid-column: span 2 / span 2;
  });
}

.content-sidebar {
  grid-column: span 3 / span 3;

  .tablet-up({
    grid-column: span 1 / span 1;
  });
}
</style>