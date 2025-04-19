import "./style.scss";
import App from "./application";
import KeydownHandler from "./application/handler/KeydownHandler";
import MenuCommandHandler from "./application/handler/MenuCommandHandler";
import WebFullScreenHandler from "./application/handler/WebFullScreenHandler";
import ScriptsEnhanceHandler from "./application/handler/ScriptsEnhanceHandler";
import VideoPlaybackRateHandler from "./application/handler/VideoPlaybackRateHandler";

const logicHandlers = [
  { handler: KeydownHandler },
  { handler: MenuCommandHandler },
  { handler: WebFullScreenHandler },
  { handler: VideoPlaybackRateHandler },
  { handler: ScriptsEnhanceHandler },
];
// 使方法内部this指向Application
logicHandlers.forEach(({ handler }) => {
  for (const key of Object.keys(handler)) {
    const method = handler[key];
    method instanceof Function ? (App[key] = method.bind(App)) : (App[key] = method);
  }
});
App.init();
