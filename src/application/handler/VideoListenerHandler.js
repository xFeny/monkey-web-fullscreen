import App from "../index";
import constants from "../common/constants";
const { DEF_PLAY_RATE, BILI_VID_REG, ACFUN_VID_REG } = constants;
// 视频监听事件逻辑处理
// this指向的是video.addEventListener对象
export default {
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
    if (!cachePlayRate || DEF_PLAY_RATE === cachePlayRate) return;
    if (cachePlayRate === this.playbackRate) return;
    // console.log(`当前播放倍速为：${this.playbackRate}，记忆倍速为：${cachePlayRate}`);
    const reuslt = App.setPlayRate(cachePlayRate);
    if (!reuslt) return;
    if (this.isToast) return;
    App.showRateTip();
    this.isToast = true;
  },
  ended() {
    this.isEnded = true;
    this.isToast = false;
    const href = location.href;
    // if (/[a-zA-z]+:\/\/[^\s]*/.test(href)) return;
    if (!BILI_VID_REG.test(href) && !ACFUN_VID_REG.test(href)) return;
    // B站视频合集播放的是合集最后一个或关闭了合集自动连播
    const pod = App.query(".video-pod");
    const pods = App.querys('.video-pod .switch-btn:not(.on), .video-pod__item:last-of-type[data-scrolled="true"]');
    if (pods.length > 0) return App.exitWebFullScreen();
    if (!pod) App.exitWebFullScreen();
  },
};
