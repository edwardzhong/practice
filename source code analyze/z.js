/*
1.回调
2.deferred
3.节点操作
4.css操作
5.事件
6.动画
*/
;(function(window,undefined){
	var doc=window.document,
		docEle=doc.documentElement,
		rquickReg=/^(?:\s*(<[\W\w]+>)[^\>]*|#([\w-]+))$/,
		rsingleReg=/^<(\w+)\s*\/?>(?:<\/\1>)$/,
		_version='0.0.1',
		rootzQuery,
		core_slice=Array.prototype.slice,

	zQuery = function (selector,context){
		return new zQuery.fn.init(selector,context);
	};

	zQuery.fn=zQuery.prototype = {
		zQuery:_version,
		constructor:zQuery,
		selector:'',
		length:0,
		ready:function(callback){
			var d=document, done=false,
				init=function(){
					if(!done){
						done=true;
						callback();
					}
				},
				completed=function(event){
					d.removeEventListener( "DOMContentLoaded", completed, false );
					window.removeEventListener( "load", completed, false );
					init();
				};
			//w3c
			if(d.addEventListener){
				d.addEventListener('DOMContentLoaded',completed,false);
				window.addEventListener('load',completed,false);
			} else {
				//ie
				d.attachEvent("onreadystatechange", function(){
					if (/loaded|complete/.test(d.readyState)) {
						d.detachEvent( "onreadystatechange", arguments.callee );
						init();
					}
			    });
			    
				(function(){
					try{
			            // DOM树未创建完之前调用doScroll会抛出错误
			            d.documentElement.doScroll('left');
					} catch(e){
						//延迟再试一次
						setTimeout(arguments.callee,50);
						return;
					}
					init();
				})();
			}
		},
		toArray:function(){
			return core_slice.call(this);
		},
		first:function(){
			return this.eq(0);
		},
		last:function(){
			return this.eq(-1);
		},
		eq:function(i){
			var len=this.length,
				j=i+(i<0?len:0);
			return this.pushStack(j>=0&&j<len?this[j]:[]);
		},
		get:function(i){
			return i==null?this.toArray():(i<0?this[this.length+i]:this[i]);
		},
		end:function(){
			return this.prevObject||this.constructor(null);
		},
		pushStack:function(elems){
			var ret=zQuery.merge(this.constructor(),elems);
			ret.prevObject=this;
			ret.context=this.context;
			return ret;
		}
	},

	init=zQuery.fn.init=function(selector,context){
		var match,elem;
		if(!selector){
			return this;
		}
		if(typeof selector=='string'){//字符串
			match=selector.match(rquickReg);
			if(match&&(match[1]||!context)){
				if(match[1]){//单标签<div>
					zQuery.merge(this,zQuery.parseHTML(match[1]),context?context.ownerDocument:document);
				} else {//id
					elem=document.getElementById(match[2]);
					this.length=1;
					this[0]=elem;
					this.context=document;
					this.selector=selector;
				}
			} else if(!context||context.zQuery){//sizzle,zquery对象
				return (context||rootzQuery).find(selector);
			} else {//sizzle,非zquery对象
				return this.constructor(context).find(selector);
			}
		} else if(selector.nodeType){//节点类型
			this.context=this[0]=selector;
			this.length=1;
			return this;
		} else if(zQuery.isFunction(selector)){//function对应 document.ready
			return rootzQuery.ready(selector);
		}

		if(selector.selector!==undefined){//$($()) 多层嵌套
			this.selector=selector.selector;
			this.context=selector.context;
		}
		
		return zQuery.makeArray(selector,this);
	};
	var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		wrapMap = {
		// Support: IE 9
		option: [1, "<select multiple='multiple'>", "</select>"],
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		_default: [0, "", ""]
	};
	// Support: IE 9
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody    = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th       = wrapMap.td;
	init.prototype = zQuery.fn;
	// zQuery.fn.init.prototype=zQuery.fn;
	//为zQuery添加静态/实例的属性/方法，参数大于2时为指定对象继承
	zQuery.extend=zQuery.fn.extend=function(){
		var options,name,copy,clone,src,
			copyIsArray=false,
			target=arguments[0]||{},
			i=1,
			len=arguments.length,
			deep=false;

		if(typeof target==='boolean'){
			deep=target;
			target=arguments[1]||{};
			i=2;
		}
		if(typeof target!=='object'&&!zQuery.isFunction(target)){
			target={};
		}

		if(i==len){
			target=this;
			i--;
		}

		for(;i<len;i++){
			if((options=arguments[i])){
				for(name in options){
					src=target[name];
					copy=options[name];

					if(target===copy){//防止死循环
						continue;
					}
					if(deep&&copy&&(zQuery.isPlainObject(copy)||(copyIsArray=zQuery.isArray(copy)))){
						if(copyIsArray){
							clone=src&&zQuery.isArray(src)?src:[];
						} else {
							clone=src&&zQuery.isPlainObject(src)?src:{};
						}
						zQuery.extend(clone,copy);
					} else {
						target[name]=copy;
					}
				}
			}
		}

		return target;
	};
	zQuery.extend({
		type:function(obj){
			var objType;
			if(obj==null){
				return '' + obj;
			}
			if(typeof obj=='object'||typeof obj=='function'){
				objType=Object.prototype.toString.call(obj).slice(8,-1);
				return objType.replace(/^[A-Z]/,function(matchs,match,b){
					return matchs.toLowerCase();
				});
			} else {
				return typeof obj;
			}
		},
		isFunction:function(obj){
			return zQuery.type(obj)==='function';
		},
		isWindow:function(obj){
			return obj != null && obj === obj.window;
		},
		isArray:Array.isArray,
		isObject:function(obj){
			return zQuery.type(obj)==='object';
		},
		isEmptyObject:function(obj){
			var name;
			for(name in obj){
				return false;
			}
			return true;
		},
		isPlainObject:function(obj){
			if ( zQuery.type( obj ) !== "object" || obj.nodeType || zQuery.isWindow( obj ) ) {
				return false;
			}
			try {
				if ( obj.constructor &&
						!Object.hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}
			} catch ( e ) {
				return false;
			}
			return true;
		},
		merge:function(first,second){
			var i = first.length,
				l = second.length,
				j = 0;

			if ( typeof l === "number" ) {
				for ( ; j < l; j++ ) {
					first[ i++ ] = second[ j ];
				}
			} else {
				while ( second[j] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}

			first.length = i;
			return first;
		},
		parseHTML:function(data,context){
			if(!data|| typeof data!=='string'){
				return null;
			}
			context=context||document;
			var parsed=rsingleReg.exec(data);
			//单标签直接创建返回
			if(parsed){
				return [context.createElement(parsed)];
			}
			//处理多标签
			parsed=zQuery.buildFragment([data],context);

			return zQuery.merge([],parsed.childNodes);
		},
		buildFragment:function(elems,context){
			var fragment=context.createDocumentFragment(),
				nodes=[],
				i=0,
				l=elems.length,
				temp;
			for(;i<l;i++) {
				elem=elems[i];

				if(elem || elem === 0){
					if(zQuery.isObject(elem)){//zq对象或者普通元素
						zQuery.merge(nodes,elem.nodeType?[elem]:elem);
					} else if(!/<|&#?\w+;/.test(elem)) {//文本节点
						nodes.push(context.createTextNode(elem));
					} else {
						tmp = tmp || fragment.appendChild(context.createElement("div"));
						tag = (/<([\w:]+)/.exec(elem) || ["", ""])[1].toLowerCase();
						wrap = wrapMap[tag] || wrapMap._default;
						tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

						j = wrap[0];
						while (j--) {
							tmp = tmp.lastChild;
						}

						jQuery.merge(nodes, tmp.childNodes);
					}
				}
			}
			i = 0;
			while ((elem = nodes[i++])) {
				fragment.appendChild(elem);
			}
			return fragment;
		},
		each:function(obj,callback){
			var isArray=isArraylike(obj),
				i=0,
				len=obj.length,
				val;
			if(isArray){
				for(;i<len;i++){
					val=callback.call(obj[i],i,obj[i]);
					if(val===false){
						break;
					}
				}
			} else {
				for(i in obj){
					val=callback.call(obj[i],i,obj[i]);
					if(val===false){
						break;
					}
				}
			}
			return obj;
		}
	});
	rootzQuery=zQuery(document);

	//回调
	zQuery.callBacks=function(options){
		var list=[];
		return {
			fire:function(arg){
				if(!list.length){return;}
				zQuery.each(list,function(i,item){
					item(arg);
				});
				if(options=='once'){
					list=[];
				}
			},
			add:function(){
				zQuery.each(arguments,function(i,item){
					list.push(item);
				});
			},
			remove:function(fn){
				zQuery.each(list,function(i,item){
					if(item==fn){
						list.splice(i,1);
					}
				});
			},
			empty:function(){
				list=[];
			}
		};
	};
	zQuery.extend({
		dir:function(elem,dir){
			var matched=[];
			while((elem=elem[dir])&&elem.nodeType!==9){
				if(elem.nodeType===1){
					matched.push(elem);
				}
			}
			return matched;
		},
		sibling: function( n, elem ) {
			var matched = [];
			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					matched.push( n );
				}
			}

			return matched;
		}
	});
	function sibling( cur, dir ) {
		while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
		return cur;
	}
	function parent(elem){
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	}
	//判断是不是一个真正的数组
	//1 是否有长度
	//2 类型
	function isArraylike(obj) {
		var length = obj.length,
			type = zQuery.type(obj);
		if (type === "function" || zQuery.isWindow(obj)) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}
	window.zQuery = window.$ = zQuery;
}(window));