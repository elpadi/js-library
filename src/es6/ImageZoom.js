class ImageZoom {

	constructor(container, img) {
		this.container = container;
		this.imgRatio = img.naturalWidth / img.naturalHeight;
		this.scale = 1.5;
		this.x = 0;
		this.y = 0;
		this.updatePosition();
		this.initContainer(img);
		this.createViewport();
		this.setupDragging();
	}

	initContainer(img) {
		this.container.classList.add('zoom-image');
		this.container.style.backgroundImage = 'url(' + img.getBiggestSrc() + ')';
	}

	boundViewport() {
		var maxScale = (this.scale - 1) / 2;
		this.x = Math.min(App.instance.vw * maxScale, Math.abs(this.x)) * Math.sign(this.x);
		this.y = Math.min(App.instance.vh * maxScale, Math.abs(this.y)) * Math.sign(this.y);
		this.updatePosition();
	}

	moveViewport(pos) {
		this.x += pos.x;
		this.y += pos.y;
		this.updatePosition();
	}

	updatePosition() {
		this.container.style.transform = 'scale(' + this.scale + ') translate(' + this.x + 'px,' + this.y + 'px)';
	}

	setupDragging() {
		this.viewport.enableDragEvents();
		this.viewport.addEventListener('dragmove', e => this.moveViewport(e.detail.change));
		this.viewport.addEventListener('dragend', this.boundViewport.bind(this));
	}

	createViewport() {
		this.viewport = document.createElement('div');
		this.viewport.classList.add('foreground');
		this.container.parentNode.appendChild(this.viewport);
	}

}

