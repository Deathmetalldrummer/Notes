var dm = {
	init: function() {
		this.cacheDom();
		this.events();
	},
	cacheDom: function() {
		this.$dm = $('.directory_management');
		this.$add_file = this.$dm.find('.dm__add_file');
		this.$add_folder = this.$dm.find('.dm__add_folder');
		this.$remove = this.$dm.find('.dm__edit_remove');
		this.$edit = this.$dm.find('.dm__edit_edit');
	},
	events: function() {
		this.$add_file.on('click',nn.addIdFile.bind(nn));
		this.$add_folder.on('click',nn.addIdFolder.bind(nn));
		this.$remove.on('click',this.remove.bind(this));
		this.$edit.on('click',this.rename.bind(this));
	},
	remove: function() {
		var id = menu.focus();
		arch.remove(id);
		menu.remove();
	},
	rename: function() {
		if (menu.focus() === 0 || menu.focus() > 0) {
			nn.typeRename()
		}
	}
}
