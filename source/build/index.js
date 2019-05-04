/*
DB
	add(obj) - Добавление объекта (obj)
	remove - Удаление объекта
	find - Поиск объекта по id
*/
var arch = {
	data: null,
	init: function() {
		this._get_local();
	},
	_get_local: function() {
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
	_set_local: function(obj) {
		if (obj) {
			localStorage.setItem('arch', JSON.stringify(obj));
		} else {
			localStorage.setItem('arch', JSON.stringify(this.data));
		}
		this.data = JSON.parse(JSON.stringify(this.data));
	},
	_create_id: function() {
		var id_length = this.data.id_list.length;
		for (var i = 0; i <= id_length; i++) {
			if (this.data.id_list.indexOf(i) === -1) {
				this.data.id_list.push(i);
				return i;
			}
		}
	},
	_remove_id: function(id) {
		var id_list = this.data.id_list;
		var lI = this.findID(id);
		for (var i = 0; i < lI.length; i++) {
			id_list.splice(id_list.indexOf(lI[i]),1);
		}
	},
	findID: function(id) {
		var obj = this.find(id);
		var fileIDList = [];
		var folderIDList = [];
		findIDFile(obj);
		findIDFolder(obj);
		var res = fileIDList.concat(folderIDList);
		res.push(id);
		function findIDFile(prop) {
			if (prop.files && prop.files.length) {
				for (var i = 0; i < prop.files.length; i++) {
					fileIDList.push(prop.files[i].id);
				}
			}
		}
		function findIDFolder(prop) {
			if (prop.folders && prop.folders.length) {
				for (var i = 0; i < prop.folders.length; i++) {
					folderIDList.push(prop.folders[i].id);
					findIDFile(prop.folders[i]);
					findIDFolder(prop.folders[i])
				}
			}
		}
		return res;
	},
	add: function(obj) {
		obj = JSON.parse(JSON.stringify(obj));
		obj.id = this._create_id();
		var obj_parent = (is_Numeric(obj.parent_id)) ? this.find(obj.parent_id) : this.data;
		if (obj.type && obj.type === 'file') {
			if (obj_parent.files) {
				obj_parent.files.push(obj);
			}
		}
		if (obj.type && obj.type === 'folder') {
			if (obj_parent.folders) {
				obj_parent.folders.push(obj);
			}
		}
		this._set_local();
		return obj;
	},
	remove: function(id) {
		if (id === 0 || id > 0) {
			var obj = this.find(id);
			var obj_parent = (is_Numeric(obj.parent_id)) ? this.find(obj.parent_id) : this.data;
			var eq;
			for (var i = 0; i < obj_parent[obj.type + 's'].length; i++) {
				if (obj_parent[obj.type + 's'][i].id === obj.id) {
					eq = i;
					break;
				}
			}
			this._remove_id(id);
			obj_parent[obj.type + 's'].splice(eq,1);
			this._set_local();
		}
	},
	rename: function(id,newName) {
		if (id === 0 || id > 0) {
			var obj = this.find(id);
			obj.name = newName;
			this._set_local();
		}
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
MENU
	add - Добавление пункта
	remove - Удаление пункта
	rename - переименовать пункт
	focus - возвращает либо пункт,либо id пункта
*/
var menu = {
	_arch: null,
	_focus: $('#menu .menu__link.menu__focused').length ? $('#menu .menu__link.menu__focused') : null,
	_cacheDom: function() {
		this.$menu = $('#menu');
		this.$li = this.$menu.find('.menu__link')
		this.$li_folder = this.$menu.find('.menu__link_folder');
		this.$content = $('.drawer__center');
		this.sub_menu_class = '.menu_sub';
		this.menu_focused_class = 'menu__focused';
		this.menu_link_class = 'menu__link';
	},
	_events: function() {
		this.$menu.on('click',this._onFocus.bind(this));
		$('.menu__link_folder').on('dblclick',this._onCollapse)
	},
	_show_content: function(e) {
		var file = arch.find(this.focus());
		if (file && file.type === 'file') {
			this.$content.html(cryptoOut(file.content.html));
		}
	},
	_svg_icon: function(type) {
		if (type === 'folder') {
			return $('<svg class="menu__icon menu__icon_folder" xmlns="http://www.w3.org/2000/svg" viewbox="153 399.8 51 43.2"><path d="M201.6,409.9c-1.3-1.3-2.9-2-4.7-2h-20.2v-1c0-1.8-0.7-3.4-2-4.7c-1.3-1.3-2.9-2-4.7-2h-9.6c-1.8,0-3.4,0.7-4.7,2c-1.3,1.3-2,2.9-2,4.7v28.8c0,1.8,0.7,3.4,2,4.7c1.3,1.3,2.9,2,4.7,2h36.5c1.8,0,3.4-0.7,4.7-2c1.3-1.3,2-2.9,2-4.7v-21.2C203.5,412.8,202.9,411.2,201.6,409.9z M199.7,435.8c0,0.8-0.3,1.5-0.8,2c-0.6,0.6-1.2,0.8-2,0.8h-36.5c-0.8,0-1.5-0.3-2-0.8c-0.6-0.6-0.8-1.2-0.8-2v-28.8c0-0.8,0.3-1.5,0.8-2c0.6-0.6,1.2-0.8,2-0.8h9.6c0.8,0,1.5,0.3,2,0.8c0.6,0.6,0.8,1.2,0.8,2v1.9c0,0.8,0.3,1.5,0.8,2c0.6,0.6,1.2,0.8,2,0.8h21.2c0.8,0,1.5,0.3,2,0.8c0.6,0.6,0.8,1.2,0.8,2L199.7,435.8L199.7,435.8z"></path></svg>');
		}
		if (type === 'file') {
			return $('<svg class="menu__icon menu__icon_file" xmlns="http://www.w3.org/2000/svg" viewbox="120 395.1 42.5 51"><path d="M161.4,410.5c-0.4-1-1-1.9-1.6-2.5l-10.2-10.2c-0.6-0.6-1.4-1.1-2.5-1.6c-1-0.4-2-0.7-2.9-0.7h-20.8c-0.9,0-1.6,0.3-2.2,0.9c-0.6,0.6-0.9,1.3-0.9,2.2v43.8c0,0.9,0.3,1.6,0.9,2.2c0.6,0.6,1.3,0.9,2.2,0.9H159c0.9,0,1.6-0.3,2.2-0.9c0.6-0.6,0.9-1.3,0.9-2.2v-29.2C162.1,412.5,161.9,411.5,161.4,410.5z M145.4,400.1c0.6,0.2,1.1,0.5,1.3,0.7L157,411c0.3,0.3,0.5,0.7,0.7,1.3h-12.2V400.1z M157.9,441.5h-33.3v-41.7h16.7v13.5c0,0.9,0.3,1.6,0.9,2.2c0.6,0.6,1.3,0.9,2.2,0.9h13.5V441.5z"></path></svg>');
		}
	},
	_render: function() {
		var div = $('<div></div>');
		var _this = this;
		if (this._arch && this._arch.folders && this._arch.folders.length) {
			$.each(this._arch.folders, function(i, val) {
				div.append(_this._menu__li(val));
			});
		}
		if (this._arch && this._arch.files && this._arch.files.length) {
			$.each(this._arch.files, function(i, val) {
				div.append(_this._menu__li(val));
			});
		}
		this.$menu.html(div.html());
		this._events();
	},
	_menu__li: function(obj) {
		var _this = this;
		var focus_class = ($('#menu .menu__link.menu__focused').data('id') === obj.id) ? ' menu__focused' : '';
		var li = $('<li class="menu__ menu__' + obj.type + '"></li>');
		var link = $('<a class="menu__link menu__link_' + obj.type + focus_class + '" data-id=' + obj.id + ' href="#">' + obj.name + '</a>');
		link.prepend(menu._svg_icon(obj.type));
		li.append(link);

		var ul = $('<ul class="menu_sub"></ul>');
		if (obj.folders && obj.folders.length) {
			$.each(obj.folders, function(i, val) {
				ul.append(_this._menu__li(val));
			});
		}
		if (obj.files && obj.files.length) {
			$.each(obj.files, function(i, val) {
				ul.append(_this._menu__li(val));
			});
		}
		if (!ul.html()) {
			ul = '';
		}
		li.append(ul);
		return li;
	},
	init: function() {
		this._arch = arch.data;
		this._cacheDom();
		this._render();
	},
	add: function(obj) {
		this._arch = JSON.parse(localStorage.getItem('arch'));
		this._render();
	},
	remove: function() {
		this._arch = JSON.parse(localStorage.getItem('arch'));
		this._focus = null;
		this._render();
	},
	rename: function() {
		this._arch = JSON.parse(localStorage.getItem('arch'));
		this._focus = null;
		this._render();
	},
	_onFocus: function(e){
		//add set focus method and remove focus method
		if ($(e.target).hasClass(this.menu_link_class) || $(e.target).closest('.'+this.menu_link_class)) {
			this.$menu.find('.'+this.menu_focused_class).removeClass(this.menu_focused_class);
			this._focus = $(e.target).closest('.'+this.menu_link_class);
			this._focus.addClass(this.menu_focused_class);

			this._show_content(e)
		} else {
			this._focus = null;
			this.$menu.find('.'+this.menu_focused_class).removeClass(this.menu_focused_class);
		}
	},
	_onCollapse: function(){
		var accordion = $(this).siblings(this.sub_menu_class);
		accordion.slideToggle();
	},
	focus: function() {
		return this._focus ? this._focus.data('id') : null;
	}
}

var de = {
	init: function() {
		this.cacheDom();
		this.events();
	},
	cacheDom: function() {
		this.$de = $('.directory_edit');
		this.$edit = this.$de.find('.de__edit_');
		this.$check = this.$de.find('.de__check_');

		this.$tabs_content = $('#tabs_content');
		this.$textarea_html = this.$tabs_content.find('.tabs__html textarea');
		this.$textarea_md = this.$tabs_content.find('.tabs__md textarea');
	},
	events: function() {
		this.$edit.on('click',this.editFile.bind(this));
		this.$check.on('click',this.checkFile.bind(this));
	},
	editFile: function() {
		var file = arch.find(menu.focus());
		this.$tabs_content.addClass('edit');
		if (file && file.type === 'file') {
			this.$textarea_html.val(cryptoOut(file.content.html));
			this.$textarea_md.val(cryptoOut(file.content.md));
			arch._set_local();
		}
	},
	checkFile: function() {
		if (this.$tabs_content.hasClass('edit')) {
			var file = arch.find(menu.focus());
			if (file && file.type === 'file') {
				file.content.html = cryptoIn(this.$textarea_html.val());
				file.content.md = cryptoIn(this.$textarea_md.val());
				this.$tabs_content.removeClass('edit');
				this.$textarea_html.val('');
				this.$textarea_md.val('');
				menu._show_content();
				arch._set_local();
			}
		}
	}
}



// var _de = (function() {
// 	var $de = $('.directory_edit');
// 	var $edit = $de.find('.de__edit_');
// 	var $check = $de.find('.de__check_');
//
// 	function events() {
// 		$edit.on('click', editFile);
// 		$check.on('click', checkFile);
// 	}
// 	function editFile(e) {
// 		$('.content__textarea').val('edit!');
// 	};
// 	function checkFile(e) {
// 		$('.drawer__center').html($('.content__textarea').val());
// 		$('.content__textarea').val('');
// 	};
// 	return {
// 		init: events
// 	}
// }());
// _de.init();

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

var tabs = {
	init: function() {
		this._cacheDom();
		this._events();
	},
	_cacheDom: function() {
		this.$links = $('#tabs_link');
		this.$link_tab = this.$links.find('.tabs__');
		this.$content = $('#tabs_content');
		this.$content_html = this.$content.find('.tabs__html');
		this.$content_md = this.$content.find('.tabs__md');
		this.active_class = 'tabs_active';
	},
	_events: function() {
		this.$links.on('click',this._active_toggle.bind(this));
	},
  _active_toggle: function(e) {
    this.target = $(e.target);
    if (this.target.hasClass('tabs__') && !this.target .hasClass(this.active_class)) {
      this.target.addClass(this.active_class).siblings('.tabs_active').removeClass(this.active_class);
      if (this.target.hasClass('tabs__html')) {
        this.$content_html.addClass(this.active_class).siblings('.' + this.active_class).removeClass(this.active_class);
      }
      if (this.target.hasClass('tabs__md')) {
        this.$content_md.addClass(this.active_class).siblings('.' + this.active_class).removeClass(this.active_class);
      }
    }
  }
}

$(document).ready(function() {
	$.ajax({
		url: './arch.json',
		success: function(data){
			if (!localStorage.getItem('arch')){
				localStorage.setItem('arch',JSON.stringify(data));
			}
		},
		error: function() {
			console.log('Cорян,тут ничё нету.');
		},
		complete:function() {
			arch.init();
			menu.init();
			tabs.init();
			dm.init();
			de.init();
			nn.init()
			$('.drawer__toggle_left').on('click',function() {
	$('.drawers').toggleClass('drawer__opened_left');
})
$('.drawer__toggle_right').on('click',function() {
	$('.drawers').toggleClass('drawer__opened_right');
})

		}
	});

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
	this.content = {
		html: obj.html || "PGgxPkhlbGxvLHdvcmxkITwvaDE+",
		md: obj.md || 'IyBIZWxsbyx3b3JsZCE='
	}
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
function cryptoIn(x) {
	return utf8_to_b64(x);
}
function cryptoOut(x) {
	return b64_to_utf8(x);
}
function utf8_to_b64(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
	// return window.btoa(str);
}
//декодирование строки из base-64 в Unicode
function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)))
	// return window.atob(str);
}
