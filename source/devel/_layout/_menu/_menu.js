function Menu(param) {


	this.createMenu = function() {
		$('#menu').html(render(param));
		focus();
	};


	// Грязь
	function render(obj) {
		var d = $('<div></div>');
		if (obj.folders && obj.folders.length) {
			$.each(obj.folders, function(i, val) {
				d.append(menu__li(val));
			});
		}
		if (obj.files && obj.files.length) {
			$.each(obj.files, function(i, val) {
				d.append(menu__li(val));
			});
		}
		return d.html();
	}
	// Ужос
	function menu__li(obj) {
		var focus_class = ($('#menu .menu__link.menu__focused').data('id') === obj.id) ? ' menu__focused' : '';
		var li = $('<li class="menu__ menu__' + obj.type + '"></li>');
		var link = $('<a class="menu__link menu__link_' + obj.type + focus_class + '" data-id=' + obj.id + ' href="#">' + obj.name + '</a>');
		link.prepend(svg_icon(obj.type));
		li.append(link);
		var ul = $('<ul class="menu_sub"></ul>');
		// svg_icon(type)
		if (obj.folders && obj.folders.length) {
			$.each(obj.folders, function(i, val) {
				ul.append(menu__li(val));
			});
		}
		if (obj.files && obj.files.length) {
			$.each(obj.files, function(i, val) {
				ul.append(menu__li(val));
			});
		}
		if (!ul.html()) {
			ul = '';
		}
		li.append(ul);
		return li;
	}
	function svg_icon(type) {
		if (type === 'folder') {
			return $('<svg class="menu__icon menu__icon_folder" xmlns="http://www.w3.org/2000/svg" viewbox="153 399.8 51 43.2"><path d="M201.6,409.9c-1.3-1.3-2.9-2-4.7-2h-20.2v-1c0-1.8-0.7-3.4-2-4.7c-1.3-1.3-2.9-2-4.7-2h-9.6c-1.8,0-3.4,0.7-4.7,2c-1.3,1.3-2,2.9-2,4.7v28.8c0,1.8,0.7,3.4,2,4.7c1.3,1.3,2.9,2,4.7,2h36.5c1.8,0,3.4-0.7,4.7-2c1.3-1.3,2-2.9,2-4.7v-21.2C203.5,412.8,202.9,411.2,201.6,409.9z M199.7,435.8c0,0.8-0.3,1.5-0.8,2c-0.6,0.6-1.2,0.8-2,0.8h-36.5c-0.8,0-1.5-0.3-2-0.8c-0.6-0.6-0.8-1.2-0.8-2v-28.8c0-0.8,0.3-1.5,0.8-2c0.6-0.6,1.2-0.8,2-0.8h9.6c0.8,0,1.5,0.3,2,0.8c0.6,0.6,0.8,1.2,0.8,2v1.9c0,0.8,0.3,1.5,0.8,2c0.6,0.6,1.2,0.8,2,0.8h21.2c0.8,0,1.5,0.3,2,0.8c0.6,0.6,0.8,1.2,0.8,2L199.7,435.8L199.7,435.8z"></path></svg>');
		}
		if (type === 'file') {
			return $('<svg class="menu__icon menu__icon_file" xmlns="http://www.w3.org/2000/svg" viewbox="120 395.1 42.5 51"><path d="M161.4,410.5c-0.4-1-1-1.9-1.6-2.5l-10.2-10.2c-0.6-0.6-1.4-1.1-2.5-1.6c-1-0.4-2-0.7-2.9-0.7h-20.8c-0.9,0-1.6,0.3-2.2,0.9c-0.6,0.6-0.9,1.3-0.9,2.2v43.8c0,0.9,0.3,1.6,0.9,2.2c0.6,0.6,1.3,0.9,2.2,0.9H159c0.9,0,1.6-0.3,2.2-0.9c0.6-0.6,0.9-1.3,0.9-2.2v-29.2C162.1,412.5,161.9,411.5,161.4,410.5z M145.4,400.1c0.6,0.2,1.1,0.5,1.3,0.7L157,411c0.3,0.3,0.5,0.7,0.7,1.3h-12.2V400.1z M157.9,441.5h-33.3v-41.7h16.7v13.5c0,0.9,0.3,1.6,0.9,2.2c0.6,0.6,1.3,0.9,2.2,0.9h13.5V441.5z"></path></svg>');
		}
	}

	function focus() {
		$('.menu__link').on('click', function(e) {
			$('#menu .menu__focused').removeClass('menu__focused');
			$(e.target).addClass('menu__focused');
		})
	}





}
