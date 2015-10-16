class Point {

	constructor(x, y) {
		this.x = typeof(x) === 'number' ? x : 0;
		this.y = typeof(y) === 'number' ? y : 0;
		if (typeof(x) === 'object' && 'x' in x) {
			this.x = x.x;
			this.y = x.y;
		}
	}

}

class Rect extends Point {

	constructor(x, y, width, height) {
		super(x, y);
		this.width = typeof(width) === 'number' ? width : 0;
		this.height = typeof(height) === 'number' ? height : 0;
		if (typeof(x) === 'object' && 'width' in x) {
			this.width = x.width;
			this.height = x.height;
		}
		this.aspectRatio = this.height > 0 ? this.width / this.height : NaN;
		console.log('rect', this);
	}

	center(rect) {
		this.x = Math.round((rect.width - this.width) / 2) + rect.x;
		this.y = Math.round((rect.height - this.height) / 2) + rect.y;
		console.log('center', this, rect);
		return this;
	}

	contain(rect) {
		if (this.aspectRatio > rect.aspectRatio) {
			this.width = rect.width;
			this.height = Math.round(rect.width / this.aspectRatio);
		}
		else {
			this.width = Math.round(rect.height * this.aspectRatio);
			this.height = rect.height;
		}
		return this;
	}

	cover(rect) {
		if (this.aspectRatio < rect.aspectRatio) {
			this.width = rect.width;
			this.height = Math.round(rect.width / this.aspectRatio);
		}
		else {
			this.width = Math.round(rect.height * this.aspectRatio);
			this.height = rect.height;
		}
		console.log('cover', this, rect);
		return this;
	}

}

Object.defineProperty(HTMLImageElement.prototype, 'cover', {
	value: function() {
		if (this.naturalWidth === 0) {
			setTimeout(this.cover.bind(this), 16);
			return;
		}
		if (!this.offsetParent) return;
		var outer = new Rect(this.offsetParent.dimensions());
		var inner = new Rect(0, 0, this.naturalWidth, this.naturalHeight);
		inner.cover(outer).center(outer);
		console.log(inner);
		this.style.left = inner.x + 'px';
		this.style.top = inner.y + 'px';
		this.style.width = inner.width + 'px';
		this.style.height = inner.height + 'px';
		this.offsetParent.style.overflow = 'hidden';
	}
});

