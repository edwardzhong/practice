1.添加css样式

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

	addCssRule('.restore{-webkit-transition:-webkit-transform .3s linear;}');

2.返回浏览器特有css前缀

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
	}()