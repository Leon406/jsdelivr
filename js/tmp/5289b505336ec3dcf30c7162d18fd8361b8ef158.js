var _js = "LINUXDO";
const a4 = j;

function h() {
    const o = [_js];
    return h = function() {
        return o;
    }, o;
}

function j(o, n) {
    const W = h();
    return j = function(n, c) {
        let t = W[n - 219];
        return t;
    }, j(o, n);
}

(function(o, n) {
    const W = a4;
    
    const cfg = {
        callback: function(o) {
            console.log(o);
        },
        // 保持原始 sitekey
        sitekey: "6Lcd9bsZAAAAAFnbu8qQGiXKNpwvFpCGKtQFLJKL"
    };

    const cleanInterval = setInterval(() => {
        if(!document || !window) {
            clearInterval(cleanInterval);
        }
    }, 500);

    window._js = "LINUXDO";
    
    window.onload = () => {
        o.grecaptcha.render("g-recaptcha", {
            callback: function(o) {
                console.log(o);
            },
            sitekey: "6Lcd9bsZAAAAAFnbu8qQGiXKNpwvFpCGKtQFLJKL"
        });
    };

})(window, document);