// ==UserScript==
// @name         Free Read And Go
// @namespace    http://tampermonkey.net/
// @version      2023.01.14.3
// @description  链接直接跳转,阅读全文(todo)
// @author       Leon406
// @match        *://**/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @homepageURL  https://github.com/Leon406/jsdelivr/tree/master/js/tampermonkey
// @grant        none
// @license      GPL-3.0 License
// ==/UserScript==

const host = window.location.host;
const rootHost = host.replaceAll(/.*\.(\w+\.\w+)$/g, "$1");

const REAL_GO = {
    "gitee.com": {
        prefix: "https://gitee.com/link?target=",
        query: "target",
        action: urlDecode
    },
    "xie.infoq.cn": {
        prefix: "https://xie.infoq.cn/link?",
        query: "target",
        action: urlDecode,
        intervalFunc: () => get_elements(".main a", filterThirdATag).forEach(stopropagation)
    },
    "sspai.com": {
        prefix: "https://sspai.com/link?",
        query: "target",
        action: urlDecode
    },
    "afdian.net": {
        prefix: "https://afdian.net/link?",
        query: "target",
        action: urlDecode
    },
    "www.oschina.net": {
        prefix: "https://www.oschina.net/action/GoToLink?",
        query: "url",
        action: urlDecode
    },
    "c.pc.qq.com": {
        prefix: "https://c.pc.qq.com/middlem.html?",
        query: "pfurl",
        action: urlDecode
    },
    "www.youtube.com": {
        prefix: "https://www.youtube.com/redirect?",
        query: "q",
        action: urlDecode
    },
    "mail.qq.com": {
        intervalFunc: () => get_elements("#contentDiv a", filterThirdATag).forEach(stopropagation)
    },
    "bbs.nga.cn": {
        func: () => get_elements("#m_posts a", filterThirdATag).forEach(removeOnClick)
    },
    "nga.178.com": {
        func: () => get_elements("#m_posts a", filterThirdATag).forEach(removeOnClick)
    },
    "tieba.baidu.com": {
        intervalFunc: () => get_elements("#container a").forEach(stopropagation)
    },
}

function filterThirdATag(aTag) {
    return aTag.href.startsWith("http") && !aTag.href.includes(rootHost)
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
    if (e.stopPropagation) {
        e.stopPropagation();
    }
};

function stopropagation(aTag) {
    if (aTag.onclick && aTag.onclick != stopEvent)
        aTag.onclick = stopEvent
}

function removeOnClick(aTag) {
    if (aTag.onclick)
        aTag.onclick = null;
    console.log("removeOnClick", aTag)
    aTag.removeEventListener("click", function () {});

}

function interval(func, period = 500) {
    console.log("interval", func)
    setInterval(func, period)
}

function urlDecode(aTag, query) {
    console.log("urlDecode", query, aTag)
    aTag.href = decodeURIComponent(new URL(aTag.href).searchParams.get(query))
}

function findAllHref(rule = "http") {
    return get_elements("a", el => el.href.includes(rule))
}

(function () {
    'use strict';
    let rule = REAL_GO[host];
    if (rule && rule.prefix && window.location.href.startsWith(rule.prefix)) {
        window.location.href = decodeURIComponent(new URL(window.location.href).searchParams.get(rule.query));
		console.log("redirect-------->")
        return;
    }
    window.onload = function () {
        setTimeout(() => {
            console.log("====rule", rule)
            if (rule) {
                rule.prefix && findAllHref(rule.prefix).forEach(el => {
                    rule.action && rule.action(el, rule.query)
                });
                rule.func && rule.func()
                rule.intervalFunc && interval(rule.intervalFunc)
            }

        }, 3000)
    }
})();
