// 针对 https://greasyfork.org/zh-CN/scripts/495077-maximize-video-improve
// 不需要滑动鼠标获取video，按`P`键即可网页全屏
export default {
  enhance() {
    const target = this.getHoverEl();
    this.simuMouseover(target);
    this.triggerKeydownEvt();
  },
  getHoverEl() {
    if (this.hoverEl) return this.hoverEl;
    if (this.video) {
      this.hoverEl = this.video?.parentElement?.parentElement;
      return this.hoverEl;
    }

    // 只适用于video距离浏览器顶部不是很远的距离
    // 获取父窗口的所有iframe，根据video的中心点坐标，判断是否有iframe与其重合
    const iframes = this.querys("iframe[src]");
    const { x, y } = this.videoGeo;
    for (const element of iframes) {
      const rect = element.getBoundingClientRect();
      const isInRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (!isInRect) continue;
      return (this.hoverEl = element);
    }
  },
  simuMouseover(element) {
    // 模拟鼠标悬停
    if (!element) return;
    const x = element.offsetWidth / 2;
    const y = element.offsetHeight / 2;
    const evt = new MouseEvent("mouseover", { clientX: x, clientY: y, bubbles: true });
    element.dispatchEvent(evt);
  },
  triggerKeydownEvt() {
    // 触发键盘`esc`按键
    if (!this.video) return;
    document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27, bubbles: true }));
  },
};
