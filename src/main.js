import "./style.css";
import consts from "./common/constants";
import ScriptsProgram from "./ScriptsProgram";
import KeydownHandler from "./handler/KeydownHandler";
import WebFullScreenHandler from "./handler/WebFullScreenHandler";
import ScriptsEnhanceHandler from "./handler/ScriptsEnhanceHandler";
import VideoPlaybackRateHandler from "./handler/VideoPlaybackRateHandler";

(function () {
  "use strict";

  if (ScriptsProgram.isBiliLive() && !consts.BILI_LIVE_REG.test(location.href)) return;

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
