
1.如果domReady没有完成时，document.write就相当于appendChild

2.window.onload只能绑定一个回调

3.onload hack 绑定多个回调

    var loadEvent = function(fn) {
      var oldonload = window.onload;
      if (typeof window.onload != 'function') {
          window.onload = fn;
      }else {
          window.onload = function() {
              oldonload();
              fn();
          }
      }
    }

4.jQuery的domReady 

    $(function(){  })

5.DOM加载完成,domReady判定手段

    document.readyState
    DOMContentLoaded
    onreadystatechange
    doScroll

6.iframe什么时候加载完成,动态创建时

    if (iframe.attachEvent){
        iframe.attachEvent("onload", function(){
            alert("Local iframe is now loaded.");
        });
    } else {
        iframe.onload = function(){
            alert("Local iframe is now loaded.");
        };
    }

    //先绑定事件，再设置iframe.src 本来页面上就有iframe标签
    <iframe onload="callback" src="">

7.图片什么时候加载完成

    W3C onload
    IE setTimeout轮询 complete
    var i = 0;
    (function(){
        i++;
        if(image.complete){
          (image.width>500) && (image.width = 500);/*统一设置*/
          (image.height>200) && (image.height = 200);/*统一设置*/
        }else{
          setTimeout(arguments.callee,1);
        }
    })()

8.script什么时候加载完成
script标签的加载完成判定，哪个script标签对应哪一个模块的，是实现AMD，CMD的关键

    if (window.VBArray){  //IE6-11
      script.onreadystatechange = function(){
        if (script.readyState == "complete" || script.readyState == "loaded"){
          alert("ok")
        }
      };
    } else { 
      script.onload = function(){
         alert("ok")
      };
    }

    function loadScript (url,callback){//url为文件位置，callback为回调函数
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
