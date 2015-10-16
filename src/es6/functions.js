Object.defineProperty(Function.prototype, 'curry', {
	value: function(...saved) {
		var fn = this;
		return function() {
			return fn.apply(this, saved.concat(Array.prototype.slice(arguments, 0)));
		};
	}
});

Object.defineProperty(Function.prototype, 'debounce', {
	value: function(wait, immediate) {
		var func = this;
		var result;
		var timeout = null;
		return function() {
			var context = this, args = arguments;
			var later = function() {
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
	value: function(wait, options) {
		var func = this;
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function() {
			previous = options.leading === false ? 0 : Date.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function() {
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

Object.defineProperty(Function.prototype, 'once', {
	value: function() {
		var func = this, ran = false;
		return function(...args) {
			var val = ran ? undefined : func.apply(this, args);
			ran = true;
			return val;
		};
	}
});

/**
 * Calls function in a sequence, with delays, and same context.
 *
 * E.g. [16, foo, bar, 200, baz].sequence(this);
 */
Object.defineProperty(Array.prototype, 'sequence', {
	value: function(thisArg) {
		var params = this, i = 0, l = this.length;
		var call = function call() {
			if (i >= l) return;
			if (typeof(params[i]) === 'number') {
				setTimeout(call, params[i]);
				i++;
			}
			else {
				params[i].call(thisArg);
				i++;
				return call();
			}
		};
		return call();
	}
});

