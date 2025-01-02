import "./style.css";
import ScriptsProgram from "./ScriptsProgram";
import KeydownHandler from "./handler/KeydownHandler";
import WebFullScreenHandler from "./handler/WebFullScreenHandler";
import ScriptsEnhanceHandler from "./handler/ScriptsEnhanceHandler";
import VideoPlaybackRateHandler from "./handler/VideoPlaybackRateHandler";

(function () {
  "use strict";

  const BILI_LIVE_PAGE_REGEX = /live.bilibili.com\/(blanc\/)?\d+/;
  window.isBiliLive = () => location.host === "live.bilibili.com";
  if (isBiliLive() && !BILI_LIVE_PAGE_REGEX.test(location.href)) return;

  const logicHandlers = [
    { handler: KeydownHandler },
    { handler: WebFullScreenHandler },
    { handler: VideoPlaybackRateHandler },
    { handler: ScriptsEnhanceHandler },
  ];
  //  使方法内部this指向为ScriptsProgram
  logicHandlers.forEach(({ handler }) => {
    for (const methodName of Object.keys(handler)) {
      ScriptsProgram[methodName] = handler[methodName].bind(ScriptsProgram);
    }
  });

  ScriptsProgram.init();
})();
