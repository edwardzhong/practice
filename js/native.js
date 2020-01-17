/**
 * native utility
 * User: Jeff Zhong
 * Date: 14-12-27
 * Time: 下午8:38
 */

 // 是否移动端
function isMobile() {
	return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}

// wx/qq/h5判断环境
function getEnv() {
	var ua = navigator.userAgent.toLowerCase();
	if (/micromessenger(\/[\d\.]+)*/.test(ua)) {
		return 'weixin';
	} else if (/qq\/(\/[\d\.]+)*/.test(ua) || /qzone\//.test(ua)) {
		return 'qq';
	} else {
		return 'h5';
	}
}

var browser = (function() {
	var u = navigator.userAgent;
	return {
		trident: u.indexOf('Trident') > -1, //IE内核
		presto: u.indexOf('Presto') > -1, //opera内核
		webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
		isIE: u.indexOf('MSIE') > 0,
		isChrome: u.indexOf('Chrome') > -1,
		isSafari: u.indexOf('Safari') > 0 && /webkit|khtml/i.test(u),
		isFirefox: u.indexOf('Firefox') > -1,
		mobile: !!u.match(/AppleWebKit.*Mobile.*/),
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
		iPhone: u.indexOf('iPhone') > -1,
		iPad: u.indexOf('iPad') > -1,
		winPhone: u.indexOf('Windows Phone') > -1,
		weixin: u.indexOf('MicroMessenger') == -1, //是否为微信浏览器
	};
})();

function getBrowser() {
	var u = navigator.userAgent;
	if (u.indexOf('Chrome') > -1) {
		return 'Chrome';
	} else if (u.indexOf('MSIE') > -1) {
		return 'MSIE'; //IE浏览器
	} else if (u.indexOf('Firefox') > -1) {
		return 'Firefox'; //Firefox浏览器
	} else if (u.indexOf('Safari') > -1) {
		return 'Safari'; //Safan浏览器
	} else if (u.indexOf('Camino') > -1) {
		return 'Camino'; //Camino浏览器
	} else if (u.indexOf('Gecko/') > -1) {
		return 'Gecko'; //Gecko浏览器
	}
}

/**
 * 返回浏览器特有css前缀
 */
var webkit = (function() {
	var css3_div = document.createElement('div');
	css3_div.style.cssText =
		'-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
	if (css3_div.style.webkitTransition) {
		return '-webkit-';
	} else if (css3_div.style.MozTransition) {
		return '-moz-';
	} else if (css3_div.style.oTransition) {
		return '-o-';
	} else if (css3_div.style.msTransition) {
		return '-ms-';
	} else {
		return '';
	}
})();

/**
 * 获取transitionend名称
 */
var transitionEnd = (function() {
	var obj = {
		TransitionEvent: 'transitionend',
		WebkitTransitionEvent: 'webkitTransitionEnd',
		OTransitionEvent: 'oTransitionEnd',
		otransitionEvent: 'otransitionend',
	};
	var ret;
	for (var name in obj) {
		if (window[name]) {
			ret = obj[name];
			break;
		}
		try {
			var a = document.createEvent(name);
			ret = obj[name];
			break;
		} catch (e) {}
	}
	return ret;
})();

/**
 * 获取animationend名称
 */
var animationend = (function() {
	var obj = {
		AnimationEvent: 'animationend',
		WebKitAnimationEvent: 'webkitAnimationEnd',
	};
	var ret;
	for (var name in obj) {
		if (window[name]) {
			ret = obj[name];
			break;
		}
	}
	return ret;
})();

//动态插入样式规则
//insertCSSRule('.restore{-webkit-transition:-webkit-transform .3s linear;}');
function insertCSSRule(rule) {
	if (styleElement) {
		var number = 0;
		try {
			var sheet = styleElement.sheet; //styleElement.styleSheet
			var cssRules = sheet.cssRules; //sheet.rules
			number = cssRules.length;
			sheet.insertRule(rule, number);
		} catch (e) {
			console.log(e.message + rule);
		}
	} else {
		styleElement = document.createElement('style');
		styleElement.innerHTML = rule;
		document.head.appendChild(styleElement);
	}
}

//删除样式规则
function deleteCSSRule(ruleName, keyframes) {
	var prop = keyframes ? 'name' : 'selectorText';
	var name = keyframes ? '@keyframes' : 'cssRule'; //调试用
	if (styleElement) {
		var sheet = styleElement.sheet; //styleElement.styleSheet
		var cssRules = sheet.cssRules; //sheet.rules
		for (var i = 0, n = cssRules.length; i < n; i++) {
			var rule = cssRules[i];
			if (rule[prop] === ruleName) {
				sheet.deleteRule(i);
				console.log('success delete ' + name + ' ' + ruleName);
				break;
			}
		}
	}
}

// 删除keyframes样式规则
function deleteKeyFrames(name) {
	deleteCSSRule(name, true);
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

//将word-word转为wordWord
function camelize(s) {
	return s.replace(/\-(\w)/g, function(match, l) {
		return l.toUpperCase();
	});
}
//将wordWord转为word-word
function uncamelize(s) {
	return s.replace(/[A-Z]/g, '-$&').toLowerCase();
}

/**
 * 原生操作dom工具库
 */
var NODE = {
	ELEMENT_NODE: 1,
	ATTRIBUTE_NODE: 2,
	TEXT_NODE: 3,
	CDATA_SECTION_NODE: 4,
	ENTITY_REFFERENCE_NODE: 5,
	ENTITY_NODE: 6,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE: 8,
	DOCUMENT_NODE: 9,
	DOCUMENT_TYPE_NODE: 10,
	DOCUMENT_FRAGMENT_NODE: 11,
	NOTATION_NODE: 12,
};
//遍历节点,并执行函数func(非递归)
function walkDoms(node, fn) {
	var root = node || window.document;
	var nodes = root.getElementsByTagName('*'),
		i,
		len = nodes.length;
	for (i = 0; i < len; i++) {
		fn && fn.call(nodes[i]);
	}
}

//递归方式遍历节点,跟踪节点深度
function walkDOMRecursive(node, depth, fn) {
	var root = node || window.document;
	fn && fn.call(root, depth++);
	node = root.firstChild;
	while (node) {
		walkTheDOMRecursive(node, depth, fn);
		node = node.nextSibling;
	}
}

//同时查找每个节点的属性
function walkDOMWithAttributes(node, depth, fn, owner) {
	var root = node || window.document;
	fn(root, depth++, owner);
	if (root.attributes) {
		for (var i = 0; i < root.attributes.length; i++) {
			walkDOMWithAttributes(root.attributes[i], depth - 1, fn, root);
		}
	}
	if (root.nodeType != 2) {
		node = root.firstChild;
		while (node) {
			walkDOMWithAttributes(node, depth, fn, node);
			node = node.nextSibling;
		}
	}
}

//dom ready 加载回调(兼容ie6)
function domReady(callback) {
	var d = document,
		done = false,
		init = function() {
			if (!done) {
				done = true;
				callback();
			}
		},
		completed = function(event) {
			d.removeEventListener('DOMContentLoaded', completed, false);
			window.removeEventListener('load', completed, false);
			init();
		};
	//w3c
	if (d.addEventListener) {
		d.addEventListener('DOMContentLoaded', completed, false);
		window.addEventListener('load', completed, false);
	} else {
		//ie
		d.attachEvent('onreadystatechange', function() {
			if (/loaded|complete/.test(d.readyState)) {
				d.detachEvent('onreadystatechange', arguments.callee);
				init();
			}
		});

		(function() {
			try {
				// DOM树未创建完之前调用doScroll会抛出错误
				d.documentElement.doScroll('left');
			} catch (e) {
				//延迟再试一次
				setTimeout(arguments.callee, 50);
				return;
			}
			init();
		})();
	}
}

//script加载完成后执行回调
function loadScript(url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	if (script.readyState) {
		//ie
		script.onreadystatechange = function() {
			if (script.readyState == 'loaded' || script.readyState == 'complete') {
				callback();
			}
		};
	} else {
		//其他浏览器
		script.onload = function() {
			callback();
		};
	}
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * 原生ajax
 * @param {Object} opt
 * {
 * 	url:string;
 * 	data:object;
 * 	method:'GET'/'POST'
 * 	async:boolean;
 * 	success:function;
 * 	error:function;
 * }
 */
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
//取得一个样式的计算样式
function getStyle(el, name) {
	name = name.replace(/\-(\w)/g, function(_, m) {
		return m.toUpperCase();
	});
	if (window.getComputedStyle) {
		//getComputedStyle第二个参数为对付伪类，如placeholder
		return el.ownerDocument.getComputedStyle(el, null)[name];
	} else {
		return el.currentStyle[name];
	}
}
//根据ClassName获取元素
function getElementsByClassName(className, tag, parent) {
	parent = parent || document;
	tag = tag || '*';
	var allTags = tag == '*' && parent.all ? parent.all : parent.getElementsByTagName(tag);
	var matchElemets = [];
	className = className.replace(/\-/g, '\\-');
	var regex = new RegExp('(^|\\s)' + className + '(\\s|$)');
	var el,
		i,
		l = allTags.length;
	for (i = 0; i < l; i++) {
		el = allTags[i];
		if (regex.test(el.className)) {
			matchElemets.push(el);
		}
	}
	return matchElemets;
}
//通过id修改元素样式
function setStylesById(el, styles) {
	if (!el) return false;
	el = typeof el == 'string' ? document.getElementById(el) : el;
	var prop;
	for (prop in styles) {
		if (!styles.hasOwnProperty(prop)) {
			continue;
		}
		if (el.style.setProperty) {
			el.style.setProperty(uncamelize(prop, '-'), styles[prop], null);
		} else {
			el.style[camelize(prop)] = styles[prop];
		}
	}
	return true;
}
//通过class修改多个样式属性
function setStylesByClassName(parent, tag, className, styles) {
	var els = this.getElementsByClassName(className, tag, parent),
		l = els.length,
		i;
	for (i = 0; i < l; i++) {
		this.setStylesById(ele[i], styles);
	}
	return true;
}
//通过tag修改多个样式属性
function setStylesByTagName(tagName, styles, parent) {
	parent = parent || document;
	var els = document.getElementsByTagName(tagName),
		l = els.length,
		i;
	for (i = 0; i < l; i++) {
		this.setStylesById(els[i], styles);
	}
	return true;
}
//获取元素的class名属性
function getClass(el) {
	return el.className.replace(/\s+/, ' ').split(' ');
}
//是否存在某个className
function hasClass(el, name) {
	return (' ' + el.className + ' ').indexOf(' ' + name + '') > -1;
}
//为元素添加class
function addClass(el, name) {
	if (!this.hasClass(el, name)) {
		el.className += ' ' + name;
	}
}
//删除元素的某个class
function removeClass(el, name) {
	if (this.hasClass(el, name)) {
		el.className = el.className.replace(new RegExp('(^|\\s)' + name + '(\\s|$)'), name);
	}
}
//toggleclass
function toggleClass(el, name) {
	if (this.hasClass(el, name)) {
		this.addClass(el, name);
	} else {
		this.removeClass(el, name);
	}
}
function toggleDisplay(node, value) {
	if (node.style.display != 'none') {
		node.style.display = 'none';
	} else {
		node.style.display = value || '';
	}
	return true;
}
//添加事件
function addEvent(el, type, fn) {
	if (el.addEventListener) {
		el.addEventListener(type, fn, false);
	} else if (el.attachEvent) {
		el.attachEvent('on' + type, fn);
	} else {
		el['on' + type] = fn;
	}
	return true;
}
//移除事件
function removeEvent(el, type, fn) {
	if (el.removeEventListener) {
		el.removeEventListener(type, fn, false);
	} else if (el.detachEvent) {
		el.detachEvent('on' + type, fn);
	} else {
		el['on' + type] = null;
	}
}
//滚轮事件兼容
function wheel(obj, callback) {
	var wheelType = 'mousewheel';
	try {
		document.createEvent('MouseScrollEvents');
		wheelType = 'DOMMouseScroll';
	} catch (e) {}
	this.addEvent(obj, wheelType, function(event) {
		if ('wheelDelta' in event) {
			var delta = event.wheelDelta;
			if (window.opera && opera.version() < 10) {
				delta = -delta;
			}
			event.delta = Math.round(delta) / 120;
		} else if ('detail' in event) {
			event.wheelDelta = -event.detail * 40;
			event.delta = event.wheelDelta / 120;
		}
		callback(obj, event);
	});
}
//事件对象
function getEvent(evt) {
	return evt || window.event;
}
//事件的目标对象
function getTarget(evt) {
	var event = evt || window.event;
	var target = event.target || event.srcElement;
	if (target.nodeType == NODE.TEXT_NODE) {
		//safari
		target = node.parentNode;
	}
	return target;
}
//阻止冒泡
function stopPropagation(evt) {
	var event = evt || window.event;
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
}
//取消默认行为
function preventDefault(evt) {
	var event = evt || window.event;
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}
//访问键盘命令
function getKey(evt) {
	var event = evt || window.event;
	var code = event.keyCode;
	var value = String.fromCharCode(code);
	return { code: code, value: value };
}

function insert(node, referenceNode) {
	return referenceNode.parentNode.insertBefore(node, referenceNode);
}
//在node之后插入节点(insertBefore是之前插入)
function insertAfter(node, referenceNode) {
	return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
}
//默认的尾部插入
function append(parent, newChild) {
	return parent.appendChild(newChild);
}
//从开头开始插入子节点(appendChild是从尾部开始插入)
function prepend(parent, newChild) {
	if (parent.firstChild) {
		parent.insertBefore(newChild, parent.firstChild);
	} else {
		parent.appendChild(newChild);
	}
	return parent;
}
//删除节点
function remove(node) {
	return node.parentNode.removeChild(node);
}
//清空该节点下的子节点
function clear(node) {
	node.innerHTML = '';
	// while (node.firstChild) {
	//     node.removeChild(node.firstChild);
	// }
	return true;
}
