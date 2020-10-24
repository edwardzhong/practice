	function each(obj, callback) {
		var len = obj.length,
			isArray = typeof len == 'number';

		if (isArray) {
			for (var i = 0; i < len; i++) {
				if (callback.call(obj[i], obj[i], i) === false) {
					break;
				}
			}
		} else {
			for (var i in obj) {
				if (callback.call(obj[i], obj[i], i) === false) {
					break;
				}
			}
		}
	}

	//发布订阅实现事件
	function Event() {
		this.events = {};
	}
	Event.prototype = {
		add: function (type, fn) {
			this.events[type] = this.events[type] || [];
			this.events[type].push(fn);
		},
		one: function (type, fn) {
			//只执行一次
			var self = this;
			self.add(type, function () {
				fn.apply(this, [].slice.call(arguments));
				self.remove(type, arguments.callee);
			});
		},
		fire: function () {
			var type = arguments[0],
				args = [].slice.call(arguments, 1);
			if (type in this.events && this.events[type].length > 0) {
				each(this.events[type], function (item, i) {
					item.apply(item, args);
				});
			}
		},
		remove: function (type, fn) {
			if (type in this.events) {
				this.events[type].splice(this.events[type].indexOf(fn), 1);
				if (!this.events[type].length) {
					delete this.events[type];
				}
			}
		},
	};

	var evt = new Event();
	var fna = function (a, b) {
		console.log(a, b);
	};
	var fnb = function (a, b) {
		console.log(a, b);
	};
	var fnc = function (a) {
		console.log(a, 'one');
	};
	evt.add('a', fna);
	evt.add('a', fnb);
	evt.fire('a', 3, 4);
	evt.remove('a', fna);
	evt.fire('a', 1, 2);
	evt.one('c', fnc);
	evt.fire('c', 'two')
	evt.fire('c', 'one');

	evt.one('c', fnb);
	evt.fire('c', 'one');
	evt.fire('a', 'one');

