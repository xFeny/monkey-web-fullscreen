// 针对 https://greasyfork.org/zh-CN/scripts/495077-maximize-video-improve
// 不需要滑动鼠标获取video，按`P`键即可网页全屏
export default {
  enhance() {
    const target = this.getHoverElement();
    this.simulateMouseover(target);
    this.triggerKeydownEvent();
  },
  getHoverElement() {
    if (this.hoverElement) return this.hoverElement;
    if (this.video) {
      this.hoverElement = this.video?.parentElement?.parentElement;
      return this.hoverElement;
    }

    // 只适用于video距离浏览器顶部不是很远的距离
    // 获取父窗口的所有iframe，根据video的中心点坐标，判断是否有iframe与其重合
    const iframes = document.querySelectorAll("iframe[src]");
    const { x, y } = this.videoGeo;
    for (const element of iframes) {
      const rect = element.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        this.hoverElement = element;
        return element;
      }
    }
  },
  simulateMouseover(element) {
    // 模拟鼠标悬停
    if (!element) return;
    const x = element.offsetWidth / 2;
    const y = element.offsetHeight / 2;
    const mouseover = new MouseEvent("mouseover", { clientX: x, clientY: y, bubbles: true });
    element.dispatchEvent(mouseover);
  },
  triggerKeydownEvent() {
    // 触发键盘`esc`按键
    if (!this.video) return;
    document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27, bubbles: true }));
  },
};
