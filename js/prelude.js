/**
 * compose function
 * @param  {...Function} fns 
 */
function compose(...fns) {
    return function (...args) {
        let ret = null
        fns.forEach(function (fn, i) {
            i == 0 ? (ret = fn(...args)) : (ret = fn(ret))
        });
        return ret;
    }
}

/**
 * curried
 * @param {Function} fn 
 */
function curry(fn, ...args) {
    return function (...innerArgs) {
        return fn(...args, ...innerArgs);
    };
}

/**
 * foreach Array, ArrayLike or Object
 * @param {Array/Object} object 
 * @param {Function} callback 
 */
function each(object, callback) {
    var name, i = 0, length = object.length;
    if (length == undefined) {
        for (name in object) {
            if (callback.call(object[name], name, object[name]) === false) {
                break;
            }
        }
    } else {
        for (var value = object[0]; i < length && callback.call(value, value, i) !== false; value = object[++i]) { }
    }
    return object;
}

/**
 * map Array, ArrayLike or Object
 * @param {Array/Object} object 
 * @param {Function} callback 
 */
function map(object, callback) {
    var value, key, ret = [],
        i = 0,
        length = object.length,
        isArray = length !== undefined && typeof length === "number" && ((length > 0 && object[0] && object[length - 1]) || length === 0 || isArray(object));

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
    var ret = [], i = 0, length = object.length;
    for (; i < length; i++) {
        if (!!callback(object[i], i))
            ret.push(object[i]);
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
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
}

function isObject(obj) {
    return type(obj) == "object";
}

function isString(value) {
    return typeof value == 'string';
}

function isWindow(obj){
    return obj && obj == obj.window;
}

function type(obj) {
    if (obj == null) {
        return String(obj);
    }
    return typeof obj == 'object' || typeof obj == 'function' ?
        Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() || 'object' : typeof obj;
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
 * stringFormat('xx$1x $3 xxx$2', 11,22,33)
 * @param {String} str 
 * @param  {...any} args 
 */
function stringFormat(str, ...args) {
    args = args.flat();// Array can be Array, because flat function
    return str.replace(/\$(\d+)/g, function (match, num) {
        let m = args[parseInt(num, 10) - 1];
        return m ? ('' + m) : match;
    });
}

//密码必须包含数字,字母,符号
function checkPass(val) {
    if (/^(?=.*?\d)(?=.*?[a-zA-Z])(?![a-zA-Z\d]+$).+$/.test(val)) {
        return true;
    }
    return false;
}

/**
 * 获取 a~b 区间的随机数
 * @param {Number} a 
 * @param {Number} b
 */
function Random(a, b) {
    return Math.random() * (b - a) + a;
}

/**
 * 获取 #aabbcc 格式的随机颜色
 */
function RandomColor() {
    var c = Math.floor(Math.random() * 16777216);
    return '#' + ('000' + c.toString(16)).slice(-6);
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
 * prototype inherit
 * @param {Object} parent 
 * @param {Object} child 
 */
function inherit(parent, child) {
    var f = function () { };
    f.prototype = parent.prototype;
    child.prototype = new f();
    child.prototype.constructor = child;//注意修正constructor
    return child;
}

/**
 * deep copy
 * @param {Object} p 
 * @param {Object} c 
 */
function deepCopy(p, c) {
    if (null == p || "object" != typeof p) return p;
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === 'object') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        } else if (typeof p[i] === 'function') {
            c[i] = p[i].prototype.constructor;
        } else c[i] = p[i];
    }
    return c;
}

//克隆对象
function cloneObj(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
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
 * 顺序遍历dom
 * @param  {dom elem}   node    
 * @param  {Function}   callback 
 */
function walkDOM(node, callback) {
    var root = node || window.document,
        elems = root.getElementsByTagName('*');
    callback.call(root, 0);
    for (var i = 0, l = elems.length; i < l; i++) {
        callback.call(elems[i], i + 1);
    }
}

/**
 * 递归遍历dom
 * @param  {dom elem}   node    
 * @param  {Function}   callback 
 * @param  {Number}     depth    元素深度
 */
function walkDOMRecursive(node, callback, depth) {
    var root = node || window.document,
        depth = depth || 0,
        elem;

    callback.call(root, depth++);
    elem = root.firstElementChild;
    while (elem) {
        walkDOMRecursive(elem, callback, depth);
        elem = elem.nextElementSibling;
    }
}

/**
 * html encode
 * html转码
 * @param  {String} str [description]
 * @return {String}     [description]
 */
function escapeHtml(str){  
    if(!str) return '';
    return str.replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/ /g,'&nbsp;')
        .replace(/\'/g,'&#39;')
        .replace(/\"/g,'&quot;');
}

/**
 * html decode
 * html解码
 * @param  {String} str [description]
 * @return {String}     [description]
 */
function unescapeHtml (str){  
    if(!str) return '';
    return str.replace(/&amp;/g,"&")
        .replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>')
        .replace(/&nbsp;/g,' ')
        .replace(/&quot;/g,'\"')
        .replace(/&#(\d+);/g,function(m,g){
            return String.fromCharCode(parseInt(g,10))
        });
}

/**
 * encode RegExp string
 * 正则字符串转义
 * @param {String} str 
 */
function escapeRegExp(str){
    return str.replace(/([+-*.?^${}[\]()\/\\])/g,'\\$1');
}

/**
 * Intercept the first n strings
 * @param {String} str 
 * @param {Number} n 
 */
function getContentSummary(str,n){
    let replaceHtmlTags=str=>str.replace(/<\s*\/?\s*\w+[\S\s]*?>/g,''),//过滤掉html标签
    pattern=/^[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+/,
    ret='',count=0,m;
    str=replaceHtmlTags(htmlDecode(str));

    while(str.length){
        if((m=str.match(pattern))){//拉丁文字
            count++;
            ret+=m[0];
            str=str.substr(m[0].length);
        } else {
            if(str.charCodeAt(0)>=0x4E00){//中日韩文字
                count++;
            }
            ret+=str.charAt(0);
            str=str.substr(1);
        }
        if(count>n){
            ret+='...';
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
    if(m === null) return count;
    for(var i = 0; i < m.length; i++) {
        if(m[i].charCodeAt(0) >= 0x4E00) {
            count += m[i].length;
        } else {
            count += 1;
        }
    }
    return count;
}

//处理单字节字母和双字节文字符号
function getLength(str){
    return String(str).replace(/[^\x00-\xff]/g,'aa').length;
};

/**
 * 压缩图像
 * @param {Image} img 
 * @param {Number} size 
 */
function compressPicture(img,size) {
    const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
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
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
}

/**
 * 滚动事件统一控制器
 * @param    {String}  fn  返回：false 表示反复执行，true 用于达到某条件后不再执行
 * @Author   jeffzhong(p_jdjfzhong)
 * @DateTime 2016-07-14T15:06:16+0800
 */
var scrollEventCtr=(function(){
    var eventArr=[],//事件列表
        eventIsLoads=[];//是否加载的标志列表
    $(window).on('scroll', function() {
        eventArr.forEach(function(fn,i){
            if(eventIsLoads[i]){return true;}//标志已经加载过，不需要反复执行
            if(typeof fn =='function'){
                eventIsLoads[i]=fn(); 
            }
        });
    });
    return function(fn){
        eventIsLoads.push(false);
        eventArr.push(fn);
        if(typeof fn =='function'){//滚动事件触发前先运行一次
            eventIsLoads[eventIsLoads.length-1]=fn();
        }
    };
}());


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
    }
};