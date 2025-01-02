import { defineConfig } from "vite";
import monkey, { util } from "vite-plugin-monkey";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [util.unimportPreset],
    }),
    monkey({
      entry: "src/main.js",
      userscript: {
        author: "Feny",
        version: "2.2.0",
        license: "GPL-3.0-only",
        name: "视频网站自动网页全屏｜倍速播放",
        namespace: "http://tampermonkey.net/",
        homepage: "https://github.com/xFeny/monkey-web-fullscreen",
        description:
          "支持哔哩哔哩、B站直播、腾讯视频、优酷视频、爱奇艺、芒果TV、搜狐视频、AcFun弹幕网播放页自动网页全屏，视频网站统一支持快捷键切换：全屏(F)、网页全屏(P)、下一个视频(N)、弹幕开关(D)，支持任意视频倍速播放，B站播放完自动退出网页全屏",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqdJREFUWEftl91LFFEYxp/3jB9ESZjtSl51F1RUSgRCF/kHlF1IhiFhF65dqEQkBUErdJMStBukGwQre2NZUiCRqUiURkW65mIfqGUFsW6Ii0jY7p4Tc3Rqd5zaGVldAudynve8z28e3jMzh5Dmi1R/V0vQyRRWxgWG6x22SrcnOAhQcQIbwVtXba8y1EANSpS1xzJin5c/Dz+jRDPvGWoErwRw35zuh8ChpcXXFjbwi9k/WADA9viGgovGnxtFs6EmcApMvCdBA3oIIirl4N8NNQngmRYJiwTOE7EHHLERAmXFawQ6AdCQkRbjsZIMUvIFoV0HMSsEDjCgSK8tJqAHAEDAMWLKLOexx8tiVVDEhLLVQAtzRPcwKOUANSWCw1/rsBe6PcFz8dpfAdTFgtF+EmIvBG7pID7mZNl2zkVCFQbahzqHfYerddpNhFpdsnfqauzl8ZoEuO4JXdIKOefynnZlimxXhBbqjTZL/el8pzrAVjTGmKh12Bq1ddJs974abQDXfFMuAhQ6EodwDTHWAf6/BAoK8nD0cDEKtuVhyD+OzvvLXnyWJshyApedJ1F65M9n4tlAAF5fL168fGfJWCu2DDA61GpodLvjCdp8vfjyNWQJJGUAquvMzBzafD0yEc65KZCUAmiOo4FPEqS753VSiFUB0FxbPF244en6J8SqAoTD8zhYcjZ9AP6RCVRWNacHYPD5GJqudmBi8tvaAkxNBeUuuNv5NOkAqgUpm4FIJCrfA+r0z4bnTZmvCKCv+wrsts0JBg8fvZLGY28NfoqToFhOoOJ4CS40lMu2I28mpXFP37DpJ9YXWgZQG+Tm5mBL7qakA2aGakUAZhqbrVkH0BLoB34fzcyml5K6pd/yaicRlQlgV0q6mmwitMOpyfpVKfsFya4w73cz9xQAAAAASUVORK5CYII=",
        $extra: [
          ["note", ["*://*/*"]],
          ["note", ["v2.1.2 移除`0`快捷键；修复B站直播可见性监听失效问题"]],
          ["note", ["v2.0.0 新增倍速播放功能，页面可见性监听，倍速播放具体使用说明见脚本主页"]],
          ["note", ["v0.9.9 解决B站直播不支持`全屏切换`、`关闭弹幕`快捷键"]],
          ["note", ["v0.9.7 新增`全屏(F)`、`网页全屏(P)`、`下一个视频(N)`、`弹幕开关(D)`快捷键"]],
        ],
        match: [
          // "*://*/*",
          "*://tv.sohu.com/v/*",
          "*://www.mgtv.com/b/*",
          "*://www.acfun.cn/v/*",
          "*://www.iqiyi.com/v_*",
          "*://v.qq.com/x/page/*",
          "*://v.qq.com/x/cover/*",
          "*://haokan.baidu.com/v*",
          "*://live.bilibili.com/*",
          "*://v.youku.com/v_show/*",
          "*://live.acfun.cn/live/*",
          "*://www.acfun.cn/bangumi/*",
          "*://www.bilibili.com/list/*",
          "*://www.bilibili.com/video/*",
          "*://v.qq.com/live/p/newtopic/*",
          "*://www.bilibili.com/festival/*",
          "*://www.bilibili.com/cheese/play/*",
          "*://www.bilibili.com/bangumi/play/*",
        ],
      },
    }),
  ],
});
