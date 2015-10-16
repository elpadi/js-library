Object.defineProperty(HTMLElement.prototype, 'dimensions', {
	value: function() {
		return {
			width: this.offsetWidth,
			height: this.offsetHeight
		};
	}
});

Object.defineProperty(HTMLElement.prototype, 'positionTop', {
	get: function() {
		var op = this.offsetParent, top = 0;
		while (op.offsetTop > 0) {
			top += op.offsetTop;
			op = op.offsetParent;
		}
		return this.offsetTop + top;
	}
});

function elementFromHTML(s) {
	var div = document.createElement('div');
	div.innerHTML = s;
	return div.children[0];
}

Object.defineProperty(HTMLElement.prototype, 'detectAncestor', {
	value: function(test) {
		var parent = this;
		while (parent = parent.parentNode) if (test(parent)) return parent;
		return undefined;
	}
});

Object.defineProperty(HTMLImageElement.prototype, 'getBiggestSrc', {
	value: function() {
		if (!('srcset' in this) || this.srcset === '') return this.src;
		return this.srcset.split(',').pop().split(' ').shift();
	}
});

