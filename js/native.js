/**
 * native utility
 * User: Jeff Zhong
 * Date: 14-12-27
 * Time: 下午8:38
 */

// 判断环境
function getEnv() {
    var ua = navigator.userAgent.toLowerCase();
    if (/micromessenger(\/[\d\.]+)*/.test(ua)) {
        return 'weixin';
    } else if (/qq\/(\/[\d\.]+)*/.test(ua) || /qzone\//.test(ua)) {
        return 'qq';
    } else if (u.indexOf('chrome') > -1) {
        return 'Chrome';
    } else if (u.indexOf('msie') > 0) {
        return 'MSIE'; //IE浏览器  
    } else if (u.indexOf('firefox') > 0) {
        return 'Firefox'; //Firefox浏览器  
    } else if (u.indexOf('safari') > 0) {
        return 'Safari'; //Safan浏览器  
    } else if (u.indexOf('camino') > 0) {
        return 'Camino'; //Camino浏览器  
    } else if (u.indexOf('gecko/') > 0) {
        return 'Gecko'; //Gecko浏览器  
    } else {
        return 'h5';
    }
}


var browser = {
    versions: function () {
        var u = navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            isIE: u.indexOf('MSIE') > 0,
            isChrome: u.indexOf('Chrome') > -1,
            isSafari: u.indexOf('Safari') > 0 && (/webkit|khtml/i).test(u),
            isFirefox: u.indexOf('Firefox') > -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1,
            iPad: u.indexOf('iPad') > -1,
            winPhone: u.indexOf('Windows Phone') > -1
        };
    }()
}

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
        return "Gecko"; //Gecko浏览器  
    }
}

/**
 * 返回浏览器特有css前缀
 */
var webkit = function () {
    var css3_div = document.createElement("div");
    css3_div.style.cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
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
}();

/**
 * 获取animationend名称
 */
var animationend = function () {
    switch (webkit) {
        case '-webkit-':
            return 'webkitAnimationEnd';
        case '-ms-':
            return 'MSAnimationEnd';
        case '-o-':
            return 'oAnimationEnd';
        default:
            return 'animationend';
    }
}();

/**
 * 获取transitionend名称
 */
var transitionEnd = (function () {
    var el = document.createElement('bootstrap'),
        transEndEventName = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'transition': 'transitionend'
        };
    for (var name in transEndEventName) {
        if (el.style[name] !== undefined) {
            return transEndEventName[name];
        }
    }
})();


/*视口的大小，部分移动设备浏览器对innerWidth的兼容性不好，需要
 *document.documentElement.clientWidth或者document.body.clientWidth
 *来兼容（混杂模式下对document.documentElement.clientWidth不支持）。
 *使用方法 ： getViewPort().width;
 */
function getViewPort() {
    if (document.compatMode == "BackCompat") {   //浏览器嗅探，混杂模式
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
}

//获得文档的大小（区别与视口）,与上面获取视口大小的方法如出一辙
function getDocumentPort() {
    if (document.compatMode == "BackCompat") {
        return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight
        };
    } else {
        return {
            width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
            height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
        }
    }
}

/**
 * head添加css样式
 */
var addCssRule = function () {
    // 创建一个 style， 返回其 stylesheet 对象
    // 注意：IE6/7/8中使用 style.stylesheet/addRule，其它浏览器 style.sheet/insertRule
    var sheet = function () {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        head.appendChild(style);
        return style.sheet;
        // return style.sheet||style.stylesheet;//ie
    }();
    // 返回接口函数
    return function (cssText) {
        var cssRules = cssText.split('\r\n');
        var len = !!sheet.cssRules ? sheet.cssRules.length : 0;
        for (var i = 0; i < cssRules.length; i++) {
            if (sheet.insertRule) {
                sheet.insertRule(cssRules[i], len++);
            }
            // else if (sheet.addRule) {
            //     sheet.addRule(selector, rules, index);//ie
            // }
        }
    }
}();

// addCssRule('.restore{-webkit-transition:-webkit-transform .3s linear;}');

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
    NOTATION_NODE: 12
};
var native = {
    //当前浏览器是否与库兼容
    isCompatible: function (other) {
        if (other === false ||
            !Array.prototype.push ||
            !Object.hasOwnProperty ||
            !document.createElement ||
            !document.getElementsByTagName) {
            return false;
        }
        return true;
    },
    //添加事件
    addEvent: function (node, type, fn) {
        //if(!(node=$(node))){return false;}
        if (node.addEventListener) {
            node.addEventListener(type, fn, false);
        } else if (node.attachEvent) {
            node['e' + type + fn] = fn;
            node[type + fn] = function () { node['e' + type + fn](window.event); }
            node.attachEvent("on" + type, node[type + fn]);
        } else {
            node["on" + type] = fn;
        }
        return true;
    },
    //移除事件
    removeEvent: function (node, type, fn) {
        //if(!(node=$(node))){return false;}
        if (node.removeEventListener) {
            node.removeEventListener(type, fn, false);
            return true;
        } else if (node.detachEvent) {
            node.detachEvent('on' + type, node[type + fn]);
            node[type + fn] = null;
            return true;
        } else {
            node["on" + type] = null;
        }
        return false;
    },
    //根据ClassName获取元素
    getElementsByClassName: function (className, tag, parent) {
        parent = parent || document;
        tag = tag || '*';
        //if(!(parent=$(parent))){return false;}
        var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var matchElemets = [];
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
        var element, i, len;
        for (i = 0, len = allTags.length; i < len; i++) {
            element = allTags[i];
            if (regex.test(element.className)) {
                matchElemets.push(element);
            }
        }
        return matchElemets;
    },
    toggleDisplay: function (node, value) {
        if (node.style.display != 'none') {
            node.style.display = 'none';
        } else {
            node.style.display = value || '';
        }
        return true;
    },
    //在node之后插入节点(insertBefore是之前插入)
    insertAfter: function (node, referenceNode) {
        //if(!(node=$(node))){return false;}
        //if(!(referenceNode=$(referenceNode))){return false;}
        return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
    },
    //清空该节点下的子节点
    removeChildren: function (parent) {
        // parent.innerHTML='';
        while (parent.firstChild) {
            parent.firstChild.parentNode.removeChild(parent.firstChild);
        }
        return true;
    },
    //从开头开始插入子节点(appendChild是从尾部开始插入)
    prependChild: function (parent, newChild) {
        //if(!(parent=$(parent))){return false;}
        //if(!(newChild=$(newChild))){return false;}
        if (parent.firstChild) {
            parent.insertBefore(newChild, parent.firstChild);
        } else {
            parent.appendChild(newChild);
        }
        return parent;
    },
    //遍历节点,并执行函数func(非递归)
    walkDoms: function (node, fn) {
        var root = node || window.document;
        var nodes = root.getElementsByTagName('*'),
            i, len = nodes.length;
        for (i = 0; i < len; i++) {
            fn && fn.call(nodes[i]);
        }
    },
    //递归方式遍历节点,跟踪节点深度
    walkDOMRecursive: function (node, depth, fn) {
        var root = node || window.document;
        fn && fn.call(root, depth++);
        node = root.firstChild;
        while (node) {
            walkTheDOMRecursive(node, depth, fn);
            node = node.nextSibling;
        }
    },
    //同时查找每个节点的属性
    walkDOMWithAttributes: function (node, depth, fn, owner) {
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
    },

    //获取浏览器高和宽
    getBrowserWinSize: function () {
        var de = document.documentElement;
        return {
            'width': (window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
            'height': (window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
        };
    },
    //绑定事件
    bindFunction: function (obj, func) {
        return function () {
            func.apply(obj, arguments);
        };
    },
    //JavaScript判断浏览器类型及主版本
    getBrowserInfo: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        if (window.ActiveXObject) {
            Sys.browser = "ie";
            Sys.version = parseInt(ua.match(/msie ([\d.]+)/)[1]);
        } else if (document.getBoxObjectFor) {
            Sys.browser = "firefox";
            Sys.version = parseInt(ua.match(/firefox\/([\d.]+)/)[1]);
        } else if (window.MessageEvent && !document.getBoxObjectFor) {
            Sys.browser = "chrome";
            Sys.version == parseInt(ua.match(/chrome\/([\d.]+)/)[1]);
        } else if (window.opera) {
            Sys.browser = "opera";
            Sys.version == parseInt(ua.match(/opera.([\d.]+)/)[1]);
        } else if (window.openDatabase) {
            Sys.browser = "safari";
            Sys.version == parseInt(ua.match(/version\/([\d.]+)/)[1]);
        }
        return Sys;
    },
    //原生ajax
    ajax: function (url, param, isPost, async) {
        if (!url || !param) {
            return;
        }
        if (typeof url != 'string' || typeof param != 'string') {
            return;
        }
        async = (async && async === true) ? true : false;
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            throw new Error("创建xmlhttp对象异常");
        }
        var method = (isPost && isPost == true) ? 'POST' : 'GET';
        if (method == 'GET') {
            url = encodeURI(url) + '?' + encodeURIComponent(param);
        }
        var postParam = method === 'POST' ? param : null;
        xmlhttp.open(method, url, async);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) { //服务器完成
                if (xmlhttp.status == 200) { //如果状态码为200则成功|
                    return xmlhttp.responseText; //responseText属性为服务器返回的文本
                } else {
                    throw new Error("Ajax服务器返回错误!");
                }
            }
        }
        xmlhttp.send(postParam); //这时才开始发送请求
    },
    //原生jsonp
    getJsonp: function (url, callback) {
        if (url.indexOf("?") > -1) {
            url += "&callback=" + callback;
        } else {
            url += "?callback=" + callback;
        }
        url += "&nocache=" + new Date().getTime(); // prevent caching
        var script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("type", "text/javascript");
        script.setAttribute("charset", "utf-8");
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    //按指定的次数重复字符串
    repeat: function (str, counts) {
        return new Array(counts + 1).join(str);
    },
    //将word-word转为wordWord
    camelize: function (s) {
        return s.replace(/\-(\w)/g, function (strMatch, p) {
            return p.toUpperCase();
        });
    },
    //将wordWord转为word-word
    uncamelize: function (s) {
        return s.replace(/[A-Z]/g, '-$&').toLowerCase();
    },
    //事件对象
    getEventObj: function (evt) {
        return evt || window.event;
    },
    //事件的目标对象
    getTarget: function (evt) {
        var event = evt || window.event;
        var target = event.target || event.srcElement;
        if (target.nodeType == NODE.TEXT_NODE) { //safari
            target = node.parentNode;
        }
        return target;
    },
    //阻止冒泡
    stopPropagation: function (evt) {
        var event = evt || window.event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    //取消默认行为
    preventDefault: function (evt) {
        var event = evt || window.event;
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    //鼠标位置
    getPointerPos: function (evt) {
        var event = evt || window.event;
        var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        return { 'x': x, 'y': y };
    },
    //访问键盘命令
    getKeyPressed: function (evt) {
        var event = evt || window.event;
        var code = event.keyCode;
        var value = String.fromCharCode(code);
        return { 'code': code, 'value': value };
    },
    //确定单击了哪几个鼠标键
    getMouseButton: function (evt) {
        var event = evt || window.event;
        var buttons = { 'left': false, 'middle': false, 'right': false };
        if (event.toString && event.toString().indexOf('MouseEvent') != -1) {
            switch (event.button) {
                case 0:
                    buttons.left = true;
                    break;
                case 1:
                    buttons.middle = true;
                    break;
                case 2:
                    buttons.right = true;
                    break;
                default:
                    break;
            }
        } else if (event.button) { //ie
            switch (event.button) {
                case 1:
                    buttons.left = true;
                    break;
                case 2:
                    buttons.right = true;
                    break;
                case 3:
                    buttons.left = true;
                    buttons.right = true;
                    break;
                case 4:
                    buttons.middle = true;
                    break;
                case 5:
                    buttons.left = true;
                    buttons.middle = true;
                    break;
                case 6:
                    buttons.right = true;
                    buttons.middle = true;
                    break;
                case 7:
                    buttons.left = true;
                    buttons.middle = true;
                    buttons.right = true;
                    break;
                default:
                    break;
            }
        } else {
            return false;
        }
        return buttons;
    },
    //dom ready 加载回调
    domReady: function (callback) {
        var d = document,
            done = false,
            init = function () {
                if (!done) {
                    done = true;
                    callback();
                }
            },
            completed = function (event) {
                d.removeEventListener("DOMContentLoaded", completed, false);
                window.removeEventListener("load", completed, false);
                init();
            };
        //w3c
        if (d.addEventListener) {
            d.addEventListener('DOMContentLoaded', completed, false);
            window.addEventListener('load', completed, false);
        } else {
            //ie
            d.attachEvent("onreadystatechange", function () {
                if (/loaded|complete/.test(d.readyState)) {
                    d.detachEvent("onreadystatechange", arguments.callee);
                    init();
                }
            });

            (function () {
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
    },
    //script加载完成后执行回调
    loadScript: function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { //ie
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    callback();
                }
            }
        } else { //其他浏览器
            script.onload = function () {
                callback();
            }
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    //通过id修改元素样式
    setStylesById: function (element, styles) {
        if (!element) {
            return false;
        }
        element = typeof element == 'string' ? document.getElementById(element) : element;
        var prop;
        for (prop in styles) {
            if (!styles.hasOwnProperty(prop)) {
                continue;
            }
            if (element.style.setProperty) {
                element.style.setProperty(this.uncamelize(prop, '-'), styles[prop], null);
            } else {
                element.style[this.camelize(prop)] = styles[prop];
            }
        }
        return true;
    },
    //通过class修改多个样式属性
    setStylesByClassName: function (parent, tag, className, styles) {
        var eles = this.getElementsByClassName(className, tag, parent),
            len = eles.length,
            i;
        for (i = 0; i < len; i++) {
            this.setStylesById(ele[i], styles);
        }
        return true;
    },
    //通过tag修改多个样式属性
    setStylesByTagName: function (tagName, styles, parent) {
        parent = parent || document;
        var eles = document.getElementsByTagName(tagName),
            len = eles.length,
            i;
        for (i = 0; i < len; i++) {
            this.setStylesById(eles[i], styles);
        }
        return true;
    },
    //获取元素的class名属性
    getClassNames: function (element) {
        return element.className.replace(/\s+/, ' ').split(' ');
    },
    //是否存在某个className
    hasClassName: function (element, className) {
        var classes = this.getClassNames(element),
            len = classes.length,
            i;
        for (i = 0; i < len; i++) {
            if (classes[i] == className) {
                return true;
            }
        }
        return false;
    },
    //为元素添加class
    addClassName: function (element, className) {
        element.className += (element.className ? ' ' : '') + className;
        return true;
    },
    //删除元素的某个class
    removeClassName: function (element, className) {
        var classes = this.getClassNames(element),
            len = classes.length,
            i;
        for (i = len - 1; i >= 0; i--) {
            if (classes[i] === className) {
                classes.splice(i, 1);
            }
        }
        element.className = classes.join(',');
        return len == classes.length ? false : true;
    },
    //toggleclass
    toggleClassName: function (element, className) {
        if (this.hasClassName(element, className)) {
            this.addClassName(element, className);
        } else {
            this.removeClassName(element, className);
        }
    },
    //通过url获取包含样式的数组
    getStyleSheets: function (url, media) {
        var sheets = [],
            len = document.styleSheets.length,
            i;
        for (i = 0; i < len; i++) {
            if (url && document.styleSheets[i].href.indexOf(url) == -1) {
                continue;
            }
            if (media) {
                media = media.replace(/,\s*/, ',');
                var sheetMedia;
                if (document.styleSheets[i].media.mediaText) {
                    //dom
                    sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/, ',');
                    //safari会添加额外的逗号和空格
                    sheetMedia = sheetMedia.replace(/,\s*$/, ',');
                } else {
                    //ie
                    sheetMedia = document.styleSheets[i].media.replace(/,\s*/, ',');
                }
                if (media != sheetMedia) {
                    continue;
                }
            }
            return sheets;
        }
    },
    //编辑一条样式规则
    editCSSRule: function (selector, styles, url, media) {
        var styleSheets = (typeof url == 'array' ? url : this.getStyleSheets(url, media)),
            len = styleSheets.length,
            i;
        for (i = 0; i < len; i++) {
            var rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (!rules) {
                continue;
            }
            selector = selector.toUpperCase(),
                jl = rules.length, j;
            for (j = 0; j < jl; j++) {
                if (rules[j].selectText.toUpperCase() == selector) {
                    for (var prop in styles) {
                        if (prop in styles) {
                            if (!styles.hasOwnProperty(prop)) {
                                continue;
                            }
                            rules[j].style[this.camelize(prop)] = styles[prop];
                        }
                    }
                }
            }
        }
    },
    //添加一条CSS规则
    addCSSRule: function (selector, styles, index, url, media) {
        var declartion = '',
            prop;
        for (prop in styles) {
            if (!styles.hasOwnProperty(prop)) {
                continue;
            }
            declartion += prop + ':' + styles[prop] + ';';
        }
        var styleSheets = (typeof url == 'array' ? url : this.getStyleSheets(url, media));
        var newIndex, i, len = styleSheets.length;
        for (i = 0; i < len; i++) {
            if (styleSheets[i].insertRule) {
                newIndex = (index >= 0 ? index : styleSheets[i].cssRules.length);
                styleSheets[i].insertRule(selector + '{' + declartion + '}', newIndex);
            } else if (styleSheets[i].addRule) {
                newIndex = (index >= 0 ? index : -1);
                styleSheets[i].addRule(selector, declartion, newIndex);
            }
        }
    },
    //取得一个样式的计算样式
    getStyle: function (element, prop) {
        if (!prop) {
            return false;
        }
        var value = element.style[this.camelize(prop)];
        if (!value) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var css = document.defaultView.getComputedStyle(element, null);
                value = css ? css.getPropertyValue(prop) : null;
            } else if (element.currentStyle) {
                value = element.currentStyle[this.camelize(prop)];
            }
        }
        return value = 'auto' ? '' : value;
    }
};

var domCode = '',
    nodeNameCounters = [],
    requiredVariables = '',
    newVariables = '';

function walkTheDOMRecursive(func, node, depth, returnedFromParent) {
    var root = node || window.document;
    returnedFromParent = func.call(root, depth++, returnedFromParent);
    node = root.firstChild;
    while (node) {
        walkTheDOMRecursive(func, node, depth, returnedFromParent);
        node = node.nextSibling;
    }
}

function encode(str) {
    if (!str) {
        return null;
    }
    str = str.replace(/\\/g, '\\\\').replace(/';/g, "\\'").replace(/\s+^/mg, "\\n");
    return str;
}

function checkForVariable(v) {
    if (v.indexOf('$') == -1) {
        v = '\'' + v + '\'';
    } else { //ie会添加锚的完整路径,故需要取得该字符串从$到结尾处的子字符串
        v = v.substring(v.indexOf('$') + 1);
        requiredVariables += 'var ' + v + ';\n';
    }
    return v;
}

function generateDom(html, strRoot) {
    var domRoot = document.createElement('DIV');
    domRoot.innerHTML = html;
    //重置变量
    domCode = '';
    nodeNameCounters = [];
    requiredVariables = '';
    newVariables = '';

    //使用processNode()处理所有节点
    var node = domRoot.firstChild;
    while (node) {
        walkTheDOMRecursive(processNode, node, 0, strRoot);
        node = node.nextSibling;
    }
    //输出生成的代码
    domCode = '/* requiredVariables in this code\n' + requiredVariables + '*/\n\n' + domCode + '\n\n' + '/* new objects in this code\n' + newVariables + '*/\n\n';
    return domCode;
}

function processNode(tabCount, refParent) {
    //根据树的深度级别重复制表符,以便对每一行进行适当的缩进
    var tabs = (tabCount ? native.repeat('\t', parseInt(tabCount)) : '');
    var ref;
    //确定节点类型并处理元素和文本节点
    switch (this.nodeType) {
        case NODE.ELEMENT_NODE:
            //计算器加1 并创建一个使用标签和计数器的值
            if (nodeNameCounters[this.nodeName]) {
                ++nodeNameCounters[this.nodeName];
            } else {
                nodeNameCounters[this.nodeName] = 1;
            }
            ref = this.nodeName.toLocaleLowerCase() + nodeNameCounters[this.nodeName];
            domCode += tabs + 'var ' + ref + ' = document.createElement(\'' + this.nodeName + '\');\n';

            //将新变量添加到列表中以便在结果中报告它们
            newVariables += '' + ref + ';\n';
            //检测是否存在属性,如果存在则遍历这些属性,并使用procesAttributes()方法遍历它们的DOM树
            if (this.attributes) {
                var i, len = this.attributes.length;
                for (i = 0; i < len; i++) {
                    walkTheDOMRecursive(processAttributes, this.attributes[i], tabCount, ref);
                }
            }
            break;
        case NODE.TEXT_NODE:
            //检测文本节点中除了空白符之外的值
            var value = (this.nodeValue ? encode(this.nodeValue.trim()) : '');
            if (value) {
                if (nodeNameCounters['txt']) {
                    ++nodeNameCounters['txt'];
                } else {
                    nodeNameCounters['txt'] = 1;
                }
                ref = 'txt' + nodeNameCounters['txt'];
                value = checkForVariable(value);

                domCode += tabs + 'var ' + ref + ' = document.createTextNode(' + value + ');\n';
                newVariables += '' + ref + ';\n';
            } else {
                return;
            }
            break;
        default:
            break;
    }
    //将这个节点添加到其父节点的代码
    if (refParent) {
        domCode += tabs + refParent + '.appendChild(' + ref + ');\n';
    }
    return ref;
}

function processAttributes(tabCount, refParent) {
    //跳过文本节点
    if (this.nodeType != NODE.ATTRIBUTE_NODE) {
        return;
    }
    var attrValue = (this.nodeValue ? encode(this.nodeValue.trim()) : '');
    if (this.nodeName == 'cssText') { alert('true'); }
    if (!attrValue) {
        return;
    }
    var tabs = tabCount ? native.repeat('\t', parseInt(tabCount)) : '';
    switch (this.nodeName) {
        default: if (this.nodeName.substring(0, 2) == 'on') {
            domCode += tabs + refParent + '.' + this.nodeName + '= function(){' + attrValue + '}\n';
        } else {
            domCode += tabs + refParent + '.setAttribute(\'' + this.nodeName + '\',' + checkForVariable(attrValue) + ');\n';
        }
            break;
        case 'class':
            domCode += tabs + refParent + '.className=' + checkForVariable(attrValue) + ';\n';
            break;
        case 'style':
            var style = attrValue.split(/\s*;\s*/g);
            if (style) {
                for (pair in style) {
                    if (!style[pair]) {
                        continue;
                    }
                    var prop = style[pair].split(/\s*:\s*/);
                    if (!prop[1]) {
                        continue;
                    }

                    prop[0] = native.camelize(prop[0]);

                    var propValue = checkForVariable(prop[1]);
                    if (prop[0] == 'float') {
                        //float是保留字,属特殊情况
                        domCode += tabs + refParent + '.style.cssFloat=' + propValue + ';\n';
                        domCode += tabs + refParent + '.style.styleFloat=' + propValue + ';\n';
                    } else {
                        domCode += tabs + refParent + '.style.' + prop[0] + '=' + propValue + ';\n';
                    }
                }
            }
            break;
    }
}
