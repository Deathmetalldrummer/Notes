//#include("./_db.js");
//#include("./_layout/_menu/_menu.js");
//#include1("./_layout/_directory_edit/_directory_edit.js");
//#include("./_layout/_directory_management/_directory_management.js");

$(document).ready(function() {
	arch.init();
	menu.init();
	dm.init();
});

// Конструктор директорий
function folder(obj) {
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
	this.type = 'file';
	this.name = obj.name || "File name";
	this.desc = obj.desc || "File desc";
	this.image = obj.image || "File image";
	this.content = obj.content || "File content";
	this.parent_id = obj.parent_id;
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
