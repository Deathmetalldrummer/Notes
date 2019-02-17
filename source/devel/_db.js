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
		this.data = JSON.parse(JSON.stringify(this.data))
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
		id_list.splice(id_list.indexOf(id),1);
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
