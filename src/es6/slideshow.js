class Slideshow {

	constructor(container) {
		this.container = container;
		this.images = container.getElementsByClassName('slideshow__image');
		if (this.images.length === 0) this.images = container.getElementsByTagName('img');
		this.buttons = container.getElementsByTagName('button');
		this.currentIndex = -1;
	}

	deselectIndex(index) {
		this.hideImage(index);
		this.deselectButton(index);
	}

	selectIndex(index) {
		this.showImage(index);
		this.selectButton(index);
	}

	showImage(index) {
			this.images[index].classList.add('selected');
	}

	hideImage(index) {
			this.images[index].classList.remove('selected');
	}

	getButtonsByIndex(index) {
		return Array.prototype.filter.call(this.buttons, b => b.dataset.index == index);
	}

	deselectButton(index) {
		this.getButtonsByIndex(index).forEach(b => b.classList.remove('selected'));
	}

	selectButton(index) {
		this.getButtonsByIndex(index).forEach(b => b.classList.add('selected'));
	}

	selectByIndex(index) {
		if (index < 0 || index >= this.images.length) {
			throw new RangeError("Bad index.");
		}
		if (index !== this.currentIndex) {
			try {
				if (this.currentIndex >= 0) this.deselectIndex(this.currentIndex);
				this.selectIndex(index);
			}
			catch(e) {
				console.error(e);
				return false;
			}
			this.currentIndex = index;
		}
	}

	init() {
		this.container.addEventListener('click', e => {
			var index;
			if (e.target.nodeName === 'BUTTON'
				&& !isNaN(index = parseInt(e.target.dataset.index, 10))
				&& this.selectByIndex(index)
			) {
				e.preventDefault();
			}
		});
	}

	start() {
		this.selectByIndex(0);
		this.container.classList.add('init');
	}

	resize() {
		Array.prototype.forEach.call(this.images, img => img.cover());
	}

	load() {
		this.resize();
		setTimeout(this.start.bind(this), 16);
	}

}

