import constants from "./common/constants";
import selectorConfig from "./common/selectorConfig";
import VideoListenerHandler from "./handler/VideoListenerHandler";
const { EMPTY, ONE_SEC, MSG_SOURCE, SHOW_TOAST_TIME, SHOW_TOAST_POSITION } = constants;
const matches = GM_info.script.matches.map((url) => url.replace(/\*/g, EMPTY));
export default {
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
  debounce(fn, delay = ONE_SEC) {
    let timer;
    return function () {
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
      if (video?.play) this.setupVideoListener();
      if (video?.play && this.element) {
        const result = this.webFullScreen(video);
        if (!result) return;
        observer.disconnect();
        this.webFullScreenExtras();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), ONE_SEC * 10);
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
    // console.log("setupVideoListener 循环次数：", this.videoListenerCycles);
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
    const videoGeo = (this.videoGeo = { x, y });
    if (window.top !== window) window.parent.postMessage({ source: MSG_SOURCE, videoGeo }, "*");
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
      setTimeout(() => el.remove(), ONE_SEC / 2);
    }, duration);
  },
};
