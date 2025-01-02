import constants from "./common/constants";
import selectorConfig from "./common/selectorConfig";
import VideoListenerHandler from "./handler/VideoListenerHandler";
const { EMPTY, ONE_SEC, MSG_SOURCE, SHOW_TOAST_POSITION, SHOW_TOAST_TIME } = constants;
const matches = GM_info.script.matches.map((url) => url.replace(/\*/g, EMPTY));
export default {
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
  getElement: () => document.querySelector(selectorConfig[location.host]?.webfull),
  videoCanUse: (video) => !isNaN(video.duration) && video.duration !== Infinity,
  isLivePage: () => location.href.includes("live"),
  isBiliLive: () => location.host === "live.bilibili.com",
  debounce(fn, delay = ONE_SEC) {
    let timer;
    return function () {
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
      history[method] = function () {
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
      if (video?.play && this.element) this.webFullScreen(video) && observer.disconnect();
      if (video?.play) this.setupVideoListener();
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
    const videoGeo = (this.videoGeo = { x, y });
    if (window.top !== window) window.parent.postMessage({ source: MSG_SOURCE, videoGeo }, "*");
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
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), ONE_SEC / 2);
    }, duration);
  },
};
