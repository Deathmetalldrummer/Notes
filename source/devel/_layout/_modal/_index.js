var modal = {
	_cacheDom: function() {
		this.$modal = $('.modal');
		this.$modal__body = this.$modal.find('.modal__body');
		this.$modal__cancel = this.$modal.find('.modal__cancel');
		this.$modal__submit = this.$modal.find('.modal__submit');
	},
	_events: function() {
		var _this = this;
		this.$modal__cancel.on('click',this.close.bind(this));
	},
	modalBodyRender: function() {
		this.$modal__body.html(this.obj.modal__html);
		this.$modal__submit.on('click',this.obj.submit)
	},
	open: function(obj) {
		if (obj) {
			this.obj = obj;
		} else {
			console.log('need for spee... params!');
			return false;
		}
		this.modalBodyRender();
		this.$modal.addClass('modal_open');
		console.log('modal opened');
	},
	close: function() {
		this.$modal.removeClass('modal_open');
		this.obj.close();
		this.$modal__body.html('');
		this.$modal__submit.off('click');
		this.obj = null;
	},
	init: function() {
		this._cacheDom();
		this._events();
	}
}
