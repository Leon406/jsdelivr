// ==UserScript==
// @name         Double Click Open GoldenDict
// @namespace    http://tampermonkey.net/
// @version      2024-03-15
// @description double click to query selected word in goldendict
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goldendict.org
// @author       Leon406
// @license      AGPL-3.0-or-later
// @match        *://*/*
// @grant        none
// ==/UserScript==
 
(function () {
    'use strict';
    document.addEventListener("dblclick", e => {
        window.open("goldendict://" + getSelection().toString().trim())
    })
})();