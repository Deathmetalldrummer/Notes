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


$(document).ready(function() {
arch.init();
//#include("./_layout/_menu/_menu.js");
//#include("./_layout/_drawers/_drawers.js");
//#include("./_layout/_directory_edit/_directory_edit.js");
//#include("./_layout/_directory_management/_directory_management.js");
});


var arch = {
	data: null,
	init: function() {
		this.get_local();
	},
	get_local: function() {
		var string_local = localStorage.getItem('arch');
		var new_arch = {};
		if (string_local) {
			new_arch = JSON.parse(string_local);
		} else {
			new_arch.folders = [];
			new_arch.files = [];
			new_arch.id_list = [];
		}
		this.data = new_arch;
	},
	set_local: function(obj) {
		if (obj) {
			localStorage.setItem('arch', JSON.stringify(obj));
		} else {
			localStorage.setItem('arch', JSON.stringify(this.data));
		}
		this.data = JSON.parse(JSON.stringify(this.data))
	},
	/*
	Глубокий поиск
	Ищет объект со свойством "id" и значением id (первый параметр)
	Возвращает объект
	*/
	find: function(id) {
		var res;

		req(this.data);

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

}

/*
Глубокий поиск
Ищет объект со свойством "id" и значением id (первый параметр)
Возвращает объект
*/
// function finder(id) {
// 	var res;
//
// 	req(arch.data);
//
// 	function req(param) {
// 		if (is_Object(param)) {
// 			if (param.hasOwnProperty('id') && param.id === id) {
// 				res = param;
// 			}
// 			for (var prop in param) {
// 				if (param.hasOwnProperty(prop) && is_Array(param[prop]) && param[prop].length) {
// 					req(param[prop]);
// 				}
// 			}
// 		}
// 		if (is_Array(param)) {
// 			for (var prop = 0; prop < param.length; prop++) {
// 				req(param[prop]);
// 			}
// 		}
// 	}
// 	return res;
// }
// function finderId(obj) {
// 	var res = [];
//
// 	req(arch.data);
//
// 	function req(param) {
// 		if (is_Object(param)) {
// 			if (param.hasOwnProperty('id')) {
// 				res.push(param.id)
// 			}
// 			for (var prop in param) {
// 				if (param.hasOwnProperty(prop) && is_Array(param[prop]) && param[prop].length) {
// 					req(param[prop]);
// 				}
// 			}
// 		}
// 		if (is_Array(param)) {
// 			for (var prop = 0; prop < param.length; prop++) {
// 				req(param[prop]);
// 			}
// 		}
// 	}
// 	return res;
// }



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
