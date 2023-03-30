!(function (t, e) {
	"object" == typeof exports && "object" == typeof module
		? (module.exports = e())
		: "function" == typeof define && define.amd
		? define([], e)
		: "object" == typeof exports
		? (exports.clipboard = e())
		: (t.clipboard = e());
})(this, function () {
	return (function (t) {
		function e(r) {
			if (n[r]) return n[r].exports;
			var o = (n[r] = { i: r, l: !1, exports: {} });
			return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
		}
		var n = {};
		return (
			(e.m = t),
			(e.c = n),
			(e.d = function (t, n, r) {
				e.o(t, n) ||
					Object.defineProperty(t, n, {
						configurable: !1,
						enumerable: !0,
						get: r,
					});
			}),
			(e.n = function (t) {
				var n =
					t && t.__esModule
						? function () {
								return t.default;
						  }
						: function () {
								return t;
						  };
				return e.d(n, "a", n), n;
			}),
			(e.o = function (t, e) {
				return Object.prototype.hasOwnProperty.call(t, e);
			}),
			(e.p = ""),
			e((e.s = 0))
		);
	})([
		function (t, e, n) {
			"use strict";
			function r(t, e, n) {
				m("listener called"),
					(t.success = !0),
					e.forEach(function (e, r) {
						n.clipboardData.setData(r, e),
							r === b &&
								n.clipboardData.getData(r) != e &&
								(m("setting text/plain failed"), (t.success = !1));
					}),
					n.preventDefault();
			}
			function o(t) {
				var e = new _(),
					n = r.bind(this, e, t);
				document.addEventListener("copy", n);
				try {
					document.execCommand("copy");
				} finally {
					document.removeEventListener("copy", n);
				}
				return e;
			}
			function i(t, e) {
				c(t);
				var n = o(e);
				return a(), n;
			}
			function u(t) {
				var e = document.createElement("div");
				(e.textContent = "temporary element"), document.body.appendChild(e);
				var n = i(e, t);
				return document.body.removeChild(e), n;
			}
			function s(t) {
				m("copyTextUsingDOM");
				var e = document.createElement("div"),
					n = e.attachShadow({ mode: "open" });
				document.body.appendChild(e);
				var r = document.createElement("span");
				(r.innerText = t), n.appendChild(r), c(r);
				var o = document.execCommand("copy");
				return a(), document.body.removeChild(e), o;
			}
			function c(t) {
				var e = document.getSelection(),
					n = document.createRange();
				n.selectNodeContents(t), e.removeAllRanges(), e.addRange(n);
			}
			function a() {
				document.getSelection().removeAllRanges();
			}
			function l(t) {
				var e = new v.DT();
				return e.setData("text/plain", t), e;
			}
			function f() {
				return (
					"undefined" == typeof ClipboardEvent &&
					void 0 !== window.clipboardData &&
					void 0 !== window.clipboardData.setData
				);
			}
			function d(t) {
				var e = t.getData("text/plain");
				if (void 0 !== e) return window.clipboardData.setData("Text", e);
				throw "No `text/plain` value was specified.";
			}
			function p() {
				return new h.Promise(function (t, e) {
					var n = window.clipboardData.getData("Text");
					"" === n
						? e(
								new Error(
									"Empty clipboard or could not read plain text from clipboard"
								)
						  )
						: t(n);
				});
			}
			Object.defineProperty(e, "__esModule", { value: !0 });
			var h = n(1),
				v = n(5),
				m = function (t) {},
				y = !0,
				w = (console.warn || console.log).bind(console, "[clipboard-polyfill]"),
				b = "text/plain",
				g = (function () {
					function t() {}
					return (
						(t.setDebugLog = function (t) {
							m = t;
						}),
						(t.suppressWarnings = function () {
							(y = !1), v.suppressDTWarnings();
						}),
						(t.write = function (t) {
							return (
								y &&
									!t.getData(b) &&
									w(
										"clipboard.write() was called without a `text/plain` data type. On some platforms, this may result in an empty clipboard. Call clipboard.suppressWarnings() to suppress this warning."
									),
								new h.Promise(function (e, n) {
									if (f())
										return void (d(t)
											? e()
											: n(
													new Error(
														"Copying failed, possibly because the user rejected it."
													)
											  ));
									var r = o(t);
									if (r.success) return m("regular execCopy worked"), void e();
									if (navigator.userAgent.indexOf("Edge") > -1)
										return m('UA "Edge" => assuming success'), void e();
									if (((r = i(document.body, t)), r.success))
										return m("copyUsingTempSelection worked"), void e();
									if (((r = u(t)), r.success))
										return m("copyUsingTempElem worked"), void e();
									var c = t.getData(b);
									if (void 0 !== c && s(c))
										return m("copyTextUsingDOM worked"), void e();
									n(new Error("Copy command failed."));
								})
							);
						}),
						(t.writeText = function (t) {
							var e = new v.DT();
							return e.setData(b, t), this.write(e);
						}),
						(t.read = function () {
							return new h.Promise(function (t, e) {
								if (f())
									return void p().then(function (e) {
										return t(l(e));
									}, e);
								e("Read is not supported in your browser.");
							});
						}),
						(t.readText = function () {
							return f()
								? p()
								: new h.Promise(function (t, e) {
										e("Read is not supported in your browser.");
								  });
						}),
						(t.DT = v.DT),
						t
					);
				})();
			e.default = g;
			var _ = (function () {
				function t() {
					this.success = !1;
				}
				return t;
			})();
			t.exports = g;
		},
		function (t, e, n) {
			(function (e, r) {
				/*!
				 * @overview es6-promise - a tiny implementation of Promises/A+.
				 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
				 * @license   Licensed under MIT license
				 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
				 * @version   4.1.1
				 */
				!(function (e, n) {
					t.exports = n();
				})(0, function () {
					"use strict";
					function t(t) {
						var e = typeof t;
						return null !== t && ("object" === e || "function" === e);
					}
					function o(t) {
						return "function" == typeof t;
					}
					function i(t) {
						q = t;
					}
					function u(t) {
						z = t;
					}
					function s() {
						return void 0 !== K
							? function () {
									K(a);
							  }
							: c();
					}
					function c() {
						var t = setTimeout;
						return function () {
							return t(a, 1);
						};
					}
					function a() {
						for (var t = 0; t < I; t += 2) {
							(0, Z[t])(Z[t + 1]), (Z[t] = void 0), (Z[t + 1] = void 0);
						}
						I = 0;
					}
					function l(t, e) {
						var n = arguments,
							r = this,
							o = new this.constructor(d);
						void 0 === o[tt] && P(o);
						var i = r._state;
						return (
							i
								? (function () {
										var t = n[i - 1];
										z(function () {
											return j(i, o, t, r._result);
										});
								  })()
								: E(r, o, t, e),
							o
						);
					}
					function f(t) {
						var e = this;
						if (t && "object" == typeof t && t.constructor === e) return t;
						var n = new e(d);
						return g(n, t), n;
					}
					function d() {}
					function p() {
						return new TypeError("You cannot resolve a promise with itself");
					}
					function h() {
						return new TypeError(
							"A promises callback cannot return that same promise."
						);
					}
					function v(t) {
						try {
							return t.then;
						} catch (t) {
							return (ot.error = t), ot;
						}
					}
					function m(t, e, n, r) {
						try {
							t.call(e, n, r);
						} catch (t) {
							return t;
						}
					}
					function y(t, e, n) {
						z(function (t) {
							var r = !1,
								o = m(
									n,
									e,
									function (n) {
										r || ((r = !0), e !== n ? g(t, n) : T(t, n));
									},
									function (e) {
										r || ((r = !0), x(t, e));
									},
									"Settle: " + (t._label || " unknown promise")
								);
							!r && o && ((r = !0), x(t, o));
						}, t);
					}
					function w(t, e) {
						e._state === nt
							? T(t, e._result)
							: e._state === rt
							? x(t, e._result)
							: E(
									e,
									void 0,
									function (e) {
										return g(t, e);
									},
									function (e) {
										return x(t, e);
									}
							  );
					}
					function b(t, e, n) {
						e.constructor === t.constructor &&
						n === l &&
						e.constructor.resolve === f
							? w(t, e)
							: n === ot
							? (x(t, ot.error), (ot.error = null))
							: void 0 === n
							? T(t, e)
							: o(n)
							? y(t, e, n)
							: T(t, e);
					}
					function g(e, n) {
						e === n ? x(e, p()) : t(n) ? b(e, n, v(n)) : T(e, n);
					}
					function _(t) {
						t._onerror && t._onerror(t._result), D(t);
					}
					function T(t, e) {
						t._state === et &&
							((t._result = e),
							(t._state = nt),
							0 !== t._subscribers.length && z(D, t));
					}
					function x(t, e) {
						t._state === et && ((t._state = rt), (t._result = e), z(_, t));
					}
					function E(t, e, n, r) {
						var o = t._subscribers,
							i = o.length;
						(t._onerror = null),
							(o[i] = e),
							(o[i + nt] = n),
							(o[i + rt] = r),
							0 === i && t._state && z(D, t);
					}
					function D(t) {
						var e = t._subscribers,
							n = t._state;
						if (0 !== e.length) {
							for (
								var r = void 0, o = void 0, i = t._result, u = 0;
								u < e.length;
								u += 3
							)
								(r = e[u]), (o = e[u + n]), r ? j(n, r, o, i) : o(i);
							t._subscribers.length = 0;
						}
					}
					function A() {
						this.error = null;
					}
					function C(t, e) {
						try {
							return t(e);
						} catch (t) {
							return (it.error = t), it;
						}
					}
					function j(t, e, n, r) {
						var i = o(n),
							u = void 0,
							s = void 0,
							c = void 0,
							a = void 0;
						if (i) {
							if (
								((u = C(n, r)),
								u === it
									? ((a = !0), (s = u.error), (u.error = null))
									: (c = !0),
								e === u)
							)
								return void x(e, h());
						} else (u = r), (c = !0);
						e._state !== et ||
							(i && c
								? g(e, u)
								: a
								? x(e, s)
								: t === nt
								? T(e, u)
								: t === rt && x(e, u));
					}
					function O(t, e) {
						try {
							e(
								function (e) {
									g(t, e);
								},
								function (e) {
									x(t, e);
								}
							);
						} catch (e) {
							x(t, e);
						}
					}
					function S() {
						return ut++;
					}
					function P(t) {
						(t[tt] = ut++),
							(t._state = void 0),
							(t._result = void 0),
							(t._subscribers = []);
					}
					function M(t, e) {
						(this._instanceConstructor = t),
							(this.promise = new t(d)),
							this.promise[tt] || P(this.promise),
							H(e)
								? ((this.length = e.length),
								  (this._remaining = e.length),
								  (this._result = new Array(this.length)),
								  0 === this.length
										? T(this.promise, this._result)
										: ((this.length = this.length || 0),
										  this._enumerate(e),
										  0 === this._remaining && T(this.promise, this._result)))
								: x(this.promise, L());
					}
					function L() {
						return new Error("Array Methods must be provided an Array");
					}
					function k(t) {
						return new M(this, t).promise;
					}
					function U(t) {
						var e = this;
						return new e(
							H(t)
								? function (n, r) {
										for (var o = t.length, i = 0; i < o; i++)
											e.resolve(t[i]).then(n, r);
								  }
								: function (t, e) {
										return e(new TypeError("You must pass an array to race."));
								  }
						);
					}
					function R(t) {
						var e = this,
							n = new e(d);
						return x(n, t), n;
					}
					function W() {
						throw new TypeError(
							"You must pass a resolver function as the first argument to the promise constructor"
						);
					}
					function N() {
						throw new TypeError(
							"Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
						);
					}
					function F(t) {
						(this[tt] = S()),
							(this._result = this._state = void 0),
							(this._subscribers = []),
							d !== t &&
								("function" != typeof t && W(),
								this instanceof F ? O(this, t) : N());
					}
					function Y() {
						var t = void 0;
						if (void 0 !== r) t = r;
						else if ("undefined" != typeof self) t = self;
						else
							try {
								t = Function("return this")();
							} catch (t) {
								throw new Error(
									"polyfill failed because global object is unavailable in this environment"
								);
							}
						var e = t.Promise;
						if (e) {
							var n = null;
							try {
								n = Object.prototype.toString.call(e.resolve());
							} catch (t) {}
							if ("[object Promise]" === n && !e.cast) return;
						}
						t.Promise = F;
					}
					var X = void 0;
					X = Array.isArray
						? Array.isArray
						: function (t) {
								return "[object Array]" === Object.prototype.toString.call(t);
						  };
					var H = X,
						I = 0,
						K = void 0,
						q = void 0,
						z = function (t, e) {
							(Z[I] = t), (Z[I + 1] = e), 2 === (I += 2) && (q ? q(a) : $());
						},
						B = "undefined" != typeof window ? window : void 0,
						G = B || {},
						J = G.MutationObserver || G.WebKitMutationObserver,
						Q =
							"undefined" == typeof self &&
							void 0 !== e &&
							"[object process]" === {}.toString.call(e),
						V =
							"undefined" != typeof Uint8ClampedArray &&
							"undefined" != typeof importScripts &&
							"undefined" != typeof MessageChannel,
						Z = new Array(1e3),
						$ = void 0;
					$ = Q
						? (function () {
								return function () {
									return e.nextTick(a);
								};
						  })()
						: J
						? (function () {
								var t = 0,
									e = new J(a),
									n = document.createTextNode("");
								return (
									e.observe(n, { characterData: !0 }),
									function () {
										n.data = t = ++t % 2;
									}
								);
						  })()
						: V
						? (function () {
								var t = new MessageChannel();
								return (
									(t.port1.onmessage = a),
									function () {
										return t.port2.postMessage(0);
									}
								);
						  })()
						: void 0 === B
						? (function () {
								try {
									var t = n(4);
									return (K = t.runOnLoop || t.runOnContext), s();
								} catch (t) {
									return c();
								}
						  })()
						: c();
					var tt = Math.random().toString(36).substring(16),
						et = void 0,
						nt = 1,
						rt = 2,
						ot = new A(),
						it = new A(),
						ut = 0;
					return (
						(M.prototype._enumerate = function (t) {
							for (var e = 0; this._state === et && e < t.length; e++)
								this._eachEntry(t[e], e);
						}),
						(M.prototype._eachEntry = function (t, e) {
							var n = this._instanceConstructor,
								r = n.resolve;
							if (r === f) {
								var o = v(t);
								if (o === l && t._state !== et)
									this._settledAt(t._state, e, t._result);
								else if ("function" != typeof o)
									this._remaining--, (this._result[e] = t);
								else if (n === F) {
									var i = new n(d);
									b(i, t, o), this._willSettleAt(i, e);
								} else
									this._willSettleAt(
										new n(function (e) {
											return e(t);
										}),
										e
									);
							} else this._willSettleAt(r(t), e);
						}),
						(M.prototype._settledAt = function (t, e, n) {
							var r = this.promise;
							r._state === et &&
								(this._remaining--, t === rt ? x(r, n) : (this._result[e] = n)),
								0 === this._remaining && T(r, this._result);
						}),
						(M.prototype._willSettleAt = function (t, e) {
							var n = this;
							E(
								t,
								void 0,
								function (t) {
									return n._settledAt(nt, e, t);
								},
								function (t) {
									return n._settledAt(rt, e, t);
								}
							);
						}),
						(F.all = k),
						(F.race = U),
						(F.resolve = f),
						(F.reject = R),
						(F._setScheduler = i),
						(F._setAsap = u),
						(F._asap = z),
						(F.prototype = {
							constructor: F,
							then: l,
							catch: function (t) {
								return this.then(null, t);
							},
						}),
						(F.polyfill = Y),
						(F.Promise = F),
						F
					);
				});
			}.call(e, n(2), n(3)));
		},
		function (t, e) {
			function n() {
				throw new Error("setTimeout has not been defined");
			}
			function r() {
				throw new Error("clearTimeout has not been defined");
			}
			function o(t) {
				if (l === setTimeout) return setTimeout(t, 0);
				if ((l === n || !l) && setTimeout)
					return (l = setTimeout), setTimeout(t, 0);
				try {
					return l(t, 0);
				} catch (e) {
					try {
						return l.call(null, t, 0);
					} catch (e) {
						return l.call(this, t, 0);
					}
				}
			}
			function i(t) {
				if (f === clearTimeout) return clearTimeout(t);
				if ((f === r || !f) && clearTimeout)
					return (f = clearTimeout), clearTimeout(t);
				try {
					return f(t);
				} catch (e) {
					try {
						return f.call(null, t);
					} catch (e) {
						return f.call(this, t);
					}
				}
			}
			function u() {
				v &&
					p &&
					((v = !1), p.length ? (h = p.concat(h)) : (m = -1), h.length && s());
			}
			function s() {
				if (!v) {
					var t = o(u);
					v = !0;
					for (var e = h.length; e; ) {
						for (p = h, h = []; ++m < e; ) p && p[m].run();
						(m = -1), (e = h.length);
					}
					(p = null), (v = !1), i(t);
				}
			}
			function c(t, e) {
				(this.fun = t), (this.array = e);
			}
			function a() {}
			var l,
				f,
				d = (t.exports = {});
			!(function () {
				try {
					l = "function" == typeof setTimeout ? setTimeout : n;
				} catch (t) {
					l = n;
				}
				try {
					f = "function" == typeof clearTimeout ? clearTimeout : r;
				} catch (t) {
					f = r;
				}
			})();
			var p,
				h = [],
				v = !1,
				m = -1;
			(d.nextTick = function (t) {
				var e = new Array(arguments.length - 1);
				if (arguments.length > 1)
					for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
				h.push(new c(t, e)), 1 !== h.length || v || o(s);
			}),
				(c.prototype.run = function () {
					this.fun.apply(null, this.array);
				}),
				(d.title = "browser"),
				(d.browser = !0),
				(d.env = {}),
				(d.argv = []),
				(d.version = ""),
				(d.versions = {}),
				(d.on = a),
				(d.addListener = a),
				(d.once = a),
				(d.off = a),
				(d.removeListener = a),
				(d.removeAllListeners = a),
				(d.emit = a),
				(d.prependListener = a),
				(d.prependOnceListener = a),
				(d.listeners = function (t) {
					return [];
				}),
				(d.binding = function (t) {
					throw new Error("process.binding is not supported");
				}),
				(d.cwd = function () {
					return "/";
				}),
				(d.chdir = function (t) {
					throw new Error("process.chdir is not supported");
				}),
				(d.umask = function () {
					return 0;
				});
		},
		function (t, e) {
			var n;
			n = (function () {
				return this;
			})();
			try {
				n = n || Function("return this")() || (0, eval)("this");
			} catch (t) {
				"object" == typeof window && (n = window);
			}
			t.exports = n;
		},
		function (t, e) {},
		function (t, e, n) {
			"use strict";
			function r() {
				c = !1;
			}
			Object.defineProperty(e, "__esModule", { value: !0 });
			var o = { TEXT_PLAIN: "text/plain", TEXT_HTML: "text/html" },
				i = new Set();
			for (var u in o) i.add(o[u]);
			var s = (console.warn || console.log).bind(
					console,
					"[clipboard-polyfill]"
				),
				c = !0;
			e.suppressDTWarnings = r;
			var a = (function () {
				function t() {
					this.m = new Map();
				}
				return (
					(t.prototype.setData = function (t, e) {
						c &&
							!i.has(t) &&
							s(
								"Unknown data type: " + t,
								"Call clipboard.suppressWarnings() to suppress this warning."
							),
							this.m.set(t, e);
					}),
					(t.prototype.getData = function (t) {
						return this.m.get(t);
					}),
					(t.prototype.forEach = function (t) {
						return this.m.forEach(t);
					}),
					t
				);
			})();
			e.DT = a;
		},
	]);
});
