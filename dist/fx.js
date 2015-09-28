"use strict";

var FX = (function () {

	return {
		linear: function linear(t, b, c, d) {
			return b + t / d * c;
		},
		cubicEaseOut: function cubicEaseOut(timeElapsed, initialValue, valueChange, duration) {
			var time_ratio = timeElapsed / duration - 1;
			return valueChange * (time_ratio * time_ratio * time_ratio + 1) + initialValue;
		},
		animate: function animate(easeFn, initialValue, valueChange, duration, onTick) {
			var initialTime = Date.now(),
			    stop = false;
			var stopFn = function stopFn() {
				stop = true;
			};
			var tick = function tick() {
				var elapsed = Date.now() - initialTime;
				if (!stop && elapsed < duration) {
					onTick(easeFn(elapsed, initialValue, valueChange, duration));
					requestAnimationFrame(tick);
				} else {
					!stop && onTick(initialValue + valueChange);
				}
			};
			requestAnimationFrame(tick);
			return stopFn;
		}
	};
})();
