import constants from "./common/constants";
import selectorConfig from "./common/selectorConfig";
import VideoListenerHandler from "./handler/VideoListenerHandler";
import douyu from "./handler/douyu";
const { ONE_SEC, QQ_VID_REG, MSG_SOURCE, SHOW_TOAST_TIME, SHOW_TOAST_POSITION } = constants;
const matches = GM_info.script.matches
  .filter((match) => match !== "*://*/*")
  .map((match) => match.replace(/\*/g, "\\S+"));
export default {
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
  postMessage: (win = null, data) => win?.postMessage({ source: MSG_SOURCE, ...data }, "*"),
  getVideo() {
    return this.isDouyu() ? douyu.getVideo() : this.query("video:not([src=''])") || this.querys("video");
  },
  getElement() {
    return this.isDouyu() ? douyu.getWebfullIcon() : document.querySelector(selectorConfig[location.host]?.webfull);
  },
  getVideoIframe() {
    // video所在的iframe标签
    if (!this.videoGeo.frameSrc) return null;
    const url = new URL(this.videoGeo.frameSrc);
    const src = decodeURI(url.pathname + url.search);
    return this.query(`iframe[src*="${src}"]`);
  },
  debounce(fn, delay = ONE_SEC) {
    let timer;
    return function () {
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
      history[method] = function () {
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
    setTimeout(() => observer.disconnect(), ONE_SEC * 10);
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
      this.rebindVideoEvtListener(video); // 正在播放的video
      return;
    }
  },
  heartbeatCurrentVideo() {
    // 页面上有多个video，获取当前播放的video
    let intervalID = null;
    if (intervalID) return;
    intervalID = setInterval(() => {
      const result = this.getPlayingVideo();
      if (result) clearInterval(intervalID);
    }, ONE_SEC);
  },
  setVideoGeo(video) {
    try {
      const rect = video.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const videoGeo = (this.videoGeo = { x, y, frameSrc: !this.isTopWin() ? location.href : null });
      if (!this.isTopWin()) parent.postMessage({ source: MSG_SOURCE, videoGeo }, "*");
    } catch (e) {}
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
      setTimeout(() => el.remove(), ONE_SEC / 2);
    }, duration);
  },
};
