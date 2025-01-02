// 网页全屏逻辑处理
export default {
  webFullScreen(video) {
    const w = video.offsetWidth;
    if (0 === w) return false;
    if (window.innerWidth === w) return true;
    if (isBiliLive()) return this.biliLiveWebFullScreen();
    this.element.click();
    return true;
  },
  biliLiveWebFullScreen() { // B站直播间网页全屏
    try {
      const topWin = unsafeWindow.top;
      topWin.scrollTo({ top: 70 });
      const ctnr = Object.is(topWin, window)
        ? document.querySelector("#player-ctnr")
        : topWin.document.querySelector(".lite-room");
      // iframe嵌套直播间如果不滚动，nav导航栏不会自动隐藏
      topWin.scrollTo({ top: ctnr?.getBoundingClientRect()?.top || 0 });
      this.element.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0); // 关闭全屏礼物栏
      document.body.classList.add("hide-asida-area", "hide-aside-area"); // 关闭侧边聊天栏
      setTimeout(() => {
        document.querySelector("#shop-popover-vm")?.remove(); // 关闭不支持“小橙车”提示
        document.querySelector("#sidebar-vm")?.remove();
      }, 500);
      topWin?.livePlayer?.volume(100); // 声音100%
      topWin?.livePlayer?.switchQuality("10000"); // 原画画质
    } catch (error) {
      console.error("B站直播自动网页全屏异常：", error);
    }
    return true;
  },
};
