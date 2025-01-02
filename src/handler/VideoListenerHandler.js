import constants from "../common/constants";
import ScriptsProgram from "../ScriptsProgram";
const { ZERO, DEFAULT_PLAYBACK_RATE, BILI_VIDEO_PAGE_REGEX, ACFUN_VIDEO_PAGE_REGEX } = constants;
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
    // 视频播放结束，退出网页全屏
    function exitWebFullScreen() {
      const video = ScriptsProgram.video;
      if (window.innerWidth === video.offsetWidth) ScriptsProgram.getElement()?.click();
      const cancelButton = document.querySelector(".bpx-player-ending-related-item-cancel"); // B站“取消连播”按钮
      if (cancelButton) cancelButton.click();
      console.log("已退出网页全屏！！");
    }
    const switchBtn = document.querySelector(".video-pod .switch-btn.on");
    const podItems = document.querySelectorAll(".video-pod .video-pod__item");
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
