// showToast 位置样式
const positions = Object.freeze({
  bottomLeft: "bottom: 17%; left: 10px;",
  center: "top: 50%; left: 50%; transform: translate(-50%, -50%);",
});
// 生成A-Z的字母
const keyCode = (() => {
  const result = {};
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    result[letter] = letter;
  }
  return result;
})();
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
  VIDEO_REWIND: "VIDEO_REWIND",
  VIDEO_FORWARD: "VIDEO_FORWARD",
  SHOW_TOAST_TIME: ONE_SECOND * 5,
  SHOW_TOAST_POSITION: positions.bottomLeft,
  MSG_SOURCE: "FENY_SCRIPTS_AUTO_WEB_FULLSCREEN",
  CACHED_PLAY_RATE_KEY: "FENY_SCRIPTS_V_PLAYBACK_RATE",
  CLOSE_AUTO_WEB_FULL_KEY: "CLOSE_AUTO_WEB_FULL_SCREEN",
  KEYBOARD_COMMAND_KEY: "KEYBOARD_COMMAND",
  QQ_VID_REG: /v.qq.com\/x/,
  ACFUN_VID_REG: /acfun.cn\/v/,
  IQIYI_VID_REG: /iqiyi.com\/v_*/,
  BILI_VID_REG: /bilibili.com\/video/,
  KEYCODE: Object.freeze({ ...keyCode, SPACE: " " }),
  VIDEO_FASTFORWARD_DURATION: {
    name: "VIDEO_FASTFORWARD_DURATION",
    value() {
      return Number.parseInt(GM_getValue(this.name, 30)); //  数字0键，快进时长
    },
  },
  VIDEO_TIME_STEP: {
    name: "VIDEO_TIME_STEP",
    value() {
      return Number.parseInt(GM_getValue(this.name, 5)); //  快进退时长
    },
  },
  PLAY_RATE_STEP: {
    name: "PLAY_RATE_STEP",
    value() {
      return Number.parseFloat(GM_getValue(this.name, 0.25)); //  倍速步进
    },
  },
});
