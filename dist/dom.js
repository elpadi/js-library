'use strict';

Object.defineProperty(HTMLElement.prototype, 'positionTop', {
	get: function get() {
		var op = this.offsetParent,
		    top = 0;
		while (op.offsetTop > 0) {
			top += op.offsetTop;
			op = op.offsetParent;
		}
		return this.offsetTop + top;
	}
});
