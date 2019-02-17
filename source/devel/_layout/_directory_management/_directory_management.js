var dm = {
	init: function() {
		this.cacheDom();
		this.events();
	},
	cacheDom: function() {
		this.$dm = $('.directory_management');
		this.$add_file = this.$dm.find('.dm__add_file');
		this.$add_folder = this.$dm.find('.dm__add_folder');
		this.$remove_file = this.$dm.find('.dm__remove_file');
		this.$remove_folder = this.$dm.find('.dm__remove_folder');

		this.$menu = $('#menu');
	},
	events: function() {
		this.$add_file.on('click',this.addFile.bind(this));
		this.$add_folder.on('click',this.addFolder.bind(this));
		this.$remove_file.on('click',this.remove.bind(this));
		this.$remove_folder.on('click',this.remove.bind(this));
	},
	addFile: function() {
		var id = menu.focus();
		var obj = new file({
			parent_id: id
		})
		arch.add(obj);
		menu.add();
	},
	addFolder: function() {
		var id = menu.focus();
		var obj = new folder({
			parent_id: id
		})
		menu.add(arch.add(obj));
	},
	remove: function() {
		var id = menu.focus();
		arch.remove(id);
		menu.remove();
	}
}
