// 网页全屏逻辑处理
export default {
  webFullScreen(video) {
    const w = video.offsetWidth;
    if (0 === w) return false;
    if (window.innerWidth === w) return true;
    if (this.isBiliLive()) return this.biliLiveFullScr();
    this.element.click();
    return true;
  },
  biliLiveFullScr() {
    try {
      const win = unsafeWindow.top;
      win.scrollTo({ top: 70 });
      const el = Object.is(win, window) ? this.query("#player-ctnr") : this.query(".lite-room", win.document);
      // iframe嵌套直播间如果不滚动，nav导航栏不会自动隐藏
      win.scrollTo({ top: el?.getBoundingClientRect()?.top || 0 });
      this.element.dispatchEvent(new Event("dblclick", { bubbles: true }));
      localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0); // 关闭全屏礼物栏
      document.body.classList.add("hide-asida-area", "hide-aside-area"); // 关闭侧边聊天栏
      setTimeout(() => {
        this.query("#shop-popover-vm")?.remove(); // 关闭不支持“小橙车”提示
        this.query("#sidebar-vm")?.remove();
      }, 500);
      win?.livePlayer?.volume(100); // 声音100%
      win?.livePlayer?.switchQuality("10000"); // 原画画质
    } catch (error) {
      console.error("B站直播自动网页全屏异常：", error);
    }
    return true;
  },
};
