// ==UserScript==
// @name         视频网站自动网页全屏｜倍速播放
// @author       Feny
// @version      2.1.0
// @license      GPL-3.0-only
// @namespace    http://tampermonkey.net/
// @description  支持哔哩哔哩、B站直播、腾讯视频、优酷视频、爱奇艺、芒果TV、搜狐视频、AcFun弹幕网播放页自动网页全屏，视频网站统一支持快捷键切换：全屏(F)、网页全屏(P)、下一个视频(N)、弹幕开关(D)，支持任意视频倍速播放，B站播放完自动退出网页全屏
// @note         v2.0.0 新增倍速播放功能，页面可见性监听，倍速播放具体使用说明见脚本主页
// @match        *://*/*
// @match        *://tv.sohu.com/v/*
// @match        *://www.mgtv.com/b/*
// @match      	 *://www.acfun.cn/v/*
// @match      	 *://www.iqiyi.com/v_*
// @match      	 *://v.qq.com/x/page/*
// @match      	 *://v.qq.com/x/cover/*
// @match      	 *://haokan.baidu.com/v*
// @match      	 *://live.bilibili.com/*
// @match      	 *://v.youku.com/v_show/*
// @match      	 *://live.acfun.cn/live/*
// @match      	 *://www.acfun.cn/bangumi/*
// @match      	 *://www.bilibili.com/list/*
// @match      	 *://www.bilibili.com/video/*
// @match      	 *://v.qq.com/live/p/newtopic/*
// @match      	 *://www.bilibili.com/festival/*
// @match      	 *://www.bilibili.com/cheese/play/*
// @match      	 *://www.bilibili.com/bangumi/play/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqdJREFUWEftl91LFFEYxp/3jB9ESZjtSl51F1RUSgRCF/kHlF1IhiFhF65dqEQkBUErdJMStBukGwQre2NZUiCRqUiURkW65mIfqGUFsW6Ii0jY7p4Tc3Rqd5zaGVldAudynve8z28e3jMzh5Dmi1R/V0vQyRRWxgWG6x22SrcnOAhQcQIbwVtXba8y1EANSpS1xzJin5c/Dz+jRDPvGWoErwRw35zuh8ChpcXXFjbwi9k/WADA9viGgovGnxtFs6EmcApMvCdBA3oIIirl4N8NNQngmRYJiwTOE7EHHLERAmXFawQ6AdCQkRbjsZIMUvIFoV0HMSsEDjCgSK8tJqAHAEDAMWLKLOexx8tiVVDEhLLVQAtzRPcwKOUANSWCw1/rsBe6PcFz8dpfAdTFgtF+EmIvBG7pID7mZNl2zkVCFQbahzqHfYerddpNhFpdsnfqauzl8ZoEuO4JXdIKOefynnZlimxXhBbqjTZL/el8pzrAVjTGmKh12Bq1ddJs974abQDXfFMuAhQ6EodwDTHWAf6/BAoK8nD0cDEKtuVhyD+OzvvLXnyWJshyApedJ1F65M9n4tlAAF5fL168fGfJWCu2DDA61GpodLvjCdp8vfjyNWQJJGUAquvMzBzafD0yEc65KZCUAmiOo4FPEqS753VSiFUB0FxbPF244en6J8SqAoTD8zhYcjZ9AP6RCVRWNacHYPD5GJqudmBi8tvaAkxNBeUuuNv5NOkAqgUpm4FIJCrfA+r0z4bnTZmvCKCv+wrsts0JBg8fvZLGY28NfoqToFhOoOJ4CS40lMu2I28mpXFP37DpJ9YXWgZQG+Tm5mBL7qakA2aGakUAZhqbrVkH0BLoB34fzcyml5K6pd/yaicRlQlgV0q6mmwitMOpyfpVKfsFya4w73cz9xQAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/519872/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BD%9C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/519872/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BD%9C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ACFUN_VIDEO_PAGE_REGEX = /acfun.cn\/v/;
  const BILI_VIDEO_PAGE_REGEX = /bilibili.com\/video/;
  const BILI_LIVE_PAGE_REGEX = /live.bilibili.com\/(blanc\/)?\d+/;
  const isLivePage = () => location.href.includes("live");
  const isBiliLive = () => location.host === "live.bilibili.com";
  if (isBiliLive() && !BILI_LIVE_PAGE_REGEX.test(location.href)) return;
  const SCRIPTS_MATCHES = GM_info.script.matches
    .filter((url) => url !== "*://*/*")
    .map((url) => url.replace("*://", "").replace("*", ""));

  GM_addStyle(`
     .showToast {
        color: #fff !important;
        font-size: 14px !important;
        padding: 5px 15px !important;
        border-radius: 5px !important;
        position: absolute !important;
        z-index: 2147483647 !important;
        transition: opacity 500ms ease-in;
        background: rgba(0, 0, 0, .75) !important;
      }
      .showToast .playbackRate {
        margin: 0 3px !important;
        color: #FF6101 !important;
      }
    `);
  // showToast 位置样式
  const positions = {
    bottomLeft: "bottom: 20%; left: 10px;",
    center: "top: 50%; left: 50%; transform: translate(-50%, -50%);",
  };

  const selectorConfig = {
    "live.bilibili.com": { webfull: "#businessContainerElement" },
    "live.acfun.cn": { full: ".fullscreen-screen", webfull: ".fullscreen-web", danmaku: ".danmaku-enabled" },
    "tv.sohu.com": { full: ".x-fullscreen-btn", webfull: ".x-pagefs-btn", danmaku: ".tm-tmbtn", next: ".x-next-btn" },
    "haokan.baidu.com": {
      full: ".art-icon-fullscreen",
      webfull: ".art-control-fullscreenWeb",
      next: ".art-control-next",
    },
    "www.iqiyi.com": {
      full: ".iqp-btn-fullscreen",
      webfull: ".iqp-btn-webscreen",
      danmaku: "#barrage_switch",
      next: ".iqp-btn-next",
    },
    "www.mgtv.com": {
      full: ".fullscreenBtn i",
      webfull: ".webfullscreenBtn i",
      danmaku: "div[class*='danmuSwitch']",
      next: ".icon-next",
    },
    "v.qq.com": {
      full: ".txp_btn_fullscreen",
      webfull: "div[aria-label='网页全屏']",
      danmaku: ".barrage-switch",
      next: ".txp_btn_next_u",
    },
    "v.pptv.com": {
      full: ".w-zoom-container > div",
      webfull: ".w-expand-container > div",
      danmaku: ".w-barrage",
      next: ".w-next-container",
    },
    "www.acfun.cn": {
      full: ".fullscreen-screen",
      webfull: ".fullscreen-web",
      danmaku: ".danmaku-enabled",
      next: ".btn-next-part .control-btn",
    },
    "www.bilibili.com": {
      full: "div[aria-label='全屏']",
      webfull: "div[aria-label='网页全屏']",
      danmaku: ".bui-area",
      next: ".bpx-player-ctrl-next",
    },
    "v.youku.com": {
      full: "#fullscreen-icon",
      webfull: "#webfullscreen-icon",
      danmaku: "div[class*='switch-img_12hDa turn-']",
      next: ".kui-next-icon-0",
    },
  };

  const ZERO = 0;
  const ONE_SECOND = 1000;
  const HALF_SECOND = 500;
  const DEFAULT_PLAYBACK_RATE = 1;
  const PLAYBACK_RATE_STEP = 0.25; // 倍速步进
  const SHOW_TOAST_TIME = ONE_SECOND * 5; // 提示显示时长
  const SHOW_TOAST_POSITION = positions.bottomLeft; // 提示位置
  const PLAYBACK_RATE_INCREMENT_SYMBOL = "+";
  const PLAYBACK_RATE_DECREMENT_SYMBOL = "-";
  const MESSAGE_SOURCE = "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN";
  const CACHED_PLAYBACK_RATE_KEY = "FENY_SCRIPTS_V_PLAYBACK_RATE";
  const $ = (selector, context) => (context || document).querySelector(selector);
  const $$ = (selector, context) => (context || document).querySelectorAll(selector);
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
    getVideo: () => $("video[src]") || $("video"),
    getElement: () => $(selectorConfig[location.host]?.webfull),
    videoCanUse: (video) => !isNaN(video.duration) && video.duration !== Infinity,
    debounce(fn, delay = ONE_SECOND) {
      let timer;
      return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), delay);
      };
    },
    setupUrlChangeListener() {
      const _wr = (method) => {
        const original = history[method];
        history[method] = function () {
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
        if (video?.play && this.element) this.webFullScreen(video) && observer.disconnect();
        if (video?.play) this.setupVideoListener();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), ONE_SECOND * 10);
    },
    rebindVideo: false,
    videoListenerCycles: 0,
    videoBoundListeners: [],
    setupVideoListener() {
      if (isLivePage()) return;
      if (this.videoListenerCycles >= 5) return;
      this.videoListenerCycles++;
      this.addVideoEventsListener(this.getVideo());
      // console.log("setupVideoListener 循环次数：", this.videoListenerCycles);
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
        const videos = $$("video");
        for (const video of videos) {
          const rect = video.getBoundingClientRect();
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            if (this.video === video) return;
            if (this.videoCanUse(video)) return this.rebindVideoEventsListener(video);
          }
        }
      });
    },
    setupPageVisibilityListener() {
      window.addEventListener("visibilitychange", () => {
        const video = this.video;
        const state = document.visibilityState;
        if (video) Object.is(state, "visible") ? video.play() : video.pause();
      });
    },
    setVideoGeo(video) {
      const rect = video.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const videoGeo = (this.videoGeo = { x, y });
      if (window.top !== window) window.parent.postMessage({ source: MESSAGE_SOURCE, videoGeo }, "*");
    },
    showToast(content, duration = SHOW_TOAST_TIME) {
      document.querySelector(".showToast")?.remove();
      const toast = document.createElement("div");
      if (content instanceof HTMLElement) toast.appendChild(content);
      if (Object.is(typeof content, "string")) toast.textContent = content;
      toast.setAttribute("class", "showToast");
      toast.setAttribute("style", SHOW_TOAST_POSITION);
      this.video?.parentElement.parentElement.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = ZERO;
        setTimeout(() => toast.remove(), HALF_SECOND);
      }, duration);
    },
  };

  // 视频监听事件逻辑处理
  // this指向的是video.addEventListener
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
      if (!cachePlaybackRate || DEFAULT_PLAYBACK_RATE === cachePlaybackRate) return;
      if (cachePlaybackRate === this.playbackRate) return;
      // console.log(`当前播放倍速为：${this.playbackRate}，记忆倍速为：${cachePlaybackRate}`);
      const reuslt = ScriptsProgram.setPlaybackRate(cachePlaybackRate);
      if (!reuslt) return;
      if (this.isToast) return;
      ScriptsProgram.tipPlaybackRate();
      this.isToast = true;
    },
    ended() {
      this.isToast = false;
      const href = location.href;
      // if (/[a-zA-z]+:\/\/[^\s]*/.test(href)) return;
      if (!BILI_VIDEO_PAGE_REGEX.test(href) && !ACFUN_VIDEO_PAGE_REGEX.test(href)) return;
      function exitWebFullScreen() {
        const video = ScriptsProgram.video;
        if (window.innerWidth === video.offsetWidth) ScriptsProgram.getElement()?.click();
        const cancelAutoPlayNextButton = $(".bpx-player-ending-related-item-cancel"); // B站“取消连播”按钮
        if (cancelAutoPlayNextButton) cancelAutoPlayNextButton.click();
        console.log("已退出网页全屏！！");
      }
      const switchBtn = $(".video-pod .switch-btn.on");
      const podItems = $$(".video-pod .video-pod__item");
      // B站视频合集，为最后集播放或关闭了合集连播
      if (podItems.length > ZERO) {
        const lastPodItem = podItems[podItems.length - 1];
        const scrolled = lastPodItem.dataset.scrolled;
        if (scrolled === "true" || !switchBtn) exitWebFullScreen();
        return;
      }
      exitWebFullScreen();
    },
  };

  // 快捷键逻辑处理
  const KeydownHandler = {
    setupKeydownListener() {
      const handler = (event) => this.keydownHandler.call(this, event);
      window.addEventListener("keydown", handler, true);
      window.addEventListener("message", (event) => {
        const { data } = event;
        if (!data?.source) return;
        // console.log("接收到消息：", data);
        if (!data.source.includes(MESSAGE_SOURCE)) return;
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
        if (!isBiliLive()) return $(selectorConfig[location.host]?.[name])?.click();
        const control = this.getBiliLiveControlIcons();
        if (control) control[index]?.click();
      };
      const actions = {
        N: () => clickElement("next"),
        F: () => clickElement("full", ZERO),
        D: () => clickElement("danmaku", 3),
        A: () => this.stepPlaybackRate(PLAYBACK_RATE_INCREMENT_SYMBOL),
        S: () => this.stepPlaybackRate(PLAYBACK_RATE_DECREMENT_SYMBOL),
        "+": () => this.stepPlaybackRate(PLAYBACK_RATE_INCREMENT_SYMBOL),
        "-": () => this.stepPlaybackRate(PLAYBACK_RATE_DECREMENT_SYMBOL),
        Z: () => this.setPlaybackRate(DEFAULT_PLAYBACK_RATE) && this.showToast("已恢复正常倍速播放"),
        0: () => this.switchVideoPlayStatus(), // 是数字0，不是字母O
        "*": () => this.getPlayingVideo(),
      };
      if (actions[key]) actions[key]();
      if (/^[1-9]$/.test(key)) this.setPlaybackRate(key) && this.tipPlaybackRate();
      if (Object.is("P", key)) this.inMatches() ? clickElement("webfull", 1) : this.enhance();
    },
    inMatches() {
      return SCRIPTS_MATCHES.some((matche) => location.href.includes(matche));
    },
    switchVideoPlayStatus() {
      const video = this.video;
      if (video) video.paused ? video.play() : video.pause();
    },
    getPlayingVideo() {
      const videos = $$("video");
      for (const video of videos) {
        if (!video.paused && this.videoCanUse(video) && this.video !== video) {
          this.rebindVideoEventsListener(video);
          return;
        }
      }
    },
    getBiliLiveControlIcons() {
      const video = this.getVideo();
      if (!video) return;
      this.simulateMousemove(video);
      // 图标是从右到左：全屏、网页全屏、弹幕设置、弹幕开关、小窗模式，即下标[0]取到的是全屏图标
      return $$("#web-player-controller-wrap-el .right-area .icon");
    },
    postMessageToAllIframes(data) {
      $$("iframe").forEach((iframe) => {
        iframe?.contentWindow?.postMessage({ source: MESSAGE_SOURCE, ...data }, "*");
      });
    },
    simulateMousemove(target) {
      const y = target.offsetHeight / 2;
      const maxWidth = target.offsetWidth;
      const moveEvent = (x) =>
        target.dispatchEvent(new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true }));
      for (let i = ZERO; i < maxWidth; i += 100) moveEvent(i);
    },
  };

  // 播放倍速逻辑处理
  const VideoPlaybackRateHandler = {
    checkVideoAvailability() {
      if (isLivePage()) return;
      if (!this.video) return;
      // ↓主要针对于腾讯视频↓
      if (!this.rebindVideo && this.video !== this.getVideo()) return this.setupVideoListener();
      return true;
    },
    setPlaybackRate(playbackRate) {
      if (!this.checkVideoAvailability()) return;
      this.video.playbackRate = playbackRate;
      this.cachePlaybackRate();
      return true;
    },
    stepPlaybackRate(v_symbol) {
      if (!this.checkVideoAvailability()) return;
      if (PLAYBACK_RATE_INCREMENT_SYMBOL === v_symbol) this.video.playbackRate += PLAYBACK_RATE_STEP;
      if (PLAYBACK_RATE_DECREMENT_SYMBOL === v_symbol) this.video.playbackRate -= PLAYBACK_RATE_STEP;
      if (ZERO === this.video.playbackRate) this.video.playbackRate = PLAYBACK_RATE_STEP;
      this.cachePlaybackRate();
      this.tipPlaybackRate();
    },
    cachePlaybackRate() {
      localStorage.setItem(CACHED_PLAYBACK_RATE_KEY, this.video.playbackRate);
    },
    getCachePlaybackRate() {
      const cachePlaybackRate = localStorage.getItem(CACHED_PLAYBACK_RATE_KEY);
      return parseFloat(cachePlaybackRate || DEFAULT_PLAYBACK_RATE);
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
    },
  };

  // 网页全屏逻辑处理
  const WebFullScreenHandler = {
    webFullScreen(video) {
      const w = video.offsetWidth;
      if (ZERO === w) return false;
      if (window.innerWidth === w) return true;
      if (isBiliLive()) return this.biliLiveWebFullScreen();
      this.element.click();
      return true;
    },
    biliLiveWebFullScreen() {
      try {
        const topWindow = unsafeWindow.top;
        topWindow.scrollTo({ top: 70 });
        const ctnr = Object.is(topWindow, window) ? $("#player-ctnr") : $(".lite-room", topWindow.document);
        topWindow.scrollTo({ top: ctnr?.getBoundingClientRect()?.top || 0 });
        this.element.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
        localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0); // 关闭全屏礼物栏
        document.body.classList.add("hide-asida-area", "hide-aside-area"); // 关闭侧边聊天栏
        setTimeout(() => {
          $("#shop-popover-vm")?.remove(); // 关闭不支持“小橙车”提示
          $("#sidebar-vm")?.remove();
        }, HALF_SECOND);
        topWindow?.livePlayer?.volume(100);
        topWindow?.livePlayer?.switchQuality("10000"); // 原画画质
      } catch (error) {
        console.error("B站直播自动网页全屏异常：", error);
      }
      return true;
    },
  };

  // https://greasyfork.org/zh-CN/scripts/495077-maximize-video-improve
  // 自动播放页，不需要滑动获取video
  const ScriptsEnhanceHandler = {
    enhance() {
      const target = this.getHoverElement();
      this.simulateMouseover(target);
      this.triggerKeydownEvent();
    },
    getHoverElement() {
      if (this.hoverElement) return this.hoverElement;
      if (this.video) {
        this.hoverElement = this.video?.parentElement?.parentElement;
        return this.hoverElement;
      }

      const iframes = $$("iframe[src]");
      const { x, y } = this.videoGeo;
      for (const element of iframes) {
        const rect = element.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          this.hoverElement = element;
          return element;
        }
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
    },
  };

  const logicHandlers = [
    { handler: KeydownHandler },
    { handler: WebFullScreenHandler },
    { handler: VideoPlaybackRateHandler },
    { handler: ScriptsEnhanceHandler },
  ];
  //  使方法内部this指向为ScriptsProgram
  logicHandlers.forEach(({ handler }) => {
    for (const methodName of Object.keys(handler)) {
      ScriptsProgram[methodName] = handler[methodName].bind(ScriptsProgram);
    }
  });

  ScriptsProgram.init();
})();
