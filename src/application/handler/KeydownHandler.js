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
      if (!this.video) this.postMsgToAllFrames(data);
    });
  },
  keydownHandler(event) {
    const activeTagName = document.activeElement.tagName;
    if (["INPUT", "TEXTAREA"].includes(activeTagName)) return;
    const hotKey = event.key.toUpperCase();
    this.execHotKeyActions(hotKey);
    // 解决video在iframe中，不聚焦到iframe，倍速设置失败问题
    if (window.top === window && !this.video) this.postMsgToAllFrames({ hotKey });
  },
  execHotKeyActions(key) {
    const clickEl = (name, index) => {
      if (!this.isBiliLive()) return this.query(selectorConfig[location.host]?.[name])?.click();
      const control = this.getBiliLiveIcons();
      if (control) control[index]?.click();
    };
    const actions = {
      N: () => clickEl("next"),
      F: () => clickEl("full", 0),
      D: () => clickEl("danmaku", 3),
      A: () => this.adjPlayRate(INC_SYMBOL),
      S: () => this.adjPlayRate(DEC_SYMBOL),
      Z: () => this.setPlayRate(1) && this.showToast("已恢复正常倍速播放"),
    };
    actions[ASTERISK] = () => this.getPlayingVideo();
    actions[INC_SYMBOL] = () => this.adjPlayRate(INC_SYMBOL); // +倍速
    actions[DEC_SYMBOL] = () => this.adjPlayRate(DEC_SYMBOL); // -倍速

    if (actions[key]) actions[key]();
    if (/^[1-9]$/.test(key)) this.setPlayRate(key) && this.showRateTip(); // 倍速
    if (Object.is("P", key)) this.inMatches() ? clickEl("webfull", 1) : this.enhance(); // 网页全屏
  },
  getPlayingVideo() {
    // 获取正在播放的video
    const videos = this.querys("video");
    for (const video of videos) {
      if (this.video === video || video.paused || !this.validVideoDur(video)) continue;
      this.rebindVideoEvtListener(video);
      return;
    }
  },
  getBiliLiveIcons() {
    const video = this.getVideo();
    if (!video) return;
    this.simuMousemove(video);
    // 图标是从右到左：全屏、网页全屏、弹幕设置、弹幕开关、小窗模式，即下标[0]取到的是全屏图标
    return this.querys("#web-player-controller-wrap-el .right-area .icon");
  },
  postMsgToAllFrames(data) {
    const ifrs = this.querys("iframe");
    ifrs.forEach((ifr) => ifr?.contentWindow?.postMessage({ source: MSG_SOURCE, ...data }, "*"));
  },
  simuMousemove(target) {
    // 模拟鼠标移动
    const y = target.offsetHeight / 2;
    const w = target.offsetWidth;
    const moveEvt = (x) => {
      const evt = new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true });
      target.dispatchEvent(evt);
    };
    for (let i = 0; i < w; i += 100) moveEvt(i);
  },
};
