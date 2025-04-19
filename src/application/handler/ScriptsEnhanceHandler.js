// 针对 https://greasyfork.org/zh-CN/scripts/495077-maximize-video-improve
// 不需要滑动鼠标获取video，按`P`键即可网页全屏
export default {
  enhance() {
    this.simuMouseover(this.getHoverEl());
    this.triggerKeydownEvt();
  },
  getHoverEl() {
    if (!this.videoGeo) return;
    if (this.hoverEl) return this.hoverEl;
    if (this.video) return (this.hoverEl = this.video?.parentElement?.parentElement);

    const { x, y } = this.videoGeo;
    const iframe = this.getVideoIframe(); // video所在的iframe
    if (iframe) return (this.hoverEl = iframe);

    // 获取父窗口的所有iframe，根据video的坐标，判断是否有iframe与其重合
    const iframes = this.querys("iframe:not([src=''])");
    for (const element of iframes) {
      const rect = element.getBoundingClientRect();
      const isInRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (!isInRect) continue;
      return (this.hoverEl = element);
    }
  },
  simuMouseover(element) {
    console.log("鼠标悬停网页全屏元素：", element);
    if (!element) return;
    const x = element.offsetWidth / 2;
    const y = element.offsetHeight / 2;
    element?.dispatchEvent(new MouseEvent("mouseover", { clientX: x, clientY: y, bubbles: true }));
  },
  triggerKeydownEvt() {
    // 触发键盘`esc`按键
    if (!this.video) return;
    document?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true }));
  },
};
