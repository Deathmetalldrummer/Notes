//#include("./_layout/_header/_header.js");
//#include("./_layout/_footer/_footer.js");

// Конструктор директорий
function folder(obj) {
	this.id = obj.id;
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
	this.name = obj.name || "File name";
	this.desc = obj.desc || "File desc";
	this.image = obj.image || "File image";
	this.content = obj.content || "File content";
	this.parent_id = obj.parent_id;
}

var focus_id = null;
var arch = {};
var localStorage_object_name = 'arch';



$(document).ready(function() {
	get_local();
	console.log(arch);
});


/*
Глубокий поиск
Ищет объект со свойством "id" и значением id (первый параметр) в объекте x (второй параметр)
Возвращает объект
*/
function finder(id, x) {
	var where = x || arch;
	if (isObject(where)) {
		for (var prop in where) {
			if (where.hasOwnProperty(prop)) {
				if (prop === 'id' && where[prop] === id) {
					console.log(where);
				} else {
					finder(id, where[prop]);
				}
			}
		}
	}
	if (isArray(where)) {
		for (var prop = 0; prop < where.length; prop++) {
			finder(id, where[prop]);
		}
	}
}

// Отвечает за кад проверки объекта
function isObject(x) {
	return $.isPlainObject(x);
}
// Отвечает за кад проверки массива
function isArray(x) {
	return $.isArray(x);
}

//Создает файл
function createFile(parent_id) {
	var x = parent_id ? finder(parent_id) : arch;
	var obj = {
		id: createFileId(),
		parent_id: (parent_id ? parent_id : localStorage_object_name)
	};
	x.files.push(new file(obj));
	set_local();
}
//Создает директорию
function createFolder(parent_id) {
	var x = parent_id ? finder(parent_id) : arch;
	var obj = {
		id: createFolderId(),
		parent_id: (parent_id ? parent_id : localStorage_object_name)
	};
	x.folders.push(new folder(obj));
	set_local();
}






function createFileId() {
	var arch_l = arch.files_id.length;
	// if(!arch_l) 0;
	for (var i = 0; i <= arch_l; i++) {
		if (arch.files_id.indexOf(i) === -1) {
			arch.files_id.push(i);
			return i;
		}
	}
}

function createFolderId() {
	var arch_l = arch.folders_id.length;
	// if(!arch_l) 0;
	for (var i = 0; i <= arch_l; i++) {
		if (arch.folders_id.indexOf(i) === -1) {
			arch.folders_id.push(i);
			return i;
		}
	}
}

function get_local() {
	var string_local = localStorage.getItem(localStorage_object_name);
	if (string_local) {
		arch = JSON.parse(string_local);
	} else {
		arch.folders = [];
		arch.folders_id = []
		arch.files = [];
		arch.files_id = []
	}
}

function set_local() {
	localStorage.setItem(localStorage_object_name, JSON.stringify(arch));
}
