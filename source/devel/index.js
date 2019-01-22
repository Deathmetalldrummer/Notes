//#include("./_layout/_header/_header.js");
//#include("./_layout/_footer/_footer.js");

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
	$('#menu').html(menu_result(arch));
	focus();
}
// возвращает строку из тэгов
function menu_result(x) {
	var res = $('<ul></ul>');
	// перебираем пункты списка
	for (var i = 0; i < x.folders.length; i++) {
		// var subarch_res = $('<ul></ul>');
		var x_item = x.folders[i];
		// если есть подменю, запускает рекурсию и записывает результат в переменную
		if ($.isArray(x.folders)) {
			// формирует результат
			var focus_class = ($('#menu .folder.focus').data('id') === x_item.id) ? 'focus' : '';
			res.append($('<li class="folder '+focus_class+'" data-id=' + x_item.id + ' data-type="folder">' + x_item.name + '</li>').append(menu_result(x_item)));
		}
	}
	for (var i = 0; i < x.files.length; i++) {
		var x_item = x.files[i];
		// если есть подменю, запускает рекурсию и записывает результат в переменную
		if ($.isArray(x.files)) {
			// формирует результат
			var focus_class = ($('#menu .file.focus').data('id') === x_item.id) ? 'focus' : '';
			res.append($('<li class="file '+focus_class+'" data-id=' + x_item.id + ' data-type="file">' + x_item.name + '</li>'));
		}
	}
	// возвращает результат
	return res;
}

function focus() {
	$('.file').on('click', function(e) {
		$('#menu .focus').removeClass('focus');
		$(e.target).addClass('focus');
		$('#content').html(cryptoOut(finder($('#menu .focus').data('id')).content));

	})
	$('.folder').on('click', function(e) {
		$('#menu .focus').removeClass('focus');
		$(e.target).addClass('focus');
	});
}
function focus_event() {
	$('.create_folder').on('click', function(e) {
		if ($('#menu .folder').hasClass('focus')) {
			createFolder($('#menu .folder.focus').data('id'));
		} else {
			createFolder();
		}
	});
	$('.del_folder').on('click', function(e) {
		if ($('#menu .folder').hasClass('focus')) {
			delFolder($('#menu .folder.focus').data('id'));
		}
	});
	$('.create_file').on('click', function(e) {
		if ($('#menu .folder').hasClass('focus')) {
			createFile($('#menu .folder.focus').data('id'));
		} else {
			createFile();
		}
	});
	$('.del_file').on('click', function(e) {
		if ($('#menu .file').hasClass('focus')) {
			delFile($('#menu .file.focus').data('id'));
		}
	});
}
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
