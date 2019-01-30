//#include("./_layout/_menu/_menu.js");
//#include("./_layout/_drawers/_drawers.js");

// Конструктор директорий
function folder(obj) {
	this.id = obj.id;
	this.type = 'folder';
	this.name = obj.name || "Folder name";
	this.desc = obj.desc || "Folder desc";
	this.image = obj.image || "Folder image";
	this.folders = obj.folders || [];
	this.files = obj.files || [];
	this.parent_id = obj.parent_id;
}
// Конструктор файлов
function file(obj) {
	this.id = obj.id;
	this.type = 'file';
	this.name = obj.name || "File name";
	this.desc = obj.desc || "File desc";
	this.image = obj.image || "File image";
	this.content = obj.content || "File content";
	this.parent_id = obj.parent_id;
}

var arch = {};
var localStorage_object_name = 'arch';



$(document).ready(function() {
	get_local();
	create_menu();
	focus_event();
});


/*
Глубокий поиск
Ищет объект со свойством "id" и значением id (первый параметр)
Возвращает объект
*/
function finder(id) {
	var res;

	req(arch);

	function req(param) {
		if (is_Object(param)) {
			if (param.hasOwnProperty('id') && param.id === id) {
				res = param;
			}
			for (var prop in param) {
				if (param.hasOwnProperty(prop) && is_Array(param[prop]) && param[prop].length) {
					req(param[prop]);
				}
			}
		}
		if (is_Array(param)) {
			for (var prop = 0; prop < param.length; prop++) {
				req(param[prop]);
			}
		}
	}
	return res;
}
function finderId(obj) {
	var res = [];

	req(obj);

	function req(param) {
		if (is_Object(param)) {
			if (param.hasOwnProperty('id')) {
				res.push(param.id)
			}
			for (var prop in param) {
				if (param.hasOwnProperty(prop) && is_Array(param[prop]) && param[prop].length) {
					req(param[prop]);
				}
			}
		}
		if (is_Array(param)) {
			for (var prop = 0; prop < param.length; prop++) {
				req(param[prop]);
			}
		}
	}
	// console.log(res);
	return res;
}



// Отвечает за кад проверки объекта
function is_Object(x) {
	return $.isPlainObject(x);
}
// Отвечает за кад проверки массива
function is_Array(x) {
	return $.isArray(x);
}
// Отвечает за кад проверки на число
function is_Numeric(x) {
	return $.isNumeric(x);
}

function get_local() {
	var string_local = localStorage.getItem(localStorage_object_name);
	if (string_local) {
		arch = JSON.parse(string_local);
	} else {
		arch.folders = [];
		arch.files = [];
		arch.id_list = [];
	}
}
function set_local() {
	localStorage.setItem(localStorage_object_name, JSON.stringify(arch));
}


function create_menu() {
	new Menu(arch).createMenu();
}






// DM
function focus_event() {
	$('.dm__add_folder').on('click', function(e) {
		if ($('#menu .menu__link_folder').hasClass('menu__focused')) {
			createFolder($('#menu .menu__link_folder.menu__focused').data('id'));
		} else {
			createFolder();
		}
	});
	$('.dm__remove_folder').on('click', function(e) {
		if ($('#menu .menu__link_folder').hasClass('menu__focused')) {
			delFolder($('#menu .menu__link_folder.menu__focused').data('id'));
		}
	});
	$('.dm__add_file').on('click', function(e) {
		if ($('#menu .menu__link_folder').hasClass('menu__focused')) {
			createFile($('#menu .menu__link_folder.menu__focused').data('id'));
		} else {
			createFile();
		}
	});
	$('.dm__remove_file').on('click', function(e) {
		if ($('#menu .menu__link_file').hasClass('menu__focused')) {
			delFile($('#menu .menu__link_file.menu__focused').data('id'));
		}
	});
}

//Создает файл
function createFile(parent_id) {
	var x = (parent_id>=0) ? finder(parent_id) : arch;
	if (x) {
		var obj = {
			id: createId(),
			parent_id: ((parent_id>=0) ? parent_id : localStorage_object_name),
			content: cryptoIn()
		};
		x.files.push(new file(obj));
		arch = JSON.parse(JSON.stringify(arch));
		set_local();
		create_menu();
	}
}
//Создает директорию
function createFolder(parent_id) {
	var x = (parent_id>=0) ? finder(parent_id) : arch;
	if (x) {
		var obj = {
			id: createId(),
			parent_id: ((parent_id>=0) ? parent_id : localStorage_object_name)
		};
		x.folders.push(new folder(obj));
		arch = JSON.parse(JSON.stringify(arch));//что это?почему!?нет ссылки на конструктор
		set_local();
		create_menu();
	}
}


function delFolder(focus_id) {
	if (focus_id >= 0) {
		var focused = finder(focus_id);
		var focus_parent = (is_Numeric(focused.parent_id)) ? finder(focused.parent_id) : arch;
		var eq;
		for (var i = 0; i < focus_parent.folders.length; i++) {
			if (focus_parent.folders[i].id === focused.id) {
				eq = i;
				break;
			}
		}
		focus_parent.folders.splice(eq,1);
		removeId(focused);
		set_local();
		create_menu();
	}
}
function delFile(focus_id) {
	if (focus_id >= 0) {
		var focused = finder(focus_id);
		var focus_parent = (is_Numeric(focused.parent_id)) ? finder(focused.parent_id) : arch;
		var eq;
		for (var i = 0; i < focus_parent.files.length; i++) {
			if (focus_parent.files[i].id === focused.id) {
				eq = i;
				break;
			}
		}
		focus_parent.files.splice(eq,1);
		removeId(focused);
		set_local();
		create_menu();
	}
}



function createId() {
	var arch_l = arch.id_list.length;
	for (var i = 0; i <= arch_l; i++) {
		if (arch.id_list.indexOf(i) === -1) {
			arch.id_list.push(i);
			return i;
		}
	}
}
function removeId(id) {
	var arch_l = arch.id_list;
	var removed_list = finderId(id);
	for (var i = 0; i < removed_list.length; i++) {
		arch_l.splice(arch_l.indexOf(removed_list[i]),1);
	}
}





// FILE EDIT
function cryptoIn() {
	return utf8_to_b64($('#menu').html());
}
function cryptoOut(x) {
	return b64_to_utf8(x);
}
function utf8_to_b64(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
}
//декодирование строки из base-64 в Unicode
function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}
