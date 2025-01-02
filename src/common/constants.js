// showToast 位置样式
const positions = {
  bottomLeft: "bottom: 20%; left: 10px;",
  center: "top: 50%; left: 50%; transform: translate(-50%, -50%);",
};
const ONE_SECOND = 1000;
export default Object.freeze({
  ZERO: 0,
  ONE_SECOND,
  ASTERISK: "*",
  INCREMENT_SYMBOL: "+",
  DECREMENT_SYMBOL: "-",
  DEFAULT_PLAYBACK_RATE: 1,
  PLAYBACK_RATE_STEP: 0.25,
  SHOW_TOAST_TIME: ONE_SECOND * 5,
  SHOW_TOAST_POSITION: positions.bottomLeft,
  SOURCE: "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN",
  CACHED_PLAYBACK_RATE_KEY: "FENY_SCRIPTS_V_PLAYBACK_RATE",
  ACFUN_VIDEO_PAGE_REGEX: /acfun.cn\/v/,
  BILI_VIDEO_PAGE_REGEX: /bilibili.com\/video/,
});
