
/**
 * 滚动事件统一控制器
 * @param    {String}  fn  返回：false 表示反复执行，true 用于达到某条件后不再执行
 * @Author   jeffzhong(p_jdjfzhong)
 * @DateTime 2016-07-14T15:06:16+0800
 */
var scrollEventCtr = (function() {
	var eventArr = [], //事件列表
		eventIsLoads = []; //是否加载的标志列表
	window.onscroll = function() {
		eventArr.forEach(function(fn, i) {
			if (eventIsLoads[i]) {
				return true;
			} //标志已经加载过，不需要反复执行
			if (typeof fn == 'function') {
				eventIsLoads[i] = fn();
			}
		});
	};
	return function(fn) {
		eventIsLoads.push(false);
		eventArr.push(fn);
		if (typeof fn == 'function') {
			//滚动事件触发前先运行一次
			eventIsLoads[eventIsLoads.length - 1] = fn();
		}
	};
})();

// 观察者模式，发布订阅
function Observer() {
	this.events = {};
}

Observer.prototype = {
	bind: function(name, fn) {
		var events = this.events;
		events[name] = events[name] || [];
		events[name].push(fn);
	},
	unbind: function(name, fn) {
		var events = this.events,
			index = -1;
		if (events[name] && (index = events[name].indexOf(fn)) > -1) {
			events[name].splice(index, 1);
		}
	},
	one: function(name, fn) {
		var that = this;
		that.bind(name, function() {
			fn.apply(this, [].slice.call(arguments));
			that.unbind(name, arguments.callee);
		});
	},
	fire: function() {
		var events = this.events,
			args = Array.prototype.slice.call(arguments),
			name = args[0];
		if (events[name]) {
			events[name].forEach(function(fn, i) {
				fn.apply(this, args.slice(1));
			});
		}
	},
};

/**
 * compose function
 * @param  {...Function} fns
 */
function compose(...fns) {
	return function(...args) {
		let ret = null;
		fns.forEach(function(fn, i) {
			i == 0 ? (ret = fn(...args)) : (ret = fn(ret));
		});
		return ret;
	};
}

/**
 * curried
 * @param {Function} fn
 */
function curry(fn, ...args) {
	return function(...innerArgs) {
		return fn(...args, ...innerArgs);
	};
}

/**
 * foreach Array, ArrayLike or Object
 * @param {Array/Object} object
 * @param {Function} callback
 */
function each(object, callback) {
	var name,
		i = 0,
		length = object.length;
	if (length == undefined) {
		for (name in object) {
			if (callback.call(object[name], name, object[name]) === false) {
				break;
			}
		}
	} else {
		for (var value = object[0]; i < length && callback.call(value, value, i) !== false; value = object[++i]) {}
	}
	return object;
}

/**
 * map Array, ArrayLike or Object
 * @param {Array/Object} object
 * @param {Function} callback
 */
function map(object, callback) {
	var value,
		key,
		ret = [],
		i = 0,
		length = object.length,
		isArray =
			length !== undefined &&
			typeof length === 'number' &&
			((length > 0 && object[0] && object[length - 1]) || length === 0 || isArray(object));

	// Go through the array, translating each of the items to their
	if (isArray) {
		for (; i < length; i++) {
			value = callback(object[i], i);
			if (value != null) {
				ret[ret.length] = value;
			}
		}
		// Go through every key on the object,
	} else {
		for (key in object) {
			value = callback(object[key], key);

			if (value != null) {
				ret[ret.length] = value;
			}
		}
	}
	// Flatten any nested arrays
	return ret.concat.apply([], ret);
}

function filter(object, callback) {
	var ret = [],
		i = 0,
		length = object.length;
	for (; i < length; i++) {
		if (!!callback(object[i], i)) ret.push(object[i]);
	}
	return ret;
}

function entries(object) {
	if (isArray(object)) {
		return object.entries();
	} else if (isObject(object)) {
		return Object.entries(object);
	} else {
		return null;
	}
}

function keys(object) {
	if (isArray(object)) {
		return object.keys();
	} else if (isObject(object)) {
		return Object.keys(object);
	} else {
		return null;
	}
}

function values(object) {
	if (isArray(object)) {
		return object.values();
	} else if (isObject(object)) {
		return Object.values(object);
	} else {
		return null;
	}
}

function repeat(n, object) {
	// return new Array(n + 1).join(s);
	// if(isString(object)) return object.repeat(n);
	return new Array(n).fill(object);
}

function toArray(object) {
	if (!object.length) return object;
	return Array.from(object);
}

function isSpace(value) {
	return /^[\s\t\r\n]+$/.test(value);
}

function isAlphaNum(value) {
	return isAlpha(value) || isNumber(value);
}

function isAlpha(value) {
	return /^[a-zA-Z]+$/.test(value);
}

function isNumber(value) {
	return typeof value == 'number';
}

function isArray(obj) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(obj);
	} else {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
}

function isObject(obj) {
	return type(obj) == 'object';
}

function isString(value) {
	return typeof value == 'string';
}

function isWindow(obj) {
	return obj && obj == obj.window;
}

function type(obj) {
	if (obj == null) {
		return String(obj);
	}
	return typeof obj == 'object' || typeof obj == 'function'
		? Object.prototype.toString
				.call(obj)
				.slice(8, -1)
				.toLowerCase() || 'object'
		: typeof obj;
}

// //实现bind的功能
// Function.prototype.myBind = function(obj) {
//     var that = this;
//     return function() {
//         return that.apply(obj, [].slice.call(arguments));
//     }
// }

// //给String附加trim方法
// if (!String.trim) {
//     String.prototype.trim = function() {
//         return this.replace(/^\s+|\s+$/g, '');
//     }
// }

/**
 * prototype inherit
 * @param {Object} parent
 * @param {Object} child
 */
function inherit(parent, child) {
	var f = function() {};
	f.prototype = parent.prototype;
	child.prototype = new f();
	child.prototype.constructor = child; //注意修正constructor
	return child;
}

//克隆对象
function cloneObj(obj) {
	// Handle the 3 simple types, and null or undefined
	if (null == obj || 'object' != typeof obj) return obj;
	var copy;
	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; ++i) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * deep copy
 * @param {Object} p
 * @param {Object} c
 */
function deepCopy(p, c) {
	if (null == p || 'object' != typeof p) return p;
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = p[i].constructor === Array ? [] : {};
			deepCopy(p[i], c[i]);
		} else if (typeof p[i] === 'function') {
			c[i] = p[i].prototype.constructor;
		} else c[i] = p[i];
	}
	return c;
}

//将word-word转为wordWord
function camelize(s) {
	return s.replace(/\-(\w)/g, function(strMatch, p1) {
		return p1.toUpperCase();
	});
}

//将wordWord转为word-word
function uncamelize(s) {
	return s.replace(/[A-Z]/g, '-$&').toLowerCase();
}

/**
 * 获取 a~b 区间的随机数
 * @param {Number} a
 * @param {Number} b
 */
function random(a, b) {
	return Math.random() * (b - a) + a;
}

/**
 * 获取 #aabbcc 格式的随机颜色
 */
function randomColor() {
	var c = Math.floor(Math.random() * 16777216);
	return '#' + ('000' + c.toString(16)).slice(-6);
}

/**
 * html encode
 * html转码
 * @param  {String} str [description]
 * @return {String}     [description]
 */
function escapeHtml(str) {
	if (!str) return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/ /g, '&nbsp;')
		.replace(/\'/g, '&#39;')
		.replace(/\"/g, '&quot;');
}

/**
 * html decode
 * html解码
 * @param  {String} str [description]
 * @return {String}     [description]
 */
function unescapeHtml(str) {
	if (!str) return '';
	return str
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&quot;/g, '"')
		.replace(/&#(\d+);/g, function(m, g) {
			return String.fromCharCode(parseInt(g, 10));
		});
}

/**
 * encode RegExp string
 * 正则字符串转义
 * @param {String} str
 */
function escapeRegExp(str) {
	return str.replace(/([+-*.?^${}[\]()\/\\])/g, '\\$1');
}

//增强版取URL中的参数
function getUrlParams(url) {
	var search = url || location.search,
		reg = new RegExp('([^?&=]+)=([^?&=]*)', 'g'),
		match = null,
		ret = {};

	while ((match = reg.exec(search))) {
		ret[match[1]] = decodeURIComponent(match[2]);
	}
	return ret;
}

//取URL中的参数
function getUrlParamByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


/**
 * Intercept the first n strings
 * @param {String} str
 * @param {Number} n
 */
function getContentSummary(str, n) {
	let replaceHtmlTags = str => str.replace(/<\s*\/?\s*\w+[\S\s]*?>/g, ''), //过滤掉html标签
		pattern = /^[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+/,
		ret = '',
		count = 0,
		m;
	str = replaceHtmlTags(htmlDecode(str));

	while (str.length) {
		if ((m = str.match(pattern))) {
			//拉丁文字
			count++;
			ret += m[0];
			str = str.substr(m[0].length);
		} else {
			if (str.charCodeAt(0) >= 0x4e00) {
				//中日韩文字
				count++;
			}
			ret += str.charAt(0);
			str = str.substr(1);
		}
		if (count > n) {
			ret += '...';
			break;
		}
	}
	return ret;
}

/**
 * Count the number of string
 * 计算字符串文字数量(拉丁中日韩字符)
 * @param  {String} str
 * @return {Number} string number
 */
function wordCount(str) {
	var pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
	var m = str.match(pattern);
	var count = 0;
	if (m === null) return count;
	for (var i = 0; i < m.length; i++) {
		if (m[i].charCodeAt(0) >= 0x4e00) {
			count += m[i].length;
		} else {
			count += 1;
		}
	}
	return count;
}

//处理单字节字母和双字节文字符号
function getLength(str) {
	return String(str).replace(/[^\x00-\xff]/g, 'aa').length;
}

/**
 * 压缩图像
 * @param {Image} img
 * @param {Number} size
 */
function compressPicture(img, size = 400) {
	const canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		w = img.width,
		h = img.height;
	if (Math.max(w, h) > size) {
		if (w > h) {
			canvas.width = size;
			canvas.height = (h / w) * size;
		} else {
			canvas.height = size;
			canvas.width = (w / h) * size;
		}
	} else {
		canvas.width = w;
		canvas.height = h;
	}
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas;
}

function compressPictureToBase64(img, size = 400) {
	return compressPicture(img, size).toDataURL('image/jpeg');
}

function compressPictureToBlob(img, size = 400) {
	return new Promise(resolve => {
		compressPicture(img, size).toBlob(resolve, 'image/jpeg');
	});
}

/**
 * stringFormat('xx$1x $3 xxx$2', 11,22,33)
 * @param {String} str
 * @param  {...any} args
 */
function stringFormat(str, ...args) {
	args = args.flat(); // Array can be Array, because flat function
	return str.replace(/\$(\d+)/g, function(match, num) {
		let m = args[parseInt(num, 10) - 1];
		return m ? '' + m : match;
	});
}

function formatTime(str) {
	const d = new Date(str);
	const n = new Date();
	const r = n - d;
	const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
	const timeStr =
		('0' + d.getHours()).slice(-2) +
		':' +
		('0' + d.getMinutes()).slice(-2) +
		':' +
		('0' + d.getSeconds()).slice(-2);
	const just = 1000 * 10;
	const min = 1000 * 60;
	const hour = 1000 * 60 * 60;
	const day = hour * 24;
	const month = day * 30;
	let s = timeStr;

	if (r < day && n.getDate() - d.getDate() == 0) {
		if (r < just) {
			s = '刚刚';
		} else if (r < min) {
			s = Math.floor(r / 1000) + '秒前';
		} else if (r < hour) {
			s = Math.floor(r / min) + '分钟前';
		} else if (r < hour * 24) {
			s = Math.floor(r / hour) + '小时前';
		}
	} else if (r < day * 2 && new Date(n.getTime() - day).getDate() - d.getDate() == 0) {
		s = `昨天 ${timeStr}`;
	} else if (r < day * 3 && new Date(n.getTime() - day * 2).getDate() - d.getDate() == 0) {
		s = `前天 ${timeStr}`;
	} else if (r < day * 8) {
		s = Math.floor(r / day) + '天前';
	} else if (r < day * 30) {
		s = dateStr;
	} else if (r < month * 12) {
		s = Math.floor(r / month) + '个月前';
	} else if (r < day * 365 * 5) {
		s = Math.floor(r / (day * 365)) + '年前';
	} else {
		s = `${dateStr} ${timeStr}`;
	}
	return s;
}

function ajax(option) {
	var opt = {
		url: '/',
		method: 'GET',
		data: {},
		async: true,
		success: function() {},
		error: function() {},
	};
	for (var p in option) {
		opt[p] = option[p];
	}
	var xhr = null;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	} else {
		throw new Error('创建xmlhttp对象异常');
	}

	var param = JSON.stringify(opt.data)
		.replace(/[\{\}\"]/g, '')
		.replace(/:/g, '=')
		.replace(/,/g, '&');
	var url = opt.method == 'GET' && opt.data ? opt.url + '?' + param : opt.url;
	// xhr.responseType = 'json';
	xhr.open(opt.method, url, opt.async);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				opt.success(xhr.responseText);
			} else {
				opt.error(e.target.response);
			}
		}
	};
	xhr.send(param);
}

//原生jsonp
function jsonp(url, callback, callbackName) {
	var t = new Date().getTime() + '' + Math.floor(Math.random() * 10000);
	callbackName = callbackName || 'callback' + t;
	url += (url.indexOf('?') < 0 ? '?' : '&') + 'callback=' + callbackName + '&_t=' + t;
	var script = document.createElement('script');
	script.setAttribute('src', url);
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('charset', 'utf-8');
	document.getElementsByTagName('head')[0].appendChild(script);
	window[callbackName] = callback;
}

/*可视窗口的大小，部分移动设备浏览器对innerWidth的兼容性不好，需要
 *document.documentElement.clientWidth或者document.body.clientWidth
 *来兼容（混杂模式下对document.documentElement.clientWidth不支持）。
 *使用方法 ： getViewPort().width;
 */
function getWinSize() {
	return {
		width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
	};
}

// 滚动条位置
function getScrollPos() {
	return {
		left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
	};
}

//获得文档的大小 包括滚动高度（区别于视口）,取所有属性中最大值
function getPageSize() {
	var root = document.documentElement;
	return {
		width: Math.max(
			root.scrollWidth,
			root.clientWidth,
			root.offsetWidth,
			document.body.scrollWidth,
			document.body.offsetWidth,
		),
		height: Math.max(
			root.scrollHeight,
			root.clientHeight,
			root.offsetHeight,
			document.body.scrollHeight,
			document.body.offsetHeight,
		),
	};
}

// 获取元素相对页面的距离
function offset(node) {
	var pos = { left: 0, top: 0 };
	var doc = node && node.ownerDocument;
	if (!doc) return pos;
	var box = getBoundingClientRect(),
		root = doc.documentElement,
		clientLeft = root.clientLeft || 0,
		clientTop = root.clientTop || 0;
	var scrollLeft = window.pageXOffset || root.scrollLeft,
		scrollTop = window.pageYOffset || root.scrollTop;
	pos.left = box.left + scrollLeft - clientLeft;
	pos.top = box.top + scrollTop - clientTop;
	return pos;
}

//取得一个样式的计算样式
function getStyle(el, name) {
	name = name.replace(/\-(\w)/g, function(match, l) {
		return l.toUpperCase();
	});
	if (window.getComputedStyle) {
		//getComputedStyle第二个参数为对付伪类，如placeholder
		return el.ownerDocument.getComputedStyle(el, null)[name];
	} else {
		return el.currentStyle[name];
	}
}

/**
 * sns分享链接
 * @param type sns type
 * @param opts sns option
 */
function shareUrl(type, opts) {
    const configs = {
        weibo: ({ url, title, pic }) => `http://service.weibo.com/share/share.php?url=${encodeURI(url)}&title=${title}&pic=${encodeURIComponent(pic || '')}`,
        qq: ({ url, title, desc }) => `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURI(url)}&title=${title}&source=${desc || ''}`,
        douban: ({ url, title, pic, desc }) => `https://www.douban.com/share/service?href=${encodeURI(url)}&name=${title}&image=${encodeURIComponent(pic || '')}&text=${desc || ''}`,
        qzone: ({ url, title, pic, desc }) => `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURI(url)}&title=${title}&pics=${encodeURIComponent(pic || '')}&summary=${desc || ''}&desc=${desc || ''}&site=${encodeURI(url)}`,
        facebook: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`,
        twitter: ({ url, title }) => `https://twitter.com/intent/tweet?text=${title}&url=${encodeURI(url)}&via=${encodeURI(url)}`,
    }
    return configs[type](opts);
}

function isMobile() {
	return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}

//密码必须包含数字,字母,符号
function checkPass(val) {
	if (/^(?=.*?\d)(?=.*?[a-zA-Z])(?![a-zA-Z\d]+$).+$/.test(val)) {
		return true;
	}
	return false;
}
