var SortList = new Class({
	Implements: Options,

	options: {
		elements: false,
		sortLinks: false,
		defaults: {
			sortTag: null,
			sortDirection: 1
		}
	},

	current: {
		sortTag: null,
		sortDirection: null
	},

	sortFunctions: {
		numeric: function (a, b) {
			return this.simple(a.toInt(), b.toInt());
		},
		simple: function (a, b) {
			if (a == b) return 0;
			if ((b == null) || (a > b)) return 1;
			if ((a == null) || (a < b)) return -1;
			return 0;
		}
	},

	/*
	 * All elements should be contained by the same parent. Behavior is unspecified otherwise.
	 */
	initialize: function(options) {
		this.setOptions(options);
		this.sort();
		var sortlist = this;
		this.options.sortLinks = $$(this.options.sortLinks);
		this.options.elements = $$(this.options.elements);
		this.options.defaults.sortTag = this.options.defaults.sortTag || this.options.sortLinks[0].get('data-sorttag');
		this.options.sortLinks.addEvent('click', function (event) {
			event.stop();
			var sorttag = $(this).get('href').substring(1);
			sortlist[sortlist.sortStable ? "sortStable" : "sort"](sorttag, 'autotoggle');
		});
	},

	setSortDirection: function(sortdirection) {
		this.sort(null, sortdirection);
	},
	reverseSortDirection: function() {
		this.sort(null, -this.current.sortDirecion);
	},

	sort: function(tagname, sortdirection) {
		tagname = tagname || this.current.sortTag || this.options.defaults.sortTag; 
		sortdirection = sortdirection || this.current.sortDirection || this.options.defaults.sortDirection;

		if (sortdirection == 'autotoggle') {
			sortdirection = (tagname == this.current.sortTag) ? -this.current.sortDirection : this.options.defaults.sortDirection;
		}

		var allNumeric = this.options.elements.every(function(el) {
			var value = el.get('data-'+tagname);
			return value && value.test("^[0-9]*$");
		});

		(this.options.elements).sort(function(a, b) {
			if (allNumeric) {
				return this.sortFunctions.numeric(a.get('data-'+tagname), b.get('data-'+tagname)) * sortdirection;
			} else {
				return this.sortFunctions.simple(a.get('data-'+tagname), b.get('data-'+tagname)) * sortdirection;
			}
		}.bind(this));

		this.options.elements.each(function(el) {
			el.inject(el.getParent(), 'bottom');
		});

		$$(this.options.sortLinks)
			.removeClass('active').removeClass('active-asc').removeClass('active-desc');
		$$(this.options.sortLinks).filter("[href=#"+tagname+"]")
			.addClass('active').addClass(sortdirection == 1 ? 'active-asc' : 'active-desc');

		this.current.sortTag = tagname;
		this.current.sortDirection = sortdirection;
	}
});

