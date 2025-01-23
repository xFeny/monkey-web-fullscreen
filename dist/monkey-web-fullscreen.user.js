// ==UserScript==
// @name         视频网站自动网页全屏｜倍速播放
// @namespace    http://tampermonkey.net/
// @version      2.4.3
// @author       Feny
// @description  支持哔哩哔哩、B站直播、腾讯视频、优酷视频、爱奇艺、芒果TV、搜狐视频、AcFun弹幕网自动网页全屏；快捷键切换：全屏(F)、网页全屏(P)、下一个视频(N)、弹幕开关(D)；支持任意视频倍速播放，提示记忆倍速；B站播放完自动退出网页全屏和取消连播。
// @license      GPL-3.0-only
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqdJREFUWEftl91LFFEYxp/3jB9ESZjtSl51F1RUSgRCF/kHlF1IhiFhF65dqEQkBUErdJMStBukGwQre2NZUiCRqUiURkW65mIfqGUFsW6Ii0jY7p4Tc3Rqd5zaGVldAudynve8z28e3jMzh5Dmi1R/V0vQyRRWxgWG6x22SrcnOAhQcQIbwVtXba8y1EANSpS1xzJin5c/Dz+jRDPvGWoErwRw35zuh8ChpcXXFjbwi9k/WADA9viGgovGnxtFs6EmcApMvCdBA3oIIirl4N8NNQngmRYJiwTOE7EHHLERAmXFawQ6AdCQkRbjsZIMUvIFoV0HMSsEDjCgSK8tJqAHAEDAMWLKLOexx8tiVVDEhLLVQAtzRPcwKOUANSWCw1/rsBe6PcFz8dpfAdTFgtF+EmIvBG7pID7mZNl2zkVCFQbahzqHfYerddpNhFpdsnfqauzl8ZoEuO4JXdIKOefynnZlimxXhBbqjTZL/el8pzrAVjTGmKh12Bq1ddJs974abQDXfFMuAhQ6EodwDTHWAf6/BAoK8nD0cDEKtuVhyD+OzvvLXnyWJshyApedJ1F65M9n4tlAAF5fL168fGfJWCu2DDA61GpodLvjCdp8vfjyNWQJJGUAquvMzBzafD0yEc65KZCUAmiOo4FPEqS753VSiFUB0FxbPF244en6J8SqAoTD8zhYcjZ9AP6RCVRWNacHYPD5GJqudmBi8tvaAkxNBeUuuNv5NOkAqgUpm4FIJCrfA+r0z4bnTZmvCKCv+wrsts0JBg8fvZLGY28NfoqToFhOoOJ4CS40lMu2I28mpXFP37DpJ9YXWgZQG+Tm5mBL7qakA2aGakUAZhqbrVkH0BLoB34fzcyml5K6pd/yaicRlQlgV0q6mmwitMOpyfpVKfsFya4w73cz9xQAAAAASUVORK5CYII=
// @homepage     https://github.com/xFeny/monkey-web-fullscreen
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
// @match        *://v.qq.com/live/p/newtopic/*
// @match        *://www.bilibili.com/festival/*
// @match        *://www.bilibili.com/cheese/play/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        GM_addStyle
// @grant        GM_info
// @grant        unsafeWindow
// @note         *://*/*
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(' @charset "UTF-8";.showToast{color:#fff!important;font-size:14px!important;padding:5px 15px!important;border-radius:5px!important;position:absolute!important;z-index:2147483647!important;transition:opacity .5s ease-in;background:#000000bf!important}.showToast .playbackRate{margin:0 3px!important;color:#ff6101!important}#bilibili-player .bpx-player-toast-wrap,#bilibili-player .bpx-player-cmd-dm-wrap,#bilibili-player .bpx-player-dialog-wrap,.live-room-app #sidebar-vm,.live-room-app #prehold-nav-vm,.live-room-app #shop-popover-vm,.login-tip{display:none!important} ');

(function () {
  'use strict';

  const positions = Object.freeze({
    bottomLeft: "bottom: 20%; left: 10px;",
    center: "top: 50%; left: 50%; transform: translate(-50%, -50%);"
  });
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
    PLAY_RATE_STEP: 0.25,
    SHOW_TOAST_TIME: ONE_SECOND * 5,
    SHOW_TOAST_POSITION: positions.bottomLeft,
    MSG_SOURCE: "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN",
    CACHED_PLAY_RATE_KEY: "FENY_SCRIPTS_V_PLAYBACK_RATE",
    QQ_VID_REG: /v.qq.com\/x/,
    ACFUN_VID_REG: /acfun.cn\/v/,
    IQIYI_VID_REG: /iqiyi.com\/v_*/,
    BILI_VID_REG: /bilibili.com\/video/
  });
  const selectorConfig = {
    "live.bilibili.com": { webfull: "#businessContainerElement" },
    "live.acfun.cn": { full: ".fullscreen-screen", webfull: ".fullscreen-web", danmaku: ".danmaku-enabled" },
    "tv.sohu.com": { full: ".x-fullscreen-btn", webfull: ".x-pagefs-btn", danmaku: ".tm-tmbtn", next: ".x-next-btn" },
    "haokan.baidu.com": { full: ".art-icon-fullscreen", webfull: ".art-control-fullscreenWeb", next: ".art-control-next" },
    "www.iqiyi.com": { full: ".iqp-btn-fullscreen", webfull: ".iqp-btn-webscreen", danmaku: "#barrage_switch", next: ".iqp-btn-next" },
    "www.mgtv.com": { full: ".fullscreenBtn i", webfull: ".webfullscreenBtn i", danmaku: "div[class*='danmuSwitch']", next: ".icon-next" },
    "v.qq.com": { full: ".txp_btn_fullscreen", webfull: "div[aria-label='网页全屏']", danmaku: ".barrage-switch", next: ".txp_btn_next_u" },
    "v.pptv.com": { full: ".w-zoom-container > div", webfull: ".w-expand-container > div", danmaku: ".w-barrage", next: ".w-next-container" },
    "www.acfun.cn": { full: ".fullscreen-screen", webfull: ".fullscreen-web", danmaku: ".danmaku-enabled", next: ".btn-next-part .control-btn" },
    "www.bilibili.com": { full: "div[aria-label='全屏']", webfull: "div[aria-label='网页全屏']", danmaku: ".bui-area", next: ".bpx-player-ctrl-next" },
    "v.youku.com": { full: "#fullscreen-icon", webfull: "#webfullscreen-icon", danmaku: "div[class*='switch-img_12hDa turn-']", next: ".kui-next-icon-0" }
  };
  const { DEF_PLAY_RATE: DEF_PLAY_RATE$1, BILI_VID_REG: BILI_VID_REG$1, ACFUN_VID_REG } = constants;
  const VideoListenerHandler = {
    loadedmetadata() {
      this.volume = 1;
      this.isToast = false;
    },
    loadeddata() {
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
    ended() {
      this.isToast = false;
      const href = location.href;
      if (!BILI_VID_REG$1.test(href) && !ACFUN_VID_REG.test(href)) return;
      function exitFullScr() {
        const video = App.video;
        if (window.innerWidth === video.offsetWidth) App.getElement()?.click();
        const cancelButton = App.query(".bpx-player-ending-related-item-cancel");
        if (cancelButton) cancelButton.click();
        console.log("已退出网页全屏！！");
      }
      const switchBtn = App.query(".video-pod .switch-btn.on");
      const podItems = App.querys(".video-pod .video-pod__item");
      if (podItems.length > 0) {
        const lastPodItem = podItems[podItems.length - 1];
        const scrolled = lastPodItem.dataset.scrolled;
        if (scrolled === "true" || !switchBtn) exitFullScr();
        return;
      }
      exitFullScr();
    }
  };
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const { EMPTY, ONE_SEC: ONE_SEC$1, MSG_SOURCE: MSG_SOURCE$1, SHOW_TOAST_TIME, SHOW_TOAST_POSITION } = constants;
  const matches = _GM_info.script.matches.map((url) => url.replace(/\*/g, EMPTY));
  const App = {
    init() {
      this.setupHoverListener();
      this.setupVisibleListener();
      this.setupKeydownListener();
      this.setupMutationObserver();
      this.setupUrlChangeListener();
    },
    isLivePage: () => location.href.includes("live"),
    isBiliLive: () => location.host === "live.bilibili.com",
    query: (selector, context) => (context || document).querySelector(selector),
    querys: (selector, context) => (context || document).querySelectorAll(selector),
    getVideo: () => document.querySelector("video[src]") || document.querySelector("video"),
    getElement: () => document.querySelector(selectorConfig[location.host]?.webfull),
    validVideoDur: (video) => !isNaN(video.duration) && video.duration !== Infinity,
    inMatches: () => matches.some((matche) => location.href.includes(matche)),
    debounce(fn, delay = ONE_SEC$1) {
      let timer;
      return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), delay);
      };
    },
    setupVisibleListener() {
      window.addEventListener("visibilitychange", () => {
        const state = document.visibilityState;
        const video = this.isLivePage() ? this.getVideo() : this.video;
        if (video) Object.is(state, "visible") ? video.play() : video.pause();
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
      this.videoListenerCycles = 0;
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
    videoListenerCycles: 0,
    videoBoundListeners: [],
    setupVideoListener() {
      if (this.isLivePage()) return;
      if (this.videoListenerCycles >= 5) return;
      this.addVideoEvtListener(this.getVideo());
      this.videoListenerCycles++;
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
    setVideoGeo(video) {
      const rect = video.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const videoGeo = this.videoGeo = { x, y };
      if (window.top !== window) window.parent.postMessage({ source: MSG_SOURCE$1, videoGeo }, "*");
    },
    showToast(content, duration = SHOW_TOAST_TIME) {
      this.query(".showToast")?.remove();
      const el = document.createElement("div");
      if (content instanceof HTMLElement) el.appendChild(content);
      if (Object.is(typeof content, "string")) el.textContent = content;
      el.setAttribute("class", "showToast");
      el.setAttribute("style", SHOW_TOAST_POSITION);
      this.video?.parentElement?.parentElement?.appendChild(el);
      setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => el.remove(), ONE_SEC$1 / 2);
      }, duration);
    }
  };
  const { MSG_SOURCE, ASTERISK, INC_SYMBOL: INC_SYMBOL$1, DEC_SYMBOL: DEC_SYMBOL$1, MUL_SYMBOL: MUL_SYMBOL$1, DIV_SYMBOL: DIV_SYMBOL$1 } = constants;
  const KeydownHandler = {
    setupKeydownListener() {
      const handler = (event) => this.keydownHandler.call(this, event);
      window.addEventListener("keydown", handler, true);
      window.addEventListener("message", (event) => {
        const { data } = event;
        if (!data?.source) return;
        if (!data.source.includes(MSG_SOURCE)) return;
        if (data?.videoGeo) this.videoGeo = data.videoGeo;
        if (data?.hotKey) this.execHotKeyActions(data.hotKey);
        if (!this.video) this.postMsgToAllFrames(data);
      });
    },
    keydownHandler(event) {
      const activeTagName = document.activeElement.tagName;
      if (["INPUT", "TEXTAREA"].includes(activeTagName)) return;
      let hotKey = event.key.toUpperCase();
      if (event.shiftKey && hotKey === INC_SYMBOL$1) hotKey = MUL_SYMBOL$1;
      if (event.shiftKey && hotKey === DEC_SYMBOL$1) hotKey = DIV_SYMBOL$1;
      this.execHotKeyActions(hotKey);
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
        A: () => this.adjustPlayRate(INC_SYMBOL$1),
        S: () => this.adjustPlayRate(DEC_SYMBOL$1),
        Z: () => this.setPlayRate(1) && this.showToast("已恢复正常倍速播放"),
        [ASTERISK]: () => this.getPlayingVideo(),
        [INC_SYMBOL$1]: () => this.adjustPlayRate(INC_SYMBOL$1),
        [DEC_SYMBOL$1]: () => this.adjustPlayRate(DEC_SYMBOL$1),
        [MUL_SYMBOL$1]: () => this.adjustPlayRate(MUL_SYMBOL$1),
        [DIV_SYMBOL$1]: () => this.adjustPlayRate(DIV_SYMBOL$1)
      };
      if (actions[key]) actions[key]();
      if (/^[1-9]$/.test(key)) this.setPlayRate(key) && this.showRateTip();
      if (Object.is("P", key)) this.inMatches() ? clickEl("webfull", 1) : this.enhance();
    },
    getPlayingVideo() {
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
      return this.querys("#web-player-controller-wrap-el .right-area .icon");
    },
    postMsgToAllFrames(data) {
      const ifrs = this.querys("iframe");
      ifrs.forEach((ifr) => ifr?.contentWindow?.postMessage({ source: MSG_SOURCE, ...data }, "*"));
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
  const { ONE_SEC, QQ_VID_REG, BILI_VID_REG } = constants;
  const WebFullScreenHandler = {
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
        const win = _unsafeWindow.top;
        win.scrollTo({ top: 70 });
        const el = Object.is(win, window) ? this.query("#player-ctnr") : this.query(".lite-room", win.document);
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
      if (!QQ_VID_REG.test(location.href)) return;
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
      if (document.cookie.includes("DedeUserID")) return;
      setTimeout(() => {
        _unsafeWindow.__BiliUser__.isLogin = true;
        _unsafeWindow.__BiliUser__.cache.data.isLogin = true;
        _unsafeWindow.__BiliUser__.cache.data.mid = Date.now();
      }, ONE_SEC * 3);
    }
  };
  const ScriptsEnhanceHandler = {
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
      const iframes = this.querys("iframe[src]");
      const { x, y } = this.videoGeo;
      for (const element of iframes) {
        const rect = element.getBoundingClientRect();
        const isInRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        if (!isInRect) continue;
        return this.hoverEl = element;
      }
    },
    simuMouseover(element) {
      if (!element) return;
      const x = element.offsetWidth / 2;
      const y = element.offsetHeight / 2;
      const evt = new MouseEvent("mouseover", { clientX: x, clientY: y, bubbles: true });
      element.dispatchEvent(evt);
    },
    triggerKeydownEvt() {
      if (!this.video) return;
      document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27, bubbles: true }));
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
    [INC_SYMBOL]: (playRate) => playRate + PLAY_RATE_STEP,
    [DEC_SYMBOL]: (playRate) => playRate - PLAY_RATE_STEP
  };
  const VideoPlaybackRateHandler = {
    checkVideoUsable() {
      if (this.isLivePage()) return false;
      if (!this.video) return false;
      if (this.rebindVideo) return true;
      if (this.video === this.getVideo()) return true;
      this.setupVideoListener();
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
      playRate = Math.max(PLAY_RATE_STEP, playRate);
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
      child.textContent = `${this.video.playbackRate}x`;
      child.setAttribute("class", "playbackRate");
      span.appendChild(child);
      span.appendChild(document.createTextNode("倍速播放"));
      this.showToast(span);
    }
  };
  const logicHandlers = [
    { handler: KeydownHandler },
    { handler: WebFullScreenHandler },
    { handler: VideoPlaybackRateHandler },
    { handler: ScriptsEnhanceHandler }
  ];
  logicHandlers.forEach(({ handler }) => {
    for (const method of Object.keys(handler)) {
      App[method] = handler[method].bind(App);
    }
  });
  App.init();

})();