import constants from "../common/constants";
import selectorConfig from "../common/selectorConfig";
const { MSG_SOURCE, ASTERISK, INC_SYMBOL, DEC_SYMBOL } = constants;

// 快捷键逻辑处理
export default {
  setupKeydownListener() {
    const handler = (event) => this.keydownHandler.call(this, event);
    window.addEventListener("keydown", handler, true);
    window.addEventListener("message", (event) => {
      const { data } = event;
      if (!data?.source) return;
      // console.log("接收到消息：", data);
      if (!data.source.includes(MSG_SOURCE)) return;
      if (data?.videoGeo) this.videoGeo = data.videoGeo;
      if (data?.hotKey) this.execHotKeyActions(data.hotKey);
      // video在iframe中，继续往下派遣键盘事件
      if (!this.video) this.postMessageToAllIframes(data);
    });
  },
  keydownHandler(event) {
    const activeTagName = document.activeElement.tagName;
    if (["INPUT", "TEXTAREA"].includes(activeTagName)) return;
    const hotKey = event.key.toUpperCase();
    this.execHotKeyActions(hotKey);
    // 解决video在iframe中，不聚焦到iframe，倍速设置失败问题
    if (window.top === window && !this.video) this.postMessageToAllIframes({ hotKey });
  },
  execHotKeyActions(key) {
    const clickElement = (name, index) => {
      if (!this.isBiliLive()) {
        document.querySelector(selectorConfig[location.host]?.[name])?.click();
        return;
      }
      const control = this.getBiliLiveControlIcons();
      if (control) control[index]?.click();
    };
    const actions = {
      N: () => clickElement("next"),
      F: () => clickElement("full", 0),
      D: () => clickElement("danmaku", 3),
      A: () => this.stepPlaybackRate(INC_SYMBOL),
      S: () => this.stepPlaybackRate(DEC_SYMBOL),
      Z: () => this.setPlaybackRate(1) && this.showToast("已恢复正常倍速播放"),
    };
    actions[ASTERISK] = () => this.getPlayingVideo();
    actions[INC_SYMBOL] = () => this.stepPlaybackRate(INC_SYMBOL); // 倍速加
    actions[DEC_SYMBOL] = () => this.stepPlaybackRate(DEC_SYMBOL); // 倍速减

    if (actions[key]) actions[key]();
    if (/^[1-9]$/.test(key)) this.setPlaybackRate(key) && this.tipPlaybackRate(); // 倍速
    if (Object.is("P", key)) this.inMatches() ? clickElement("webfull", 1) : this.enhance(); // 网页全屏
  },
  getPlayingVideo() {
    // 获取正在播放的video
    const videos = document.querySelectorAll("video");
    for (const video of videos) {
      if (this.video === video || video.paused || !this.videoCanUse(video)) continue;
      this.rebindVideoEventsListener(video);
      return;
    }
  },
  getBiliLiveControlIcons() {
    const video = this.getVideo();
    if (!video) return;
    this.simulateMousemove(video);
    // 图标是从右到左：全屏、网页全屏、弹幕设置、弹幕开关、小窗模式，即下标[0]取到的是全屏图标
    return document.querySelectorAll("#web-player-controller-wrap-el .right-area .icon");
  },
  postMessageToAllIframes(data) {
    document.querySelectorAll("iframe").forEach((iframe) => {
      iframe?.contentWindow?.postMessage({ source: MSG_SOURCE, ...data }, "*");
    });
  },
  simulateMousemove(target) {
    // 模拟鼠标移动
    const y = target.offsetHeight / 2;
    const maxWidth = target.offsetWidth;
    const moveEvent = (x) => {
      const event = new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true });
      target.dispatchEvent(event);
    };
    for (let i = 0; i < maxWidth; i += 100) moveEvent(i);
  },
};
