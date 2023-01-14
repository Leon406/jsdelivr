// ==UserScript==
// @name         Free Read And Go
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  链接直接跳转,阅读全文(todo)
// @author       Leon406
// @match        *://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL-3.0 License
// ==/UserScript==

const host = window.location.host

    const REAL_GO = {
    "gitee.com": {
        prefix: "https://gitee.com/link?target=",
        query: "target",
        action: urlDecode
    },
     "sspai.com": {
        prefix: "https://sspai.com/link?",
        query: "target",
        action: urlDecode
    },
    "www.youtube.com": {
        prefix: "https://www.youtube.com/redirect?",
        query: "q",
        action: urlDecode
    },
    "mail.qq.com": {
        fuc: () => get_elements("#contentDiv a").forEach(stopropagation)
    },
    "tieba.baidu.com": {
        fuc: () => get_elements("#container a").forEach(stopropagation)
    },
}

function findRule() {

    for (key in REAL_GO) {}
}

function find_all_iframe(doc = document) {
    let frame = doc.querySelectorAll("iframe");
    if (frame.length === 0)
        return [];
    let frames = Array.from(frame)
        .filter(el => el.contentDocument)
        if (frames.length > 0) {
            let frames2 = frames.flatMap(el => find_all_iframe(el.contentDocument))
                if (frames2.length > 0) {
                    frames2.forEach(e => frames.push(e))
                }
        }
        return frames;
}

function get_elements(selector, cond = el => el) {
    let elements = Array.from(document.querySelectorAll(selector)).filter(cond);
    if (elements.length === 0) {
        elements = find_all_iframe()
            .flatMap(el => Array.from(el.contentDocument.querySelectorAll(selector)))
            .filter(el => cond(el));
    }
    return elements;
}

const stopEvent = (e) => {
    console.log("eeee", e)
    // 阻止事件冒泡, 因为上层元素绑定的click事件会重定向
    if (e.stopPropagation) {
        e.stopPropagation();
    }
};

function stopropagation(aTag) {
    if (aTag.onclick && aTag.onclick != stopEvent)
        aTag.onclick = stopEvent
}

function interval(fuc, timeout = 500) {
    setInterval(fuc, timeout)
}

function urlDecode(aTag, query) {
    console.log("urlDecode", query, aTag)
    aTag.href = decodeURIComponent(new URL(aTag.href).searchParams.get(query))
}

// 查询所有a标签
function findAllHref(rule = "http") {
    return get_elements("a", el => el.href.includes(rule))
}

(function () {
    'use strict';
    window.onload = function () {
        let rule = REAL_GO[host];
        setTimeout(() => {
            console.log("rule", rule)
            if (rule) {
                findAllHref(rule.prefix).forEach(el => {
                    rule.action && rule.action(el, rule.query)
                    rule.fuc && interval(rule.fuc)
                });
            }

        }, 3000)
    }
})();
