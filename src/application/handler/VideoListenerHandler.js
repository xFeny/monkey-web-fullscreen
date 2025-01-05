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
    this.isToast = false;
    const href = location.href;
    // if (/[a-zA-z]+:\/\/[^\s]*/.test(href)) return;
    if (!BILI_VID_REG.test(href) && !ACFUN_VID_REG.test(href)) return;
    // 视频播放结束，退出网页全屏
    function exitFullScr() {
      const video = App.video;
      if (window.innerWidth === video.offsetWidth) App.getElement()?.click();
      const cancelButton = App.query(".bpx-player-ending-related-item-cancel"); // B站“取消连播”按钮
      if (cancelButton) cancelButton.click();
      console.log("已退出网页全屏！！");
    }
    const switchBtn = App.query(".video-pod .switch-btn.on");
    const podItems = App.querys(".video-pod .video-pod__item");
    // B站视频合集，为最后集播放或关闭了合集连播
    if (podItems.length > 0) {
      const lastPodItem = podItems[podItems.length - 1];
      const scrolled = lastPodItem.dataset.scrolled;
      if (scrolled === "true" || !switchBtn) exitFullScr();
      return;
    }
    exitFullScr();
  },
};
