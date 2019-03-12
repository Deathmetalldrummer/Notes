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