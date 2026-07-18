<template>
  <div id="footer" class="footer">
    <div class="footer-text">
      © 2002-{{ new Date().getFullYear() }} 浙江工业大学精弘网络技术团队
    </div>
    <a href="/rss.xml" class="footer-link" title="订阅 RSS">
      <svg
        class="footer-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M96 128C96 110.3 110.3 96 128 96C357.8 96 544 282.2 544 512C544 529.7 529.7 544 512 544C494.3 544 480 529.7 480 512C480 317.6 322.4 160 128 160C110.3 160 96 145.7 96 128zM96 480C96 444.7 124.7 416 160 416C195.3 416 224 444.7 224 480C224 515.3 195.3 544 160 544C124.7 544 96 515.3 96 480zM128 224C287.1 224 416 352.9 416 512C416 529.7 401.7 544 384 544C366.3 544 352 529.7 352 512C352 388.3 251.7 288 128 288C110.3 288 96 273.7 96 256C96 238.3 110.3 224 128 224z"
        />
      </svg>
      RSS
    </a>
  </div>
</template>

<style lang="less" scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 1rem;
}

.footer-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: underline;
  text-underline-offset: 0.15em;

  &:hover {
    color: #374151;
  }
}

.footer-icon {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
