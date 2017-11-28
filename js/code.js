/**
 * Created with sublime text.
 * User: Jeff Zhong
 * Date: 14-12-27
 * Time: 下午8:38
 */
        // 观察者模式，发布订阅
        function Observer(){
            this.events={};
        }

        Observer.prototype={
            bind:function(name,fn){
                var events=this.events;
                events[name]=events[name]||[];
                events[name].push(fn);
            },
            unbind:function(name,fn){
                var events=this.events,
                    index=-1;
                if(events[name]&&(index=events[name].indexOf(fn))>-1){
                    events[name].splice(index,1);
                }
            },
            one:function(name,fn){
                var self=this;
                self.add(name,function(){
                    fn.apply(this,[].slice.call(arguments));
                    self.unbind(name,arguments.callee);
                });
            },
            fire:function(){
                var events=this.events,
                    args=Array.prototype.slice.call(arguments),
                    name=args[0];
                if(events[name]){
                    events[name].forEach(function(fn,i){
                        fn.apply(this,args.slice(1));
                    });
                }
            }
        };

    /**
     * [ieRGBA description]
     * @param    {Number}                 rr 
     * @param    {Number}                 gg 
     * @param    {Number}                 bb 
     * @param    {Number}                 aa 
     * @return   {String}                 #AARRGGBB (Hex String)
     * 比如#ffffff半透明：
     * ieRGBA(255,255,255,0.5)
     * 生成"#7FFFFFFF"
     */
    function ieRGBA(rr, gg, bb, aa) {
      'use strict';
      return '#' + [
        parseInt(aa * 255, 10).toString(16),
        ('00' + (rr).toString(16)).slice(-2),
        ('00' + (gg).toString(16)).slice(-2),
        ('00' + (bb).toString(16)).slice(-2)
      ].join('').toUpperCase();
    }


	/**
	 * head添加css样式
	 */
	var addCssRule = function() {
	  // 创建一个 style， 返回其 stylesheet 对象
	  // 注意：IE6/7/8中使用 style.stylesheet/addRule，其它浏览器 style.sheet/insertRule
	  var sheet=function() {
	    var head = document.head || document.getElementsByTagName('head')[0];
	    var style = document.createElement('style');
	    style.type = 'text/css';
	    head.appendChild(style);
	    return style.sheet;
	    // return style.sheet||style.stylesheet;//ie
	  }();
	  // 返回接口函数
	  return function(cssText) {
	    var cssRules=cssText.split('\r\n');
	    var len=!!sheet.cssRules?sheet.cssRules.length:0;
	    for(var i=0;i<cssRules.length;i++){
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
	 * 返回浏览器特有css前缀
	 */
	var webkit=function(){
	    var css3_div=document.createElement("div");
	    css3_div.style.cssText='-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
	    if(css3_div.style.webkitTransition){
	        return '-webkit-';
	    }else if(css3_div.style.MozTransition){
	        return '-moz-';
	    }else if(css3_div.style.oTransition){
	        return '-o-';
	    }else if(css3_div.style.msTransition){
	        return '-ms-';
	    }else{
	        return '';
	    }
	}();

    /**
     * 获取animationend名称
     */
	var animationend=function(){
        switch(webkit){
            case '-webkit-':return 'webkitAnimationEnd';
            case '-ms-':return 'MSAnimationEnd';
            case '-o-':return 'oAnimationEnd';
            default:return 'animationend';
        }
    }();

    var transition=function(){
        var transitionEnd=(function(){
            var el=document.createElement('bootstrap'),
                transEndEventName={
                    'WebkitTransition' : 'webkitTransitionEnd',
                    'MozTransition'    : 'transitionend',
                    'OTransition'      : 'oTransitionEnd otransitionend',
                    'transition'       : 'transitionend'
                };
                for(var name in transEndEventName){
                    if(el.style[name]!==undefined){
                        return transEndEventName[name];
                    }
                }
        })();
        return transitionEnd&&{end:transitionEnd}
    }();

	 /**
     * 获取url参数
     * @param    {String}                 search url/search
     * @return   {Object}                 {a:1,b:2}
     */
    function getUrlParam(url){
    	var search=url||location.search,
    		reg=new RegExp('([^\\?\\&\\=]+)\\=([^\\?\\&\\=]*)','g'),
    		match=null,
    		ret={};

    	while((match=reg.exec(search))){
    		ret[match[1]]=decodeURIComponent(match[2]);
    	}
    	return ret;
    }

    /**
     * 字符串格式化
     * 用法 stringFormat('xx{a}xx{b}xx',{a:1,b:2}) 或者 stringFormat('xx{0}xx{1}xx','aa','bb')
     * @return   {String}                 格式化的字符串
     */
    function stringFormat(){
    	var len=arguments.length;
    	if(!len) return;
    	if(len==1) return arguments[0];
    	if(typeof arguments[0] !=='string') return arguments[0];

    	var arr=[].slice.call(arguments),
    		target=arr.shift(),
    		i=0,item;
		len=arr.length;

    	return target.replace(/\{([^{}]+)\}/gm,function(match,name){
			if(typeof (item=arr[i]) == 'object'){
				if(name in item){
					return item[name];
				} else {
					return match;
				}
			} else {
				i=parseInt(name,10);
				if(!isNaN(i) && arr[i] != undefined){
					return arr[i];
				} else {
					return match;
				}
			}
    	});
    }


(function(){
    // #region 给原型添加方法
    //给String附加trim方法
    if(!String.trim){
        String.prototype.trim=function () {
            return this.replace(/^\s+|\s+$/g,'');
        }
    }

    /**
    * 时间格式化
    * @param    {String}                 format 格式
    * @param    {String}                 loc 中英文
    *   var d=new Date();
		console.log(d.toString());    //2012-7-27 9:26:52
		console.log(d.toString(""));    //2012-7-27 9:26:52
		console.log(d.toString("yyyy-MM-dd HH:mm:ss"));    //2012-07-27 09:26:52
		console.log(d.toString("yyyy年MM月dd日 HH:mm:ss"));    //2012年07月27日 09:26:52
		console.log(d.toString("yyyy-MM-dd HH:mm:ss fff"));    //2012-07-27 09:26:52 237
		console.log(d.toString("yyyy年 MMM dd EEE"));    //2012年 七月 27 星期五
		console.log(d.toString("yyyy MMM dd EEE","en"));    //2012 Jul 27 Fri
    */
    if(!Date.ToString){
        Date.prototype.ToString= function(format,loc){
            var time={};
            time.Year= this.getFullYear();
            time.TYear=( ""+time.Year).substr(2);
            time.Month= this.getMonth()+1;
            time.TMonth=time.Month<10? "0"+time.Month:time.Month;
            time.Day= this.getDate();
            time.TDay=time.Day<10? "0"+time.Day:time.Day;
            time.Hour= this.getHours();
            time.THour=time.Hour<10? "0"+time.Hour:time.Hour;
            time.hour=time.Hour<13?time.Hour:time.Hour-12;
            time.Thour=time.hour<10? "0"+time.hour:time.hour;
            time.Minute= this.getMinutes();
            time.TMinute=time.Minute<10? "0"+time.Minute:time.Minute;
            time.Second= this.getSeconds();
            time.TSecond=time.Second<10? "0"+time.Second:time.Second;
            time.Millisecond= this.getMilliseconds();
            time.Week= this.getDay();

            var MMMArrEn=["Jan" ,"Feb", "Mar","Apr" ,"May", "Jun","Jul" ,"Aug", "Sep","Oct" ,"Nov", "Dec"];
            var MMMArr=["一月" ,"二月", "三月","四月" ,"五月", "六月","七月" ,"八月", "九月","十月" ,"十一月","十二月" ];
            var WeekArrEn=["Sun" ,"Mon", "Tue","Web" ,"Thu", "Fri","Sat" ];
            var WeekArr=["星期日" ,"星期一","星期二" ,"星期三","星期四" ,"星期五","星期六" ];

            var oNumber=time.Millisecond/1000;

            if(format!=undefined && format.replace(/\s/g,"").length>0){
                if(loc!=undefined && loc =="en" ){
                    MMMArr=MMMArrEn.slice(0);
                    WeekArr=WeekArrEn.slice(0);
                }
                format=format
                    .replace(/yyyy/ig,time.Year)
                    .replace(/yyy/ig,time.Year)
                    .replace(/yy/ig,time.TYear)
                    .replace(/y/ig,time.TYear)
                    .replace(/MMM/g,MMMArr[time.Month-1])
                    .replace(/MM/g,time.TMonth)
                    .replace(/M/g,time.Month)
                    .replace(/dd/ig,time.TDay)
                    .replace(/d/ig,time.Day)
                    .replace(/HH/g,time.THour)
                    .replace(/H/g,time.Hour)
                    .replace(/hh/g,time.Thour)
                    .replace(/h/g,time.hour)
                    .replace(/mm/g,time.TMinute)
                    .replace(/m/g,time.Minute)
                    .replace(/ss/ig,time.TSecond)
                    .replace(/s/ig,time.Second)
                    .replace(/fff/ig,time.Millisecond)
                    .replace(/ff/ig,oNumber.toFixed(2)*100)
                    .replace(/f/ig,oNumber.toFixed(1)*10)
                    .replace(/EEE/g,WeekArr[time.Week]);
            }
            else{
                format=time.Year+ "-"+time.Month+"-" +time.Day+" "+time.Hour+ ":"+time.Minute+":" +time.Second;
            }
            return format;
        }
    }
    // #endregion

    //建立命名空间对应的对象
    function namespace(ns){
        var parts=ns.split("."),
            obj=this,
            i,len;

        for(i=0,len=parts.length;i<len;i++){
            if(!obj[parts[i]]){
                obj[parts[i]]={};
            }
            obj=obj[parts[i]];
        }
        return obj;
    }
/*        $:function(){
            var elements=[], i,len;
            for(i=0,len=arguments.length;i<len;i++ ){
                var element=elements[i];
                if(typeof element==='String'){
                    element=document.getElementById(element);
                }
                if(arguments.length===1){
                    return element;
                }
                elements.push(element);
            }
            return elements;
        },*/

    var MyLib={
        //当前浏览器是否与库兼容
        isCompatible:function (other){
            if(other === false ||
                !Array.prototype.push ||
                !Object.hasOwnProperty ||
                !document.createElement ||
                !document.getElementsByTagName) {
                return false;
            }
            return true;
        },
        //添加事件
        addEvent:function (node, type, fn){
            //if(!(node=$(node))){return false;}
            if(node.addEventListener){
                node.addEventListener(type,fn, false);
            } else if (node.attachEvent){
                node['e'+type+fn]=fn;
                node[type+fn]=function(){node['e'+type+fn](window.event);}
                node.attachEvent( "on"+type,node[type+fn]);
            } else{
                node["on"+type]=fn;
            }
            return true;
        },
        //移除事件
        removeEvent:function (node, type, fn){
            //if(!(node=$(node))){return false;}
            if(node.removeEventListener){
                node.removeEventListener(type,fn,false);
                return true;
            }
            else if(node.detachEvent){
                node.detachEvent('on'+type,node[type+fn]);
                node[type+fn]=null;
                return true;
            }
            else{
                node["on"+type]=null;
            }
            return false;
        },
        //根据ClassName获取元素
        getElementsByClassName:function (className,tag,parent){
            parent=parent||document;
            tag=tag||'*';
            //if(!(parent=$(parent))){return false;}
            var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
            var matchElemets=[];
            className=className.replace(/\-/g,"\\-");
            var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");
            var element, i,len;
            for(i=0,len=allTags.length;i<len;i++){
                element=allTags[i];
                if(regex.test(element.className)){
                    matchElemets.push(element);
                }
            }
            return matchElemets;
        },
        toggleDisplay:function (node,value){
            if(node.style.display!='none'){
                node.style.display='none';
            }
            else{
                node.style.display=value||'';
            }
            return true;
        },
        //在node之后插入节点(insertBefore是之前插入)
        insertAfter:function (node,referenceNode){
            //if(!(node=$(node))){return false;}
            //if(!(referenceNode=$(referenceNode))){return false;}
            return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
        },
        //清空该节点下的子节点
        removeChildren:function (parent){
            // parent.innerHTML='';
            while(parent.firstChild){
                parent.firstChild.parentNode.removeChild(parent.firstChild);
            }
            return true;
        },
        //从开头开始插入子节点(appendChild是从尾部开始插入)
        prependChild:function (parent,newChild){
            //if(!(parent=$(parent))){return false;}
            //if(!(newChild=$(newChild))){return false;}
            if(parent.firstChild){
                parent.insertBefore(newChild,parent.firstChild);
            }else{
                parent.appendChild(newChild);
            }
            return parent;
        },
        //遍历节点,并执行函数func(非递归)
        walkElementsLinear:function(func,node){
            var root=node||window.document;
            var nodes=root.getElementsByTagName('*'),
                i,len=nodes.length;
            for(i=0;i<len;i++){
                func.call(nodes[i]);
            }
        },
        //递归方式,跟踪节点深度
        walkTheDOMRecursive:function(func,node,depth){
            var root=node||window.document;
            func.call(root,depth++,returnedFromParent);
            node=root.firstChild;
            while(node){
                walkTheDOMRecursive(func,node,depth);
                node=node.nextSibling;
            }
        },
        //同时查找每个节点的属性
        walkTheDOMWithAttributes:function(node,func,depth,returnedFromParent){
            var root=node||window.document;
            returnedFromParent=func(root,depth++,returnedFromParent);
            if(root.attributes){
                for(var i=0;i<attributes.length;i++){
                    walkTheDOMWithAttributes(root.attributes[i],func,depth-1,returnedFromParent);
                }
            }
            if(root.nodeType!=MyLib.node.ATTRIBUTE_NODE){
                node=root.firstChild;
                while(node){
                    walkTheDOMWithAttributes(node,func,depth,returnedFromParent);
                    node=node.nextSibling;
                }
            }
        },
        //转换为n位小数
        roundTo:function (num, n) {
            var f = parseFloat(num);
            if (isNaN(f)) {
                return '';
            }
            var m = Math.pow(10, n);
            f = Math.round(f * m) / m;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + n) {
                s += '0';
            }
            return s;
        },
        //获取浏览器高和宽
        getBrowserWinSize:function(){
            var de=document.documentElement;
            return {
              'width':(window.innerWidth||(de&&de.clientWidth)||document.body.clientWidth),
              'height':(window.innerHeight||(de&&de.clientHeight)||document.body.clientHeight)
            };
        },
        //绑定事件
        bindFunction:function(obj,func){
            return function(){
                func.apply(obj,arguments);
            };
        },
        //JavaScript判断浏览器类型及主版本
        getBrowserInfo:function (){
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            if (window.ActiveXObject){
                Sys.browser="ie";
                Sys.version =parseInt(ua.match(/msie ([\d.]+)/)[1]);
            }
            else if (document.getBoxObjectFor){
                Sys.browser="firefox";
                Sys.version =parseInt(ua.match(/firefox\/([\d.]+)/)[1]);
            }
            else if (window.MessageEvent && !document.getBoxObjectFor){
                Sys.browser="chrome";
                Sys.version == parseInt(ua.match(/chrome\/([\d.]+)/)[1]);
            }
            else if (window.opera){
                Sys.browser="opera";
                Sys.version == parseInt(ua.match(/opera.([\d.]+)/)[1]);
            }
            else if (window.openDatabase){
                Sys.browser="safari";
                Sys.version == parseInt(ua.match(/version\/([\d.]+)/)[1]);
            }
            return Sys;
        },
        //url添加时间
        urlAddTime:function (url) {
            if (!url) { return ''; }
            if (url.indexOf("?")<0) {
                url += '?time=' +new Date().getTime();
            }
            else {
                url += '&time=' +new Date().getTime();
            }
            return url;
        },
        //增强版取URL中的参数
        getUrlParams:function (url) {
	    	var search=decodeURIComponent(url||location.search),
	    		reg=new RegExp('([^\\?\\&\\=]+)\\=([^\\?\\&\\=]*)','g'),
	    		match=null,
	    		ret={};

	    	while((match=reg.exec(search))){
	    		ret[match[1]]=match[2];
	    	}
	    	return ret;
        },
        //取URL中的参数
        getUrlParamByName:function (name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        },
        //通过原型继承 继承父对象
	    inherits:function (child,parent){
			var f=function(){};
			f.prototype=parent.prototype;
			child.prototype=new f();
			child.prototype.constructor=child;//注意修正constructor
		},
        //从parent继承
        extend:function (child, parent){
            var f=function(){};
            child.prototype=new f();
            child.prototype.constructor=child;
            child.parent=parent.prototype;
            if(parent.prototype.constructor==Object.prototype.constructor){
                parent.prototype.constructor=parent;
            }
        },
        //JavaScript中克隆对象
        cloneObj:function (obj) {
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;
            var copy;
            // Handle Date
            if (obj instanceof Date) {
                copy= new Date();
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
        },
        // // 深度克隆对象
        // extend:function(){
        //     var args=arguments,
        //         len=args.length,
        //         target=args[0],
        //         isArr=false,
        //         options,copy,name;

        //     if(len<=1){ return target;}

        //     for(var i=0;i<len;i++){
        //         if((options=args[i])!=null){
        //             for(name in options){
        //                 copy=options[name];
        //                 if((isArr=isArray(copy))||isObject(copy)){
        //                     if(isArr){
        //                         target[name]=target[name]||[];
        //                     } else {
        //                         target[name]=target[name]||{};
        //                     }
        //                     target[name]=extend(target[name],copy);
        //                 } else {
        //                     target[name]=copy;
        //                 }
        //             }
        //         }   
        //     }
        //     return target;
        // },

        //检测是否为Array
        isArray:function (value){
            if(typeof Array.isArray==='function'){
                return Array.isArray(value);
            }else{
                return Object.prototype.toString.call(value)==="[object Array]";
            }
        },
        //密码必须包含数字,字母,符号
        checkPassword:function (val) {
            var rega = /[a-zA-Z]+/;
            var regb = /\d+/;
            var regc = /[\W\_]+/;
            if (rega.test(val) && regb.test(val) && regc.test(val)) {
                return true;
            }
            return false;
        },
        //Object转换为json
        objToJson:function (o){
            function getVal(obj){
                var val='';
                var type=typeof obj;
                switch (type){
                    case 'string':val='"'+obj+'"';break;
                    case 'number':val=obj;break;
                    case 'boolean':val=obj;break;
                    case 'object':val=toJson(obj);break;
                    default :break;
                }
                return val;
            }
            function f(n) {
                // Format integers to have at least two digits.
                return n < 10 ? '0' + n : n;
            }
            function toJson(obj){
                var json='';
                if(typeof obj!='object'){return json;}
                var i,len,v,arr=[];
                if(obj instanceof Array){
                    for(i=0,len=obj.length;i<len;i++){
                        arr.push(getVal(obj[i]));
                    }
                    arr.join(',');
                    json='['+arr.join(',')+']';
                } else if(obj instanceof Date){
                    json= isFinite(obj.valueOf())
                        ? obj.getUTCFullYear()     + '-' +
                        f(obj.getUTCMonth() + 1) + '-' +
                        f(obj.getUTCDate())      + 'T' +
                        f(obj.getUTCHours())    + ':' +
                        f(obj.getUTCMinutes())   + ':' +
                        f(obj.getUTCSeconds())   +'.'+
                        obj.getUTCMilliseconds()+ 'Z'
                        : null;
                } else{
                    for(var v in obj){
                        arr.push('"'+v+'":'+getVal(obj[v]));
                    }
                    json= '{'+arr.join(',')+'}';
                }
                return json;
            }
        return toJson(o);
    },
    //原生ajax
    ajax:function (url,param,isPost,async) {
        if(!url||!param){return;}
        if(typeof url!='string'||typeof param!='string'){return;}
        async=(async&&async===true)?true:false;
        var xmlhttp=null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP" );
        }
        else {
            throw new Error( "创建xmlhttp对象异常" );
        }
        var method=(isPost&&isPost==true)?'POST':'GET';
        if(method=='GET'){
            url=encodeURI(url)+'?' +encodeURIComponent(param);
        }
        var postParam=method==='POST'?param:null;
        xmlhttp.open( method, url, async );
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {//服务器完成
                if (xmlhttp.status == 200) {//如果状态码为200则成功|
                   return xmlhttp.responseText; //responseText属性为服务器返回的文本
                }
                else {
                    throw new Error( "Ajax服务器返回错误!" );
                }
            }
        }
        xmlhttp.send(postParam); //这时才开始发送请求
    },
        //原生jsonp
    getJsonp:function(url, callback) {
        if (url.indexOf("?" ) > -1) {
            url += "&callback=" + callback;
        }
        else {
            url += "?callback=" + callback;
        }
        url += "&nocache=" + new Date().getTime(); // prevent caching
        var script = document.createElement("script" );
        script.setAttribute( "src", url);
        script.setAttribute( "type", "text/javascript" );
        script.setAttribute( "charset", "utf-8" );
        document.getElementsByTagName( 'head')[0].appendChild(script);
    },
    //按指定的次数重复字符串
    repeat:function(str,counts){
        return new Array(counts+1).join(str);
    },
    //将word-word转为wordWord
    camelize:function(s){
        return s.replace(/\-(\w)/g,function(strMatch,p1){
            return p1.toUpperCase();
        });
    },
    //将wordWord转为word-word
    uncamelize:function(s){
        return s.replace(/[A-Z]/g, '-$&').toLowerCase();
    },
    //事件对象
    getEventObj:function(evt){
        return evt||window.event;
    },
    //事件的目标对象
    getTarget:function(evt){
        var event=evt||window.event;
        var target=event.target||event.srcElement;
        if(target.nodeType==MyLib.node.TEXT_NODE){//safari
            target=node.parentNode;
        }
        return target;
    },
    //阻止冒泡
    stopPropagation:function(evt){
        var event=evt||window.event;
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    },
    //取消默认行为
    preventDefault:function(evt){
        var event=evt||window.event;
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    //鼠标位置
    getPointerPos:function(evt){
        var event=evt||window.event;
        var x=event.pageX||(event.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
        var y=event.pageY||(event.clientY+(document.documentElement.scrollTop||document.body.scrollTop));
        return{'x':x,'y':y};
    },
    //访问键盘命令
    getKeyPressed:function(evt){
        var event=evt||window.event;
        var code=event.keyCode;
        var value=String.fromCharCode(code);
        return {'code':code,'value':value};
    },
    //确定单击了哪几个鼠标键
    getMouseButton:function(evt){
        var event=evt||window.event;
        var buttons={'left':false,'middle':false,'right':false};
        if(event.toString&&event.toString().indexOf('MouseEvent')!=-1){
            switch (event.button){
                case 0:buttons.left=true;break;
                case 1:buttons.middle=true;break;
                case 2:buttons.right=true;break;
                default :break;
            }
        }
        else if(event.button){//ie
            switch (event.button){
                case 1:buttons.left=true;break;
                case 2:buttons.right=true;break;
                case 3:buttons.left=true;buttons.right=true;break;
                case 4:buttons.middle=true;break;
                case 5:buttons.left=true;buttons.middle=true;break;
                case 6:buttons.right=true;buttons.middle=true;break;
                case 7:buttons.left=true;buttons.middle=true;buttons.right=true;break;
                default :break;
            }
        }else{return false;}
        return buttons;
    },
    //dom ready 加载回调
	domReady:function (callback){
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
	//script加载完成后执行回调
	loadScript:function (url,callback){
	    var script = document.createElement("script");
	    script.type="text/javascript";
	    if(script.readyState){ //ie
	        script.onreadystatechange = function(){
	            if(script.readyState =="loaded" || script.readyState =="complete"){
	                callback();
	            }
	    	}
	    } else { //其他浏览器
	        script.onload = function(){
	            callback();
	        }
	    }
	    script.src=url;
	    document.getElementsByTagName("head")[0].appendChild(script);
	},
    //通过id修改元素样式
    setStylesById:function(element,styles){
        if(!element){return false;}
        element=typeof element=='string'?document.getElementById(element):element;
        var prop;
        for(prop in styles){
            if(!styles.hasOwnProperty(prop)){continue;}
            if(element.style.setProperty){
                element.style.setProperty(this.uncamelize(prop,'-'),styles[prop],null);
            }else{
                element.style[this.camelize(prop)]=styles[prop];
            }
        }
        return true;
    },
    //通过class修改多个样式属性
    setStylesByClassName:function(parent,tag,className,styles){
        var eles=this.getElementsByClassName(className,tag,parent),
            len=eles.length,
            i;
        for(i=0;i<len;i++){
            this.setStylesById(ele[i],styles);
        }
        return true;
    },
    //通过tag修改多个样式属性
    setStylesByTagName:function(tagName,styles,parent){
        parent=parent||document;
        var eles=document.getElementsByTagName(tagName),
            len=eles.length,
            i;
        for(i=0;i<len;i++){
            this.setStylesById(eles[i],styles);
        }
        return true;
    },
    //获取元素的class名属性
    getClassNames:function(element){
        return element.className.replace(/\s+/,' ').split(' ');
    },
    //是否存在某个className
    hasClassName:function(element,className){
        var classes=this.getClassNames(element),
            len=classes.length,
            i;
        for(i=0;i<len;i++){
            if(classes[i]==className){
                return true;
            }
        }
        return false;
    },
    //为元素添加class
    addClassName:function(element,className){
        element.className+=(element.className?' ':'')+className;
        return  true;
    },
    //删除元素的某个class
    removeClassName:function(element,className){
        var classes=this.getClassNames(element),
            len=classes.length,
            i;
        for(i=len-1;i>=0;i--){
            if(classes[i]===className){
                classes.splice(i,1);
            }
        }
        element.className=classes.join(',');
        return len==classes.length?false:true;
    },
    //toggleclass
    toggleClassName:function(element,className){
        if(this.hasClassName(element,className)){
            this.addClassName(element,className);
        }
        else{
            this.removeClassName(element,className);
        }
    },
    //通过url获取包含样式的数组
    getStyleSheets:function(url,media){
        var sheets=[],len=document.styleSheets.length,i;
        for(i=0;i<len;i++){
            if(url&&document.styleSheets[i].href.indexOf(url)==-1){
                continue;
            }
            if(media){
                media=media.replace(/,\s*/,',');
                var sheetMedia;
                if(document.styleSheets[i].media.mediaText){
                    //dom
                    sheetMedia=document.styleSheets[i].media.mediaText.replace(/,\s*/,',');
                    //safari会添加额外的逗号和空格
                    sheetMedia=sheetMedia.replace(/,\s*$/,',');
                } else {
                    //ie
                    sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
                }
                if(media!=sheetMedia){continue;}
            }
            return sheets;
        }
    },
    //编辑一条样式规则
    editCSSRule:function(selector,styles,url,media){
        var styleSheets=(typeof url=='array'?url:this.getStyleSheets(url,media)),
            len=styleSheets.length,i;
        for(i=0;i<len;i++){
            var rules=styleSheets[i].cssRules||styleSheets[i].rules;
            if(!rules){continue;}
            selector=selector.toUpperCase(),
            jl=rules.length,j;
            for(j=0;j<jl;j++){
                if(rules[j].selectText.toUpperCase()==selector){
                    for(var prop in styles){
                        if(prop in styles){
                            if(!styles.hasOwnProperty(prop)){continue;}
                            rules[j].style[this.camelize(prop)]=styles[prop];
                        }
                    }
                }
            }
        }
    },
    //添加一条CSS规则
    addCSSRule:function(selector,styles,index,url,media){
        var declartion='',prop;
        for(prop in styles){
            if(!styles.hasOwnProperty(prop)){continue;}
            declartion+=prop+':'+styles[prop]+';';
        }
        var styleSheets=(typeof url=='array'?url:this.getStyleSheets(url,media));
        var newIndex, i,len=styleSheets.length;
        for(i=0;i<len;i++){
            if(styleSheets[i].insertRule){
                newIndex=(index>=0?index:styleSheets[i].cssRules.length);
                styleSheets[i].insertRule(selector+'{'+declartion+'}',newIndex);
            }else if(styleSheets[i].addRule){
                newIndex=(index>=0?index:-1);
                styleSheets[i].addRule(selector,declartion,newIndex);
            }
        }
    },
    //取得一个样式的计算样式
    getStyle:function(element,prop){
        if(!prop){return false;}
        var value=element.style[this.camelize(prop)];
        if(!value){
            if(document.defaultView&&document.defaultView.getComputedStyle){
                var css=document.defaultView.getComputedStyle(element,null);
                value=css?css.getPropertyValue(prop):null;
            }else if(element.currentStyle){
                value=element.currentStyle[this.camelize(prop)];
            }
        }
        return value='auto'?'':value;
    }
    //产生随机数
    getRandomVal:function(val){
        return Math.floor(Math.random()*(val+1));
    },
    //产生十六进制颜色
    getRandomColor:function(){
        var str=Math.ceil(Math.random()*16777215).toString(16);
        while(str.length<6){
            str='0'+str;
        }
        return str;
    }
};
    window.MyLib=MyLib;

    function walkTheDOMRecursive(func,node,depth,returnedFromParent){
        var root=node||window.document;
        returnedFromParent=func.call(root,depth++,returnedFromParent);
        node=root.firstChild;
        while(node){
            walkTheDOMRecursive(func,node,depth,returnedFromParent);
            node=node.nextSibling;
        }
    }
    MyLib.walkTheDOMRecursive=walkTheDOMRecursive;
    function MyLoggor(id){
        id=id||'ADSLogWindow';
        var logWindow=null;
        var createWindow=function(){
            var browserWinSize=MyLib.getBrowserWinSize();
            var top=((browserWinSize.height-200)/2)||0;
            var left=((browserWinSize.width-200)/2)||0;
            logWindow=document.createElement('UL');
            logWindow.setAttribute('id',id);
            logWindow.style.position='absolute';
            logWindow.style.left=left+'px';
            logWindow.style.top=top+'px';
            logWindow.style.width='200px';
            logWindow.style.height='200px';
            logWindow.style.overflow='scroll';

            logWindow.style.padding='0';
            logWindow.style.margin='0';
            logWindow.style.border='1px solid black';
            logWindow.style.backgroundColor='white';
            logWindow.style.listStyle='none';
            logWindow.style.font='10px/10px Verdana, Tahoma, Sans';

            document.body.appendChild(logWindow);
        };
        this.writeRaw=function(message){
            if(!logWindow){createWindow();}
            var li=document.createElement('LI');
            li.style.padding='2px';
            li.style.border='0';
            li.style.borderBottom='1px dotted black';
            li.style.margin='0';
            li.style.color='#000';
            li.style.font='9px/9px Verdana, Tahoma, Sans';
            if(typeof message=='undefined'){
                li.appendChild(document.createTextNode('Message was undefined'));
            }else if(typeof li.innerHTML!=undefined){
                li.innerHTML=message;
            }else{
                li.appendChild(document.createTextNode(message));
            }
            logWindow.appendChild(li);
            return true;
        };
    }
    MyLoggor.prototype={
        write:function(message){
            if(typeof message=='string'&&message.length==0){
                return this.writeRaw('MyLib.log: null message');
            }
            if(typeof message!='string'){
                if(message.toString){return this.writeRaw(message.toString());}
                else{
                    return this.writeRaw(typeof message);
                }
            }
            message=message.replace(/</g,"&lt;").replace(/>/g,"&gt;");
            return this.writeRaw(message);
        },
        header:function(message){
            message='<span style="color:#ffffff;background-color: #000000;font-weight: bold;padding: 0px 5px;">'+message+'</span>';
            return this.writeRaw(message);
        }
    };
    MyLib.log=new MyLoggor();

    //JavaScript中base64编码
    var Base64 = {
        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },
        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },
        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    };
    MyLib.Base64=Base64;

    MyLib.node={
        ELEMENT_NODE:1,
        ATTRIBUTE_NODE:2,
        TEXT_NODE:3,
        CDATA_SECTION_NODE:4,
        ENTITY_REFFERENCE_NODE:5,
        ENTITY_NODE:6,
        PROCESSING_INSTRUCTION_NODE:7,
        COMMENT_NODE:8,
        DOCUMENT_NODE:9,
        DOCUMENT_TYPE_NODE:10,
        DOCUMENT_FRAGMENT_NODE:11,
        NOTATION_NODE:12
    };
    function encode(str){
        if(!str){return null;}
        str=str.replace(/\\/g,'\\\\').replace(/';/g,"\\'").replace(/\s+^/mg,"\\n");
        return str;
    }
    function checkForVariable(v){
        if(v.indexOf('$')==-1){
            v='\''+v+'\'';
        }else{//ie会添加锚的完整路径,故需要取得该字符串从$到结尾处的子字符串
            v= v.substring(v.indexOf('$')+1);
            requiredVariables+='var '+v+';\n';
        }
        return v;
    }
    var domCode='';
    var nodeNameCounters=[];
    var requiredVariables='';
    var newVariables='';
    function generate(strHtml,strRoot){
        var domRoot=document.createElement('DIV');
        domRoot.innerHTML=strHtml;
        //重置变量
        domCode='';
        nodeNameCounters=[];
        requiredVariables='';
        newVariables='';

        //使用processNode()处理所有节点
        var node=domRoot.firstChild;
        while(node){
            walkTheDOMRecursive(processNode,node,0,strRoot);
            node=node.nextSibling;
        }
        //输出生成的代码
        domCode='/* requiredVariables in this code\n'+requiredVariables+'*/\n\n'+domCode+'\n\n'
            +'/* new objects in this code\n'+newVariables+'*/\n\n';
        return domCode;
    }
    function processNode(tabCount,refParent){
        //根据树的深度级别重复制表符,以便对每一行进行适当的缩进
        var tabs=(tabCount? MyLib.repeat('\t',parseInt(tabCount)):'');
        var ref;
        //确定节点类型并处理元素和文本节点
        switch (this.nodeType){
            case MyLib.node.ELEMENT_NODE:
                //计算器加1 并创建一个使用标签和计数器的值
                if(nodeNameCounters[this.nodeName]){
                    ++nodeNameCounters[this.nodeName];
                }else{
                    nodeNameCounters[this.nodeName]=1;
                }
                ref=this.nodeName.toLocaleLowerCase()+nodeNameCounters[this.nodeName];
                domCode+=tabs+'var '+ref+' = document.createElement(\''+this.nodeName+'\');\n';

                //将新变量添加到列表中以便在结果中报告它们
                newVariables+=''+ref+';\n';
                //检测是否存在属性,如果存在则遍历这些属性,并使用procesAttributes()方法遍历它们的DOM树
                if(this.attributes){
                    var i,len=this.attributes.length;
                    for(i=0;i<len;i++){
                        walkTheDOMRecursive(processAttributes,this.attributes[i],tabCount,ref);
                    }
                }
                break;
            case MyLib.node.TEXT_NODE:
                //检测文本节点中除了空白符之外的值
                var value=(this.nodeValue?encode(this.nodeValue.trim()):'');
                if(value){
                    if(nodeNameCounters['txt']){
                        ++nodeNameCounters['txt'];
                    }
                    else{
                        nodeNameCounters['txt']=1;
                    }
                    ref='txt'+nodeNameCounters['txt'];
                    value=checkForVariable(value);

                    domCode+=tabs+'var '+ref+' = document.createTextNode('+value+');\n';
                    newVariables+=''+ref+';\n';
                }
                else{
                    return;
                }
                break;
            default :break;
        }
        //将这个节点添加到其父节点的代码
        if(refParent){
            domCode+=tabs+refParent+'.appendChild('+ref+');\n';
        }
        return ref;
    }
    function processAttributes(tabCount,refParent){
        //跳过文本节点
        if(this.nodeType!=MyLib.node.ATTRIBUTE_NODE){return;}
        var attrValue=(this.nodeValue?encode(this.nodeValue.trim()):'');
        if(this.nodeName=='cssText'){alert('true');}
        if(!attrValue){return;}
        var tabs=tabCount?MyLib.repeat('\t',parseInt(tabCount)):'';
        switch (this.nodeName){
            default :
                if(this.nodeName.substring(0,2)=='on'){
                    domCode+=tabs+refParent+'.'+this.nodeName+'= function(){'+attrValue+'}\n';
                }else{
                    domCode+=tabs+refParent+'.setAttribute(\''+this.nodeName+'\','+checkForVariable(attrValue)+');\n';
                }
                break;
            case 'class':
                domCode+=tabs+refParent+'.className='+checkForVariable(attrValue)+';\n';
                break;
            case 'style':
                var style=attrValue.split(/\s*;\s*/g);
                if(style){
                    for(pair in style){
                        if(!style[pair]){continue;}
                        var prop=style[pair].split(/\s*:\s*/);
                        if(!prop[1]){continue;}

                        prop[0]=MyLib.camelize(prop[0]);

                        var propValue=checkForVariable(prop[1]);
                        if(prop[0]=='float'){
                            //float是保留字,属特殊情况
                            domCode+=tabs+refParent+'.style.cssFloat='+propValue+';\n';
                            domCode+=tabs+refParent+'.style.styleFloat='+propValue+';\n';
                        }else{
                            domCode+=tabs+refParent+'.style.'+prop[0]+'='+propValue+';\n';
                        }
                    }
                }
                break;
        }
    }
    window.generateDOM=generate;

}());