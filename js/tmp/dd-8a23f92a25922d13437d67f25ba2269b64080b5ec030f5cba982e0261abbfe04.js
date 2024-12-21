!function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).DisableDevtool = t()
}
(this, function () {
    "use strict";

    // 只保留基础配置和接口,移除反调试功能
    var d = {
        md5: "",
        ondevtoolopen: function () {},
        ondevtoolclose: null,
        url: "",
        timeOutUrl: "",
        tkName: "ddtk",
        interval: 500,
        disableMenu: false,
        stopIntervalTime: 5000,
        clearIntervalWhenDevOpenTrigger: false,
        detectors: [],
        clearLog: false,
        disableSelect: false,
        disableCopy: false,
        disableCut: false,
        disablePaste: false,
        ignore: null,
        disableIframeParents: false,
        seo: true,
        rewriteHTML: ""
    };

    // 空函数,维持接口兼容性
    function q(cfg) {
        if (cfg) {
            Object.assign(d, cfg);
        }
    }

    // 维持必要的工具函数
    function ne(str) { // MD5实现保持不变
        return str; // 简化版,直接返回
    }

    // 清理了反调试检测的类,改为空实现
    var O = {
        Unknown: -1,
        RegToString: 0,
        DefineId: 1,
        Size: 2,
        DateToString: 3,
        FuncToString: 4,
        Debugger: 5,
        Performance: 6,
        DebugLib: 7
    };

    // 主函数,移除了所有检测逻辑
    function R(options) {
        if (options) {
            q(options);
        }
        R.isRunning = true;
        return {
            success: true,
            reason: ''
        };
    }

    // 保持原有接口
    R.isRunning = false;
    R.isSuspend = false;
    R.md5 = ne;
    R.version = "0.3.8";
    R.DetectorType = O;
    R.isDevToolOpened = function () {
        return false;
    };

    return R;
});
