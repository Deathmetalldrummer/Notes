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
		this.$remove_file.on('click',this.removeFile.bind(this));
		this.$remove_folder.on('click',this.removeFolder.bind(this));
	},
	addFile: function() {
		var focused = this.$menu.find('.menu__link_file.menu__focused');
		if (focused) {
			createFile(focused.data('id'));
		} else {
			createFile();
		}
	},
	addFolder: function() {
		var focused = this.$menu.find('.menu__link_folder.menu__focused');
		if (focused) {
			createFolder(focused.data('id'));
		} else {
			createFolder();
		}
	},
	removeFile: function() {
		var focused = this.$menu.find('.menu__link_file.menu__focused');
		if (focused) {
			delFile(focused.data('id'));
		} else {
			delFile();
		}
	},
	removeFolder: function() {
		var focused = this.$menu.find('.menu__link_folder.menu__focused');
		if (focused) {
			delFolder(focused.data('id'));
		} else {
			delFolder();
		}
	}
}
dm.init();

//Создает файл
function createFile(parent_id) {
	var x = (parent_id>=0) ? finder(parent_id) : arch.data;
	if (x) {
		var obj = {
			id: createId(),
			parent_id: ((parent_id>=0) ? parent_id : 'arch'),
			content: cryptoIn()
		};
		x.files.push(new file(obj));
		arch.set_local();
	}
}
//Создает директорию
function createFolder(parent_id) {
	var x = (parent_id>=0) ? finder(parent_id) : arch.data;
	if (x) {
		var obj = {
			id: createId(),
			parent_id: ((parent_id>=0) ? parent_id : 'arch')
		};
		x.folders.push(new folder(obj));
		arch.set_local();
	}
}


function delFolder(focus_id) {
	if (focus_id >= 0) {
		var focused = finder(focus_id);
		var focus_parent = (is_Numeric(focused.parent_id)) ? finder(focused.parent_id) : arch.data;
		var eq;
		for (var i = 0; i < focus_parent.folders.length; i++) {
			if (focus_parent.folders[i].id === focused.id) {
				eq = i;
				break;
			}
		}
		focus_parent.folders.splice(eq,1);
		removeId(focused);
		arch.set_local();
	}
}
function delFile(focus_id) {
	if (focus_id >= 0) {
		var focused = finder(focus_id);
		var focus_parent = (is_Numeric(focused.parent_id)) ? finder(focused.parent_id) : arch.data;
		var eq;
		for (var i = 0; i < focus_parent.files.length; i++) {
			if (focus_parent.files[i].id === focused.id) {
				eq = i;
				break;
			}
		}
		focus_parent.files.splice(eq,1);
		removeId(focused);
		arch.set_local();
	}
}



function createId() {
	var arch_l = arch.data.id_list.length;
	for (var i = 0; i <= arch_l; i++) {
		if (arch.data.id_list.indexOf(i) === -1) {
			arch.data.id_list.push(i);
			return i;
		}
	}
}
function removeId(id) {
	var arch_l = arch.data.id_list;
	var removed_list = finderId(id);
	for (var i = 0; i < removed_list.length; i++) {
		arch_l.splice(arch_l.indexOf(removed_list[i]),1);
	}
}
