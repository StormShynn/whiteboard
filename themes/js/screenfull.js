/*!
 * * screenfull
 * * v3.0.0 - 2015-11-24
 * * (c) Sindre Sorhus; MIT License
 * */
! function() {
    "use strict";
    var a = "undefined" != typeof module && module.exports,
        b = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
        c = function() {
            for (var a, b, c = [
                    ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                    ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                    ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                    ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                    ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
                ], d = 0, e = c.length, f = {}; e > d; d++)
                if (a = c[d], a && a[1] in document) {
                    for (d = 0, b = a.length; b > d; d++) f[c[0][d]] = a[d];
                    return f
                }
            return !1
        }(),
        d = {
            request: function(a) {
                var d = c.requestFullscreen;
                a = a || document.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? a[d]() : a[d](b && Element.ALLOW_KEYBOARD_INPUT)
            },
            exit: function() {
                document[c.exitFullscreen]()
            },
            toggle: function(a) {
                this.isFullscreen ? this.exit() : this.request(a)
            },
            raw: c
        };
    return c ? (Object.defineProperties(d, {
        isFullscreen: {
            get: function() {
                return Boolean(document[c.fullscreenElement])
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return document[c.fullscreenElement]
            }
        },
        enabled: {
            enumerable: !0,
            get: function() {
                return Boolean(document[c.fullscreenEnabled])
            }
        }
    }), void(a ? module.exports = d : window.screenfull = d)) : void(a ? module.exports = !1 : window.screenfull = !1)
}();