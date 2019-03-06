var nn = {
	init: function() {
		this.cacheDom();
		this.events();
	},
	cacheDom: function() {
		this.$newName = $('#new_name');
		this.$input = this.$newName.find('.nn__input');
		this.$submit = this.$newName.find('.nn__submit');
		this.$cancel = this.$newName.find('.nn__cancel');
	},
	events: function() {
		this.$cancel.on('click',this.cancel.bind(this));
		this.$submit.on('click',this.submit.bind(this));
	},
	cancel: function() {
		this.$newName.addClass('nn__hide');
		this.$newName.removeAttr('data-type');
		this.$input.val('');
	},
	submit: function() {
		var type = this.$newName.attr('data-type');
		console.log('WTF?',type);
		if (type === 'file') {
			this.addFile();
		}
		if (type === 'folder') {
			this.addFolder();
		}
		if (type === 'rename') {
			this.rename();
		}
		this.cancel();
	},
	addFile: function() {
		var id = menu.focus();
		var obj = new file({
			parent_id: id,
			name: this.$input.val()
		})
		menu.add(arch.add(obj));
	},
	addFolder: function() {
		var id = menu.focus();
		var obj = new folder({
			parent_id: id,
			name: this.$input.val()
		})
		menu.add(arch.add(obj));
	},
	rename: function() {
		var id = menu.focus();
		arch.rename(id,this.$input.val());
		menu.rename();
	},
	addIdFile: function() {
		this.$newName.attr('data-type','file');
		this.$newName.removeClass('nn__hide');
	},
	addIdFolder: function() {
		this.$newName.attr('data-type','folder');
		this.$newName.removeClass('nn__hide');
	},
	typeRename:function() {
		this.$newName.attr('data-type','rename');
		this.$newName.removeClass('nn__hide');
	}
}
