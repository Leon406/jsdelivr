var _js = 'LINUXDO', a1 = g;

function h() {
    const o = [_js];
    return h = function() {
        return o;
    }, o;
}

function g(W, o) {
    const n = h();
    return g = function(n, c) {
        let t = W[n - 253];
        return t;
    }, g(W, o);
}

(function(o, n) {
    var n = a1;
    
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