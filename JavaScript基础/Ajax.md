---
title: Ajax
date: 2017-03-19 20:41:53
tags:
---

AJAX = Asynchronous JavaScript and XML = 异步 JavaScript 和 XML（Asynchronous JavaScript and XML）。
通过在后台与服务器进行少量数据交换，AJAX 可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。简短地说，在不重载整个网页的情况下，AJAX 通过后台加载数据，并在网页上进行显示。
jQuery 提供多个与 AJAX 有关的方法。
通过 jQuery AJAX 方法，能够使用 HTTP Get 和 HTTP Post 从远程服务器上请求文本、HTML、XML 或 JSON - 同时能够把这些外部数据直接载入网页的被选元素中。

一、load()方法：
jquery对ajax进行了大量封装，不需要考虑浏览器兼容性：
load()方法通过 AJAX 请求从服务器加载数据，并把返回的数据放置到指定的元素中。
    `load(url,data,function(response,status,xhr))`
load()方法可以接收三个参数：url（必须，请求html文件的url地址），data（可选，发送的key/value数据），callback（可选，成功或失败的回调函数）。
该方法是最简单的从服务器获取数据的方法。它几乎与 $.get(url, data, success) 等价，不同的是它不是全局函数，并且它拥有隐式的回调函数。当侦测到成功的响应时（比如，当 textStatus 为 "success" 或 "notmodified" 时），.load() 将匹配元素的 HTML 内容设置为返回的数据。这意味着该方法的大多数使用会非常简单。
.load() 方法，与 $.get() 不同，允许我们规定要插入的远程文档的某个部分。这一点是通过 url 参数的特殊语法实现的。如果该字符串中包含一个或多个空格，紧接第一个空格的字符串则是决定所加载内容的 jQuery 选择器。
    `$("#result").load("ajax/test.html #container");`
如下例：
    `$(function () {
    $("#click").click(function () {
        $("#box").load("test.php", {
            url: "baidu"
        }, function (response, status, xhr) {
            alert(response);
            $("#box").html(response + "新增文本");
            if (status == "success") {
                alert("成功！");
            }
            alert(xhr.responseText);
            alert(xhr.status);
            alert(xhr.statusText);
        })
    });
	});`
部分http状态码：
200：请求被正常处理
204：请求被受理但没有资源可以返回
206：客户端只是请求资源的一部分，服务器只对请求的部分资源执行 GET 方法，相应报文中通过 Content-Range 指定范围的资源。
301：永久性重定向
302：临时重定向
303：与 302 状态码有相似功能，只是它希望客户端在请求一个 URI 的时候，能通过 GET 方法重定向到另一个 URI 上
304：发送附带条件的请求时，条件不满足时返回，与重定向无关
307：临时重定向，与 302 类似，只是强制要求使用 POST 方法
400：请求报文语法有误，服务器无法识别
401：请求需要认证
403：请求的对应资源禁止被访问
404：服务器无法找到对应资源
500：服务器内部错误
503：服务器正忙

二、$.get()与$.post()方法：
load方法为局部方法，因为他需要包含一个jquery对象为前缀。他适合做异步文件的静态获取，而对于需要参数到服务器的，$.get()与$.post()方法更加合适。
    `$(selector).get(url,data,success(response,status,xhr),dataType)`
url								必需。规定将请求发送的哪个 URL。
data							可选。规定连同请求发送到服务器的数据。
success(response,status,xhr)	可选。规定当请求成功时运行的函数。额外的参数：response - 包含来自请求的结果数据；status - 包含请求的状态；xhr - 包含 XMLHttpRequest 对象；
dataType						可选。规定预计的服务器响应的数据类型。可能的类型："xml"、"html"、"text"、"script"、"json"、"jsonp"。
1. 通过直接在url问号后传参：
    `$(function () {
    $("input").click(function () {
        $.get("test.php?url=baidu", function (response, status, shr) {
            $("#box").html(response);
        })
    });
	});`
2. 通过第二个参数data，字符串型式的键值对传参，然后自动转换为问号紧跟传参：
    `$(function () {
    $("input").click(function () {
        $.get("test.php","url=baidu", function (response, status, shr) {
            $("#box").html(response);
        })
    });
	});`
3. 以对象形式的键值对传参，转换url：
    `$(function () {
    $("input").click(function () {
        $.get("test.php",{
            url: "baidu"
        }, function (response, status, shr) {
            $("#box").html(response);
        })
    });
	});`
post提交不能使用第一种问号传参，可以使用第二种字符串形式的键值对传参，可以使用第三种对象键值对形式传参。

三、getScript()与getJSON()方法：

getScript() 方法通过 HTTP GET 请求载入并执行 JavaScript 文件。多用于节约资源，加载小程序。
    `jQuery.getScript(url,success(response,status))`
通过 HTTP GET 请求载入 JSON 数据。特定用于JSON文件。
    `jQuery.getJSON(url,data,success(data,status,xhr))`

四、ajax()方法：
ajax() 方法通过 HTTP 请求加载远程数据。
该方法是 jQuery 底层 AJAX 实现。简单易用的高层实现见 $.get, $.post 等。$.ajax() 返回其创建的 XMLHttpRequest 对象。大多数情况下你无需直接操作该函数，除非你需要操作不常用的选项，以获得更多的灵活性。最简单的情况下，$.ajax() 可以不带任何参数直接使用。所有的选项都可以通过 $.ajaxSetup() 函数来全局设置。
    `jQuery.ajax([settings])`
