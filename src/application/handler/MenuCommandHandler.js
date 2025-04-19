import constants from "../common/constants";
const { CLOSE_AUTO_WEB_FULL_KEY, PLAY_RATE_STEP, VIDEO_TIME_STEP, KEYBOARD_COMMAND_KEY, VIDEO_FASTFORWARD_DURATION } =
  constants;

// 脚本菜单命令
export default {
  isCloseAuto: () => GM_getValue(CLOSE_AUTO_WEB_FULL_KEY, false),
  isCloseKeyboard: () => GM_getValue(KEYBOARD_COMMAND_KEY, true),
  registerMenuCommand() {
    this.setupPlayRateStepCommand();
    this.setupVideoTimeStepCommand();
    this.setupVideoFastforwardCommand();
    this.setupWebFullScreenCommand();
    this.setupKeyboardCommand();
  },
  setupPlayRateStepCommand() {
    const title = "设置倍速步进";
    GM_registerMenuCommand(title, () => {
      const input = prompt(title, GM_getValue(PLAY_RATE_STEP.name, 0.25));
      if (!isNaN(input) && Number.parseFloat(input)) GM_setValue(PLAY_RATE_STEP.name, input);
    });
  },
  setupVideoTimeStepCommand() {
    if (this.isTencent()) return;
    const title = "设置快进/快退时长";
    GM_registerMenuCommand(title, () => {
      const input = prompt(title, GM_getValue(VIDEO_TIME_STEP.name, 5));
      if (!isNaN(input) && Number.parseInt(input)) GM_setValue(VIDEO_TIME_STEP.name, input);
    });
  },
  setupVideoFastforwardCommand() {
    if (this.isTencent()) return;
    const title = "设置数字零键快进时长";
    GM_registerMenuCommand(title, () => {
      const input = prompt(title, GM_getValue(VIDEO_FASTFORWARD_DURATION.name, 30));
      if (!isNaN(input) && Number.parseInt(input)) GM_setValue(VIDEO_FASTFORWARD_DURATION.name, input);
    });
  },
  setupWebFullScreenCommand() {
    const isClose = GM_getValue(CLOSE_AUTO_WEB_FULL_KEY, false);
    const web_full_id = GM_registerMenuCommand(isClose ? "开启自动网页全屏" : "关闭自动网页全屏", () => {
      GM_setValue(CLOSE_AUTO_WEB_FULL_KEY, !isClose);
      GM_unregisterMenuCommand(web_full_id);
      this.setupWebFullScreenCommand();
    });
  },
  setupKeyboardCommand() {
    if (this.isTencent()) return;
    const isClose = this.isCloseKeyboard();
    const title = isClose ? "开启 空格 ◀▶ 键盘控制" : "关闭 空格 ◀▶ 键盘控制";
    const keyboard_id = GM_registerMenuCommand(title, () => {
      GM_setValue(KEYBOARD_COMMAND_KEY, !isClose);
      GM_unregisterMenuCommand(keyboard_id);
      this.setupKeyboardCommand();
    });
  },
};
