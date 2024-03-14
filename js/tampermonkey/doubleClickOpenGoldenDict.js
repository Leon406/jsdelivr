// ==UserScript==
// @name         Double Click Open GoldenDict
// @namespace    http://tampermonkey.net/
// @version      2024-03-14
// @description double click to query selected word in goldendict
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goldendict.org
// @author       Leon406
// @license      AGPL-3.0-or-later
// @match        *://*/*
// @grant        none
// ==/UserScript==
 
(function () {
    'use strict';
    const getSelectionText = () => {
        let text = getSelection().toString().trim();
        if (!!text && /[a-z0-9]/i.test(text)) {
            return text;
        } else {
            return null;
        }
    };
    document.addEventListener("dblclick", e => {
        const ev = e.target;
        if (ev.nodeName === "INPUT" && ev.getAttribute("type") === "password") {
            const v = ev.value
                ev.setAttribute("type", "text");
            ev.value = v
                setTimeout(() => {
                    ev.setAttribute("type", "password")
                }, 5000)
                ev.onblur = () => ev.setAttribute("type", "password")
        }
        window.open("goldendict://" + getSelectionText())
    })
 
})();