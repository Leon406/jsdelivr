// ==UserScript==
// @name         Free Go
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阅读全文,链接直接跳转
// @author       Leon406
// @match        *://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==

const host = window.location.host

const REAL_GO = {
        "gitee.com": {
             prefix: "https://gitee.com/link?target=",
             query: "target",
             action: urlDecode
        }
    }
	
function findRule() {
	
	for (key in REAL_GO) {
		
	}
}	
	
	
function stopropagation(aTag) {
	if (aTag.onclick) {
        aTag.onclick = (e) => {
          // 阻止事件冒泡, 因为上层元素绑定的click事件会重定向
          if (e.stopPropagation) {
             e.stopPropagation();
          }
        };
      }
}	
 

function urlDecode(aTag, query) {
    aTag.href = decodeURIComponent( new URL(aTag.href).searchParams.get(query))
}

 // 查询所有a标签
function findAllHref(rule = "http") {
    return Array.from(document.querySelectorAll("a")).filter(el=> el.href.includes(rule))
}

function findMore() {

}

(function() {
    'use strict';
    let rule = REAL_GO[host];
	 findAllHref("http").forEach(stopropagation);
    if(rule) {
         findAllHref(rule.prefix).forEach(el=>{
           rule.action(el,rule.query)
        });
    }
})();