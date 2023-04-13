// ==UserScript==
// @name         Free Read And Go
// @namespace    http://tampermonkey.net/
// @version      2023.04.13
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
    "link.juejin.cn": {
        prefix: "https://link.juejin.cn/?target=",
        query: "target",
        action: urlDecode
    },
    "www.douban.com": {
        prefix: "https://www.douban.com/link2/",
        query: "url",
        action: urlDecode
    },
    "feishu.cn": {
        func: () => get_elements(".outer-u-container a", filterThirdATag).forEach(createNewTag)
    },
    "security.feishu.cn": {
        prefix: "https://security.feishu.cn/link/safety?",
        query: "target",
        action: urlDecode
    },
    "51.ruyo.net": {
        prefix: "https://51.ruyo.net/go/index.html?u=",
        query: "u",
        action: urlDecode
    },
    "blog.51cto.com": {
        prefix: "https://blog.51cto.com/transfer?",
        action: urlDecode,
        //func: () => get_elements(".article-content-wrap a", filterThirdATag).forEach(removeOnClick)
    },
    "zhuanlan.zhihu.com": {
        prefix: "https://link.zhihu.com/?target",
        query: "target",
        action: urlDecode
    },
    "www.zhihu.com": {
        prefix: "https://link.zhihu.com/?target",
        query: "target",
        action: urlDecode
    },
    "gitee.com": {
        prefix: "https://gitee.com/link?target=",
        query: "target",
        action: urlDecode
    },
    "xie.infoq.cn": {
        prefix: "https://xie.infoq.cn/link?",
        query: "target",
        action: urlDecode,
        func: () => get_elements(".main a", filterThirdATag).forEach(createNewTag)
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
     "weibo.cn": {
        prefix: "https://weibo.cn/sinaurl?u=",
        query: "u",
        action: urlDecode
    },
	"www.qcc.com": {
        prefix: "https://www.qcc.com/web/transfer-link?",
        query: "link",
        action: urlDecode
    },
    
    "leetcode.cn": {
        prefix: "https://leetcode.cn/link/?target=",
        query: "target",
        action: urlDecode
    },
    
      "www.jianshu.com": {
        prefix: "https://link.jianshu.com",
        query: "t",
		prefix2: "https://www.jianshu.com/go-wild",
        query2: "url",
        action: urlDecode
    },
    
    "docs.google.com": {
        prefix: "https://www.google.com/url?",
        query: "q",
        action: urlDecode
    },
    "t.me": {
        prefix: "https://t.me/iv?url=",
        query: "url",
        action: urlDecode
    },
    "telegra.ph": {
        prefix: "https://t.me/iv?url=",
        query: "url",
        action: urlDecode
    },
    "www.pixiv.net": {
        prefix: "https://www.pixiv.net/jump.php",
        query: "url",
        action: urlDecode
    },
    "www.youtube.com": {
        prefix: "https://www.youtube.com/redirect?",
        query: "q",
        action: urlDecode
    },
	"www.linkedin.com": {
        prefix: "https://www.linkedin.com/redir/redirect?",
        query: "url",
        action: urlDecode
    },
    "mail.qq.com": {
        prefix: "https://mail.qq.com/cgi-bin/readtemplate",
        query: "gourl",
        action: urlDecode,
        intervalFunc: () => get_elements("#contentDiv a", filterThirdATag).forEach(stopropagation)
    },
    "bbs.nga.cn": {
        func: () => get_elements("#m_posts a", filterThirdATag).forEach(removeOnClick)
    },
    "nga.178.com": {
        func: () => get_elements("#m_posts a", filterThirdATag).forEach(removeOnClick)
    },
    "tieba.baidu.com": {
        prefix: "https://tieba.baidu.com/mo/q/checkurl?url=",
        query: "url",
        action: urlDecode,
        intervalFunc: () => get_elements("#container a", filterThirdATag).forEach(stopropagation)
    },
    "blog.csdn.net": {
        func: () => get_elements(".blog-content-box a", filterThirdATag).forEach(createNewTag)
    },
    "developers.weixin.qq.com": {
        prefix: "/community/middlepage/href?href=",
        query: "href",
        action: urlDecode,
        func: () => get_elements("a", filterThirdATag).forEach(stopropagation)
    }
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

function createNewTag(aTag) {
    console.log("rewriteOnClick", aTag)
    if (!aTag.onclick && aTag.href) {
        aTag.onclick = function antiRedirectOnClickFn(e) {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log("stop__", aTag)
            const tmpA = document.createElement("a");
            tmpA.href = aTag.href;
            tmpA.target = "_blank";
            tmpA.click();
        };
    }
}

function interval(func, period = 500) {
    console.log("interval", func)
    setInterval(func, period)
}

function urlDecode(aTag, query) {
    console.log("urlDecode", query, aTag)
    let url = new URL(aTag.href);
    aTag.href = decodeURIComponent(query && url.searchParams.get(query) || url.search.replace("?", ""))
    console.log("urlDecode", url.searchParams.get(query), url.search.replace("?", ""))
}

function removeClick() {
    document.body.addEventListener('click', function (event) {
        var target = event.target || event.srcElement;
        if (target.nodeName.toLocaleLowerCase() === 'a') {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                window.event.returnValue = true;
            }
            var url = target.getAttribute("href")
                if (target.getAttribute("target") === '_blank') {
                    window.open(url)
                } else {
                    window.location.href = url
                }
        }
    });
}

function findAllHref(rule = "http") {
    return get_elements("a", el => el.href.includes(rule))
}

(function () {
    'use strict';
    let rule = REAL_GO[host] || REAL_GO[rootHost];
    console.log("====rule 11", rule)
    if (rule && rule.prefix && window.location.href.startsWith(rule.prefix)) {
        let url = new URL(window.location.href);
		let targetUrl= decodeURIComponent(rule.query && url.searchParams.get(rule.query) || url.search.replace("?", ""))
        window.location.href = targetUrl.includes("://")? targetUrl: ("https://"+targetUrl);
        console.log("redirect-------->", window.location.href)
        return;
    }
	
	 if (rule && rule.prefix2 && window.location.href.startsWith(rule.prefix2)) {
        let url = new URL(window.location.href);
		let targetUrl= decodeURIComponent(rule.query2 && url.searchParams.get(rule.query2) || url.search.replace("?", ""))
        window.location.href = targetUrl.includes("://")? targetUrl: ("https://"+targetUrl);
        console.log("redirect2-------->", window.location.href)
        return;
    }
    window.onload = function () {
        setTimeout(() => {
            console.log("====rule", rule)
            if (rule) {
                rule.prefix && findAllHref(rule.prefix).forEach(el => {
                    rule.action && rule.action(el, rule.query)
                });
				rule.prefix2 && findAllHref(rule.prefix2).forEach(el => {
                    rule.action && rule.action(el, rule.query2)
                });
                rule.func && rule.func()
                rule.intervalFunc && interval(rule.intervalFunc)
            }

        }, 3000)
    }
})();
