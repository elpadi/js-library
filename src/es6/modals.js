class Modals {

	constructor() {
		this.modals = {};
		this.currentModal = '';
	}

	init() {
	}

	basicModal(id, contentElement) {
		var callbacks = {};
		if (!(id in this.modals)) {
			callbacks.afterCreate = function(m) {
				document.getElementById(id + '-modal').appendChild(contentElement);
			};
		}
		this.modal(id, callbacks);
	}

	removeCurrent() {
		this.modals[this.currentModal].close();
	}

	modal(id, getModalInfo) {
		if (id in this.modals) {
			this.modals[id].show();
		}
		else {
			var info = getModalInfo();
			var h = Math.round((App.instance.vh - App.instance.FIXED_HEADER_HEIGHT) * (('height' in info) ? info.height : 1));
			var modal = picoModal({
				content: '<div id="' + id + '-modal" class="modal"></div>',
				closeButton: 'closeButton' in info ? info.closeButton : false,
				width: App.instance.vw,
				overlayStyles: {
					opacity: 'overlayOpacity' in info ? info.overlayOpacity : '0.8',
					backgroundColor: 'white'
				},
				modalStyles: {
					height: h + 'px',
					top: (App.instance.FIXED_HEADER_HEIGHT + Math.round((App.instance.vh - App.instance.FIXED_HEADER_HEIGHT - h) / 2)) + 'px'
				}
			});
			this.modals[id] = modal;
			modal.afterCreate(function(m) {
				var container = document.getElementById('page');
				modal.modalElem().setAttribute('data-current','true');
				page.appendChild(m.overlayElem());
				page.appendChild(m.modalElem());
				if ('afterCreate' in info) info.afterCreate(m);
			});
			if ('afterClose' in info) modal.afterClose(info.afterClose);
			modal.beforeClose(function(m, e) {
				var overlay = m.overlayElem();
				var onTransitionEnd = function onTransitionEnd() { m.forceClose(); overlay.removeEventListener('transitionend', onTransitionEnd); };
				m.modalElem().classList.remove('visible');
				overlay.classList.remove('visible');
				overlay.addEventListener('transitionend', onTransitionEnd);
				e.preventDefault();
				if ('beforeClose' in info) info.beforeClose(m);
			});
			modal.afterShow(m => {
				(function() { m.overlayElem().classList.add('visible'); }).delayedCall(16);
				(function() {
					if (this.currentModal !== '' && this.currentModal !== id) this.removeCurrent();
					this.currentModal = id;
					if ('showContent' in info) info.showContent(m);
					else m.modalElem().classList.add('visible');
				}).bind(this).delayedCall(32);
			});
			modal.show();
		}
	}

}

class AjaxModal {

	constructor(trigger) {
		this.trigger = trigger;
		this.type = trigger.dataset.contentType;
		this.name = trigger.dataset.contentName;
	}

	beforeRequest() {
		switch (this.type) {
		case 'gallery':
			if (!('Zepto' in window || 'jQuery' in window)) {
				injectJS(WP.THEME_URI + '/js/dist/slick.build.js');
			}
			break;
		}
	}

	showContent() {
			setTimeout(() => {
				if ('modal' in this) this.modal.modalElem().classList.add('visible');
			}, 16);
	}

	afterShow() {
		switch (this.type) {
		case 'gallery':
			if ('gallery' in this) this.gallery.onFirstImageLoad(this.showContent.bind(this));
			break;
		default:
			this.showContent();
		}
	}

	afterRequest() {
		switch (this.type) {
		case 'gallery':
			this.gallery = new Gallery(this.modalContainer.firstChild);
			this.gallery.init();
			break;
		case 'page':
			App.instance.initFancyInputs(this.modalContainer);
			break;
		}
		this.afterShow();
	}

	contentRequest() {
		nanoajax.ajax({
			url: WP.AJAX_URL,
			method: 'POST',
			body: {
				action: 'content',
				what: this.type,
				who: this.name
			}.serialize()
		}, this.requestCallback.bind(this));
	}

	requestCallback(code, data) {
		var res = JSON.parse(data);
		if (res && res.success) {
			this.modalContainer = document.getElementById(this.name + '-modal');
			this.modalContainer.innerHTML = res.data;
			setTimeout(this.afterRequest.bind(this), 16);
		}
		else {
			console.error(res ? res.data : "Invalid response");
		}
	}

	showModal() {
		App.instance.modals.modal(this.name, {
			afterCreate: m => {
				this.modal = m;
				this.beforeRequest();
				this.contentRequest();
			},
			afterShow: m => {
				this.afterShow();
			}
		}, {
			contentHeight: 0.6
		});
	}

	init() {
		this.trigger.addEventListener('click', e => {
			e.preventDefault();
			this.showModal();
		});
	}

}

