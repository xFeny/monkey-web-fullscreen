// ==UserScript==
// @name         视频网站自动网页全屏｜倍速播放
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @author       Feny
// @description  支持哔哩哔哩、B站直播、腾讯视频、优酷视频、爱奇艺、芒果TV、搜狐视频、AcFun弹幕网播放页自动网页全屏，视频网站统一支持快捷键切换：全屏(F)、网页全屏(P)、下一个视频(N)、弹幕开关(D)，支持任意视频倍速播放，B站播放完自动退出网页全屏
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
// @note         v2.1.2 移除`0`快捷键；修复B站直播可见性监听失效问题
// @note         v2.0.0 新增倍速播放功能，页面可见性监听，倍速播放具体使用说明见脚本主页
// @note         v0.9.9 解决B站直播不支持`全屏切换`、`关闭弹幕`快捷键
// @note         v0.9.7 新增`全屏(F)`、`网页全屏(P)`、`下一个视频(N)`、`弹幕开关(D)`快捷键
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(" .showToast{color:#fff!important;font-size:14px!important;padding:5px 15px!important;border-radius:5px!important;position:absolute!important;z-index:2147483647!important;transition:opacity .5s ease-in;background:#000000bf!important}.showToast .playbackRate{margin:0 3px!important;color:#ff6101!important} ");

(function () {
  'use strict';

  const positions = Object.freeze({
    bottomLeft: "bottom: 20%; left: 10px;",
    center: "top: 50%; left: 50%; transform: translate(-50%, -50%);"
  });
  const ONE_SECOND = 1e3;
  const consts = Object.freeze({
    EMPTY: "",
    ASTERISK: "*",
    INC_SYMBOL: "+",
    DEC_SYMBOL: "-",
    DEF_PLAY_RATE: 1,
    ONE_SEC: ONE_SECOND,
    PLAY_RATE_STEP: 0.25,
    SHOW_TOAST_TIME: ONE_SECOND * 5,
    SHOW_TOAST_POSITION: positions.bottomLeft,
    MSG_SOURCE: "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN",
    CACHED_PLAY_RATE_KEY: "FENY_SCRIPTS_V_PLAYBACK_RATE",
    ACFUN_VID_REG: /acfun.cn\/v/,
    BILI_VID_REG: /bilibili.com\/video/,
    BILI_LIVE_REG: /live.bilibili.com\/(blanc\/)?\d+/
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
  const { DEF_PLAY_RATE: DEF_PLAY_RATE$1, BILI_VID_REG, ACFUN_VID_REG } = consts;
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
      const cachePlaybackRate = ScriptsProgram.getCachePlaybackRate();
      if (!cachePlaybackRate || DEF_PLAY_RATE$1 === cachePlaybackRate) return;
      if (cachePlaybackRate === this.playbackRate) return;
      const reuslt = ScriptsProgram.setPlaybackRate(cachePlaybackRate);
      if (!reuslt) return;
      if (this.isToast) return;
      ScriptsProgram.tipPlaybackRate();
      this.isToast = true;
    },
    ended() {
      this.isToast = false;
      const href = location.href;
      if (!BILI_VID_REG.test(href) && !ACFUN_VID_REG.test(href)) return;
      function exitWebFullScreen() {
        var _a;
        const video = ScriptsProgram.video;
        if (window.innerWidth === video.offsetWidth) (_a = ScriptsProgram.getElement()) == null ? void 0 : _a.click();
        const cancelButton = document.querySelector(".bpx-player-ending-related-item-cancel");
        if (cancelButton) cancelButton.click();
        console.log("已退出网页全屏！！");
      }
      const switchBtn = document.querySelector(".video-pod .switch-btn.on");
      const podItems = document.querySelectorAll(".video-pod .video-pod__item");
      if (podItems.length > 0) {
        const lastPodItem = podItems[podItems.length - 1];
        const scrolled = lastPodItem.dataset.scrolled;
        if (scrolled === "true" || !switchBtn) exitWebFullScreen();
        return;
      }
      exitWebFullScreen();
    }
  };
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const { EMPTY, ONE_SEC, MSG_SOURCE: MSG_SOURCE$1, SHOW_TOAST_POSITION, SHOW_TOAST_TIME } = consts;
  const matches = _GM_info.script.matches.map((url) => url.replace(/\*/g, EMPTY));
  const ScriptsProgram = {
    init() {
      this.setupKeydownListener();
      this.setupMutationObserver();
      this.setupUrlChangeListener();
      this.setupMouseOverListener();
      this.setupPageVisibilityListener();
    },
    video: null,
    videoGeo: { x: 0, y: 0 },
    getVideo: () => document.querySelector("video[src]") || document.querySelector("video"),
    getElement: () => {
      var _a;
      return document.querySelector((_a = selectorConfig[location.host]) == null ? void 0 : _a.webfull);
    },
    videoCanUse: (video) => !isNaN(video.duration) && video.duration !== Infinity,
    isLivePage: () => location.href.includes("live"),
    isBiliLive: () => location.host === "live.bilibili.com",
    debounce(fn, delay = ONE_SEC) {
      let timer;
      return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), delay);
      };
    },
    inMatches() {
      return matches.some((matche) => location.href.includes(matche));
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
      ["popstate", "pushState", "replaceState"].forEach(
        (t) => _wr(t) & window.addEventListener(t, handler)
      );
    },
    setupMutationObserver() {
      this.videoListenerCycles = 0;
      const observer = new MutationObserver(() => {
        const video = this.getVideo();
        this.element = this.getElement();
        if ((video == null ? void 0 : video.play) && this.element) this.webFullScreen(video) && observer.disconnect();
        if (video == null ? void 0 : video.play) this.setupVideoListener();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), ONE_SEC * 10);
    },
    rebindVideo: false,
    videoListenerCycles: 0,
    videoBoundListeners: [],
    setupVideoListener() {
      if (this.isLivePage()) return;
      if (this.videoListenerCycles >= 5) return;
      this.videoListenerCycles++;
      this.addVideoEventsListener(this.getVideo());
    },
    addVideoEventsListener(video) {
      this.video = video;
      this.setVideoGeo(video);
      this.removeVideoEventsListener();
      for (const type of Object.keys(VideoListenerHandler)) {
        const handler = VideoListenerHandler[type];
        this.video.addEventListener(type, handler);
        this.videoBoundListeners.push([this.video, type, handler]);
      }
    },
    removeVideoEventsListener() {
      this.videoBoundListeners.forEach((listener) => {
        const [target, type, handler] = listener;
        target.removeEventListener(type, handler);
      });
      this.videoBoundListeners = [];
    },
    rebindVideoEventsListener(video) {
      this.rebindVideo = true;
      this.addVideoEventsListener(video);
    },
    setupMouseOverListener() {
      if (this.inMatches()) return;
      document.addEventListener("mouseover", (event) => {
        const x = event.clientX;
        const y = event.clientY;
        const videos = document.querySelectorAll("video");
        for (const video of videos) {
          const rect = video.getBoundingClientRect();
          const isInRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
          if (!isInRect) continue;
          if (this.video === video) return;
          if (this.videoCanUse(video)) return this.rebindVideoEventsListener(video);
        }
      });
    },
    setupPageVisibilityListener() {
      window.addEventListener("visibilitychange", () => {
        const video = this.isLivePage() ? this.getVideo() : this.video;
        const state = document.visibilityState;
        if (video) Object.is(state, "visible") ? video.play() : video.pause();
      });
    },
    setVideoGeo(video) {
      const rect = video.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const videoGeo = this.videoGeo = { x, y };
      if (window.top !== window) window.parent.postMessage({ source: MSG_SOURCE$1, videoGeo }, "*");
    },
    showToast(content, duration = SHOW_TOAST_TIME) {
      var _a, _b;
      (_a = document.querySelector(".showToast")) == null ? void 0 : _a.remove();
      const toast = document.createElement("div");
      if (content instanceof HTMLElement) toast.appendChild(content);
      if (Object.is(typeof content, "string")) toast.textContent = content;
      toast.setAttribute("class", "showToast");
      toast.setAttribute("style", SHOW_TOAST_POSITION);
      (_b = this.video) == null ? void 0 : _b.parentElement.parentElement.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), ONE_SEC / 2);
      }, duration);
    }
  };
  const { MSG_SOURCE, ASTERISK, INC_SYMBOL: INC_SYMBOL$1, DEC_SYMBOL: DEC_SYMBOL$1 } = consts;
  const KeydownHandler = {
    setupKeydownListener() {
      const handler = (event) => this.keydownHandler.call(this, event);
      window.addEventListener("keydown", handler, true);
      window.addEventListener("message", (event) => {
        const { data } = event;
        if (!(data == null ? void 0 : data.source)) return;
        if (!data.source.includes(MSG_SOURCE)) return;
        if (data == null ? void 0 : data.videoGeo) this.videoGeo = data.videoGeo;
        if (data == null ? void 0 : data.hotKey) this.execHotKeyActions(data.hotKey);
        if (!this.video) this.postMessageToAllIframes(data);
      });
    },
    keydownHandler(event) {
      const activeTagName = document.activeElement.tagName;
      if (["INPUT", "TEXTAREA"].includes(activeTagName)) return;
      const hotKey = event.key.toUpperCase();
      this.execHotKeyActions(hotKey);
      if (window.top === window && !this.video) this.postMessageToAllIframes({ hotKey });
    },
    execHotKeyActions(key) {
      const clickElement = (name, index) => {
        var _a, _b, _c;
        if (!this.isBiliLive()) {
          (_b = document.querySelector((_a = selectorConfig[location.host]) == null ? void 0 : _a[name])) == null ? void 0 : _b.click();
          return;
        }
        const control = this.getBiliLiveControlIcons();
        if (control) (_c = control[index]) == null ? void 0 : _c.click();
      };
      const actions = {
        N: () => clickElement("next"),
        F: () => clickElement("full", 0),
        D: () => clickElement("danmaku", 3),
        A: () => this.stepPlaybackRate(INC_SYMBOL$1),
        S: () => this.stepPlaybackRate(DEC_SYMBOL$1),
        Z: () => this.setPlaybackRate(1) && this.showToast("已恢复正常倍速播放")
      };
      actions[ASTERISK] = () => this.getPlayingVideo();
      actions[INC_SYMBOL$1] = () => this.stepPlaybackRate(INC_SYMBOL$1);
      actions[DEC_SYMBOL$1] = () => this.stepPlaybackRate(DEC_SYMBOL$1);
      if (actions[key]) actions[key]();
      if (/^[1-9]$/.test(key)) this.setPlaybackRate(key) && this.tipPlaybackRate();
      if (Object.is("P", key)) this.inMatches() ? clickElement("webfull", 1) : this.enhance();
    },
    getPlayingVideo() {
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
      return document.querySelectorAll("#web-player-controller-wrap-el .right-area .icon");
    },
    postMessageToAllIframes(data) {
      document.querySelectorAll("iframe").forEach((iframe) => {
        var _a;
        (_a = iframe == null ? void 0 : iframe.contentWindow) == null ? void 0 : _a.postMessage({ source: MSG_SOURCE, ...data }, "*");
      });
    },
    simulateMousemove(target) {
      const y = target.offsetHeight / 2;
      const maxWidth = target.offsetWidth;
      const moveEvent = (x) => {
        const event = new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true });
        target.dispatchEvent(event);
      };
      for (let i = 0; i < maxWidth; i += 100) moveEvent(i);
    }
  };
  const WebFullScreenHandler = {
    webFullScreen(video) {
      const w = video.offsetWidth;
      if (0 === w) return false;
      if (window.innerWidth === w) return true;
      if (this.isBiliLive()) return this.biliLiveWebFullScreen();
      this.element.click();
      return true;
    },
    biliLiveWebFullScreen() {
      var _a, _b, _c;
      try {
        const topWin = _unsafeWindow.top;
        topWin.scrollTo({ top: 70 });
        const ctnr = Object.is(topWin, window) ? document.querySelector("#player-ctnr") : topWin.document.querySelector(".lite-room");
        topWin.scrollTo({ top: ((_a = ctnr == null ? void 0 : ctnr.getBoundingClientRect()) == null ? void 0 : _a.top) || 0 });
        this.element.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
        localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0);
        document.body.classList.add("hide-asida-area", "hide-aside-area");
        setTimeout(() => {
          var _a2, _b2;
          (_a2 = document.querySelector("#shop-popover-vm")) == null ? void 0 : _a2.remove();
          (_b2 = document.querySelector("#sidebar-vm")) == null ? void 0 : _b2.remove();
        }, 500);
        (_b = topWin == null ? void 0 : topWin.livePlayer) == null ? void 0 : _b.volume(100);
        (_c = topWin == null ? void 0 : topWin.livePlayer) == null ? void 0 : _c.switchQuality("10000");
      } catch (error) {
        console.error("B站直播自动网页全屏异常：", error);
      }
      return true;
    }
  };
  const ScriptsEnhanceHandler = {
    enhance() {
      const target = this.getHoverElement();
      this.simulateMouseover(target);
      this.triggerKeydownEvent();
    },
    getHoverElement() {
      var _a, _b;
      if (this.hoverElement) return this.hoverElement;
      if (this.video) {
        this.hoverElement = (_b = (_a = this.video) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement;
        return this.hoverElement;
      }
      const iframes = document.querySelectorAll("iframe[src]");
      const { x, y } = this.videoGeo;
      for (const element of iframes) {
        const rect = element.getBoundingClientRect();
        const isInRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        if (!isInRect) continue;
        return this.hoverElement = element;
      }
    },
    simulateMouseover(element) {
      if (!element) return;
      const x = element.offsetWidth / 2;
      const y = element.offsetHeight / 2;
      const mouseover = new MouseEvent("mouseover", { clientX: x, clientY: y, bubbles: true });
      element.dispatchEvent(mouseover);
    },
    triggerKeydownEvent() {
      if (!this.video) return;
      document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27, bubbles: true }));
    }
  };
  const {
    INC_SYMBOL,
    DEC_SYMBOL,
    PLAY_RATE_STEP,
    DEF_PLAY_RATE,
    CACHED_PLAY_RATE_KEY
  } = consts;
  const VideoPlaybackRateHandler = {
    checkVideoAvailability() {
      if (this.isLivePage()) return false;
      if (!this.video) return false;
      if (this.rebindVideo) return true;
      if (this.video === this.getVideo()) return true;
      this.setupVideoListener();
      return false;
    },
    setPlaybackRate(playbackRate) {
      if (!this.checkVideoAvailability()) return;
      this.video.playbackRate = playbackRate;
      this.cachePlaybackRate();
      return true;
    },
    stepPlaybackRate(_symbol) {
      if (!this.checkVideoAvailability()) return;
      if (INC_SYMBOL === _symbol) this.video.playbackRate += PLAY_RATE_STEP;
      if (DEC_SYMBOL === _symbol) this.video.playbackRate -= PLAY_RATE_STEP;
      if (0 === this.video.playbackRate) this.video.playbackRate = PLAY_RATE_STEP;
      this.cachePlaybackRate();
      this.tipPlaybackRate();
    },
    cachePlaybackRate() {
      localStorage.setItem(CACHED_PLAY_RATE_KEY, this.video.playbackRate);
    },
    getCachePlaybackRate() {
      const cachePlaybackRate = localStorage.getItem(CACHED_PLAY_RATE_KEY);
      return parseFloat(cachePlaybackRate || DEF_PLAY_RATE);
    },
    tipPlaybackRate() {
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
  (function() {
    if (ScriptsProgram.isBiliLive() && !consts.BILI_LIVE_REG.test(location.href)) return;
    const logicHandlers = [
      { handler: KeydownHandler },
      { handler: WebFullScreenHandler },
      { handler: VideoPlaybackRateHandler },
      { handler: ScriptsEnhanceHandler }
    ];
    logicHandlers.forEach(({ handler }) => {
      for (const methodName of Object.keys(handler)) {
        ScriptsProgram[methodName] = handler[methodName].bind(ScriptsProgram);
      }
    });
    ScriptsProgram.init();
  })();

})();