<template>
  <div id="footer" class="footer">
    <div class="footer-links">
      <a
        href="https://myzjut.org"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        <svg
          class="footer-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H296c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H192c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H56c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H24c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
          />
        </svg>
        精弘首页
      </a>
      <span class="footer-sep">·</span>
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
    <div class="footer-text">
      © 2002-{{ new Date().getFullYear() }} 浙江工业大学精弘网络技术团队
    </div>
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

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-sep {
  color: #6b7280;
  font-size: 0.875rem;
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
