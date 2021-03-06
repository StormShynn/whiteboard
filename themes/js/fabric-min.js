var fabric = fabric || {
    version: "1.5.0"
};
"undefined" !== typeof exports && (exports.fabric = fabric);
"undefined" !== typeof document && "undefined" !== typeof window ? (fabric.document = document, fabric.window = window, window.fabric = fabric) : (fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"), fabric.window = fabric.document.createWindow ? fabric.document.createWindow() : fabric.document.parentWindow);
fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;
fabric.isLikelyNode = "undefined" !== typeof Buffer && "undefined" === typeof window;
fabric.SHARED_ATTRIBUTES = "display transform fill fill-opacity fill-rule opacity stroke stroke-dasharray stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width id".split(" ");
fabric.DPI = 96;
fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)";
fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1;
(function() {
    function d(c, a) {
        this.__eventListeners[c] && (a ? fabric.util.removeFromArray(this.__eventListeners[c], a) : this.__eventListeners[c].length = 0)
    }

    function b(c, a) {
        this.__eventListeners || (this.__eventListeners = {});
        if (1 === arguments.length)
            for (var g in c) this.on(g, c[g]);
        else this.__eventListeners[c] || (this.__eventListeners[c] = []), this.__eventListeners[c].push(a);
        return this
    }

    function e(c, a) {
        if (this.__eventListeners) {
            if (0 === arguments.length) this.__eventListeners = {};
            else if (1 === arguments.length && "object" ===
                typeof arguments[0])
                for (var g in c) d.call(this, g, c[g]);
            else d.call(this, c, a);
            return this
        }
    }

    function a(c, a) {
        if (this.__eventListeners) {
            var g = this.__eventListeners[c];
            if (g) {
                for (var f = 0, b = g.length; f < b; f++) g[f].call(this, a || {});
                return this
            }
        }
    }
    fabric.Observable = {
        observe: b,
        stopObserving: e,
        fire: a,
        on: b,
        off: e,
        trigger: a
    }
})();
fabric.Collection = {
    add: function() {
        this._objects.push.apply(this._objects, arguments);
        for (var d = 0, b = arguments.length; d < b; d++) this._onObjectAdded(arguments[d]);
        this.renderOnAddRemove && this.renderAll();
        return this
    },
    insertAt: function(d, b, e) {
        var a = this.getObjects();
        e ? a[b] = d : a.splice(b, 0, d);
        this._onObjectAdded(d);
        this.renderOnAddRemove && this.renderAll();
        return this
    },
    remove: function() {
        for (var d = this.getObjects(), b, e = 0, a = arguments.length; e < a; e++) b = d.indexOf(arguments[e]), -1 !== b && (d.splice(b, 1), this._onObjectRemoved(arguments[e]));
        this.renderOnAddRemove && this.renderAll();
        return this
    },
    forEachObject: function(d, b) {
        for (var e = this.getObjects(), a = e.length; a--;) d.call(b, e[a], a, e);
        return this
    },
    getObjects: function(d) {
        return "undefined" === typeof d ? this._objects : this._objects.filter(function(b) {
            return b.type === d
        })
    },
    item: function(d) {
        return this.getObjects()[d]
    },
    isEmpty: function() {
        return 0 === this.getObjects().length
    },
    size: function() {
        return this.getObjects().length
    },
    contains: function(d) {
        return -1 < this.getObjects().indexOf(d)
    },
    complexity: function() {
        return this.getObjects().reduce(function(d,
            b) {
            return d += b.complexity ? b.complexity() : 0
        }, 0)
    }
};
(function(d) {
    var b = Math.sqrt,
        e = Math.atan2,
        a = Math.PI / 180;
    fabric.util = {
        removeFromArray: function(c, a) {
            var g = c.indexOf(a); - 1 !== g && c.splice(g, 1);
            return c
        },
        getRandomInt: function(c, a) {
            return Math.floor(Math.random() * (a - c + 1)) + c
        },
        degreesToRadians: function(c) {
            return c * a
        },
        radiansToDegrees: function(c) {
            return c / a
        },
        rotatePoint: function(c, a, g) {
            c.subtractEquals(a);
            var f = Math.sin(g);
            g = Math.cos(g);
            return (new fabric.Point(c.x * g - c.y * f, c.x * f + c.y * g)).addEquals(a)
        },
        transformPoint: function(c, a, g) {
            return g ? new fabric.Point(a[0] *
                c.x + a[2] * c.y, a[1] * c.x + a[3] * c.y) : new fabric.Point(a[0] * c.x + a[2] * c.y + a[4], a[1] * c.x + a[3] * c.y + a[5])
        },
        invertTransform: function(c) {
            var a = 1 / (c[0] * c[3] - c[1] * c[2]),
                a = [a * c[3], -a * c[1], -a * c[2], a * c[0]];
            c = fabric.util.transformPoint({
                x: c[4],
                y: c[5]
            }, a, !0);
            a[4] = -c.x;
            a[5] = -c.y;
            return a
        },
        toFixed: function(c, a) {
            return parseFloat(Number(c).toFixed(a))
        },
        parseUnit: function(c, a) {
            var g = /\D{0,2}$/.exec(c),
                f = parseFloat(c);
            a || (a = fabric.Text.DEFAULT_SVG_FONT_SIZE);
            switch (g[0]) {
                case "mm":
                    return f * fabric.DPI / 25.4;
                case "cm":
                    return f *
                        fabric.DPI / 2.54;
                case "in":
                    return f * fabric.DPI;
                case "pt":
                    return f * fabric.DPI / 72;
                case "pc":
                    return f * fabric.DPI / 72 * 12;
                case "em":
                    return f * a;
                default:
                    return f
            }
        },
        falseFunction: function() {
            return !1
        },
        getKlass: function(c, a) {
            c = fabric.util.string.camelize(c.charAt(0).toUpperCase() + c.slice(1));
            return fabric.util.resolveNamespace(a)[c]
        },
        resolveNamespace: function(c) {
            if (!c) return fabric;
            c = c.split(".");
            for (var a = c.length, g = d || fabric.window, f = 0; f < a; ++f) g = g[c[f]];
            return g
        },
        loadImage: function(c, a, g, f) {
            if (c) {
                var b = fabric.util.createImage();
                b.onload = function() {
                    a && a.call(g, b);
                    b = b.onload = b.onerror = null
                };
                b.onerror = function() {
                    fabric.log("Error loading " + b.src);
                    a && a.call(g, null, !0);
                    b = b.onload = b.onerror = null
                };
                0 !== c.indexOf("data") && "undefined" !== typeof f && (b.crossOrigin = f);
                b.src = c
            } else a && a.call(g, c)
        },
        enlivenObjects: function(c, a, g, f) {
            function b() {
                ++d === n && a && a(e)
            }
            c = c || [];
            var e = [],
                d = 0,
                n = c.length;
            n ? c.forEach(function(c, a) {
                if (c && c.type) {
                    var h = fabric.util.getKlass(c.type, g);
                    h.async ? h.fromObject(c, function(g, h) {
                        h || (e[a] = g, f && f(c, e[a]));
                        b()
                    }) : (e[a] =
                        h.fromObject(c), f && f(c, e[a]), b())
                } else b()
            }) : a && a(e)
        },
        groupSVGElements: function(c, a, g) {
            c = new fabric.PathGroup(c, a);
            "undefined" !== typeof g && c.setSourcePath(g);
            return c
        },
        populateWithProperties: function(c, a, g) {
            if (g && "[object Array]" === Object.prototype.toString.call(g))
                for (var f = 0, b = g.length; f < b; f++) g[f] in c && (a[g[f]] = c[g[f]])
        },
        drawDashedLine: function(c, a, g, f, d, l) {
            f -= a;
            var m = d - g;
            d = b(f * f + m * m);
            f = e(m, f);
            var m = l.length,
                n = 0,
                u = !0;
            c.save();
            c.translate(a, g);
            c.moveTo(0, 0);
            c.rotate(f);
            for (a = 0; d > a;) a += l[n++ % m],
                a > d && (a = d), c[u ? "lineTo" : "moveTo"](a, 0), u = !u;
            c.restore()
        },
        createCanvasElement: function(c) {
            c || (c = fabric.document.createElement("canvas"));
            c.getContext || "undefined" === typeof G_vmlCanvasManager || G_vmlCanvasManager.initElement(c);
            return c
        },
        createImage: function() {
            return fabric.isLikelyNode ? new(require("canvas").Image) : fabric.document.createElement("img")
        },
        createAccessors: function(c) {
            c = c.prototype;
            for (var a = c.stateProperties.length; a--;) {
                var g = c.stateProperties[a],
                    f = g.charAt(0).toUpperCase() + g.slice(1),
                    b = "set" + f,
                    f = "get" + f;
                c[f] || (c[f] = new Function('return this.get("' + g + '")'));
                c[b] || (c[b] = new Function("value", 'return this.set("' + g + '", value)'))
            }
        },
        clipContext: function(c, a) {
            a.save();
            a.beginPath();
            c.clipTo(a);
            a.clip()
        },
        multiplyTransformMatrices: function(c, a) {
            return [c[0] * a[0] + c[2] * a[1], c[1] * a[0] + c[3] * a[1], c[0] * a[2] + c[2] * a[3], c[1] * a[2] + c[3] * a[3], c[0] * a[4] + c[2] * a[5] + c[4], c[1] * a[4] + c[3] * a[5] + c[5]]
        },
        getFunctionBody: function(c) {
            return (String(c).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
        },
        isTransparent: function(c,
            a, g, f) {
            0 < f && (a = a > f ? a - f : 0, g = g > f ? g - f : 0);
            var b = !0;
            c = c.getImageData(a, g, 2 * f || 1, 2 * f || 1);
            a = 3;
            for (g = c.data.length; a < g && (b = 0 >= c.data[a], !1 !== b); a += 4);
            return b
        }
    }
})("undefined" !== typeof exports ? exports : this);
(function() {
    function d(a, g, h, d, u, A, D) {
        var v = f.call(arguments);
        if (c[v]) return c[v];
        var t = Math.PI,
            q = D * t / 180,
            w = Math.sin(q),
            q = Math.cos(q),
            x = 0,
            p = 0;
        h = Math.abs(h);
        d = Math.abs(d);
        var r = -q * a * .5 - w * g * .5,
            z = -q * g * .5 + w * a * .5,
            y = h * h,
            B = d * d,
            E = z * z,
            C = r * r,
            F = y * B - y * E - B * C,
            G = 0;
        0 > F ? (y = Math.sqrt(1 - F / (y * B)), h *= y, d *= y) : G = (u === A ? -1 : 1) * Math.sqrt(F / (y * E + B * C));
        E = G * h * z / d;
        C = -G * d * r / h;
        G = q * E - w * C + .5 * a;
        y = w * E + q * C + .5 * g;
        B = e(1, 0, (r - E) / h, (z - C) / d);
        z = e((r - E) / h, (z - C) / d, (-r - E) / h, (-z - C) / d);
        0 === A && 0 < z ? z -= 2 * t : 1 === A && 0 > z && (z += 2 * t);
        t = Math.ceil(Math.abs(z /
            t * 2));
        r = [];
        z /= t;
        E = 8 / 3 * Math.sin(z / 4) * Math.sin(z / 4) / Math.sin(z / 2);
        C = B + z;
        for (F = 0; F < t; F++) r[F] = b(B, C, q, w, h, d, G, y, E, x, p), x = r[F][4], p = r[F][5], B = C, C += z;
        return c[v] = r
    }

    function b(c, a, g, b, e, d, D, v, t, q, w) {
        var x = f.call(arguments);
        if (h[x]) return h[x];
        var p = Math.cos(c),
            r = Math.sin(c),
            z = Math.cos(a),
            y = Math.sin(a),
            B = g * e * z - b * d * y + D,
            E = b * e * z + g * d * y + v;
        h[x] = [q + t * (-g * e * r - b * d * p), w + t * (-b * e * r + g * d * p), B + t * (g * e * y + b * d * z), E + t * (b * e * y - g * d * z), B, E];
        return h[x]
    }

    function e(c, a, g, f) {
        c = Math.atan2(a, c);
        g = Math.atan2(f, g);
        return g >= c ? g - c : 2 * Math.PI -
            (c - g)
    }

    function a(c, a, b, e, h, d, D, v) {
        var t = f.call(arguments);
        if (g[t]) return g[t];
        var q = Math.sqrt,
            w = Math.min,
            x = Math.max,
            p = Math.abs,
            r = [],
            z = [
                [],
                []
            ],
            y, B, E, C, F;
        B = 6 * c - 12 * b + 6 * h;
        y = -3 * c + 9 * b - 9 * h + 3 * D;
        E = 3 * b - 3 * c;
        for (var G = 0; 2 > G; ++G) 0 < G && (B = 6 * a - 12 * e + 6 * d, y = -3 * a + 9 * e - 9 * d + 3 * v, E = 3 * e - 3 * a), 1E-12 > p(y) ? 1E-12 > p(B) || (C = -E / B, 0 < C && 1 > C && r.push(C)) : (C = B * B - 4 * E * y, 0 > C || (F = q(C), C = (-B + F) / (2 * y), 0 < C && 1 > C && r.push(C), C = (-B - F) / (2 * y), 0 < C && 1 > C && r.push(C)));
        for (p = q = r.length; q--;) C = r[q], B = 1 - C, y = B * B * B * c + 3 * B * B * C * b + 3 * B * C * C * h + C * C * C * D, z[0][q] = y, y =
            B * B * B * a + 3 * B * B * C * e + 3 * B * C * C * d + C * C * C * v, z[1][q] = y;
        z[0][p] = c;
        z[1][p] = a;
        z[0][p + 1] = D;
        z[1][p + 1] = v;
        w = [{
            x: w.apply(null, z[0]),
            y: w.apply(null, z[1])
        }, {
            x: x.apply(null, z[0]),
            y: x.apply(null, z[1])
        }];
        return g[t] = w
    }
    var c = {},
        h = {},
        g = {},
        f = Array.prototype.join;
    fabric.util.drawArc = function(c, a, g, f) {
        var b = [
            [],
            [],
            [],
            []
        ];
        f = d(f[5] - a, f[6] - g, f[0], f[1], f[3], f[4], f[2]);
        for (var e = 0, h = f.length; e < h; e++) b[e][0] = f[e][0] + a, b[e][1] = f[e][1] + g, b[e][2] = f[e][2] + a, b[e][3] = f[e][3] + g, b[e][4] = f[e][4] + a, b[e][5] = f[e][5] + g, c.bezierCurveTo.apply(c,
            b[e])
    };
    fabric.util.getBoundsOfArc = function(c, g, f, b, e, h, D, v, t) {
        var q = 0,
            w = 0,
            x = [],
            p = [];
        f = d(v - c, t - g, f, b, h, D, e);
        b = [
            [],
            []
        ];
        e = 0;
        for (h = f.length; e < h; e++) x = a(q, w, f[e][0], f[e][1], f[e][2], f[e][3], f[e][4], f[e][5]), b[0].x = x[0].x + c, b[0].y = x[0].y + g, b[1].x = x[1].x + c, b[1].y = x[1].y + g, p.push(b[0]), p.push(b[1]), q = f[e][4], w = f[e][5];
        return p
    };
    fabric.util.getBoundsOfCurve = a
})();
(function() {
    function d(b, a, c) {
        if (b && 0 !== b.length) {
            var h = b.length - 1,
                g = a ? b[h][a] : b[h];
            if (a)
                for (; h--;) c(b[h][a], g) && (g = b[h][a]);
            else
                for (; h--;) c(b[h], g) && (g = b[h]);
            return g
        }
    }
    var b = Array.prototype.slice;
    Array.prototype.indexOf || (Array.prototype.indexOf = function(b) {
        if (void 0 === this || null === this) throw new TypeError;
        var a = Object(this),
            c = a.length >>> 0;
        if (0 === c) return -1;
        var h = 0;
        0 < arguments.length && (h = Number(arguments[1]), h !== h ? h = 0 : 0 !== h && h !== Number.POSITIVE_INFINITY && h !== Number.NEGATIVE_INFINITY && (h = (0 < h || -1) *
            Math.floor(Math.abs(h))));
        if (h >= c) return -1;
        for (h = 0 <= h ? h : Math.max(c - Math.abs(h), 0); h < c; h++)
            if (h in a && a[h] === b) return h;
        return -1
    });
    Array.prototype.forEach || (Array.prototype.forEach = function(b, a) {
        for (var c = 0, h = this.length >>> 0; c < h; c++) c in this && b.call(a, this[c], c, this)
    });
    Array.prototype.map || (Array.prototype.map = function(b, a) {
        for (var c = [], h = 0, g = this.length >>> 0; h < g; h++) h in this && (c[h] = b.call(a, this[h], h, this));
        return c
    });
    Array.prototype.every || (Array.prototype.every = function(b, a) {
        for (var c = 0, h = this.length >>>
                0; c < h; c++)
            if (c in this && !b.call(a, this[c], c, this)) return !1;
        return !0
    });
    Array.prototype.some || (Array.prototype.some = function(b, a) {
        for (var c = 0, h = this.length >>> 0; c < h; c++)
            if (c in this && b.call(a, this[c], c, this)) return !0;
        return !1
    });
    Array.prototype.filter || (Array.prototype.filter = function(b, a) {
        for (var c = [], h, g = 0, f = this.length >>> 0; g < f; g++) g in this && (h = this[g], b.call(a, h, g, this) && c.push(h));
        return c
    });
    Array.prototype.reduce || (Array.prototype.reduce = function(b) {
        var a = this.length >>> 0,
            c = 0,
            h;
        if (1 < arguments.length) h =
            arguments[1];
        else {
            do {
                if (c in this) {
                    h = this[c++];
                    break
                }
                if (++c >= a) throw new TypeError;
            } while (1)
        }
        for (; c < a; c++) c in this && (h = b.call(null, h, this[c], c, this));
        return h
    });
    fabric.util.array = {
        invoke: function(e, a) {
            for (var c = b.call(arguments, 2), h = [], g = 0, f = e.length; g < f; g++) h[g] = c.length ? e[g][a].apply(e[g], c) : e[g][a].call(e[g]);
            return h
        },
        min: function(b, a) {
            return d(b, a, function(c, a) {
                return c < a
            })
        },
        max: function(b, a) {
            return d(b, a, function(c, a) {
                return c >= a
            })
        }
    }
})();
(function() {
    function d(b, e) {
        for (var a in e) b[a] = e[a];
        return b
    }
    fabric.util.object = {
        extend: d,
        clone: function(b) {
            return d({}, b)
        }
    }
})();
(function() {
    String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
    });
    fabric.util.string = {
        camelize: function(d) {
            return d.replace(/-+(.)?/g, function(b, e) {
                return e ? e.toUpperCase() : ""
            })
        },
        capitalize: function(d, b) {
            return d.charAt(0).toUpperCase() + (b ? d.slice(1) : d.slice(1).toLowerCase())
        },
        escapeXml: function(d) {
            return d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
    }
})();
(function() {
    var d = Array.prototype.slice,
        b = Function.prototype.apply,
        e = function() {};
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        var c = this,
            h = d.call(arguments, 1),
            g;
        g = h.length ? function() {
            return b.call(c, this instanceof e ? this : a, h.concat(d.call(arguments)))
        } : function() {
            return b.call(c, this instanceof e ? this : a, arguments)
        };
        e.prototype = this.prototype;
        g.prototype = new e;
        return g
    })
})();
(function() {
    function d() {}

    function b(c) {
        var a = this.constructor.superclass.prototype[c];
        return 1 < arguments.length ? a.apply(this, e.call(arguments, 1)) : a.call(this)
    }
    var e = Array.prototype.slice,
        a = function() {},
        c = function() {
            for (var c in {
                    toString: 1
                })
                if ("toString" === c) return !1;
            return !0
        }(),
        h = function(a, b, e) {
            for (var h in b) h in a.prototype && "function" === typeof a.prototype[h] && -1 < (b[h] + "").indexOf("callSuper") ? a.prototype[h] = function(c) {
                return function() {
                    var a = this.constructor.superclass;
                    this.constructor.superclass =
                        e;
                    var g = b[c].apply(this, arguments);
                    this.constructor.superclass = a;
                    if ("initialize" !== c) return g
                }
            }(h) : a.prototype[h] = b[h], c && (b.toString !== Object.prototype.toString && (a.prototype.toString = b.toString), b.valueOf !== Object.prototype.valueOf && (a.prototype.valueOf = b.valueOf))
        };
    fabric.util.createClass = function() {
        function c() {
            this.initialize.apply(this, arguments)
        }
        var f = null,
            k = e.call(arguments, 0);
        "function" === typeof k[0] && (f = k.shift());
        c.superclass = f;
        c.subclasses = [];
        f && (d.prototype = f.prototype, c.prototype = new d,
            f.subclasses.push(c));
        for (var l = 0, m = k.length; l < m; l++) h(c, k[l], f);
        c.prototype.initialize || (c.prototype.initialize = a);
        c.prototype.constructor = c;
        c.prototype.callSuper = b;
        return c
    }
})();
(function() {
    function d(c) {
        var a = Array.prototype.slice.call(arguments, 1),
            g, b, f = a.length;
        for (b = 0; b < f; b++)
            if (g = typeof c[a[b]], !/^(?:function|object|unknown)$/.test(g)) return !1;
        return !0
    }

    function b(a, g) {
        return function(b) {
            g.call(c(a), b || fabric.window.event)
        }
    }

    function e(c, a) {
        return function(g) {
            if (m[c] && m[c][a])
                for (var b = m[c][a], f = 0, e = b.length; f < e; f++) b[f].call(this, g || fabric.window.event)
        }
    }

    function a(c, a, g) {
        var b = "touchend" === c.type ? "changedTouches" : "touches";
        return c[b] && c[b][0] ? c[b][0][a] - (c[b][0][a] -
            c[b][0][g]) || c[g] : c[g]
    }
    var c, h, g = function() {
        var c = 0;
        return function(a) {
            return a.__uniqueID || (a.__uniqueID = "uniqueID__" + c++)
        }
    }();
    (function() {
        var a = {};
        c = function(c) {
            return a[c]
        };
        h = function(c, g) {
            a[c] = g
        }
    })();
    var f = d(fabric.document.documentElement, "addEventListener", "removeEventListener") && d(fabric.window, "addEventListener", "removeEventListener"),
        k = d(fabric.document.documentElement, "attachEvent", "detachEvent") && d(fabric.window, "attachEvent", "detachEvent"),
        l = {},
        m = {};
    f ? (f = function(c, a, g) {
        c.addEventListener(a,
            g, !1)
    }, k = function(c, a, g) {
        c.removeEventListener(a, g, !1)
    }) : k ? (f = function(c, a, f) {
        var e = g(c);
        h(e, c);
        l[e] || (l[e] = {});
        l[e][a] || (l[e][a] = []);
        f = {
            handler: f,
            wrappedHandler: b(e, f)
        };
        l[e][a].push(f);
        c.attachEvent("on" + a, f.wrappedHandler)
    }, k = function(c, a, b) {
        var f = g(c),
            e;
        if (l[f] && l[f][a])
            for (var h = 0, d = l[f][a].length; h < d; h++)(e = l[f][a][h]) && e.handler === b && (c.detachEvent("on" + a, e.wrappedHandler), l[f][a][h] = null)
    }) : (f = function(c, a, b) {
        var f = g(c);
        m[f] || (m[f] = {});
        if (!m[f][a]) {
            m[f][a] = [];
            var h = c["on" + a];
            h && m[f][a].push(h);
            c["on" + a] = e(f, a)
        }
        m[f][a].push(b)
    }, k = function(c, a, b) {
        c = g(c);
        if (m[c] && m[c][a]) {
            a = m[c][a];
            c = 0;
            for (var f = a.length; c < f; c++) a[c] === b && a.splice(c, 1)
        }
    });
    fabric.util.addListener = f;
    fabric.util.removeListener = k;
    var n = function(c) {
            return "unknown" !== typeof c.clientX ? c.clientX : 0
        },
        u = function(c) {
            return "unknown" !== typeof c.clientY ? c.clientY : 0
        };
    fabric.isTouchSupported && (n = function(c) {
        return a(c, "pageX", "clientX")
    }, u = function(c) {
        return a(c, "pageY", "clientY")
    });
    fabric.util.getPointer = function(c) {
        c || (c = fabric.window.event);
        var a = fabric.util.getScrollLeftTop(c.target || ("unknown" !== typeof c.srcElement ? c.srcElement : null));
        return {
            x: n(c) + a.left,
            y: u(c) + a.top
        }
    };
    fabric.util.object.extend(fabric.util, fabric.Observable)
})();
(function() {
    var d = fabric.document.createElement("div"),
        b = "string" === typeof d.style.filter,
        e = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
        a = function(c) {
            return c
        };
    "string" === typeof d.style.opacity ? a = function(c, a) {
        c.style.opacity = a;
        return c
    } : b && (a = function(c, a) {
        var g = c.style;
        c.currentStyle && !c.currentStyle.hasLayout && (g.zoom = 1);
        e.test(g.filter) ? g.filter = g.filter.replace(e, .9999 <= a ? "" : "alpha(opacity=" + 100 * a + ")") : g.filter += " alpha(opacity=" + 100 * a + ")";
        return c
    });
    fabric.util.setStyle = function(c, b) {
        var g = c.style;
        if (!g) return c;
        if ("string" === typeof b) return c.style.cssText += ";" + b, -1 < b.indexOf("opacity") ? a(c, b.match(/opacity:\s*(\d?\.?\d*)/)[1]) : c;
        for (var f in b) "opacity" === f ? a(c, b[f]) : g["float" === f || "cssFloat" === f ? "undefined" === typeof g.styleFloat ? "cssFloat" : "styleFloat" : f] = b[f];
        return c
    }
})();
(function() {
    function d(c, a) {
        var g = fabric.document.createElement(c),
            b;
        for (b in a) "class" === b ? g.className = a[b] : "for" === b ? g.htmlFor = a[b] : g.setAttribute(b, a[b]);
        return g
    }

    function b(c) {
        for (var a = 0, g = 0, b = fabric.document.documentElement, e = fabric.document.body || {
                scrollLeft: 0,
                scrollTop: 0
            }; c && c.parentNode && (c = c.parentNode, c === fabric.document ? (a = e.scrollLeft || b.scrollLeft || 0, g = e.scrollTop || b.scrollTop || 0) : (a += c.scrollLeft || 0, g += c.scrollTop || 0), 1 !== c.nodeType || "fixed" !== fabric.util.getElementStyle(c, "position")););
        return {
            left: a,
            top: g
        }
    }
    var e = Array.prototype.slice,
        a, c = function(c) {
            return e.call(c, 0)
        };
    try {
        a = c(fabric.document.childNodes) instanceof Array
    } catch (h) {}
    a || (c = function(c) {
        for (var a = Array(c.length), g = c.length; g--;) a[g] = c[g];
        return a
    });
    var g;
    g = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function(c, a) {
        var g = fabric.document.defaultView.getComputedStyle(c, null);
        return g ? g[a] : void 0
    } : function(c, a) {
        var g = c.style[a];
        !g && c.currentStyle && (g = c.currentStyle[a]);
        return g
    };
    (function() {
        var c =
            fabric.document.documentElement.style,
            a = "userSelect" in c ? "userSelect" : "MozUserSelect" in c ? "MozUserSelect" : "WebkitUserSelect" in c ? "WebkitUserSelect" : "KhtmlUserSelect" in c ? "KhtmlUserSelect" : "";
        fabric.util.makeElementUnselectable = function(c) {
            "undefined" !== typeof c.onselectstart && (c.onselectstart = fabric.util.falseFunction);
            a ? c.style[a] = "none" : "string" === typeof c.unselectable && (c.unselectable = "on");
            return c
        };
        fabric.util.makeElementSelectable = function(c) {
            "undefined" !== typeof c.onselectstart && (c.onselectstart =
                null);
            a ? c.style[a] = "" : "string" === typeof c.unselectable && (c.unselectable = "");
            return c
        }
    })();
    (function() {
        fabric.util.getScript = function(c, a) {
            var g = fabric.document.getElementsByTagName("head")[0],
                b = fabric.document.createElement("script"),
                e = !0;
            b.onload = b.onreadystatechange = function(c) {
                !e || "string" === typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (e = !1, a(c || fabric.window.event), b = b.onload = b.onreadystatechange = null)
            };
            b.src = c;
            g.appendChild(b)
        }
    })();
    fabric.util.getById = function(c) {
        return "string" ===
            typeof c ? fabric.document.getElementById(c) : c
    };
    fabric.util.toArray = c;
    fabric.util.makeElement = d;
    fabric.util.addClass = function(c, a) {
        c && -1 === (" " + c.className + " ").indexOf(" " + a + " ") && (c.className += (c.className ? " " : "") + a)
    };
    fabric.util.wrapElement = function(c, a, g) {
        "string" === typeof a && (a = d(a, g));
        c.parentNode && c.parentNode.replaceChild(a, c);
        a.appendChild(c);
        return a
    };
    fabric.util.getScrollLeftTop = b;
    fabric.util.getElementOffset = function(c) {
        var a;
        a = c && c.ownerDocument;
        var e = {
                left: 0,
                top: 0
            },
            h = {
                left: 0,
                top: 0
            },
            d = {
                borderLeftWidth: "left",
                borderTopWidth: "top",
                paddingLeft: "left",
                paddingTop: "top"
            };
        if (!a) return h;
        for (var u in d) h[d[u]] += parseInt(g(c, u), 10) || 0;
        a = a.documentElement;
        "undefined" !== typeof c.getBoundingClientRect && (e = c.getBoundingClientRect());
        c = b(c);
        return {
            left: e.left + c.left - (a.clientLeft || 0) + h.left,
            top: e.top + c.top - (a.clientTop || 0) + h.top
        }
    };
    fabric.util.getElementStyle = g
})();
(function() {
    function d(a, c) {
        return a + (/\?/.test(a) ? "&" : "?") + c
    }

    function b() {}
    var e = function() {
        for (var a = [function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP")
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            }, function() {
                return new XMLHttpRequest
            }], c = a.length; c--;) try {
            if (a[c]()) return a[c]
        } catch (b) {}
    }();
    fabric.util.request = function(a, c) {
        c || (c = {});
        var h = c.method ? c.method.toUpperCase() : "GET",
            g = c.onComplete || function() {},
            f = e(),
            k;
        f.onreadystatechange =
            function() {
                4 === f.readyState && (g(f), f.onreadystatechange = b)
            };
        "GET" === h && (k = null, "string" === typeof c.parameters && (a = d(a, c.parameters)));
        f.open(h, a, !0);
        "POST" !== h && "PUT" !== h || f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        f.send(k);
        return f
    }
})();
fabric.log = function() {};
fabric.warn = function() {};
"undefined" !== typeof console && ["log", "warn"].forEach(function(d) {
    "undefined" !== typeof console[d] && "function" === typeof console[d].apply && (fabric[d] = function() {
        return console[d].apply(console, arguments)
    })
});
(function() {
    function d() {
        return b.apply(fabric.window, arguments)
    }
    var b = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(b) {
        fabric.window.setTimeout(b, 1E3 / 60)
    };
    fabric.util.animate = function(b) {
        d(function(a) {
            b || (b = {});
            var c = a || +new Date,
                h = b.duration || 500,
                g = c + h,
                f, k = b.onChange || function() {},
                l = b.abort || function() {
                    return !1
                },
                m = b.easing || function(c, a,
                    g, b) {
                    return -g * Math.cos(c / b * (Math.PI / 2)) + g + a
                },
                n = "startValue" in b ? b.startValue : 0;
            a = "endValue" in b ? b.endValue : 100;
            var u = b.byValue || a - n;
            b.onStart && b.onStart();
            (function D(a) {
                f = a || +new Date;
                a = f > g ? h : f - c;
                l() ? b.onComplete && b.onComplete() : (k(m(a, n, u, h)), f > g ? b.onComplete && b.onComplete() : d(D))
            })(c)
        })
    };
    fabric.util.requestAnimFrame = d
})();
(function() {
    function d(c, a, g, b) {
        c < Math.abs(a) ? (c = a, b = g / 4) : b = g / (2 * Math.PI) * Math.asin(a / c);
        return {
            a: c,
            c: a,
            p: g,
            s: b
        }
    }

    function b(c, a, g) {
        return c.a * Math.pow(2, 10 * --a) * Math.sin(2 * (a * g - c.s) * Math.PI / c.p)
    }

    function e(c, b, g, f) {
        return g - a(f - c, 0, g, f) + b
    }

    function a(c, a, g, b) {
        return (c /= b) < 1 / 2.75 ? 7.5625 * g * c * c + a : c < 2 / 2.75 ? g * (7.5625 * (c -= 1.5 / 2.75) * c + .75) + a : c < 2.5 / 2.75 ? g * (7.5625 * (c -= 2.25 / 2.75) * c + .9375) + a : g * (7.5625 * (c -= 2.625 / 2.75) * c + .984375) + a
    }
    fabric.util.ease = {
        easeInQuad: function(c, a, g, b) {
            return g * (c /= b) * c + a
        },
        easeOutQuad: function(c,
            a, g, b) {
            return -g * (c /= b) * (c - 2) + a
        },
        easeInOutQuad: function(c, a, g, b) {
            c /= b / 2;
            return 1 > c ? g / 2 * c * c + a : -g / 2 * (--c * (c - 2) - 1) + a
        },
        easeInCubic: function(c, a, g, b) {
            return g * (c /= b) * c * c + a
        },
        easeOutCubic: function(c, a, g, b) {
            return g * ((c = c / b - 1) * c * c + 1) + a
        },
        easeInOutCubic: function(c, a, g, b) {
            c /= b / 2;
            return 1 > c ? g / 2 * c * c * c + a : g / 2 * ((c -= 2) * c * c + 2) + a
        },
        easeInQuart: function(c, a, g, b) {
            return g * (c /= b) * c * c * c + a
        },
        easeOutQuart: function(c, a, g, b) {
            return -g * ((c = c / b - 1) * c * c * c - 1) + a
        },
        easeInOutQuart: function(c, a, b, f) {
            c /= f / 2;
            return 1 > c ? b / 2 * c * c * c * c + a : -b / 2 *
                ((c -= 2) * c * c * c - 2) + a
        },
        easeInQuint: function(c, a, b, f) {
            return b * (c /= f) * c * c * c * c + a
        },
        easeOutQuint: function(c, a, b, f) {
            return b * ((c = c / f - 1) * c * c * c * c + 1) + a
        },
        easeInOutQuint: function(c, a, b, f) {
            c /= f / 2;
            return 1 > c ? b / 2 * c * c * c * c * c + a : b / 2 * ((c -= 2) * c * c * c * c + 2) + a
        },
        easeInSine: function(c, a, b, f) {
            return -b * Math.cos(c / f * (Math.PI / 2)) + b + a
        },
        easeOutSine: function(c, a, b, f) {
            return b * Math.sin(c / f * (Math.PI / 2)) + a
        },
        easeInOutSine: function(c, a, b, f) {
            return -b / 2 * (Math.cos(Math.PI * c / f) - 1) + a
        },
        easeInExpo: function(c, a, b, f) {
            return 0 === c ? a : b * Math.pow(2,
                10 * (c / f - 1)) + a
        },
        easeOutExpo: function(c, a, b, f) {
            return c === f ? a + b : b * (-Math.pow(2, -10 * c / f) + 1) + a
        },
        easeInOutExpo: function(c, a, b, f) {
            if (0 === c) return a;
            if (c === f) return a + b;
            c /= f / 2;
            return 1 > c ? b / 2 * Math.pow(2, 10 * (c - 1)) + a : b / 2 * (-Math.pow(2, -10 * --c) + 2) + a
        },
        easeInCirc: function(c, a, b, f) {
            return -b * (Math.sqrt(1 - (c /= f) * c) - 1) + a
        },
        easeOutCirc: function(c, a, b, f) {
            return b * Math.sqrt(1 - (c = c / f - 1) * c) + a
        },
        easeInOutCirc: function(c, a, b, f) {
            c /= f / 2;
            return 1 > c ? -b / 2 * (Math.sqrt(1 - c * c) - 1) + a : b / 2 * (Math.sqrt(1 - (c -= 2) * c) + 1) + a
        },
        easeInElastic: function(c,
            a, g, f) {
            var e = 0;
            if (0 === c) return a;
            c /= f;
            if (1 === c) return a + g;
            e || (e = .3 * f);
            g = d(g, g, e, 1.70158);
            return -b(g, c, f) + a
        },
        easeOutElastic: function(c, a, b, f) {
            var e = 0;
            if (0 === c) return a;
            c /= f;
            if (1 === c) return a + b;
            e || (e = .3 * f);
            b = d(b, b, e, 1.70158);
            return b.a * Math.pow(2, -10 * c) * Math.sin(2 * (c * f - b.s) * Math.PI / b.p) + b.c + a
        },
        easeInOutElastic: function(c, a, g, f) {
            var e = 0;
            if (0 === c) return a;
            c /= f / 2;
            if (2 === c) return a + g;
            e || (e = .3 * f * 1.5);
            g = d(g, g, e, 1.70158);
            return 1 > c ? -.5 * b(g, c, f) + a : g.a * Math.pow(2, -10 * --c) * Math.sin(2 * (c * f - g.s) * Math.PI / g.p) * .5 +
                g.c + a
        },
        easeInBack: function(c, a, b, f, e) {
            void 0 === e && (e = 1.70158);
            return b * (c /= f) * c * ((e + 1) * c - e) + a
        },
        easeOutBack: function(c, a, b, f, e) {
            void 0 === e && (e = 1.70158);
            return b * ((c = c / f - 1) * c * ((e + 1) * c + e) + 1) + a
        },
        easeInOutBack: function(c, a, b, f, e) {
            void 0 === e && (e = 1.70158);
            c /= f / 2;
            return 1 > c ? b / 2 * c * c * (((e *= 1.525) + 1) * c - e) + a : b / 2 * ((c -= 2) * c * (((e *= 1.525) + 1) * c + e) + 2) + a
        },
        easeInBounce: e,
        easeOutBounce: a,
        easeInOutBounce: function(c, b, g, f) {
            return c < f / 2 ? .5 * e(2 * c, 0, g, f) + b : .5 * a(2 * c - f, 0, g, f) + .5 * g + b
        }
    }
})();
(function(d) {
    function b(c) {
        return c in z ? z[c] : c
    }

    function e(c, a, b, g) {
        var f = "[object Array]" === Object.prototype.toString.call(a),
            e;
        "fill" !== c && "stroke" !== c || "none" !== a ? "strokeDashArray" === c ? a = a.replace(/,/g, " ").split(/\s+/).map(function(c) {
                return parseFloat(c)
            }) : "transformMatrix" === c ? a = b && b.transformMatrix ? q(b.transformMatrix, n.parseTransformAttribute(a)) : n.parseTransformAttribute(a) : "visible" === c ? (a = "none" === a || "hidden" === a ? !1 : !0, b && !1 === b.visible && (a = !1)) : "originX" === c ? a = "start" === a ? "left" : "end" ===
            a ? "right" : "center" : e = f ? a.map(t) : t(a, g) : a = "";
        return !f && isNaN(e) ? a : e
    }

    function a(c) {
        for (var a in y)
            if (c[a] && "undefined" !== typeof c[y[a]] && 0 !== c[a].indexOf("url(")) {
                var b = new n.Color(c[a]);
                c[a] = b.setAlpha(v(b.getAlpha() * c[y[a]], 2)).toRgba()
            }
        return c
    }

    function c(c, a) {
        var g, f;
        c.replace(/;\s*$/, "").split(";").forEach(function(c) {
            c = c.split(":");
            g = b(c[0].trim().toLowerCase());
            f = e(g, c[1].trim());
            a[g] = f
        })
    }

    function h(c, a) {
        var b = {},
            f;
        for (f in n.cssRules[a]) {
            var e = c,
                h = f.split(" "),
                d = void 0,
                k = !0;
            if ((d = g(e, h.pop())) &&
                h.length) {
                for (var k = h, l = void 0, m = !0; e.parentNode && 1 === e.parentNode.nodeType && k.length;) m && (l = k.pop()), e = e.parentNode, m = g(e, l);
                k = 0 === k.length
            }
            if (d && k && 0 === h.length)
                for (var u in n.cssRules[a][f]) b[u] = n.cssRules[a][f][u]
        }
        return b
    }

    function g(c, a) {
        var b = c.nodeName,
            g = c.getAttribute("class"),
            f = c.getAttribute("id"),
            b = new RegExp("^" + b, "i");
        a = a.replace(b, "");
        f && a.length && (b = new RegExp("#" + f + "(?![a-zA-Z\\-]+)", "i"), a = a.replace(b, ""));
        if (g && a.length)
            for (g = g.split(" "), f = g.length; f--;) b = new RegExp("\\." + g[f] +
                "(?![a-zA-Z\\-]+)", "i"), a = a.replace(b, "");
        return 0 === a.length
    }

    function f(c) {
        for (var a = c.getElementsByTagName("use"), b = 0; a.length && b < a.length;) {
            var g = a[b],
                f = g.getAttribute("xlink:href").substr(1),
                e = g.getAttribute("x") || 0,
                h = g.getAttribute("y") || 0,
                d;
            a: {
                d = c;
                var l = void 0;d.getElementById && (l = d.getElementById(f));
                if (l) d = l;
                else {
                    l = f = void 0;
                    d = d.getElementsByTagName("*");
                    for (l = 0; l < d.length; l++)
                        if (f = d[l], void 0 === f.getAttribute("id")) {
                            d = f;
                            break a
                        }
                    d = void 0
                }
            }
            d = d.cloneNode(!0);
            var e = (d.getAttribute("transform") ||
                    "") + " translate(" + e + ", " + h + ")",
                h = a.length,
                m, n;
            k(d);
            if (/^svg$/i.test(d.nodeName)) {
                var u = d.ownerDocument.createElement("g"),
                    l = 0;
                m = d.attributes;
                for (n = m.length; l < n; l++) f = m.item(l), u.setAttribute(f.nodeName, f.nodeValue);
                for (; null != d.firstChild;) u.appendChild(d.firstChild);
                d = u
            }
            l = 0;
            m = g.attributes;
            for (n = m.length; l < n; l++) f = m.item(l), "x" !== f.nodeName && "y" !== f.nodeName && "xlink:href" !== f.nodeName && ("transform" === f.nodeName ? e = f.nodeValue + " " + e : d.setAttribute(f.nodeName, f.nodeValue));
            d.setAttribute("transform",
                e);
            d.setAttribute("instantiated_by_use", "1");
            d.removeAttribute("id");
            g.parentNode.replaceChild(d, g);
            a.length === h && b++
        }
    }

    function k(c) {
        var a = c.getAttribute("viewBox"),
            b = 1,
            g = 1,
            f = 0,
            e = 0,
            h, d = c.getAttribute("width"),
            k = c.getAttribute("height"),
            f = !a || !x.test(c.tagName) || !(a = a.match(B)),
            l = !d || !k || "100%" === d || "100%" === k,
            e = f && l,
            m = {
                width: 0,
                height: 0
            };
        if (m.toBeParsed = e) return m;
        if (f) return m.width = t(d), m.height = t(k), m;
        f = -parseFloat(a[1]);
        e = -parseFloat(a[2]);
        h = parseFloat(a[3]);
        a = parseFloat(a[4]);
        l ? (m.width = h, m.height =
            a) : (m.width = t(d), m.height = t(k), b = m.width / h, g = m.height / a);
        g = b = b > g ? g : b;
        if (1 === b && 1 === g && 0 === f && 0 === e) return m;
        b = " matrix(" + b + " 0 0 " + g + " " + f * b + " " + e * g + ") ";
        if ("svg" === c.tagName) {
            for (g = c.ownerDocument.createElement("g"); null != c.firstChild;) g.appendChild(c.firstChild);
            c.appendChild(g)
        } else g = c, b = g.getAttribute("transform") + b;
        g.setAttribute("transform", b);
        return m
    }

    function l(c) {
        var a = c.objects;
        c = c.options;
        a = a.map(function(c) {
            return n[A(c.type)].fromObject(c)
        });
        return {
            objects: a,
            options: c
        }
    }

    function m(c,
        a, b) {
        a[b] && a[b].toSVG && c.push('<pattern x="0" y="0" id="', b, 'Pattern" ', 'width="', a[b].source.width, '" height="', a[b].source.height, '" patternUnits="userSpaceOnUse">', '<image x="0" y="0" ', 'width="', a[b].source.width, '" height="', a[b].source.height, '" xlink:href="', a[b].source.src, '"></image></pattern>')
    }
    var n = d.fabric || (d.fabric = {}),
        u = n.util.object.extend,
        A = n.util.string.capitalize,
        D = n.util.object.clone,
        v = n.util.toFixed,
        t = n.util.parseUnit,
        q = n.util.multiplyTransformMatrices,
        w = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i,
        x = /^(symbol|image|marker|pattern|view|svg)$/i,
        p = /^(?:pattern|defs|symbol|metadata)$/i,
        r = /^(symbol|g|a|svg)$/i,
        z = {
            cx: "left",
            x: "left",
            r: "radius",
            cy: "top",
            y: "top",
            display: "visible",
            visibility: "visible",
            transform: "transformMatrix",
            "fill-opacity": "fillOpacity",
            "fill-rule": "fillRule",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-style": "fontStyle",
            "font-weight": "fontWeight",
            "stroke-dasharray": "strokeDashArray",
            "stroke-linecap": "strokeLineCap",
            "stroke-linejoin": "strokeLineJoin",
            "stroke-miterlimit": "strokeMiterLimit",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "text-decoration": "textDecoration",
            "text-anchor": "originX"
        },
        y = {
            stroke: "strokeOpacity",
            fill: "fillOpacity"
        };
    n.cssRules = {};
    n.gradientDefs = {};
    n.parseTransformAttribute = function() {
        function c(a, b) {
            var g = b[0];
            a[0] = Math.cos(g);
            a[1] = Math.sin(g);
            a[2] = -Math.sin(g);
            a[3] = Math.cos(g)
        }

        function a(c, b) {
            var g = 2 === b.length ? b[1] : b[0];
            c[0] = b[0];
            c[3] = g
        }

        function b(c, a) {
            c[4] = a[0];
            2 === a.length && (c[5] = a[1])
        }
        var g = [1, 0, 0, 1, 0, 0],
            f = n.reNum,
            e = "(?:" + ("(?:(matrix)\\s*\\(\\s*(" +
                f + ")(?:\\s+,?\\s*|,\\s*)(" + f + ")(?:\\s+,?\\s*|,\\s*)(" + f + ")(?:\\s+,?\\s*|,\\s*)(" + f + ")(?:\\s+,?\\s*|,\\s*)(" + f + ")(?:\\s+,?\\s*|,\\s*)(" + f + ")\\s*\\))") + "|" + ("(?:(translate)\\s*\\(\\s*(" + f + ")(?:(?:\\s+,?\\s*|,\\s*)(" + f + "))?\\s*\\))") + "|" + ("(?:(scale)\\s*\\(\\s*(" + f + ")(?:(?:\\s+,?\\s*|,\\s*)(" + f + "))?\\s*\\))") + "|" + ("(?:(rotate)\\s*\\(\\s*(" + f + ")(?:(?:\\s+,?\\s*|,\\s*)(" + f + ")(?:\\s+,?\\s*|,\\s*)(" + f + "))?\\s*\\))") + "|" + ("(?:(skewX)\\s*\\(\\s*(" + f + ")\\s*\\))") + "|" + ("(?:(skewY)\\s*\\(\\s*(" + f + ")\\s*\\))") +
            ")",
            h = new RegExp("^\\s*(?:" + ("(?:" + e + "(?:(?:\\s+,?\\s*|,\\s*)" + e + ")*)") + "?)\\s*$"),
            d = new RegExp(e, "g");
        return function(f) {
            var k = g.concat(),
                l = [];
            if (!f || f && !h.test(f)) return k;
            f.replace(d, function(f) {
                var h = (new RegExp(e)).exec(f).filter(function(c) {
                    return "" !== c && null != c
                });
                f = h[1];
                h = h.slice(2).map(parseFloat);
                switch (f) {
                    case "translate":
                        b(k, h);
                        break;
                    case "rotate":
                        h[0] = n.util.degreesToRadians(h[0]);
                        c(k, h);
                        break;
                    case "scale":
                        a(k, h);
                        break;
                    case "skewX":
                        k[2] = Math.tan(n.util.degreesToRadians(h[0]));
                        break;
                    case "skewY":
                        k[1] =
                            Math.tan(n.util.degreesToRadians(h[0]));
                        break;
                    case "matrix":
                        k = h
                }
                l.push(k.concat());
                k = g.concat()
            });
            for (f = l[0]; 1 < l.length;) l.shift(), f = n.util.multiplyTransformMatrices(f, l[0]);
            return f
        }
    }();
    var B = new RegExp("^\\s*(" + n.reNum + "+)\\s*,?\\s*(" + n.reNum + "+)\\s*,?\\s*(" + n.reNum + "+)\\s*,?\\s*(" + n.reNum + "+)\\s*$");
    n.parseSVGDocument = function() {
        return function(c, a, b) {
            if (c) {
                f(c);
                var g = new Date,
                    e = n.Object.__uid++,
                    h = k(c),
                    d = n.util.toArray(c.getElementsByTagName("*"));
                h.svgUid = e;
                if (0 === d.length && n.isLikelyNode) {
                    for (var d =
                            c.selectNodes('//*[name(.)!="svg"]'), l = [], m = 0, u = d.length; m < u; m++) l[m] = d[m];
                    d = l
                }
                d = d.filter(function(c) {
                    k(c);
                    var a;
                    if (a = w.test(c.tagName)) {
                        a: {
                            for (; c && (c = c.parentNode);)
                                if (p.test(c.nodeName) && !c.getAttribute("instantiated_by_use")) {
                                    c = !0;
                                    break a
                                }
                            c = !1
                        }
                        a = !c
                    }
                    return a
                });
                !d || d && !d.length ? a && a([], {}) : (n.gradientDefs[e] = n.getGradientDefs(c), n.cssRules[e] = n.getCSSRules(c), n.parseElements(d, function(c) {
                    n.documentParsingTime = new Date - g;
                    a && a(c, h)
                }, D(h), b))
            }
        }
    }();
    var E = {
            has: function(c, a) {
                a(!1)
            },
            get: function() {},
            set: function() {}
        },
        C = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + n.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + n.reNum + "))?\\s+(.*)");
    u(n, {
        parseFontDeclaration: function(c, a) {
            var b = c.match(C);
            if (b) {
                var g = b[1],
                    f = b[3],
                    e = b[4],
                    h = b[5],
                    b = b[6];
                g && (a.fontStyle = g);
                f && (a.fontWeight = isNaN(parseFloat(f)) ? f : parseFloat(f));
                e && (a.fontSize = t(e));
                b && (a.fontFamily = b);
                h && (a.lineHeight = "normal" === h ? 1 : h)
            }
        },
        getGradientDefs: function(c) {
            var a = c.getElementsByTagName("linearGradient"),
                b = c.getElementsByTagName("radialGradient"),
                g, f = 0,
                e, h = [];
            c = {};
            var d = {};
            h.length = a.length + b.length;
            for (g = a.length; g--;) h[f++] = a[g];
            for (g = b.length; g--;) h[f++] = b[g];
            for (; f--;) a = h[f], b = a.getAttribute("xlink:href"), e = a.getAttribute("id"), b && (d[e] = b.substr(1)), c[e] = a;
            for (e in d)
                for (f = c[d[e]].cloneNode(!0), a = c[e]; f.firstChild;) a.appendChild(f.firstChild);
            return c
        },
        parseAttributes: function(c, g, f) {
            if (c) {
                var d, k = {},
                    l;
                "undefined" === typeof f && (f = c.getAttribute("svgUid"));
                c.parentNode && r.test(c.parentNode.nodeName) &&
                    (k = n.parseAttributes(c.parentNode, g, f));
                l = k && k.fontSize || c.getAttribute("font-size") || n.Text.DEFAULT_SVG_FONT_SIZE;
                g = g.reduce(function(a, g) {
                    if (d = c.getAttribute(g)) g = b(g), d = e(g, d, k, l), a[g] = d;
                    return a
                }, {});
                g = u(g, u(h(c, f), n.parseStyleAttribute(c)));
                g.font && n.parseFontDeclaration(g.font, g);
                return a(u(k, g))
            }
        },
        parseElements: function(c, a, b, g) {
            (new n.ElementsParser(c, a, b, g)).parse()
        },
        parseStyleAttribute: function(a) {
            var g = {};
            a = a.getAttribute("style");
            if (!a) return g;
            if ("string" === typeof a) c(a, g);
            else {
                var f,
                    h, d;
                for (d in a) "undefined" !== typeof a[d] && (f = b(d.toLowerCase()), h = e(f, a[d]), g[f] = h)
            }
            return g
        },
        parsePointsAttribute: function(c) {
            if (!c) return null;
            c = c.replace(/,/g, " ").trim();
            c = c.split(/\s+/);
            var a = [],
                b, g;
            b = 0;
            for (g = c.length; b < g; b += 2) a.push({
                x: parseFloat(c[b]),
                y: parseFloat(c[b + 1])
            });
            return a
        },
        getCSSRules: function(c) {
            c = c.getElementsByTagName("style");
            for (var a = {}, g, f = 0, h = c.length; f < h; f++) g = c[f].textContent, g = g.replace(/\/\*[\s\S]*?\*\//g, ""), "" !== g.trim() && (g = g.match(/[^{]*\{[\s\S]*?\}/g), g = g.map(function(c) {
                    return c.trim()
                }),
                g.forEach(function(c) {
                    c = c.match(/([\s\S]*?)\s*\{([^}]*)\}/);
                    for (var g = {}, f = c[2].trim().replace(/;$/, "").split(/\s*;\s*/), h = 0, d = f.length; h < d; h++) {
                        var k = f[h].split(/\s*:\s*/),
                            l = b(k[0]),
                            k = e(l, k[1], k[0]);
                        g[l] = k
                    }
                    c = c[1];
                    c.split(",").forEach(function(c) {
                        c = c.replace(/^svg/i, "").trim();
                        "" !== c && (a[c] = n.util.object.clone(g))
                    })
                }));
            return a
        },
        loadSVGFromURL: function(c, a, b) {
            function g(f) {
                var e = f.responseXML;
                e && !e.documentElement && n.window.ActiveXObject && f.responseText && (e = new ActiveXObject("Microsoft.XMLDOM"), e.async =
                    "false", e.loadXML(f.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                e && e.documentElement && n.parseSVGDocument(e.documentElement, function(b, g) {
                    E.set(c, {
                        objects: n.util.array.invoke(b, "toObject"),
                        options: g
                    });
                    a(b, g)
                }, b)
            }
            c = c.replace(/^\n\s*/, "").trim();
            E.has(c, function(b) {
                b ? E.get(c, function(c) {
                    c = l(c);
                    a(c.objects, c.options)
                }) : new n.util.request(c, {
                    method: "get",
                    onComplete: g
                })
            })
        },
        loadSVGFromString: function(c, a, b) {
            c = c.trim();
            var g;
            if ("undefined" !== typeof DOMParser) {
                var f = new DOMParser;
                f && f.parseFromString &&
                    (g = f.parseFromString(c, "text/xml"))
            } else n.window.ActiveXObject && (g = new ActiveXObject("Microsoft.XMLDOM"), g.async = "false", g.loadXML(c.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
            n.parseSVGDocument(g.documentElement, function(c, b) {
                a(c, b)
            }, b)
        },
        createSVGFontFacesMarkup: function(c) {
            for (var a = "", b = 0, g = c.length; b < g; b++) "text" === c[b].type && c[b].path && (a += ["@font-face {font-family: ", c[b].fontFamily, "; src: url('", c[b].path, "')}"].join(""));
            a && (a = ['<style type="text/css"><![CDATA[', a, "]]\x3e</style>"].join(""));
            return a
        },
        createSVGRefElementsMarkup: function(c) {
            var a = [];
            m(a, c, "backgroundColor");
            m(a, c, "overlayColor");
            return a.join("")
        }
    })
})("undefined" !== typeof exports ? exports : this);
fabric.ElementsParser = function(d, b, e, a) {
    this.elements = d;
    this.callback = b;
    this.options = e;
    this.reviver = a;
    this.svgUid = e && e.svgUid || 0
};
fabric.ElementsParser.prototype.parse = function() {
    this.instances = Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects()
};
fabric.ElementsParser.prototype.createObjects = function() {
    for (var d = 0, b = this.elements.length; d < b; d++) this.elements[d].setAttribute("svgUid", this.svgUid),
        function(b, a) {
            setTimeout(function() {
                b.createObject(b.elements[a], a)
            }, 0)
        }(this, d)
};
fabric.ElementsParser.prototype.createObject = function(d, b) {
    var e = fabric[fabric.util.string.capitalize(d.tagName)];
    if (e && e.fromElement) try {
        this._createObject(e, d, b)
    } catch (a) {
        fabric.log(a)
    } else this.checkIfDone()
};
fabric.ElementsParser.prototype._createObject = function(d, b, e) {
    d.async ? d.fromElement(b, this.createCallback(e, b), this.options) : (d = d.fromElement(b, this.options), this.resolveGradient(d, "fill"), this.resolveGradient(d, "stroke"), this.reviver && this.reviver(b, d), this.instances[e] = d, this.checkIfDone())
};
fabric.ElementsParser.prototype.createCallback = function(d, b) {
    var e = this;
    return function(a) {
        e.resolveGradient(a, "fill");
        e.resolveGradient(a, "stroke");
        e.reviver && e.reviver(b, a);
        e.instances[d] = a;
        e.checkIfDone()
    }
};
fabric.ElementsParser.prototype.resolveGradient = function(d, b) {
    var e = d.get(b);
    /^url\(/.test(e) && (e = e.slice(5, e.length - 1), fabric.gradientDefs[this.svgUid][e] && d.set(b, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][e], d)))
};
fabric.ElementsParser.prototype.checkIfDone = function() {
    0 === --this.numElements && (this.instances = this.instances.filter(function(d) {
        return null != d
    }), this.callback(this.instances))
};
(function(d) {
    function b(b, a) {
        this.x = b;
        this.y = a
    }
    d = d.fabric || (d.fabric = {});
    d.Point ? d.warn("fabric.Point is already defined") : (d.Point = b, b.prototype = {
        constructor: b,
        add: function(e) {
            return new b(this.x + e.x, this.y + e.y)
        },
        addEquals: function(b) {
            this.x += b.x;
            this.y += b.y;
            return this
        },
        scalarAdd: function(e) {
            return new b(this.x + e, this.y + e)
        },
        scalarAddEquals: function(b) {
            this.x += b;
            this.y += b;
            return this
        },
        subtract: function(e) {
            return new b(this.x - e.x, this.y - e.y)
        },
        subtractEquals: function(b) {
            this.x -= b.x;
            this.y -= b.y;
            return this
        },
        scalarSubtract: function(e) {
            return new b(this.x - e, this.y - e)
        },
        scalarSubtractEquals: function(b) {
            this.x -= b;
            this.y -= b;
            return this
        },
        multiply: function(e) {
            return new b(this.x * e, this.y * e)
        },
        multiplyEquals: function(b) {
            this.x *= b;
            this.y *= b;
            return this
        },
        divide: function(e) {
            return new b(this.x / e, this.y / e)
        },
        divideEquals: function(b) {
            this.x /= b;
            this.y /= b;
            return this
        },
        eq: function(b) {
            return this.x === b.x && this.y === b.y
        },
        lt: function(b) {
            return this.x < b.x && this.y < b.y
        },
        lte: function(b) {
            return this.x <= b.x && this.y <= b.y
        },
        gt: function(b) {
            return this.x >
                b.x && this.y > b.y
        },
        gte: function(b) {
            return this.x >= b.x && this.y >= b.y
        },
        lerp: function(e, a) {
            return new b(this.x + (e.x - this.x) * a, this.y + (e.y - this.y) * a)
        },
        distanceFrom: function(b) {
            var a = this.x - b.x;
            b = this.y - b.y;
            return Math.sqrt(a * a + b * b)
        },
        midPointFrom: function(e) {
            return new b(this.x + (e.x - this.x) / 2, this.y + (e.y - this.y) / 2)
        },
        min: function(e) {
            return new b(Math.min(this.x, e.x), Math.min(this.y, e.y))
        },
        max: function(e) {
            return new b(Math.max(this.x, e.x), Math.max(this.y, e.y))
        },
        toString: function() {
            return this.x + "," + this.y
        },
        setXY: function(b, a) {
            this.x = b;
            this.y = a
        },
        setFromPoint: function(b) {
            this.x = b.x;
            this.y = b.y
        },
        swap: function(b) {
            var a = this.x,
                c = this.y;
            this.x = b.x;
            this.y = b.y;
            b.x = a;
            b.y = c
        }
    })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    function b(a) {
        this.status = a;
        this.points = []
    }
    var e = d.fabric || (d.fabric = {});
    e.Intersection ? e.warn("fabric.Intersection is already defined") : (e.Intersection = b, e.Intersection.prototype = {
        appendPoint: function(a) {
            this.points.push(a)
        },
        appendPoints: function(a) {
            this.points = this.points.concat(a)
        }
    }, e.Intersection.intersectLineLine = function(a, c, h, g) {
        var f, d = (g.x - h.x) * (a.y - h.y) - (g.y - h.y) * (a.x - h.x);
        f = (c.x - a.x) * (a.y - h.y) - (c.y - a.y) * (a.x - h.x);
        h = (g.y - h.y) * (c.x - a.x) - (g.x - h.x) * (c.y - a.y);
        0 !== h ? (d /= h, f /= h, 0 <=
            d && 1 >= d && 0 <= f && 1 >= f ? (f = new b("Intersection"), f.points.push(new e.Point(a.x + d * (c.x - a.x), a.y + d * (c.y - a.y)))) : f = new b) : f = 0 === d || 0 === f ? new b("Coincident") : new b("Parallel");
        return f
    }, e.Intersection.intersectLinePolygon = function(a, c, e) {
        for (var g = new b, f = e.length, d = 0; d < f; d++) {
            var l = b.intersectLineLine(a, c, e[d], e[(d + 1) % f]);
            g.appendPoints(l.points)
        }
        0 < g.points.length && (g.status = "Intersection");
        return g
    }, e.Intersection.intersectPolygonPolygon = function(a, c) {
        for (var e = new b, g = a.length, f = 0; f < g; f++) {
            var d = b.intersectLinePolygon(a[f],
                a[(f + 1) % g], c);
            e.appendPoints(d.points)
        }
        0 < e.points.length && (e.status = "Intersection");
        return e
    }, e.Intersection.intersectPolygonRectangle = function(a, c, h) {
        var g = c.min(h),
            f = c.max(h);
        h = new e.Point(f.x, g.y);
        var d = new e.Point(g.x, f.y);
        c = b.intersectLinePolygon(g, h, a);
        h = b.intersectLinePolygon(h, f, a);
        f = b.intersectLinePolygon(f, d, a);
        a = b.intersectLinePolygon(d, g, a);
        g = new b;
        g.appendPoints(c.points);
        g.appendPoints(h.points);
        g.appendPoints(f.points);
        g.appendPoints(a.points);
        0 < g.points.length && (g.status = "Intersection");
        return g
    })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    function b(c) {
        c ? this._tryParsingColor(c) : this.setSource([0, 0, 0, 1])
    }

    function e(c, a, b) {
        0 > b && (b += 1);
        1 < b && --b;
        return b < 1 / 6 ? c + 6 * (a - c) * b : .5 > b ? a : b < 2 / 3 ? c + (a - c) * (2 / 3 - b) * 6 : c
    }
    var a = d.fabric || (d.fabric = {});
    a.Color ? a.warn("fabric.Color is already defined.") : (a.Color = b, a.Color.prototype = {
        _tryParsingColor: function(c) {
            var a;
            c in b.colorNameMap && (c = b.colorNameMap[c]);
            "transparent" === c ? this.setSource([255, 255, 255, 0]) : ((a = b.sourceFromHex(c)) || (a = b.sourceFromRgb(c)), a || (a = b.sourceFromHsl(c)), a && this.setSource(a))
        },
        _rgbToHsl: function(c, b, g) {
            c /= 255;
            b /= 255;
            g /= 255;
            var f, e, d, m = a.util.array.max([c, b, g]);
            e = a.util.array.min([c, b, g]);
            d = (m + e) / 2;
            if (m === e) f = e = 0;
            else {
                var n = m - e;
                e = .5 < d ? n / (2 - m - e) : n / (m + e);
                switch (m) {
                    case c:
                        f = (b - g) / n + (b < g ? 6 : 0);
                        break;
                    case b:
                        f = (g - c) / n + 2;
                        break;
                    case g:
                        f = (c - b) / n + 4
                }
                f /= 6
            }
            return [Math.round(360 * f), Math.round(100 * e), Math.round(100 * d)]
        },
        getSource: function() {
            return this._source
        },
        setSource: function(c) {
            this._source = c
        },
        toRgb: function() {
            var c = this.getSource();
            return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"
        },
        toRgba: function() {
            var c =
                this.getSource();
            return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] + ")"
        },
        toHsl: function() {
            var c = this.getSource(),
                c = this._rgbToHsl(c[0], c[1], c[2]);
            return "hsl(" + c[0] + "," + c[1] + "%," + c[2] + "%)"
        },
        toHsla: function() {
            var c = this.getSource(),
                a = this._rgbToHsl(c[0], c[1], c[2]);
            return "hsla(" + a[0] + "," + a[1] + "%," + a[2] + "%," + c[3] + ")"
        },
        toHex: function() {
            var c = this.getSource(),
                a, b;
            a = c[0].toString(16);
            a = 1 === a.length ? "0" + a : a;
            b = c[1].toString(16);
            b = 1 === b.length ? "0" + b : b;
            c = c[2].toString(16);
            c = 1 === c.length ? "0" + c : c;
            return a.toUpperCase() +
                b.toUpperCase() + c.toUpperCase()
        },
        getAlpha: function() {
            return this.getSource()[3]
        },
        setAlpha: function(c) {
            var a = this.getSource();
            a[3] = c;
            this.setSource(a);
            return this
        },
        toGrayscale: function() {
            var c = this.getSource(),
                a = parseInt((.3 * c[0] + .59 * c[1] + .11 * c[2]).toFixed(0), 10);
            this.setSource([a, a, a, c[3]]);
            return this
        },
        toBlackWhite: function(c) {
            var a = this.getSource(),
                b = (.3 * a[0] + .59 * a[1] + .11 * a[2]).toFixed(0),
                a = a[3],
                b = Number(b) < Number(c || 127) ? 0 : 255;
            this.setSource([b, b, b, a]);
            return this
        },
        overlayWith: function(c) {
            c instanceof
            b || (c = new b(c));
            var a = [],
                g = this.getAlpha(),
                f = this.getSource();
            c = c.getSource();
            for (var e = 0; 3 > e; e++) a.push(Math.round(.5 * f[e] + .5 * c[e]));
            a[3] = g;
            this.setSource(a);
            return this
        }
    }, a.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, a.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, a.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i, a.Color.colorNameMap = {
        aqua: "#00FFFF",
        black: "#000000",
        blue: "#0000FF",
        fuchsia: "#FF00FF",
        gray: "#808080",
        green: "#008000",
        lime: "#00FF00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#FFA500",
        purple: "#800080",
        red: "#FF0000",
        silver: "#C0C0C0",
        teal: "#008080",
        white: "#FFFFFF",
        yellow: "#FFFF00"
    }, a.Color.fromRgb = function(c) {
        return b.fromSource(b.sourceFromRgb(c))
    }, a.Color.sourceFromRgb = function(c) {
        if (c = c.match(b.reRGBa)) {
            var a = parseInt(c[1], 10) / (/%$/.test(c[1]) ? 100 : 1) * (/%$/.test(c[1]) ? 255 : 1),
                g = parseInt(c[2], 10) / (/%$/.test(c[2]) ? 100 : 1) * (/%$/.test(c[2]) ?
                    255 : 1),
                f = parseInt(c[3], 10) / (/%$/.test(c[3]) ? 100 : 1) * (/%$/.test(c[3]) ? 255 : 1);
            return [parseInt(a, 10), parseInt(g, 10), parseInt(f, 10), c[4] ? parseFloat(c[4]) : 1]
        }
    }, a.Color.fromRgba = b.fromRgb, a.Color.fromHsl = function(c) {
        return b.fromSource(b.sourceFromHsl(c))
    }, a.Color.sourceFromHsl = function(c) {
        if (c = c.match(b.reHSLa)) {
            var a = (parseFloat(c[1]) % 360 + 360) % 360 / 360,
                g = parseFloat(c[2]) / (/%$/.test(c[2]) ? 100 : 1),
                f = parseFloat(c[3]) / (/%$/.test(c[3]) ? 100 : 1);
            if (0 === g) f = g = a = f;
            else var d = .5 >= f ? f * (g + 1) : f + g - f * g,
                l = 2 * f - d,
                f = e(l, d,
                    a + 1 / 3),
                g = e(l, d, a),
                a = e(l, d, a - 1 / 3);
            return [Math.round(255 * f), Math.round(255 * g), Math.round(255 * a), c[4] ? parseFloat(c[4]) : 1]
        }
    }, a.Color.fromHsla = b.fromHsl, a.Color.fromHex = function(c) {
        return b.fromSource(b.sourceFromHex(c))
    }, a.Color.sourceFromHex = function(c) {
        if (c.match(b.reHex)) {
            var a = c.slice(c.indexOf("#") + 1),
                g = 3 === a.length;
            c = g ? a.charAt(0) + a.charAt(0) : a.substring(0, 2);
            var f = g ? a.charAt(1) + a.charAt(1) : a.substring(2, 4),
                a = g ? a.charAt(2) + a.charAt(2) : a.substring(4, 6);
            return [parseInt(c, 16), parseInt(f, 16), parseInt(a,
                16), 1]
        }
    }, a.Color.fromSource = function(c) {
        var a = new b;
        a.setSource(c);
        return a
    })
})("undefined" !== typeof exports ? exports : this);
(function() {
    function d(b) {
        var a = b.getAttribute("style"),
            c = b.getAttribute("offset"),
            h, g, c = parseFloat(c) / (/%$/.test(c) ? 100 : 1),
            c = 0 > c ? 0 : 1 < c ? 1 : c;
        if (a) {
            a = a.split(/\s*;\s*/);
            "" === a[a.length - 1] && a.pop();
            for (var f = a.length; f--;) {
                var d = a[f].split(/\s*:\s*/),
                    l = d[0].trim(),
                    d = d[1].trim();
                "stop-color" === l ? h = d : "stop-opacity" === l && (g = d)
            }
        }
        h || (h = b.getAttribute("stop-color") || "rgb(0,0,0)");
        g || (g = b.getAttribute("stop-opacity"));
        h = new fabric.Color(h);
        b = h.getAlpha();
        g = isNaN(parseFloat(g)) ? 1 : parseFloat(g);
        g *= b;
        return {
            offset: c,
            color: h.toRgb(),
            opacity: g
        }
    }

    function b(b, a, c) {
        var h, g = 0,
            f = 1,
            d = "",
            l;
        for (l in a) {
            h = parseFloat(a[l], 10);
            f = "string" === typeof a[l] && /^\d+%$/.test(a[l]) ? .01 : 1;
            if ("x1" === l || "x2" === l || "r2" === l) f *= "objectBoundingBox" === c ? b.width : 1, g = "objectBoundingBox" === c ? b.left || 0 : 0;
            else if ("y1" === l || "y2" === l) f *= "objectBoundingBox" === c ? b.height : 1, g = "objectBoundingBox" === c ? b.top || 0 : 0;
            a[l] = h * f + g
        }
        "ellipse" === b.type && null !== a.r2 && "objectBoundingBox" === c && b.rx !== b.ry && (b = b.ry / b.rx, d = " scale(1, " + b + ")", a.y1 && (a.y1 /= b), a.y2 && (a.y2 /=
            b));
        return d
    }
    fabric.Gradient = fabric.util.createClass({
        offsetX: 0,
        offsetY: 0,
        initialize: function(b) {
            b || (b = {});
            var a = {};
            this.id = fabric.Object.__uid++;
            this.type = b.type || "linear";
            a = {
                x1: b.coords.x1 || 0,
                y1: b.coords.y1 || 0,
                x2: b.coords.x2 || 0,
                y2: b.coords.y2 || 0
            };
            "radial" === this.type && (a.r1 = b.coords.r1 || 0, a.r2 = b.coords.r2 || 0);
            this.coords = a;
            this.colorStops = b.colorStops.slice();
            b.gradientTransform && (this.gradientTransform = b.gradientTransform);
            this.offsetX = b.offsetX || this.offsetX;
            this.offsetY = b.offsetY || this.offsetY
        },
        addColorStop: function(b) {
            for (var a in b) {
                var c = new fabric.Color(b[a]);
                this.colorStops.push({
                    offset: a,
                    color: c.toRgb(),
                    opacity: c.getAlpha()
                })
            }
            return this
        },
        toObject: function() {
            return {
                type: this.type,
                coords: this.coords,
                colorStops: this.colorStops,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            }
        },
        toSVG: function(b) {
            var a = fabric.util.object.clone(this.coords),
                c;
            this.colorStops.sort(function(c, a) {
                return c.offset - a.offset
            });
            if (!b.group || "path-group" !== b.group.type)
                for (var h in a)
                    if ("x1" === h || "x2" === h || "r2" === h) a[h] +=
                        this.offsetX - b.width / 2;
                    else if ("y1" === h || "y2" === h) a[h] += this.offsetY - b.height / 2;
            b = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"';
            this.gradientTransform && (b += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" ');
            "linear" === this.type ? c = ["<linearGradient ", b, ' x1="', a.x1, '" y1="', a.y1, '" x2="', a.x2, '" y2="', a.y2, '">\n'] : "radial" === this.type && (c = ["<radialGradient ", b, ' cx="', a.x2, '" cy="', a.y2, '" r="', a.r2, '" fx="', a.x1, '" fy="', a.y1, '">\n']);
            for (a = 0; a < this.colorStops.length; a++) c.push("<stop ",
                'offset="', 100 * this.colorStops[a].offset + "%", '" style="stop-color:', this.colorStops[a].color, null != this.colorStops[a].opacity ? ";stop-opacity: " + this.colorStops[a].opacity : ";", '"/>\n');
            c.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n");
            return c.join("")
        },
        toLive: function(b, a) {
            var c, h, g = fabric.util.object.clone(this.coords);
            if (this.type) {
                if (a.group && "path-group" === a.group.type)
                    for (h in g)
                        if ("x1" === h || "x2" === h) g[h] += -this.offsetX + a.width / 2;
                        else if ("y1" === h || "y2" === h) g[h] += -this.offsetY +
                    a.height / 2;
                "linear" === this.type ? c = b.createLinearGradient(g.x1, g.y1, g.x2, g.y2) : "radial" === this.type && (c = b.createRadialGradient(g.x1, g.y1, g.r1, g.x2, g.y2, g.r2));
                h = 0;
                for (g = this.colorStops.length; h < g; h++) {
                    var f = this.colorStops[h].color,
                        d = this.colorStops[h].opacity,
                        l = this.colorStops[h].offset;
                    "undefined" !== typeof d && (f = (new fabric.Color(f)).setAlpha(d).toRgba());
                    c.addColorStop(parseFloat(l), f)
                }
                return c
            }
        }
    });
    fabric.util.object.extend(fabric.Gradient, {
        fromElement: function(e, a) {
            var c = e.getElementsByTagName("stop"),
                h = "linearGradient" === e.nodeName ? "linear" : "radial",
                g = e.getAttribute("gradientUnits") || "objectBoundingBox",
                f = e.getAttribute("gradientTransform"),
                k = [],
                l = {};
            "linear" === h ? l = {
                x1: e.getAttribute("x1") || 0,
                y1: e.getAttribute("y1") || 0,
                x2: e.getAttribute("x2") || "100%",
                y2: e.getAttribute("y2") || 0
            } : "radial" === h && (l = {
                x1: e.getAttribute("fx") || e.getAttribute("cx") || "50%",
                y1: e.getAttribute("fy") || e.getAttribute("cy") || "50%",
                r1: 0,
                x2: e.getAttribute("cx") || "50%",
                y2: e.getAttribute("cy") || "50%",
                r2: e.getAttribute("r") || "50%"
            });
            for (var m = c.length; m--;) k.push(d(c[m]));
            c = b(a, l, g);
            h = new fabric.Gradient({
                type: h,
                coords: l,
                colorStops: k,
                offsetX: -a.left,
                offsetY: -a.top
            });
            if (f || "" !== c) h.gradientTransform = fabric.parseTransformAttribute((f || "") + c);
            return h
        },
        forObject: function(e, a) {
            a || (a = {});
            b(e, a.coords, "userSpaceOnUse");
            return new fabric.Gradient(a)
        }
    })
})();
fabric.Pattern = fabric.util.createClass({
    repeat: "repeat",
    offsetX: 0,
    offsetY: 0,
    initialize: function(d) {
        d || (d = {});
        this.id = fabric.Object.__uid++;
        if (d.source)
            if ("string" === typeof d.source)
                if ("undefined" !== typeof fabric.util.getFunctionBody(d.source)) this.source = new Function(fabric.util.getFunctionBody(d.source));
                else {
                    var b = this;
                    this.source = fabric.util.createImage();
                    fabric.util.loadImage(d.source, function(e) {
                        b.source = e
                    })
                }
        else this.source = d.source;
        d.repeat && (this.repeat = d.repeat);
        d.offsetX && (this.offsetX =
            d.offsetX);
        d.offsetY && (this.offsetY = d.offsetY)
    },
    toObject: function() {
        var d;
        "function" === typeof this.source ? d = String(this.source) : "string" === typeof this.source.src ? d = this.source.src : "object" === typeof this.source && this.source.toDataURL && (d = this.source.toDataURL());
        return {
            source: d,
            repeat: this.repeat,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        }
    },
    toSVG: function(d) {
        var b = "function" === typeof this.source ? this.source() : this.source,
            e = b.width / d.getWidth(),
            a = b.height / d.getHeight(),
            c = this.offsetX / d.getWidth();
        d =
            this.offsetY / d.getHeight();
        var h = "";
        if ("repeat-x" === this.repeat || "no-repeat" === this.repeat) a = 1;
        if ("repeat-y" === this.repeat || "no-repeat" === this.repeat) e = 1;
        b.src ? h = b.src : b.toDataURL && (h = b.toDataURL());
        return '<pattern id="SVGID_' + this.id + '" x="' + c + '" y="' + d + '" width="' + e + '" height="' + a + '">\n<image x="0" y="0" width="' + b.width + '" height="' + b.height + '" xlink:href="' + h + '"></image>\n</pattern>\n'
    },
    toLive: function(d) {
        var b = "function" === typeof this.source ? this.source() : this.source;
        return b && ("undefined" ===
            typeof b.src || b.complete && 0 !== b.naturalWidth && 0 !== b.naturalHeight) ? d.createPattern(b, this.repeat) : ""
    }
});
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.toFixed;
    b.Shadow ? b.warn("fabric.Shadow is already defined.") : (b.Shadow = b.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: !1,
        includeDefaultValues: !0,
        initialize: function(a) {
            "string" === typeof a && (a = this._parseShadow(a));
            for (var c in a) this[c] = a[c];
            this.id = b.Object.__uid++
        },
        _parseShadow: function(a) {
            a = a.trim();
            var c = b.Shadow.reOffsetsAndBlur.exec(a) || [];
            return {
                color: (a.replace(b.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(),
                offsetX: parseInt(c[1], 10) || 0,
                offsetY: parseInt(c[2], 10) || 0,
                blur: parseInt(c[3], 10) || 0
            }
        },
        toString: function() {
            return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
        },
        toSVG: function(a) {
            var c = 40,
                b = 40;
            a.width && a.height && (c = 100 * e((Math.abs(this.offsetX) + this.blur) / a.width, 2) + 20, b = 100 * e((Math.abs(this.offsetY) + this.blur) / a.height, 2) + 20);
            return '<filter id="SVGID_' + this.id + '" y="-' + b + '%" height="' + (100 + 2 * b) + '%" x="-' + c + '%" width="' + (100 + 2 * c) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' +
                e(this.blur ? this.blur / 2 : 0, 3) + '"></feGaussianBlur>\n\t<feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + this.color + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
        },
        toObject: function() {
            if (this.includeDefaultValues) return {
                color: this.color,
                blur: this.blur,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            };
            var a = {},
                c = b.Shadow.prototype;
            this.color !== c.color && (a.color = this.color);
            this.blur !== c.blur && (a.blur = this.blur);
            this.offsetX !== c.offsetX && (a.offsetX = this.offsetX);
            this.offsetY !== c.offsetY && (a.offsetY = this.offsetY);
            return a
        }
    }), b.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/)
})("undefined" !== typeof exports ? exports : this);
(function() {
    if (fabric.StaticCanvas) fabric.warn("fabric.StaticCanvas is already defined.");
    else {
        var d = fabric.util.object.extend,
            b = fabric.util.getElementOffset,
            e = fabric.util.removeFromArray,
            a = Error("Could not initialize `canvas` element");
        fabric.StaticCanvas = fabric.util.createClass({
            initialize: function(c, a) {
                a || (a = {});
                this._initStatic(c, a);
                fabric.StaticCanvas.activeInstance = this
            },
            backgroundColor: "",
            backgroundImage: null,
            overlayColor: "",
            overlayImage: null,
            includeDefaultValues: !0,
            stateful: !0,
            renderOnAddRemove: !0,
            clipTo: null,
            controlsAboveOverlay: !1,
            allowTouchScrolling: !1,
            imageSmoothingEnabled: !0,
            preserveObjectStacking: !1,
            viewportTransform: [1, 0, 0, 1, 0, 0],
            onBeforeScaleRotate: function() {},
            enableRetinaScaling: !0,
            _initStatic: function(c, a) {
                this._objects = [];
                this._createLowerCanvas(c);
                this._initOptions(a);
                this._setImageSmoothing();
                this.interactive || this._initRetinaScaling();
                a.overlayImage && this.setOverlayImage(a.overlayImage, this.renderAll.bind(this));
                a.backgroundImage && this.setBackgroundImage(a.backgroundImage, this.renderAll.bind(this));
                a.backgroundColor && this.setBackgroundColor(a.backgroundColor, this.renderAll.bind(this));
                a.overlayColor && this.setOverlayColor(a.overlayColor, this.renderAll.bind(this));
                this.calcOffset()
            },
            _initRetinaScaling: function() {
                1 !== fabric.devicePixelRatio && this.enableRetinaScaling && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio))
            },
            calcOffset: function() {
                this._offset = b(this.lowerCanvasEl);
                return this
            },
            setOverlayImage: function(c, a, b) {
                return this.__setBgOverlayImage("overlayImage", c, a, b)
            },
            setBackgroundImage: function(c, a, b) {
                return this.__setBgOverlayImage("backgroundImage", c, a, b)
            },
            setOverlayColor: function(c, a) {
                return this.__setBgOverlayColor("overlayColor", c, a)
            },
            setBackgroundColor: function(c, a) {
                return this.__setBgOverlayColor("backgroundColor", c, a)
            },
            _setImageSmoothing: function() {
                var c = this.getContext();
                "undefined" !== typeof c.imageSmoothingEnabled ?
                    c.imageSmoothingEnabled = this.imageSmoothingEnabled : (c.webkitImageSmoothingEnabled = this.imageSmoothingEnabled, c.mozImageSmoothingEnabled = this.imageSmoothingEnabled, c.msImageSmoothingEnabled = this.imageSmoothingEnabled, c.oImageSmoothingEnabled = this.imageSmoothingEnabled)
            },
            __setBgOverlayImage: function(c, a, b, f) {
                "string" === typeof a ? fabric.util.loadImage(a, function(a) {
                    this[c] = new fabric.Image(a, f);
                    b && b()
                }, this, f && f.crossOrigin) : (f && a.setOptions(f), this[c] = a, b && b());
                return this
            },
            __setBgOverlayColor: function(c,
                a, b) {
                if (a && a.source) {
                    var f = this;
                    fabric.util.loadImage(a.source, function(e) {
                        f[c] = new fabric.Pattern({
                            source: e,
                            repeat: a.repeat,
                            offsetX: a.offsetX,
                            offsetY: a.offsetY
                        });
                        b && b()
                    })
                } else this[c] = a, b && b();
                return this
            },
            _createCanvasElement: function() {
                var c = fabric.document.createElement("canvas");
                c.style || (c.style = {});
                if (!c) throw a;
                this._initCanvasElement(c);
                return c
            },
            _initCanvasElement: function(c) {
                fabric.util.createCanvasElement(c);
                if ("undefined" === typeof c.getContext) throw a;
            },
            _initOptions: function(c) {
                for (var a in c) this[a] =
                    c[a];
                this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
                this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
                this.lowerCanvasEl.style && (this.lowerCanvasEl.width = this.width, this.lowerCanvasEl.height = this.height, this.lowerCanvasEl.style.width = this.width + "px", this.lowerCanvasEl.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
            },
            _createLowerCanvas: function(c) {
                this.lowerCanvasEl = fabric.util.getById(c) || this._createCanvasElement();
                this._initCanvasElement(this.lowerCanvasEl);
                fabric.util.addClass(this.lowerCanvasEl, "lower-canvas");
                this.interactive && this._applyCanvasStyle(this.lowerCanvasEl);
                this.contextContainer = this.lowerCanvasEl.getContext("2d")
            },
            getWidth: function() {
                return this.width
            },
            getHeight: function() {
                return this.height
            },
            setWidth: function(c, a) {
                return this.setDimensions({
                    width: c
                }, a)
            },
            setHeight: function(c, a) {
                return this.setDimensions({
                    height: c
                }, a)
            },
            setDimensions: function(c, a) {
                var b;
                a = a || {};
                for (var f in c) b = c[f], a.cssOnly || (this._setBackstoreDimension(f, c[f]), b += "px"),
                    a.backstoreOnly || this._setCssDimension(f, b);
                this._setImageSmoothing();
                this.calcOffset();
                a.cssOnly || this.renderAll();
                return this
            },
            _setBackstoreDimension: function(c, a) {
                this.lowerCanvasEl[c] = a;
                this.upperCanvasEl && (this.upperCanvasEl[c] = a);
                this.cacheCanvasEl && (this.cacheCanvasEl[c] = a);
                this[c] = a;
                return this
            },
            _setCssDimension: function(c, a) {
                this.lowerCanvasEl.style[c] = a;
                this.upperCanvasEl && (this.upperCanvasEl.style[c] = a);
                this.wrapperEl && (this.wrapperEl.style[c] = a);
                return this
            },
            getZoom: function() {
                return Math.sqrt(this.viewportTransform[0] *
                    this.viewportTransform[3])
            },
            setViewportTransform: function(c) {
                var a = this.getActiveGroup();
                this.viewportTransform = c;
                this.renderAll();
                c = 0;
                for (var b = this._objects.length; c < b; c++) this._objects[c].setCoords();
                a && a.setCoords();
                return this
            },
            zoomToPoint: function(c, a) {
                var b = c;
                c = fabric.util.transformPoint(c, fabric.util.invertTransform(this.viewportTransform));
                this.viewportTransform[0] = a;
                this.viewportTransform[3] = a;
                var f = fabric.util.transformPoint(c, this.viewportTransform);
                this.viewportTransform[4] += b.x - f.x;
                this.viewportTransform[5] += b.y - f.y;
                this.renderAll();
                b = 0;
                for (f = this._objects.length; b < f; b++) this._objects[b].setCoords();
                return this
            },
            setZoom: function(c) {
                this.zoomToPoint(new fabric.Point(0, 0), c);
                return this
            },
            absolutePan: function(c) {
                this.viewportTransform[4] = -c.x;
                this.viewportTransform[5] = -c.y;
                this.renderAll();
                c = 0;
                for (var a = this._objects.length; c < a; c++) this._objects[c].setCoords();
                return this
            },
            relativePan: function(c) {
                return this.absolutePan(new fabric.Point(-c.x - this.viewportTransform[4], -c.y - this.viewportTransform[5]))
            },
            getElement: function() {
                return this.lowerCanvasEl
            },
            getActiveObject: function() {
                return null
            },
            getActiveGroup: function() {
                return null
            },
            _draw: function(c, a) {
                if (a) {
                    c.save();
                    var b = this.viewportTransform;
                    c.transform(b[0], b[1], b[2], b[3], b[4], b[5]);
                    this._shouldRenderObject(a) && a.render(c);
                    c.restore();
                    this.controlsAboveOverlay || a._renderControls(c)
                }
            },
            _shouldRenderObject: function(c) {
                return c ? c !== this.getActiveGroup() || !this.preserveObjectStacking : !1
            },
            _onObjectAdded: function(c) {
                this.stateful && c.setupState();
                c._set("canvas",
                    this);
                c.setCoords();
                this.fire("object:added", {
                    target: c
                });
                c.fire("added")
            },
            _onObjectRemoved: function(c) {
                this.getActiveObject() === c && (this.fire("before:selection:cleared", {
                    target: c
                }), this._discardActiveObject(), this.fire("selection:cleared"));
                this.fire("object:removed", {
                    target: c
                });
                c.fire("removed")
            },
            clearContext: function(c) {
                c.clearRect(0, 0, this.width, this.height);
                return this
            },
            getContext: function() {
                return this.contextContainer
            },
            clear: function() {
                this._objects.length = 0;
                this.discardActiveGroup && this.discardActiveGroup();
                this.discardActiveObject && this.discardActiveObject();
                this.clearContext(this.contextContainer);
                this.contextTop && this.clearContext(this.contextTop);
                this.fire("canvas:cleared");
                this.renderAll();
                return this
            },
            renderAll: function(c) {
                var a = this[!0 === c && this.interactive ? "contextTop" : "contextContainer"],
                    b = this.getActiveGroup();
                this.contextTop && this.selection && !this._groupSelector && this.clearContext(this.contextTop);
                c || this.clearContext(a);
                this.fire("before:render");
                this.clipTo && fabric.util.clipContext(this,
                    a);
                this._renderBackground(a);
                this._renderObjects(a, b);
                this._renderActiveGroup(a, b);
                this.clipTo && a.restore();
                this._renderOverlay(a);
                this.controlsAboveOverlay && this.interactive && this.drawControls(a);
                this.fire("after:render");
                return this
            },
            _renderObjects: function(c, a) {
                var b, f;
                if (!a || this.preserveObjectStacking)
                    for (b = 0, f = this._objects.length; b < f; ++b) this._draw(c, this._objects[b]);
                else
                    for (b = 0, f = this._objects.length; b < f; ++b) this._objects[b] && !a.contains(this._objects[b]) && this._draw(c, this._objects[b])
            },
            _renderActiveGroup: function(c, a) {
                if (a) {
                    var b = [];
                    this.forEachObject(function(c) {
                        a.contains(c) && b.push(c)
                    });
                    a._set("_objects", b.reverse());
                    this._draw(c, a)
                }
            },
            _renderBackground: function(c) {
                this.backgroundColor && (c.fillStyle = this.backgroundColor.toLive ? this.backgroundColor.toLive(c) : this.backgroundColor, c.fillRect(this.backgroundColor.offsetX || 0, this.backgroundColor.offsetY || 0, this.width, this.height));
                this.backgroundImage && this._draw(c, this.backgroundImage)
            },
            _renderOverlay: function(c) {
                this.overlayColor &&
                    (c.fillStyle = this.overlayColor.toLive ? this.overlayColor.toLive(c) : this.overlayColor, c.fillRect(this.overlayColor.offsetX || 0, this.overlayColor.offsetY || 0, this.width, this.height));
                this.overlayImage && this._draw(c, this.overlayImage)
            },
            renderTop: function() {
                var c = this.contextTop || this.contextContainer;
                this.clearContext(c);
                this.selection && this._groupSelector && this._drawSelection();
                var a = this.getActiveGroup();
                a && a.render(c);
                this._renderOverlay(c);
                this.fire("after:render");
                return this
            },
            getCenter: function() {
                return {
                    top: this.getHeight() /
                        2,
                    left: this.getWidth() / 2
                }
            },
            centerObjectH: function(c) {
                this._centerObject(c, new fabric.Point(this.getCenter().left, c.getCenterPoint().y));
                this.renderAll();
                return this
            },
            centerObjectV: function(c) {
                this._centerObject(c, new fabric.Point(c.getCenterPoint().x, this.getCenter().top));
                this.renderAll();
                return this
            },
            centerObject: function(c) {
                var a = this.getCenter();
                this._centerObject(c, new fabric.Point(a.left, a.top));
                this.renderAll();
                return this
            },
            _centerObject: function(c, a) {
                c.setPositionByOrigin(a, "center", "center");
                return this
            },
            toDatalessJSON: function(c) {
                return this.toDatalessObject(c)
            },
            toObject: function(c) {
                return this._toObjectMethod("toObject", c)
            },
            toDatalessObject: function(c) {
                return this._toObjectMethod("toDatalessObject", c)
            },
            _toObjectMethod: function(c, a) {
                var b = {
                    objects: this._toObjects(c, a)
                };
                d(b, this.__serializeBgOverlay());
                fabric.util.populateWithProperties(this, b, a);
                return b
            },
            _toObjects: function(c, a) {
                return this.getObjects().map(function(b) {
                    return this._toObject(b, c, a)
                }, this)
            },
            _toObject: function(c, a, b) {
                var f;
                this.includeDefaultValues || (f = c.includeDefaultValues, c.includeDefaultValues = !1);
                var e = this._realizeGroupTransformOnObject(c);
                a = c[a](b);
                this.includeDefaultValues || (c.includeDefaultValues = f);
                this._unwindGroupTransformOnObject(c, e);
                return a
            },
            _realizeGroupTransformOnObject: function(c) {
                var a = "angle flipX flipY height left scaleX scaleY top width".split(" ");
                if (c.group && c.group === this.getActiveGroup()) {
                    var b = {};
                    a.forEach(function(a) {
                        b[a] = c[a]
                    });
                    this.getActiveGroup().realizeTransform(c);
                    return b
                }
                return null
            },
            _unwindGroupTransformOnObject: function(c, a) {
                a && c.set(a)
            },
            __serializeBgOverlay: function() {
                var c = {
                    background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor
                };
                this.overlayColor && (c.overlay = this.overlayColor.toObject ? this.overlayColor.toObject() : this.overlayColor);
                this.backgroundImage && (c.backgroundImage = this.backgroundImage.toObject());
                this.overlayImage && (c.overlayImage = this.overlayImage.toObject());
                return c
            },
            svgViewportTransformation: !0,
            toSVG: function(c,
                a) {
                c || (c = {});
                var b = [];
                this._setSVGPreamble(b, c);
                this._setSVGHeader(b, c);
                this._setSVGBgOverlayColor(b, "backgroundColor");
                this._setSVGBgOverlayImage(b, "backgroundImage");
                this._setSVGObjects(b, a);
                this._setSVGBgOverlayColor(b, "overlayColor");
                this._setSVGBgOverlayImage(b, "overlayImage");
                b.push("</svg>");
                return b.join("")
            },
            _setSVGPreamble: function(c, a) {
                a.suppressPreamble || c.push('<?xml version="1.0" encoding="', a.encoding || "UTF-8", '" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
                    '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
            },
            _setSVGHeader: function(c, a) {
                var b, f, e;
                a.viewBox ? (b = a.viewBox.width, f = a.viewBox.height) : (b = this.width, f = this.height, this.svgViewportTransformation || (e = this.viewportTransform, b /= e[0], f /= e[3]));
                c.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', b, '" ', 'height="', f, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ' :
                    null, a.viewBox ? 'viewBox="' + a.viewBox.x + " " + a.viewBox.y + " " + a.viewBox.width + " " + a.viewBox.height + '" ' : null, 'xml:space="preserve">', "<desc>Created with Fabric.js ", fabric.version, "</desc>", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>")
            },
            _setSVGObjects: function(c, a) {
                for (var b = 0, f = this.getObjects(), e = f.length; b < e; b++) {
                    var d = f[b],
                        m = this._realizeGroupTransformOnObject(d);
                    c.push(d.toSVG(a));
                    this._unwindGroupTransformOnObject(d, m)
                }
            },
            _setSVGBgOverlayImage: function(a,
                b) {
                this[b] && this[b].toSVG && a.push(this[b].toSVG())
            },
            _setSVGBgOverlayColor: function(a, b) {
                this[b] && this[b].source ? a.push('<rect x="', this[b].offsetX, '" y="', this[b].offsetY, '" ', 'width="', "repeat-y" === this[b].repeat || "no-repeat" === this[b].repeat ? this[b].source.width : this.width, '" height="', "repeat-x" === this[b].repeat || "no-repeat" === this[b].repeat ? this[b].source.height : this.height, '" fill="url(#' + b + 'Pattern)"', "></rect>") : this[b] && "overlayColor" === b && a.push('<rect x="0" y="0" ', 'width="', this.width,
                    '" height="', this.height, '" fill="', this[b], '"', "></rect>")
            },
            sendToBack: function(a) {
                e(this._objects, a);
                this._objects.unshift(a);
                return this.renderAll && this.renderAll()
            },
            bringToFront: function(a) {
                e(this._objects, a);
                this._objects.push(a);
                return this.renderAll && this.renderAll()
            },
            sendBackwards: function(a, b) {
                var g = this._objects.indexOf(a);
                0 !== g && (g = this._findNewLowerIndex(a, g, b), e(this._objects, a), this._objects.splice(g, 0, a), this.renderAll && this.renderAll());
                return this
            },
            _findNewLowerIndex: function(a, b,
                g) {
                if (g)
                    for (g = b, --b; 0 <= b; --b) {
                        if (a.intersectsWithObject(this._objects[b]) || a.isContainedWithinObject(this._objects[b]) || this._objects[b].isContainedWithinObject(a)) {
                            g = b;
                            break
                        }
                    } else g = b - 1;
                return g
            },
            bringForward: function(a, b) {
                var g = this._objects.indexOf(a);
                g !== this._objects.length - 1 && (g = this._findNewUpperIndex(a, g, b), e(this._objects, a), this._objects.splice(g, 0, a), this.renderAll && this.renderAll());
                return this
            },
            _findNewUpperIndex: function(a, b, g) {
                if (g)
                    for (g = b, b += 1; b < this._objects.length; ++b) {
                        if (a.intersectsWithObject(this._objects[b]) ||
                            a.isContainedWithinObject(this._objects[b]) || this._objects[b].isContainedWithinObject(a)) {
                            g = b;
                            break
                        }
                    } else g = b + 1;
                return g
            },
            moveTo: function(a, b) {
                e(this._objects, a);
                this._objects.splice(b, 0, a);
                return this.renderAll && this.renderAll()
            },
            dispose: function() {
                this.clear();
                this.interactive && this.removeListeners();
                return this
            },
            toString: function() {
                return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
            }
        });
        d(fabric.StaticCanvas.prototype, fabric.Observable);
        d(fabric.StaticCanvas.prototype,
            fabric.Collection);
        d(fabric.StaticCanvas.prototype, fabric.DataURLExporter);
        d(fabric.StaticCanvas, {
            EMPTY_JSON: '{"objects": [], "background": "white"}',
            supports: function(a) {
                var b = fabric.util.createCanvasElement();
                if (!b || !b.getContext) return null;
                var g = b.getContext("2d");
                if (!g) return null;
                switch (a) {
                    case "getImageData":
                        return "undefined" !== typeof g.getImageData;
                    case "setLineDash":
                        return "undefined" !== typeof g.setLineDash;
                    case "toDataURL":
                        return "undefined" !== typeof b.toDataURL;
                    case "toDataURLWithQuality":
                        try {
                            return b.toDataURL("image/jpeg",
                                0), !0
                        } catch (f) {}
                        return !1;
                    default:
                        return null
                }
            }
        });
        fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
    }
})();
fabric.BaseBrush = fabric.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeDashArray: null,
    setShadow: function(d) {
        this.shadow = new fabric.Shadow(d);
        return this
    },
    _setBrushStyles: function() {
        var d = this.canvas.contextTop;
        d.strokeStyle = this.color;
        d.lineWidth = this.width;
        d.lineCap = this.strokeLineCap;
        d.lineJoin = this.strokeLineJoin;
        this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash") && d.setLineDash(this.strokeDashArray)
    },
    _setShadow: function() {
        if (this.shadow) {
            var d =
                this.canvas.contextTop;
            d.shadowColor = this.shadow.color;
            d.shadowBlur = this.shadow.blur;
            d.shadowOffsetX = this.shadow.offsetX;
            d.shadowOffsetY = this.shadow.offsetY
        }
    },
    _resetShadow: function() {
        var d = this.canvas.contextTop;
        d.shadowColor = "";
        d.shadowBlur = d.shadowOffsetX = d.shadowOffsetY = 0
    }
});
(function() {
    fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(d) {
            this.canvas = d;
            this._points = []
        },
        onMouseDown: function(d) {
            this._prepareForDrawing(d);
            this._captureDrawingPath(d);
            this._render()
        },
        onMouseMove: function(d) {
            this._captureDrawingPath(d);
            this.canvas.clearContext(this.canvas.contextTop);
            this._render()
        },
        onMouseUp: function() {
            this._finalizeAndAddPath()
        },
        _prepareForDrawing: function(d) {
            d = new fabric.Point(d.x, d.y);
            this._reset();
            this._addPoint(d);
            this.canvas.contextTop.moveTo(d.x,
                d.y)
        },
        _addPoint: function(d) {
            this._points.push(d)
        },
        _reset: function() {
            this._points.length = 0;
            this._setBrushStyles();
            this._setShadow()
        },
        _captureDrawingPath: function(d) {
            d = new fabric.Point(d.x, d.y);
            this._addPoint(d)
        },
        _render: function() {
            var d = this.canvas.contextTop,
                b = this.canvas.viewportTransform,
                e = this._points[0],
                a = this._points[1];
            d.save();
            d.transform(b[0], b[1], b[2], b[3], b[4], b[5]);
            d.beginPath();
            2 === this._points.length && e.x === a.x && e.y === a.y && (e.x -= .5, a.x += .5);
            d.moveTo(e.x, e.y);
            for (var b = 1, c = this._points.length; b <
                c; b++) a = e.midPointFrom(a), d.quadraticCurveTo(e.x, e.y, a.x, a.y), e = this._points[b], a = this._points[b + 1];
            d.lineTo(e.x, e.y);
            d.stroke();
            d.restore()
        },
        convertPointsToSVGPath: function(d) {
            var b = [],
                e = new fabric.Point(d[0].x, d[0].y),
                a = new fabric.Point(d[1].x, d[1].y);
            b.push("M ", d[0].x, " ", d[0].y, " ");
            for (var c = 1, h = d.length; c < h; c++) {
                var g = e.midPointFrom(a);
                b.push("Q ", e.x, " ", e.y, " ", g.x, " ", g.y, " ");
                e = new fabric.Point(d[c].x, d[c].y);
                c + 1 < d.length && (a = new fabric.Point(d[c + 1].x, d[c + 1].y))
            }
            b.push("L ", e.x, " ", e.y,
                " ");
            return b
        },
        createPath: function(d) {
            d = new fabric.Path(d, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray,
                originX: "center",
                originY: "center"
            });
            this.shadow && (this.shadow.affectStroke = !0, d.setShadow(this.shadow));
            return d
        },
        _finalizeAndAddPath: function() {
            this.canvas.contextTop.closePath();
            var d = this.convertPointsToSVGPath(this._points).join("");
            "M 0 0 Q 0 0 0 0 L 0 0" === d ? this.canvas.renderAll() :
                (d = this.createPath(d), this.canvas.add(d), d.setCoords(), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderAll(), this.canvas.fire("path:created", {
                    path: d
                }))
        }
    })
})();
fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    initialize: function(d) {
        this.canvas = d;
        this.points = []
    },
    drawDot: function(d) {
        d = this.addPoint(d);
        var b = this.canvas.contextTop,
            e = this.canvas.viewportTransform;
        b.save();
        b.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
        b.fillStyle = d.fill;
        b.beginPath();
        b.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, !1);
        b.closePath();
        b.fill();
        b.restore()
    },
    onMouseDown: function(d) {
        this.points.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.drawDot(d)
    },
    onMouseMove: function(d) {
        this.drawDot(d)
    },
    onMouseUp: function() {
        var d = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = !1;
        for (var b = [], e = 0, a = this.points.length; e < a; e++) {
            var c = this.points[e],
                c = new fabric.Circle({
                    radius: c.radius,
                    left: c.x,
                    top: c.y,
                    originX: "center",
                    originY: "center",
                    fill: c.fill
                });
            this.shadow && c.setShadow(this.shadow);
            b.push(c)
        }
        b = new fabric.Group(b, {
            originX: "center",
            originY: "center"
        });
        b.canvas = this.canvas;
        this.canvas.add(b);
        this.canvas.fire("path:created", {
            path: b
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = d;
        this.canvas.renderAll()
    },
    addPoint: function(d) {
        d = new fabric.Point(d.x, d.y);
        var b = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
            e = (new fabric.Color(this.color)).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
        d.radius = b;
        d.fill = e;
        this.points.push(d);
        return d
    }
});
fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: !1,
    optimizeOverlapping: !0,
    initialize: function(d) {
        this.canvas = d;
        this.sprayChunks = []
    },
    onMouseDown: function(d) {
        this.sprayChunks.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.addSprayChunk(d);
        this.render()
    },
    onMouseMove: function(d) {
        this.addSprayChunk(d);
        this.render()
    },
    onMouseUp: function() {
        var d = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = !1;
        for (var b = [], e = 0, a = this.sprayChunks.length; e < a; e++)
            for (var c = this.sprayChunks[e], h = 0, g = c.length; h < g; h++) {
                var f = new fabric.Rect({
                    width: c[h].width,
                    height: c[h].width,
                    left: c[h].x + 1,
                    top: c[h].y + 1,
                    originX: "center",
                    originY: "center",
                    fill: this.color
                });
                this.shadow && f.setShadow(this.shadow);
                b.push(f)
            }
        this.optimizeOverlapping && (b = this._getOptimizedRects(b));
        b = new fabric.Group(b, {
            originX: "center",
            originY: "center"
        });
        b.canvas = this.canvas;
        this.canvas.add(b);
        this.canvas.fire("path:created", {
            path: b
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = d;
        this.canvas.renderAll()
    },
    _getOptimizedRects: function(d) {
        for (var b = {}, e, a = 0, c = d.length; a < c; a++) e = d[a].left + "" + d[a].top, b[e] || (b[e] = d[a]);
        d = [];
        for (e in b) d.push(b[e]);
        return d
    },
    render: function() {
        var d = this.canvas.contextTop;
        d.fillStyle = this.color;
        var b = this.canvas.viewportTransform;
        d.save();
        d.transform(b[0], b[1], b[2], b[3], b[4], b[5]);
        for (var b = 0, e = this.sprayChunkPoints.length; b < e; b++) {
            var a = this.sprayChunkPoints[b];
            "undefined" !== typeof a.opacity && (d.globalAlpha =
                a.opacity);
            d.fillRect(a.x, a.y, a.width, a.width)
        }
        d.restore()
    },
    addSprayChunk: function(d) {
        this.sprayChunkPoints = [];
        for (var b, e, a, c = this.width / 2, h = 0; h < this.density; h++) b = fabric.util.getRandomInt(d.x - c, d.x + c), e = fabric.util.getRandomInt(d.y - c, d.y + c), a = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth, b = new fabric.Point(b, e), b.width = a, this.randomOpacity && (b.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(b);
        this.sprayChunks.push(this.sprayChunkPoints)
    }
});
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function() {
        var d = fabric.document.createElement("canvas"),
            b = d.getContext("2d");
        d.width = d.height = 25;
        b.fillStyle = this.color;
        b.beginPath();
        b.arc(10, 10, 10, 0, 2 * Math.PI, !1);
        b.closePath();
        b.fill();
        return d
    },
    getPatternSrcFunction: function() {
        return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
    },
    getPattern: function() {
        return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
    },
    _setBrushStyles: function() {
        this.callSuper("_setBrushStyles");
        this.canvas.contextTop.strokeStyle = this.getPattern()
    },
    createPath: function(d) {
        d = this.callSuper("createPath", d);
        d.stroke = new fabric.Pattern({
            source: this.source || this.getPatternSrcFunction()
        });
        return d
    }
});
(function() {
    var d = fabric.util.getPointer,
        b = fabric.util.degreesToRadians,
        e = fabric.util.radiansToDegrees,
        a = Math.atan2,
        c = Math.abs;
    fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function(a, c) {
            c || (c = {});
            this._initStatic(a, c);
            this._initInteractive();
            this._createCacheCanvas();
            fabric.Canvas.activeInstance = this
        },
        uniScaleTransform: !1,
        centeredScaling: !1,
        centeredRotation: !1,
        interactive: !0,
        selection: !0,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        containerClass: "canvas-container",
        perPixelTargetFind: !1,
        targetFindTolerance: 0,
        skipTargetFind: !1,
        isDrawingMode: !1,
        _initInteractive: function() {
            this._groupSelector = this._currentTransform = null;
            this._initWrapperElement();
            this._createUpperCanvas();
            this._initEventListeners();
            this._initRetinaScaling();
            this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);
            this.calcOffset()
        },
        _resetCurrentTransform: function(a) {
            var c = this._currentTransform;
            c.target.set({
                scaleX: c.original.scaleX,
                scaleY: c.original.scaleY,
                left: c.original.left,
                top: c.original.top
            });
            this._shouldCenterTransform(a, c.target) ? "rotate" === c.action ? this._setOriginToCenter(c.target) : ("center" !== c.originX && (c.mouseXSign = "right" === c.originX ? -1 : 1), "center" !== c.originY && (c.mouseYSign = "bottom" === c.originY ? -1 : 1), c.originX = "center", c.originY = "center") : (c.originX = c.original.originX, c.originY = c.original.originY)
        },
        containsPoint: function(a, c) {
            var b = this.getPointer(a, !0),
                e = this._normalizePointer(c, b);
            return c.containsPoint(e) || c._findTargetCorner(b)
        },
        _normalizePointer: function(a, c) {
            var b = this.getActiveGroup(),
                e = c.x,
                d = c.y,
                h;
            b && "group" !== a.type && b.contains(a) && (h = fabric.util.transformPoint(b.getCenterPoint(), this.viewportTransform, !0), e -= h.x, d -= h.y, e /= b.scaleX, d /= b.scaleY);
            return {
                x: e,
                y: d
            }
        },
        isTargetTransparent: function(a, c, b) {
            var e = a.hasBorders,
                d = a.transparentCorners;
            a.hasBorders = a.transparentCorners = !1;
            this._draw(this.contextCache,
                a);
            a.hasBorders = e;
            a.transparentCorners = d;
            a = fabric.util.isTransparent(this.contextCache, c, b, this.targetFindTolerance);
            this.clearContext(this.contextCache);
            return a
        },
        _shouldClearSelection: function(a, c) {
            var b = this.getActiveGroup(),
                e = this.getActiveObject();
            return !c || c && b && !b.contains(c) && b !== c && !a.shiftKey || c && !c.evented || c && !c.selectable && e && e !== c
        },
        _shouldCenterTransform: function(a, c) {
            if (c) {
                var b = this._currentTransform,
                    e;
                "scale" === b.action || "scaleX" === b.action || "scaleY" === b.action ? e = this.centeredScaling ||
                    c.centeredScaling : "rotate" === b.action && (e = this.centeredRotation || c.centeredRotation);
                return e ? !a.altKey : a.altKey
            }
        },
        _getOriginFromCorner: function(a, c) {
            var b = {
                x: a.originX,
                y: a.originY
            };
            if ("ml" === c || "tl" === c || "bl" === c) b.x = "right";
            else if ("mr" === c || "tr" === c || "br" === c) b.x = "left";
            if ("tl" === c || "mt" === c || "tr" === c) b.y = "bottom";
            else if ("bl" === c || "mb" === c || "br" === c) b.y = "top";
            return b
        },
        _getActionFromCorner: function(a, c) {
            var b = "drag";
            c && (b = "ml" === c || "mr" === c ? "scaleX" : "mt" === c || "mb" === c ? "scaleY" : "mtr" === c ? "rotate" :
                "scale");
            return b
        },
        _setupCurrentTransform: function(a, c) {
            if (c) {
                var e = this.getPointer(a),
                    d = c._findTargetCorner(this.getPointer(a, !0)),
                    h = this._getActionFromCorner(c, d),
                    d = this._getOriginFromCorner(c, d);
                this._currentTransform = {
                    target: c,
                    action: h,
                    scaleX: c.scaleX,
                    scaleY: c.scaleY,
                    offsetX: e.x - c.left,
                    offsetY: e.y - c.top,
                    originX: d.x,
                    originY: d.y,
                    ex: e.x,
                    ey: e.y,
                    left: c.left,
                    top: c.top,
                    theta: b(c.angle),
                    width: c.width * c.scaleX,
                    mouseXSign: 1,
                    mouseYSign: 1
                };
                this._currentTransform.original = {
                    left: c.left,
                    top: c.top,
                    scaleX: c.scaleX,
                    scaleY: c.scaleY,
                    originX: d.x,
                    originY: d.y
                };
                this._resetCurrentTransform(a)
            }
        },
        _translateObject: function(a, c) {
            var b = this._currentTransform.target;
            b.get("lockMovementX") || b.set("left", a - this._currentTransform.offsetX);
            b.get("lockMovementY") || b.set("top", c - this._currentTransform.offsetY)
        },
        _scaleObject: function(a, c, b) {
            var e = this._currentTransform,
                d = e.target,
                h = d.get("lockScalingX"),
                u = d.get("lockScalingY"),
                A = d.get("lockScalingFlip");
            if (!h || !u) {
                var D = d.translateToOriginPoint(d.getCenterPoint(), e.originX, e.originY);
                a = d.toLocalPoint(new fabric.Point(a, c), e.originX, e.originY);
                this._setLocalMouse(a, e);
                this._setObjectScale(a, e, h, u, b, A);
                d.setPositionByOrigin(D, e.originX, e.originY)
            }
        },
        _setObjectScale: function(a, c, b, e, d, h) {
            var u = c.target,
                A = !1,
                D = !1,
                v = u._getNonTransformedDimensions();
            c.newScaleX = a.x / v.x;
            c.newScaleY = a.y / v.y;
            h && 0 >= c.newScaleX && c.newScaleX < u.scaleX && (A = !0);
            h && 0 >= c.newScaleY && c.newScaleY < u.scaleY && (D = !0);
            "equally" !== d || b || e ? d ? "x" !== d || u.get("lockUniScaling") ? "y" !== d || u.get("lockUniScaling") || D || e || u.set("scaleY",
                c.newScaleY) : A || b || u.set("scaleX", c.newScaleX) : (A || b || u.set("scaleX", c.newScaleX), D || e || u.set("scaleY", c.newScaleY)) : A || D || this._scaleObjectEqually(a, u, c);
            A || D || this._flipObject(c, d)
        },
        _scaleObjectEqually: function(a, c, b) {
            a = a.y + a.x;
            var e = c._getNonTransformedDimensions(),
                e = e.y * b.original.scaleY + e.x * b.original.scaleX;
            b.newScaleX = b.original.scaleX * a / e;
            b.newScaleY = b.original.scaleY * a / e;
            c.set("scaleX", b.newScaleX);
            c.set("scaleY", b.newScaleY)
        },
        _flipObject: function(a, c) {
            0 > a.newScaleX && "y" !== c && ("left" === a.originX ?
                a.originX = "right" : "right" === a.originX && (a.originX = "left"));
            0 > a.newScaleY && "x" !== c && ("top" === a.originY ? a.originY = "bottom" : "bottom" === a.originY && (a.originY = "top"))
        },
        _setLocalMouse: function(a, b) {
            var e = b.target;
            "right" === b.originX ? a.x *= -1 : "center" === b.originX && (a.x = 2 * a.x * b.mouseXSign, 0 > a.x && (b.mouseXSign = -b.mouseXSign));
            "bottom" === b.originY ? a.y *= -1 : "center" === b.originY && (a.y = 2 * a.y * b.mouseYSign, 0 > a.y && (b.mouseYSign = -b.mouseYSign));
            c(a.x) > e.padding ? a.x = 0 > a.x ? a.x + e.padding : a.x - e.padding : a.x = 0;
            c(a.y) > e.padding ?
                a.y = 0 > a.y ? a.y + e.padding : a.y - e.padding : a.y = 0
        },
        _rotateObject: function(c, b) {
            var d = this._currentTransform;
            if (!d.target.get("lockRotation")) {
                var h = a(d.ey - d.top, d.ex - d.left),
                    m = a(b - d.top, c - d.left),
                    h = e(m - h + d.theta);
                0 > h && (h = 360 + h);
                d.target.angle = h % 360
            }
        },
        setCursor: function(a) {
            this.upperCanvasEl.style.cursor = a
        },
        _resetObjectTransform: function(a) {
            a.scaleX = 1;
            a.scaleY = 1;
            a.setAngle(0)
        },
        _drawSelection: function() {
            var a = this.contextTop,
                b = this._groupSelector,
                e = b.left,
                d = b.top,
                h = c(e),
                n = c(d);
            a.fillStyle = this.selectionColor;
            a.fillRect(b.ex - (0 < e ? 0 : -e), b.ey - (0 < d ? 0 : -d), h, n);
            a.lineWidth = this.selectionLineWidth;
            a.strokeStyle = this.selectionBorderColor;
            1 < this.selectionDashArray.length ? (e = b.ex + .5 - (0 < e ? 0 : h), b = b.ey + .5 - (0 < d ? 0 : n), a.beginPath(), fabric.util.drawDashedLine(a, e, b, e + h, b, this.selectionDashArray), fabric.util.drawDashedLine(a, e, b + n - 1, e + h, b + n - 1, this.selectionDashArray), fabric.util.drawDashedLine(a, e, b, e, b + n, this.selectionDashArray), fabric.util.drawDashedLine(a, e + h - 1, b, e + h - 1, b + n, this.selectionDashArray), a.closePath(), a.stroke()) :
                a.strokeRect(b.ex + .5 - (0 < e ? 0 : h), b.ey + .5 - (0 < d ? 0 : n), h, n)
        },
        _isLastRenderedObject: function(a) {
            return this.controlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay.visible && this.containsPoint(a, this.lastRenderedObjectWithControlsAboveOverlay) && this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(this.getPointer(a, !0))
        },
        findTarget: function(a, c) {
            if (!this.skipTargetFind) {
                if (this._isLastRenderedObject(a)) return this.lastRenderedObjectWithControlsAboveOverlay;
                var b = this.getActiveGroup();
                if (b && !c && this.containsPoint(a, b)) return b;
                b = this._searchPossibleTargets(a, c);
                this._fireOverOutEvents(b, a);
                return b
            }
        },
        _fireOverOutEvents: function(a, c) {
            a ? this._hoveredTarget !== a && (this._hoveredTarget && (this.fire("mouse:out", {
                target: this._hoveredTarget,
                e: c
            }), this._hoveredTarget.fire("mouseout")), this.fire("mouse:over", {
                target: a,
                e: c
            }), a.fire("mouseover"), this._hoveredTarget = a) : this._hoveredTarget && (this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: c
                }), this._hoveredTarget.fire("mouseout"),
                this._hoveredTarget = null)
        },
        _checkTarget: function(a, c, b) {
            if (c && c.visible && c.evented && this.containsPoint(a, c) && (!this.perPixelTargetFind && !c.perPixelTargetFind || c.isEditing || !this.isTargetTransparent(c, b.x, b.y))) return !0
        },
        _searchPossibleTargets: function(a, c) {
            for (var b, e = this.getPointer(a, !0), d = this._objects.length; d--;)
                if ((!this._objects[d].group || c) && this._checkTarget(a, this._objects[d], e)) {
                    this.relatedTarget = this._objects[d];
                    b = this._objects[d];
                    break
                }
            return b
        },
        getPointer: function(a, c, b) {
            b || (b = this.upperCanvasEl);
            a = d(a);
            var e = b.getBoundingClientRect(),
                h = e.width || 0,
                n = e.height || 0;
            h && n || ("top" in e && "bottom" in e && (n = Math.abs(e.top - e.bottom)), "right" in e && "left" in e && (h = Math.abs(e.right - e.left)));
            this.calcOffset();
            a.x -= this._offset.left;
            a.y -= this._offset.top;
            c || (a = fabric.util.transformPoint(a, fabric.util.invertTransform(this.viewportTransform)));
            0 === h || 0 === n ? b = c = 1 : (c = b.width / h, b = b.height / n);
            return {
                x: a.x * c,
                y: a.y * b
            }
        },
        _createUpperCanvas: function() {
            var a = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            this.upperCanvasEl = this._createCanvasElement();
            fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + a);
            this.wrapperEl.appendChild(this.upperCanvasEl);
            this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl);
            this._applyCanvasStyle(this.upperCanvasEl);
            this.contextTop = this.upperCanvasEl.getContext("2d")
        },
        _createCacheCanvas: function() {
            this.cacheCanvasEl = this._createCanvasElement();
            this.cacheCanvasEl.setAttribute("width", this.width);
            this.cacheCanvasEl.setAttribute("height", this.height);
            this.contextCache =
                this.cacheCanvasEl.getContext("2d")
        },
        _initWrapperElement: function() {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                "class": this.containerClass
            });
            fabric.util.setStyle(this.wrapperEl, {
                width: this.getWidth() + "px",
                height: this.getHeight() + "px",
                position: "relative"
            });
            fabric.util.makeElementUnselectable(this.wrapperEl)
        },
        _applyCanvasStyle: function(a) {
            var c = this.getWidth() || a.width,
                b = this.getHeight() || a.height;
            fabric.util.setStyle(a, {
                position: "absolute",
                width: c + "px",
                height: b + "px",
                left: 0,
                top: 0
            });
            a.width = c;
            a.height = b;
            fabric.util.makeElementUnselectable(a)
        },
        _copyCanvasStyle: function(a, c) {
            c.style.cssText = a.style.cssText
        },
        getSelectionContext: function() {
            return this.contextTop
        },
        getSelectionElement: function() {
            return this.upperCanvasEl
        },
        _setActiveObject: function(a) {
            this._activeObject && this._activeObject.set("active", !1);
            this._activeObject = a;
            a.set("active", !0)
        },
        setActiveObject: function(a, c) {
            this._setActiveObject(a);
            this.renderAll();
            this.fire("object:selected", {
                target: a,
                e: c
            });
            a.fire("selected", {
                e: c
            });
            return this
        },
        getActiveObject: function() {
            return this._activeObject
        },
        _discardActiveObject: function() {
            this._activeObject && this._activeObject.set("active", !1);
            this._activeObject = null
        },
        discardActiveObject: function(a) {
            this._discardActiveObject();
            this.renderAll();
            this.fire("selection:cleared", {
                e: a
            });
            return this
        },
        _setActiveGroup: function(a) {
            (this._activeGroup = a) && a.set("active", !0)
        },
        setActiveGroup: function(a, c) {
            this._setActiveGroup(a);
            a && (this.fire("object:selected", {
                target: a,
                e: c
            }), a.fire("selected", {
                e: c
            }));
            return this
        },
        getActiveGroup: function() {
            return this._activeGroup
        },
        _discardActiveGroup: function() {
            var a = this.getActiveGroup();
            a && a.destroy();
            this.setActiveGroup(null)
        },
        discardActiveGroup: function(a) {
            this._discardActiveGroup();
            this.fire("selection:cleared", {
                e: a
            });
            return this
        },
        deactivateAll: function() {
            for (var a = this.getObjects(), c = 0, b = a.length; c < b; c++) a[c].set("active", !1);
            this._discardActiveGroup();
            this._discardActiveObject();
            return this
        },
        deactivateAllWithDispatch: function(a) {
            var c = this.getActiveGroup() ||
                this.getActiveObject();
            c && this.fire("before:selection:cleared", {
                target: c,
                e: a
            });
            this.deactivateAll();
            c && this.fire("selection:cleared", {
                e: a
            });
            return this
        },
        drawControls: function(a) {
            var c = this.getActiveGroup();
            c ? this._drawGroupControls(a, c) : this._drawObjectsControls(a)
        },
        _drawGroupControls: function(a, c) {
            c._renderControls(a)
        },
        _drawObjectsControls: function(a) {
            for (var c = 0, b = this._objects.length; c < b; ++c) this._objects[c] && this._objects[c].active && (this._objects[c]._renderControls(a), this.lastRenderedObjectWithControlsAboveOverlay =
                this._objects[c])
        }
    });
    for (var h in fabric.StaticCanvas) "prototype" !== h && (fabric.Canvas[h] = fabric.StaticCanvas[h]);
    fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function() {});
    fabric.Element = fabric.Canvas
})();
(function() {
    var d = {
            mt: 0,
            tr: 1,
            mr: 2,
            br: 3,
            mb: 4,
            bl: 5,
            ml: 6,
            tl: 7
        },
        b = fabric.util.addListener,
        e = fabric.util.removeListener;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: "n-resize ne-resize e-resize se-resize s-resize sw-resize w-resize nw-resize".split(" "),
        _initEventListeners: function() {
            this._bindEvents();
            b(fabric.window, "resize", this._onResize);
            b(this.upperCanvasEl, "mousedown", this._onMouseDown);
            b(this.upperCanvasEl, "mousemove", this._onMouseMove);
            b(this.upperCanvasEl, "mousewheel", this._onMouseWheel);
            b(this.upperCanvasEl, "touchstart", this._onMouseDown);
            b(this.upperCanvasEl, "touchmove", this._onMouseMove);
            "undefined" !== typeof eventjs && "add" in eventjs && (eventjs.add(this.upperCanvasEl, "gesture", this._onGesture), eventjs.add(this.upperCanvasEl, "drag", this._onDrag), eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.add(this.upperCanvasEl, "shake", this._onShake), eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress))
        },
        _bindEvents: function() {
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onResize = this._onResize.bind(this);
            this._onGesture = this._onGesture.bind(this);
            this._onDrag = this._onDrag.bind(this);
            this._onShake = this._onShake.bind(this);
            this._onLongPress = this._onLongPress.bind(this);
            this._onOrientationChange = this._onOrientationChange.bind(this);
            this._onMouseWheel = this._onMouseWheel.bind(this)
        },
        removeListeners: function() {
            e(fabric.window, "resize", this._onResize);
            e(this.upperCanvasEl, "mousedown",
                this._onMouseDown);
            e(this.upperCanvasEl, "mousemove", this._onMouseMove);
            e(this.upperCanvasEl, "mousewheel", this._onMouseWheel);
            e(this.upperCanvasEl, "touchstart", this._onMouseDown);
            e(this.upperCanvasEl, "touchmove", this._onMouseMove);
            "undefined" !== typeof eventjs && "remove" in eventjs && (eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture), eventjs.remove(this.upperCanvasEl, "drag", this._onDrag), eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.remove(this.upperCanvasEl,
                "shake", this._onShake), eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress))
        },
        _onGesture: function(a, c) {
            this.__onTransformGesture && this.__onTransformGesture(a, c)
        },
        _onDrag: function(a, c) {
            this.__onDrag && this.__onDrag(a, c)
        },
        _onMouseWheel: function(a, c) {
            this.__onMouseWheel && this.__onMouseWheel(a, c)
        },
        _onOrientationChange: function(a, c) {
            this.__onOrientationChange && this.__onOrientationChange(a, c)
        },
        _onShake: function(a, c) {
            this.__onShake && this.__onShake(a, c)
        },
        _onLongPress: function(a, c) {
            this.__onLongPress &&
                this.__onLongPress(a, c)
        },
        _onMouseDown: function(a) {
            this.__onMouseDown(a);
            b(fabric.document, "touchend", this._onMouseUp);
            b(fabric.document, "touchmove", this._onMouseMove);
            e(this.upperCanvasEl, "mousemove", this._onMouseMove);
            e(this.upperCanvasEl, "touchmove", this._onMouseMove);
            "touchstart" === a.type ? e(this.upperCanvasEl, "mousedown", this._onMouseDown) : (b(fabric.document, "mouseup", this._onMouseUp), b(fabric.document, "mousemove", this._onMouseMove))
        },
        _onMouseUp: function(a) {
            this.__onMouseUp(a);
            e(fabric.document,
                "mouseup", this._onMouseUp);
            e(fabric.document, "touchend", this._onMouseUp);
            e(fabric.document, "mousemove", this._onMouseMove);
            e(fabric.document, "touchmove", this._onMouseMove);
            b(this.upperCanvasEl, "mousemove", this._onMouseMove);
            b(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if ("touchend" === a.type) {
                var c = this;
                setTimeout(function() {
                    b(c.upperCanvasEl, "mousedown", c._onMouseDown)
                }, 400)
            }
        },
        _onMouseMove: function(a) {
            !this.allowTouchScrolling && a.preventDefault && a.preventDefault();
            this.__onMouseMove(a)
        },
        _onResize: function() {
            this.calcOffset()
        },
        _shouldRender: function(a, c) {
            var b = this.getActiveGroup() || this.getActiveObject();
            return !!(a && (a.isMoving || a !== b) || !a && b || !a && !b && !this._groupSelector || c && this._previousPointer && this.selection && (c.x !== this._previousPointer.x || c.y !== this._previousPointer.y))
        },
        __onMouseUp: function(a) {
            var c;
            if (this.isDrawingMode && this._isCurrentlyDrawing) this._onMouseUpInDrawingMode(a);
            else {
                this._currentTransform ? (this._finalizeCurrentTransform(), c = this._currentTransform.target) : c = this.findTarget(a, !0);
                var b = this._shouldRender(c,
                    this.getPointer(a));
                this._maybeGroupObjects(a);
                c && (c.isMoving = !1);
                b && this.renderAll();
                this._handleCursorAndEvent(a, c)
            }
        },
        _handleCursorAndEvent: function(a, c) {
            this._setCursorFromEvent(a, c);
            var b = this;
            setTimeout(function() {
                b._setCursorFromEvent(a, c)
            }, 50);
            this.fire("mouse:up", {
                target: c,
                e: a
            });
            c && c.fire("mouseup", {
                e: a
            })
        },
        _finalizeCurrentTransform: function() {
            var a = this._currentTransform.target;
            a._scaling && (a._scaling = !1);
            a.setCoords();
            this.stateful && a.hasStateChanged() && (this.fire("object:modified", {
                    target: a
                }),
                a.fire("modified"));
            this._restoreOriginXY(a)
        },
        _restoreOriginXY: function(a) {
            if (this._previousOriginX && this._previousOriginY) {
                var c = a.translateToOriginPoint(a.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                a.originX = this._previousOriginX;
                a.originY = this._previousOriginY;
                a.left = c.x;
                a.top = c.y;
                this._previousOriginY = this._previousOriginX = null
            }
        },
        _onMouseDownInDrawingMode: function(a) {
            this._isCurrentlyDrawing = !0;
            this.discardActiveObject(a).renderAll();
            this.clipTo && fabric.util.clipContext(this,
                this.contextTop);
            var c = fabric.util.invertTransform(this.viewportTransform),
                c = fabric.util.transformPoint(this.getPointer(a, !0), c);
            this.freeDrawingBrush.onMouseDown(c);
            this.fire("mouse:down", {
                e: a
            });
            c = this.findTarget(a);
            "undefined" !== typeof c && c.fire("mousedown", {
                e: a,
                target: c
            })
        },
        _onMouseMoveInDrawingMode: function(a) {
            if (this._isCurrentlyDrawing) {
                var c = fabric.util.invertTransform(this.viewportTransform),
                    c = fabric.util.transformPoint(this.getPointer(a, !0), c);
                this.freeDrawingBrush.onMouseMove(c)
            }
            this.setCursor(this.freeDrawingCursor);
            this.fire("mouse:move", {
                e: a
            });
            c = this.findTarget(a);
            "undefined" !== typeof c && c.fire("mousemove", {
                e: a,
                target: c
            })
        },
        _onMouseUpInDrawingMode: function(a) {
            this._isCurrentlyDrawing = !1;
            this.clipTo && this.contextTop.restore();
            this.freeDrawingBrush.onMouseUp();
            this.fire("mouse:up", {
                e: a
            });
            var c = this.findTarget(a);
            "undefined" !== typeof c && c.fire("mouseup", {
                e: a,
                target: c
            })
        },
        __onMouseDown: function(a) {
            if (("which" in a ? 1 === a.which : 1 === a.button) || fabric.isTouchSupported)
                if (this.isDrawingMode) this._onMouseDownInDrawingMode(a);
                else if (!this._currentTransform) {
                var c = this.findTarget(a),
                    b = this.getPointer(a, !0);
                this._previousPointer = b;
                var e = this._shouldRender(c, b),
                    f = this._shouldGroup(a, c);
                this._shouldClearSelection(a, c) ? this._clearSelection(a, c, b) : f && (this._handleGrouping(a, c), c = this.getActiveGroup());
                c && c.selectable && !f && (this._beforeTransform(a, c), this._setupCurrentTransform(a, c));
                e && this.renderAll();
                this.fire("mouse:down", {
                    target: c,
                    e: a
                });
                c && c.fire("mousedown", {
                    e: a
                })
            }
        },
        _beforeTransform: function(a, c) {
            this.stateful && c.saveState();
            if (c._findTargetCorner(this.getPointer(a))) this.onBeforeScaleRotate(c);
            c !== this.getActiveGroup() && c !== this.getActiveObject() && (this.deactivateAll(), this.setActiveObject(c, a))
        },
        _clearSelection: function(a, c, b) {
            this.deactivateAllWithDispatch(a);
            c && c.selectable ? this.setActiveObject(c, a) : this.selection && (this._groupSelector = {
                ex: b.x,
                ey: b.y,
                top: 0,
                left: 0
            })
        },
        _setOriginToCenter: function(a) {
            this._previousOriginX = this._currentTransform.target.originX;
            this._previousOriginY = this._currentTransform.target.originY;
            var c = a.getCenterPoint();
            a.originX = "center";
            a.originY = "center";
            a.left = c.x;
            a.top = c.y;
            this._currentTransform.left = a.left;
            this._currentTransform.top = a.top
        },
        _setCenterToOrigin: function(a) {
            var c = a.translateToOriginPoint(a.getCenterPoint(), this._previousOriginX, this._previousOriginY);
            a.originX = this._previousOriginX;
            a.originY = this._previousOriginY;
            a.left = c.x;
            a.top = c.y;
            this._previousOriginY = this._previousOriginX = null
        },
        __onMouseMove: function(a) {
            var c, b;
            if (this.isDrawingMode) this._onMouseMoveInDrawingMode(a);
            else if (!("undefined" !== typeof a.touches && 1 < a.touches.length)) {
                var e = this._groupSelector;
                e ? (b = this.getPointer(a, !0), e.left = b.x - e.ex, e.top = b.y - e.ey, this.renderTop()) : this._currentTransform ? this._transformObject(a) : (c = this.findTarget(a), !c || c && !c.selectable ? this.setCursor(this.defaultCursor) : this._setCursorFromEvent(a, c));
                this.fire("mouse:move", {
                    target: c,
                    e: a
                });
                c && c.fire("mousemove", {
                    e: a
                })
            }
        },
        _transformObject: function(a) {
            var c = this.getPointer(a),
                b = this._currentTransform;
            b.reset = !1;
            b.target.isMoving = !0;
            this._beforeScaleTransform(a, b);
            this._performTransformAction(a, b, c);
            this.renderAll()
        },
        _performTransformAction: function(a, c, b) {
            var e = b.x;
            b = b.y;
            var f = c.target,
                d = c.action;
            "rotate" === d ? (this._rotateObject(e, b), this._fire("rotating", f, a)) : "scale" === d ? (this._onScale(a, c, e, b), this._fire("scaling", f, a)) : "scaleX" === d ? (this._scaleObject(e, b, "x"), this._fire("scaling", f, a)) : "scaleY" === d ? (this._scaleObject(e, b, "y"), this._fire("scaling", f, a)) : (this._translateObject(e, b), this._fire("moving", f, a), this.setCursor(this.moveCursor))
        },
        _fire: function(a, c, b) {
            this.fire("object:" + a, {
                target: c,
                e: b
            });
            c.fire(a, {
                e: b
            })
        },
        _beforeScaleTransform: function(a, c) {
            if ("scale" === c.action || "scaleX" === c.action || "scaleY" === c.action) {
                var b = this._shouldCenterTransform(a, c.target);
                if (b && ("center" !== c.originX || "center" !== c.originY) || !b && "center" === c.originX && "center" === c.originY) this._resetCurrentTransform(a), c.reset = !0
            }
        },
        _onScale: function(a, c, b, e) {
            !a.shiftKey && !this.uniScaleTransform || c.target.get("lockUniScaling") ? (c.reset || "scale" !== c.currentAction || this._resetCurrentTransform(a,
                c.target), c.currentAction = "scaleEqually", this._scaleObject(b, e, "equally")) : (c.currentAction = "scale", this._scaleObject(b, e))
        },
        _setCursorFromEvent: function(a, c) {
            if (c && c.selectable) {
                var b = this.getActiveGroup();
                (b = c._findTargetCorner && (!b || !b.contains(c)) && c._findTargetCorner(this.getPointer(a, !0))) ? this._setCornerCursor(b, c): this.setCursor(c.hoverCursor || this.hoverCursor)
            } else return this.setCursor(this.defaultCursor), !1;
            return !0
        },
        _setCornerCursor: function(a, c) {
            if (a in d) this.setCursor(this._getRotatedCornerCursor(a,
                c));
            else if ("mtr" === a && c.hasRotatingPoint) this.setCursor(this.rotationCursor);
            else return this.setCursor(this.defaultCursor), !1
        },
        _getRotatedCornerCursor: function(a, c) {
            var b = Math.round(c.getAngle() % 360 / 45);
            0 > b && (b += 8);
            b += d[a];
            return this.cursorMap[b % 8]
        }
    })
})();
(function() {
    var d = Math.min,
        b = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function(b, a) {
            var c = this.getActiveObject();
            return b.shiftKey && (this.getActiveGroup() || c && c !== a) && this.selection
        },
        _handleGrouping: function(b, a) {
            if (a === this.getActiveGroup() && (a = this.findTarget(b, !0), !a || a.isType("group"))) return;
            this.getActiveGroup() ? this._updateActiveGroup(a, b) : this._createActiveGroup(a, b);
            this._activeGroup && this._activeGroup.saveCoords()
        },
        _updateActiveGroup: function(b, a) {
            var c = this.getActiveGroup();
            if (c.contains(b)) {
                if (c.removeWithUpdate(b), this._resetObjectTransform(c), b.set("active", !1), 1 === c.size()) {
                    this.discardActiveGroup(a);
                    this.setActiveObject(c.item(0));
                    return
                }
            } else c.addWithUpdate(b), this._resetObjectTransform(c);
            this.fire("selection:created", {
                target: c,
                e: a
            });
            c.set("active", !0)
        },
        _createActiveGroup: function(b, a) {
            if (this._activeObject && b !== this._activeObject) {
                var c = this._createGroup(b);
                c.addWithUpdate();
                this.setActiveGroup(c);
                this._activeObject = null;
                this.fire("selection:created", {
                    target: c,
                    e: a
                })
            }
            b.set("active", !0)
        },
        _createGroup: function(b) {
            var a = this.getObjects();
            b = a.indexOf(this._activeObject) < a.indexOf(b) ? [this._activeObject, b] : [b, this._activeObject];
            return new fabric.Group(b, {
                canvas: this
            })
        },
        _groupSelectedObjects: function(b) {
            var a = this._collectObjects();
            1 === a.length ? this.setActiveObject(a[0], b) : 1 < a.length && (a = new fabric.Group(a.reverse(), {
                canvas: this
            }), a.addWithUpdate(), this.setActiveGroup(a, b), a.saveCoords(), this.fire("selection:created", {
                target: a
            }), this.renderAll())
        },
        _collectObjects: function() {
            var e = [],
                a;
            a = this._groupSelector.ex;
            for (var c = this._groupSelector.ey, h = a + this._groupSelector.left, g = c + this._groupSelector.top, f = new fabric.Point(d(a, h), d(c, g)), k = new fabric.Point(b(a, h), b(c, g)), c = a === h && c === g, h = this._objects.length; h-- && !((a = this._objects[h]) && a.selectable && a.visible && (a.intersectsWithRect(f, k) || a.isContainedWithinRect(f, k) || a.containsPoint(f) || a.containsPoint(k)) && (a.set("active", !0), e.push(a), c)););
            return e
        },
        _maybeGroupObjects: function(b) {
            this.selection && this._groupSelector && this._groupSelectedObjects(b);
            if (b = this.getActiveGroup()) b.setObjectsCoords().setCoords(), b.isMoving = !1, this.setCursor(this.defaultCursor);
            this._currentTransform = this._groupSelector = null
        }
    })
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    toDataURL: function(d) {
        d || (d = {});
        var b = d.format || "png",
            e = d.quality || 1,
            a = d.multiplier || 1;
        d = {
            left: d.left,
            top: d.top,
            width: d.width,
            height: d.height
        };
        return 1 !== a ? this.__toDataURLWithMultiplier(b, e, d, a) : this.__toDataURL(b, e, d)
    },
    __toDataURL: function(d, b, e) {
        this.renderAll(!0);
        var a = this.upperCanvasEl || this.lowerCanvasEl;
        e = this.__getCroppedCanvas(a, e);
        "jpg" === d && (d = "jpeg");
        d = fabric.StaticCanvas.supports("toDataURLWithQuality") ? (e || a).toDataURL("image/" +
            d, b) : (e || a).toDataURL("image/" + d);
        this.contextTop && this.clearContext(this.contextTop);
        this.renderAll();
        return d
    },
    __getCroppedCanvas: function(d, b) {
        var e, a;
        if ("left" in b || "top" in b || "width" in b || "height" in b) e = fabric.util.createCanvasElement(), a = e.getContext("2d"), e.width = b.width || this.width, e.height = b.height || this.height, a.drawImage(d, -b.left || 0, -b.top || 0);
        return e
    },
    __toDataURLWithMultiplier: function(d, b, e, a) {
        var c = this.getWidth(),
            h = this.getHeight(),
            g = c * a,
            f = h * a,
            k = this.getActiveObject(),
            l = this.getActiveGroup(),
            m = this.contextTop || this.contextContainer;
        1 < a && this.setWidth(g).setHeight(f);
        m.scale(a, a);
        e.left && (e.left *= a);
        e.top && (e.top *= a);
        e.width ? e.width *= a : 1 > a && (e.width = g);
        e.height ? e.height *= a : 1 > a && (e.height = f);
        l ? this._tempRemoveBordersControlsFromGroup(l) : k && this.deactivateAll && this.deactivateAll();
        this.renderAll(!0);
        d = this.__toDataURL(d, b, e);
        this.width = c;
        this.height = h;
        m.scale(1 / a, 1 / a);
        this.setWidth(c).setHeight(h);
        l ? this._restoreBordersControlsOnGroup(l) : k && this.setActiveObject && this.setActiveObject(k);
        this.contextTop && this.clearContext(this.contextTop);
        this.renderAll();
        return d
    },
    toDataURLWithMultiplier: function(d, b, e) {
        return this.toDataURL({
            format: d,
            multiplier: b,
            quality: e
        })
    },
    _tempRemoveBordersControlsFromGroup: function(d) {
        d.origHasControls = d.hasControls;
        d.origBorderColor = d.borderColor;
        d.hasControls = !0;
        d.borderColor = "rgba(0,0,0,0)";
        d.forEachObject(function(b) {
            b.origBorderColor = b.borderColor;
            b.borderColor = "rgba(0,0,0,0)"
        })
    },
    _restoreBordersControlsOnGroup: function(d) {
        d.hideControls = d.origHideControls;
        d.borderColor = d.origBorderColor;
        d.forEachObject(function(b) {
            b.borderColor = b.origBorderColor;
            delete b.origBorderColor
        })
    }
});
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function(d, b, e) {
        return this.loadFromJSON(d, b, e)
    },
    loadFromJSON: function(d, b, e) {
        if (d) {
            var a = "string" === typeof d ? JSON.parse(d) : d;
            this.clear();
            var c = this;
            this._enlivenObjects(a.objects, function() {
                c._setBgOverlay(a, b)
            }, e);
            return this
        }
    },
    _setBgOverlay: function(d, b) {
        var e = this,
            a = {
                backgroundColor: !1,
                overlayColor: !1,
                backgroundImage: !1,
                overlayImage: !1
            };
        if (d.backgroundImage || d.overlayImage || d.background || d.overlay) {
            var c = function() {
                a.backgroundImage &&
                    a.overlayImage && a.backgroundColor && a.overlayColor && (e.renderAll(), b && b())
            };
            this.__setBgOverlay("backgroundImage", d.backgroundImage, a, c);
            this.__setBgOverlay("overlayImage", d.overlayImage, a, c);
            this.__setBgOverlay("backgroundColor", d.background, a, c);
            this.__setBgOverlay("overlayColor", d.overlay, a, c);
            c()
        } else b && b()
    },
    __setBgOverlay: function(d, b, e, a) {
        var c = this;
        if (b)
            if ("backgroundImage" === d || "overlayImage" === d) fabric.Image.fromObject(b, function(b) {
                c[d] = b;
                e[d] = !0;
                a && a()
            });
            else this["set" + fabric.util.string.capitalize(d, !0)](b, function() {
                e[d] = !0;
                a && a()
            });
        else e[d] = !0
    },
    _enlivenObjects: function(d, b, e) {
        var a = this;
        if (d && 0 !== d.length) {
            var c = this.renderOnAddRemove;
            this.renderOnAddRemove = !1;
            fabric.util.enlivenObjects(d, function(e) {
                e.forEach(function(c, b) {
                    a.insertAt(c, b, !0)
                });
                a.renderOnAddRemove = c;
                b && b()
            }, null, e)
        } else b && b()
    },
    _toDataURL: function(d, b) {
        this.clone(function(e) {
            b(e.toDataURL(d))
        })
    },
    _toDataURLWithMultiplier: function(d, b, e) {
        this.clone(function(a) {
            e(a.toDataURLWithMultiplier(d, b))
        })
    },
    clone: function(d, b) {
        var e = JSON.stringify(this.toJSON(b));
        this.cloneWithoutData(function(a) {
            a.loadFromJSON(e, function() {
                d && d(a)
            })
        })
    },
    cloneWithoutData: function(d) {
        var b = fabric.document.createElement("canvas");
        b.width = this.getWidth();
        b.height = this.getHeight();
        var e = new fabric.Canvas(b);
        e.clipTo = this.clipTo;
        this.backgroundImage ? (e.setBackgroundImage(this.backgroundImage.src, function() {
            e.renderAll();
            d && d(e)
        }), e.backgroundImageOpacity = this.backgroundImageOpacity, e.backgroundImageStretch = this.backgroundImageStretch) : d && d(e)
    }
});
(function(d) {
    var b = d.fabric || (d.fabric = {});
    d = b.util.object.extend;
    var e = b.util.toFixed,
        a = b.util.string.capitalize,
        c = b.util.degreesToRadians,
        h = b.StaticCanvas.supports("setLineDash");
    b.Object || (b.Object = b.util.createClass({
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: !1,
        flipY: !1,
        opacity: 1,
        angle: 0,
        cornerSize: 12,
        transparentCorners: !0,
        hoverCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        cornerColor: "rgba(102,153,255,0.5)",
        centeredScaling: !1,
        centeredRotation: !0,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 10,
        shadow: null,
        borderOpacityWhenMoving: .4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: .01,
        selectable: !0,
        evented: !0,
        visible: !0,
        hasControls: !0,
        hasBorders: !0,
        hasRotatingPoint: !0,
        rotatingPointOffset: 40,
        perPixelTargetFind: !1,
        includeDefaultValues: !0,
        clipTo: null,
        lockMovementX: !1,
        lockMovementY: !1,
        lockRotation: !1,
        lockScalingX: !1,
        lockScalingY: !1,
        lockUniScaling: !1,
        lockScalingFlip: !1,
        stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColorcrossOrigin alignX alignY meetOrSlice".split(" "),
        initialize: function(a) {
            a && this.setOptions(a)
        },
        _initGradient: function(a) {
            !a.fill ||
                !a.fill.colorStops || a.fill instanceof b.Gradient || this.set("fill", new b.Gradient(a.fill));
            !a.stroke || !a.stroke.colorStops || a.stroke instanceof b.Gradient || this.set("stroke", new b.Gradient(a.stroke))
        },
        _initPattern: function(a) {
            !a.fill || !a.fill.source || a.fill instanceof b.Pattern || this.set("fill", new b.Pattern(a.fill));
            !a.stroke || !a.stroke.source || a.stroke instanceof b.Pattern || this.set("stroke", new b.Pattern(a.stroke))
        },
        _initClipping: function(a) {
            a.clipTo && "string" === typeof a.clipTo && (a = b.util.getFunctionBody(a.clipTo),
                "undefined" !== typeof a && (this.clipTo = new Function("ctx", a)))
        },
        setOptions: function(a) {
            for (var c in a) this.set(c, a[c]);
            this._initGradient(a);
            this._initPattern(a);
            this._initClipping(a)
        },
        transform: function(a, b) {
            this.group && this.canvas.preserveObjectStacking && this.group === this.canvas._activeGroup && this.group.transform(a);
            var e = b ? this._getLeftTopCoords() : this.getCenterPoint();
            a.translate(e.x, e.y);
            a.rotate(c(this.angle));
            a.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1))
        },
        toObject: function(a) {
            var c =
                b.Object.NUM_FRACTION_DIGITS,
                c = {
                    type: this.type,
                    originX: this.originX,
                    originY: this.originY,
                    left: e(this.left, c),
                    top: e(this.top, c),
                    width: e(this.width, c),
                    height: e(this.height, c),
                    fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                    stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                    strokeWidth: e(this.strokeWidth, c),
                    strokeDashArray: this.strokeDashArray,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeMiterLimit: e(this.strokeMiterLimit, c),
                    scaleX: e(this.scaleX,
                        c),
                    scaleY: e(this.scaleY, c),
                    angle: e(this.getAngle(), c),
                    flipX: this.flipX,
                    flipY: this.flipY,
                    opacity: e(this.opacity, c),
                    shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                    visible: this.visible,
                    clipTo: this.clipTo && String(this.clipTo),
                    backgroundColor: this.backgroundColor,
                    fillRule: this.fillRule,
                    globalCompositeOperation: this.globalCompositeOperation
                };
            this.includeDefaultValues || (c = this._removeDefaultValues(c));
            b.util.populateWithProperties(this, c, a);
            return c
        },
        toDatalessObject: function(a) {
            return this.toObject(a)
        },
        _removeDefaultValues: function(a) {
            var c = b.util.getKlass(a.type).prototype;
            c.stateProperties.forEach(function(b) {
                a[b] === c[b] && delete a[b]
            });
            return a
        },
        toString: function() {
            return "#<fabric." + a(this.type) + ">"
        },
        get: function(a) {
            return this[a]
        },
        _setObject: function(a) {
            for (var c in a) this._set(c, a[c])
        },
        set: function(a, c) {
            "object" === typeof a ? this._setObject(a) : "function" === typeof c && "clipTo" !== a ? this._set(a, c(this.get(a))) : this._set(a, c);
            return this
        },
        _set: function(a, c) {
            if ("scaleX" === a || "scaleY" === a) c = this._constrainScale(c);
            "scaleX" === a && 0 > c ? (this.flipX = !this.flipX, c *= -1) : "scaleY" === a && 0 > c ? (this.flipY = !this.flipY, c *= -1) : "width" === a || "height" === a ? this.minScaleLimit = e(Math.min(.1, 1 / Math.max(this.width, this.height)), 2) : "shadow" !== a || !c || c instanceof b.Shadow || (c = new b.Shadow(c));
            this[a] = c;
            return this
        },
        setOnGroup: function() {},
        toggle: function(a) {
            var c = this.get(a);
            "boolean" === typeof c && this.set(a, !c);
            return this
        },
        setSourcePath: function(a) {
            this.sourcePath = a;
            return this
        },
        getViewportTransform: function() {
            return this.canvas && this.canvas.viewportTransform ?
                this.canvas.viewportTransform : [1, 0, 0, 1, 0, 0]
        },
        render: function(a, c) {
            0 === this.width && 0 === this.height || !this.visible || (a.save(), this._setupCompositeOperation(a), c || this.transform(a), this._setStrokeStyles(a), this._setFillStyles(a), this.transformMatrix && a.transform.apply(a, this.transformMatrix), this._setOpacity(a), this._setShadow(a), this.clipTo && b.util.clipContext(this, a), this._render(a, c), this.clipTo && a.restore(), a.restore())
        },
        _setOpacity: function(a) {
            this.group && this.group._setOpacity(a);
            a.globalAlpha *=
                this.opacity
        },
        _setStrokeStyles: function(a) {
            this.stroke && (a.lineWidth = this.strokeWidth, a.lineCap = this.strokeLineCap, a.lineJoin = this.strokeLineJoin, a.miterLimit = this.strokeMiterLimit, a.strokeStyle = this.stroke.toLive ? this.stroke.toLive(a, this) : this.stroke)
        },
        _setFillStyles: function(a) {
            this.fill && (a.fillStyle = this.fill.toLive ? this.fill.toLive(a, this) : this.fill)
        },
        _renderControls: function(a, e) {
            if (this.active && !e) {
                var d = this.getViewportTransform();
                a.save();
                var h;
                this.group && (h = b.util.transformPoint(this.group.getCenterPoint(),
                    d), a.translate(h.x, h.y), a.rotate(c(this.group.angle)));
                h = b.util.transformPoint(this.getCenterPoint(), d, null != this.group);
                this.group && (h.x *= this.group.scaleX, h.y *= this.group.scaleY);
                a.translate(h.x, h.y);
                a.rotate(c(this.angle));
                this.drawBorders(a);
                this.drawControls(a);
                a.restore()
            }
        },
        _setShadow: function(a) {
            if (this.shadow) {
                var c = this.canvas && this.canvas.viewportTransform[0] || 1,
                    b = this.canvas && this.canvas.viewportTransform[3] || 1;
                a.shadowColor = this.shadow.color;
                a.shadowBlur = this.shadow.blur * (c + b) * (this.scaleX +
                    this.scaleY) / 4;
                a.shadowOffsetX = this.shadow.offsetX * c * this.scaleX;
                a.shadowOffsetY = this.shadow.offsetY * b * this.scaleY
            }
        },
        _removeShadow: function(a) {
            this.shadow && (a.shadowColor = "", a.shadowBlur = a.shadowOffsetX = a.shadowOffsetY = 0)
        },
        _renderFill: function(a) {
            this.fill && (a.save(), this.fill.gradientTransform && a.transform.apply(a, this.fill.gradientTransform), this.fill.toLive && a.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0), "evenodd" === this.fillRule ? a.fill("evenodd") : a.fill(),
                a.restore())
        },
        _renderStroke: function(a) {
            this.stroke && 0 !== this.strokeWidth && (this.shadow && !this.shadow.affectStroke && this._removeShadow(a), a.save(), this.strokeDashArray ? (1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), h ? (a.setLineDash(this.strokeDashArray), this._stroke && this._stroke(a)) : this._renderDashedStroke && this._renderDashedStroke(a), a.stroke()) : (this.stroke.gradientTransform && a.transform.apply(a, this.stroke.gradientTransform), this._stroke ?
                this._stroke(a) : a.stroke()), a.restore())
        },
        clone: function(a, c) {
            return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(c), a) : new b.Object(this.toObject(c))
        },
        cloneAsImage: function(a) {
            var c = this.toDataURL();
            b.util.loadImage(c, function(c) {
                a && a(new b.Image(c))
            });
            return this
        },
        toDataURL: function(a) {
            a || (a = {});
            var c = b.util.createCanvasElement(),
                e = this.getBoundingRect();
            c.width = e.width;
            c.height = e.height;
            b.util.wrapElement(c, "div");
            e = new b.StaticCanvas(c);
            "jpg" === a.format && (a.format = "jpeg");
            "jpeg" === a.format && (e.backgroundColor = "#fff");
            var d = {
                active: this.get("active"),
                left: this.getLeft(),
                top: this.getTop()
            };
            this.set("active", !1);
            this.setPositionByOrigin(new b.Point(c.width / 2, c.height / 2), "center", "center");
            c = this.canvas;
            e.add(this);
            a = e.toDataURL(a);
            this.set(d).setCoords();
            this.canvas = c;
            e.dispose();
            return a
        },
        isType: function(a) {
            return this.type === a
        },
        complexity: function() {
            return 0
        },
        toJSON: function(a) {
            return this.toObject(a)
        },
        setGradient: function(a, c) {
            c || (c = {});
            var e = {
                colorStops: []
            };
            e.type =
                c.type || (c.r1 || c.r2 ? "radial" : "linear");
            e.coords = {
                x1: c.x1,
                y1: c.y1,
                x2: c.x2,
                y2: c.y2
            };
            if (c.r1 || c.r2) e.coords.r1 = c.r1, e.coords.r2 = c.r2;
            for (var d in c.colorStops) {
                var h = new b.Color(c.colorStops[d]);
                e.colorStops.push({
                    offset: d,
                    color: h.toRgb(),
                    opacity: h.getAlpha()
                })
            }
            return this.set(a, b.Gradient.forObject(this, e))
        },
        setPatternFill: function(a) {
            return this.set("fill", new b.Pattern(a))
        },
        setShadow: function(a) {
            return this.set("shadow", a ? new b.Shadow(a) : null)
        },
        setColor: function(a) {
            this.set("fill", a);
            return this
        },
        setAngle: function(a) {
            var c = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
            c && this._setOriginToCenter();
            this.set("angle", a);
            c && this._resetOrigin();
            return this
        },
        centerH: function() {
            this.canvas.centerObjectH(this);
            return this
        },
        centerV: function() {
            this.canvas.centerObjectV(this);
            return this
        },
        center: function() {
            this.canvas.centerObject(this);
            return this
        },
        remove: function() {
            this.canvas.remove(this);
            return this
        },
        getLocalPointer: function(a, c) {
            c = c || this.canvas.getPointer(a);
            var e = new b.Point(c.x,
                    c.y),
                d = this._getLeftTopCoords();
            this.angle && (e = b.util.rotatePoint(e, d, b.util.degreesToRadians(-this.angle)));
            return {
                x: e.x - d.x,
                y: e.y - d.y
            }
        },
        _setupCompositeOperation: function(a) {
            this.globalCompositeOperation && (a.globalCompositeOperation = this.globalCompositeOperation)
        }
    }), b.util.createAccessors(b.Object), b.Object.prototype.rotate = b.Object.prototype.setAngle, d(b.Object.prototype, b.Observable), b.Object.NUM_FRACTION_DIGITS = 2, b.Object.__uid = 0)
})("undefined" !== typeof exports ? exports : this);
(function() {
    var d = fabric.util.degreesToRadians,
        b = {
            left: -.5,
            center: 0,
            right: .5
        },
        e = {
            top: -.5,
            center: 0,
            bottom: .5
        };
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function(a, c, d, g, f) {
            var k = a.x,
                l = a.y;
            c = b[g] - b[c];
            d = e[f] - e[d];
            if (c || d) l = this._getTransformedDimensions(), k = a.x + c * l.x, l = a.y + d * l.y;
            return new fabric.Point(k, l)
        },
        translateToCenterPoint: function(a, c, b) {
            c = this.translateToGivenOrigin(a, c, b, "center", "center");
            return this.angle ? fabric.util.rotatePoint(c, a, d(this.angle)) : c
        },
        translateToOriginPoint: function(a,
            c, b) {
            c = this.translateToGivenOrigin(a, "center", "center", c, b);
            return this.angle ? fabric.util.rotatePoint(c, a, d(this.angle)) : c
        },
        getCenterPoint: function() {
            var a = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(a, this.originX, this.originY)
        },
        getPointByOrigin: function(a, c) {
            var b = this.getCenterPoint();
            return this.translateToOriginPoint(b, a, c)
        },
        toLocalPoint: function(a, c, b) {
            var e = this.getCenterPoint();
            c = c && b ? this.translateToGivenOrigin(e, "center", "center", c, b) : new fabric.Point(this.left,
                this.top);
            a = new fabric.Point(a.x, a.y);
            this.angle && (a = fabric.util.rotatePoint(a, e, -d(this.angle)));
            return a.subtractEquals(c)
        },
        setPositionByOrigin: function(a, c, b) {
            a = this.translateToCenterPoint(a, c, b);
            a = this.translateToOriginPoint(a, this.originX, this.originY);
            this.set("left", a.x);
            this.set("top", a.y)
        },
        adjustPosition: function(a) {
            var c = d(this.angle),
                e = this.getWidth(),
                g = Math.cos(c) * e,
                c = Math.sin(c) * e;
            this.left += g * (b[a] - b[this.originX]);
            this.top += c * (b[a] - b[this.originX]);
            this.setCoords();
            this.originX = a
        },
        _setOriginToCenter: function() {
            this._originalOriginX = this.originX;
            this._originalOriginY = this.originY;
            var a = this.getCenterPoint();
            this.originY = this.originX = "center";
            this.left = a.x;
            this.top = a.y
        },
        _resetOrigin: function() {
            var a = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX;
            this.originY = this._originalOriginY;
            this.left = a.x;
            this.top = a.y;
            this._originalOriginY = this._originalOriginX = null
        },
        _getLeftTopCoords: function() {
            return this.translateToOriginPoint(this.getCenterPoint(),
                "left", "top")
        }
    })
})();
(function() {
    var d = fabric.util.degreesToRadians;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        intersectsWithRect: function(b, e) {
            var a = this.oCoords,
                c = new fabric.Point(a.tl.x, a.tl.y),
                d = new fabric.Point(a.tr.x, a.tr.y),
                g = new fabric.Point(a.bl.x, a.bl.y),
                a = new fabric.Point(a.br.x, a.br.y);
            return "Intersection" === fabric.Intersection.intersectPolygonRectangle([c, d, a, g], b, e).status
        },
        intersectsWithObject: function(b) {
            function e(a) {
                return {
                    tl: new fabric.Point(a.tl.x, a.tl.y),
                    tr: new fabric.Point(a.tr.x,
                        a.tr.y),
                    bl: new fabric.Point(a.bl.x, a.bl.y),
                    br: new fabric.Point(a.br.x, a.br.y)
                }
            }
            var a = e(this.oCoords);
            b = e(b.oCoords);
            return "Intersection" === fabric.Intersection.intersectPolygonPolygon([a.tl, a.tr, a.br, a.bl], [b.tl, b.tr, b.br, b.bl]).status
        },
        isContainedWithinObject: function(b) {
            var e = b.getBoundingRect();
            b = new fabric.Point(e.left, e.top);
            e = new fabric.Point(e.left + e.width, e.top + e.height);
            return this.isContainedWithinRect(b, e)
        },
        isContainedWithinRect: function(b, e) {
            var a = this.getBoundingRect();
            return a.left >=
                b.x && a.left + a.width <= e.x && a.top >= b.y && a.top + a.height <= e.y
        },
        containsPoint: function(b) {
            var e = this._getImageLines(this.oCoords);
            b = this._findCrossPoints(b, e);
            return 0 !== b && 1 === b % 2
        },
        _getImageLines: function(b) {
            return {
                topline: {
                    o: b.tl,
                    d: b.tr
                },
                rightline: {
                    o: b.tr,
                    d: b.br
                },
                bottomline: {
                    o: b.br,
                    d: b.bl
                },
                leftline: {
                    o: b.bl,
                    d: b.tl
                }
            }
        },
        _findCrossPoints: function(b, e) {
            var a, c, d, g = 0,
                f;
            for (f in e)
                if (d = e[f], !(d.o.y < b.y && d.d.y < b.y || d.o.y >= b.y && d.d.y >= b.y) && (d.o.x === d.d.x && d.o.x >= b.x ? a = d.o.x : (a = (d.d.y - d.o.y) / (d.d.x - d.o.x), c = b.y -
                        0 * b.x, d = d.o.y - a * d.o.x, a = -(c - d) / (0 - a)), a >= b.x && (g += 1), 2 === g)) break;
            return g
        },
        getBoundingRectWidth: function() {
            return this.getBoundingRect().width
        },
        getBoundingRectHeight: function() {
            return this.getBoundingRect().height
        },
        getBoundingRect: function() {
            this.oCoords || this.setCoords();
            var b = [this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x],
                e = fabric.util.array.min(b),
                b = fabric.util.array.max(b),
                b = Math.abs(e - b),
                a = [this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y],
                c =
                fabric.util.array.min(a),
                a = fabric.util.array.max(a),
                a = Math.abs(c - a);
            return {
                left: e,
                top: c,
                width: b,
                height: a
            }
        },
        getWidth: function() {
            return this.width * this.scaleX
        },
        getHeight: function() {
            return this.height * this.scaleY
        },
        _constrainScale: function(b) {
            return Math.abs(b) < this.minScaleLimit ? 0 > b ? -this.minScaleLimit : this.minScaleLimit : b
        },
        scale: function(b) {
            b = this._constrainScale(b);
            0 > b && (this.flipX = !this.flipX, this.flipY = !this.flipY, b *= -1);
            this.scaleY = this.scaleX = b;
            this.setCoords();
            return this
        },
        scaleToWidth: function(b) {
            var e =
                this.getBoundingRectWidth() / this.getWidth();
            return this.scale(b / this.width / e)
        },
        scaleToHeight: function(b) {
            var e = this.getBoundingRectHeight() / this.getHeight();
            return this.scale(b / this.height / e)
        },
        setCoords: function() {
            var b = d(this.angle),
                e = this.getViewportTransform(),
                a = function(a) {
                    return fabric.util.transformPoint(a, e)
                },
                c = this._calculateCurrentDimensions(!1),
                h = c.x,
                g = c.y;
            0 > h && (h = Math.abs(h));
            var c = Math.sqrt(Math.pow(h / 2, 2) + Math.pow(g / 2, 2)),
                f = Math.atan(isFinite(g / h) ? g / h : 0),
                k = Math.cos(f + b) * c,
                f = Math.sin(f +
                    b) * c,
                c = Math.sin(b),
                b = Math.cos(b),
                l = this.getCenterPoint(),
                g = new fabric.Point(h, g),
                l = new fabric.Point(l.x - k, l.y - f),
                f = new fabric.Point(l.x + g.x * b, l.y + g.x * c),
                h = a(new fabric.Point(l.x - g.y * c, l.y + g.y * b)),
                k = a(new fabric.Point(f.x - g.y * c, f.y + g.y * b)),
                g = a(l),
                a = a(f),
                f = new fabric.Point((g.x + h.x) / 2, (g.y + h.y) / 2),
                l = new fabric.Point((a.x + g.x) / 2, (a.y + g.y) / 2),
                m = new fabric.Point((k.x + a.x) / 2, (k.y + a.y) / 2),
                n = new fabric.Point((k.x + h.x) / 2, (k.y + h.y) / 2),
                c = new fabric.Point(l.x + c * this.rotatingPointOffset, l.y - b * this.rotatingPointOffset);
            this.oCoords = {
                tl: g,
                tr: a,
                br: k,
                bl: h,
                ml: f,
                mt: l,
                mr: m,
                mb: n,
                mtr: c
            };
            this._setCornerCoords && this._setCornerCoords();
            return this
        },
        _calcDimensionsTransformMatrix: function() {
            return [this.scaleX, 0, 0, this.scaleY, 0, 0]
        }
    })
})();
fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function() {
        this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this);
        return this
    },
    bringToFront: function() {
        this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this);
        return this
    },
    sendBackwards: function(d) {
        this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, d) : this.canvas.sendBackwards(this, d);
        return this
    },
    bringForward: function(d) {
        this.group ?
            fabric.StaticCanvas.prototype.bringForward.call(this.group, this, d) : this.canvas.bringForward(this, d);
        return this
    },
    moveTo: function(d) {
        this.group ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, d) : this.canvas.moveTo(this, d);
        return this
    }
});
fabric.util.object.extend(fabric.Object.prototype, {
    getSvgStyles: function() {
        var d = this.fill ? this.fill.toLive ? "url(#SVGID_" + this.fill.id + ")" : this.fill : "none",
            b = this.fillRule,
            e = this.stroke ? this.stroke.toLive ? "url(#SVGID_" + this.stroke.id + ")" : this.stroke : "none",
            a = this.strokeWidth ? this.strokeWidth : "0",
            c = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none";
        return ["stroke: ", e, "; stroke-width: ", a, "; stroke-dasharray: ", c, "; stroke-linecap: ", this.strokeLineCap ? this.strokeLineCap : "butt", "; stroke-linejoin: ",
            this.strokeLineJoin ? this.strokeLineJoin : "miter", "; stroke-miterlimit: ", this.strokeMiterLimit ? this.strokeMiterLimit : "4", "; fill: ", d, "; fill-rule: ", b, "; opacity: ", "undefined" !== typeof this.opacity ? this.opacity : "1", ";", this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "", this.visible ? "" : " visibility: hidden;"
        ].join("")
    },
    getSvgTransform: function() {
        if (this.group && "path-group" === this.group.type) return "";
        var d = fabric.util.toFixed,
            b = this.getAngle(),
            e = !this.canvas || this.canvas.svgViewportTransformation ?
            this.getViewportTransform() : [1, 0, 0, 1, 0, 0],
            a = fabric.util.transformPoint(this.getCenterPoint(), e),
            c = fabric.Object.NUM_FRACTION_DIGITS,
            a = "path-group" === this.type ? "" : "translate(" + d(a.x, c) + " " + d(a.y, c) + ")",
            b = 0 !== b ? " rotate(" + d(b, c) + ")" : "",
            d = 1 === this.scaleX && 1 === this.scaleY && 1 === e[0] && 1 === e[3] ? "" : " scale(" + d(this.scaleX * e[0], c) + " " + d(this.scaleY * e[3], c) + ")",
            c = "path-group" === this.type ? this.width * e[0] : 0,
            e = "path-group" === this.type ? this.height * e[3] : 0;
        return [a, b, d, this.flipX ? " matrix(-1 0 0 1 " + c + " 0) " : "",
            this.flipY ? " matrix(1 0 0 -1 0 " + e + ")" : ""
        ].join("")
    },
    getSvgTransformMatrix: function() {
        return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : ""
    },
    _createBaseSVGMarkup: function() {
        var d = [];
        this.fill && this.fill.toLive && d.push(this.fill.toSVG(this, !1));
        this.stroke && this.stroke.toLive && d.push(this.stroke.toSVG(this, !1));
        this.shadow && d.push(this.shadow.toSVG(this));
        return d
    }
});
fabric.util.object.extend(fabric.Object.prototype, {
    hasStateChanged: function() {
        return this.stateProperties.some(function(d) {
            return this.get(d) !== this.originalState[d]
        }, this)
    },
    saveState: function(d) {
        this.stateProperties.forEach(function(b) {
            this.originalState[b] = this.get(b)
        }, this);
        d && d.stateProperties && d.stateProperties.forEach(function(b) {
            this.originalState[b] = this.get(b)
        }, this);
        return this
    },
    setupState: function() {
        this.originalState = {};
        this.saveState();
        return this
    }
});
(function() {
    var d = fabric.util.degreesToRadians;
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null,
        _findTargetCorner: function(b) {
            if (!this.hasControls || !this.active) return !1;
            var e = b.x;
            b = b.y;
            var a, c;
            for (c in this.oCoords)
                if (this.isControlVisible(c) && ("mtr" !== c || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== c && "mr" !== c && "mb" !== c && "ml" !== c) && (a = this._getImageLines(this.oCoords[c].corner), a = this._findCrossPoints({
                        x: e,
                        y: b
                    }, a), 0 !== a && 1 === a % 2)) return this.__corner = c;
            return !1
        },
        _setCornerCoords: function() {
            var b = this.oCoords,
                e = d(45 - this.angle),
                a = Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2,
                c = a * Math.cos(e),
                e = a * Math.sin(e),
                h, g;
            for (g in b) a = b[g].x, h = b[g].y, b[g].corner = {
                tl: {
                    x: a - e,
                    y: h - c
                },
                tr: {
                    x: a + c,
                    y: h - e
                },
                bl: {
                    x: a - c,
                    y: h + e
                },
                br: {
                    x: a + e,
                    y: h + c
                }
            }
        },
        _getNonTransformedDimensions: function() {
            var b = this.strokeWidth,
                e = this.width,
                a = this.height,
                c = "round" === this.strokeLineCap || "square" === this.strokeLineCap,
                d = "line" === this.type && 0 === this.width,
                g = "line" === this.type && 0 === this.height,
                f = d ||
                g;
            d ? e = b : g && (a = b);
            (c && g || !f) && (e += 0 > e ? -b : b);
            (c && d || !f) && (a += 0 > a ? -b : b);
            return {
                x: e,
                y: a
            }
        },
        _getTransformedDimensions: function(b) {
            b || (b = this._getNonTransformedDimensions());
            var e = this._calcDimensionsTransformMatrix();
            return fabric.util.transformPoint(b, e, !0)
        },
        _calculateCurrentDimensions: function(b) {
            var e = this.getViewportTransform(),
                a = this._getTransformedDimensions(),
                c = a.x,
                a = a.y,
                c = c + 2 * this.padding,
                a = a + 2 * this.padding;
            return b ? fabric.util.transformPoint(new fabric.Point(c, a), e, !0) : {
                x: c,
                y: a
            }
        },
        drawBorders: function(b) {
            if (!this.hasBorders) return this;
            b.save();
            b.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            b.strokeStyle = this.borderColor;
            b.lineWidth = 1 / this.borderScaleFactor;
            var e = this._calculateCurrentDimensions(!0),
                a = e.x,
                e = e.y;
            this.group && (a *= this.group.scaleX, e *= this.group.scaleY);
            b.strokeRect(~~-(a / 2) - .5, ~~-(e / 2) - .5, ~~a + 1, ~~e + 1);
            this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls && (a = -e / 2, b.beginPath(), b.moveTo(0, a), b.lineTo(0, a - this.rotatingPointOffset), b.closePath(), b.stroke());
            b.restore();
            return this
        },
        drawControls: function(b) {
            if (!this.hasControls) return this;
            var e = this._calculateCurrentDimensions(!0),
                a = e.x,
                e = e.y,
                c = -(a / 2),
                d = -(e / 2),
                g = this.cornerSize / 2,
                f = this.transparentCorners ? "strokeRect" : "fillRect";
            b.save();
            b.lineWidth = 1;
            b.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            b.strokeStyle = b.fillStyle = this.cornerColor;
            this._drawControl("tl", b, f, c - g, d - g);
            this._drawControl("tr", b, f, c + a - g, d - g);
            this._drawControl("bl", b, f, c - g, d + e - g);
            this._drawControl("br", b, f, c + a - g, d + e - g);
            this.get("lockUniScaling") ||
                (this._drawControl("mt", b, f, c + a / 2 - g, d - g), this._drawControl("mb", b, f, c + a / 2 - g, d + e - g), this._drawControl("mr", b, f, c + a - g, d + e / 2 - g), this._drawControl("ml", b, f, c - g, d + e / 2 - g));
            this.hasRotatingPoint && this._drawControl("mtr", b, f, c + a / 2 - g, d - this.rotatingPointOffset - g);
            b.restore();
            return this
        },
        _drawControl: function(b, e, a, c, d) {
            this.isControlVisible(b) && (b = this.cornerSize, "undefined" !== typeof G_vmlCanvasManager || this.transparentCorners || e.clearRect(c, d, b, b), e[a](c, d, b, b))
        },
        isControlVisible: function(b) {
            return this._getControlsVisibility()[b]
        },
        setControlVisible: function(b, e) {
            this._getControlsVisibility()[b] = e;
            return this
        },
        setControlsVisibility: function(b) {
            b || (b = {});
            for (var e in b) this.setControlVisible(e, b[e]);
            return this
        },
        _getControlsVisibility: function() {
            this._controlsVisibility || (this._controlsVisibility = {
                tl: !0,
                tr: !0,
                br: !0,
                bl: !0,
                ml: !0,
                mt: !0,
                mr: !0,
                mb: !0,
                mtr: !0
            });
            return this._controlsVisibility
        }
    })
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function(d, b) {
        b = b || {};
        var e = function() {},
            a = b.onComplete || e,
            c = b.onChange || e,
            h = this;
        fabric.util.animate({
            startValue: d.get("left"),
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function(a) {
                d.set("left", a);
                h.renderAll();
                c()
            },
            onComplete: function() {
                d.setCoords();
                a()
            }
        });
        return this
    },
    fxCenterObjectV: function(d, b) {
        b = b || {};
        var e = function() {},
            a = b.onComplete || e,
            c = b.onChange || e,
            h = this;
        fabric.util.animate({
            startValue: d.get("top"),
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function(a) {
                d.set("top", a);
                h.renderAll();
                c()
            },
            onComplete: function() {
                d.setCoords();
                a()
            }
        });
        return this
    },
    fxRemove: function(d, b) {
        b = b || {};
        var e = function() {},
            a = b.onComplete || e,
            c = b.onChange || e,
            h = this;
        fabric.util.animate({
            startValue: d.get("opacity"),
            endValue: 0,
            duration: this.FX_DURATION,
            onStart: function() {
                d.set("active", !1)
            },
            onChange: function(a) {
                d.set("opacity", a);
                h.renderAll();
                c()
            },
            onComplete: function() {
                h.remove(d);
                a()
            }
        });
        return this
    }
});
fabric.util.object.extend(fabric.Object.prototype, {
    animate: function() {
        if (arguments[0] && "object" === typeof arguments[0]) {
            var d = [],
                b, e;
            for (b in arguments[0]) d.push(b);
            for (var a = 0, c = d.length; a < c; a++) b = d[a], e = a !== c - 1, this._animate(b, arguments[0][b], arguments[1], e)
        } else this._animate.apply(this, arguments);
        return this
    },
    _animate: function(d, b, e, a) {
        var c = this,
            h;
        b = b.toString();
        e = e ? fabric.util.object.clone(e) : {};
        ~d.indexOf(".") && (h = d.split("."));
        var g = h ? this.get(h[0])[h[1]] : this.get(d);
        "from" in e || (e.from = g);
        b = ~b.indexOf("=") ? g + parseFloat(b.replace("=", "")) : parseFloat(b);
        fabric.util.animate({
            startValue: e.from,
            endValue: b,
            byValue: e.by,
            easing: e.easing,
            duration: e.duration,
            abort: e.abort && function() {
                return e.abort.call(c)
            },
            onChange: function(b) {
                h ? c[h[0]][h[1]] = b : c.set(d, b);
                a || e.onChange && e.onChange()
            },
            onComplete: function() {
                a || (c.setCoords(), e.onComplete && e.onComplete())
            }
        })
    }
});
(function(d) {
    function b(a, c) {
        var b = a.origin,
            e = a.axis1,
            d = a.axis2,
            h = a.dimension,
            u = c.nearest,
            A = c.center,
            D = c.farthest;
        return function() {
            switch (this.get(b)) {
                case u:
                    return Math.min(this.get(e), this.get(d));
                case A:
                    return Math.min(this.get(e), this.get(d)) + .5 * this.get(h);
                case D:
                    return Math.max(this.get(e), this.get(d))
            }
        }
    }
    var e = d.fabric || (d.fabric = {}),
        a = e.util.object.extend,
        c = {
            x1: 1,
            x2: 1,
            y1: 1,
            y2: 1
        },
        h = e.StaticCanvas.supports("setLineDash");
    e.Line ? e.warn("fabric.Line is already defined") : (e.Line = e.util.createClass(e.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            initialize: function(a, c) {
                c = c || {};
                a || (a = [0, 0, 0, 0]);
                this.callSuper("initialize", c);
                this.set("x1", a[0]);
                this.set("y1", a[1]);
                this.set("x2", a[2]);
                this.set("y2", a[3]);
                this._setWidthHeight(c)
            },
            _setWidthHeight: function(a) {
                a || (a = {});
                this.width = Math.abs(this.x2 - this.x1);
                this.height = Math.abs(this.y2 - this.y1);
                this.left = "left" in a ? a.left : this._getLeftToOriginX();
                this.top = "top" in a ? a.top : this._getTopToOriginY()
            },
            _set: function(a, b) {
                this.callSuper("_set", a, b);
                "undefined" !== typeof c[a] &&
                    this._setWidthHeight();
                return this
            },
            _getLeftToOriginX: b({
                origin: "originX",
                axis1: "x1",
                axis2: "x2",
                dimension: "width"
            }, {
                nearest: "left",
                center: "center",
                farthest: "right"
            }),
            _getTopToOriginY: b({
                origin: "originY",
                axis1: "y1",
                axis2: "y2",
                dimension: "height"
            }, {
                nearest: "top",
                center: "center",
                farthest: "bottom"
            }),
            _render: function(a, c) {
                a.beginPath();
                if (c) {
                    var b = this.getCenterPoint();
                    a.translate(b.x - this.strokeWidth / 2, b.y - this.strokeWidth / 2)
                }
                if (!this.strokeDashArray || this.strokeDashArray && h) b = this.calcLinePoints(), a.moveTo(b.x1,
                    b.y1), a.lineTo(b.x2, b.y2);
                a.lineWidth = this.strokeWidth;
                b = a.strokeStyle;
                a.strokeStyle = this.stroke || a.fillStyle;
                this.stroke && this._renderStroke(a);
                a.strokeStyle = b
            },
            _renderDashedStroke: function(a) {
                var c = this.calcLinePoints();
                a.beginPath();
                e.util.drawDashedLine(a, c.x1, c.y1, c.x2, c.y2, this.strokeDashArray);
                a.closePath()
            },
            toObject: function(c) {
                return a(this.callSuper("toObject", c), this.calcLinePoints())
            },
            calcLinePoints: function() {
                var a = this.x1 <= this.x2 ? -1 : 1,
                    c = this.y1 <= this.y2 ? -1 : 1;
                return {
                    x1: a * this.width *
                        .5,
                    x2: a * this.width * -.5,
                    y1: c * this.height * .5,
                    y2: c * this.height * -.5
                }
            },
            toSVG: function(a) {
                var c = this._createBaseSVGMarkup(),
                    b = {
                        x1: this.x1,
                        x2: this.x2,
                        y1: this.y1,
                        y2: this.y2
                    };
                this.group && "path-group" === this.group.type || (b = this.calcLinePoints());
                c.push("<line ", 'x1="', b.x1, '" y1="', b.y1, '" x2="', b.x2, '" y2="', b.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
                return a ? a(c.join("")) : c.join("")
            },
            complexity: function() {
                return 1
            }
        }), e.Line.ATTRIBUTE_NAMES =
        e.SHARED_ATTRIBUTES.concat(["x1", "y1", "x2", "y2"]), e.Line.fromElement = function(c, b) {
            var d = e.parseAttributes(c, e.Line.ATTRIBUTE_NAMES);
            return new e.Line([d.x1 || 0, d.y1 || 0, d.x2 || 0, d.y2 || 0], a(d, b))
        }, e.Line.fromObject = function(a) {
            return new e.Line([a.x1, a.y1, a.x2, a.y2], a)
        })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = Math.PI,
        a = b.util.object.extend;
    b.Circle ? b.warn("fabric.Circle is already defined.") : (b.Circle = b.util.createClass(b.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: 2 * e,
        initialize: function(a) {
            a = a || {};
            this.callSuper("initialize", a);
            this.set("radius", a.radius || 0);
            this.startAngle = a.startAngle || this.startAngle;
            this.endAngle = a.endAngle || this.endAngle
        },
        _set: function(a, b) {
            this.callSuper("_set", a, b);
            "radius" === a && this.setRadius(b);
            return this
        },
        toObject: function(c) {
            return a(this.callSuper("toObject",
                c), {
                radius: this.get("radius"),
                startAngle: this.startAngle,
                endAngle: this.endAngle
            })
        },
        toSVG: function(a) {
            var b = this._createBaseSVGMarkup(),
                d = 0,
                f = 0,
                k = (this.endAngle - this.startAngle) % (2 * e);
            if (0 === k) this.group && "path-group" === this.group.type && (d = this.left + this.radius, f = this.top + this.radius), b.push("<circle ", 'cx="' + d + '" cy="' + f + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            else {
                var d = Math.cos(this.startAngle) * this.radius,
                    f = Math.sin(this.startAngle) * this.radius,
                    l = Math.cos(this.endAngle) * this.radius,
                    m = Math.sin(this.endAngle) * this.radius;
                b.push('<path d="M ' + d + " " + f, " A " + this.radius + " " + this.radius, " 0 ", +(k > e ? 1 : 0) + " 1", " " + l + " " + m, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n')
            }
            return a ? a(b.join("")) : b.join("")
        },
        _render: function(a, b) {
            a.beginPath();
            a.arc(b ? this.left + this.radius : 0, b ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, !1);
            this._renderFill(a);
            this._renderStroke(a)
        },
        getRadiusX: function() {
            return this.get("radius") * this.get("scaleX")
        },
        getRadiusY: function() {
            return this.get("radius") * this.get("scaleY")
        },
        setRadius: function(a) {
            this.radius = a;
            return this.set("width", 2 * a).set("height", 2 * a)
        },
        complexity: function() {
            return 1
        }
    }), b.Circle.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat(["cx", "cy", "r"]), b.Circle.fromElement = function(c, e) {
        e || (e = {});
        var d = b.parseAttributes(c, b.Circle.ATTRIBUTE_NAMES);
        if (!("radius" in d && 0 <= d.radius)) throw Error("value of `r` attribute is required and can not be negative");
        d.left = d.left || 0;
        d.top = d.top || 0;
        d = new b.Circle(a(d, e));
        d.left -= d.radius;
        d.top -= d.radius;
        return d
    }, b.Circle.fromObject = function(a) {
        return new b.Circle(a)
    })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {});
    b.Triangle ? b.warn("fabric.Triangle is already defined") : (b.Triangle = b.util.createClass(b.Object, {
            type: "triangle",
            initialize: function(b) {
                b = b || {};
                this.callSuper("initialize", b);
                this.set("width", b.width || 100).set("height", b.height || 100)
            },
            _render: function(b) {
                var a = this.width / 2,
                    c = this.height / 2;
                b.beginPath();
                b.moveTo(-a, c);
                b.lineTo(0, -c);
                b.lineTo(a, c);
                b.closePath();
                this._renderFill(b);
                this._renderStroke(b)
            },
            _renderDashedStroke: function(e) {
                var a = this.width / 2,
                    c =
                    this.height / 2;
                e.beginPath();
                b.util.drawDashedLine(e, -a, c, 0, -c, this.strokeDashArray);
                b.util.drawDashedLine(e, 0, -c, a, c, this.strokeDashArray);
                b.util.drawDashedLine(e, a, c, -a, c, this.strokeDashArray);
                e.closePath()
            },
            toSVG: function(b) {
                var a = this._createBaseSVGMarkup(),
                    c = this.width / 2,
                    d = this.height / 2,
                    c = [-c + " " + d, "0 " + -d, c + " " + d].join();
                a.push("<polygon ", 'points="', c, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return b ? b(a.join("")) : a.join("")
            },
            complexity: function() {
                return 1
            }
        }),
        b.Triangle.fromObject = function(e) {
            return new b.Triangle(e)
        })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = 2 * Math.PI,
        a = b.util.object.extend;
    b.Ellipse ? b.warn("fabric.Ellipse is already defined.") : (b.Ellipse = b.util.createClass(b.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        initialize: function(a) {
            a = a || {};
            this.callSuper("initialize", a);
            this.set("rx", a.rx || 0);
            this.set("ry", a.ry || 0)
        },
        _set: function(a, b) {
            this.callSuper("_set", a, b);
            switch (a) {
                case "rx":
                    this.rx = b;
                    this.set("width", 2 * b);
                    break;
                case "ry":
                    this.ry = b, this.set("height", 2 * b)
            }
            return this
        },
        getRx: function() {
            return this.get("rx") *
                this.get("scaleX")
        },
        getRy: function() {
            return this.get("ry") * this.get("scaleY")
        },
        toObject: function(c) {
            return a(this.callSuper("toObject", c), {
                rx: this.get("rx"),
                ry: this.get("ry")
            })
        },
        toSVG: function(a) {
            var b = this._createBaseSVGMarkup(),
                e = 0,
                f = 0;
            this.group && "path-group" === this.group.type && (e = this.left + this.rx, f = this.top + this.ry);
            b.push("<ellipse ", 'cx="', e, '" cy="', f, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return a ? a(b.join("")) : b.join("")
        },
        _render: function(a, b) {
            a.beginPath();
            a.save();
            a.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            a.arc(b ? this.left + this.rx : 0, b ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, e, !1);
            a.restore();
            this._renderFill(a);
            this._renderStroke(a)
        },
        complexity: function() {
            return 1
        }
    }), b.Ellipse.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat(["cx", "cy", "rx", "ry"]), b.Ellipse.fromElement = function(c, e) {
        e || (e = {});
        var d = b.parseAttributes(c, b.Ellipse.ATTRIBUTE_NAMES);
        d.left = d.left || 0;
        d.top = d.top || 0;
        d = new b.Ellipse(a(d,
            e));
        d.top -= d.ry;
        d.left -= d.rx;
        return d
    }, b.Ellipse.fromObject = function(a) {
        return new b.Ellipse(a)
    })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Rect ? b.warn("fabric.Rect is already defined") : (d = b.Object.prototype.stateProperties.concat(), d.push("rx", "ry", "x", "y"), b.Rect = b.util.createClass(b.Object, {
        stateProperties: d,
        type: "rect",
        rx: 0,
        ry: 0,
        strokeDashArray: null,
        initialize: function(a) {
            a = a || {};
            this.callSuper("initialize", a);
            this._initRxRy()
        },
        _initRxRy: function() {
            this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
        },
        _render: function(a, c) {
            if (1 === this.width && 1 ===
                this.height) a.fillRect(0, 0, 1, 1);
            else {
                var b = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                    e = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                    f = this.width,
                    d = this.height,
                    l = c ? this.left : -this.width / 2,
                    m = c ? this.top : -this.height / 2,
                    n = 0 !== b || 0 !== e;
                a.beginPath();
                a.moveTo(l + b, m);
                a.lineTo(l + f - b, m);
                n && a.bezierCurveTo(l + f - .4477152502 * b, m, l + f, m + .4477152502 * e, l + f, m + e);
                a.lineTo(l + f, m + d - e);
                n && a.bezierCurveTo(l + f, m + d - .4477152502 * e, l + f - .4477152502 * b, m + d, l + f - b, m + d);
                a.lineTo(l + b, m + d);
                n && a.bezierCurveTo(l + .4477152502 * b, m + d, l, m + d - .4477152502 *
                    e, l, m + d - e);
                a.lineTo(l, m + e);
                n && a.bezierCurveTo(l, m + .4477152502 * e, l + .4477152502 * b, m, l + b, m);
                a.closePath();
                this._renderFill(a);
                this._renderStroke(a)
            }
        },
        _renderDashedStroke: function(a) {
            var c = -this.width / 2,
                e = -this.height / 2,
                d = this.width,
                f = this.height;
            a.beginPath();
            b.util.drawDashedLine(a, c, e, c + d, e, this.strokeDashArray);
            b.util.drawDashedLine(a, c + d, e, c + d, e + f, this.strokeDashArray);
            b.util.drawDashedLine(a, c + d, e + f, c, e + f, this.strokeDashArray);
            b.util.drawDashedLine(a, c, e + f, c, e, this.strokeDashArray);
            a.closePath()
        },
        toObject: function(a) {
            a = e(this.callSuper("toObject", a), {
                rx: this.get("rx") || 0,
                ry: this.get("ry") || 0
            });
            this.includeDefaultValues || this._removeDefaultValues(a);
            return a
        },
        toSVG: function(a) {
            var c = this._createBaseSVGMarkup(),
                b = this.left,
                e = this.top;
            this.group && "path-group" === this.group.type || (b = -this.width / 2, e = -this.height / 2);
            c.push("<rect ", 'x="', b, '" y="', e, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(),
                this.getSvgTransformMatrix(), '"/>\n');
            return a ? a(c.join("")) : c.join("")
        },
        complexity: function() {
            return 1
        }
    }), b.Rect.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), b.Rect.fromElement = function(a, c) {
        if (!a) return null;
        c = c || {};
        var d = b.parseAttributes(a, b.Rect.ATTRIBUTE_NAMES);
        d.left = d.left || 0;
        d.top = d.top || 0;
        d = new b.Rect(e(c ? b.util.object.clone(c) : {}, d));
        d.visible = 0 < d.width && 0 < d.height;
        return d
    }, b.Rect.fromObject = function(a) {
        return new b.Rect(a)
    })
})("undefined" !== typeof exports ?
    exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {});
    b.Polyline ? b.warn("fabric.Polyline is already defined") : (b.Polyline = b.util.createClass(b.Object, {
        type: "polyline",
        points: null,
        minX: 0,
        minY: 0,
        initialize: function(e, a) {
            return b.Polygon.prototype.initialize.call(this, e, a)
        },
        _calcDimensions: function() {
            return b.Polygon.prototype._calcDimensions.call(this)
        },
        _applyPointOffset: function() {
            return b.Polygon.prototype._applyPointOffset.call(this)
        },
        toObject: function(e) {
            return b.Polygon.prototype.toObject.call(this, e)
        },
        toSVG: function(e) {
            return b.Polygon.prototype.toSVG.call(this,
                e)
        },
        _render: function(e) {
            b.Polygon.prototype.commonRender.call(this, e) && (this._renderFill(e), this._renderStroke(e))
        },
        _renderDashedStroke: function(e) {
            var a, c;
            e.beginPath();
            for (var d = 0, g = this.points.length; d < g; d++) a = this.points[d], c = this.points[d + 1] || a, b.util.drawDashedLine(e, a.x, a.y, c.x, c.y, this.strokeDashArray)
        },
        complexity: function() {
            return this.get("points").length
        }
    }), b.Polyline.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat(), b.Polyline.fromElement = function(e, a) {
        if (!e) return null;
        a || (a = {});
        var c = b.parsePointsAttribute(e.getAttribute("points")),
            d = b.parseAttributes(e, b.Polyline.ATTRIBUTE_NAMES);
        return new b.Polyline(c, b.util.object.extend(d, a))
    }, b.Polyline.fromObject = function(e) {
        return new b.Polyline(e.points, e, !0)
    })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend,
        a = b.util.array.min,
        c = b.util.array.max,
        h = b.util.toFixed;
    b.Polygon ? b.warn("fabric.Polygon is already defined") : (b.Polygon = b.util.createClass(b.Object, {
        type: "polygon",
        points: null,
        minX: 0,
        minY: 0,
        initialize: function(a, c) {
            c = c || {};
            this.points = a || [];
            this.callSuper("initialize", c);
            this._calcDimensions();
            "top" in c || (this.top = this.minY);
            "left" in c || (this.left = this.minX)
        },
        _calcDimensions: function() {
            var b = this.points,
                e = a(b, "x"),
                d = a(b, "y"),
                h = c(b,
                    "x"),
                b = c(b, "y");
            this.width = h - e || 0;
            this.height = b - d || 0;
            this.minX = e || 0;
            this.minY = d || 0
        },
        _applyPointOffset: function() {
            this.points.forEach(function(a) {
                a.x -= this.minX + this.width / 2;
                a.y -= this.minY + this.height / 2
            }, this)
        },
        toObject: function(a) {
            return e(this.callSuper("toObject", a), {
                points: this.points.concat()
            })
        },
        toSVG: function(a) {
            for (var c = [], b = this._createBaseSVGMarkup(), e = 0, d = this.points.length; e < d; e++) c.push(h(this.points[e].x, 2), ",", h(this.points[e].y, 2), " ");
            b.push("<", this.type, " ", 'points="', c.join(""),
                '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            return a ? a(b.join("")) : b.join("")
        },
        _render: function(a) {
            this.commonRender(a) && (this._renderFill(a), this.stroke || this.strokeDashArray) && (a.closePath(), this._renderStroke(a))
        },
        commonRender: function(a) {
            var c, b = this.points.length;
            if (!b || isNaN(this.points[b - 1].y)) return !1;
            a.beginPath();
            this._applyPointOffset && (this.group && "path-group" === this.group.type || this._applyPointOffset(), this._applyPointOffset =
                null);
            a.moveTo(this.points[0].x, this.points[0].y);
            for (var e = 0; e < b; e++) c = this.points[e], a.lineTo(c.x, c.y);
            return !0
        },
        _renderDashedStroke: function(a) {
            b.Polyline.prototype._renderDashedStroke.call(this, a);
            a.closePath()
        },
        complexity: function() {
            return this.points.length
        }
    }), b.Polygon.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat(), b.Polygon.fromElement = function(a, c) {
        if (!a) return null;
        c || (c = {});
        var d = b.parsePointsAttribute(a.getAttribute("points")),
            h = b.parseAttributes(a, b.Polygon.ATTRIBUTE_NAMES);
        return new b.Polygon(d,
            e(h, c))
    }, b.Polygon.fromObject = function(a) {
        return new b.Polygon(a.points, a, !0)
    })
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.array.min,
        a = b.util.array.max,
        c = b.util.object.extend,
        h = Object.prototype.toString,
        g = b.util.drawArc,
        f = {
            m: 2,
            l: 2,
            h: 1,
            v: 1,
            c: 6,
            s: 4,
            q: 4,
            t: 2,
            a: 7
        },
        k = {
            m: "l",
            M: "L"
        };
    b.Path ? b.warn("fabric.Path is already defined") : (b.Path = b.util.createClass(b.Object, {
        type: "path",
        path: null,
        minX: 0,
        minY: 0,
        initialize: function(a, c) {
            c = c || {};
            this.setOptions(c);
            a || (a = []);
            var b = "[object Array]" === h.call(a);
            if (this.path = b ? a : a.match && a.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi)) b || (this.path =
                this._parsePath()), this._setPositionDimensions(c), c.sourcePath && this.setSourcePath(c.sourcePath)
        },
        _setPositionDimensions: function(a) {
            var c = this._parseDimensions();
            this.minX = c.left;
            this.minY = c.top;
            this.width = c.width;
            this.height = c.height;
            "undefined" === typeof a.left && (this.left = c.left + ("center" === this.originX ? this.width / 2 : "right" === this.originX ? this.width : 0));
            "undefined" === typeof a.top && (this.top = c.top + ("center" === this.originY ? this.height / 2 : "bottom" === this.originY ? this.height : 0));
            this.pathOffset = this.pathOffset || {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            }
        },
        _render: function(a) {
            var c, b = null,
                e = 0,
                d = 0,
                f = 0,
                h = 0,
                k = 0,
                q = 0,
                w, x, p = -this.pathOffset.x,
                r = -this.pathOffset.y;
            this.group && "path-group" === this.group.type && (r = p = 0);
            a.beginPath();
            for (var z = 0, y = this.path.length; z < y; ++z) {
                c = this.path[z];
                switch (c[0]) {
                    case "l":
                        f += c[1];
                        h += c[2];
                        a.lineTo(f + p, h + r);
                        break;
                    case "L":
                        f = c[1];
                        h = c[2];
                        a.lineTo(f + p, h + r);
                        break;
                    case "h":
                        f += c[1];
                        a.lineTo(f + p, h + r);
                        break;
                    case "H":
                        f = c[1];
                        a.lineTo(f + p, h + r);
                        break;
                    case "v":
                        h += c[1];
                        a.lineTo(f + p, h + r);
                        break;
                    case "V":
                        h = c[1];
                        a.lineTo(f + p, h + r);
                        break;
                    case "m":
                        f += c[1];
                        h += c[2];
                        e = f;
                        d = h;
                        a.moveTo(f + p, h + r);
                        break;
                    case "M":
                        f = c[1];
                        h = c[2];
                        e = f;
                        d = h;
                        a.moveTo(f + p, h + r);
                        break;
                    case "c":
                        w = f + c[5];
                        x = h + c[6];
                        k = f + c[3];
                        q = h + c[4];
                        a.bezierCurveTo(f + c[1] + p, h + c[2] + r, k + p, q + r, w + p, x + r);
                        f = w;
                        h = x;
                        break;
                    case "C":
                        f = c[5];
                        h = c[6];
                        k = c[3];
                        q = c[4];
                        a.bezierCurveTo(c[1] + p, c[2] + r, k + p, q + r, f + p, h + r);
                        break;
                    case "s":
                        w = f + c[3];
                        x = h + c[4];
                        null === b[0].match(/[CcSs]/) ? (k = f, q = h) : (k = 2 * f - k, q = 2 * h - q);
                        a.bezierCurveTo(k + p, q + r, f + c[1] + p, h + c[2] + r, w + p, x + r);
                        k = f + c[1];
                        q = h + c[2];
                        f = w;
                        h = x;
                        break;
                    case "S":
                        w = c[3];
                        x = c[4];
                        null === b[0].match(/[CcSs]/) ? (k = f, q = h) : (k = 2 * f - k, q = 2 * h - q);
                        a.bezierCurveTo(k + p, q + r, c[1] + p, c[2] + r, w + p, x + r);
                        f = w;
                        h = x;
                        k = c[1];
                        q = c[2];
                        break;
                    case "q":
                        w = f + c[3];
                        x = h + c[4];
                        k = f + c[1];
                        q = h + c[2];
                        a.quadraticCurveTo(k + p, q + r, w + p, x + r);
                        f = w;
                        h = x;
                        break;
                    case "Q":
                        w = c[3];
                        x = c[4];
                        a.quadraticCurveTo(c[1] + p, c[2] + r, w + p, x + r);
                        f = w;
                        h = x;
                        k = c[1];
                        q = c[2];
                        break;
                    case "t":
                        w = f + c[1];
                        x = h + c[2];
                        null === b[0].match(/[QqTt]/) ? (k = f, q = h) : (k = 2 * f - k, q = 2 * h - q);
                        a.quadraticCurveTo(k + p, q + r, w + p, x + r);
                        f = w;
                        h = x;
                        break;
                    case "T":
                        w =
                            c[1];
                        x = c[2];
                        null === b[0].match(/[QqTt]/) ? (k = f, q = h) : (k = 2 * f - k, q = 2 * h - q);
                        a.quadraticCurveTo(k + p, q + r, w + p, x + r);
                        f = w;
                        h = x;
                        break;
                    case "a":
                        g(a, f + p, h + r, [c[1], c[2], c[3], c[4], c[5], c[6] + f + p, c[7] + h + r]);
                        f += c[6];
                        h += c[7];
                        break;
                    case "A":
                        g(a, f + p, h + r, [c[1], c[2], c[3], c[4], c[5], c[6] + p, c[7] + r]);
                        f = c[6];
                        h = c[7];
                        break;
                    case "z":
                    case "Z":
                        f = e, h = d, a.closePath()
                }
                b = c
            }
            this._renderFill(a);
            this._renderStroke(a)
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
        },
        toObject: function(a) {
            a =
                c(this.callSuper("toObject", a), {
                    path: this.path.map(function(a) {
                        return a.slice()
                    }),
                    pathOffset: this.pathOffset
                });
            this.sourcePath && (a.sourcePath = this.sourcePath);
            this.transformMatrix && (a.transformMatrix = this.transformMatrix);
            return a
        },
        toDatalessObject: function(a) {
            a = this.toObject(a);
            this.sourcePath && (a.path = this.sourcePath);
            delete a.sourcePath;
            return a
        },
        toSVG: function(a) {
            for (var c = [], b = this._createBaseSVGMarkup(), e = "", d = 0, f = this.path.length; d < f; d++) c.push(this.path[d].join(" "));
            c = c.join(" ");
            this.group &&
                "path-group" === this.group.type || (e = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") ");
            b.push("<path ", 'd="', c, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), e, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n");
            return a ? a(b.join("")) : b.join("")
        },
        complexity: function() {
            return this.path.length
        },
        _parsePath: function() {
            for (var a = [], c = [], b, e, d = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig, g, h = 0, t = this.path.length; h < t; h++) {
                b = this.path[h];
                g = b.slice(1).trim();
                for (c.length = 0; e = d.exec(g);) c.push(e[0]);
                b = [b.charAt(0)];
                g = 0;
                for (var q = c.length; g < q; g++) e = parseFloat(c[g]), isNaN(e) || b.push(e);
                e = b[0];
                g = f[e.toLowerCase()];
                q = k[e] || e;
                if (b.length - 1 > g)
                    for (var w = 1, x = b.length; w < x; w += g) a.push([e].concat(b.slice(w, w + g))), e = q;
                else a.push(b)
            }
            return a
        },
        _parseDimensions: function() {
            for (var c = [], d = [], f, g = null, h = 0, k = 0, v = 0, t = 0, q = 0, w = 0, x, p, r, z = 0, y = this.path.length; z < y; ++z) {
                f = this.path[z];
                switch (f[0]) {
                    case "l":
                        v += f[1];
                        t += f[2];
                        r = [];
                        break;
                    case "L":
                        v = f[1];
                        t = f[2];
                        r = [];
                        break;
                    case "h":
                        v +=
                            f[1];
                        r = [];
                        break;
                    case "H":
                        v = f[1];
                        r = [];
                        break;
                    case "v":
                        t += f[1];
                        r = [];
                        break;
                    case "V":
                        t = f[1];
                        r = [];
                        break;
                    case "m":
                        v += f[1];
                        t += f[2];
                        h = v;
                        k = t;
                        r = [];
                        break;
                    case "M":
                        v = f[1];
                        t = f[2];
                        h = v;
                        k = t;
                        r = [];
                        break;
                    case "c":
                        x = v + f[5];
                        p = t + f[6];
                        q = v + f[3];
                        w = t + f[4];
                        r = b.util.getBoundsOfCurve(v, t, v + f[1], t + f[2], q, w, x, p);
                        v = x;
                        t = p;
                        break;
                    case "C":
                        v = f[5];
                        t = f[6];
                        q = f[3];
                        w = f[4];
                        r = b.util.getBoundsOfCurve(v, t, f[1], f[2], q, w, v, t);
                        break;
                    case "s":
                        x = v + f[3];
                        p = t + f[4];
                        null === g[0].match(/[CcSs]/) ? (q = v, w = t) : (q = 2 * v - q, w = 2 * t - w);
                        r = b.util.getBoundsOfCurve(v, t,
                            q, w, v + f[1], t + f[2], x, p);
                        q = v + f[1];
                        w = t + f[2];
                        v = x;
                        t = p;
                        break;
                    case "S":
                        x = f[3];
                        p = f[4];
                        null === g[0].match(/[CcSs]/) ? (q = v, w = t) : (q = 2 * v - q, w = 2 * t - w);
                        r = b.util.getBoundsOfCurve(v, t, q, w, f[1], f[2], x, p);
                        v = x;
                        t = p;
                        q = f[1];
                        w = f[2];
                        break;
                    case "q":
                        x = v + f[3];
                        p = t + f[4];
                        q = v + f[1];
                        w = t + f[2];
                        r = b.util.getBoundsOfCurve(v, t, q, w, q, w, x, p);
                        v = x;
                        t = p;
                        break;
                    case "Q":
                        q = f[1];
                        w = f[2];
                        r = b.util.getBoundsOfCurve(v, t, q, w, q, w, f[3], f[4]);
                        v = f[3];
                        t = f[4];
                        break;
                    case "t":
                        x = v + f[1];
                        p = t + f[2];
                        null === g[0].match(/[QqTt]/) ? (q = v, w = t) : (q = 2 * v - q, w = 2 * t - w);
                        r = b.util.getBoundsOfCurve(v,
                            t, q, w, q, w, x, p);
                        v = x;
                        t = p;
                        break;
                    case "T":
                        x = f[1];
                        p = f[2];
                        null === g[0].match(/[QqTt]/) ? (q = v, w = t) : (q = 2 * v - q, w = 2 * t - w);
                        r = b.util.getBoundsOfCurve(v, t, q, w, q, w, x, p);
                        v = x;
                        t = p;
                        break;
                    case "a":
                        r = b.util.getBoundsOfArc(v, t, f[1], f[2], f[3], f[4], f[5], f[6] + v, f[7] + t);
                        v += f[6];
                        t += f[7];
                        break;
                    case "A":
                        r = b.util.getBoundsOfArc(v, t, f[1], f[2], f[3], f[4], f[5], f[6], f[7]);
                        v = f[6];
                        t = f[7];
                        break;
                    case "z":
                    case "Z":
                        v = h, t = k
                }
                g = f;
                r.forEach(function(a) {
                    c.push(a.x);
                    d.push(a.y)
                });
                c.push(v);
                d.push(t)
            }
            f = e(c) || 0;
            g = e(d) || 0;
            h = a(c) || 0;
            k = a(d) || 0;
            return {
                left: f,
                top: g,
                width: h - f,
                height: k - g
            }
        }
    }), b.Path.fromObject = function(a, c) {
        "string" === typeof a.path ? b.loadSVGFromURL(a.path, function(e) {
            e = e[0];
            var f = a.path;
            delete a.path;
            b.util.object.extend(e, a);
            e.setSourcePath(f);
            c(e)
        }) : c(new b.Path(a.path, a))
    }, b.Path.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat(["d"]), b.Path.fromElement = function(a, e, f) {
        a = b.parseAttributes(a, b.Path.ATTRIBUTE_NAMES);
        e && e(new b.Path(a.d, c(a, f)))
    }, b.Path.async = !0)
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend,
        a = b.util.array.invoke,
        c = b.Object.prototype.toObject;
    b.PathGroup ? b.warn("fabric.PathGroup is already defined") : (b.PathGroup = b.util.createClass(b.Path, {
        type: "path-group",
        fill: "",
        initialize: function(a, c) {
            c = c || {};
            this.paths = a || [];
            for (var b = this.paths.length; b--;) this.paths[b].group = this;
            c.toBeParsed && (this.parseDimensionsFromPaths(c), delete c.toBeParsed);
            this.setOptions(c);
            this.setCoords();
            c.sourcePath && this.setSourcePath(c.sourcePath)
        },
        parseDimensionsFromPaths: function(a) {
            for (var c, e, d = [], l = [], m, n = this.paths.length; n--;) {
                c = this.paths[n];
                e = c.height + c.strokeWidth;
                m = c.width + c.strokeWidth;
                c = [{
                    x: c.left,
                    y: c.top
                }, {
                    x: c.left + m,
                    y: c.top
                }, {
                    x: c.left,
                    y: c.top + e
                }, {
                    x: c.left + m,
                    y: c.top + e
                }];
                m = this.paths[n].transformMatrix;
                for (var u = 0; u < c.length; u++) e = c[u], m && (e = b.util.transformPoint(e, m, !1)), d.push(e.x), l.push(e.y)
            }
            a.width = Math.max.apply(null, d);
            a.height = Math.max.apply(null, l)
        },
        render: function(a) {
            if (this.visible) {
                a.save();
                this.transformMatrix && a.transform.apply(a,
                    this.transformMatrix);
                this.transform(a);
                this._setShadow(a);
                this.clipTo && b.util.clipContext(this, a);
                a.translate(-this.width / 2, -this.height / 2);
                for (var c = 0, e = this.paths.length; c < e; ++c) this.paths[c].render(a, !0);
                this.clipTo && a.restore();
                a.restore()
            }
        },
        _set: function(a, c) {
            if ("fill" === a && c && this.isSameColor())
                for (var b = this.paths.length; b--;) this.paths[b]._set(a, c);
            return this.callSuper("_set", a, c)
        },
        toObject: function(b) {
            b = e(c.call(this, b), {
                paths: a(this.getObjects(), "toObject", b)
            });
            this.sourcePath && (b.sourcePath =
                this.sourcePath);
            return b
        },
        toDatalessObject: function(a) {
            a = this.toObject(a);
            this.sourcePath && (a.paths = this.sourcePath);
            return a
        },
        toSVG: function(a) {
            for (var c = this.getObjects(), b = this.getPointByOrigin("left", "top"), b = "translate(" + b.x + " " + b.y + ")", b = ["<g ", 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), b, this.getSvgTransform(), '" ', ">\n"], e = 0, d = c.length; e < d; e++) b.push(c[e].toSVG(a));
            b.push("</g>\n");
            return a ? a(b.join("")) : b.join("")
        },
        toString: function() {
            return "#<fabric.PathGroup (" +
                this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
        },
        isSameColor: function() {
            var a = (this.getObjects()[0].get("fill") || "").toLowerCase();
            return this.getObjects().every(function(c) {
                return (c.get("fill") || "").toLowerCase() === a
            })
        },
        complexity: function() {
            return this.paths.reduce(function(a, c) {
                return a + (c && c.complexity ? c.complexity() : 0)
            }, 0)
        },
        getObjects: function() {
            return this.paths
        }
    }), b.PathGroup.fromObject = function(a, c) {
        "string" === typeof a.paths ? b.loadSVGFromURL(a.paths, function(e) {
            var d = a.paths;
            delete a.paths;
            e = b.util.groupSVGElements(e, a, d);
            c(e)
        }) : b.util.enlivenObjects(a.paths, function(e) {
            delete a.paths;
            c(new b.PathGroup(e, a))
        })
    }, b.PathGroup.async = !0)
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend,
        a = b.util.array.min,
        c = b.util.array.max,
        h = b.util.array.invoke;
    if (!b.Group) {
        var g = {
            lockMovementX: !0,
            lockMovementY: !0,
            lockRotation: !0,
            lockScalingX: !0,
            lockScalingY: !0,
            lockUniScaling: !0
        };
        b.Group = b.util.createClass(b.Object, b.Collection, {
            type: "group",
            strokeWidth: 0,
            initialize: function(a, c, b) {
                c = c || {};
                this._objects = [];
                b && this.callSuper("initialize", c);
                this._objects = a || [];
                for (a = this._objects.length; a--;) this._objects[a].group = this;
                this.originalState = {};
                c.originX && (this.originX = c.originX);
                c.originY && (this.originY = c.originY);
                b ? this._updateObjectsCoords(!0) : (this._calcBounds(), this._updateObjectsCoords(), this.callSuper("initialize", c));
                this.setCoords();
                this.saveCoords()
            },
            _updateObjectsCoords: function(a) {
                for (var c = this._objects.length; c--;) this._updateObjectCoords(this._objects[c], a)
            },
            _updateObjectCoords: function(a, c) {
                a.__origHasControls = a.hasControls;
                a.hasControls = !1;
                if (!c) {
                    var b = a.getLeft(),
                        e = a.getTop(),
                        d = this.getCenterPoint();
                    a.set({
                        originalLeft: b,
                        originalTop: e,
                        left: b - d.x,
                        top: e - d.y
                    });
                    a.setCoords()
                }
            },
            toString: function() {
                return "#<fabric.Group: (" + this.complexity() + ")>"
            },
            addWithUpdate: function(a) {
                this._restoreObjectsState();
                a && (this._objects.push(a), a.group = this, a._set("canvas", this.canvas));
                this.forEachObject(this._setObjectActive, this);
                this._calcBounds();
                this._updateObjectsCoords();
                return this
            },
            _setObjectActive: function(a) {
                a.set("active", !0);
                a.group = this
            },
            removeWithUpdate: function(a) {
                this._moveFlippedObject(a);
                this._restoreObjectsState();
                this.forEachObject(this._setObjectActive,
                    this);
                this.remove(a);
                this._calcBounds();
                this._updateObjectsCoords();
                return this
            },
            _onObjectAdded: function(a) {
                a.group = this;
                a._set("canvas", this.canvas)
            },
            _onObjectRemoved: function(a) {
                delete a.group;
                a.set("active", !1)
            },
            delegatedProperties: {
                fill: !0,
                opacity: !0,
                fontFamily: !0,
                fontWeight: !0,
                fontSize: !0,
                fontStyle: !0,
                lineHeight: !0,
                textDecoration: !0,
                textAlign: !0,
                backgroundColor: !0
            },
            _set: function(a, c) {
                var b = this._objects.length;
                if (this.delegatedProperties[a] || "canvas" === a)
                    for (; b--;) this._objects[b].set(a, c);
                else
                    for (; b--;) this._objects[b].setOnGroup(a,
                        c);
                this.callSuper("_set", a, c)
            },
            toObject: function(a) {
                return e(this.callSuper("toObject", a), {
                    objects: h(this._objects, "toObject", a)
                })
            },
            render: function(a) {
                if (this.visible) {
                    a.save();
                    this.transformMatrix && a.transform.apply(a, this.transformMatrix);
                    this.transform(a);
                    this.clipTo && b.util.clipContext(this, a);
                    for (var c = 0, e = this._objects.length; c < e; c++) this._renderObject(this._objects[c], a);
                    this.clipTo && a.restore();
                    a.restore()
                }
            },
            _renderControls: function(a, c) {
                this.callSuper("_renderControls", a, c);
                for (var b = 0, e =
                        this._objects.length; b < e; b++) this._objects[b]._renderControls(a)
            },
            _renderObject: function(a, c) {
                if (a.visible) {
                    var b = a.hasRotatingPoint;
                    a.hasRotatingPoint = !1;
                    a.render(c);
                    a.hasRotatingPoint = b
                }
            },
            _restoreObjectsState: function() {
                this._objects.forEach(this._restoreObjectState, this);
                return this
            },
            realizeTransform: function(a) {
                this._moveFlippedObject(a);
                this._setObjectPosition(a);
                return a
            },
            _moveFlippedObject: function(a) {
                var c = a.get("originX"),
                    b = a.get("originY"),
                    e = a.getCenterPoint();
                a.set({
                    originX: "center",
                    originY: "center",
                    left: e.x,
                    top: e.y
                });
                this._toggleFlipping(a);
                e = a.getPointByOrigin(c, b);
                a.set({
                    originX: c,
                    originY: b,
                    left: e.x,
                    top: e.y
                });
                return this
            },
            _toggleFlipping: function(a) {
                this.flipX && (a.toggle("flipX"), a.set("left", -a.get("left")), a.setAngle(-a.getAngle()));
                this.flipY && (a.toggle("flipY"), a.set("top", -a.get("top")), a.setAngle(-a.getAngle()))
            },
            _restoreObjectState: function(a) {
                this._setObjectPosition(a);
                a.setCoords();
                a.hasControls = a.__origHasControls;
                delete a.__origHasControls;
                a.set("active", !1);
                a.setCoords();
                delete a.group;
                return this
            },
            _setObjectPosition: function(a) {
                var c = this.getCenterPoint(),
                    b = this._getRotatedLeftTop(a);
                a.set({
                    angle: a.getAngle() + this.getAngle(),
                    left: c.x + b.left,
                    top: c.y + b.top,
                    scaleX: a.get("scaleX") * this.get("scaleX"),
                    scaleY: a.get("scaleY") * this.get("scaleY")
                })
            },
            _getRotatedLeftTop: function(a) {
                var c = this.getAngle() * (Math.PI / 180);
                return {
                    left: -Math.sin(c) * a.getTop() * this.get("scaleY") + Math.cos(c) * a.getLeft() * this.get("scaleX"),
                    top: Math.cos(c) * a.getTop() * this.get("scaleY") + Math.sin(c) * a.getLeft() * this.get("scaleX")
                }
            },
            destroy: function() {
                this._objects.forEach(this._moveFlippedObject, this);
                return this._restoreObjectsState()
            },
            saveCoords: function() {
                this._originalLeft = this.get("left");
                this._originalTop = this.get("top");
                return this
            },
            hasMoved: function() {
                return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
            },
            setObjectsCoords: function() {
                this.forEachObject(function(a) {
                    a.setCoords()
                });
                return this
            },
            _calcBounds: function(a) {
                for (var c = [], b = [], e, d, g = ["tr", "br", "bl", "tl"], h = 0, D = this._objects.length, v,
                        t = g.length; h < D; ++h)
                    for (e = this._objects[h], e.setCoords(), v = 0; v < t; v++) d = g[v], c.push(e.oCoords[d].x), b.push(e.oCoords[d].y);
                this.set(this._getBounds(c, b, a))
            },
            _getBounds: function(e, d, g) {
                var h = b.util.invertTransform(this.getViewportTransform()),
                    n = b.util.transformPoint(new b.Point(a(e), a(d)), h);
                e = b.util.transformPoint(new b.Point(c(e), c(d)), h);
                e = {
                    width: e.x - n.x || 0,
                    height: e.y - n.y || 0
                };
                g || (e.left = n.x || 0, e.top = n.y || 0, "center" === this.originX && (e.left += e.width / 2), "right" === this.originX && (e.left += e.width), "center" ===
                    this.originY && (e.top += e.height / 2), "bottom" === this.originY && (e.top += e.height));
                return e
            },
            toSVG: function(a) {
                for (var c = ["<g ", 'transform="', this.getSvgTransform(), '">\n'], b = 0, e = this._objects.length; b < e; b++) c.push(this._objects[b].toSVG(a));
                c.push("</g>\n");
                return a ? a(c.join("")) : c.join("")
            },
            get: function(a) {
                if (a in g) {
                    if (this[a]) return this[a];
                    for (var c = 0, b = this._objects.length; c < b; c++)
                        if (this._objects[c][a]) return !0;
                    return !1
                }
                return a in this.delegatedProperties ? this._objects[0] && this._objects[0].get(a) :
                    this[a]
            }
        });
        b.Group.fromObject = function(a, c) {
            b.util.enlivenObjects(a.objects, function(e) {
                delete a.objects;
                c && c(new b.Group(e, a, !0))
            })
        };
        b.Group.async = !0
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = fabric.util.object.extend;
    d.fabric || (d.fabric = {});
    d.fabric.Image ? fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        alignX: "none",
        alignY: "none",
        meetOrSlice: "meet",
        _lastScaleX: 1,
        _lastScaleY: 1,
        initialize: function(b, a) {
            a || (a = {});
            this.filters = [];
            this.resizeFilters = [];
            this.callSuper("initialize", a);
            this._initElement(b, a)
        },
        getElement: function() {
            return this._element
        },
        setElement: function(b, a, c) {
            this._originalElement =
                this._element = b;
            this._initConfig(c);
            0 !== this.filters.length ? this.applyFilters(a) : a && a();
            return this
        },
        setCrossOrigin: function(b) {
            this.crossOrigin = b;
            this._element.crossOrigin = b;
            return this
        },
        getOriginalSize: function() {
            var b = this.getElement();
            return {
                width: b.width,
                height: b.height
            }
        },
        _stroke: function(b) {
            b.save();
            this._setStrokeStyles(b);
            b.beginPath();
            b.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
            b.closePath();
            b.restore()
        },
        _renderDashedStroke: function(b) {
            var a = -this.width / 2,
                c = -this.height /
                2,
                d = this.width,
                g = this.height;
            b.save();
            this._setStrokeStyles(b);
            b.beginPath();
            fabric.util.drawDashedLine(b, a, c, a + d, c, this.strokeDashArray);
            fabric.util.drawDashedLine(b, a + d, c, a + d, c + g, this.strokeDashArray);
            fabric.util.drawDashedLine(b, a + d, c + g, a, c + g, this.strokeDashArray);
            fabric.util.drawDashedLine(b, a, c + g, a, c, this.strokeDashArray);
            b.closePath();
            b.restore()
        },
        toObject: function(e) {
            var a = [];
            this.filters.forEach(function(c) {
                c && a.push(c.toObject())
            });
            e = b(this.callSuper("toObject", e), {
                src: this._originalElement.src ||
                    this._originalElement._src,
                filters: a
            });
            0 < this.resizeFilters.length && (e.resizeFilters = this.resizeFilters.map(function(a) {
                return a && a.toObject()
            }));
            this.includeDefaultValues || this._removeDefaultValues(e);
            return e
        },
        toSVG: function(b) {
            var a = [],
                c = -this.width / 2,
                d = -this.height / 2,
                g = "none";
            this.group && "path-group" === this.group.type && (c = this.left, d = this.top);
            "none" !== this.alignX && "none" !== this.alignY && (g = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice);
            a.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(),
                '">\n', '<image xlink:href="', this.getSvgSrc(), '" x="', c, '" y="', d, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', g, '"', "></image>\n");
            if (this.stroke || this.strokeDashArray) g = this.fill, this.fill = null, a.push("<rect ", 'x="', c, '" y="', d, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'), this.fill = g;
            a.push("</g>\n");
            return b ? b(a.join("")) : a.join("")
        },
        getSrc: function() {
            if (this.getElement()) return this.getElement().src ||
                this.getElement()._src
        },
        setSrc: function(b, a, c) {
            fabric.util.loadImage(b, function(b) {
                return this.setElement(b, a, c)
            }, this, c && c.crossOrigin)
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
        },
        clone: function(b, a) {
            this.constructor.fromObject(this.toObject(a), b)
        },
        applyFilters: function(b, a, c, d) {
            a = a || this.filters;
            if (c = c || this._originalElement) {
                var g = c,
                    f = fabric.util.createCanvasElement(),
                    k = fabric.util.createImage(),
                    l = this;
                f.width = g.width;
                f.height = g.height;
                f.getContext("2d").drawImage(g,
                    0, 0, g.width, g.height);
                if (0 === a.length) return this._element = c, b && b(), f;
                a.forEach(function(a) {
                    a && a.applyTo(f, a.scaleX || l.scaleX, a.scaleY || l.scaleY);
                    !d && a && "Resize" === a.type && (l.width *= a.scaleX, l.height *= a.scaleY)
                });
                k.width = f.width;
                k.height = f.height;
                fabric.isLikelyNode ? (k.src = f.toBuffer(void 0, fabric.Image.pngCompression), l._element = k, !d && (l._filteredEl = k), b && b()) : (k.onload = function() {
                    l._element = k;
                    !d && (l._filteredEl = k);
                    b && b();
                    k.onload = f = g = null
                }, k.src = f.toDataURL("image/png"));
                return f
            }
        },
        _render: function(b,
            a) {
            var c, d, g = this._findMargins(),
                f;
            c = a ? this.left : -this.width / 2;
            d = a ? this.top : -this.height / 2;
            "slice" === this.meetOrSlice && (b.beginPath(), b.rect(c, d, this.width, this.height), b.clip());
            !1 === this.isMoving && this.resizeFilters.length && this._needsResize() ? (this._lastScaleX = this.scaleX, this._lastScaleY = this.scaleY, f = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, !0)) : f = this._element;
            f && b.drawImage(f, c + g.marginX, d + g.marginY, g.width, g.height);
            this._renderStroke(b)
        },
        _needsResize: function() {
            return this.scaleX !==
                this._lastScaleX || this.scaleY !== this._lastScaleY
        },
        _findMargins: function() {
            var b = this.width,
                a = this.height,
                c = 0,
                d = 0;
            if ("none" !== this.alignX || "none" !== this.alignY) b = [this.width / this._element.width, this.height / this._element.height], a = "meet" === this.meetOrSlice ? Math.min.apply(null, b) : Math.max.apply(null, b), b = this._element.width * a, a *= this._element.height, "Mid" === this.alignX && (c = (this.width - b) / 2), "Max" === this.alignX && (c = this.width - b), "Mid" === this.alignY && (d = (this.height - a) / 2), "Max" === this.alignY && (d = this.height -
                a);
            return {
                width: b,
                height: a,
                marginX: c,
                marginY: d
            }
        },
        _resetWidthHeight: function() {
            var b = this.getElement();
            this.set("width", b.width);
            this.set("height", b.height)
        },
        _initElement: function(b, a) {
            this.setElement(fabric.util.getById(b), null, a);
            fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
        },
        _initConfig: function(b) {
            b || (b = {});
            this.setOptions(b);
            this._setWidthHeight(b);
            this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
        },
        _initFilters: function(b, a) {
            b && b.length ? fabric.util.enlivenObjects(b,
                function(c) {
                    a && a(c)
                }, "fabric.Image.filters") : a && a()
        },
        _setWidthHeight: function(b) {
            this.width = "width" in b ? b.width : this.getElement() ? this.getElement().width || 0 : 0;
            this.height = "height" in b ? b.height : this.getElement() ? this.getElement().height || 0 : 0
        },
        complexity: function() {
            return 1
        }
    }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(b, a) {
        fabric.util.loadImage(b.src, function(c) {
            fabric.Image.prototype._initFilters.call(b, b.filters,
                function(d) {
                    b.filters = d || [];
                    fabric.Image.prototype._initFilters.call(b, b.resizeFilters, function(d) {
                        b.resizeFilters = d || [];
                        d = new fabric.Image(c, b);
                        a && a(d)
                    })
                })
        }, null, b.crossOrigin)
    }, fabric.Image.fromURL = function(b, a, c) {
        fabric.util.loadImage(b, function(b) {
            a && a(new fabric.Image(b, c))
        }, null, c && c.crossOrigin)
    }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" ")), fabric.Image.fromElement = function(e, a, c) {
        e = fabric.parseAttributes(e, fabric.Image.ATTRIBUTE_NAMES);
        var d = "xMidYMid",
            g = "meet",
            f;
        e.preserveAspectRatio && (f = e.preserveAspectRatio.split(" "));
        f && f.length && (g = f.pop(), "meet" !== g && "slice" !== g ? (d = g, g = "meet") : f.length && (d = f.pop()));
        f = "none" !== d ? d.slice(1, 4) : "none";
        d = "none" !== d ? d.slice(5, 8) : "none";
        e.alignX = f;
        e.alignY = d;
        e.meetOrSlice = g;
        fabric.Image.fromURL(e["xlink:href"], a, b(c ? fabric.util.object.clone(c) : {}, e))
    }, fabric.Image.async = !0, fabric.Image.pngCompression = 1)
})("undefined" !== typeof exports ? exports : this);
fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function() {
        var d = this.getAngle() % 360;
        return 0 < d ? 90 * Math.round((d - 1) / 90) : 90 * Math.round(d / 90)
    },
    straighten: function() {
        this.setAngle(this._getAngleValueForStraighten());
        return this
    },
    fxStraighten: function(d) {
        d = d || {};
        var b = function() {},
            e = d.onComplete || b,
            a = d.onChange || b,
            c = this;
        fabric.util.animate({
            startValue: this.get("angle"),
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: function(b) {
                c.setAngle(b);
                a()
            },
            onComplete: function() {
                c.setCoords();
                e()
            },
            onStart: function() {
                c.set("active", !1)
            }
        });
        return this
    }
});
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function(d) {
        d.straighten();
        this.renderAll();
        return this
    },
    fxStraightenObject: function(d) {
        d.fxStraighten({
            onChange: this.renderAll.bind(this)
        });
        return this
    }
});
fabric.Image.filters = fabric.Image.filters || {};
fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: "BaseFilter",
    initialize: function(d) {
        d && this.setOptions(d)
    },
    setOptions: function(d) {
        for (var b in d) this[b] = d[b]
    },
    toObject: function() {
        return {
            type: this.type
        }
    },
    toJSON: function() {
        return this.toObject()
    }
});
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Brightness = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Brightness",
        initialize: function(a) {
            a = a || {};
            this.brightness = a.brightness || 0
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            for (var b = a.data, e = this.brightness, d = 0, k = b.length; d < k; d += 4) b[d] += e, b[d + 1] += e, b[d + 2] += e;
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                brightness: this.brightness
            })
        }
    });
    b.Image.filters.Brightness.fromObject = function(a) {
        return new b.Image.filters.Brightness(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Convolute = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Convolute",
        initialize: function(a) {
            a = a || {};
            this.opaque = a.opaque;
            this.matrix = a.matrix || [0, 0, 0, 0, 1, 0, 0, 0, 0];
            this.tmpCtx = b.util.createCanvasElement().getContext("2d")
        },
        _createImageData: function(a, c) {
            return this.tmpCtx.createImageData(a, c)
        },
        applyTo: function(a) {
            var c = this.matrix,
                b = a.getContext("2d"),
                e = b.getImageData(0, 0, a.width, a.height);
            a = Math.round(Math.sqrt(c.length));
            for (var d = Math.floor(a / 2), k = e.data, l = e.width, e = e.height, m = this._createImageData(l, e), n = m.data, u = this.opaque ? 1 : 0, A = 0; A < e; A++)
                for (var D = 0; D < l; D++) {
                    for (var v = A, t = D, q = 4 * (A * l + D), w = 0, x = 0, p = 0, r = 0, z = 0; z < a; z++)
                        for (var y = 0; y < a; y++) {
                            var B = v + z - d,
                                E = t + y - d;
                            0 > B || B > e || 0 > E || E > l || (B = 4 * (B * l + E), E = c[z * a + y], w += k[B] * E, x += k[B + 1] * E, p += k[B + 2] * E, r += k[B + 3] * E)
                        }
                    n[q] = w;
                    n[q + 1] = x;
                    n[q + 2] = p;
                    n[q + 3] = r + u * (255 - r)
                }
            b.putImageData(m, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                opaque: this.opaque,
                matrix: this.matrix
            })
        }
    });
    b.Image.filters.Convolute.fromObject =
        function(a) {
            return new b.Image.filters.Convolute(a)
        }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.GradientTransparency = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "GradientTransparency",
        initialize: function(a) {
            a = a || {};
            this.threshold = a.threshold || 100
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            for (var b = a.data, e = this.threshold, d = b.length, k = 0, l = b.length; k < l; k += 4) b[k + 3] = e + 255 * (d - k) / d;
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                threshold: this.threshold
            })
        }
    });
    b.Image.filters.GradientTransparency.fromObject = function(a) {
        return new b.Image.filters.GradientTransparency(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {});
    b.Image.filters.Grayscale = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Grayscale",
        applyTo: function(b) {
            var a = b.getContext("2d");
            b = a.getImageData(0, 0, b.width, b.height);
            for (var c = b.data, d = b.width * b.height * 4, g = 0, f; g < d;) f = (c[g] + c[g + 1] + c[g + 2]) / 3, c[g] = f, c[g + 1] = f, c[g + 2] = f, g += 4;
            a.putImageData(b, 0, 0)
        }
    });
    b.Image.filters.Grayscale.fromObject = function() {
        return new b.Image.filters.Grayscale
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {});
    b.Image.filters.Invert = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Invert",
        applyTo: function(b) {
            var a = b.getContext("2d");
            b = a.getImageData(0, 0, b.width, b.height);
            var c = b.data,
                d = c.length,
                g;
            for (g = 0; g < d; g += 4) c[g] = 255 - c[g], c[g + 1] = 255 - c[g + 1], c[g + 2] = 255 - c[g + 2];
            a.putImageData(b, 0, 0)
        }
    });
    b.Image.filters.Invert.fromObject = function() {
        return new b.Image.filters.Invert
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Mask = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Mask",
        initialize: function(a) {
            a = a || {};
            this.mask = a.mask;
            this.channel = -1 < [0, 1, 2, 3].indexOf(a.channel) ? a.channel : 0
        },
        applyTo: function(a) {
            if (this.mask) {
                var c = a.getContext("2d");
                a = c.getImageData(0, 0, a.width, a.height);
                var e = a.data,
                    d = this.mask.getElement(),
                    f = b.util.createCanvasElement(),
                    k = this.channel,
                    l = a.width * a.height * 4;
                f.width = d.width;
                f.height = d.height;
                f.getContext("2d").drawImage(d,
                    0, 0, d.width, d.height);
                f = f.getContext("2d").getImageData(0, 0, d.width, d.height).data;
                for (d = 0; d < l; d += 4) e[d + 3] = f[d + k];
                c.putImageData(a, 0, 0)
            }
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                mask: this.mask.toObject(),
                channel: this.channel
            })
        }
    });
    b.Image.filters.Mask.fromObject = function(a, c) {
        b.util.loadImage(a.mask.src, function(e) {
            a.mask = new b.Image(e, a.mask);
            c && c(new b.Image.filters.Mask(a))
        })
    };
    b.Image.filters.Mask.async = !0
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Noise = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Noise",
        initialize: function(a) {
            a = a || {};
            this.noise = a.noise || 0
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            for (var b = a.data, e = this.noise, d, k = 0, l = b.length; k < l; k += 4) d = (.5 - Math.random()) * e, b[k] += d, b[k + 1] += d, b[k + 2] += d;
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                noise: this.noise
            })
        }
    });
    b.Image.filters.Noise.fromObject =
        function(a) {
            return new b.Image.filters.Noise(a)
        }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Pixelate = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Pixelate",
        initialize: function(a) {
            a = a || {};
            this.blocksize = a.blocksize || 4
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            var b = a.data,
                e = a.height,
                d = a.width,
                k, l, m, n, u, A, D;
            for (l = 0; l < e; l += this.blocksize)
                for (m = 0; m < d; m += this.blocksize) {
                    k = 4 * l * d + 4 * m;
                    n = b[k];
                    u = b[k + 1];
                    A = b[k + 2];
                    D = b[k + 3];
                    for (var v = l, t = l + this.blocksize; v < t; v++)
                        for (var q =
                                m, w = m + this.blocksize; q < w; q++) k = 4 * v * d + 4 * q, b[k] = n, b[k + 1] = u, b[k + 2] = A, b[k + 3] = D
                }
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                blocksize: this.blocksize
            })
        }
    });
    b.Image.filters.Pixelate.fromObject = function(a) {
        return new b.Image.filters.Pixelate(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.RemoveWhite = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "RemoveWhite",
        initialize: function(a) {
            a = a || {};
            this.threshold = a.threshold || 30;
            this.distance = a.distance || 20
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            for (var b = a.data, e = this.distance, d = 255 - this.threshold, k = Math.abs, l, m, n, u = 0, A = b.length; u < A; u += 4) l = b[u], m = b[u + 1], n = b[u + 2], l > d && m > d && n > d && k(l - m) < e && k(l - n) < e && k(m - n) < e &&
                (b[u + 3] = 1);
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                threshold: this.threshold,
                distance: this.distance
            })
        }
    });
    b.Image.filters.RemoveWhite.fromObject = function(a) {
        return new b.Image.filters.RemoveWhite(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {});
    b.Image.filters.Sepia = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Sepia",
        applyTo: function(b) {
            var a = b.getContext("2d");
            b = a.getImageData(0, 0, b.width, b.height);
            var c = b.data,
                d = c.length,
                g, f;
            for (g = 0; g < d; g += 4) f = .3 * c[g] + .59 * c[g + 1] + .11 * c[g + 2], c[g] = f + 100, c[g + 1] = f + 50, c[g + 2] = f + 255;
            a.putImageData(b, 0, 0)
        }
    });
    b.Image.filters.Sepia.fromObject = function() {
        return new b.Image.filters.Sepia
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {});
    b.Image.filters.Sepia2 = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Sepia2",
        applyTo: function(b) {
            var a = b.getContext("2d");
            b = a.getImageData(0, 0, b.width, b.height);
            var c = b.data,
                d = c.length,
                g, f, k, l;
            for (g = 0; g < d; g += 4) f = c[g], k = c[g + 1], l = c[g + 2], c[g] = (.393 * f + .769 * k + .189 * l) / 1.351, c[g + 1] = (.349 * f + .686 * k + .168 * l) / 1.203, c[g + 2] = (.272 * f + .534 * k + .131 * l) / 2.14;
            a.putImageData(b, 0, 0)
        }
    });
    b.Image.filters.Sepia2.fromObject = function() {
        return new b.Image.filters.Sepia2
    }
})("undefined" !==
    typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Tint = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Tint",
        initialize: function(a) {
            a = a || {};
            this.color = a.color || "#000000";
            this.opacity = "undefined" !== typeof a.opacity ? a.opacity : (new b.Color(this.color)).getAlpha()
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            var e = a.data,
                d = e.length,
                f, k, l, m, n, u, A, D;
            f = (new b.Color(this.color)).getSource();
            k = f[0] * this.opacity;
            l = f[1] * this.opacity;
            m = f[2] * this.opacity;
            D = 1 - this.opacity;
            for (f = 0; f < d; f += 4) n = e[f], u = e[f + 1], A = e[f + 2], e[f] = k + n * D, e[f + 1] = l + u * D, e[f + 2] = m + A * D;
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                color: this.color,
                opacity: this.opacity
            })
        }
    });
    b.Image.filters.Tint.fromObject = function(a) {
        return new b.Image.filters.Tint(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend;
    b.Image.filters.Multiply = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Multiply",
        initialize: function(a) {
            a = a || {};
            this.color = a.color || "#000000"
        },
        applyTo: function(a) {
            var c = a.getContext("2d");
            a = c.getImageData(0, 0, a.width, a.height);
            var e = a.data,
                d = e.length,
                f, k;
            k = (new b.Color(this.color)).getSource();
            for (f = 0; f < d; f += 4) e[f] *= k[0] / 255, e[f + 1] *= k[1] / 255, e[f + 2] *= k[2] / 255;
            c.putImageData(a, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                color: this.color
            })
        }
    });
    b.Image.filters.Multiply.fromObject = function(a) {
        return new b.Image.filters.Multiply(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric;
    b.Image.filters.Blend = b.util.createClass({
        type: "Blend",
        initialize: function(b) {
            b = b || {};
            this.color = b.color || "#000";
            this.image = b.image || !1;
            this.mode = b.mode || "multiply";
            this.alpha = b.alpha || 1
        },
        applyTo: function(e) {
            var a = e.getContext("2d");
            e = a.getImageData(0, 0, e.width, e.height);
            var c = e.data,
                d, g, f, k, l, m, n, u = !1;
            this.image ? (u = !0, n = b.util.createCanvasElement(), n.width = this.image.width, n.height = this.image.height, n = new b.StaticCanvas(n), n.add(this.image), n = n.getContext("2d").getImageData(0,
                0, n.width, n.height).data) : (n = (new b.Color(this.color)).getSource(), d = n[0] * this.alpha, g = n[1] * this.alpha, f = n[2] * this.alpha);
            for (var A = 0, D = c.length; A < D; A += 4) switch (k = c[A], l = c[A + 1], m = c[A + 2], u && (d = n[A] * this.alpha, g = n[A + 1] * this.alpha, f = n[A + 2] * this.alpha), this.mode) {
                case "multiply":
                    c[A] = k * d / 255;
                    c[A + 1] = l * g / 255;
                    c[A + 2] = m * f / 255;
                    break;
                case "screen":
                    c[A] = 1 - (1 - k) * (1 - d);
                    c[A + 1] = 1 - (1 - l) * (1 - g);
                    c[A + 2] = 1 - (1 - m) * (1 - f);
                    break;
                case "add":
                    c[A] = Math.min(255, k + d);
                    c[A + 1] = Math.min(255, l + g);
                    c[A + 2] = Math.min(255, m + f);
                    break;
                case "diff":
                case "difference":
                    c[A] =
                        Math.abs(k - d);
                    c[A + 1] = Math.abs(l - g);
                    c[A + 2] = Math.abs(m - f);
                    break;
                case "subtract":
                    k -= d;
                    l -= g;
                    m -= f;
                    c[A] = 0 > k ? 0 : k;
                    c[A + 1] = 0 > l ? 0 : l;
                    c[A + 2] = 0 > m ? 0 : m;
                    break;
                case "darken":
                    c[A] = Math.min(k, d);
                    c[A + 1] = Math.min(l, g);
                    c[A + 2] = Math.min(m, f);
                    break;
                case "lighten":
                    c[A] = Math.max(k, d), c[A + 1] = Math.max(l, g), c[A + 2] = Math.max(m, f)
            }
            a.putImageData(e, 0, 0)
        },
        toObject: function() {
            return {
                color: this.color,
                image: this.image,
                mode: this.mode,
                alpha: this.alpha
            }
        }
    });
    b.Image.filters.Blend.fromObject = function(e) {
        return new b.Image.filters.Blend(e)
    }
})("undefined" !==
    typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = Math.pow,
        a = Math.floor,
        c = Math.sqrt,
        h = Math.abs,
        g = Math.max,
        f = Math.round,
        k = Math.sin,
        l = Math.ceil;
    b.Image.filters.Resize = b.util.createClass(b.Image.filters.BaseFilter, {
        type: "Resize",
        resizeType: "hermite",
        scaleX: 0,
        scaleY: 0,
        lanczosLobes: 3,
        applyTo: function(a, c, b) {
            this.rcpScaleX = 1 / c;
            this.rcpScaleY = 1 / b;
            var e = a.width,
                d = a.height;
            c = f(e * c);
            b = f(d * b);
            var g;
            "sliceHack" === this.resizeType && (g = this.sliceByTwo(a, e, d, c, b));
            "hermite" === this.resizeType && (g = this.hermiteFastResize(a,
                e, d, c, b));
            "bilinear" === this.resizeType && (g = this.bilinearFiltering(a, e, d, c, b));
            "lanczos" === this.resizeType && (g = this.lanczosResize(a, e, d, c, b));
            a.width = c;
            a.height = b;
            a.getContext("2d").putImageData(g, 0, 0)
        },
        sliceByTwo: function(c, e, d, f, h) {
            var k = c.getContext("2d"),
                l, q = .5,
                w = .5,
                x = 1,
                p = 1,
                r = !1,
                z = !1,
                y = e,
                B = d,
                E = b.util.createCanvasElement(),
                C = E.getContext("2d");
            f = a(f);
            h = a(h);
            E.width = g(f, e);
            E.height = g(h, d);
            f > e && (q = 2, x = -1);
            h > d && (w = 2, p = -1);
            l = k.getImageData(0, 0, e, d);
            c.width = g(f, e);
            c.height = g(h, d);
            for (k.putImageData(l,
                    0, 0); !r || !z;) e = y, d = B, f * x < a(y * q * x) ? y = a(y * q) : (y = f, r = !0), h * p < a(B * w * p) ? B = a(B * w) : (B = h, z = !0), l = k.getImageData(0, 0, e, d), C.putImageData(l, 0, 0), k.clearRect(0, 0, y, B), k.drawImage(E, 0, 0, e, d, 0, 0, y, B);
            return k.getImageData(0, 0, f, h)
        },
        lanczosResize: function(b, d, f, g, D) {
            var v, t, q, w;

            function x(b) {
                var k, l, m, p, K, Q, S, R, T, L;
                q = (b + .5) * E;
                v = a(q);
                for (k = 0; k < D; k++) {
                    w = (k + .5) * C;
                    t = a(w);
                    T = R = S = Q = K = 0;
                    for (l = v - J; l <= v + J; l++)
                        if (!(0 > l || l >= d)) {
                            L = a(1E3 * h(l - q));
                            H[L] || (H[L] = {});
                            for (var M = t - N; M <= t + N; M++) 0 > M || M >= f || (m = a(1E3 * h(M - w)), H[L][m] || (H[L][m] =
                                B(c(e(L * F, 2) + e(m * G, 2)) / 1E3)), m = H[L][m], 0 < m && (p = 4 * (M * d + l), K += m, Q += m * z[p], S += m * z[p + 1], R += m * z[p + 2], T += m * z[p + 3]))
                        }
                    p = 4 * (k * g + b);
                    y[p] = Q / K;
                    y[p + 1] = S / K;
                    y[p + 2] = R / K;
                    y[p + 3] = T / K
                }
                return ++b < g ? x(b) : r
            }
            b = b.getContext("2d");
            var p = b.getImageData(0, 0, d, f),
                r = b.getImageData(0, 0, g, D),
                z = p.data,
                y = r.data,
                B = function(a) {
                    return function(c) {
                        if (c > a) return 0;
                        c *= Math.PI;
                        if (1E-16 > h(c)) return 1;
                        var b = c / a;
                        return k(c) * k(b) / c / b
                    }
                }(this.lanczosLobes),
                E = this.rcpScaleX,
                C = this.rcpScaleY,
                F = 2 / this.rcpScaleX,
                G = 2 / this.rcpScaleY,
                J = l(E * this.lanczosLobes /
                    2),
                N = l(C * this.lanczosLobes / 2),
                H = {};
            t = v = w = q = void 0;
            return x(0)
        },
        bilinearFiltering: function(c, b, e, d, f) {
            var g, h, k, l, x, p, r, z, y, B, E = 0,
                C = this.rcpScaleX,
                F = this.rcpScaleY;
            r = c.getContext("2d");
            c = 4 * (b - 1);
            e = r.getImageData(0, 0, b, e).data;
            var G = r.getImageData(0, 0, d, f),
                J = G.data;
            for (r = 0; r < f; r++)
                for (z = 0; z < d; z++)
                    for (x = a(C * z), p = a(F * r), y = C * z - x, B = F * r - p, p = 4 * (p * b + x), x = 0; 4 > x; x++) g = e[p + x], h = e[p + 4 + x], k = e[p + c + x], l = e[p + c + 4 + x], g = g * (1 - y) * (1 - B) + h * y * (1 - B) + k * B * (1 - y) + l * y * B, J[E++] = g;
            return G
        },
        hermiteFastResize: function(b, e, d, f, g) {
            var k =
                this.rcpScaleX,
                t = this.rcpScaleY,
                q = l(k / 2),
                w = l(t / 2);
            b = b.getContext("2d");
            d = b.getImageData(0, 0, e, d).data;
            b = b.getImageData(0, 0, f, g);
            for (var x = b.data, p = 0; p < g; p++)
                for (var r = 0; r < f; r++) {
                    for (var z = 4 * (r + p * f), y = 0, B = 0, E = 0, C = 0, F = 0, G = 0, J = 0, N = (p + .5) * t, H = a(p * t); H < (p + 1) * t; H++)
                        for (var O = h(N - (H + .5)) / w, U = (r + .5) * k, O = O * O, P = a(r * k); P < (r + 1) * k; P++) {
                            var I = h(U - (P + .5)) / q,
                                y = c(O + I * I);
                            1 < y && -1 > y || (y = 2 * y * y * y - 3 * y * y + 1, 0 < y && (I = 4 * (P + H * e), J += y * d[I + 3], E += y, 255 > d[I + 3] && (y = y * d[I + 3] / 250), C += y * d[I], F += y * d[I + 1], G += y * d[I + 2], B += y))
                        }
                    x[z] = C / B;
                    x[z +
                        1] = F / B;
                    x[z + 2] = G / B;
                    x[z + 3] = J / E
                }
            return b
        },
        toObject: function() {
            return {
                type: this.type,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                resizeType: this.resizeType,
                lanczosLobes: this.lanczosLobes
            }
        }
    });
    b.Image.filters.Resize.fromObject = function(a) {
        return new b.Image.filters.Resize(a)
    }
})("undefined" !== typeof exports ? exports : this);
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.extend,
        a = b.util.object.clone,
        c = b.util.toFixed,
        h = b.StaticCanvas.supports("setLineDash"),
        g = b.Object.NUM_FRACTION_DIGITS;
    b.Text ? b.warn("fabric.Text is already defined") : (d = b.Object.prototype.stateProperties.concat(), d.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor"), b.Text = b.util.createClass(b.Object, {
        _dimensionAffectingProps: {
            fontSize: !0,
            fontWeight: !0,
            fontFamily: !0,
            fontStyle: !0,
            lineHeight: !0,
            stroke: !0,
            strokeWidth: !0,
            text: !0,
            textAlign: !0
        },
        _reNewline: /\r?\n/,
        _reSpacesAndTabs: /[ \t\r]+/g,
        type: "text",
        fontSize: 40,
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        textDecoration: "",
        textAlign: "left",
        fontStyle: "",
        lineHeight: 1.16,
        textBackgroundColor: "",
        stateProperties: d,
        stroke: null,
        shadow: null,
        _fontSizeFraction: .25,
        _fontSizeMult: 1.13,
        initialize: function(a, c) {
            c = c || {};
            this.text = a;
            this.__skipDimension = !0;
            this.setOptions(c);
            this.__skipDimension = !1;
            this._initDimensions()
        },
        _initDimensions: function(a) {
            if (!this.__skipDimension) {
                a || (a = b.util.createCanvasElement().getContext("2d"), this._setTextStyles(a));
                this._textLines = this._splitTextIntoLines();
                this._clearCache();
                var c = this.textAlign;
                this.textAlign = "left";
                this.width = this._getTextWidth(a);
                this.textAlign = c;
                this.height = this._getTextHeight(a)
            }
        },
        toString: function() {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
        },
        _render: function(a) {
            this.clipTo && b.util.clipContext(this,
                a);
            a.save();
            this._setOpacity(a);
            this._setShadow(a);
            this._setupCompositeOperation(a);
            this._renderTextBackground(a);
            this._renderText(a);
            this._renderTextDecoration(a);
            a.restore();
            this.clipTo && a.restore()
        },
        _renderText: function(a) {
            this._translateForTextAlign(a);
            this._renderTextFill(a);
            this._renderTextStroke(a)
        },
        _translateForTextAlign: function(a) {
            "left" !== this.textAlign && "justify" !== this.textAlign && a.translate("center" === this.textAlign ? this.width / 2 : this.width, 0)
        },
        _setTextStyles: function(a) {
            a.textBaseline =
                "alphabetic";
            this.skipTextAlign || (a.textAlign = this.textAlign);
            a.font = this._getFontDeclaration()
        },
        _getTextHeight: function() {
            return this._textLines.length * this._getHeightOfLine()
        },
        _getTextWidth: function(a) {
            for (var c = this._getLineWidth(a, 0), b = 1, e = this._textLines.length; b < e; b++) {
                var d = this._getLineWidth(a, b);
                d > c && (c = d)
            }
            return c
        },
        _renderChars: function(a, c, b, e, d) {
            var g = a.slice(0, -4);
            if (this[g].toLive) {
                var h = -this.width / 2 + this[g].offsetX || 0,
                    D = -this.height / 2 + this[g].offsetY || 0;
                c.save();
                c.translate(h, D);
                e -=
                    h;
                d -= D
            }
            c[a](b, e, d);
            this[g].toLive && c.restore()
        },
        _renderTextLine: function(a, c, b, e, d, g) {
            d -= this.fontSize * this._fontSizeFraction;
            if ("justify" !== this.textAlign) this._renderChars(a, c, b, e, d, g);
            else {
                var h = this._getLineWidth(c, g),
                    D = this.width;
                if (D >= h) {
                    h = b.split(/\s+/);
                    b = this._getWidthOfWords(c, b, g);
                    for (var D = (D - b) / (h.length - 1), v = b = 0, t = h.length; v < t; v++) this._renderChars(a, c, h[v], e + b, d, g), b += c.measureText(h[v]).width + D
                } else this._renderChars(a, c, b, e, d, g)
            }
        },
        _getWidthOfWords: function(a, c) {
            return a.measureText(c.replace(/\s+/g,
                "")).width
        },
        _getLeftOffset: function() {
            return -this.width / 2
        },
        _getTopOffset: function() {
            return -this.height / 2
        },
        _renderTextFill: function(a) {
            if (this.fill || this._skipFillStrokeCheck)
                for (var c = 0, b = 0, e = this._textLines.length; b < e; b++) {
                    var d = this._getHeightOfLine(a, b),
                        g = d / this.lineHeight;
                    this._renderTextLine("fillText", a, this._textLines[b], this._getLeftOffset(), this._getTopOffset() + c + g, b);
                    c += d
                }
        },
        _renderTextStroke: function(a) {
            if (this.stroke && 0 !== this.strokeWidth || this._skipFillStrokeCheck) {
                var c = 0;
                this.shadow &&
                    !this.shadow.affectStroke && this._removeShadow(a);
                a.save();
                this.strokeDashArray && (1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), h && a.setLineDash(this.strokeDashArray));
                a.beginPath();
                for (var b = 0, e = this._textLines.length; b < e; b++) {
                    var d = this._getHeightOfLine(a, b),
                        g = d / this.lineHeight;
                    this._renderTextLine("strokeText", a, this._textLines[b], this._getLeftOffset(), this._getTopOffset() + c + g, b);
                    c += d
                }
                a.closePath();
                a.restore()
            }
        },
        _getHeightOfLine: function() {
            return this.fontSize *
                this._fontSizeMult * this.lineHeight
        },
        _renderTextBackground: function(a) {
            this._renderTextBoxBackground(a);
            this._renderTextLinesBackground(a)
        },
        _renderTextBoxBackground: function(a) {
            this.backgroundColor && (a.save(), a.fillStyle = this.backgroundColor, a.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height), a.restore())
        },
        _renderTextLinesBackground: function(a) {
            var c = 0,
                b = this._getHeightOfLine();
            if (this.textBackgroundColor) {
                a.save();
                a.fillStyle = this.textBackgroundColor;
                for (var e = 0, d = this._textLines.length; e <
                    d; e++) {
                    if ("" !== this._textLines[e]) {
                        var g = this._getLineWidth(a, e),
                            h = this._getLineLeftOffset(g);
                        a.fillRect(this._getLeftOffset() + h, this._getTopOffset() + c, g, this.fontSize * this._fontSizeMult)
                    }
                    c += b
                }
                a.restore()
            }
        },
        _getLineLeftOffset: function(a) {
            return "center" === this.textAlign ? (this.width - a) / 2 : "right" === this.textAlign ? this.width - a : 0
        },
        _clearCache: function() {
            this.__lineWidths = [];
            this.__lineHeights = [];
            this.__lineOffsets = []
        },
        _shouldClearCache: function() {
            var a = !1;
            if (this._forceClearCache) return this._forceClearCache = !1, !0;
            for (var c in this._dimensionAffectingProps) this["__" + c] !== this[c] && (this["__" + c] = this[c], a = !0);
            return a
        },
        _getLineWidth: function(a, c) {
            if (this.__lineWidths[c]) return this.__lineWidths[c];
            this.__lineWidths[c] = a.measureText(this._textLines[c]).width;
            return this.__lineWidths[c]
        },
        _renderTextDecoration: function(a) {
            if (this.textDecoration) {
                var c = this.height / 2,
                    b = []; - 1 < this.textDecoration.indexOf("underline") && b.push(.85); - 1 < this.textDecoration.indexOf("line-through") && b.push(.43); - 1 < this.textDecoration.indexOf("overline") &&
                    b.push(-.12);
                if (0 < b.length) {
                    var e, d = 0,
                        g, h, D;
                    e = 0;
                    for (g = this._textLines.length; e < g; e++) {
                        var v = this._getLineWidth(a, e),
                            t = this._getLineLeftOffset(v),
                            q = this._getHeightOfLine(a, e);
                        h = 0;
                        for (D = b.length; h < D; h++) a.fillRect(this._getLeftOffset() + t, d + (this._fontSizeMult - 1 + b[h]) * this.fontSize - c, v, this.fontSize / 15);
                        d += q
                    }
                }
            }
        },
        _getFontDeclaration: function() {
            return [b.isLikelyNode ? this.fontWeight : this.fontStyle, b.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", b.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily].join(" ")
        },
        render: function(a, c) {
            this.visible && (a.save(), this._setTextStyles(a), this._shouldClearCache() && this._initDimensions(a), c || this.transform(a), this._setStrokeStyles(a), this._setFillStyles(a), this.transformMatrix && a.transform.apply(a, this.transformMatrix), this.group && "path-group" === this.group.type && a.translate(this.left, this.top), this._render(a), a.restore())
        },
        _splitTextIntoLines: function() {
            return this.text.split(this._reNewline)
        },
        toObject: function(a) {
            a = e(this.callSuper("toObject", a), {
                text: this.text,
                fontSize: this.fontSize,
                fontWeight: this.fontWeight,
                fontFamily: this.fontFamily,
                fontStyle: this.fontStyle,
                lineHeight: this.lineHeight,
                textDecoration: this.textDecoration,
                textAlign: this.textAlign,
                textBackgroundColor: this.textBackgroundColor
            });
            this.includeDefaultValues || this._removeDefaultValues(a);
            return a
        },
        toSVG: function(a) {
            var c = this._createBaseSVGMarkup(),
                b = this._getSVGLeftTopOffsets(this.ctx),
                b = this._getSVGTextAndBg(b.textTop, b.textLeft);
            this._wrapSVGTextAndBg(c, b);
            return a ? a(c.join("")) : c.join("")
        },
        _getSVGLeftTopOffsets: function(a) {
            a =
                this._getHeightOfLine(a, 0);
            return {
                textLeft: -this.width / 2 + (this.group && "path-group" === this.group.type ? this.left : 0),
                textTop: 0 + (this.group && "path-group" === this.group.type ? -this.top : 0),
                lineTop: a
            }
        },
        _wrapSVGTextAndBg: function(a, c) {
            a.push('\t<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', c.textBgRects.join(""), "\t\t<text ", this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle +
                '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(), '" >', c.textSpans.join(""), "</text>\n", "\t</g>\n")
        },
        _getSVGTextAndBg: function(a, c) {
            var b = [],
                e = [],
                d = 0;
            this._setSVGBg(e);
            for (var g = 0, h = this._textLines.length; g < h; g++) this.textBackgroundColor && this._setSVGTextLineBg(e, g, c, a, d), this._setSVGTextLineText(g, b, d, c, a, e), d += this._getHeightOfLine(this.ctx, g);
            return {
                textSpans: b,
                textBgRects: e
            }
        },
        _setSVGTextLineText: function(a,
            e, d, h, n) {
            d = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - n + d - this.height / 2;
            e.push('<tspan x="', c(h + this._getLineLeftOffset(this.__lineWidths[a]), g), '" ', 'y="', c(d, g), '" ', this._getFillAttributes(this.fill), ">", b.util.string.escapeXml(this._textLines[a]), "</tspan>")
        },
        _setSVGTextLineBg: function(a, b, e, d, h) {
            a.push("\t\t<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', c(e + this._getLineLeftOffset(this.__lineWidths[b]), g), '" y="', c(h - this.height / 2, g), '" width="', c(this.__lineWidths[b],
                g), '" height="', c(this._getHeightOfLine(this.ctx, b) / this.lineHeight, g), '"></rect>\n')
        },
        _setSVGBg: function(a) {
            this.backgroundColor && a.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', c(-this.width / 2, g), '" y="', c(-this.height / 2, g), '" width="', c(this.width, g), '" height="', c(this.height, g), '"></rect>\n')
        },
        _getFillAttributes: function(a) {
            var c = a && "string" === typeof a ? new b.Color(a) : "";
            return c && c.getSource() && 1 !== c.getAlpha() ? 'opacity="' + c.getAlpha() + '" fill="' + c.setAlpha(1).toRgb() +
                '"' : 'fill="' + a + '"'
        },
        _set: function(a, c) {
            this.callSuper("_set", a, c);
            a in this._dimensionAffectingProps && (this._initDimensions(), this.setCoords())
        },
        complexity: function() {
            return 1
        }
    }), b.Text.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")), b.Text.DEFAULT_SVG_FONT_SIZE = 16, b.Text.fromElement = function(a, c) {
        if (!a) return null;
        var e = b.parseAttributes(a, b.Text.ATTRIBUTE_NAMES);
        c = b.util.object.extend(c ? b.util.object.clone(c) : {}, e);
        c.top = c.top || 0;
        c.left = c.left || 0;
        "dx" in e && (c.left += e.dx);
        "dy" in e && (c.top += e.dy);
        "fontSize" in c || (c.fontSize = b.Text.DEFAULT_SVG_FONT_SIZE);
        c.originX || (c.originX = "left");
        var e = a.textContent.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " "),
            e = new b.Text(e, c),
            d = 0;
        "left" === e.originX && (d = e.getWidth() / 2);
        "right" === e.originX && (d = -e.getWidth() / 2);
        e.set({
            left: e.getLeft() + d,
            top: e.getTop() - e.getHeight() / 2 + e.fontSize * (.18 + e._fontSizeFraction)
        });
        return e
    }, b.Text.fromObject = function(c) {
        return new b.Text(c.text,
            a(c))
    }, b.util.createAccessors(b.Text))
})("undefined" !== typeof exports ? exports : this);
(function() {
    var d = fabric.util.object.clone;
    fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
        type: "i-text",
        selectionStart: 0,
        selectionEnd: 0,
        selectionColor: "rgba(17,119,255,0.3)",
        isEditing: !1,
        editable: !0,
        editingBorderColor: "rgba(102,153,255,0.25)",
        cursorWidth: 2,
        cursorColor: "#333",
        cursorDelay: 1E3,
        cursorDuration: 600,
        styles: null,
        caching: !0,
        _skipFillStrokeCheck: !1,
        _reSpace: /\s|\n/,
        _currentCursorOpacity: 0,
        _selectionDirection: null,
        _abortCursorAnimation: !1,
        _charWidthsCache: {},
        initialize: function(b,
            e) {
            this.styles = e ? e.styles || {} : {};
            this.callSuper("initialize", b, e);
            this.initBehavior()
        },
        _clearCache: function() {
            this.callSuper("_clearCache");
            this.__maxFontHeights = [];
            this.__widthOfSpace = []
        },
        isEmptyStyles: function() {
            if (!this.styles) return !0;
            var b = this.styles,
                e;
            for (e in b)
                for (var a in b[e])
                    for (var c in b[e][a]) return !1;
            return !0
        },
        setSelectionStart: function(b) {
            b = Math.max(b, 0);
            this.selectionStart !== b && (this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                }),
                this.selectionStart = b);
            this._updateTextarea()
        },
        setSelectionEnd: function(b) {
            b = Math.min(b, this.text.length);
            this.selectionEnd !== b && (this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {
                target: this
            }), this.selectionEnd = b);
            this._updateTextarea()
        },
        getSelectionStyles: function(b, e) {
            if (2 === arguments.length) {
                for (var a = [], c = b; c < e; c++) a.push(this.getSelectionStyles(c));
                return a
            }
            a = this.get2DCursorLocation(b);
            return this._getStyleDeclaration(a.lineIndex, a.charIndex) || {}
        },
        setSelectionStyles: function(b) {
            if (this.selectionStart ===
                this.selectionEnd) this._extendStyles(this.selectionStart, b);
            else
                for (var e = this.selectionStart; e < this.selectionEnd; e++) this._extendStyles(e, b);
            this._forceClearCache = !0;
            return this
        },
        _extendStyles: function(b, e) {
            var a = this.get2DCursorLocation(b);
            this._getLineStyle(a.lineIndex) || this._setLineStyle(a.lineIndex, {});
            this._getStyleDeclaration(a.lineIndex, a.charIndex) || this._setStyleDeclaration(a.lineIndex, a.charIndex, {});
            fabric.util.object.extend(this._getStyleDeclaration(a.lineIndex, a.charIndex), e)
        },
        _render: function(b) {
            this.callSuper("_render",
                b);
            this.ctx = b;
            this.isEditing && this.renderCursorOrSelection()
        },
        renderCursorOrSelection: function() {
            if (this.active) {
                var b = this.text.split(""),
                    e, a;
                this.canvas.contextTop ? (a = this.canvas.contextTop, a.save(), a.transform.apply(a, this.canvas.viewportTransform), this.transform(a), this.transformMatrix && a.transform.apply(a, this.transformMatrix)) : (a = this.ctx, a.save());
                this.selectionStart === this.selectionEnd ? (e = this._getCursorBoundaries(b, "cursor"), this.renderCursor(e, a)) : (e = this._getCursorBoundaries(b, "selection"),
                    this.renderSelection(b, e, a));
                a.restore()
            }
        },
        get2DCursorLocation: function(b) {
            "undefined" === typeof b && (b = this.selectionStart);
            for (var e = this._textLines.length, a = 0; a < e; a++) {
                if (b <= this._textLines[a].length) return {
                    lineIndex: a,
                    charIndex: b
                };
                b -= this._textLines[a].length + 1
            }
            return {
                lineIndex: a - 1,
                charIndex: this._textLines[a - 1].length < b ? this._textLines[a - 1].length : b
            }
        },
        getCurrentCharStyle: function(b, e) {
            var a = this._getStyleDeclaration(b, 0 === e ? 0 : e - 1);
            return {
                fontSize: a && a.fontSize || this.fontSize,
                fill: a && a.fill || this.fill,
                textBackgroundColor: a && a.textBackgroundColor || this.textBackgroundColor,
                textDecoration: a && a.textDecoration || this.textDecoration,
                fontFamily: a && a.fontFamily || this.fontFamily,
                fontWeight: a && a.fontWeight || this.fontWeight,
                fontStyle: a && a.fontStyle || this.fontStyle,
                stroke: a && a.stroke || this.stroke,
                strokeWidth: a && a.strokeWidth || this.strokeWidth
            }
        },
        getCurrentCharFontSize: function(b, e) {
            var a = this._getStyleDeclaration(b, 0 === e ? 0 : e - 1);
            return a && a.fontSize ? a.fontSize : this.fontSize
        },
        getCurrentCharColor: function(b, e) {
            var a =
                this._getStyleDeclaration(b, 0 === e ? 0 : e - 1);
            return a && a.fill ? a.fill : this.cursorColor
        },
        _getCursorBoundaries: function(b, e) {
            var a = Math.round(this._getLeftOffset()),
                c = this._getTopOffset(),
                d = this._getCursorBoundariesOffsets(b, e);
            return {
                left: a,
                top: c,
                leftOffset: d.left + d.lineLeft,
                topOffset: d.top
            }
        },
        _getCursorBoundariesOffsets: function(b, e) {
            for (var a = 0, c = 0, d = 0, g = 0, f = 0, k = 0; k < this.selectionStart; k++) "\n" === b[k] ? (f = 0, g += this._getHeightOfLine(this.ctx, c), c++, d = 0) : (f += this._getWidthOfChar(this.ctx, b[k], c, d), d++), a =
                this._getCachedLineOffset(c);
            "cursor" === e && (g += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, c) / this.lineHeight - this.getCurrentCharFontSize(c, d) * (1 - this._fontSizeFraction));
            return {
                top: g,
                left: f,
                lineLeft: a
            }
        },
        _getCachedLineOffset: function(b) {
            var e = this._getLineWidth(this.ctx, b);
            return this.__lineOffsets[b] || (this.__lineOffsets[b] = this._getLineLeftOffset(e))
        },
        renderCursor: function(b, e) {
            var a = this.get2DCursorLocation(),
                c = a.lineIndex,
                a = a.charIndex,
                d = this.getCurrentCharFontSize(c, a),
                g = 0 === c &&
                0 === a ? this._getCachedLineOffset(c) : b.leftOffset;
            e.fillStyle = this.getCurrentCharColor(c, a);
            e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
            e.fillRect(b.left + g, b.top + b.topOffset, this.cursorWidth / this.scaleX, d)
        },
        renderSelection: function(b, e, a) {
            a.fillStyle = this.selectionColor;
            b = this.get2DCursorLocation(this.selectionStart);
            for (var c = this.get2DCursorLocation(this.selectionEnd), d = b.lineIndex, g = c.lineIndex, f = d; f <= g; f++) {
                var k = this._getCachedLineOffset(f) || 0,
                    l = this._getHeightOfLine(this.ctx,
                        f),
                    m = 0,
                    n = this._textLines[f];
                if (f === d)
                    for (var u = 0, A = n.length; u < A; u++) u >= b.charIndex && (f !== g || u < c.charIndex) && (m += this._getWidthOfChar(a, n[u], f, u)), u < b.charIndex && (k += this._getWidthOfChar(a, n[u], f, u));
                else if (f > d && f < g) m += this._getLineWidth(a, f) || 5;
                else if (f === g)
                    for (u = 0, A = c.charIndex; u < A; u++) m += this._getWidthOfChar(a, n[u], f, u);
                a.fillRect(e.left + k, e.top + e.topOffset, m, l);
                e.topOffset += l
            }
        },
        _renderChars: function(b, e, a, c, d, g) {
            if (this.isEmptyStyles()) return this._renderCharsFast(b, e, a, c, d);
            this.skipTextAlign = !0;
            c -= "center" === this.textAlign ? this.width / 2 : "right" === this.textAlign ? this.width : 0;
            var f = this._getHeightOfLine(e, g),
                k = this._getCachedLineOffset(g),
                l, m = "";
            c += k || 0;
            e.save();
            d -= f / this.lineHeight * this._fontSizeFraction;
            for (var k = 0, n = a.length; k <= n; k++) {
                l = l || this.getCurrentCharStyle(g, k);
                var u = this.getCurrentCharStyle(g, k + 1);
                if (this._hasStyleChanged(l, u) || k === n) this._renderChar(b, e, g, k - 1, m, c, d, f), m = "", l = u;
                m += a[k]
            }
            e.restore()
        },
        _renderCharsFast: function(b, e, a, c, d) {
            this.skipTextAlign = !1;
            "fillText" === b && this.fill &&
                this.callSuper("_renderChars", b, e, a, c, d);
            "strokeText" === b && (this.stroke && 0 < this.strokeWidth || this.skipFillStrokeCheck) && this.callSuper("_renderChars", b, e, a, c, d)
        },
        _renderChar: function(b, e, a, c, d, g, f, k) {
            var l = this._getStyleDeclaration(a, c);
            k = this._fontSizeFraction * k / this.lineHeight;
            if (l) {
                var m = l.stroke || this.stroke,
                    n = l.fill || this.fill;
                e.save();
                b = this._applyCharStylesGetWidth(e, d, a, c, l);
                a = this._getHeightOfChar(e, d, a, c);
                n && e.fillText(d, g, f);
                m && e.strokeText(d, g, f);
                this._renderCharDecoration(e, l, g, f, k, b,
                    a);
                e.restore();
                e.translate(b, 0)
            } else {
                if ("strokeText" === b && this.stroke) e[b](d, g, f);
                if ("fillText" === b && this.fill) e[b](d, g, f);
                b = this._applyCharStylesGetWidth(e, d, a, c);
                this._renderCharDecoration(e, null, g, f, k, b, this.fontSize);
                e.translate(e.measureText(d).width, 0)
            }
        },
        _hasStyleChanged: function(b, e) {
            return b.fill !== e.fill || b.fontSize !== e.fontSize || b.textBackgroundColor !== e.textBackgroundColor || b.textDecoration !== e.textDecoration || b.fontFamily !== e.fontFamily || b.fontWeight !== e.fontWeight || b.fontStyle !== e.fontStyle ||
                b.stroke !== e.stroke || b.strokeWidth !== e.strokeWidth
        },
        _renderCharDecoration: function(b, e, a, c, d, g, f) {
            if (e = e ? e.textDecoration || this.textDecoration : this.textDecoration) - 1 < e.indexOf("underline") && b.fillRect(a, c + f / 10, g, f / 15), -1 < e.indexOf("line-through") && b.fillRect(a, c - f * (this._fontSizeFraction + this._fontSizeMult - 1) + f / 15, g, f / 15), -1 < e.indexOf("overline") && b.fillRect(a, c - (this._fontSizeMult - this._fontSizeFraction) * f, g, f / 15)
        },
        _renderTextLine: function(b, e, a, c, d, g) {
            this.isEmptyStyles() || (d += this.fontSize * (this._fontSizeFraction +
                .03));
            this.callSuper("_renderTextLine", b, e, a, c, d, g)
        },
        _renderTextDecoration: function(b) {
            if (this.isEmptyStyles()) return this.callSuper("_renderTextDecoration", b)
        },
        _renderTextLinesBackground: function(b) {
            if (this.textBackgroundColor || this.styles) {
                b.save();
                this.textBackgroundColor && (b.fillStyle = this.textBackgroundColor);
                for (var e = 0, a = 0, c = this._textLines.length; a < c; a++) {
                    var d = this._getHeightOfLine(b, a);
                    if ("" !== this._textLines[a]) {
                        var g = this._getLineWidth(b, a),
                            f = this._getCachedLineOffset(a);
                        this.textBackgroundColor &&
                            (b.fillStyle = this.textBackgroundColor, b.fillRect(this._getLeftOffset() + f, this._getTopOffset() + e, g, d / this.lineHeight));
                        if (this._getLineStyle(a))
                            for (var g = 0, k = this._textLines[a].length; g < k; g++) {
                                var l = this._getStyleDeclaration(a, g);
                                if (l && l.textBackgroundColor) {
                                    var m = this._textLines[a][g];
                                    b.fillStyle = l.textBackgroundColor;
                                    b.fillRect(this._getLeftOffset() + f + this._getWidthOfCharsAt(b, a, g), this._getTopOffset() + e, this._getWidthOfChar(b, m, a, g) + 1, d / this.lineHeight)
                                }
                            }
                    }
                    e += d
                }
                b.restore()
            }
        },
        _getCacheProp: function(b,
            e) {
            return b + e.fontFamily + e.fontSize + e.fontWeight + e.fontStyle + e.shadow
        },
        _applyCharStylesGetWidth: function(b, e, a, c, h) {
            a = (a = h || this._getStyleDeclaration(a, c)) ? d(a) : {};
            this._applyFontStyles(a);
            c = this._getCacheProp(e, a);
            if (this.isEmptyStyles() && this._charWidthsCache[c] && this.caching) return this._charWidthsCache[c];
            "string" === typeof a.shadow && (a.shadow = new fabric.Shadow(a.shadow));
            h = a.fill || this.fill;
            b.fillStyle = h.toLive ? h.toLive(b, this) : h;
            a.stroke && (b.strokeStyle = a.stroke && a.stroke.toLive ? a.stroke.toLive(b,
                this) : a.stroke);
            b.lineWidth = a.strokeWidth || this.strokeWidth;
            b.font = this._getFontDeclaration.call(a);
            this._setShadow.call(a, b);
            if (!this.caching) return b.measureText(e).width;
            this._charWidthsCache[c] || (this._charWidthsCache[c] = b.measureText(e).width);
            return this._charWidthsCache[c]
        },
        _applyFontStyles: function(b) {
            b.fontFamily || (b.fontFamily = this.fontFamily);
            b.fontSize || (b.fontSize = this.fontSize);
            b.fontWeight || (b.fontWeight = this.fontWeight);
            b.fontStyle || (b.fontStyle = this.fontStyle)
        },
        _getStyleDeclaration: function(b,
            e, a) {
            return a ? this.styles[b] && this.styles[b][e] ? d(this.styles[b][e]) : {} : this.styles[b] && this.styles[b][e] ? this.styles[b][e] : null
        },
        _setStyleDeclaration: function(b, e, a) {
            this.styles[b][e] = a
        },
        _deleteStyleDeclaration: function(b, e) {
            delete this.styles[b][e]
        },
        _getLineStyle: function(b) {
            return this.styles[b]
        },
        _setLineStyle: function(b, e) {
            this.styles[b] = e
        },
        _deleteLineStyle: function(b) {
            delete this.styles[b]
        },
        _getWidthOfChar: function(b, e, a, c) {
            if ("justify" === this.textAlign && this._reSpacesAndTabs.test(e)) return this._getWidthOfSpace(b,
                a);
            var d = this._getStyleDeclaration(a, c, !0);
            this._applyFontStyles(d);
            d = this._getCacheProp(e, d);
            if (this._charWidthsCache[d] && this.caching) return this._charWidthsCache[d];
            if (b) return b.save(), e = this._applyCharStylesGetWidth(b, e, a, c), b.restore(), e
        },
        _getHeightOfChar: function(b, e, a, c) {
            return (b = this._getStyleDeclaration(a, c)) && b.fontSize ? b.fontSize : this.fontSize
        },
        _getHeightOfCharAt: function(b, e, a) {
            return this._getHeightOfChar(b, this._textLines[e][a], e, a)
        },
        _getWidthOfCharsAt: function(b, e, a) {
            var c = 0,
                d, g;
            for (d =
                0; d < a; d++) g = this._textLines[e][d], c += this._getWidthOfChar(b, g, e, d);
            return c
        },
        _getLineWidth: function(b, e) {
            if (this.__lineWidths[e]) return this.__lineWidths[e];
            this.__lineWidths[e] = this._getWidthOfCharsAt(b, e, this._textLines[e].length);
            return this.__lineWidths[e]
        },
        _getWidthOfSpace: function(b, e) {
            if (this.__widthOfSpace[e]) return this.__widthOfSpace[e];
            var a = this._textLines[e],
                c = this._getWidthOfWords(b, a, e),
                c = this.width - c,
                a = a.length - a.replace(this._reSpacesAndTabs, "").length,
                a = c / a;
            return this.__widthOfSpace[e] =
                a
        },
        _getWidthOfWords: function(b, e, a) {
            for (var c = 0, d = 0; d < e.length; d++) {
                var g = e[d];
                g.match(/\s/) || (c += this._getWidthOfChar(b, g, a, d))
            }
            return c
        },
        _getHeightOfLine: function(b, e) {
            if (this.__lineHeights[e]) return this.__lineHeights[e];
            for (var a = this._textLines[e], c = this._getHeightOfChar(b, a[0], e, 0), d = 1, g = a.length; d < g; d++) {
                var f = this._getHeightOfChar(b, a[d], e, d);
                f > c && (c = f)
            }
            this.__maxFontHeights[e] = c;
            this.__lineHeights[e] = c * this.lineHeight * this._fontSizeMult;
            return this.__lineHeights[e]
        },
        _getTextHeight: function(b) {
            for (var e =
                    0, a = 0, c = this._textLines.length; a < c; a++) e += this._getHeightOfLine(b, a);
            return e
        },
        _renderTextBoxBackground: function(b) {
            this.backgroundColor && (b.save(), b.fillStyle = this.backgroundColor, b.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height), b.restore())
        },
        toObject: function(b) {
            return fabric.util.object.extend(this.callSuper("toObject", b), {
                styles: d(this.styles)
            })
        }
    });
    fabric.IText.fromObject = function(b) {
        return new fabric.IText(b.text, d(b))
    }
})();
(function() {
    var d = fabric.util.object.clone;
    fabric.util.object.extend(fabric.IText.prototype, {
        initBehavior: function() {
            this.initAddedHandler();
            this.initRemovedHandler();
            this.initCursorSelectionHandlers();
            this.initDoubleClickSimulation()
        },
        initSelectedHandler: function() {
            this.on("selected", function() {
                var b = this;
                setTimeout(function() {
                    b.selected = !0
                }, 100)
            })
        },
        initAddedHandler: function() {
            var b = this;
            this.on("added", function() {
                this.canvas && !this.canvas._hasITextHandlers && (this.canvas._hasITextHandlers = !0, this._initCanvasHandlers());
                b.canvas && (b.canvas._iTextInstances = b.canvas._iTextInstances || [], b.canvas._iTextInstances.push(b))
            })
        },
        initRemovedHandler: function() {
            var b = this;
            this.on("removed", function() {
                b.canvas && (b.canvas._iTextInstances = b.canvas._iTextInstances || [], fabric.util.removeFromArray(b.canvas._iTextInstances, b))
            })
        },
        _initCanvasHandlers: function() {
            var b = this;
            this.canvas.on("selection:cleared", function() {
                fabric.IText.prototype.exitEditingOnOthers(b.canvas)
            });
            this.canvas.on("mouse:up", function() {
                b.canvas._iTextInstances &&
                    b.canvas._iTextInstances.forEach(function(b) {
                        b.__isMousedown = !1
                    })
            });
            this.canvas.on("object:selected", function() {
                fabric.IText.prototype.exitEditingOnOthers(b.canvas)
            })
        },
        _tick: function() {
            this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
        },
        _animateCursor: function(b, e, a, c) {
            var d;
            d = {
                isAborted: !1,
                abort: function() {
                    this.isAborted = !0
                }
            };
            b.animate("_currentCursorOpacity", e, {
                duration: a,
                onComplete: function() {
                    if (!d.isAborted) b[c]()
                },
                onChange: function() {
                    b.canvas && (b.canvas.clearContext(b.canvas.contextTop ||
                        b.ctx), b.renderCursorOrSelection())
                },
                abort: function() {
                    return d.isAborted
                }
            });
            return d
        },
        _onTickComplete: function() {
            var b = this;
            this._cursorTimeout1 && clearTimeout(this._cursorTimeout1);
            this._cursorTimeout1 = setTimeout(function() {
                b._currentTickCompleteState = b._animateCursor(b, 0, this.cursorDuration / 2, "_tick")
            }, 100)
        },
        initDelayedCursor: function(b) {
            var e = this;
            b = b ? 0 : this.cursorDelay;
            this._currentTickState && this._currentTickState.abort();
            this._currentTickCompleteState && this._currentTickCompleteState.abort();
            clearTimeout(this._cursorTimeout1);
            this._currentCursorOpacity = 1;
            this.canvas && (this.canvas.clearContext(this.canvas.contextTop || this.ctx), this.renderCursorOrSelection());
            this._cursorTimeout2 && clearTimeout(this._cursorTimeout2);
            this._cursorTimeout2 = setTimeout(function() {
                e._tick()
            }, b)
        },
        abortCursorAnimation: function() {
            this._currentTickState && this._currentTickState.abort();
            this._currentTickCompleteState && this._currentTickCompleteState.abort();
            clearTimeout(this._cursorTimeout1);
            clearTimeout(this._cursorTimeout2);
            this._currentCursorOpacity = 0;
            this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx)
        },
        selectAll: function() {
            this.setSelectionStart(0);
            this.setSelectionEnd(this.text.length)
        },
        getSelectedText: function() {
            return this.text.slice(this.selectionStart, this.selectionEnd)
        },
        findWordBoundaryLeft: function(b) {
            var e = 0,
                a = b - 1;
            if (this._reSpace.test(this.text.charAt(a)))
                for (; this._reSpace.test(this.text.charAt(a));) e++, a--;
            for (;
                /\S/.test(this.text.charAt(a)) && -1 < a;) e++, a--;
            return b - e
        },
        findWordBoundaryRight: function(b) {
            var e =
                0,
                a = b;
            if (this._reSpace.test(this.text.charAt(a)))
                for (; this._reSpace.test(this.text.charAt(a));) e++, a++;
            for (;
                /\S/.test(this.text.charAt(a)) && a < this.text.length;) e++, a++;
            return b + e
        },
        findLineBoundaryLeft: function(b) {
            for (var e = 0, a = b - 1; !/\n/.test(this.text.charAt(a)) && -1 < a;) e++, a--;
            return b - e
        },
        findLineBoundaryRight: function(b) {
            for (var e = 0, a = b; !/\n/.test(this.text.charAt(a)) && a < this.text.length;) e++, a++;
            return b + e
        },
        getNumNewLinesInSelectedText: function() {
            for (var b = this.getSelectedText(), e = 0, a = 0, c = b.length; a <
                c; a++) "\n" === b[a] && e++;
            return e
        },
        searchWordBoundary: function(b, e) {
            for (var a = this._reSpace.test(this.text.charAt(b)) ? b - 1 : b, c = this.text.charAt(a), d = /[ \n\.,;!\?\-]/; !d.test(c) && 0 < a && a < this.text.length;) a += e, c = this.text.charAt(a);
            d.test(c) && "\n" !== c && (a += 1 === e ? 0 : 1);
            return a
        },
        selectWord: function(b) {
            var e = this.searchWordBoundary(b, -1);
            b = this.searchWordBoundary(b, 1);
            this.setSelectionStart(e);
            this.setSelectionEnd(b)
        },
        selectLine: function(b) {
            var e = this.findLineBoundaryLeft(b);
            b = this.findLineBoundaryRight(b);
            this.setSelectionStart(e);
            this.setSelectionEnd(b)
        },
        enterEditing: function() {
            if (!this.isEditing && this.editable) {
                this.canvas && this.exitEditingOnOthers(this.canvas);
                this.isEditing = !0;
                this.initHiddenTextarea();
                this.hiddenTextarea.focus();
                this._updateTextarea();
                this._saveEditingProps();
                this._setEditingProps();
                this._tick();
                this.fire("editing:entered");
                if (!this.canvas) return this;
                this.canvas.renderAll();
                this.canvas.fire("text:editing:entered", {
                    target: this
                });
                this.initMouseMoveHandler();
                return this
            }
        },
        exitEditingOnOthers: function(b) {
            b._iTextInstances &&
                b._iTextInstances.forEach(function(b) {
                    b.selected = !1;
                    b.isEditing && b.exitEditing()
                })
        },
        initMouseMoveHandler: function() {
            var b = this;
            this.canvas.on("mouse:move", function(e) {
                b.__isMousedown && b.isEditing && (e = b.getSelectionStartFromPointer(e.e), e >= b.__selectionStartOnMouseDown ? (b.setSelectionStart(b.__selectionStartOnMouseDown), b.setSelectionEnd(e)) : (b.setSelectionStart(e), b.setSelectionEnd(b.__selectionStartOnMouseDown)))
            })
        },
        _setEditingProps: function() {
            this.hoverCursor = "text";
            this.canvas && (this.canvas.defaultCursor =
                this.canvas.moveCursor = "text");
            this.borderColor = this.editingBorderColor;
            this.hasControls = this.selectable = !1;
            this.lockMovementX = this.lockMovementY = !0
        },
        _updateTextarea: function() {
            this.hiddenTextarea && (this.hiddenTextarea.value = this.text, this.hiddenTextarea.selectionStart = this.selectionStart, this.hiddenTextarea.selectionEnd = this.selectionEnd)
        },
        _saveEditingProps: function() {
            this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
            }
        },
        _restoreEditingProps: function() {
            this._savedProps && (this.hoverCursor = this._savedProps.overCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor =
                this._savedProps.moveCursor))
        },
        exitEditing: function() {
            this.isEditing = this.selected = !1;
            this.selectable = !0;
            this.selectionEnd = this.selectionStart;
            this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
            this.hiddenTextarea = null;
            this.abortCursorAnimation();
            this._restoreEditingProps();
            this._currentCursorOpacity = 0;
            this.fire("editing:exited");
            this.canvas && this.canvas.fire("text:editing:exited", {
                target: this
            });
            return this
        },
        _removeExtraneousStyles: function() {
            for (var b in this.styles) this._textLines[b] ||
                delete this.styles[b]
        },
        _removeCharsFromTo: function(b, e) {
            for (; e !== b;) this._removeSingleCharAndStyle(b + 1), e--;
            this.setSelectionStart(b)
        },
        _removeSingleCharAndStyle: function(b) {
            var e = "\n" === this.text[b - 1];
            this.removeStyleObject(e, e ? b : b - 1);
            this.text = this.text.slice(0, b - 1) + this.text.slice(b);
            this._textLines = this._splitTextIntoLines()
        },
        insertChars: function(b, e) {
            var a;
            1 < this.selectionEnd - this.selectionStart && (this._removeCharsFromTo(this.selectionStart, this.selectionEnd), this.setSelectionEnd(this.selectionStart));
            for (var c = 0, d = b.length; c < d; c++) e && (a = fabric.copiedTextStyle[c]), this.insertChar(b[c], c < d - 1, a)
        },
        insertChar: function(b, e, a) {
            var c = "\n" === this.text[this.selectionStart];
            this.text = this.text.slice(0, this.selectionStart) + b + this.text.slice(this.selectionEnd);
            this._textLines = this._splitTextIntoLines();
            this.insertStyleObjects(b, c, a);
            this.setSelectionStart(this.selectionStart + 1);
            this.setSelectionEnd(this.selectionStart);
            e || (this.canvas && this.canvas.renderAll(), this.setCoords(), this.fire("changed"), this.canvas &&
                this.canvas.fire("text:changed", {
                    target: this
                }))
        },
        insertNewlineStyleObject: function(b, e, a) {
            this.shiftLineStyles(b, 1);
            this.styles[b + 1] || (this.styles[b + 1] = {});
            var c = {},
                h = {};
            this.styles[b] && this.styles[b][e - 1] && (c = this.styles[b][e - 1]);
            if (a) h[0] = d(c);
            else
                for (var g in this.styles[b]) parseInt(g, 10) >= e && (h[parseInt(g, 10) - e] = this.styles[b][g], delete this.styles[b][g]);
            this.styles[b + 1] = h;
            this._forceClearCache = !0
        },
        insertCharStyleObject: function(b, e, a) {
            var c = this.styles[b],
                h = d(c);
            0 !== e || a || (e = 1);
            for (var g in h) {
                var f =
                    parseInt(g, 10);
                f >= e && (c[f + 1] = h[f], h[f - 1] || delete c[f])
            }
            this.styles[b][e] = a || d(c[e - 1]);
            this._forceClearCache = !0
        },
        insertStyleObjects: function(b, e, a) {
            var c = this.get2DCursorLocation(),
                d = c.lineIndex,
                c = c.charIndex;
            this._getLineStyle(d) || this._setLineStyle(d, {});
            "\n" === b ? this.insertNewlineStyleObject(d, c, e) : this.insertCharStyleObject(d, c, a)
        },
        shiftLineStyles: function(b, e) {
            var a = d(this.styles),
                c;
            for (c in this.styles) {
                var h = parseInt(c, 10);
                h > b && (this.styles[h + e] = a[h], a[h - e] || delete this.styles[h])
            }
        },
        removeStyleObject: function(b,
            e) {
            var a = this.get2DCursorLocation(e),
                c = a.lineIndex,
                a = a.charIndex;
            if (b) {
                var h = this._textLines[c - 1],
                    h = h ? h.length : 0;
                this.styles[c - 1] || (this.styles[c - 1] = {});
                for (a in this.styles[c]) this.styles[c - 1][parseInt(a, 10) + h] = this.styles[c][a];
                this.shiftLineStyles(c, -1)
            } else {
                (c = this.styles[c]) && delete c[a];
                var g = d(c);
                for (h in g) {
                    var f = parseInt(h, 10);
                    f >= a && 0 !== f && (c[f - 1] = g[f], delete c[f])
                }
            }
        },
        insertNewline: function() {
            this.insertChars("\n")
        }
    })
})();
fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function() {
        this.__lastClickTime = +new Date;
        this.__lastLastClickTime = +new Date;
        this.__lastPointer = {};
        this.on("mousedown", this.onMouseDown.bind(this))
    },
    onMouseDown: function(d) {
        this.__newClickTime = +new Date;
        var b = this.canvas.getPointer(d.e);
        this.isTripleClick(b) ? (this.fire("tripleclick", d), this._stopEvent(d.e)) : this.isDoubleClick(b) && (this.fire("dblclick", d), this._stopEvent(d.e));
        this.__lastLastClickTime = this.__lastClickTime;
        this.__lastClickTime = this.__newClickTime;
        this.__lastPointer = b;
        this.__lastIsEditing = this.isEditing;
        this.__lastSelected = this.selected
    },
    isDoubleClick: function(d) {
        return 500 > this.__newClickTime - this.__lastClickTime && this.__lastPointer.x === d.x && this.__lastPointer.y === d.y && this.__lastIsEditing
    },
    isTripleClick: function(d) {
        return 500 > this.__newClickTime - this.__lastClickTime && 500 > this.__lastClickTime - this.__lastLastClickTime && this.__lastPointer.x === d.x && this.__lastPointer.y === d.y
    },
    _stopEvent: function(d) {
        d.preventDefault &&
            d.preventDefault();
        d.stopPropagation && d.stopPropagation()
    },
    initCursorSelectionHandlers: function() {
        this.initSelectedHandler();
        this.initMousedownHandler();
        this.initMouseupHandler();
        this.initClicks()
    },
    initClicks: function() {
        this.on("dblclick", function(d) {
            this.selectWord(this.getSelectionStartFromPointer(d.e))
        });
        this.on("tripleclick", function(d) {
            this.selectLine(this.getSelectionStartFromPointer(d.e))
        })
    },
    initMousedownHandler: function() {
        this.on("mousedown", function(d) {
            var b = this.canvas.getPointer(d.e);
            this.__mousedownX =
                b.x;
            this.__mousedownY = b.y;
            this.__isMousedown = !0;
            this.hiddenTextarea && this.canvas && this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
            this.selected && this.setCursorByClick(d.e);
            this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.initDelayedCursor(!0))
        })
    },
    _isObjectMoved: function(d) {
        d = this.canvas.getPointer(d);
        return this.__mousedownX !== d.x || this.__mousedownY !== d.y
    },
    initMouseupHandler: function() {
        this.on("mouseup", function(d) {
            this.__isMousedown = !1;
            this._isObjectMoved(d.e) || (this.__lastSelected &&
                (this.enterEditing(), this.initDelayedCursor(!0)), this.selected = !0)
        })
    },
    setCursorByClick: function(d) {
        var b = this.getSelectionStartFromPointer(d);
        d.shiftKey ? b < this.selectionStart ? (this.setSelectionEnd(this.selectionStart), this.setSelectionStart(b)) : this.setSelectionEnd(b) : (this.setSelectionStart(b), this.setSelectionEnd(b))
    },
    getSelectionStartFromPointer: function(d) {
        d = this.getLocalPointer(d);
        for (var b = 0, e = 0, a = 0, c = 0, h, g = 0, f = this._textLines.length; g < f; g++) {
            h = this._textLines[g];
            a += this._getHeightOfLine(this.ctx,
                g) * this.scaleY;
            e = this._getLineWidth(this.ctx, g);
            e = this._getLineLeftOffset(e) * this.scaleX;
            this.flipX && (this._textLines[g] = h.reverse().join(""));
            for (var k = 0, l = h.length; k < l; k++)
                if (b = e, e += this._getWidthOfChar(this.ctx, h[k], g, this.flipX ? l - k : k) * this.scaleX, a <= d.y || e <= d.x) c++;
                else return this._getNewSelectionStartFromOffset(d, b, e, c + g, l);
            if (d.y < a) return this._getNewSelectionStartFromOffset(d, b, e, c + g - 1, l)
        }
        return this.text.length
    },
    _getNewSelectionStartFromOffset: function(d, b, e, a, c) {
        d = a + (e - d.x > d.x - b ? 0 : 1);
        this.flipX &&
            (d = c - d);
        d > this.text.length && (d = this.text.length);
        return d
    }
});
fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function() {
        this.hiddenTextarea = fabric.document.createElement("textarea");
        this.hiddenTextarea.setAttribute("autocapitalize", "off");
        this.hiddenTextarea.style.cssText = "position: fixed; bottom: 20px; left: 0px; opacity: 0; width: 0px; height: 0px; z-index: -999;";
        fabric.document.body.appendChild(this.hiddenTextarea);
        fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this));
        fabric.util.addListener(this.hiddenTextarea,
            "keypress", this.onKeyPress.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this));
        !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
    },
    _keysMap: {
        8: "removeChars",
        9: "exitEditing",
        27: "exitEditing",
        13: "insertNewline",
        33: "moveCursorUp",
        34: "moveCursorDown",
        35: "moveCursorRight",
        36: "moveCursorLeft",
        37: "moveCursorLeft",
        38: "moveCursorUp",
        39: "moveCursorRight",
        40: "moveCursorDown",
        46: "forwardDelete"
    },
    _ctrlKeysMap: {
        65: "selectAll",
        88: "cut"
    },
    onClick: function() {
        this.hiddenTextarea && this.hiddenTextarea.focus()
    },
    onKeyDown: function(d) {
        if (this.isEditing) {
            if (d.keyCode in this._keysMap) this[this._keysMap[d.keyCode]](d);
            else if (d.keyCode in this._ctrlKeysMap && (d.ctrlKey || d.metaKey)) this[this._ctrlKeysMap[d.keyCode]](d);
            else return;
            d.stopImmediatePropagation();
            d.preventDefault();
            this.canvas && this.canvas.renderAll()
        }
    },
    forwardDelete: function(d) {
        if (this.selectionStart === this.selectionEnd) {
            if (this.selectionStart === this.text.length) return;
            this.moveCursorRight(d)
        }
        this.removeChars(d)
    },
    copy: function(d) {
        var b = this.getSelectedText();
        (d = this._getClipboardData(d)) && d.setData("text", b);
        fabric.copiedText = b;
        fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd)
    },
    paste: function(d) {
        var b = null,
            b = this._getClipboardData(d);
        d = !0;
        b ? (b = b.getData("text").replace(/\r/g, ""), fabric.copiedTextStyle && fabric.copiedText ===
            b || (d = !1)) : b = fabric.copiedText;
        b && this.insertChars(b, d)
    },
    cut: function(d) {
        this.selectionStart !== this.selectionEnd && (this.copy(), this.removeChars(d))
    },
    _getClipboardData: function(d) {
        return d && (d.clipboardData || fabric.window.clipboardData)
    },
    onKeyPress: function(d) {
        !this.isEditing || d.metaKey || d.ctrlKey || (0 !== d.which && this.insertChars(String.fromCharCode(d.which)), d.stopPropagation())
    },
    getDownCursorOffset: function(d, b) {
        var e = b ? this.selectionEnd : this.selectionStart,
            a = this.get2DCursorLocation(e),
            c = a.lineIndex,
            h = this._textLines[c].slice(0, a.charIndex),
            g = this._textLines[c].slice(a.charIndex),
            f = this._textLines[c + 1] || "";
        if (c === this._textLines.length - 1 || d.metaKey || 34 === d.keyCode) return this.text.length - e;
        for (var e = this._getLineWidth(this.ctx, c), k = this._getLineLeftOffset(e), l = 0, m = h.length; l < m; l++) e = h[l], k += this._getWidthOfChar(this.ctx, e, c, l);
        a = this._getIndexOnNextLine(a, f, k);
        return g.length + 1 + a
    },
    _getIndexOnNextLine: function(d, b, e) {
        var a = d.lineIndex + 1;
        d = this._getLineWidth(this.ctx, a);
        var c = this._getLineLeftOffset(d),
            h = 0,
            g;
        d = 0;
        for (var f = b.length; d < f; d++) {
            var k = this._getWidthOfChar(this.ctx, b[d], a, d),
                c = c + k;
            if (c > e) {
                g = !0;
                a = c;
                c = Math.abs(c - k - e);
                h = Math.abs(a - e) < c ? d + 1 : d;
                break
            }
        }
        g || (h = b.length);
        return h
    },
    moveCursorDown: function(d) {
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        var b = this.getDownCursorOffset(d, "right" === this._selectionDirection);
        d.shiftKey ? this.moveCursorDownWithShift(b) : this.moveCursorDownWithoutShift(b);
        this.initDelayedCursor()
    },
    moveCursorDownWithoutShift: function(d) {
        this._selectionDirection =
            "right";
        this.setSelectionStart(this.selectionStart + d);
        this.setSelectionEnd(this.selectionStart)
    },
    swapSelectionPoints: function() {
        var d = this.selectionEnd;
        this.setSelectionEnd(this.selectionStart);
        this.setSelectionStart(d)
    },
    moveCursorDownWithShift: function(d) {
        this.selectionEnd === this.selectionStart && (this._selectionDirection = "right");
        "right" === this._selectionDirection ? this.setSelectionEnd(this.selectionEnd + d) : this.setSelectionStart(this.selectionStart + d);
        this.selectionEnd < this.selectionStart && "left" ===
            this._selectionDirection && (this.swapSelectionPoints(), this._selectionDirection = "right");
        this.selectionEnd > this.text.length && this.setSelectionEnd(this.text.length)
    },
    getUpCursorOffset: function(d, b) {
        var e = b ? this.selectionEnd : this.selectionStart,
            a = this.get2DCursorLocation(e),
            c = a.lineIndex;
        if (0 === c || d.metaKey || 33 === d.keyCode) return e;
        var e = this._textLines[c].slice(0, a.charIndex),
            h = this._textLines[c - 1] || "",
            g;
        g = this._getLineWidth(this.ctx, a.lineIndex);
        for (var f = this._getLineLeftOffset(g), k = 0, l = e.length; k <
            l; k++) g = e[k], f += this._getWidthOfChar(this.ctx, g, c, k);
        a = this._getIndexOnPrevLine(a, h, f);
        return h.length - a + e.length
    },
    _getIndexOnPrevLine: function(d, b, e) {
        var a = d.lineIndex - 1;
        d = this._getLineWidth(this.ctx, a);
        var c = this._getLineLeftOffset(d),
            h = 0,
            g;
        d = 0;
        for (var f = b.length; d < f; d++) {
            var k = this._getWidthOfChar(this.ctx, b[d], a, d),
                c = c + k;
            if (c > e) {
                g = !0;
                a = c;
                c = Math.abs(c - k - e);
                h = Math.abs(a - e) < c ? d : d - 1;
                break
            }
        }
        g || (h = b.length - 1);
        return h
    },
    moveCursorUp: function(d) {
        this.abortCursorAnimation();
        this._currentCursorOpacity =
            1;
        var b = this.getUpCursorOffset(d, "right" === this._selectionDirection);
        d.shiftKey ? this.moveCursorUpWithShift(b) : this.moveCursorUpWithoutShift(b);
        this.initDelayedCursor()
    },
    moveCursorUpWithShift: function(d) {
        this.selectionEnd === this.selectionStart && (this._selectionDirection = "left");
        "right" === this._selectionDirection ? this.setSelectionEnd(this.selectionEnd - d) : this.setSelectionStart(this.selectionStart - d);
        this.selectionEnd < this.selectionStart && "right" === this._selectionDirection && (this.swapSelectionPoints(),
            this._selectionDirection = "left")
    },
    moveCursorUpWithoutShift: function(d) {
        this.selectionStart === this.selectionEnd && this.setSelectionStart(this.selectionStart - d);
        this.setSelectionEnd(this.selectionStart);
        this._selectionDirection = "left"
    },
    moveCursorLeft: function(d) {
        if (0 !== this.selectionStart || 0 !== this.selectionEnd) this.abortCursorAnimation(), this._currentCursorOpacity = 1, d.shiftKey ? this.moveCursorLeftWithShift(d) : this.moveCursorLeftWithoutShift(d), this.initDelayedCursor()
    },
    _move: function(d, b, e) {
        var a = "selectionStart" ===
            b ? "setSelectionStart" : "setSelectionEnd";
        if (d.altKey) this[a](this["findWordBoundary" + e](this[b]));
        else if (d.metaKey || 35 === d.keyCode || 36 === d.keyCode) this[a](this["findLineBoundary" + e](this[b]));
        else this[a](this[b] + ("Left" === e ? -1 : 1))
    },
    _moveLeft: function(d, b) {
        this._move(d, b, "Left")
    },
    _moveRight: function(d, b) {
        this._move(d, b, "Right")
    },
    moveCursorLeftWithoutShift: function(d) {
        this._selectionDirection = "left";
        this.selectionEnd === this.selectionStart && this._moveLeft(d, "selectionStart");
        this.setSelectionEnd(this.selectionStart)
    },
    moveCursorLeftWithShift: function(d) {
        "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(d, "selectionEnd") : (this._selectionDirection = "left", this._moveLeft(d, "selectionStart"))
    },
    moveCursorRight: function(d) {
        this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length || (this.abortCursorAnimation(), this._currentCursorOpacity = 1, d.shiftKey ? this.moveCursorRightWithShift(d) : this.moveCursorRightWithoutShift(d), this.initDelayedCursor())
    },
    moveCursorRightWithShift: function(d) {
        "left" ===
        this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(d, "selectionStart") : (this._selectionDirection = "right", this._moveRight(d, "selectionEnd"))
    },
    moveCursorRightWithoutShift: function(d) {
        this._selectionDirection = "right";
        this.selectionStart === this.selectionEnd ? (this._moveRight(d, "selectionStart"), this.setSelectionEnd(this.selectionStart)) : (this.setSelectionEnd(this.selectionEnd + this.getNumNewLinesInSelectedText()), this.setSelectionStart(this.selectionEnd))
    },
    removeChars: function(d) {
        this.selectionStart ===
            this.selectionEnd ? this._removeCharsNearCursor(d) : this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
        this.setSelectionEnd(this.selectionStart);
        this._removeExtraneousStyles();
        this.canvas && this.canvas.renderAll();
        this.setCoords();
        this.fire("changed");
        this.canvas && this.canvas.fire("text:changed", {
            target: this
        })
    },
    _removeCharsNearCursor: function(d) {
        0 !== this.selectionStart && (d.metaKey ? (d = this.findLineBoundaryLeft(this.selectionStart), this._removeCharsFromTo(d, this.selectionStart), this.setSelectionStart(d)) :
            d.altKey ? (d = this.findWordBoundaryLeft(this.selectionStart), this._removeCharsFromTo(d, this.selectionStart), this.setSelectionStart(d)) : (this._removeSingleCharAndStyle(this.selectionStart), this.setSelectionStart(this.selectionStart - 1)))
    }
});
(function() {
    var d = fabric.util.toFixed,
        b = fabric.Object.NUM_FRACTION_DIGITS;
    fabric.util.object.extend(fabric.IText.prototype, {
        _setSVGTextLineText: function(b, a, c, d, g, f) {
            this.styles[b] ? this._setSVGTextLineChars(b, a, c, d, f) : this.callSuper("_setSVGTextLineText", b, a, c, d, g)
        },
        _setSVGTextLineChars: function(b, a, c, d, g) {
            c = this._textLines[b];
            d = 0;
            for (var f = this._getSVGLineLeftOffset(b) - this.width / 2, k = this._getSVGLineTopOffset(b), l = this._getHeightOfLine(this.ctx, b), m = 0, n = c.length; m < n; m++) {
                var u = this.styles[b][m] || {};
                a.push(this._createTextCharSpan(c[m], u, f, k.lineTop + k.offset, d));
                var A = this._getWidthOfChar(this.ctx, c[m], b, m);
                u.textBackgroundColor && g.push(this._createTextCharBg(u, f, k.lineTop, l, A, d));
                d += A
            }
        },
        _getSVGLineLeftOffset: function(b) {
            return fabric.util.toFixed(this._getLineLeftOffset(this.__lineWidths[b]), 2)
        },
        _getSVGLineTopOffset: function(b) {
            for (var a = 0, c = 0, c = 0; c < b; c++) a += this._getHeightOfLine(this.ctx, c);
            c = this._getHeightOfLine(this.ctx, c);
            return {
                lineTop: a,
                offset: (this._fontSizeMult - this._fontSizeFraction) *
                    c / (this.lineHeight * this._fontSizeMult)
            }
        },
        _createTextCharBg: function(e, a, c, h, g, f) {
            return ['<rect fill="', e.textBackgroundColor, '" x="', d(a + f, b), '" y="', d(c - this.height / 2, b), '" width="', d(g, b), '" height="', d(h / this.lineHeight, b), '"></rect>'].join("")
        },
        _createTextCharSpan: function(b, a, c, d, g) {
            var f = this.getSvgStyles.call(fabric.util.object.extend({
                visible: !0,
                fill: this.fill,
                stroke: this.stroke,
                type: "text"
            }, a));
            return ['<tspan x="', c + g, '" y="', d - this.height / 2, '" ', a.fontFamily ? 'font-family="' + a.fontFamily.replace(/"/g,
                "'") + '" ' : "", a.fontSize ? 'font-size="' + a.fontSize + '" ' : "", a.fontStyle ? 'font-style="' + a.fontStyle + '" ' : "", a.fontWeight ? 'font-weight="' + a.fontWeight + '" ' : "", a.textDecoration ? 'text-decoration="' + a.textDecoration + '" ' : "", 'style="', f, '">', fabric.util.string.escapeXml(b), "</tspan>"].join("")
        }
    })
})();
(function(d) {
    var b = d.fabric || (d.fabric = {}),
        e = b.util.object.clone;
    b.Textbox = b.util.createClass(b.IText, b.Observable, {
        type: "textbox",
        minWidth: 20,
        dynamicMinWidth: 0,
        __cachedLines: null,
        initialize: function(a, c) {
            this.ctx = b.util.createCanvasElement().getContext("2d");
            this.callSuper("initialize", a, c);
            this.set({
                lockUniScaling: !1,
                lockScalingY: !0,
                lockScalingFlip: !0,
                hasBorders: !0
            });
            this.setControlsVisibility(b.Textbox.getTextboxControlVisibility());
            this._dimensionAffectingProps.width = !0
        },
        _initDimensions: function(a) {
            this.__skipDimension ||
                (a || (a = b.util.createCanvasElement().getContext("2d"), this._setTextStyles(a)), this.dynamicMinWidth = 0, this._textLines = this._splitTextIntoLines(), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), this._styleMap = this._generateStyleMap(), this._clearCache(), this.height = this._getTextHeight(a))
        },
        _generateStyleMap: function() {
            for (var a = 0, c = 0, b = 0, e = {}, d = 0; d < this._textLines.length; d++) "\n" === this.text[b] ? (c = 0, b++, a++) : " " === this.text[b] && (c++, b++), e[d] = {
                    line: a,
                    offset: c
                }, b += this._textLines[d].length,
                c += this._textLines[d].length;
            return e
        },
        _getStyleDeclaration: function(a, c, b) {
            if (this._styleMap) {
                var d = this._styleMap[a];
                a = d.line;
                c = d.offset + c
            }
            return b ? this.styles[a] && this.styles[a][c] ? e(this.styles[a][c]) : {} : this.styles[a] && this.styles[a][c] ? this.styles[a][c] : null
        },
        _setStyleDeclaration: function(a, c, b) {
            var e = this._styleMap[a];
            a = e.line;
            c = e.offset + c;
            this.styles[a][c] = b
        },
        _deleteStyleDeclaration: function(a, c) {
            var b = this._styleMap[a];
            a = b.line;
            c = b.offset + c;
            delete this.styles[a][c]
        },
        _getLineStyle: function(a) {
            return this.styles[this._styleMap[a].line]
        },
        _setLineStyle: function(a, c) {
            this.styles[this._styleMap[a].line] = c
        },
        _deleteLineStyle: function(a) {
            delete this.styles[this._styleMap[a].line]
        },
        _wrapText: function(a, c) {
            var b = c.split(this._reNewline),
                e = [],
                d;
            for (d = 0; d < b.length; d++) e = e.concat(this._wrapLine(a, b[d], d));
            return e
        },
        _measureText: function(a, c, b, e) {
            var d = 0,
                k;
            e = e || 0;
            for (var l = 0; l < c.length; l++) this.styles && this.styles[b] && (k = this.styles[b][l + e]) ? (a.save(), d += this._applyCharStylesGetWidth(a, c[l], b, l, k), a.restore()) : d += this._applyCharStylesGetWidth(a,
                c[l], b, l, {});
            return d
        },
        _wrapLine: function(a, c, b) {
            var e = this.width,
                d = this._measureText(a, c, b, 0);
            if (d < e) return -1 === c.indexOf(" ") && d > this.dynamicMinWidth && (this.dynamicMinWidth = d), [c];
            var k = [],
                l = "";
            c = c.split(" ");
            for (var m = 0, n = "", u = 0, A = 0; 0 < c.length;) n = "" === l ? "" : " ", u = this._measureText(a, c[0], b, l.length + n.length + m), d = "" === l ? u : this._measureText(a, l + n + c[0], b, m), d < e || "" === l && u >= e ? l += n + c.shift() : (m += l.length + 1, k.push(l), l = ""), 0 === c.length && k.push(l), u > A && (A = u);
            A > this.dynamicMinWidth && (this.dynamicMinWidth =
                A);
            return k
        },
        _splitTextIntoLines: function() {
            this.ctx.save();
            this._setTextStyles(this.ctx);
            var a = this._wrapText(this.ctx, this.text);
            this.ctx.restore();
            return a
        },
        setOnGroup: function(a, c) {
            "scaleX" === a && (this.set("scaleX", Math.abs(1 / c)), this.set("width", this.get("width") * c / ("undefined" === typeof this.__oldScaleX ? 1 : this.__oldScaleX)), this.__oldScaleX = c)
        },
        get2DCursorLocation: function(a) {
            "undefined" === typeof a && (a = this.selectionStart);
            for (var c = this._textLines.length, b = 0, e = 0; e < c; e++) {
                var d = this._textLines[e].length;
                if (a <= b + d) return {
                    lineIndex: e,
                    charIndex: a - b
                };
                b += d;
                "\n" !== this.text[b] && " " !== this.text[b] || b++
            }
            return {
                lineIndex: c - 1,
                charIndex: this._textLines[c - 1].length
            }
        },
        _getCursorBoundariesOffsets: function(a, c) {
            for (var b = 0, e = 0, d = this.get2DCursorLocation(), k = this._textLines[d.lineIndex].split(""), l = this._getCachedLineOffset(d.lineIndex), m = 0; m < d.charIndex; m++) e += this._getWidthOfChar(this.ctx, k[m], d.lineIndex, m);
            for (m = 0; m < d.lineIndex; m++) b += this._getHeightOfLine(this.ctx, m);
            "cursor" === c && (b += (1 - this._fontSizeFraction) *
                this._getHeightOfLine(this.ctx, d.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(d.lineIndex, d.charIndex) * (1 - this._fontSizeFraction));
            return {
                top: b,
                left: e,
                lineLeft: l
            }
        },
        getMinWidth: function() {
            return Math.max(this.minWidth, this.dynamicMinWidth)
        },
        toObject: function(a) {
            return b.util.object.extend(this.callSuper("toObject", a), {
                minWidth: this.minWidth
            })
        }
    });
    b.Textbox.fromObject = function(a) {
        return new b.Textbox(a.text, e(a))
    };
    b.Textbox.getTextboxControlVisibility = function() {
        return {
            tl: !1,
            tr: !1,
            br: !1,
            bl: !1,
            ml: !0,
            mt: !1,
            mr: !0,
            mb: !1,
            mtr: !0
        }
    };
    b.Textbox.instances = []
})("undefined" !== typeof exports ? exports : this);
(function() {
    var d = fabric.Canvas.prototype._setObjectScale;
    fabric.Canvas.prototype._setObjectScale = function(b, a, c, h, g, f) {
        var k = a.target;
        k instanceof fabric.Textbox ? (b = b.x / a.scaleX / (k.width + k.strokeWidth) * k.width, b >= k.getMinWidth() && k.set("width", b)) : d.call(fabric.Canvas.prototype, b, a, c, h, g, f)
    };
    fabric.Group.prototype._refreshControlsVisibility = function() {
        if ("undefined" !== typeof fabric.Textbox)
            for (var b = this._objects.length; b--;)
                if (this._objects[b] instanceof fabric.Textbox) {
                    this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
                    break
                }
    };
    var b = fabric.util.object.clone;
    fabric.util.object.extend(fabric.Textbox.prototype, {
        _removeExtraneousStyles: function() {
            for (var b in this._styleMap) this._textLines[b] || delete this.styles[this._styleMap[b].line]
        },
        insertCharStyleObject: function(b, a, c) {
            var d = this._styleMap[b];
            b = d.line;
            a = d.offset + a;
            fabric.IText.prototype.insertCharStyleObject.apply(this, [b, a, c])
        },
        insertNewlineStyleObject: function(b, a, c) {
            var d = this._styleMap[b];
            b = d.line;
            a = d.offset + a;
            fabric.IText.prototype.insertNewlineStyleObject.apply(this, [b, a, c])
        },
        shiftLineStyles: function(d, a) {
            var c = b(this.styles);
            d = this._styleMap[d].line;
            for (var h in this.styles) {
                var g = parseInt(h, 10);
                g > d && (this.styles[g + a] = c[g], c[g - a] || delete this.styles[g])
            }
        },
        _getTextOnPreviousLine: function(b) {
            for (var a = this._textLines[b - 1]; this._styleMap[b - 2] && this._styleMap[b - 2].line === this._styleMap[b - 1].line;) a = this._textLines[b - 2] + a, b--;
            return a
        },
        removeStyleObject: function(d, a) {
            var c = this.get2DCursorLocation(a),
                h = this._styleMap[c.lineIndex],
                g = h.line,
                h = h.offset + c.charIndex;
            if (d) {
                var f = this._getTextOnPreviousLine(c.lineIndex),
                    f = f ? f.length : 0;
                this.styles[g - 1] || (this.styles[g - 1] = {});
                for (h in this.styles[g]) this.styles[g - 1][parseInt(h, 10) + f] = this.styles[g][h];
                this.shiftLineStyles(c.lineIndex, -1)
            } else
                for (f in (c = this.styles[g]) && delete c[h], g = b(c), g) {
                    var k = parseInt(f, 10);
                    k >= h && 0 !== k && (c[k - 1] = g[k], delete c[k])
                }
        }
    })
})();
(function() {
    var d = fabric.IText.prototype._getNewSelectionStartFromOffset;
    fabric.IText.prototype._getNewSelectionStartFromOffset = function(b, e, a, c, h) {
        c = d.call(this, b, e, a, c, h);
        for (a = e = b = 0; a < this._textLines.length; a++) {
            b += this._textLines[a].length;
            if (b + e >= c) break;
            "\n" !== this.text[b + e] && " " !== this.text[b + e] || e++
        }
        return c - a + e
    }
})();
(function() {
    function d(b, d, e) {
        var f = a.parse(b);
        f.port || (f.port = 0 === f.protocol.indexOf("https:") ? 443 : 80);
        b = (0 === f.protocol.indexOf("https:") ? h : c).request({
            hostname: f.hostname,
            port: f.port,
            path: f.path,
            method: "GET"
        }, function(a) {
            var b = "";
            d && a.setEncoding(d);
            a.on("end", function() {
                e(b)
            });
            a.on("data", function(c) {
                200 === a.statusCode && (b += c)
            })
        });
        b.on("error", function(a) {
            a.errno === process.ECONNREFUSED ? fabric.log("ECONNREFUSED: connection refused to " + f.hostname + ":" + f.port) : fabric.log(a.message);
            e(null)
        });
        b.end()
    }

    function b(a, b) {
        require("fs").readFile(a, function(a, c) {
            if (a) throw fabric.log(a), a;
            b(c)
        })
    }
    if ("undefined" === typeof document || "undefined" === typeof window) {
        var e = require("xmldom").DOMParser,
            a = require("url"),
            c = require("http"),
            h = require("https"),
            g = require("canvas"),
            f = require("canvas").Image;
        fabric.util.loadImage = function(a, c, e) {
            function g(b) {
                b ? (h.src = new Buffer(b, "binary"), h._src = a, c && c.call(e, h)) : (h = null, c && c.call(e, null, !0))
            }
            var h = new f;
            a && (a instanceof Buffer || 0 === a.indexOf("data")) ? (h.src = h._src = a,
                c && c.call(e, h)) : a && 0 !== a.indexOf("http") ? b(a, g) : a ? d(a, "binary", g) : c && c.call(e, a)
        };
        fabric.loadSVGFromURL = function(a, c, e) {
            a = a.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim();
            0 !== a.indexOf("http") ? b(a, function(a) {
                fabric.loadSVGFromString(a.toString(), c, e)
            }) : d(a, "", function(a) {
                fabric.loadSVGFromString(a, c, e)
            })
        };
        fabric.loadSVGFromString = function(a, b, c) {
            a = (new e).parseFromString(a);
            fabric.parseSVGDocument(a.documentElement, function(a, c) {
                b && b(a, c)
            }, c)
        };
        fabric.util.getScript = function(a, b) {
            d(a, "", function(a) {
                eval(a);
                b && b()
            })
        };
        fabric.Image.fromObject = function(a, b) {
            fabric.util.loadImage(a.src, function(c) {
                var d = new fabric.Image(c);
                d._initConfig(a);
                d._initFilters(a.filters, function(c) {
                    d.filters = c || [];
                    d._initFilters(a.resizeFilters, function(a) {
                        d.resizeFilters = a || [];
                        b && b(d)
                    })
                })
            })
        };
        fabric.createCanvasForNode = function(a, b, c, d) {
            d = d || c;
            var e = fabric.document.createElement("canvas");
            a = new g(a || 600, b || 600, d);
            e.style = {};
            e.width = a.width;
            e.height = a.height;
            c = new(fabric.Canvas || fabric.StaticCanvas)(e, c);
            c.contextContainer = a.getContext("2d");
            c.nodeCanvas = a;
            c.Font = g.Font;
            return c
        };
        fabric.StaticCanvas.prototype.createPNGStream = function() {
            return this.nodeCanvas.createPNGStream()
        };
        fabric.StaticCanvas.prototype.createJPEGStream = function(a) {
            return this.nodeCanvas.createJPEGStream(a)
        };
        var k = fabric.StaticCanvas.prototype.setWidth;
        fabric.StaticCanvas.prototype.setWidth = function(a, b) {
            k.call(this, a, b);
            this.nodeCanvas.width = a;
            return this
        };
        fabric.Canvas && (fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth);
        var l = fabric.StaticCanvas.prototype.setHeight;
        fabric.StaticCanvas.prototype.setHeight = function(a, b) {
            l.call(this, a, b);
            this.nodeCanvas.height = a;
            return this
        };
        fabric.Canvas && (fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight)
    }
})();