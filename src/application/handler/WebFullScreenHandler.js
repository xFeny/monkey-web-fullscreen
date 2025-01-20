import constants from "../common/constants";
const { ONE_SEC, BILI_VID_REG } = constants;
// 网页全屏逻辑处理
export default {
  isFull() {
    return window.innerWidth === this.video.offsetWidth;
  },
  webFullScreen(video) {
    const w = video.offsetWidth;
    if (0 === w) return false;
    if (window.innerWidth === w) return true;
    if (this.isBiliLive()) return this.biliLiveFullScr();
    this.element.click();
    this.blibliExtras(video);
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
  blibliExtras(video) {
    // 自动关闭B站未登录状态下观看视频1分钟时的登录提示
    if (!BILI_VID_REG.test(location.href)) return;
    if (document.cookie.includes("DedeUserID")) return;
    setTimeout(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (!video.paused) return;
          if (mutation.nextSibling.tagName !== "DIV") return;
          const close = this.query(".bili-mini-close-icon", mutation.nextSibling);
          if (!close) return;
          video.play();
          close.click();
          if (!this.isFull()) this.element.click();
          observer.disconnect();
        });
      });
      observer.observe(document.body, { childList: true });
      setTimeout(() => observer.disconnect(), ONE_SEC * 70);
    }, ONE_SEC * 10);
  },
};
