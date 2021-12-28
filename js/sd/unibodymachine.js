window.NativeMethods = {
    printerState: function () {
        console.log("NativeMethods.printerState", url);
        return true;
    },
    printDoc: function (url) {
        console.log("NativeMethods.printDoc", url);
    },
    openTarget: function (url) {
        console.log("NativeMethods.openTarget", url);
        window.open(url);
    },
    videoChat: function (isVideo, json) {
        console.log("NativeMethods.videoChat", isVideo, json);
    },
    showError: function (errMsg) {
        console.log("NativeMethods.showError", errMsg);
    },
    back: function () {
        console.log("NativeMethods.back", errMsg);
    },
    enterReboot: function () {
        console.log("NativeMethods.enterReboot");
    },
    enterSetting: function () {
        console.log("NativeMethods.enterSetting");
    },
    voice: function (isRecord) {
        console.log("NativeMethods.voice", isRecord);
    },
    idRecognize: function (type) {
        console.log("NativeMethods.idRecognize", type);
    },
    goHome: function () {
        console.log("NativeMethods.goHome");
    },
    setTheme: function (theme) {
        console.log("NativeMethods.setTheme", theme);
    },
    removeUser: function () {
        console.log("NativeMethods.removeUser");
    },
    reTakePhoto: function () {
        console.log("NativeMethods.reTakePhoto");
    },
}
