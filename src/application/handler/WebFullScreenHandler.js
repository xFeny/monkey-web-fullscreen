import constants from "../common/constants";
const { ONE_SEC, QQ_VID_REG, BILI_VID_REG } = constants;
// 网页全屏逻辑处理
export default {
  isFull() {
    return window.innerWidth === this.video.offsetWidth;
  },
  webFullScreen(video) {
    const w = video.offsetWidth;
    if (0 === w) return false;
    if (window.innerWidth === w) return true;
    if (this.isBiliLive()) return this.biliLiveWebFullScreen();
    this.element.click();
    return true;
  },
  biliLiveWebFullScreen() {
    try {
      const win = unsafeWindow.top;
      win.scrollTo({ top: 70 });
      const el = Object.is(win, window)
        ? this.query("#player-ctnr")
        : this.query(":is(.lite-room, #player-ctnr)", win.document);
      // iframe嵌套直播间如果不滚动，nav导航栏不会自动隐藏
      win.scrollTo({ top: el?.getBoundingClientRect()?.top || 0 });
      this.element.dispatchEvent(new Event("dblclick", { bubbles: true }));
      localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0); // 关闭全屏礼物栏
      document.body.classList.add("hide-asida-area", "hide-aside-area"); // 关闭侧边聊天栏
      win?.livePlayer?.volume(100); // 声音100%
      win?.livePlayer?.switchQuality("10000"); // 原画画质
    } catch (error) {
      console.error("B站直播自动网页全屏异常：", error);
    }
    return true;
  },
  webFullScreenExtras() {
    this.biliVideoExtras();
    this.tencentVideoExtras();
  },
  tencentVideoExtras() {
    if (!QQ_VID_REG.test(location.href)) return;
    // 自动关闭腾讯视频登录弹窗
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length === 0) return;
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (!node.matches(".login-dialog-wrapper")) return;
          this.query(".main-login-wnd-module_close-button__mt9WU")?.click();
          observer.disconnect();
        });
      });
    });
    observer.observe(this.query("#login_win"), { attributes: true, childList: true, subtree: true });
  },
  biliVideoExtras() {
    if (!BILI_VID_REG.test(location.href)) return;
    if (document.cookie.includes("DedeUserID")) return player?.requestQuality(80); // 清晰度设置为 1080P
    // 自动关闭B站未登录观看视频1分钟左右的登录弹窗
    setTimeout(() => {
      unsafeWindow.__BiliUser__.isLogin = true;
      unsafeWindow.__BiliUser__.cache.data.isLogin = true;
      unsafeWindow.__BiliUser__.cache.data.mid = Date.now();
    }, ONE_SEC * 3);
  },
};
