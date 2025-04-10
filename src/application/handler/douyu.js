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
  getWebfullIcon() {
    return this.getControllerBar().querySelector(".ControllerBar-PageFull-Icon");
  },
  getFullIcon() {
    return this.getControllerBar().querySelector(".ControllerBar-WindowFull-Icon");
  },
  getDanmakuIcon() {
    return document.querySelector("demand-player-extension").shadowRoot.querySelector(".BarrageSwitch-icon");
  },
  play() {
    this.getControllerBar().querySelector(".ControllerBarPlay").click();
  },
  pause() {
    this.getControllerBar().querySelector(".ControllerBarStop").click();
  },
  addStyle() {
    this.getRoot().querySelectorAll(".style").forEach((el) => el.remove());
    const style = document.createElement("style");
    style.setAttribute("class", "style");
    style.textContent = `
      .showToast {
        color: #fff !important;
        font-size: 14px !important;
        padding: 5px 15px !important;
        border-radius: 5px !important;
        position: absolute !important;
        z-index: 2147483647 !important;
        transition: opacity 500ms ease-in;
        background: rgba(0, 0, 0, 0.75) !important;
      }
      .showToast .playbackRate {
        margin: 0 3px !important;
        color: #ff6101 !important;
      }
    `;
    this.getRoot().appendChild(style);
    this.getRoot().querySelectorAll(".showToast").forEach((el) => el.remove());
  },
};
