import constants from "../common/constants";
const { INC_SYMBOL, DEC_SYMBOL, DEF_PLAY_RATE, PLAY_RATE_STEP, CACHED_PLAY_RATE_KEY } = constants;
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
  setPlayRate(playbackRate) {
    if (!this.checkVideoUsable()) return;
    this.video.playbackRate = playbackRate;
    this.cachePlayRate();
    return true;
  },
  adjPlayRate(_symbol) {
    if (!this.checkVideoUsable()) return;
    if (INC_SYMBOL === _symbol) this.video.playbackRate += PLAY_RATE_STEP;
    if (DEC_SYMBOL === _symbol) this.video.playbackRate -= PLAY_RATE_STEP;
    if (0 === this.video.playbackRate) this.video.playbackRate = PLAY_RATE_STEP;
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
