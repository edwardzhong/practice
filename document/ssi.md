###SSI简介
SSI在静态文件中非常有用，能分离一些可变的模块，如每日排行榜等。其主要作用有：
1.显示服务器端环境变量<#echo>
2.将文本内容直接插入到文档中<#include>
3.显示WEB文档相关信息<#flastmod #fsize> (如文件制作日期/大小等)
4.直接执行服务器上的各种程序<#exec>(如CGI或其他可执行程序)
5.设置SSI信息显示格式<#config>(如文件制作日期/大小显示方式)
6.高级SSI<XSSI>可设置变量使用if条件语句。 apache、nginx等都支持SSI命令，配置下就可以，Nginx的配置可以参考:
http://wiki.nginx.org/HttpSsiModuleChs
SSI 的默认扩展名是 .stm、.shtm 和 .shtml
SSI语法
示例：

	<!--#command param="value"-->
SSI的语法非常简单，但使用中需注意以下几点：
1.<\!–与#之间无空格
2.SSI大小写敏感
3.所有value需写在引号中
SSI命令
config命令
config命令主要用于修改SSI的默认设置，诸如时间格式，默认错误信息，文件大小单位。
设置默认错误信息：errmsg
复制代码 代码如下:

	<!--#config errmsg="Error,please contact webmaster@mail.com"-->

定义日期和时间格式：timefmt
复制代码 代码如下: 

	<!--#config timefmt="%A, %B %d, %Y"-->

定义文件大小单位
复制代码 代码如下:

	<!--#config sizefmt="bytes"-->

config命令只对其后使用的命令生效。同时，后定义的设置具有更高的优先级，会覆盖之前的设置。
include命令
include命名可能是SSI中使用最多的命令，也是SSI最主要的功能体现；
Include命令可以把其它文档中的文字或图片插入到当前被解析的文档中，通过Include命令只需要改动一个文件就可以瞬间更新整个站点！
复制代码 代码如下:

	<!--#include virtual="/inc/header.inc"-->
	<!--#include file="inc/desc.inc"-->

include命令支持通过虚拟路径引入文件（virtual），以及相对路径引入文件（file），引用的文件类型不限。
set命令
可以使用set进行变量的定义：
复制代码 代码如下:

	<!--#set var="blog" value="http://www.jb51.net"-->

变量定义后便可以使用了：
复制代码 代码如下:

	<!--#echo var="blog"-->

定义变量时使用环境变量：
复制代码 代码如下:

	<!--#set var="fname" value="${DOCUMENT_NAME}${DOCUMENT_URI}"-->

如果是单个环境变量可以不使用{}分割：
复制代码 代码如下:

	<!--#set var="fname" value="$DOCUMENT_NAME"-->

环境变量的引用都需要使用$前缀，如果$仅作为字符使用，通过\$转义即可。
echo命令
echo显示变量值，包括自定义变量、环境变量
复制代码 代码如下:

	<!–#echo var=”DOCUMENT_NAME”–>

注意：echo命令中使用的环境变量不需要使用$前缀。 SSI的主要环境变量如下：
name	description	type
DOCUMENT_NAME	当前文档名	SSI
DOCUMENT_URI	当前文档虚拟路径	SSI
QUERY_STRING_UNESCAPED	未经转义处理的由客户端发送的查询字串，所有的特殊字符前面都有转义符”\”	SSI
DATE_LOCAL	服务器设定时区的日期和时间	SSI
DATE_GMT	功能与DATE_LOCAL一样，但返回的是以格林尼治标准时间为基准的日期	SSI
LAST_MODIFIED	当前文档的最后更新时间	SSI
SERVER_SOFTWARE	服务器软件的名称和版本	CGI
SERVER_NAME	服务器的主机名称，DNS别名或IP地址	CGI
SERVER_PROTOCOL	客户端请求所使用的协议名称和版本	CGI
SERVER_PORT	服务器的响应端口	CGI
REMOTE_HOST	发出请求信息的客户端主机名称
	CGI
REMOTE_ADDR	发出请求信息的客户端IP地址	CGI
AUTH_TYPE	用户身份的验证方法	CGI
REMOTE_USER	访问受保护页面的用户所使用的帐号名称	CGI
更多的环境变量可使用printenv命令查看 printenv命令 显示所有环境变量
fsize命令
显示指定文件的大小，可结合config sizefmt指定输出格式。
复制代码 代码如下:

	<!--输出当前文档大小-->
	<!--#fsize file="$DOCUMENT_NAME"-->
	<!--#fsize virtual="$DOCUMENT_URI"-->
flastmod命令
显示指定文件的最后更新日期，可结合config sizefmt指定输出格式。
复制代码 代码如下:

	<!--输出当前文档大小-->
	<!--#flastmod file="$DOCUMENT_NAME"-->
	<!--#flastmod virtual="$DOCUMENT_URI"-->
exec命令
Exec 命令可以执行 CGI 脚本或者 shell 命令。使用方法如下：
1.CMD：使用 /bin/sh 执行指定的字串。如果 SSI 使用了 IncludesNOEXEC 选项，则该命令将被屏蔽
2.CGI：可以用来执行 CGI 脚本
if…语句
SSI中也可以是用条件判断语句if，语法如下：
复制代码 代码如下:

	<!--#if expr="test_condition" -->
	<!--#elif expr="test_condition" -->
	<!--#else -->
	<!--#endif -->

示例：
复制代码 代码如下:

	<!--#if expr="$DOCUMENT_NAME=index.shtml"-->
这是通过if判断当前文档名为"index.shtml"后显示

	<!--#elif expr="$DOCUMENT_NAME=index.html"-->
这是通过if判断当前文档名为"index.html"后显示

	<!--#else -->
既不是"index.shtml"，也不是"index.html"

	<!--#endif -->

用例：

	<!--#include virtual="/sinclude/cssi/promote/201512/springfestival.shtml"-->
	<!--#if expr="$REQUEST_URI=/wx/"-->
		<!--#include virtual="/sinclude/common/head_inc.shtml"-->
	<!--#else-->
		<!--#include virtual="/sinclude/common/head_inc.shtml"-->
		<!--#include virtual="/sinclude/common/head_shortcut.shtml"-->
	<!--#endif --> 
