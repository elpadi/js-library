'use strict';

Object.defineProperty(Function.prototype, 'curry', {
	value: function value() {
		for (var _len = arguments.length, saved = Array(_len), _key = 0; _key < _len; _key++) {
			saved[_key] = arguments[_key];
		}

		var fn = this;
		return function () {
			return fn.apply(this, saved.concat(Array.prototype.slice(arguments, 0)));
		};
	}
});

Object.defineProperty(Function.prototype, 'debounce', {
	value: function value(wait, immediate) {
		var func = this;
		var result;
		var timeout = null;
		return function () {
			var context = this,
			    args = arguments;
			var later = function later() {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) result = func.apply(context, args);
			return result;
		};
	}
});

Object.defineProperty(Function.prototype, 'throttle', {
	value: function value(wait, options) {
		var func = this;
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function later() {
			previous = options.leading === false ? 0 : Date.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function () {
			var now = Date.now();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	}
});
