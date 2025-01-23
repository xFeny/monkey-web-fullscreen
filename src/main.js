import "./style.scss";
import App from "./application";
import KeydownHandler from "./application/handler/KeydownHandler";
import WebFullScreenHandler from "./application/handler/WebFullScreenHandler";
import ScriptsEnhanceHandler from "./application/handler/ScriptsEnhanceHandler";
import VideoPlaybackRateHandler from "./application/handler/VideoPlaybackRateHandler";

const logicHandlers = [
  { handler: KeydownHandler },
  { handler: WebFullScreenHandler },
  { handler: VideoPlaybackRateHandler },
  { handler: ScriptsEnhanceHandler },
];
// 使方法内部this指向Application
logicHandlers.forEach(({ handler }) => {
  for (const method of Object.keys(handler)) {
    App[method] = handler[method].bind(App);
  }
});
App.init();
