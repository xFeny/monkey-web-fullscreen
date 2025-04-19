import douyu from "./douyu";
import constants from "../common/constants";
import selectorConfig from "../common/selectorConfig";
const {
  EMPTY,
  KEYCODE,
  ASTERISK,
  MSG_SOURCE,
  INC_SYMBOL,
  DEC_SYMBOL,
  MUL_SYMBOL,
  DIV_SYMBOL,
  VIDEO_REWIND,
  VIDEO_FORWARD,
  VIDEO_TIME_STEP,
  VIDEO_FASTFORWARD_DURATION,
} = constants;

// 快捷键逻辑处理
export default {
  setupKeydownListener() {
    window.addEventListener("focus", () => (this.isFocused = true));
    window.addEventListener("blur", () => (this.isFocused = false));
    window.addEventListener("keydown", (event) => this.keydownHandler.call(this, event), true);
    window.addEventListener("message", (event) => {
      const { data } = event;
      if (!data?.source) return;
      // console.log("接收到消息：", data, location.href);
      if (!data.source.includes(MSG_SOURCE)) return;
      if (data?.videoGeo) return (this.videoGeo = data.videoGeo);
      if (data?.reloadVideoFrame) return this.reloadVideoFrame();
      if (data?.isCloseKeyboard) return this.switchKeyboard(data?.isCloseKeyboard);
      this.processEvent(data);
    });
  },
  keydownHandler(event) {
    // console.log(event, this.video, this.videoGeo);
    if (!this.video && !this.videoGeo) return; // 不是视频页
    const { altKey, shiftKey } = event;
    let key = event.key.toUpperCase();
    let code = event.code.toUpperCase();
    if (key === KEYCODE.SPACE) key = code;
    if (shiftKey && key === INC_SYMBOL) key = MUL_SYMBOL; // shift + 组合快捷键
    if (shiftKey && key === DEC_SYMBOL) key = DIV_SYMBOL; // shift - 组合快捷键
    if (altKey && key === DEC_SYMBOL) key = VIDEO_REWIND; // alt - 组合快捷键
    if (altKey && key === INC_SYMBOL) key = VIDEO_FORWARD; // alt + 组合快捷键
    if (["INPUT", "TEXTAREA", "DEMAND-SEARCH-BOX"].includes(event.target.tagName)) return;
    if (!this.isTopWin() && !this.inMatches() && key === KEYCODE.P) return this.postMessage(window.top, { key });
    if (altKey || (["SPACE", "ARROWLEFT", "ARROWRIGHT"].includes(key) && !this.isCloseKeyboard())) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    this.processEvent({ key });
  },
  processEvent(data) {
    // video可能在iframe中，向iframe传递事件
    if (!this.video) this.postMsgToFrames(data);
    if (data?.key) this.execHotKeyActions(data.key);
  },
  execHotKeyActions(key) {
    // console.log({ key });
    const clickEl = (name, index) => {
      if (!this.isBiliLive()) return this.query(selectorConfig[location.host]?.[name])?.click();
      const control = this.getBiliLiveIcons();
      if (control) control[index]?.click();
    };
    const actions = {
      N: () => clickEl("next"),
      A: () => this.adjustPlayRate(INC_SYMBOL),
      S: () => this.adjustPlayRate(DEC_SYMBOL),
      [ASTERISK]: () => this.getPlayingVideo(),
      [INC_SYMBOL]: () => this.adjustPlayRate(INC_SYMBOL),
      [DEC_SYMBOL]: () => this.adjustPlayRate(DEC_SYMBOL),
      [MUL_SYMBOL]: () => this.adjustPlayRate(MUL_SYMBOL),
      [DIV_SYMBOL]: () => this.adjustPlayRate(DIV_SYMBOL),
      Z: () => this.setPlayRate(1) && this.showToast("已恢复正常倍速播放"),
      F: () => (this.isDouyu() ? douyu.getFullIcon().click() : clickEl("full", 0)),
      D: () => (this.isDouyu() ? douyu.getDanmakuIcon().click() : clickEl("danmaku", 3)),
      ARROWLEFT: () => (!this.ignoreKeyboard() ? this.adjustVideoTime(DEC_SYMBOL) : null),
      ARROWRIGHT: () => (!this.ignoreKeyboard() ? this.adjustVideoTime() : null),
      [VIDEO_REWIND]: () => this.adjustVideoTime(DEC_SYMBOL),
      [VIDEO_FORWARD]: () => this.adjustVideoTime(),
      0: () => this.adjustVideoTime(VIDEO_FASTFORWARD_DURATION.value()),
      SPACE: () => {
        if (this.ignoreKeyboard()) return;
        if (this.isDouyu()) return this.video.paused ? douyu.play() : douyu.pause();
        this.video.paused
          ? this.video.play().catch(() => {
              if (!this.videoGeo.frameSrc) return this.showToast("请手动点击播放");
              this.postMessage(window.parent, { reloadVideoFrame: true }); // 某些网站刷新iframe后会自动播放
            })
          : this.video.pause();
      },
      P: () => {
        if (!this.inMatches()) return this.enhance();
        this.isDouyu() ? douyu.getWebfullIcon().click() : clickEl("webfull", 1);
      },
    };
    if (actions[key]) actions[key]();
    if (/^[1-9]$/.test(key)) this.setPlayRate(key) && this.showRateTip(); // 倍速
  },
  adjustVideoTime(second = VIDEO_TIME_STEP.value(), _symbol) {
    if (!this.video) return;
    if (_symbol && ![INC_SYMBOL, DEC_SYMBOL].includes(_symbol)) return;
    if (Object.is(typeof second, typeof EMPTY) && !_symbol) {
      _symbol = second;
      second = VIDEO_TIME_STEP.value();
    }
    this.video.currentTime += Object.is(DEC_SYMBOL, _symbol) ? -second : second;
  },
  ignoreKeyboard() {
    // 腾讯视频无法接管，使用自身
    return !this.video || this.isTencent() || this.isCloseKeyboard();
  },
  reloadVideoFrame() {
    if (!this.isTopWin()) return; // 只对一层iframe嵌套操作
    const iframe = this.getVideoIframe(); // video所在的iframe
    if (!iframe) return;
    iframe.setAttribute("src", iframe.src);
  },
  getBiliLiveIcons() {
    const video = this.getVideo();
    if (!video) return;
    this.simuMousemove(video);
    // 图标是从右到左：全屏、网页全屏、弹幕设置、弹幕开关、小窗模式，即下标[0]取到的是全屏图标
    return this.querys("#web-player-controller-wrap-el .right-area .icon");
  },
  postMsgToFrames(data) {
    this.querys("iframe:not([src=''])").forEach((iframe) => this.postMessage(iframe.contentWindow, data));
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
