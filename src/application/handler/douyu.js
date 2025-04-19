/**
 * 斗鱼视频相关
 */
export default {
  getRoot() {
    return document.querySelector("demand-video").shadowRoot;
  },
  getControllerBar() {
    return this.getRoot().querySelector("#demandcontroller-bar").shadowRoot;
  },
  getVideo() {
    return this.getRoot().querySelector("video");
  },
  play() {
    this.getControllerBar().querySelector(".ControllerBarPlay").click();
  },
  pause() {
    this.getControllerBar().querySelector(".ControllerBarStop").click();
  },
  getWebfullIcon() {
    return this.getControllerBar().querySelector(".ControllerBar-PageFull-Icon");
  },
  getFullIcon() {
    return this.getControllerBar().querySelector(".ControllerBar-WindowFull-Icon");
  },
  getDanmakuIcon() {
    return document.querySelector("demand-player-extension").shadowRoot.querySelector(".BarrageSwitch-icon");
  },
  addStyle() {
    const root = this.getRoot();
    let style = root.querySelector("style");
    if (style) return;
    style = document.createElement("style");
    style.textContent = `
      .showToast {
        color: #fff !important;
        font-size: 13.5px !important;
        padding: 5px 15px !important;
        border-radius: 5px !important;
        position: absolute !important;
        z-index: 2147483647 !important;
        font-weight: normal !important;
        transition: opacity 500ms ease-in;
        background: rgba(0, 0, 0, 0.75) !important;
      }
    `;
    root.prepend(style);
  },
};
