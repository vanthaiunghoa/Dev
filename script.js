/*CoolClock*/
window.CoolClock = function (options) {
	return this.init(options)
};
CoolClock.config = {
	tickDelay: 1000,
	longTickDelay: 15000,
	defaultRadius: 85,
	renderRadius: 100,
	defaultSkin: "chunkySwiss",
	showSecs: true,
	showAmPm: true,
	skins: {
		swissRail: {
			outerBorder: {
				lineWidth: 2,
				radius: 95,
				color: "black",
				alpha: 1
			},
			smallIndicator: {
				lineWidth: 2,
				startAt: 88,
				endAt: 92,
				color: "black",
				alpha: 1
			},
			largeIndicator: {
				lineWidth: 4,
				startAt: 79,
				endAt: 92,
				color: "black",
				alpha: 1
			},
			hourHand: {
				lineWidth: 8,
				startAt: -15,
				endAt: 50,
				color: "black",
				alpha: 1
			},
			minuteHand: {
				lineWidth: 7,
				startAt: -15,
				endAt: 75,
				color: "black",
				alpha: 1
			},
			secondHand: {
				lineWidth: 1,
				startAt: -20,
				endAt: 85,
				color: "red",
				alpha: 1
			},
			secondDecoration: {
				lineWidth: 1,
				startAt: 70,
				radius: 4,
				fillColor: "red",
				color: "red",
				alpha: 1
			}
		},
		chunkySwiss: {
			outerBorder: {
				lineWidth: 4,
				radius: 97,
				color: "black",
				alpha: 1
			},
			smallIndicator: {
				lineWidth: 4,
				startAt: 89,
				endAt: 93,
				color: "black",
				alpha: 1
			},
			largeIndicator: {
				lineWidth: 8,
				startAt: 80,
				endAt: 93,
				color: "black",
				alpha: 1
			},
			hourHand: {
				lineWidth: 12,
				startAt: -15,
				endAt: 60,
				color: "black",
				alpha: 1
			},
			minuteHand: {
				lineWidth: 10,
				startAt: -15,
				endAt: 85,
				color: "black",
				alpha: 1
			},
			secondHand: {
				lineWidth: 4,
				startAt: -20,
				endAt: 85,
				color: "red",
				alpha: 1
			},
			secondDecoration: {
				lineWidth: 2,
				startAt: 70,
				radius: 8,
				fillColor: "red",
				color: "red",
				alpha: 1
			}
		},
		chunkySwissOnBlack: {
			outerBorder: {
				lineWidth: 4,
				radius: 97,
				color: "white",
				alpha: 1
			},
			smallIndicator: {
				lineWidth: 4,
				startAt: 89,
				endAt: 93,
				color: "white",
				alpha: 1
			},
			largeIndicator: {
				lineWidth: 8,
				startAt: 80,
				endAt: 93,
				color: "white",
				alpha: 1
			},
			hourHand: {
				lineWidth: 12,
				startAt: -15,
				endAt: 60,
				color: "white",
				alpha: 1
			},
			minuteHand: {
				lineWidth: 10,
				startAt: -15,
				endAt: 85,
				color: "white",
				alpha: 1
			},
			secondHand: {
				lineWidth: 4,
				startAt: -20,
				endAt: 85,
				color: "red",
				alpha: 1
			},
			secondDecoration: {
				lineWidth: 2,
				startAt: 70,
				radius: 8,
				fillColor: "red",
				color: "red",
				alpha: 1
			}
		}
	},
	isIE: !!document.all,
	clockTracker: {},
	noIdCount: 0
};
CoolClock.prototype = {
	init: function (options) {
		this.canvasId = options.canvasId;
		this.skinId = options.skinId || CoolClock.config.defaultSkin;
		this.displayRadius = options.displayRadius || CoolClock.config.defaultRadius;
		this.showSecondHand = typeof options.showSecondHand == "boolean" ? options.showSecondHand : true;
		this.gmtOffset = (options.gmtOffset != null && options.gmtOffset != "") ? parseFloat(options.gmtOffset) : null;
		this.showDigital = typeof options.showDigital == "boolean" ? options.showDigital : false;
		this.logClock = typeof options.logClock == "boolean" ? options.logClock : false;
		this.logClockRev = typeof options.logClock == "boolean" ? options.logClockRev : false;
		this.tickDelay = CoolClock.config[this.showSecondHand ? "tickDelay" : "longTickDelay"];
		this.canvas = document.getElementById(this.canvasId);
		this.canvas.setAttribute("width", this.displayRadius * 2);
		this.canvas.setAttribute("height", this.displayRadius * 2);
		this.canvas.style.width = this.displayRadius * 2 + "px";
		this.canvas.style.height = this.displayRadius * 2 + "px";
		this.renderRadius = CoolClock.config.renderRadius;
		this.scale = this.displayRadius / this.renderRadius;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(this.scale, this.scale);
		CoolClock.config.clockTracker[this.canvasId] = this;
		this.tick();
		return this
	},
	fullCircleAt: function (x, y, skin) {
		this.ctx.save();
		this.ctx.globalAlpha = skin.alpha;
		this.ctx.lineWidth = skin.lineWidth;
		if (!CoolClock.config.isIE) {
			this.ctx.beginPath()
		}
		if (CoolClock.config.isIE) {
			this.ctx.lineWidth = this.ctx.lineWidth * this.scale
		}
		this.ctx.arc(x, y, skin.radius, 0, 2 * Math.PI, false);
		if (CoolClock.config.isIE) {
			this.ctx.arc(x, y, skin.radius, -0.1, 0.1, false)
		}
		if (skin.fillColor) {
			this.ctx.fillStyle = skin.fillColor;
			this.ctx.fill()
		} else {
			this.ctx.strokeStyle = skin.color;
			this.ctx.stroke()
		}
		this.ctx.restore()
	},
	drawTextAt: function (theText, x, y) {
		this.ctx.save();
		this.ctx.font = "15px sans-serif";
		var tSize = this.ctx.measureText(theText);
		if (!tSize.height) {
			tSize.height = 15
		}
		this.ctx.fillText(theText, x - tSize.width / 2, y - tSize.height / 2);
		this.ctx.restore()
	},
	lpad2: function (num) {
		return (num < 10 ? "0" : "") + num
	},
	tickAngle: function (second) {
		var tweak = 3;
		if (this.logClock) {
			return second == 0 ? 0 : (Math.log(second * tweak) / Math.log(60 * tweak))
		} else {
			if (this.logClockRev) {
				second = (60 - second) % 60;
				return 1 - (second == 0 ? 0 : (Math.log(second * tweak) / Math.log(60 * tweak)))
			} else {
				return second / 60
			}
		}
	},
	timeText: function (hour, min, sec) {
		var c = CoolClock.config;
		return "" + (c.showAmPm ? ((hour % 12) == 0 ? 12 : (hour % 12)) : hour) + ":" + this.lpad2(min) + (c.showSecs ? ":" + this.lpad2(sec) : "") + (c.showAmPm ? (hour < 12 ? " am" : " pm") : "")
	},
	radialLineAtAngle: function (angleFraction, skin) {
		this.ctx.save();
		this.ctx.translate(this.renderRadius, this.renderRadius);
		this.ctx.rotate(Math.PI * (2 * angleFraction - 0.5));
		this.ctx.globalAlpha = skin.alpha;
		this.ctx.strokeStyle = skin.color;
		this.ctx.lineWidth = skin.lineWidth;
		if (CoolClock.config.isIE) {
			this.ctx.lineWidth = this.ctx.lineWidth * this.scale
		}
		if (skin.radius) {
			this.fullCircleAt(skin.startAt, 0, skin)
		} else {
			this.ctx.beginPath();
			this.ctx.moveTo(skin.startAt, 0);
			this.ctx.lineTo(skin.endAt, 0);
			this.ctx.stroke()
		}
		this.ctx.restore()
	},
	render: function (hour, min, sec) {
		var skin = CoolClock.config.skins[this.skinId];
		if (!skin) {
			skin = CoolClock.config.skins[CoolClock.config.defaultSkin]
		}
		this.ctx.clearRect(0, 0, this.renderRadius * 2, this.renderRadius * 2);
		if (skin.outerBorder) {
			this.fullCircleAt(this.renderRadius, this.renderRadius, skin.outerBorder)
		}
		for (var i = 0; i < 60; i++) {
			(i % 5) && skin.smallIndicator && this.radialLineAtAngle(this.tickAngle(i), skin.smallIndicator);
			!(i % 5) && skin.largeIndicator && this.radialLineAtAngle(this.tickAngle(i), skin.largeIndicator)
		}
		if (this.showDigital) {
			this.drawTextAt(this.timeText(hour, min, sec), this.renderRadius, this.renderRadius + this.renderRadius / 2)
		}
		if (skin.hourHand) {
			this.radialLineAtAngle(this.tickAngle(((hour % 12) * 5 + min / 12)), skin.hourHand)
		}
		if (skin.minuteHand) {
			this.radialLineAtAngle(this.tickAngle((min + sec / 60)), skin.minuteHand)
		}
		if (this.showSecondHand && skin.secondHand) {
			this.radialLineAtAngle(this.tickAngle(sec), skin.secondHand)
		}
		if (!CoolClock.config.isIE && this.showSecondHand && skin.secondDecoration) {
			this.radialLineAtAngle(this.tickAngle(sec), skin.secondDecoration)
		}
	},
	refreshDisplay: function () {
		var now = new Date();
		if (this.gmtOffset != null) {
			var offsetNow = new Date(now.valueOf() + (this.gmtOffset * 1000 * 60 * 60));
			this.render(offsetNow.getUTCHours(), offsetNow.getUTCMinutes(), offsetNow.getUTCSeconds())
		} else {
			this.render(now.getHours(), now.getMinutes(), now.getSeconds())
		}
	},
	nextTick: function () {
		setTimeout("CoolClock.config.clockTracker['" + this.canvasId + "'].tick()", this.tickDelay)
	},
	stillHere: function () {
		return document.getElementById(this.canvasId) != null
	},
	tick: function () {
		if (this.stillHere()) {
			this.refreshDisplay();
			this.nextTick()
		}
	}
};
CoolClock.findAndCreateClocks = function () {
	var canvases = document.getElementsByTagName("canvas");
	for (var i = 0; i < canvases.length; i++) {
		var fields = canvases[i].className.split(" ")[0].split(":");
		if (fields[0] == "CoolClock") {
			if (!canvases[i].id) {
				canvases[i].id = "_coolclock_auto_id_" + CoolClock.config.noIdCount++
			}
			new CoolClock({
				canvasId: canvases[i].id,
				skinId: fields[1],
				displayRadius: fields[2],
				showSecondHand: fields[3] != "noSeconds",
				gmtOffset: fields[4],
				showDigital: fields[5] == "showDigital",
				logClock: fields[6] == "logClock",
				logClockRev: fields[6] == "logClockRev"
			})
		}
	}
};
if (window.jQuery) {
	jQuery(document).ready(CoolClock.findAndCreateClocks)
};

/*Freewall*/
(function (e) {
	e.isNumeric == null && (e.isNumeric = function (e) {
		return e != null && e.constructor === Number
	});
	e.isFunction == null && (e.isFunction = function (e) {
		return e != null && e instanceof Function
	});
	var t = e(window);
	var n = e(document);
	var r = {
		defaultConfig: {
			animate: false,
			cache: true,
			cellW: 100,
			cellH: 100,
			delay: 0,
			engine: "giot",
			fixSize: null,
			gutterX: 15,
			gutterY: 15,
			selector: "> div",
			draggable: false,
			rightToLeft: false,
			bottomToTop: false,
			onGapFound: function () {},
			onComplete: function () {},
			onResize: function () {},
			onBlockReady: function () {},
			onBlockFinish: function () {},
			onBlockActive: function () {},
			onBlockResize: function () {}
		},
		plugin: {},
		totalGrid: 1,
		transition: false,
		loadBlock: function (t, n) {
			var r = n.runtime;
			var i = r.gutterX;
			var s = r.gutterY;
			var o = r.cellH;
			var u = r.cellW;
			var a = null;
			var f = e(t);
			var l = f.data("active");
			var c = f.attr("data-position");
			var h = parseInt(f.attr("data-fixSize"));
			var p = r.lastId++ + "-" + r.totalGrid;
			if (f.hasClass("fw-float"))
				return;
			f.attr({
				id: p,
				"data-delay": t.index
			});
			if (n.animate && this.transition) {
				this.setTransition(t, "")
			}
			isNaN(h) && (h = null);
			h == null && (h = n.fixSize);
			var d = h == 1 ? "ceil" : "round";
			f.attr("data-height") == null && f.attr("data-height", f.height());
			f.attr("data-width") == null && f.attr("data-width", f.width());
			var v = 1 * f.attr("data-height");
			var m = 1 * f.attr("data-width");
			if (!n.cache) {
				t.style.width = "";
				m = f.width();
				t.style.height = "";
				v = f.height()
			}
			var g = !m ? 0 : Math[d]((m + i) / u);
			var y = !v ? 0 : Math[d]((v + s) / o);
			if (!h && n.cellH == "auto") {
				f.width(u * g - i);
				t.style.height = "";
				v = f.height();
				y = !v ? 0 : Math.round((v + s) / o)
			}
			if (!h && n.cellW == "auto") {
				f.height(o * y - s);
				t.style.width = "";
				m = f.width();
				g = !m ? 0 : Math.round((m + i) / u)
			}
			if (h != null && (g > r.limitCol || y > r.limitRow)) {
				a = null
			} else {
				y && y < r.minHoB && (r.minHoB = y);
				g && g < r.minWoB && (r.minWoB = g);
				y > r.maxHoB && (r.maxHoB = y);
				g > r.maxWoB && (r.maxWoB = g);
				m == 0 && (g = 0);
				v == 0 && (y = 0);
				a = {
					resize: false,
					id: p,
					width: g,
					height: y,
					fixSize: h
				};
				if (c) {
					c = c.split("-");
					a.y = 1 * c[0];
					a.x = 1 * c[1];
					a.width = h != null ? g : Math.min(g, r.limitCol - a.x);
					a.height = h != null ? y : Math.min(y, r.limitRow - a.y);
					var b = a.y + "-" + a.x + "-" + a.width + "-" + a.height;
					if (l) {
						r.holes[b] = {
							id: a.id,
							top: a.y,
							left: a.x,
							width: a.width,
							height: a.height
						};
						this.setBlock(a, n)
					} else {
						delete r.holes[b]
					}
				}
			}
			if (f.attr("data-state") == null) {
				f.attr("data-state", "init")
			} else {
				f.attr("data-state", "move")
			}
			n.onBlockReady.call(t, a, n);
			return c && l ? null : a
		},
		setBlock: function (e, t) {
			var n = t.runtime;
			var r = n.gutterX;
			var i = n.gutterY;
			var s = e.height;
			var o = e.width;
			var u = n.cellH;
			var a = n.cellW;
			var f = e.x;
			var l = e.y;
			if (t.rightToLeft) {
				f = n.limitCol - f - o
			}
			if (t.bottomToTop) {
				l = n.limitRow - l - s
			}
			var c = {
				fixSize: e.fixSize,
				resize: e.resize,
				top: l * u,
				left: f * a,
				width: a * o - r,
				height: u * s - i
			};
			c.top = 1 * c.top.toFixed(2);
			c.left = 1 * c.left.toFixed(2);
			c.width = 1 * c.width.toFixed(2);
			c.height = 1 * c.height.toFixed(2);
			e.id && (n.blocks[e.id] = c);
			return c
		},
		showBlock: function (t, n) {
			function l() {
				a && o.attr("data-state", "start");
				if (n.animate && u.transition) {
					u.setTransition(t, f)
				}
				if (!s) {
					var e = parseInt(t.style.height) || 0;
					var l = parseInt(t.style.width) || 0;
					var c = parseInt(t.style.left) || 0;
					var h = parseInt(t.style.top) || 0;
					o[i]({
						left: c + l / 2,
						top: h + e / 2,
						width: 0,
						height: 0,
						opacity: 0
					})
				} else {
					if (s.fixSize) {
						s.height = 1 * o.attr("data-height");
						s.width = 1 * o.attr("data-width")
					}
					o["css"]({
						opacity: 1,
						width: s.width,
						height: s.height
					});
					o[i]({
						top: s.top,
						left: s.left
					});
					if (o.attr("data-nested") != null) {
						u.nestedGrid(t, n)
					}
				}
				r.length -= 1;
				n.onBlockFinish.call(t, s, n);
				r.length == 0 && n.onComplete.call(t, s, n)
			}
			var r = n.runtime;
			var i = n.animate && !this.transition ? "animate" : "css";
			var s = r.blocks[t.id];
			var o = e(t);
			var u = this;
			var a = o.attr("data-state") != "move";
			var f = a ? "width 0.5s, height 0.5s" : "top 0.5s, left 0.5s, width 0.5s, height 0.5s, opacity 0.5s";
			t.delay && clearTimeout(t.delay);
			if (o.hasClass("fw-float"))
				return;
			u.setTransition(t, "");
			t.style.position = "absolute";
			n.onBlockActive.call(t, s, n);
			s && s.resize && n.onBlockResize.call(t, s, n);
			n.delay > 0 ? t.delay = setTimeout(l, n.delay * o.attr("data-delay")) : l()
		},
		nestedGrid: function (t, n) {
			var r,
			i = e(t),
			s = n.runtime;
			var o = i.attr("data-gutterX") || n.gutterX;
			var u = i.attr("data-gutterY") || n.gutterY;
			var a = i.attr("data-method") || "fitZone";
			var f = i.attr("data-nested") || "> div";
			var l = i.attr("data-cellH") || n.cellH;
			var c = i.attr("data-cellW") || n.cellW;
			var h = s.blocks[t.id];
			if (h) {
				r = new freewall(i);
				r.reset({
					cellH: l,
					cellW: c,
					gutterX: 1 * o,
					gutterY: 1 * u,
					selector: f
				});
				switch (a) {
				case "fitHeight":
					r[a](h.height);
					break;
				case "fitWidth":
					r[a](h.width);
					break;
				case "fitZone":
					r[a](h.width, h.height);
					break
				}
			}
		},
		adjustBlock: function (t, n) {
			var r = n.runtime;
			var i = r.gutterX;
			var s = r.gutterY;
			var o = e("#" + t.id);
			var u = r.cellH;
			var a = r.cellW;
			if (n.cellH == "auto") {
				o.width(t.width * a - i);
				o[0].style.height = "";
				t.height = Math.round((o.height() + s) / u)
			}
		},
		adjustUnit: function (t, n, r) {
			var i = r.gutterX;
			var s = r.gutterY;
			var o = r.runtime;
			var u = r.cellW;
			var a = r.cellH;
			e.isFunction(u) && (u = u(t));
			u = 1 * u;
			!e.isNumeric(u) && (u = 1);
			e.isFunction(a) && (a = a(n));
			a = 1 * a;
			!e.isNumeric(a) && (a = 1);
			if (e.isNumeric(t)) {
				u < 1 && (u = u * t);
				var f = Math.max(1, Math.floor(t / u));
				if (!e.isNumeric(i)) {
					i = (t - f * u) / Math.max(1, f - 1);
					i = Math.max(0, i)
				}
				f = Math.floor((t + i) / u);
				o.cellW = (t + i) / Math.max(f, 1);
				o.cellS = o.cellW / u;
				o.gutterX = i;
				o.limitCol = f
			}
			if (e.isNumeric(n)) {
				a < 1 && (a = a * n);
				var l = Math.max(1, Math.floor(n / a));
				if (!e.isNumeric(s)) {
					s = (n - l * a) / Math.max(1, l - 1);
					s = Math.max(0, s)
				}
				l = Math.floor((n + s) / a);
				o.cellH = (n + s) / Math.max(l, 1);
				o.cellS = o.cellH / a;
				o.gutterY = s;
				o.limitRow = l
			}
			if (!e.isNumeric(t)) {
				u < 1 && (u = o.cellH);
				o.cellW = u != 1 ? u * o.cellS : 1;
				o.gutterX = i;
				o.limitCol = 666666
			}
			if (!e.isNumeric(n)) {
				a < 1 && (a = o.cellW);
				o.cellH = a != 1 ? a * o.cellS : 1;
				o.gutterY = s;
				o.limitRow = 666666
			}
		},
		resetGrid: function (e) {
			e.blocks = {};
			e.length = 0;
			e.cellH = 0;
			e.cellW = 0;
			e.lastId = 1;
			e.matrix = {};
			e.totalCol = 0;
			e.totalRow = 0
		},
		setDraggable: function (t, r) {
			var i = false;
			var s = {
				startX: 0,
				startY: 0,
				top: 0,
				left: 0,
				handle: null,
				onDrop: function () {},
				onDrag: function () {},
				onStart: function () {}
			};
			e(t).each(function () {
				function c(e) {
					e.stopPropagation();
					e = e.originalEvent;
					if (e.touches) {
						i = true;
						e = e.changedTouches[0]
					}
					if (e.button != 2 && e.which != 3) {
						t.onStart.call(u, e);
						t.startX = e.clientX;
						t.startY = e.clientY;
						t.top = parseInt(a.css("top")) || 0;
						t.left = parseInt(a.css("left")) || 0;
						n.bind("mouseup touchend", p);
						n.bind("mousemove touchmove", h)
					}
					return false
				}
				function h(e) {
					e = e.originalEvent;
					i && (e = e.changedTouches[0]);
					a.css({
						top: t.top - (t.startY - e.clientY),
						left: t.left - (t.startX - e.clientX)
					});
					t.onDrag.call(u, e)
				}
				function p(e) {
					e = e.originalEvent;
					i && (e = e.changedTouches[0]);
					t.onDrop.call(u, e);
					n.unbind("mouseup touchend", p);
					n.unbind("mousemove touchmove", h)
				}
				var t = e.extend({}, s, r);
				var o = t.handle || this;
				var u = this;
				var a = e(u);
				var f = e(o);
				var l = a.css("position");
				l != "absolute" && a.css("position", "relative");
				a.find("iframe, form, input, textarea, .ignore-drag").each(function () {
					e(this).on("touchstart mousedown", function (e) {
						e.stopPropagation()
					})
				});
				n.unbind("mouseup touchend", p);
				n.unbind("mousemove touchmove", h);
				f.unbind("mousedown touchstart").bind("mousedown touchstart", c)
			})
		},
		setTransition: function (t, n) {
			var r = t.style;
			var i = e(t);
			if (!this.transition && i.stop) {
				i.stop()
			} else if (r.webkitTransition != null) {
				r.webkitTransition = n
			} else if (r.MozTransition != null) {
				r.MozTransition = n
			} else if (r.msTransition != null) {
				r.msTransition = n
			} else if (r.OTransition != null) {
				r.OTransition = n
			} else {
				r.transition = n
			}
		},
		getFreeArea: function (e, t, n) {
			var r = Math.min(e + n.maxHoB, n.limitRow);
			var i = Math.min(t + n.maxWoB, n.limitCol);
			var s = i;
			var o = r;
			var u = n.matrix;
			for (var a = e; a < o; ++a) {
				for (var f = t; f < i; ++f) {
					if (u[a + "-" + f]) {
						t < f && f < s && (s = f)
					}
				}
			}
			for (var a = e; a < r; ++a) {
				for (var f = t; f < s; ++f) {
					if (u[a + "-" + f]) {
						e < a && a < o && (o = a)
					}
				}
			}
			return {
				top: e,
				left: t,
				width: s - t,
				height: o - e
			}
		},
		setWallSize: function (e, t) {
			var n = e.totalRow;
			var r = e.totalCol;
			var i = e.gutterY;
			var s = e.gutterX;
			var o = e.cellH;
			var u = e.cellW;
			var a = Math.max(0, u * r - s);
			var f = Math.max(0, o * n - i);
			t.attr({
				"data-total-col": r,
				"data-total-row": n,
				"data-wall-width": Math.ceil(a),
				"data-wall-height": Math.ceil(f)
			});
			if (e.limitCol < e.limitRow) {
				!t.attr("data-height") && t.height(Math.ceil(f))
			}
		}
	};
	var i = {
		giot: function (e, t) {
			function w(e, t, n, r, i) {
				for (var s = t; s < t + i; ) {
					for (var o = n; o < n + r; ) {
						p[s + "-" + o] = e;
						++o > a && (a = o)
					}
					++s > f && (f = s)
				}
			}
			var n = t.runtime,
			i = n.limitRow,
			s = n.limitCol,
			o = 0,
			u = 0,
			a = n.totalCol,
			f = n.totalRow,
			l = {},
			c = n.holes,
			h = null,
			p = n.matrix,
			d = Math.max(s, i),
			v = null,
			m = null,
			g = s < i ? 1 : 0,
			y = null,
			b = Math.min(s, i);
			for (var E in c) {
				if (c.hasOwnProperty(E)) {
					w(c[E]["id"] || true, c[E]["top"], c[E]["left"], c[E]["width"], c[E]["height"])
				}
			}
			for (var S = 0; S < d; ++S) {
				if (!e.length)
					break;
				g ? u = S : o = S;
				y = null;
				for (var x = 0; x < b; ++x) {
					if (!e.length)
						break;
					g ? o = x : u = x;
					if (n.matrix[u + "-" + o])
						continue;
					v = r.getFreeArea(u, o, n);
					h = null;
					for (var E = 0; E < e.length; ++E) {
						if (e[E].height > v.height)
							continue;
						if (e[E].width > v.width)
							continue;
						h = e.splice(E, 1)[0];
						break
					}
					if (h == null && t.fixSize == null) {
						if (y && !g && n.minHoB > v.height) {
							y.height += v.height;
							y.resize = true;
							w(y.id, y.y, y.x, y.width, y.height);
							r.setBlock(y, t);
							continue
						} else if (y && g && n.minWoB > v.width) {
							y.width += v.width;
							y.resize = true;
							w(y.id, y.y, y.x, y.width, y.height);
							r.setBlock(y, t);
							continue
						} else {
							for (var E = 0; E < e.length; ++E) {
								if (e[E]["fixSize"] != null)
									continue;
								h = e.splice(E, 1)[0];
								h.resize = true;
								if (g) {
									h.width = v.width;
									if (t.cellH == "auto") {
										r.adjustBlock(h, t)
									}
									h.height = Math.min(h.height, v.height)
								} else {
									h.height = v.height;
									h.width = Math.min(h.width, v.width)
								}
								break
							}
						}
					}
					if (h != null) {
						l[h.id] = {
							id: h.id,
							x: o,
							y: u,
							width: h.width,
							height: h.height,
							resize: h.resize,
							fixSize: h.fixSize
						};
						y = l[h.id];
						w(y.id, y.y, y.x, y.width, y.height);
						r.setBlock(y, t)
					} else {
						var m = {
							x: o,
							y: u,
							fixSize: 0
						};
						if (g) {
							m.width = v.width;
							m.height = 0;
							var T = o - 1;
							var N = u;
							while (p[N + "-" + T]) {
								p[N + "-" + o] = true;
								m.height += 1;
								N += 1
							}
						} else {
							m.height = v.height;
							m.width = 0;
							var N = u - 1;
							var T = o;
							while (p[N + "-" + T]) {
								p[u + "-" + T] = true;
								m.width += 1;
								T += 1
							}
						}
						t.onGapFound(r.setBlock(m, t), t)
					}
				}
			}
			n.matrix = p;
			n.totalRow = f;
			n.totalCol = a
		}
	};
	window.freewall = function (n) {
		function c(t) {
			var n = f.gutterX;
			var i = f.gutterY;
			var s = f.cellH;
			var o = f.cellW;
			var l = e(t);
			var c = l.find(l.attr("data-handle"));
			r.setDraggable(t, {
				handle: c[0],
				onStart: function (e) {
					if (a.animate && r.transition) {
						r.setTransition(this, "")
					}
					l.css("z-index", 9999).addClass("fw-float")
				},
				onDrag: function (e, t) {
					var n = l.position();
					var r = Math.round(n.top / s);
					var i = Math.round(n.left / o);
					var a = Math.round(l.width() / o);
					var c = Math.round(l.height() / s);
					r = Math.min(Math.max(0, r), f.limitRow - c);
					i = Math.min(Math.max(0, i), f.limitCol - a);
					u.setHoles({
						top: r,
						left: i,
						width: a,
						height: c
					});
					u.refresh()
				},
				onDrop: function () {
					var t = l.position();
					var n = Math.round(t.top / s);
					var r = Math.round(t.left / o);
					var i = Math.round(l.width() / o);
					var a = Math.round(l.height() / s);
					n = Math.min(Math.max(0, n), f.limitRow - a);
					r = Math.min(Math.max(0, r), f.limitCol - i);
					l.removeClass("fw-float");
					l.css({
						zIndex: "auto",
						top: n * s,
						left: r * o
					});
					var c,
					h,
					p,
					d;
					for (h = 0; h < a; ++h) {
						for (c = 0; c < i; ++c) {
							p = h + n + "-" + (c + r);
							d = f.matrix[p];
							if (d && d != true) {
								e("#" + d).removeAttr("data-position")
							}
						}
					}
					f.holes = {};
					l.attr({
						"data-width": l.width(),
						"data-height": l.height(),
						"data-position": n + "-" + r
					});
					u.refresh()
				}
			})
		}
		var s = e(n);
		if (s.css("position") == "static") {
			s.css("position", "relative")
		}
		var o = Number.MAX_VALUE;
		var u = this;
		r.totalGrid += 1;
		var a = e.extend({}, r.defaultConfig);
		var f = {
			blocks: {},
			events: {},
			matrix: {},
			holes: {},
			cellW: 0,
			cellH: 0,
			cellS: 1,
			filter: "",
			lastId: 0,
			length: 0,
			maxWoB: 0,
			maxHoB: 0,
			minWoB: o,
			minHoB: o,
			running: 0,
			gutterX: 15,
			gutterY: 15,
			totalCol: 0,
			totalRow: 0,
			limitCol: 666666,
			limitRow: 666666,
			currentMethod: null,
			currentArguments: []
		};
		a.runtime = f;
		f.totalGrid = r.totalGrid;
		var l = document.body.style;
		if (!r.transition) {
			(l.webkitTransition != null || l.MozTransition != null || l.msTransition != null || l.OTransition != null || l.transition != null) && (r.transition = true)
		}
		e.extend(u, {
			addCustomEvent: function (e, t) {
				var n = f.events;
				e = e.toLowerCase();
				!n[e] && (n[e] = []);
				t.eid = n[e].length;
				n[e].push(t);
				return this
			},
			appendBlock: function (t) {
				var n = e(t).appendTo(s);
				var o = null;
				var u = [];
				if (f.currentMethod) {
					n.each(function (e, t) {
						t.index = ++e;
						if (o = r.loadBlock(t, a)) {
							u.push(o)
						}
					});
					i[a.engine](u, a);
					r.setWallSize(f, s);
					f.length = n.length;
					n.each(function (e, t) {
						r.showBlock(t, a);
						if (a.draggable || t.getAttribute("data-draggable")) {
							c(t)
						}
					})
				}
			},
			appendHoles: function (e) {
				var t = [].concat(e),
				n = {},
				r;
				for (r = 0; r < t.length; ++r) {
					n = t[r];
					f.holes[n.top + "-" + n.left + "-" + n.width + "-" + n.height] = n
				}
				return this
			},
			container: s,
			destroy: function () {
				var t = s.find(a.selector).removeAttr("id"),
				n = null,
				r = [];
				t.each(function (t, n) {
					$item = e(n);
					var r = 1 * $item.attr("data-width") || "";
					var i = 1 * $item.attr("data-height") || "";
					$item.width(r).height(i).css({
						position: "static"
					})
				})
			},
			fillHoles: function (e) {
				if (arguments.length == 0) {
					f.holes = {}
				} else {
					var t = [].concat(e),
					n = {},
					r;
					for (r = 0; r < t.length; ++r) {
						n = t[r];
						delete f.holes[n.top + "-" + n.left + "-" + n.width + "-" + n.height]
					}
				}
				return this
			},
			filter: function (e) {
				f.filter = e;
				f.currentMethod && this.refresh();
				return this
			},
			fireEvent: function (e, t, n) {
				var r = f.events;
				e = e.toLowerCase();
				if (r[e] && r[e].length) {
					for (var i = 0; i < r[e].length; ++i) {
						r[e][i].call(this, t, n)
					}
				}
				return this
			},
			fitHeight: function (n) {
				var o = s.find(a.selector).removeAttr("id"),
				l = null,
				h = [];
				n = n ? n : s.height() || t.height();
				f.currentMethod = arguments.callee;
				f.currentArguments = arguments;
				r.resetGrid(f);
				r.adjustUnit("auto", n, a);
				if (f.filter) {
					o.data("active", 0);
					o.filter(f.filter).data("active", 1)
				} else {
					o.data("active", 1)
				}
				o.each(function (t, n) {
					var i = e(n);
					n.index = ++t;
					if (l = r.loadBlock(n, a)) {
						i.data("active") && h.push(l)
					}
				});
				u.fireEvent("onGridReady", s, a);
				i[a.engine](h, a);
				r.setWallSize(f, s);
				u.fireEvent("onGridArrange", s, a);
				f.length = o.length;
				o.each(function (e, t) {
					r.showBlock(t, a);
					if (a.draggable || t.getAttribute("data-draggable")) {
						c(t)
					}
				})
			},
			fitWidth: function (n) {
				var o = s.find(a.selector).removeAttr("id"),
				l = null,
				h = [];
				n = n ? n : s.width() || t.width();
				f.currentMethod = arguments.callee;
				f.currentArguments = arguments;
				r.resetGrid(f);
				r.adjustUnit(n, "auto", a);
				if (f.filter) {
					o.data("active", 0);
					o.filter(f.filter).data("active", 1)
				} else {
					o.data("active", 1)
				}
				o.each(function (t, n) {
					var i = e(n);
					n.index = ++t;
					if (l = r.loadBlock(n, a)) {
						i.data("active") && h.push(l)
					}
				});
				u.fireEvent("onGridReady", s, a);
				i[a.engine](h, a);
				r.setWallSize(f, s);
				u.fireEvent("onGridArrange", s, a);
				f.length = o.length;
				o.each(function (e, t) {
					r.showBlock(t, a);
					if (a.draggable || t.getAttribute("data-draggable")) {
						c(t)
					}
				})
			},
			fitZone: function (n, o) {
				var l = s.find(a.selector).removeAttr("id"),
				h = null,
				p = [];
				o = o ? o : s.height() || t.height();
				n = n ? n : s.width() || t.width();
				f.currentMethod = arguments.callee;
				f.currentArguments = arguments;
				r.resetGrid(f);
				r.adjustUnit(n, o, a);
				if (f.filter) {
					l.data("active", 0);
					l.filter(f.filter).data("active", 1)
				} else {
					l.data("active", 1)
				}
				l.each(function (t, n) {
					var i = e(n);
					n.index = ++t;
					if (h = r.loadBlock(n, a)) {
						i.data("active") && p.push(h)
					}
				});
				u.fireEvent("onGridReady", s, a);
				i[a.engine](p, a);
				r.setWallSize(f, s);
				u.fireEvent("onGridArrange", s, a);
				f.length = l.length;
				l.each(function (e, t) {
					r.showBlock(t, a);
					if (a.draggable || t.getAttribute("data-draggable")) {
						c(t)
					}
				})
			},
			fixPos: function (t) {
				e(t.block).attr({
					"data-position": t.top + "-" + t.left
				});
				return this
			},
			fixSize: function (t) {
				t.height != null && e(t.block).attr({
					"data-height": t.height
				});
				t.width != null && e(t.block).attr({
					"data-width": t.width
				});
				return this
			},
			prepend: function (e) {
				s.prepend(e);
				f.currentMethod && this.refresh();
				return this
			},
			refresh: function () {
				var e = arguments.length ? arguments : f.currentArguments;
				f.currentMethod == null && (f.currentMethod = this.fitWidth);
				f.currentMethod.apply(this, Array.prototype.slice.call(e, 0));
				return this
			},
			reset: function (t) {
				e.extend(a, t);
				return this
			},
			setHoles: function (e) {
				var t = [].concat(e),
				n = {},
				r;
				f.holes = {};
				for (r = 0; r < t.length; ++r) {
					n = t[r];
					f.holes[n.top + "-" + n.left + "-" + n.width + "-" + n.height] = n
				}
				return this
			},
			unFilter: function () {
				delete f.filter;
				this.refresh();
				return this
			}
		});
		s.attr("data-min-width", Math.floor(t.width() / 80) * 80);
		for (var h in r.plugin) {
			if (r.plugin.hasOwnProperty(h)) {
				r.plugin[h].call(u, a, s)
			}
		}
		t.resize(function () {
			if (f.running)
				return;
			f.running = 1;
			setTimeout(function () {
				f.running = 0;
				a.onResize.call(u, s)
			}, 122);
			s.attr("data-min-width", Math.floor(t.width() / 80) * 80)
		})
	};
	freewall.addConfig = function (t) {
		e.extend(r.defaultConfig, t)
	};
	freewall.createEngine = function (t) {
		e.extend(i, t)
	};
	freewall.createPlugin = function (t) {
		e.extend(r.plugin, t)
	};
	freewall.getMethod = function (e) {
		return r[e]
	}
})(window.Zepto || window.jQuery)

/*SmartTiles*/

function thermostatEvent(t, e) {
	window[t.data("device")] && clearTimeout(window[t.data("device")]);
	var i = parseInt(t.attr("data-setpoint"));
	i < maxTemp && i > minTemp && (i += e, t.find(".icon.setpoint").html(i + "&deg;")),
	t.attr("data-setpoint", i),
	window[t.data("device")] = setTimeout(function () {
			animateClick(t),
			sendCommand(t.attr("data-type"), t.attr("data-device"), "setpoint", i)
		}, 500)
}
function animateClick(t) {
	spinner(t),
	t.closest(".tile").animate({
		opacity: .3
	}, fadeOff, "swing").delay(fadeOn).animate({
		opacity: 1
	}, fadeOn, "swing")
}
function spinner(t) {
	t.closest(".tile").find(".spinner").fadeIn("slow").delay(2e3).fadeOut("slow")
}
function setIcons() {
	$(".switch").append("<div class='icon'>" + icons["switch"].on + icons["switch"].off + "</div>"),
	$(".dimmer").append("<div class='icon'>" + icons.dimmer.on + icons.dimmer.off + "</div>"),
	$(".light").append("<div class='icon'>" + icons.light.on + icons.light.off + "</div>"),
	$(".dimmerLight").append("<div class='icon'>" + icons.light.on + icons.light.off + "</div>"),
	$(".themeLight").append("<div class='icon'>" + icons.themeLight.on + icons.themeLight.off + "</div>"),
	$(".lock").append("<div class='icon'>" + icons.lock.locked + icons.lock.unlocked + "</div>"),
	$(".motion").append("<div class='icon'>" + icons.motion.active + icons.motion.inactive + "</div>"),
	$(".acceleration").append("<div class='icon'>" + icons.acceleration.active + icons.acceleration.inactive + "</div>"),
	$(".presence").append("<div class='icon'>" + icons.presence.present + icons.presence.notPresent + "</div>"),
	$(".contact").append("<div class='icon'>" + icons.contact.open + icons.contact.closed + "</div>"),
	$(".water").append("<div class='icon'>" + icons.water.dry + icons.water.wet + "</div>"),
	$(".dimmer, .dimmerLight, .music").each(function () {
		renderSlider($(this))
	}),
	$(".momentary").append("<div class='icon'>" + icons.momentary + "</div>"),
	$(".camera").append("<div class='icon'>" + icons.camera + "</div>"),
	$(".refresh").append("<div class='icon'>" + icons.refresh + "</div>"),
	$(".history").append("<div class='icon'>" + icons.history + "</div>"),
	$(".hello-home").append("<div class='icon'>" + icons["hello-home"] + "</div>"),
	$(".humidity").append("<div class='footer'>" + icons.humidity + "</div>"),
	$(".luminosity").append("<div class='footer'>" + icons.luminosity + "</div>"),
	$(".temperature").append("<div class='footer'>" + icons.temperature + "</div>"),
	$(".energy").append("<div class='footer'>" + icons.energy + "</div>"),
	$(".power").append("<div class='footer'>" + icons.power + "</div>"),
	$(".battery").append("<div class='footer'>" + icons.battery + "</div>"),
	$(".link").find("a").html(icons.link),
	$(".dashboard").find("a").html(icons.dashboard),
	$(".tile[data-is-value=true]").each(function () {
		renderValue($(this))
	})
}
function renderSlider(t) {
	t.find(".slider-container").remove(),
	t.append("<div class='slider-container'><div class='full-width-slider'><input value='" + t.attr("data-level") + "' min='1' max='10' type='range' step='1' data-mini='true' data-popup-enabled='true' data-disabled='" + readOnlyMode + "' data-highlight='true'></div></div>").find("input").slider(),
	$(".full-width-slider").click(function (t) {
		t.stopImmediatePropagation()
	})
}
function renderValue(t) {
	t.find(".icon").remove(),
	t.append("<div class='icon text'>" + t.attr("data-value") + "</div>")
}
function updateWeather(t, e) {
	t.find(".title2").html(e.weather + ", feels like " + e.feelsLike + "&deg;"),
	t.find(".icon.text").html(e.temperature + "&deg;"),
	t.find(".icon i").attr("class", "wi " + e.icon),
	t.find(".footer").html(e.localSunrise + ' <i class="fa fa-fw wi wi-horizon-alt"></i> ' + e.localSunset),
	t.find(".footer.right").html(e.percentPrecip + "%<i class='fa fa-fw fa-umbrella'></i><br>" + e.humidity + "%<i class='fa fa-fw wi wi-sprinkles'></i>")
}
function updateThermostat(t, e) {
	t.find(".title2").html(e.temperature + "&deg;, " + e.thermostatOperatingState),
	t.find(".icon.setpoint").html(e.setpoint + "&deg;"),
	t.find(".footer").html("&#10044; " + e.thermostatFanMode + (e.humidity ? ",<i class='fa fa-fw wi wi-sprinkles'></i>" + e.humidity + "%" : "")),
	t.attr("data-setpoint", e.setpoint)
}
function sendCommand(t, e, i, a) {
	var o = getUrlParameter("access_token"),
	n = {
		type: t,
		device: e,
		command: i,
		value: a
	};
	o && (n.access_token = o),
	$.get("command", n).done(function (t) {
		"ok" == t.status && nextPoll(5)
	}).fail(function () {
		setWTFCloud(),
		nextPoll(10)
	})
}
function doPoll(t) {
	nextPoll(20),
	t || spinner($(".refresh"));
	var e = getUrlParameter("access_token"),
	a = {
		ts: stateTS
	};
	e && (a.access_token = e),
	$.get("ping", a).done(function (e) {
		if ("refresh" == e.status && refresh(), clearWTFCloud(), t)
			t();
		else if (stateTS = e.ts, $(".refresh .footer").html("Updated " + e.updated), "update" == e.status)
			for (i in e.data)
				updateTile(e.data[i])
	}).fail(function () {
		setWTFCloud()
	})
}
function updateTile(t) {
	if ("device" == t.tile) {
		var e = $("." + t.type + "[data-device=" + t.device + "]");
		"music" == t.type && ((t.trackDescription != e.attr("data-track-description") || t.mute + "" != e.attr("data-mute")) && spinner(e), e.attr("data-track-description", t.trackDescription), t.mute + "" != e.attr("data-mute") && e.toggleClass("muted"), e.attr("data-mute", t.mute), e.find(".title .track").html(e.attr("data-track-description"))),
		"thermostatHeat" == t.type || "thermostatCool" == t.type ? (checkDataForUpdates(e, t), updateThermostat(e, t)) : "weather" == t.type ? (checkDataForUpdates(e, t), updateWeather(e, t)) : (t.value != e.attr("data-value") && spinner(e), e.attr("data-value", t.value), t.isValue ? renderValue(e) : (e.removeClass("inactive active").addClass(t.active), e.attr("data-active", t.active)), ("dimmer" == t.type || "dimmerLight" == t.type || "music" == t.type) && (t.level != e.attr("data-level") && spinner(e), e.attr("data-level", t.level), renderSlider(e)))
	} else if ("mode" == t.tile) {
		var e = $(".mode");
		t.mode != e.attr("data-mode") && spinner(e),
		e.removeClass(e.attr("data-mode")),
		e.attr("data-mode", t.mode),
		t.isStandardMode && e.addClass(t.mode),
		$(".mode-name").html(t.mode)
	}
}
function checkDataForUpdates(t, e) {
	e.name = null;
	var i = t.attr("data-data");
	if (i)
		try {
			i = JSON.parse(i);
			for (k in i)
				if (i[k] != "" + e[k]) {
					spinner(t);
					break
				}
		} catch (a) {
			spinner(t)
		}
	else
		spinner(t);
	t.attr("data-data", JSON.stringify(e))
}
function setWTFCloud() {
	wtfCloud = !0,
	$("#wtfcloud-popup").popup("open")
}
function clearWTFCloud() {
	wtfCloud = !1,
	$("#wtfcloud-popup").popup("close")
}
function nextPoll(t) {
	polling && clearInterval(polling),
	polling = setInterval(function () {
			doPoll()
		}, 1e3 * t)
}
function refresh(t) {
	t ? setTimeout(function () {
		doRefresh()
	}, 1e3 * t) : setTimeout(function () {
		doRefresh()
	}, 100)
}
function doRefresh() {
	$(".refresh .icon").addClass("fa-spin"),
	doPoll(function () {
		location.reload()
	})
}
function getUrlParameter(t) {
	for (var e = window.location.search.substring(1), i = e.split("&"), a = 0; a < i.length; a++) {
		var o = i[a].split("=");
		if (o[0] == t)
			return o[1]
	}
}
function getClockColor() {
	return "quartz" == theme ? "#555" : "onyx" == theme ? "wheat" : "white"
}
function startTime() {
	if (document.getElementById("clock")) {
		var t = new Date,
		e = t.getHours();
		e > 12 && (e -= 12);
		var i = t.getMinutes(),
		a = t.getSeconds();
		i = checkTime(i),
		a = checkTime(a),
		document.getElementById("clock").innerHTML = e + ":" + i,
		setTimeout(function () {
			startTime()
		}, 500)
	}
}
function checkTime(t) {
	return 10 > t && (t = "0" + t),
	t
}
var scriptVersion = "5.3.0";
$(function () {
	return $(".tile").append("<i class='spinner fa fa-refresh fa-spin'></i>"),
	setIcons(),
	$(".refresh, .clock").click(function () {
		refresh()
	}),
	startTime(),
	$(".dashboard").click(function (t) {
		animateClick($(this)),
		t.stopImmediatePropagation(),
		t.preventDefault(),
		$(".refresh .icon").addClass("fa-spin"),
		window.location = $(this).find("a").attr("href")
	}),
	$(".history.tile").click(function (t) {
		animateClick($(this)),
		t.stopImmediatePropagation(),
		t.preventDefault(),
		window.location = "history" + (getUrlParameter("access_token") ? "?access_token=" + getUrlParameter("access_token") : "")
	}),
	readOnlyMode ? !1 : ($(".switch, .dimmer, .momentary, .clock, .lock, .link, .themeLight, .camera, .music i, .light, .dimmerLight").click(function () {
			animateClick($(this))
		}), $(".switch, .light, .lock, .momentary, .themeLight, .camera").click(function () {
			$(this).closest(".tile").toggleClass("active"),
			sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "toggle")
		}), $(".dimmer, .dimmerLight").click(function () {
			$(this).toggleClass("active"),
			sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "toggle", $(this).attr("data-level"))
		}), $(".dimmer, .dimmerLight").on("slidestop", function () {
			var t = $(this).find("input").val();
			$(this).hasClass("active") && (animateClick($(this)), sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "level", t)),
			$(this).attr("data-level", t)
		}), $(".music").on("slidestop", function () {
			var t = $(this).find("input").val();
			animateClick($(this)),
			sendCommand("music", $(this).attr("data-device"), "level", t),
			$(this).attr("data-level", t)
		}), $(".music .play").click(function () {
			var t = $(this).closest(".tile");
			$(this).closest(".tile").toggleClass("active"),
			sendCommand("music", t.attr("data-device"), "play")
		}), $(".music .pause").click(function () {
			var t = $(this).closest(".tile");
			$(this).closest(".tile").toggleClass("active"),
			sendCommand("music", t.attr("data-device"), "pause")
		}), $(".music .muted").click(function () {
			var t = $(this).closest(".tile");
			$(this).closest(".tile").toggleClass("muted"),
			sendCommand("music", t.attr("data-device"), "unmute")
		}), $(".music .unmuted").click(function () {
			var t = $(this).closest(".tile");
			$(this).closest(".tile").toggleClass("muted"),
			sendCommand("music", t.attr("data-device"), "mute")
		}), $(".music .back").click(function () {
			var t = $(this).closest(".tile");
			sendCommand("music", t.attr("data-device"), "previousTrack")
		}), $(".music .forward").click(function () {
			var t = $(this).closest(".tile");
			sendCommand("music", t.attr("data-device"), "nextTrack")
		}), $(".mode, .hello-home, .thermostat").click(function () {
			$("#" + $(this).attr("data-popup")).popup("open")
		}), $("#mode-popup li").click(function () {
			$("#mode-popup").popup("close");
			var t = $(".mode");
			animateClick(t);
			var e = $(this).text();
			sendCommand("mode", "mode", e);
			var i = $(".mode").attr("data-mode");
			t.removeClass(i),
			t.attr("data-mode", e),
			["Home", "Away", "Night"].indexOf(e) >= 0 ? ($("#mode-name").hide(), t.addClass(e)) : $("#mode-name").html(e).show()
		}), $("#hello-home-popup li").on("click", function () {
			$("#hello-home-popup").popup("close"),
			animateClick($(".hello-home")),
			sendCommand("helloHome", "helloHome", $(this).text())
		}), $(".thermostatHeat .up, .thermostatCool .up").click(function () {
			thermostatEvent($(this).closest(".tile"), 1)
		}), void $(".thermostatHeat .down, .thermostatCool .down").click(function () {
			thermostatEvent($(this).closest(".tile"), -1)
		}))
});
var fadeOn = 100, fadeOff = 200, polling, wtfCloud = !1;
nextPoll(30), refresh(3600), CoolClock.config.skins = {
	st: {
		outerBorder: {
			lineWidth: 12,
			radius: 100,
			color: "yellow",
			alpha: 0
		},
		smallIndicator: {
			lineWidth: 16,
			startAt: 80,
			endAt: 85,
			color: getClockColor(),
			alpha: 1
		},
		largeIndicator: {
			lineWidth: 2,
			startAt: 80,
			endAt: 85,
			color: getClockColor(),
			alpha: 1
		},
		hourHand: {
			lineWidth: 8,
			startAt: 0,
			endAt: 60,
			color: getClockColor(),
			alpha: 1
		},
		minuteHand: {
			lineWidth: 6,
			startAt: 0,
			endAt: 75,
			color: getClockColor(),
			alpha: 1
		},
		secondHand: {
			lineWidth: 5,
			startAt: 80,
			endAt: 85,
			color: "red",
			alpha: 0
		},
		secondDecoration: {
			lineWidth: 3,
			startAt: 96,
			radius: 4,
			fillColor: getClockColor(),
			color: "black",
			alpha: 1
		}
	},
	st1: {
		outerBorder: {
			lineWidth: 2,
			radius: 80,
			color: getClockColor(),
			alpha: 0
		},
		smallIndicator: {
			lineWidth: 5,
			startAt: 88,
			endAt: 94,
			color: "yellow",
			alpha: 0
		},
		largeIndicator: {
			lineWidth: 5,
			startAt: 90,
			endAt: 94,
			color: getClockColor(),
			alpha: 1
		},
		hourHand: {
			lineWidth: 8,
			startAt: 0,
			endAt: 60,
			color: getClockColor(),
			alpha: 1
		},
		minuteHand: {
			lineWidth: 8,
			startAt: 0,
			endAt: 80,
			color: getClockColor(),
			alpha: 1
		},
		secondHand: {
			lineWidth: 5,
			startAt: 89,
			endAt: 94,
			color: getClockColor(),
			alpha: 1
		},
		secondDecoration: {
			lineWidth: 3,
			startAt: 0,
			radius: 4,
			fillColor: "black",
			color: "black",
			alpha: 0
		}
	}
};
var cellSize = getUrlParameter("t") || tileSize, cellGutter = getUrlParameter("g") || 4;
