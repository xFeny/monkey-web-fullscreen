import constants from "../common/constants";
const {
  INC_SYMBOL,
  DEC_SYMBOL,
  MUL_SYMBOL,
  DIV_SYMBOL,
  DEF_PLAY_RATE,
  MAX_PLAY_RATE,
  PLAY_RATE_STEP,
  CACHED_PLAY_RATE_KEY,
} = constants;
const strategy = {
  [MUL_SYMBOL]: (playRate) => playRate * 2,
  [DIV_SYMBOL]: (playRate) => playRate / 2,
  [INC_SYMBOL]: (playRate) => playRate + PLAY_RATE_STEP,
  [DEC_SYMBOL]: (playRate) => playRate - PLAY_RATE_STEP,
};
// 倍速播放逻辑处理
export default {
  checkVideoUsable() {
    if (this.isLivePage()) return false;
    if (!this.video) return false;
    if (this.rebindVideo) return true;
    if (this.video === this.getVideo()) return true;
    // 腾讯视频有两个video标签，播放一秒后会切换到另一个video，有src属性的才是正在播放的那个
    // 所以需要重新绑定到新的video
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
  },
};
