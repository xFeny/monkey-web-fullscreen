// showToast 位置样式
const positions = Object.freeze({
  bottomLeft: "bottom: 20%; left: 10px;",
  center: "top: 50%; left: 50%; transform: translate(-50%, -50%);",
});
const ONE_SECOND = 1000;
export default Object.freeze({
  EMPTY: "",
  ASTERISK: "*",
  INC_SYMBOL: "+",
  DEC_SYMBOL: "-",
  MUL_SYMBOL: "×",
  DIV_SYMBOL: "÷",
  DEF_PLAY_RATE: 1,
  MAX_PLAY_RATE: 16,
  ONE_SEC: ONE_SECOND,
  PLAY_RATE_STEP: 0.25,
  SHOW_TOAST_TIME: ONE_SECOND * 5,
  SHOW_TOAST_POSITION: positions.bottomLeft,
  MSG_SOURCE: "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN",
  CACHED_PLAY_RATE_KEY: "FENY_SCRIPTS_V_PLAYBACK_RATE",
  QQ_VID_REG: /v.qq.com\/x/,
  ACFUN_VID_REG: /acfun.cn\/v/,
  IQIYI_VID_REG: /iqiyi.com\/v_*/,
  BILI_VID_REG: /bilibili.com\/video/,
});
