1.fiddler
bpafter 空格加链接
进行断点，可以直接改 返回数据

2.滚动条组件

    <!--#include virtual="/sinclude/promote/ezscroll.html"-->

2.手q分享组件
http://mqq.oa.com/api.html

    <script src="http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152"></script>

4.互动活动公共底部页面片添加方式说明如下：
1）由活动开发同学，在活动页面底部添加代码：

    <!--#include virtual="/sinclude/promote/foot_promote.html"-->  
2）如上页面片地址会自动识别微信/手Q环境，展示对应的公共底部；

5.公共样式
http://qd.jd.com/wx/base.html

6.我的京东券
http://wqs.jd.com/my/coupon/index.shtml

7.页面片表达式

    <! --#if expr="$QUERY_STRING = /_share=wx/" -->
      <! --#include virtual="/sinclude/common/head_inc.shtml"-->
    <! --#elif expr="$QUERY_STRING = /_share=sq/" -->
        <! --#include virtual="/sinclude/common/head_inc.shtml"-->
        <! --#include virtual="/sinclude/common/head_shortcut.shtml"-->
    <! --#else -->
        <! --#include virtual="/sinclude/app/head_app.shtml"-->
    <! --#endif -->

8.微信手Q大账号
手Q关注的链接：
qq环境要首先引用这个

    <script src="http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152"></script>

    <a class="btn btn_gz btn_gz_qq qq_show" href="javascript:mqq.ui.showOfficalAccountDetail({uin:'3046055438',showAIO: true});" ptag="7058.1.4">
    关注QQ购物大帐号</a>
    <a class="btn btn_gz btn_gz_jd qq_show" href="javascript:mqq.ui.showOfficalAccountDetail({uin:'2712384158',showAIO: true})" ptag="7058.1.5">
    关注京东购物大帐号</a>

微信关注的连接：

    <a class="btn btn_gz btn_gz_jd wx_show" href="http://mp.weixin.qq.com/s?__biz=MjYzMjU0MjU0MA==&mid=244790036&idx=1&sn=0b5e7df5e2a41884ba3346c5c0f278cf&key=94484500774026df06178aea31845435549a211019907fdd67f809c86209a8786f699f6cabcaae324c4ed48fd6b8d401&ascene=1&uin=NDQyNzQyODU%3D&pass_ticket=Nr16fdZd2lGeBmhNhWu6ByNntS49EZiU2tXb6Kn6Tns%3D&ptag=7059.1.4" ptag="7059.1.4">点击关注</a>

9.快速发布地址
/static/res/sinclude/jsi/wg.market.618wallet.enter.shtml  
/static/event/juhuodong/618wallet/images/pc_bg.jpg  
/static/event/juhuodong/618wallet/pc.html  
/resource/js/version/201505/wg.market.618wallet.201505281651.js


10.查询用户ID信息
http://wqadmin.jd.com/queryuserid/v1/ShowSearchList

11.公共抽奖函数
1)文档：
http://legos.wq.jd.com/ci.php/api/#id=20107  
地址：
http://wq.jd.com/active/active_draw  
调用示例：	
http://party.wanggou.com/tws64/activemkt/active/active_draw?active=test&level=1&deal_id=12344433&ext=hj:w

bingo/bingolevel : 中奖等级  
bingo/bingomsg : 中奖错误信息  
bingo/bingoret : 中奖错误码  
award/awardmsg : 发奖信息  
award/awardret: 发奖错误码  

返回码ret：
0 成功  result.bingo.bingolevel == 0 为中奖
2 159 未登录
3，4，10 已经领取
5，7，11 已经领取完
8 概率不中奖

2)查询奖池配置和奖品剩余
http://legos.wq.jd.com/ci.php/api/#id=20251

3)查询是否领取奖品
http://legos.wq.jd.com/ci.php/api/#id=20174
http://wq.jd.com/active/querybingo?active='+activeId+'&callback=BingoCallBack

-------------------------------------
1.焦点数据
http://wq.jd.com/mcoss/focusbi/show?gids=&pcs="+pcs+":"+len+"&callback="+_t

2.卖快拉取
http://legos.wq.jd.com/ci.php/api/#id=20345
actid=35870&areaid=25573 区域
pc：pagesize
pi：pageindex
ch：渠道
ptype：1 微信 2 手q 3 微信每日精选
商品字段说明
"dwCommCnt": "20",//库存
"dwEvalCnt": "460",//评价数
"dwSkuState":0有库存，1已经售完

腾讯
http://bases.wanggou.com/mcoss/mmart/show?actid=35870&areaid=25573&callback=itemCB&pc=100&ch=8&options=1
京东
http://wq.jd.com/mcoss/mmart/show?actid=35870&areaid=25573&callback=itemCB&pc=100&ch=8&options=1

------------------------------------------------
1.新的获得服务器时间接口

    function getServerTime() {
        window.ServerTimeCallback = function(json){
            if(json.errCode == "0"){
                serverTime = new Date((json.data)[0].serverTime)
            }
         };
        loadJs.loadScript({url:"http://wq.jd.com/mcoss/servertime/getservertime?v="});
    }

2.手q提醒

    qqRemind = require("qqRemind"),
    qqRemind.set({
        itmeid:"book618",
        name:"京东618老刘专场",
        url:"http://wqs.jd.com/promote/201505/618_sq_main.shtml?ptag=17052.4.1",
        time:1434502800
    });

3.ppms js模板

    <script type="text/javascript">
    var _venIdMap = [<!--BEGINLOOP-->{
            venIds:"{#venids#}",
            tarId:"{#tarid#}"
        }
        <!--BEGINIF{#contentIndex#}!={#contentLastIndex#}-->,<!--ENDIF-->
        <!--ENDLOOP-->
    ];
    </script>

ppms里面img类型的数据加了尺寸校验，用"size"限定大小，单位KB，默认1024K

4.公共页面片路径
/export/wxsq/static/res/sinclude
5. 商品图片详情
http://m.360buyimg.com/mobilecms/s300x300_

6.获取CPC数据
http://legos.wq.jd.com/ci.php/api/#id=20348  
接口调用
http://wq.jd.com/mcoss/focusbi/show?gids=2008&pc=2&callback=processFocusData&pcs=5776:16,5777:10,5778:16,5779:14,5780:13,5781:13  

7.微信api相关功能
微信公众平台开发文档
http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.9A.90.E8.97.8F.E5.8F.B3.E4.B8.8A.E8.A7.92.E8.8F.9C.E5.8D.95.E6.8E.A5.E5.8F.A3

//先隐藏分享按钮

    try{
        JD.wxapi.ready;
        JD.wxapi.ready(function() {
            wx.showOptionMenu();
        },true);
    }catch(e){}

    //先隐藏分享qq按钮
    try{
        JD.wxapi.ready;
        JD.wxapi.ready(function() {
            setTimeout(function(){
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq'
                    ],
                    success: function(res) {},
                    fail: function(res) {}
                });
            }, 1000);
        });
    } catch(e){}

8.微信登录模拟
https://chrome.google.com/webstore/detail/%E5%BE%AE%E4%BF%A1%E7%99%BB%E5%BD%95/nhkkdccjigioaajlmkefcidlldjihfga/related

9.模拟app环境
appdlDebug=1

//页面从微信直接跳转到手Q打开  

    function lauchMqq (url){
        var QQUrl = 'mqqapi://forward/url?url_prefix=base64Url&version=1&src_type=web';//跳转到手Q的iframe中隐藏的url
        var base64Url = QQUrl.replace('base64Url',window.btoa(url));
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        iframe.src = base64Url;
    };
-----------------------------------------
手Q功能菜单设置方法
http://zeratul.sinaapp.com/?articleid=101

具体使用方式

只需在url上添加如下一个名为_wv的参数即可配置UI：
http://YOUR_HOST/PATH?...&_wv=N…
 
其中参数值N是如下配置项之和：
1: 隐藏底部导航(隐藏后返回按钮功能变为页面后退, 可以配合4使用)
2: 隐藏功能按钮
4: 在没有底部导航的情况下，禁用返回按钮的页面后退功能[3][6]
1024: 锁定竖屏模式（禁用横屏）
2048 [未实现]: 锁定横屏模式（禁用竖屏）
4096 [iOS]: 禁用向右滑动关闭WebView的手势
8: 隐藏功能菜单里的「分享给好友」项
16: 隐藏功能菜单里的「分享到QQ空间」项
32: 隐藏功能菜单里的「复制链接」项
64: 隐藏功能菜单里的「查看帐号资料」项[4]
128: 隐藏功能菜单里的「调整字体」项
256: 隐藏功能菜单里的「用系统浏览器打开」项
512: 隐藏功能菜单里的「用QQ浏览器打开」项
8192: 隐藏功能菜单里的「收藏」项
16384：(4.7+) 隐藏功能菜单里的“分享到微信”
32768：(4.7+) 隐藏功能菜单里的“分享到朋友圈”

----------------------------------------
1.各种高度宽度

    // 滚动条的高度
    var scrollHeight = window.pageYOffset
    // 当前可视区域的高度
    var viewHeight=$(window).height()
    //当前图片偏移高度
    var offsetTop=ele.offset().top
    //到了最底部
    $(window).scrollTop() = $(document).height() - $(window).height()
    window.pageYOffset=document.body.clientHeight-window.innerHeight
    document.documentElement.scrollHeight
    var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    var winHeight=window.innerHeight||document.body.clientHeight;

2.解决css动画卡住问题
js后期操作节点产生的css3动画会有系统资源不够导致渲染一半或渲染模糊的问题，一般是在缩放和形变的时候会发生。
一般是一些短动画（1s以内的css3动画），因为时间短所以容易被掉帧，一掉帧就会出卡住的现象了，这个bug是在特定的几款机子上才会出现 。
这个bug以前在小米3出现过，我还以为升级后的安卓机子不会再有这个问题了。
长动画在未执行结束时，其它的css3动画会被暂停，等到长动画执行结束后才会执行。。
最开始的解决办法是把.3s的动画延长到3s解决资源不足问题，所以就导致了后面这个问题。
解决的办法是加一个不断循环的小动画（位移为0）时间为.1s，这样可以打破长动画锁定状态。

    @-webkit-keyframes tt {
        0% {
            -webkit-transform: translate3d(0, 0, 0);
        }
        100% {
            -webkit-transform: translate3d(0, 0, 0);
        }
    }

    .killBug {
        -webkit-animation: tt .1s linear infinite;
        width: 1px;
        height: 1px;
        position: absolute;
        left: 0;
        top: 0;
    }

3.图片样式设置了vertical-align: middle ，某些旧版的手机，使用微信无法识别出二维码图片

4. ios safari border-radius样式失效解决方式：

    overflow:visible;
    -webkit-appearance:none;

5.移动web的position:fixed导致之前绑定的事件无法触发的bug修复：
先设置为static，延时后再重新设置为fixed

----------------------------------------
weinre使用
1.运行
weinre --httpPort 8081 --boundHost -all-

主要参数解析：
httpPort    调试服务器运行的端口，默认8080  
boundHost   调试服务器绑定的IP地址或域名，默认localhost  

2.打开debug面板：http://localhost:8081/client/#anonymous  

3.获取本机的IP地址，例如：192.168.1.101，添加如下js文件到需要调试的目标文件的头部：  
<script src="http://192.168.1.101:8081/target/target-script-min.js#anonymous"></script>  

在debug面板中可以监听到移动设备对目标页面的访问：

----------------------------------------
http://mtd.jd.com/mobile/wx/base.html 公共样式  
http://pcm.jd.com/ 京东svn配置平台  
http://wei.jd.com/weidian/portal.shtml 京东微店管理系统  
http://wqs.jd.com/weidian/mp/attention.shtml 京东微店关注公众号  
http://ump.jd.com/login/admin.action 监控平台  
http://ppms.jd.com/ 
http://legos.wq.jd.com/ 京东legos  
http://legos.cm.com/legos4.php/project/ 腾讯legos  

