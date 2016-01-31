(function( window, undefined ) {
	var rootaQuery,
		location = window.location,
		document = window.document,
		docElem = document.documentElement,

		arr=[],
		class2type={},
		
		push=arr.push,
		slice=arr.slice,
		indexOf= arr.indexOf || function(elem) {
			var i = 0,
				len = this.length;
			for (; i < len; i++) {
				if (this[i] === elem) {
					return i;
				}
			}
			return -1;
		},
		concat=arr.concat,
		forEach=arr.forEach,
		toString=class2type.toString,
		hasOwn=class2type.hasOwnProperty,

		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,//匹配未闭合标签"<div>sdfdfd"或者id字符串"#div"字符串

		rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;//匹配单标签'<hr>'或者'<p></p>'

	var aQuery = function(selector, context) {
		return new aQuery.fn.init(selector, context,rootaQuery);
	};

	aQuery.fn=aQuery.prototype = {
		init: function(selector, context,rootaQuery) {
			var match,elem;
			if(!selector){
				return this;
			}
			if(typeof selector==='string'){
				if(selector.charAt(0)==='<'&&selector.charAt(selector.length-1)==='>'&&selector.length>=3){
					match=[null,selector,null];
				}else{
					match=rquickExpr.exec(selector);
				}

				if(match&&(match[1]||!context)){
					if(match[1]){
						context=context instanceof aQuery?context[0]:context;
						aQuery.merge( this, aQuery.parseHTML(//parseHTML转换将字符串转换为节点类型
							match[1],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
						return this;
					}else{//处理id
						elem = document.getElementById( match[2] );
						if ( elem && elem.parentNode ) {
							this.length = 1;
							this[0] = elem;
						}
						this.context = document;
						this.selector = selector;
						return this;
					}

				} else if ( !context || context.aQuery ) {
				//复杂字符串,则调用sizzle引擎$(context).find()
					return ( context || rootaQuery ).find( selector );
				} else {//最后则$(context).find(xxx)
					return this.constructor( context ).find( selector );
				}

			}else if(selector.nodeType){//处理节点,包装为aQuery对象
				this.context=this[0]=selector;
				this.length=1;
				return this;
			}else if(aQuery.isFunction(selector)){
				// return rootaQuery.ready( selector );
			}

			//处理$($()),多层query对象
			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return aQuery.makeArray( selector, this );
		},
		selector:'',
		length:0,
		toArray:function(){
			return slice.call(this);
		},
		pushStack:function(elems){
			var ret=aQuery.merge(this.constructor(),elems);
			ret.prevObject=this;
			ret.context=this.context;
			return ret;
		},
		eq:function(i){
			var len=this.length,
				j=i+(i<0?len:0);
			return this.pushStack(j>=0&&j<len?this[j]:[]);
		},
		first:function(){
			return this.eq(0);
		},
		last:function(){
			return this.eq(-1);
		},
		ready: function( fn ) {
			aQuery.ready.promise().done( fn );
			return this;
		}
	};
	aQuery.fn.init.prototype=aQuery.fn;
	aQuery.extend = aQuery.fn.extend = function() {
		var name,options,src,copy,clone,copyIsArray,
			target=arguments[0]||{},
			i=1,
			len=arguments.length,
			deep=false;

		if(typeof target==='boolean'){
			deep=target;
			target=arguments[1]||{};
			i=2;
		}
		if(typeof target!=='object'&&!aQuery.isFunction(target)){
			target={};
		}
		if(len===i){
			target=this;
			--i;
		}

		for(;i<len;i++){
			if((options=arguments[i])!=null){
				for(name in options){
					src=target[name];
					copy=options[name];

					if(target===copy){//防止死循环
						continue;
					}

					if(deep&&copy&&(aQuery.isPlainObject(copy)||(copyIsArray=aQuery.isArray(copy)))){
						if(copyIsArray){
							copyIsArray=false;
							clone=src&&aQuery.isArray(src)?src:[];
						}else{
							clone=src&&aQuery.isPlainObject(src)?src:{};
						}
						target[name]=aQuery.extend(deep,clone,copy);
					}else if(copy!==undefined){
						target[name]=copy;
					}
				}
			}
		}
		return target;
	};
	aQuery.extend({
		type:function(obj){
			if(obj==null){
				return String(obj);
			}
			return typeof obj=='object'||typeof obj=='function'?
				class2type[toString.call(obj)]||'object':typeof obj;
		},
		isFunction:function(obj){
			return aQuery.type(obj)==='function';
		},
		isArray:Array.isArray,
		isWindow:function(obj){
			return obj!=null&&obj===obj.window;
		},
		isNumber:function(obj){
			return !isNaN(parseFloat(obj))&&isFinite(obj);
		},
		isPlainObject: function( obj ) {//是否为对象字面量,即用{}或者是new boject创建
			if ( aQuery.type( obj ) !== "object" || obj.nodeType || aQuery.isWindow( obj ) ) {
				return false;
			}
			try {
				if ( obj.constructor &&
						!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}
			} catch ( e ) {
				return false;
			}
			return true;
		},
		isEmptyObject:function(obj){
			var name;
			for(name in obj){
				return false;
			}
			return true;
		},
		parseHTML: function( data, context, keepScripts ) {
			if ( !data || typeof data !== "string" ) {
				return null;
			}
			if ( typeof context === "boolean" ) {
				keepScripts = context;
				context = false;
			}
			context = context || document;

			var parsed = rsingleTag.exec( data ),
				scripts = !keepScripts && [];

			// Single tag
			if ( parsed ) {
				return [ context.createElement( parsed[1] ) ];
			}

			parsed = aQuery.buildFragment( [ data ], context, scripts );

			if ( scripts ) {
				aQuery( scripts ).remove();
			}

			return aQuery.merge( [], parsed.childNodes );
		},
		parseJson:JSON.parse,
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArraylike( Object(arr) ) ) {
					aQuery.merge( ret,typeof arr === "string" ?[ arr ] : arr);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},
		merge: function( first, second ) {
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
		each:function(obj,callback){
			if(obj==null){return;}
			var len=obj.length,
				i=0,
				isArray = isArraylike( obj );
			if(isArray){
				for(;i<len;i++){
					callback.call(obj[i],obj[i],i);
				}
			}else{
				for(i in obj){
					callback.call(obj[i],obj[i],i);
				}
			}
		},
		buildFragment: function( elems, context, scripts, selection ) {
			var elem, tmp, tag, wrap, contains, j,
				i = 0,
				l = elems.length,
				fragment = context.createDocumentFragment(),
				nodes = [];

			for ( ; i < l; i++ ) {
				elem = elems[ i ];

				if ( elem || elem === 0 ) {

					// Add nodes directly
					if ( aQuery.type( elem ) === "object" ) {
						// Support: QtWebKit
						// aQuery.merge because core_push.apply(_, arraylike) throws
						aQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

					// Convert non-html into a text node
					} else if ( !rhtml.test( elem ) ) {
						nodes.push( context.createTextNode( elem ) );

					// Convert html into DOM nodes
					} else {
						tmp = tmp || fragment.appendChild( context.createElement("div") );

						// Deserialize a standard representation
						tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
						wrap = wrapMap[ tag ] || wrapMap._default;
						tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

						// Descend through wrappers to the right content
						j = wrap[ 0 ];
						while ( j-- ) {
							tmp = tmp.lastChild;
						}

						// Support: QtWebKit
						// aQuery.merge because core_push.apply(_, arraylike) throws
						aQuery.merge( nodes, tmp.childNodes );

						// Remember the top-level container
						tmp = fragment.firstChild;

						// Fixes #12346
						// Support: Webkit, IE
						tmp.textContent = "";
					}
				}
			}

			// Remove wrapper from fragment
			fragment.textContent = "";

			i = 0;
			while ( (elem = nodes[ i++ ]) ) {

				// #4087 - If origin and destination elements are the same, and this is
				// that element, do not do anything
				if ( selection && aQuery.inArray( elem, selection ) !== -1 ) {
					continue;
				}

				contains = aQuery.contains( elem.ownerDocument, elem );

				// Append to fragment
				tmp = getAll( fragment.appendChild( elem ), "script" );

				// Preserve script evaluation history
				if ( contains ) {
					setGlobalEval( tmp );
				}

				// Capture executables
				if ( scripts ) {
					j = 0;
					while ( (elem = tmp[ j++ ]) ) {
						if ( rscriptType.test( elem.type || "" ) ) {
							scripts.push( elem );
						}
					}
				}
			}

			return fragment;
		}
	});

rootaQuery = aQuery(document);
// Populate the class2type map
aQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(name,i) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = aQuery.type( obj );

	if ( aQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	module.exports = aQuery;
} else {
	if ( typeof define === "function" && define.amd ) {
		define( "aquery", [], function () { return aQuery; } );
	}
}

if ( typeof window === "object" && typeof window.document === "object" ) {
	window.aQuery = window.$ = aQuery;
}

}(window));