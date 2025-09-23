<template>
  <div id="footer" class="footer">
    <div class="footer-text">
      © 2002-{{ new Date().getFullYear() }} 浙江工业大学精弘网络技术团队
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
}

.footer-text {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>