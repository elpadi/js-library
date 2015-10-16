class Modals {

	constructor() {
		this.modals = {};
		this.currentModal = '';
		this.prevModal = '';
		this.scrollY = 0;
	}

	init() {
	}

	removePrevious() {
		if (this.prevModal !== '' && this.currentModal !== this.prevModal) {
			console.log('remove previous modal', this.prevModal, this.currentModal);
			this.modals[this.prevModal].m.close();
		}
	}

	modal(id, ModalClassFn) {
		if (!ModalClassFn) ModalClassFn = Modal;
		this.prevModal = this.currentModal;
		this.currentModal = id;
		console.log('modal show', this.currentModal, this.prevModal);
		if (id in this.modals) {
			this.modals[id].m.show();
		}
		else {
			this.modals[id] = new ModalClassFn(id);
			this.modals[id].init();
			this.modals[id].m.show();
		}
	}

	hide(id) {
		this.modals[id].m.close();
		if (this.currentModal === id) {
			App.instance.resetScrollBar();
			this.currentModal = '';
		}
		if (this.prevModal === id) this.prevModal = '';
	}

}

class Modal {

	constructor(id) {
		this.height = 1;
		this.id = id;
	}

	createOptions() {
		var h = Math.round((App.instance.vh - App.instance.FIXED_HEADER_HEIGHT) * this.height);
		return {
			content: '<div id="' + this.id + '-modal" class="modal"></div>',
			closeButton: false,
			width: document.documentElement.clientWidth,
			closeClass: '',
			closeHtml: '<button class="no-text single-background clean-button close-button">Close</button>',
			overlayStyles: {
				opacity: '0.8',
				backgroundColor: 'white'
			},
			modalStyles: {
				height: h + 'px',
				top: (App.instance.FIXED_HEADER_HEIGHT + Math.round((App.instance.vh - App.instance.FIXED_HEADER_HEIGHT - h) / 2)) + 'px'
			},
			closeStyles: {
			}
		};
	}

	appendToModalContainer() {
		App.instance.overlayContainer.appendChild(this.m.overlayElem());
		App.instance.overlayContainer.appendChild(this.m.modalElem());
	}

	closeButtonClassFix() {
		this.m.closeElem().classList.remove('pico-close');
		this.m.closeElem().classList.add('modal-close');
	}

	afterCreate(m, e) {
		this.appendToModalContainer();
		this.contentElement = document.getElementById(this.id + '-modal');
		if (this.options.closeButton) this.closeButtonClassFix();
	}

	showOverlay() {
		this.m.overlayElem().classList.add('visible');
	}

	beforeShowContent() {
		App.instance.hideScrollBar();
		App.instance.modals.removePrevious();
	}

	showContent() {
		this.m.modalElem().classList.add('visible');
	}

	afterShow(m, e) {
		[16, this.showOverlay, 300, this.beforeShowContent, this.showContent].sequence(this);
	}

	hide(e) {
		e.preventDefault();
		this.m.overlayElem().addEventListener('transitionend', this.afterClose.bind(this).once());
		this.m.modalElem().classList.remove('visible');
		this.m.overlayElem().classList.remove('visible');
	}

	beforeClose(m, e) {
		this.hide(e);
	}

	afterClose() {
		this.m.forceClose();
	}

	init() {
		this.options = this.createOptions();
		this.m = picoModal(this.options);
		this.m.afterCreate(this.afterCreate.bind(this));
		this.m.afterShow(this.afterShow.bind(this));
		this.m.beforeClose(this.beforeClose.bind(this));
	}

}

class AjaxModal extends Modal {

	constructor(id) {
		super(id);
		var parts = id.split('--');
		this.type = parts[0];
		this.name = parts[1];
	}

	requestParams() {
		return {
			url: WP.AJAX_URL,
			method: 'POST',
			body: {
				action: 'content',
				what: this.type,
				who: this.name
			}.serialize()
		};
	}

	requestPromise() {
		var params = this.requestParams();
		return new Promise(function(resolve, reject) {
			nanoajax.ajax(params, function(code, data) {
				var res = JSON.parse(data);
				(res && res.success) ? resolve(res.data) : reject(res ? res.data : "Invalid response");
			});
		});
	}

	afterShow(m, e) {
		var show = Modal.prototype.afterShow.curry(m, e).bind(this);
		this.m.modalElem().parentNode.setAttribute('data-modal-type', this.type);
		this.requestPromise().then(function(html) {
			this.contentElement.innerHTML = html;
			setTimeout(show, 16);
		}.bind(this));
	}

}

