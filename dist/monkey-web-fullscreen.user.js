// ==UserScript==
// @name         视频网站自动网页全屏｜倍速播放
// @namespace    http://tampermonkey.net/
// @version      2.6.0
// @author       Feny
// @description  支持哔哩哔哩、B站直播、腾讯视频、优酷视频、爱奇艺、芒果TV、搜狐视频、AcFun弹幕网自动网页全屏；快捷键切换：全屏(F)、网页全屏(P)、下一个视频(N)、弹幕开关(D)；支持任意视频倍速播放，提示记忆倍速；B站播放完自动退出网页全屏和取消连播。
// @license      GPL-3.0-only
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqdJREFUWEftl91LFFEYxp/3jB9ESZjtSl51F1RUSgRCF/kHlF1IhiFhF65dqEQkBUErdJMStBukGwQre2NZUiCRqUiURkW65mIfqGUFsW6Ii0jY7p4Tc3Rqd5zaGVldAudynve8z28e3jMzh5Dmi1R/V0vQyRRWxgWG6x22SrcnOAhQcQIbwVtXba8y1EANSpS1xzJin5c/Dz+jRDPvGWoErwRw35zuh8ChpcXXFjbwi9k/WADA9viGgovGnxtFs6EmcApMvCdBA3oIIirl4N8NNQngmRYJiwTOE7EHHLERAmXFawQ6AdCQkRbjsZIMUvIFoV0HMSsEDjCgSK8tJqAHAEDAMWLKLOexx8tiVVDEhLLVQAtzRPcwKOUANSWCw1/rsBe6PcFz8dpfAdTFgtF+EmIvBG7pID7mZNl2zkVCFQbahzqHfYerddpNhFpdsnfqauzl8ZoEuO4JXdIKOefynnZlimxXhBbqjTZL/el8pzrAVjTGmKh12Bq1ddJs974abQDXfFMuAhQ6EodwDTHWAf6/BAoK8nD0cDEKtuVhyD+OzvvLXnyWJshyApedJ1F65M9n4tlAAF5fL168fGfJWCu2DDA61GpodLvjCdp8vfjyNWQJJGUAquvMzBzafD0yEc65KZCUAmiOo4FPEqS753VSiFUB0FxbPF244en6J8SqAoTD8zhYcjZ9AP6RCVRWNacHYPD5GJqudmBi8tvaAkxNBeUuuNv5NOkAqgUpm4FIJCrfA+r0z4bnTZmvCKCv+wrsts0JBg8fvZLGY28NfoqToFhOoOJ4CS40lMu2I28mpXFP37DpJ9YXWgZQG+Tm5mBL7qakA2aGakUAZhqbrVkH0BLoB34fzcyml5K6pd/yaicRlQlgV0q6mmwitMOpyfpVKfsFya4w73cz9xQAAAAASUVORK5CYII=
// @homepage     https://github.com/xFeny/monkey-web-fullscreen
// @include      *://pages.iqiyi.com/p/zy/*
// @include      *://www.ezdmw.site/Index/video/*
// @include      *://player.ezdmw.com/danmuku/*
// @include      *://*bimiacg*.net/*/play*
// @include      *://acgfta.com/play*
// @include      *://ppoft.com/play*
// @match        *://tv.sohu.com/v/*
// @match        *://www.mgtv.com/b/*
// @match        *://www.acfun.cn/v/*
// @match        *://www.iqiyi.com/v_*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/x/cover/*
// @match        *://haokan.baidu.com/v*
// @match        *://live.bilibili.com/*
// @match        *://v.youku.com/v_show/*
// @match        *://live.acfun.cn/live/*
// @match        *://www.acfun.cn/bangumi/*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/*/play/*
// @match        *://v.qq.com/live/p/newtopic/*
// @match        *://www.bilibili.com/festival/*
// @match        *://v.douyu.com/show/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @note         *://*/*
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(' @charset "UTF-8";.showToast{color:#fff!important;font-size:13.5px!important;padding:5px 15px!important;border-radius:5px!important;position:absolute!important;z-index:2147483647!important;font-weight:400!important;transition:opacity .5s ease-in;background:#000000bf!important}#bilibili-player .bpx-player-toast-wrap,#bilibili-player .bpx-player-cmd-dm-wrap,#bilibili-player .bpx-player-dialog-wrap,.live-room-app #sidebar-vm,.live-room-app #prehold-nav-vm,.live-room-app #shop-popover-vm,.login-tip{display:none!important} ');

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const positions = Object.freeze({
    bottomLeft: "bottom: 17%; left: 10px;",
    center: "top: 50%; left: 50%; transform: translate(-50%, -50%);"
  });
  const keyCode = (() => {
    const result = {};
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      result[letter] = letter;
    }
    return result;
  })();
  const ONE_SECOND = 1e3;
  const constants = Object.freeze({
    EMPTY: "",
    ASTERISK: "*",
    INC_SYMBOL: "+",
    DEC_SYMBOL: "-",
    MUL_SYMBOL: "×",
    DIV_SYMBOL: "÷",
    DEF_PLAY_RATE: 1,
    MAX_PLAY_RATE: 16,
    ONE_SEC: ONE_SECOND,
    VIDEO_REWIND: "VIDEO_REWIND",
    VIDEO_FORWARD: "VIDEO_FORWARD",
    SHOW_TOAST_TIME: ONE_SECOND * 5,
    SHOW_TOAST_POSITION: positions.bottomLeft,
    MSG_SOURCE: "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN",
    CACHED_PLAY_RATE_KEY: "FENY_SCRIPTS_V_PLAYBACK_RATE",
    CLOSE_AUTO_WEB_FULL_KEY: "CLOSE_AUTO_WEB_FULL_SCREEN",
    KEYBOARD_COMMAND_KEY: "KEYBOARD_COMMAND",
    QQ_VID_REG: /v.qq.com\/x/,
    ACFUN_VID_REG: /acfun.cn\/v/,
    IQIYI_VID_REG: /iqiyi.com\/v_*/,
    BILI_VID_REG: /bilibili.com\/video/,
    KEYCODE: Object.freeze({ ...keyCode, SPACE: " " }),
    VIDEO_FASTFORWARD_DURATION: {
      name: "VIDEO_FASTFORWARD_DURATION",
      value() {
        return Number.parseInt(_GM_getValue(this.name, 30));
      }
    },
    VIDEO_TIME_STEP: {
      name: "VIDEO_TIME_STEP",
      value() {
        return Number.parseInt(_GM_getValue(this.name, 5));
      }
    },
    PLAY_RATE_STEP: {
      name: "PLAY_RATE_STEP",
      value() {
        return Number.parseFloat(_GM_getValue(this.name, 0.25));
      }
    }
  });
  const selectorConfig = {
    "live.bilibili.com": { webfull: "#businessContainerElement" },
    "www.bilibili.com": { webfull: "div[aria-label='网页全屏']", next: ".bpx-player-ctrl-next" },
    "live.acfun.cn": { full: ".fullscreen-screen", webfull: ".fullscreen-web", danmaku: ".danmaku-enabled" },
    "tv.sohu.com": { full: ".x-fullscreen-btn", webfull: ".x-pagefs-btn", danmaku: ".tm-tmbtn", next: ".x-next-btn" },
    "haokan.baidu.com": { full: ".art-icon-fullscreen", webfull: ".art-control-fullscreenWeb", next: ".art-control-next" },
    "www.iqiyi.com": { full: ".iqp-btn-fullscreen", webfull: ".iqp-btn-webscreen", danmaku: "#barrage_switch", next: ".iqp-btn-next" },
    "www.mgtv.com": { full: ".fullscreenBtn i", webfull: ".webfullscreenBtn i", danmaku: "div[class*='danmuSwitch']", next: ".icon-next" },
    "v.qq.com": { full: ".txp_btn_fullscreen", webfull: "div[aria-label='网页全屏']", danmaku: ".barrage-switch", next: ".txp_btn_next_u" },
    "v.pptv.com": { full: ".w-zoom-container > div", webfull: ".w-expand-container > div", danmaku: ".w-barrage", next: ".w-next-container" },
    "www.acfun.cn": { full: ".fullscreen-screen", webfull: ".fullscreen-web", danmaku: ".danmaku-enabled", next: ".btn-next-part .control-btn" },
    "v.youku.com": { full: "#fullscreen-icon", webfull: "#webfullscreen-icon", danmaku: "div[class*='switch-img_12hDa turn-']", next: ".kui-next-icon-0" }
  };
  const { DEF_PLAY_RATE: DEF_PLAY_RATE$1, BILI_VID_REG: BILI_VID_REG$1, ACFUN_VID_REG } = constants;
  const VideoListenerHandler = {
    loadedmetadata() {
      this.volume = 1;
      this.isToast = false;
    },
    loadeddata() {
      this.volume = 1;
      this.isToast = false;
    },
    timeupdate() {
      if (this.duration === NaN) return;
      const cachePlayRate = App.getCachePlayRate();
      if (!cachePlayRate || DEF_PLAY_RATE$1 === cachePlayRate) return;
      if (cachePlayRate === this.playbackRate) return;
      const reuslt = App.setPlayRate(cachePlayRate);
      if (!reuslt) return;
      if (this.isToast) return;
      App.showRateTip();
      this.isToast = true;
    },
    play() {
      this.isEnded = false;
      App.webFullScreen(this);
    },
    ended() {
      this.isEnded = true;
      this.isToast = false;
      const href = location.href;
      if (!BILI_VID_REG$1.test(href) && !ACFUN_VID_REG.test(href)) return;
      const pod = App.query(".video-pod");
      const pods = App.querys('.video-pod .switch-btn:not(.on), .video-pod__item:last-of-type[data-scrolled="true"]');
      if (!pod || pods.length > 0) App.exitWebFullScreen();
    }
  };
  const douyu = {
    getRoot() {
      return document.querySelector("demand-video").shadowRoot;
    },
    getControllerBar() {
      return this.getRoot().querySelector("#demandcontroller-bar").shadowRoot;
    },
    getVideo() {
      return this.getRoot().querySelector("video");
    },
    play() {
      this.getControllerBar().querySelector(".ControllerBarPlay").click();
    },
    pause() {
      this.getControllerBar().querySelector(".ControllerBarStop").click();
    },
    getWebfullIcon() {
      return this.getControllerBar().querySelector(".ControllerBar-PageFull-Icon");
    },
    getFullIcon() {
      return this.getControllerBar().querySelector(".ControllerBar-WindowFull-Icon");
    },
    getDanmakuIcon() {
      return document.querySelector("demand-player-extension").shadowRoot.querySelector(".BarrageSwitch-icon");
    },
    addStyle() {
      const root = this.getRoot();
      let style = root.querySelector("style");
      if (style) return;
      style = document.createElement("style");
      style.textContent = `
      .showToast {
        color: #fff !important;
        font-size: 13.5px !important;
        padding: 5px 15px !important;
        border-radius: 5px !important;
        position: absolute !important;
        z-index: 2147483647 !important;
        font-weight: normal !important;
        transition: opacity 500ms ease-in;
        background: rgba(0, 0, 0, 0.75) !important;
      }
    `;
      root.prepend(style);
    }
  };
  const { ONE_SEC: ONE_SEC$1, QQ_VID_REG, MSG_SOURCE: MSG_SOURCE$1, SHOW_TOAST_TIME, SHOW_TOAST_POSITION } = constants;
  const matches = _GM_info.script.matches.filter((match) => match !== "*://*/*").map((match) => match.replace(/\*/g, "\\S+"));
  const App = {
    init() {
      this.setupHoverListener();
      this.registerMenuCommand();
      this.setupVisibleListener();
      this.setupKeydownListener();
      this.setupMutationObserver();
      this.setupUrlChangeListener();
    },
    isTopWin: () => window.top === window,
    isDouyu: () => location.host === "v.douyu.com",
    isTencent: () => QQ_VID_REG.test(location.href),
    isLivePage: () => location.href.includes("live"),
    isBiliLive: () => location.host === "live.bilibili.com",
    query: (selector, context) => (context || document).querySelector(selector),
    querys: (selector, context) => (context || document).querySelectorAll(selector),
    validVideoDur: (video) => !isNaN(video.duration) && video.duration !== Infinity,
    inMatches: () => matches.some((matche) => new RegExp(matche).test(location.href)),
    postMessage: (win = null, data) => win?.postMessage({ source: MSG_SOURCE$1, ...data }, "*"),
    getVideo() {
      return this.isDouyu() ? douyu.getVideo() : this.query("video:not([src=''])") || this.querys("video");
    },
    getElement() {
      return this.isDouyu() ? douyu.getWebfullIcon() : document.querySelector(selectorConfig[location.host]?.webfull);
    },
    getVideoIframe() {
      if (!this.videoGeo.frameSrc) return null;
      const url = new URL(this.videoGeo.frameSrc);
      const src = decodeURI(url.pathname + url.search);
      return this.query(`iframe[src*="${src}"]`);
    },
    debounce(fn, delay = ONE_SEC$1) {
      let timer;
      return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), delay);
      };
    },
    setupVisibleListener() {
      window.addEventListener("visibilitychange", () => {
        window.top.focus();
        const video = this.isLivePage() ? this.getVideo() : this.video;
        if (video?.isEnded) return;
        document.hidden ? video?.pause() : video?.play();
      });
    },
    setupHoverListener() {
      if (this.inMatches()) return;
      document.addEventListener("mouseover", (event) => {
        const x = event.clientX;
        const y = event.clientY;
        const videos = this.querys("video");
        for (const video of videos) {
          const rect = video.getBoundingClientRect();
          const isInRect = rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y;
          if (!isInRect) continue;
          if (this.video === video) return;
          if (this.validVideoDur(video)) return this.rebindVideoEvtListener(video);
        }
      });
    },
    setupUrlChangeListener() {
      const _wr = (method) => {
        const original = history[method];
        history[method] = function() {
          original.apply(history, arguments);
          window.dispatchEvent(new Event(method));
        };
      };
      const handler = this.debounce(() => this.setupMutationObserver());
      ["popstate", "pushState", "replaceState"].forEach((t) => _wr(t) & window.addEventListener(t, handler));
    },
    setupMutationObserver() {
      const observer = new MutationObserver(() => {
        const video = this.getVideo();
        this.element = this.getElement();
        if (video?.play) this.setupVideoListener();
        if (video?.play && this.element) {
          const result = this.webFullScreen(video);
          if (!result) return;
          observer.disconnect();
          this.webFullScreenExtras();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), ONE_SEC$1 * 10);
    },
    video: null,
    rebindVideo: false,
    videoBoundListeners: [],
    setupVideoListener() {
      if (this.isLivePage()) return;
      this.addVideoEvtListener(this.getVideo());
      this.heartbeatCurrentVideo();
    },
    addVideoEvtListener(video) {
      this.video = video;
      this.setVideoGeo(video);
      this.removeVideoEvtListener();
      for (const type of Object.keys(VideoListenerHandler)) {
        const handler = VideoListenerHandler[type];
        this.video.addEventListener(type, handler);
        this.videoBoundListeners.push([this.video, type, handler]);
      }
    },
    removeVideoEvtListener() {
      this.videoBoundListeners.forEach((listener) => {
        const [target, type, handler] = listener;
        target.removeEventListener(type, handler);
      });
      this.videoBoundListeners = [];
    },
    rebindVideoEvtListener(video) {
      this.rebindVideo = true;
      this.addVideoEvtListener(video);
    },
    getPlayingVideo() {
      const videos = this.querys("video");
      if ([0, 1].includes(videos.length)) return true;
      for (const video of videos) {
        if (this.video === video || video.paused || !this.validVideoDur(video)) continue;
        this.rebindVideoEvtListener(video);
        return;
      }
    },
    heartbeatCurrentVideo() {
      let intervalID = null;
      if (intervalID) return;
      intervalID = setInterval(() => {
        const result = this.getPlayingVideo();
        if (result) clearInterval(intervalID);
      }, ONE_SEC$1);
    },
    setVideoGeo(video) {
      try {
        const rect = video.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const videoGeo = this.videoGeo = { x, y, frameSrc: !this.isTopWin() ? location.href : null };
        if (!this.isTopWin()) parent.postMessage({ source: MSG_SOURCE$1, videoGeo }, "*");
      } catch (e) {
      }
    },
    showToast(content, duration = SHOW_TOAST_TIME) {
      if (this.isDouyu()) douyu.addStyle();
      const el = document.createElement("div");
      if (content instanceof HTMLElement) el.appendChild(content);
      if (Object.is(typeof content, "string")) el.textContent = content;
      el.setAttribute("class", "showToast");
      el.setAttribute("style", SHOW_TOAST_POSITION);
      const target = this.video?.parentElement?.parentElement;
      this.query(".showToast", target)?.remove();
      target?.appendChild(el);
      setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => el.remove(), ONE_SEC$1 / 2);
      }, duration);
    }
  };
  const {
    EMPTY,
    KEYCODE,
    ASTERISK,
    MSG_SOURCE,
    INC_SYMBOL: INC_SYMBOL$1,
    DEC_SYMBOL: DEC_SYMBOL$1,
    MUL_SYMBOL: MUL_SYMBOL$1,
    DIV_SYMBOL: DIV_SYMBOL$1,
    VIDEO_REWIND,
    VIDEO_FORWARD,
    VIDEO_TIME_STEP: VIDEO_TIME_STEP$1,
    VIDEO_FASTFORWARD_DURATION: VIDEO_FASTFORWARD_DURATION$1
  } = constants;
  const KeydownHandler = {
    setupKeydownListener() {
      window.addEventListener("focus", () => this.isFocused = true);
      window.addEventListener("blur", () => this.isFocused = false);
      window.addEventListener("keydown", (event) => this.keydownHandler.call(this, event), true);
      window.addEventListener("message", (event) => {
        const { data } = event;
        if (!data?.source) return;
        if (!data.source.includes(MSG_SOURCE)) return;
        if (data?.videoGeo) return this.videoGeo = data.videoGeo;
        if (data?.reloadVideoFrame) return this.reloadVideoFrame();
        if (data?.isCloseKeyboard) return this.switchKeyboard(data?.isCloseKeyboard);
        this.processEvent(data);
      });
    },
    keydownHandler(event) {
      if (!this.video && !this.videoGeo) return;
      const { altKey, shiftKey } = event;
      let key = event.key.toUpperCase();
      let code = event.code.toUpperCase();
      if (key === KEYCODE.SPACE) key = code;
      if (shiftKey && key === INC_SYMBOL$1) key = MUL_SYMBOL$1;
      if (shiftKey && key === DEC_SYMBOL$1) key = DIV_SYMBOL$1;
      if (altKey && key === DEC_SYMBOL$1) key = VIDEO_REWIND;
      if (altKey && key === INC_SYMBOL$1) key = VIDEO_FORWARD;
      if (["INPUT", "TEXTAREA", "DEMAND-SEARCH-BOX"].includes(event.target.tagName)) return;
      if (!this.isTopWin() && !this.inMatches() && key === KEYCODE.P) return this.postMessage(window.top, { key });
      if (altKey || ["SPACE", "ARROWLEFT", "ARROWRIGHT"].includes(key) && !this.isCloseKeyboard()) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      this.processEvent({ key });
    },
    processEvent(data) {
      if (!this.video) this.postMsgToFrames(data);
      if (data?.key) this.execHotKeyActions(data.key);
    },
    execHotKeyActions(key) {
      const clickEl = (name, index) => {
        if (!this.isBiliLive()) return this.query(selectorConfig[location.host]?.[name])?.click();
        const control = this.getBiliLiveIcons();
        if (control) control[index]?.click();
      };
      const actions = {
        N: () => clickEl("next"),
        A: () => this.adjustPlayRate(INC_SYMBOL$1),
        S: () => this.adjustPlayRate(DEC_SYMBOL$1),
        [ASTERISK]: () => this.getPlayingVideo(),
        [INC_SYMBOL$1]: () => this.adjustPlayRate(INC_SYMBOL$1),
        [DEC_SYMBOL$1]: () => this.adjustPlayRate(DEC_SYMBOL$1),
        [MUL_SYMBOL$1]: () => this.adjustPlayRate(MUL_SYMBOL$1),
        [DIV_SYMBOL$1]: () => this.adjustPlayRate(DIV_SYMBOL$1),
        Z: () => this.setPlayRate(1) && this.showToast("已恢复正常倍速播放"),
        F: () => this.isDouyu() ? douyu.getFullIcon().click() : clickEl("full", 0),
        D: () => this.isDouyu() ? douyu.getDanmakuIcon().click() : clickEl("danmaku", 3),
        ARROWLEFT: () => !this.ignoreKeyboard() ? this.adjustVideoTime(DEC_SYMBOL$1) : null,
        ARROWRIGHT: () => !this.ignoreKeyboard() ? this.adjustVideoTime() : null,
        [VIDEO_REWIND]: () => this.adjustVideoTime(DEC_SYMBOL$1),
        [VIDEO_FORWARD]: () => this.adjustVideoTime(),
        0: () => this.adjustVideoTime(VIDEO_FASTFORWARD_DURATION$1.value()),
        SPACE: () => {
          if (this.ignoreKeyboard()) return;
          if (this.isDouyu()) return this.video.paused ? douyu.play() : douyu.pause();
          this.video.paused ? this.video.play().catch(() => {
            if (!this.videoGeo.frameSrc) return this.showToast("请手动点击播放");
            this.postMessage(window.parent, { reloadVideoFrame: true });
          }) : this.video.pause();
        },
        P: () => {
          if (!this.inMatches()) return this.enhance();
          this.isDouyu() ? douyu.getWebfullIcon().click() : clickEl("webfull", 1);
        }
      };
      if (actions[key]) actions[key]();
      if (/^[1-9]$/.test(key)) this.setPlayRate(key) && this.showRateTip();
    },
    adjustVideoTime(second = VIDEO_TIME_STEP$1.value(), _symbol) {
      if (!this.video) return;
      if (_symbol && ![INC_SYMBOL$1, DEC_SYMBOL$1].includes(_symbol)) return;
      if (Object.is(typeof second, typeof EMPTY) && !_symbol) {
        _symbol = second;
        second = VIDEO_TIME_STEP$1.value();
      }
      this.video.currentTime += Object.is(DEC_SYMBOL$1, _symbol) ? -second : second;
    },
    ignoreKeyboard() {
      return !this.video || this.isTencent() || this.isCloseKeyboard();
    },
    reloadVideoFrame() {
      if (!this.isTopWin()) return;
      const iframe = this.getVideoIframe();
      if (!iframe) return;
      iframe.setAttribute("src", iframe.src);
    },
    getBiliLiveIcons() {
      const video = this.getVideo();
      if (!video) return;
      this.simuMousemove(video);
      return this.querys("#web-player-controller-wrap-el .right-area .icon");
    },
    postMsgToFrames(data) {
      this.querys("iframe:not([src=''])").forEach((iframe) => this.postMessage(iframe.contentWindow, data));
    },
    simuMousemove(target) {
      const y = target.offsetHeight / 2;
      const w = target.offsetWidth;
      const moveEvt = (x) => {
        const evt = new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true });
        target.dispatchEvent(evt);
      };
      for (let i = 0; i < w; i += 100) moveEvt(i);
    }
  };
  const { CLOSE_AUTO_WEB_FULL_KEY, PLAY_RATE_STEP: PLAY_RATE_STEP$1, VIDEO_TIME_STEP, KEYBOARD_COMMAND_KEY, VIDEO_FASTFORWARD_DURATION } = constants;
  const MenuCommandHandler = {
    isCloseAuto: () => _GM_getValue(CLOSE_AUTO_WEB_FULL_KEY, false),
    isCloseKeyboard: () => _GM_getValue(KEYBOARD_COMMAND_KEY, true),
    registerMenuCommand() {
      this.setupPlayRateStepCommand();
      this.setupVideoTimeStepCommand();
      this.setupVideoFastforwardCommand();
      this.setupWebFullScreenCommand();
      this.setupKeyboardCommand();
    },
    setupPlayRateStepCommand() {
      const title = "设置倍速步进";
      _GM_registerMenuCommand(title, () => {
        const input = prompt(title, _GM_getValue(PLAY_RATE_STEP$1.name, 0.25));
        if (!isNaN(input) && Number.parseFloat(input)) _GM_setValue(PLAY_RATE_STEP$1.name, input);
      });
    },
    setupVideoTimeStepCommand() {
      if (this.isTencent()) return;
      const title = "设置快进/快退时长";
      _GM_registerMenuCommand(title, () => {
        const input = prompt(title, _GM_getValue(VIDEO_TIME_STEP.name, 5));
        if (!isNaN(input) && Number.parseInt(input)) _GM_setValue(VIDEO_TIME_STEP.name, input);
      });
    },
    setupVideoFastforwardCommand() {
      if (this.isTencent()) return;
      const title = "设置数字零键快进时长";
      _GM_registerMenuCommand(title, () => {
        const input = prompt(title, _GM_getValue(VIDEO_FASTFORWARD_DURATION.name, 30));
        if (!isNaN(input) && Number.parseInt(input)) _GM_setValue(VIDEO_FASTFORWARD_DURATION.name, input);
      });
    },
    setupWebFullScreenCommand() {
      const isClose = _GM_getValue(CLOSE_AUTO_WEB_FULL_KEY, false);
      const web_full_id = _GM_registerMenuCommand(isClose ? "开启自动网页全屏" : "关闭自动网页全屏", () => {
        _GM_setValue(CLOSE_AUTO_WEB_FULL_KEY, !isClose);
        _GM_unregisterMenuCommand(web_full_id);
        this.setupWebFullScreenCommand();
      });
    },
    setupKeyboardCommand() {
      if (this.isTencent()) return;
      const isClose = this.isCloseKeyboard();
      const title = isClose ? "开启 空格 ◀▶ 键盘控制" : "关闭 空格 ◀▶ 键盘控制";
      const keyboard_id = _GM_registerMenuCommand(title, () => {
        _GM_setValue(KEYBOARD_COMMAND_KEY, !isClose);
        _GM_unregisterMenuCommand(keyboard_id);
        this.setupKeyboardCommand();
      });
    }
  };
  const { ONE_SEC, BILI_VID_REG } = constants;
  const WebFullScreenHandler = {
    isFull() {
      return window.innerWidth === this.video.offsetWidth;
    },
    webFullScreen(video) {
      const w = video.offsetWidth;
      if (Object.is(0, w)) return false;
      if (this.isCloseAuto()) return true;
      if (window.innerWidth === w) return true;
      if (this.isBiliLive()) return this.biliLiveWebFullScreen();
      this.element?.click();
      return true;
    },
    exitWebFullScreen() {
      if (window.innerWidth === this.video.offsetWidth) this.getElement()?.click();
      const cancelButton = this.query(".bpx-player-ending-related-item-cancel");
      if (cancelButton) setTimeout(() => cancelButton.click(), 100);
    },
    biliLiveWebFullScreen() {
      try {
        const win = _unsafeWindow.top;
        win.scrollTo({ top: 70 });
        const el = Object.is(win, window) ? this.query("#player-ctnr") : this.query(":is(.lite-room, #player-ctnr)", win.document);
        win.scrollTo({ top: el?.getBoundingClientRect()?.top || 0 });
        this.element.dispatchEvent(new Event("dblclick", { bubbles: true }));
        localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0);
        document.body.classList.add("hide-asida-area", "hide-aside-area");
        win?.livePlayer?.volume(100);
        win?.livePlayer?.switchQuality("10000");
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
      if (!this.isTencent()) return;
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
      if (document.cookie.includes("DedeUserID")) return player?.requestQuality(80);
      setTimeout(() => {
        _unsafeWindow.__BiliUser__.isLogin = true;
        _unsafeWindow.__BiliUser__.cache.data.isLogin = true;
        _unsafeWindow.__BiliUser__.cache.data.mid = Date.now();
      }, ONE_SEC * 3);
    }
  };
  const ScriptsEnhanceHandler = {
    enhance() {
      this.simuMouseover(this.getHoverEl());
      this.triggerKeydownEvt();
    },
    getHoverEl() {
      if (!this.videoGeo) return;
      if (this.hoverEl) return this.hoverEl;
      if (this.video) return this.hoverEl = this.video?.parentElement?.parentElement;
      const { x, y } = this.videoGeo;
      const iframe = this.getVideoIframe();
      if (iframe) return this.hoverEl = iframe;
      const iframes = this.querys("iframe:not([src=''])");
      for (const element of iframes) {
        const rect = element.getBoundingClientRect();
        const isInRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        if (!isInRect) continue;
        return this.hoverEl = element;
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
      if (!this.video) return;
      document?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true }));
    }
  };
  const {
    INC_SYMBOL,
    DEC_SYMBOL,
    MUL_SYMBOL,
    DIV_SYMBOL,
    DEF_PLAY_RATE,
    MAX_PLAY_RATE,
    PLAY_RATE_STEP,
    CACHED_PLAY_RATE_KEY
  } = constants;
  const strategy = {
    [MUL_SYMBOL]: (playRate) => playRate * 2,
    [DIV_SYMBOL]: (playRate) => playRate / 2,
    [INC_SYMBOL]: (playRate) => playRate + PLAY_RATE_STEP.value(),
    [DEC_SYMBOL]: (playRate) => playRate - PLAY_RATE_STEP.value()
  };
  const VideoPlaybackRateHandler = {
    checkVideoUsable() {
      if (!this.video) return false;
      if (this.rebindVideo) return true;
      if (this.isLivePage()) return false;
      if (this.video === this.getVideo()) return true;
      return false;
    },
    setPlayRate(playRate) {
      if (!this.checkVideoUsable()) return;
      this.video.playbackRate = playRate;
      this.cachePlayRate();
      return true;
    },
    adjustPlayRate(_symbol) {
      if (!this.checkVideoUsable()) return;
      let playRate = this.video.playbackRate;
      playRate = strategy[_symbol](playRate);
      playRate = Math.max(PLAY_RATE_STEP.value(), playRate);
      this.video.playbackRate = Math.min(MAX_PLAY_RATE, playRate);
      this.cachePlayRate();
      this.showRateTip();
    },
    cachePlayRate() {
      localStorage.setItem(CACHED_PLAY_RATE_KEY, this.video.playbackRate);
    },
    getCachePlayRate() {
      const cachePlayRate = localStorage.getItem(CACHED_PLAY_RATE_KEY);
      return parseFloat(cachePlayRate || DEF_PLAY_RATE);
    },
    showRateTip() {
      const span = document.createElement("span");
      span.appendChild(document.createTextNode("正在以"));
      const child = span.cloneNode(true);
      child.textContent = `${this.video.playbackRate.toFixed(2).replace(/\.?0+$/, "")}x`;
      child.setAttribute("style", "margin:0 3px!important;color:#ff6101!important;");
      span.appendChild(child);
      span.appendChild(document.createTextNode("倍速播放"));
      this.showToast(span);
    }
  };
  const logicHandlers = [
    { handler: KeydownHandler },
    { handler: MenuCommandHandler },
    { handler: WebFullScreenHandler },
    { handler: VideoPlaybackRateHandler },
    { handler: ScriptsEnhanceHandler }
  ];
  logicHandlers.forEach(({ handler }) => {
    for (const key of Object.keys(handler)) {
      const method = handler[key];
      method instanceof Function ? App[key] = method.bind(App) : App[key] = method;
    }
  });
  App.init();

})();