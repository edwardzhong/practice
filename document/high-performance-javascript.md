###第一章 加载和运行

######1.减少 JavaScript 对性能的影响:  
1. 将所有&lt;script&gt;标签放置在页面的底部,紧靠 body 关闭标签&lt;/body&gt;的上方。保证页面在脚本 运行之前完成解析。
1. 合并脚本，将脚本成组打包。页面的&lt;script&gt;标签越少,页面的加载速度就越快,响应也更加迅速。不论外部脚本 文件还是内联代码都是如此。
1. 使用非阻塞方式下载 JavaScript。

######2.非阻塞方式下载js有3种方法：  
1. 为&lt;script&gt;标签添加 defer 属性(只适用于 Internet Explorer 和 Firefox 3.5 以上版本)
2. 动态创建&lt;script&gt;元素,用它下载并执行代码
3. 用 XHR 对象下载代码,并注入到页面中

######3. 动态加载js  
	function loadScript (url,callback){
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
	}
	loadScript("file1.js", function(){
		loadScript("file2.js", function(){
			loadScript("file3.js", function(){
				alert("All files are loaded!");
			});
		});
	});
				
###第二章  数据访问

######1. 在 JavaScript 中,数据存储位置可以对代码整体性能产生重要影响。有四种数据访问类型:直接量,变 量,数组项,对象成员。  

1. 直接量和局部变量访问速度非常快,数组项和对象成员需要更长时间。
1. 局部变量比域外变量快,因为它位于作用域链的第一个对象中。变量在作用域链中的位置越深,访问所需的时间就越长。
1. 全局变量总是最慢的,因为它们总是位于作用域链的最后一环。

######2. 避免使用 with 表达式,因为它改变了运行期上下文的作用域链。同时try-catch 表达式的 catch 子句,也具有同样效果

######3. 嵌套对象成员会造成重大性能影响,尽量少用。嵌套成员： 每次遇到点操作时，导致js引擎搜索所有对象成员。所以location.href比window.location.href要快。


######4. 可以通过这种方法提高 JavaScript 代码的性能:将经常使用的对象成员,数组项,和域外变 量存入局部变量中。然后,访问局部变量的速度会快于那些原始变量。

######5. 闭包的\[\[Scope\]\]属性包含了与运行期上下文作用域相同的对象和引用，激活对象无法被销毁。可能会导致内存泄露。


###第三章 DOM 编程

######减少 DOM 编程中的性能损失,请牢记以下几点:
1. 最小化 DOM 访问,在 JavaScript 端做尽可能多的事情。
2. 在反复访问的地方使用局部变量存放 DOM 引用.
3. 小心地处理 HTML 集合,将集合的 length 属性缓存到一个变量中,在迭代中使用这个变量。如果经常操作这个集合,可以将集合拷贝到数组中。
4. 如果可能的话,使用速度更快的 API,诸如 querySelectorAll()和 firstElementChild。
5. 注意重绘和重排版;批量修改样式,离线操作 DOM 树,缓存并减少对布局信息的访问。
6. 动画中使用绝对坐标。
7. 使用事件代理最小化事件句柄数量。
8. 在所有浏览器中,innerHTML 速度更快一些,除了最新的基于 WebKit 的浏览器(Chrome 和 Safari)。
9. 使用 DOM 方法更新页面内容的另一个途径是克隆已有 DOM 元素,而不是创建新的——即使用 element.cloneNode()
代替 document.createElement();

######HTML集合包括：  
				
	document.getElementsByName();
	document.getElementsByClassName();
	document.getElementsByTagName();
	document.images
	document.links
	document.forms
	document.forms[0].elements

######html集合是类似数组的列表(没有push()或slice()之类的方法所以不是数组)但是能以数字索引的方式访问列表中的元素，还有length属性。
######html集合非常低效，因为它是实时和文档保持一致的，包括访问length属性都会重复执行查询的过程。

######下面表格中建议用第一列的DOM属性  

	性能好的属性名	被替换的属性名
	children		childNodes
	childElementCount		childNodes.length
	firstElementChild		firstChild
	lastElementChild		lastChild
	nextElementSibling		nextSibling
	previousElementSibling		previousSibling

* querySelectorAll方法：可进行组合查询。此种方法反回的是数组对象，不是html集合，因此返回的节点不会对应实时的文档结构，避免了html集合引起的性能问题。

* 浏览器下载完页面以后生成两个结构  DOM树和渲染树(渲染树中的节点称帧frames或盒boxes)
按css模型的定义，页面元素为具有填充(padding)，边距(margins),边框(borders)和位置(position)的盒子。
浏览器显示的顺序：下载页面--构建DOM树和渲染树--显示(绘制paint)页面元素
当DOM的变化影响了元素的几何属性(宽和高),浏览器会使渲染树中受到影响的部分失效，并重新构造渲染树，即重排reflow，重排影响性能。

* 重排在下面情况时会发生：添加或删除可见的DOM元素，元素位置改变，元素尺寸改变，内容改变，页面渲染器初始化，浏览器窗口尺寸改变。

######下面的属性和方法需要返回最新的布局信息，所以会触发重排，在修改样式的过程中，最好避免使用上面列出的属性。
	offsetTop,offsetLeft,offsetWidth,offsetHeigth
	scrollTop,scrollLeft,scrollWidth,scrollHeigth
	clientTop,clientLeft,clientWidth,clientHeigth
	getComputedStyle() //这个是在IE、Opera中

######合并所有的改变最后一次处理，可使用cssText属性实现或改使用class名称：
	var el=document.getElementById("mydiv");
	el.style.cssText="border-left:1px;border-right:2px;padding:5px;";//cssText批量设置样式
	el.className="active";//使用class

#####为了减少改变DOM的次数提高性能，排量修改DOM的三种方案(推荐第二种) ：
######1. 通过改变display属性，临时从文档中移除，做了所有的修改以后再恢复。这样最多只会更改DOM两次。
	var ul=document.getElementById("mylist");
	ul.style.display="none";
	//这里可进行对mylist的任意多次修改
	ul.style.display="block";

######2. 在文档之外更新一个文档片断，然后把它附加到原始列表中。只触发一次重排。
	var fragment=document.createDocumentFragment();
	//这里可进行任意修改
	document.getElementById("mylist").appendChild(fragment);//附加一个片断到节点中时，实际上被添加的是该片断的子结点。

######3. 为需要修改的节点创建一个备份，修改完后再替代旧的节点。
	var old=document.getElementById("mylist");
	var clone=old.cloneNode(true);
	//修改
	old.parentNode.replaceChild(clone,old);


###第四章 算法和流程控制

1. for,while,do-while 循环的性能特性相似,谁也不比谁更快或更慢。

2. 除非你要迭代遍历一个属性未知的对象,否则不要使用 for-in 循环。
改善循环性能的最好办法是减少每次迭代中的运算量,并减少循环迭代次数。

3. 浏览器的调用栈尺寸限制了递归算法在 JavaScript 中的应用;栈溢出错误导致其他代码也不能正常执行。
如果你遇到一个栈溢出错误,将方法修改为一个迭代算法或者使用制表法可以避免重复工作。

###第五章 字符串和正则表达式

######回溯既是正则表达式匹配功能基本的组成部分,又是正则表达式影响效率的常见原因。
######提高正则表达式效率的方法
1. 正则表达式慢的原因通常是匹配失败的过程慢，而不是匹配成功的过程慢。
2. 一个正则表达式的起始标记应当尽可能快速地测试并排除明显不匹配的位置。避免使用分支
3. 尽量少使用分支(竖线|),通过使用字符集和选项组件来减少对分去的需求，或将分支在正则表达式上的位置推后。
4. 具体化，比如想表达[^"\s\n]*时不要使用.*?
5. 使用非捕获组
6. 只捕获感兴趣的文本以减少后处理
7. 暴露必需的字元 例如正则表达式/^(ab|cd)/暴露它的字符串起始锚，而/(^ab|^cd)/没有暴露它的锚^,IE无法应用同样的优化，最终无意义地搜索字符串并在每一个位置上匹配
8. 使用合适的量词，特别是贪婪和惰性量词的匹配过程有较大区别
9. 避免在循环中重复编译正则表达式
10. 将复杂的正则表达式拆分为简单的片断,避免在一个正则表达式中处理太多任务。复杂的搜索问题需要条件逻辑，拆分成两个或多个正则表达式更容易解决。
11. 何时不使用正则表达式。例：/;$/.test(str);会检查每一个字符，直到搜索完整个字符串。此时应该用 str.charAt(str.length-1)==";";字符串方法:charAt,slice,substr,substring,indexOf,lastIndexOf

###第六章 响应接口

######1. JavaScript 和用户界面更新在同一个进程内运行,同一时刻只有其中一个可以运行。这意味着当 JavaScript 代码正在运行时,用户界面不能响应输入,反之亦然。

######2. 有效地管理 UI 线程就是要确保 JavaScript 不能运行太长时间,以免影响用户体验。有一些复杂的js任务不能在100毫秒或更短时间内完成，这个时候就要让出UI线程的控制权停止执行js，使得UI可以更新,然后再继续执行js。

######3. 循环数组时如果数组太长或处理太费时，并且处理过程不需要同步，也不需要按顺序处理，则应该把循环的工作分解到一系列定时器中。

######4. Web Workers
js没有办法在浏览器UI线程之外运行代码 Web Workers API引入了一个接口,能使代码运行且不占用浏览器UI线程的时间.每个新的Worker都在自己的线程中运行代码,不会影响浏览器UI,也不会影响其它Worker中运行的代码.

######优先使用Worker的情况(浏览器支持)
1. 编码/解码大字符串
2. 复杂数学运算,包括图像或视频处理
3. 大数组排序
4. 任何超过100毫秒的处理过程都应当考虑Worker方案是不是比基于定时器的方案更合适.

###第七章 Ajax 异步JavaScript和XML

######有五种常用技术用于向服务器请求数据
1. XMLHttpRequest(XHR)
2. Dynamic script tag insertion 动态脚本注入
3. iframes
4. Comet
5. Multipart XHR

###第八章 编程实践

####1. 避免双重求值
在程序中提取一个包含代码的字符串,然后动态执行它的四种方法:eval() ,function构造函数,setTimeout()和setInterval()
当在js代码中执行另一段js代码时,会导致双重求值的性能消耗.首先会以正常的方式求值,然后在执行过程中对包含于字符串中的代码发起另一个求值运算.双重求值是一项代价昂贵的操作,它比直接包含的代码执行速度慢很多.
setTimeout()和setInterval()建议传入函数而不是字符串来作为第一个参数.

####2. 使用Object/Array直接量
在js中创建对象和数组的方法有多种,但使用对象和数组的直接量是最快的方式.

####3. 不要重复工作
######最常见的重复工作就是浏览器探测。下面是添加或移除事件处理器的示例，典型的跨浏览器的代码写法：
	function addHandler(target,eventType,handler){
		if(target.addEventListener){//DOM2 Events
			target.addEventListener(eventType,handler,false);
		}else{//IE
			target.attachEvent("on"+eventType,handler);
		}
	}

上面的方法在每次调用的时候都检查浏览器，检查是重复的，有下面两种方法可以避免重复
#####3.1. 延迟加载
######延迟加载意味着在信息被使用前不会做任何操作。延迟加载的版本如下：
	function addHandler(target,eventType,handler){
		if(target.addEventListener){//DOM2 Events
			addHandler= function(target,eventType,handler){                  
			    target.addEventListener(eventType,handler,false);
			};
		}else{//IE
			addHandler=function(target,eventType,handler){
		  		target.attachEvent("on"+eventType,handler);
			};
		}
		//调用新函数
		addHandler(target,eventType,handler);
	}

这个方法在第一次被调用时，会先检查并决定使用哪种方法去绑定事件处理器.然后原始函数被包含正确操作的新函数覆盖.最后一步调用新的函数,并传入原始参数.随后每次调用addHandler()都不会再做检测,因为检测代码已经被新的函数覆盖

#####3.2. 条件预加载
######在脚本加载期间提前检测,而不会等到函数被调用，预加载适用于一个函数马上就要被用到,并且在整个页面的生命周期中频繁出现的场合.

	var addHandler=document.body.addEventListener?//三目运算符
		function(target,evetType,handler){
			target.addEventListener(eventType,handler,false);
		}:function(target,eventType,handler){
			target.attachEvent("on"+eventType,handler);
		};

