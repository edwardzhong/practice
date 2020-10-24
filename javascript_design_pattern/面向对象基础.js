Object.create = Object.create || function (obj) {
	var F = function () {};
	F.prototype = obj;
	return new F();
};

//使用img对象上报数据
function report() {
	var imgs = [];
	return function (src) {
		var img = new Image();
		imgs.push(img);
		img.src = src;
	};
}

//实现bind的功能
if (!Function.prototype.bind) {
	Function.prototype.bind = function () {
		var self = this,
			context = arguments[0],
			args = [].slice.call(arguments, 1);

		return function () {
			return self.apply(context, args.concat([].slice.call(arguments)));
		};
	};
}

//单例
var getSingle = function (fn) {
	var ret;
	return function () {
		return ret || (ret = fn.apply(this, arguments));
	};
};

//AOP
Function.prototype.before = function (beforeFn) {
	var self = this;
	return function () {
		beforeFn.apply(this, arguments);
		return self.apply(this, arguments);
	};
};
Function.prototype.after = function (afterFn) {
	var self = this;
	return function () {
		var ret = self.apply(this, arguments);
		afterFn.apply(this, arguments);
		return ret;
	};
};

// aop 样例
var func = function () {
	console.log(2);
};
func = func
	.before(function () {
		console.log(1);
	})
	.after(function () {
		console.log(3);
	});
func();

// function cost(){
// 	var args=[];
// 	return function(){
// 		if(arguments.length==0){
// 			var money=0;
// 			for(var i=0,len=args.length;i<len;i++){
// 				money+=args[i];
// 			}
// 			return money;
// 		} else {
// 			[].push.apply(args,arguments);
// 			return arguments.callee;
// 		}
// 	}
// }

// var curryCost=cost();
// curryCost(100)(200)(300);
// curryCost();

//currying
var currying = function (fn) {
	var args = [];
	return function () {
		if (arguments.length == 0) {
			return fn.apply(this, args);
		} else {
			[].push.apply(args, arguments);
			return arguments.callee;
		}
	};
};

var cost = (function () {
	var money = 0;
	return function () {
		for (var i = 0, l = arguments.length; i < l; i++) {
			money += arguments[i];
		}
		return money;
	};
})();

// curry 样例
var cost = currying(cost); //转换为currying函数
cost(100)(200)(300);
console.log(cost());

// uncurrying
Function.prototype.uncurrying = function () {
	var self = this;
	return function () {
		return Function.prototype.call.apply(self, arguments);
	};
};
var arr = [];
push(arr, 2);
push(arr, 4);
console.log(arr);

// 函数节流, 函数频繁调用场景
var throttle = function (fn, interval) {
	var timer = null,
		firstTime = true; //是否第一次调用

	return function () {
		var args = arguments,
			me = this;

		if (firstTime) {
			//第一次不需要延迟
			fn.apply(me, args);
			return (firstTime = false);
		}

		if (timer) {
			return false;
		} //定时器还在，前一次延迟还没完成

		timer = setTimeout(function () {
			//延迟一段时间执行
			clearTimeout(timer);
			timer = null;
			fn.apply(me, args);
		}, interval || 500);
	};
};

window.onresize = throttle(function () {
	console.log('resize');
}, 500);


//分时函数，数据量大，影响页面性能场景
var timeChunk = function (ary, fn, count) {
	var obj,
		t,
		len = ary.length;
	var start = function () {
		for (var i = 0; i < Math.min(count || 1, ary.length); i++) {
			fn(ary.shift());
		}
	};

	return function () {
		t = setInterval(function () {
			if (ary.length == 0) {
				//已经创建好全部节点
				return clearInterval(t);
			}
			start();
		}, 200); //分批执行
	};
};

var ary = [];
for (var i = 1; i <= 1000; i++) {
	ary.push(i);
}

var renderList = timeChunk(
	ary,
	function (n) {
		var div = document.createElement('div');
		div.innerHTML = n;
		document.body.appendChild(div);
	},
	8,
);

renderList();

// 惰性加载函数
var addEvent = (function () {
	if (window.addEventListener) {
		return function (elem, type, fn) {
			elem.addEventListener(type, fn, false);
		};
	} else if (window.attachEvent) {
		return function (elem, type, fn) {
			elem.attachEvent('on' + type, fn);
		};
	} else {
		return function (elem, type, fn) {
			elem['on' + type] = function () {
				fn.apply(this);
			};
		};
	}
})();
