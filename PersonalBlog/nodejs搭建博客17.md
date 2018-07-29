---
title: nodejs搭建博客17
date: 2017-05-01 09:22:35
tags:
---


开始对博客进行修饰，首先做引导页上的用户微信。我希望鼠标悬停在微信的li上时，可以有悬浮窗显示我的二维码。在bootstrap中找到有tooltip与popover两种插件，但是好像只能支持文字，想要提示图片等复杂信息的话就不能用bootstrap了。经过查找，发现有个叫Prototip的插件可以使用。但是已经不再维护，建议使用组最新的tippedjs插件，链接放在了参考链接中。如他的介绍所说，他支持DISPLAY ANYTHING，拥有BEAUTIFUL SKINS，可以DIFFERENT SIZES等等优点。但是他的高级的功能是要买pro版的，我们用免费的就好。
详细步骤（文档翻译）如下：
将下载的tipped文件解压，tipped.js与tipped.css文件添加进项目，tipped.js要放在jquery的后面。
	<script type="text/javascript" src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="/js/tipped/tipped.js"></script>
	<link rel="stylesheet" type="text/css" href="/css/tipped/tipped.css"/>
然后开始制作TOOLTIPS
Tipped.create可以用来一次性的创建一个或多个tip. 他的第一个参数接受css选择器或者是html元素。

	$(document).ready(function() {
	  Tipped.create('#demo-tooltip', 'Some tooltip text');
	});
如果没有字符串作为第二个参数传入，Tipped将会寻找title属性作为tip的内容。

	<span class="simple-tooltip" title="First tooltip">I have a tooltip</span>
	<span class="simple-tooltip" title="Second tooltip">I also have a tooltip</span>
	
	<script type="text/javascript">
	  $(document).ready(function() {
	    Tipped.create('.simple-tooltip');
	  });
	</script>
其他设置可以作为最后一个参数传入：

	Tipped.create("#demo-options", "Options are awesome", { position: 'topleft' });
元素利用data-tipped-options属性同样可以进行设置. 这些设置将会重写create函数进行的设置。

	<span class="x-small-tooltip" title="Red" data-tipped-options="skin: 'red'">Red</span>
	<span class="x-small-tooltip" title="Green" data-tipped-options="skin: 'green'">Green</span>
	<span class="x-small-tooltip" title="Blue" data-tipped-options="skin: 'blue'">Blue</span>
	
	<script type="text/javascript">
	  $(document).ready(function() {
	    Tipped.create('.x-small-tooltip', { size: 'x-small' });
	  });
	</script>
还可以在设置里设置回调函数（pro版本才支持）：

	Tipped.create("#demo-options-callbacks", "This tooltip is a bit more advanced", {
	  skin: 'light',
	  position: 'topleft',
	  close: true,
	  hideOn: false,
	  onShow: function(content, element) {
	    $(element).addClass('highlight');
	  },
	  afterHide: function(content, element) {
	    $(element).removeClass('highlight');
	  }
	});
在inline设置中将元素的id传入设置，这样页面当中的任何东西都可以被放入tip中。

	<span class='inline' data-tipped-options="inline: 'inline-tooltip-1'">Inline 1</span>
	<div id='inline-tooltip-1' style='display:none'>Moved into the tooltip</div>
	
	<span class='inline' data-tipped-options="inline: 'inline-tooltip-2'">Inline 2</span>
	<div id='inline-tooltip-2' style='display:none'>Another one</div>
	
	<script type="text/javascript">
	  $(document).ready(function() {
	    Tipped.create('.inline');
	  });
	</script>
动态创建的或者是页面当中的元素都可以作为tip的内容，使用页面中有的元素就像使用inline选项一样，不过不用必须使用id，所以这种方式有一定的优势。

	<span id='element-dynamic'>Dynamic</span>
	
	<span id='element-inline'>Inline</span>
	<div class='move-into-tooltip' style='display:none'>Moved into the tooltip</div>
	
	<script type="text/javascript">
	  $(document).ready(function() {
	    Tipped.create('#element-dynamic', $('<i/>').html('Dynamically created'));
	    Tipped.create('#element-inline', $('#element-inline').next('.move-into-tooltip')[0]);
	  });
	</script>
tip中还可以传入函数，当然函数的返回值是动态创建的tip内容。

	<span id='function' data-content='Bold'>Function</span>
	
	<script type="text/javascript">
	  $(document).ready(function() {
	    Tipped.create('#function', function(element) {
	      return "<strong>" + $(element).data('content') + "<\/strong>";
	    });
	  });
	</script>
后边不说了，这个文档写的很简单，都能看懂。我把我微信的二维码截成200X200像素的大小感觉差不多，我直接开始写pug与js代码好了：

    .resume
      h3 浮生六记
      p 李岩翔
      ul
        li#enter-blog 博客
        li#wechat 微信
        li#email 邮箱
        li 没想好
      .move-into-tooltip(name='qr')
        img.qrcode(src='/images/QRCode.jpg')
      .move-into-tooltip(name='email')
        a.click-to-close(href='mailto:liyanxiang@mail.dlut.edu.cn') liyanxiang@mail.dlut.edu.cn
在js中添加：

    $(document).ready(function () {
        Tipped.create('#wechat', $('.move-into-tooltip[name="qr"]'),{
            position: 'bottom',
            behavior: 'mouse'
        });
        Tipped.create('#email', $('.move-into-tooltip[name="email"]'),{
            position: 'bottom'
        })
    });
二维码还是有点大，改小一点。再修改一下字体什么的。
另外还有，使用了letter-spacing之后，进行文字居中。最后一个字的letter-spacing也会算在文字的宽度之中。这时候要手动对多出来的长度进行处理。
这样引导页部分就大致做完了。











参考链接：

1. [http://www.runoob.com/bootstrap/bootstrap-tooltip-plugin.html](http://www.runoob.com/bootstrap/bootstrap-tooltip-plugin.html)
2. [http://www.runoob.com/bootstrap/bootstrap-popover-plugin.html](http://www.runoob.com/bootstrap/bootstrap-popover-plugin.html)
3. [http://www.cnblogs.com/miqi2214/archive/2008/11/14/1333326.html](http://www.cnblogs.com/miqi2214/archive/2008/11/14/1333326.html)
4. [http://www.nickstakenburg.com/projects/prototip2/#](http://www.nickstakenburg.com/projects/prototip2/#)
5. [http://www.tippedjs.com/](http://www.tippedjs.com/)
6. [http://www.tippedjs.com/documentation](http://www.tippedjs.com/documentation)
7. [http://www.haorooms.com/post/mailto_link_html](http://www.haorooms.com/post/mailto_link_html)
8. [http://www.xwbetter.com/font-family/](http://www.xwbetter.com/font-family/)