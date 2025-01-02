import constants from "../common/constants";
const {
  ZERO,
  INCREMENT_SYMBOL,
  DECREMENT_SYMBOL,
  PLAYBACK_RATE_STEP,
  DEFAULT_PLAYBACK_RATE,
  CACHED_PLAYBACK_RATE_KEY,
} = constants;
// 倍速播放逻辑处理
export default {
  checkVideoAvailability() {
    if (this.isLivePage()) return;
    if (!this.video) return;
    // ↓腾讯视频有两个video标签，播放一秒后会切换到另一个video，有src属性的才是正在播放的那个↓
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
    if (INCREMENT_SYMBOL === v_symbol) this.video.playbackRate += PLAYBACK_RATE_STEP;
    if (DECREMENT_SYMBOL === v_symbol) this.video.playbackRate -= PLAYBACK_RATE_STEP;
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
