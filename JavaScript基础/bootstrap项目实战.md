---
title: bootstrap项目实战
date: 2017-03-26 18:54:10
tags:
---

一、响应式导航栏：

创建一个默认的导航栏的步骤如下：
向 <nav> 标签添加 class .navbar、.navbar-default。
向上面的元素添加 role="navigation"，有助于增加可访问性。这不是必须的，是写给浏览器的，方便盲人等特殊群体使用。
向 <nav> 元素中的 <div> 元素添加一个标题 class .navbar-header，内部包含了带有 class navbar-brand 的 <a> 元素。这会让文本看起来更大一号。通常适用于导航栏的标题。
为了向导航栏添加链接，只需要简单地添加带有 class .nav、.navbar-nav 的无序列表即可。

基于以上内容，下面开始写导航栏：

首先写一个nav元素，他的类应当有.navbar .navbar-default。Bootstrap 导航栏可以动态定位。默认情况下，它是块级元素，它是基于在 HTML 中放置的位置定位的。如果想要让导航栏固定在页面的顶部，添加 class .navbar-fixed-top。
	.container 类用于固定宽度并支持响应式布局的容器。所以在这里添加一个类是container的div容器来装导航栏的内容。
		接下来写导航的标题，添加一个类是 .navbar-header的div元素。
			他的内部添加超链接建立a元素，类为.navbar-brand元素。
		然后在与标题同级的下面添加无序列表ul。ul的类应当有.nav .navbar-nav。希望选项居右，则在类中添加.navbar-right类。
			在无序列表之中加入多个选项条目li。
				选项条目之中建立锚元素，指向相对应的内容。我们默认第一个为选中状态，所以将第一个条目li中添加类.active。
					想要在条目处添加一个小图标，可以在bootstrap官网-文档-组件里查看可用图标，并复制图标的类。在<a></a>元素中添加span元素，并把span元素的类设为复制内容。在这里一开始测试不显示图标，控制台报错：Failed to load resource: the server responded with a status of 404 (Not Found)。应当将 bootstrap3 中的 fonts 文件（里面有 glyphicons-halflings-regular）放到与 css 目录的同级，需要图片资源，在 css 文件里写了图片的路径所以应当将图片与路径所对应。

至此，导航栏就大致完成了。现在想要一个响应式的导航，在大屏幕设备上是横着显示，并且在手机等小屏幕设备上导航栏的条目先进行隐藏，用户点击时在垂直排列弹出。要折叠的内容必须包裹在带有 .collapse、.navbar-collapse 等类的 <div> 元素中。折叠起来的导航栏实际上是一个带有 .navbar-toggle 类及两个 data- 元素的按钮。第一个是 data-toggle，用于告诉 JavaScript 需要对按钮做什么，第二个是 data-target，指示要切换到哪一个元素。三个带有 .icon-bar 类的 <span> 创建所谓的汉堡按钮。这些会切换为 .nav-collapse <div> 中的元素。并且必须要有collapse折叠插件。

下面将导航栏进行响应式改造：

创建一个div元素，他的类为.collapse .navbar-collapse。然后将之前的无序列表的所有内容剪切到这个div中去。现在实现了折叠功能，但是现在还无法调出选项。现在为这个div元素进行id的设置以便后续操作，这里将div的id设置为navbar-collapse。
然后需要一个按钮，可以调出折叠选项。在类为nav-header的div元素中添加按钮。将其类设置为navbar-toggle，data-toggle设置为collapse，data-target设置为#navbar-collapse，使其能够在大屏幕时隐藏，小屏幕时显示并且绑定无序列表选项。想把按钮设置成汉堡样式的，可以在按钮中添加三个span元素，span元素的类设置为icon-bar。

注意到，在小屏幕点出选项时，发现导航栏标志与选项之间有一小段空隙，下面去除空隙。可以把无序列表ul处添加样式style="margin-top: 0"，去掉间隙。

二、响应式轮播图：

使用轮播（Carousel）插件是可以显示一个循环播放元素的通用组件。为了实现轮播，只需要添加带有该标记的代码即可。

下面建立轮播图：

首先建立一个div元素，将id命名为myCarousel，他的类设置为carousel与slide。现在由于之前的导航栏固定在视窗的最上方，所以如果不对此div元素进行修饰的话，两者之间将会重叠。将css样式的的margin的top改为50px。
	然后在div元素里创建一个无序列表ul，大致相当于轮播图的索引。他的类设置为carousel-indicators。
		在无序列表ul中添加项目li。添加完图片之后对轮播图最外层div与图片的div进行绑定。添加data-target属性并设置为最外层div的id即myCarousel。添加data-slide-to属性并设置为图片对应div的编号0、1、2、3。最后，将第一个li设置为首选。
	在无序列表同级别之下放置轮播图，创建div进行存放。并且将他的类设置为.carousel-inner。最后利用css设置让div居中。
		每个图片又独占一个div，中间加入img元素引入资源。应当把每一个div的类设置为.item。并且将第一个div的类添加active。
	做完以上全部内容之后下面添加两个箭头辅助手动轮播图切换。在与无序列表、所有图片的总容器同级的下面创建两个a锚元素。内容分别是&lsaquo与&rsaquo，编译表为左箭头与右箭头。对a元素添加href属性并设置值为#myCarousel来对轮播图进行绑定，添加data-slide属性并设置值为prev与next来对箭头设置功能，将类设置为.carousel-control .left与.right。

以上大体实现了轮播图的功能，但是还有两个缺陷，一是箭头的大小太小；二是在视窗的大小改变的时候，箭头的位置不能随之相应改变。对于第一个问题，可以修改css样式文件。对于第二个问题，则需要实时修改箭头的行高，利用jquery：
	`$(function () {
        $(".carousel-control").css("line-height", $(".carousel-inner img").height() + "px");
        $(window).resize(function () {
            var $height = $(".carousel-inner img").eq(0).height() ||
                $(".carousel-inner img").eq(1).height() ||
                $(".carousel-inner img").eq(2).height() ||
                $(".carousel-inner img").eq(3).height();
            $(".carousel-control").css("line-height", $height + "px");
        });
    });`

坠吼添加自动轮播功能：
    `$("#myCarousel").carousel({
            interval : 3000,
        });`

三、首页内容：

首先对之前的代码进行改进：我们用的设置行高的居中方法还是太麻烦，可以使用图标来代替转义字符左右箭头。首先将箭头转译字符删掉，添加为一个span元素，他的类与之前的图标类似。这样就把图标自动的居中了，之前相对应的居中的行高css就可以删掉了。

下面开始写首页内容，包括一系列的标题、文本与图片。

在与导航栏、轮播图同级别的下方建立首页内容div元素，他的类为.tab1。对.tab1进行css设置，让他的上下空出30px，字体颜色为#666。
	在首页内容div元素中，建立一个容器div，他的类应为.container。
		在container的div元素之中建立h2元素与p元素，添加内容。为了能够控制元素样式，为h2元素与p元素分别添加类.tab-h2与.tab-p。下面写h2与p元素的css文件。设置h2的字体大小为30px，p的字体大小为18px，然后将两者居中，每个字体有1个像素的间距，h2的文本色号为#0059b2。

以上为首页内容的简介，下面写详细内容部分。需要页面能够为响应式布局。bootstrap栅栏框架布局中, 将容器平均整个分为了 12 格, 也就是说, 一个容器具有 12 个相同大小格子, 其中的元素可以占若干个等分，因此这种布局具有自适应屏幕的特点。通常栅栏格的每个样式类依附在. row 类的基础之上, 而 row 通常都会在.Container 类中进行。在同一个元素上使用了两个不同的类, 那么 bootstrap 会根据设备屏幕的大小来选择合适的样式使用, 如果设备的屏幕大小不在类的范围内, 那么它会忽略这两个类；col-xs-*: 最小屏幕设备适用;
	col-sm-*: 平板电脑设备适用；
	col-md-*: 中等屏幕 pc 适用；
	col-lg-*: 大屏幕设备适用, 大屏 pc；
	col-md-offset-4: 将列从当前列向后移动 4 个列；
	col-md-push-4: 将列开始的顺序调整到第 4 列之后；
	col-md-pull-4: 将列开始的顺序调整到第 4 列上；

在container的div中的与h2、p元素之下的同级区域建立新的div元素，他的类是.row。
	在类为row的div元素之中建立若干个div元素这些就是所谓的栅栏。我们希望在中等屏幕大小的设备上显示两列两行，所以应该将占的分数设置为12/2=6，所以这些div元素的类应该为.col-md-6。
		我们把这些小的栅栏之中放上内容，所以在以上各个div元素之中都建立一个div，他的类可以设置为.media：该 class 允许将媒体对象里的多媒体（图像、视频、音频）浮动到内容区块的左边或者右边。
			在每一个多媒体div元素中，我们在最左边放一张图片，右边为主体内容。所以在每一个media的div中，建立两个div元素分别为图片区.media-left与内容区.media-body。
				在.media-left中需要放一个能够点击的图片。因此建立a元素，指向某页面。
					在a元素中建立img元素放置图片，img的类应为.media-object。
				在.media-body中需要放文字内容，需要有标题与段落。因此建立h4元素与p元素。其中h4元素的类为.media-heading。

以上大体做完了内容部分，但是4个div之间上下相连贴在一块了，并存在其他的边距问题。修改css将内边距调一下。之后在css文件中添加不同设备屏幕的样式，bootstrap3以移动端为优先设计，所有css中默认的就是在移动端的样式。所以我们把默认字体大小进行修改。并且在css中创建新的样式：
	`@media (min-width: 768px) {
	    .tab-h2 {
	        font-size: 26px;
	    }
	    .tab-p {
	        font-size: 16px;
	    }
	}
	@media (min-width: 992px) {
	    .tab-h2 {
	        font-size: 28px;
	    }
	    .tab-p {
	        font-size: 17px;
	    }
	}
	@media (min-width: 1200px) {
	    .tab-h2 {
	        font-size: 30px;
	    }
	    .tab-p {
	        font-size: 18px;
	    }
	}`

接下来制作网站首页的下方的内容区域：

创建一个div元素，它的类设置为tab2。
	其中再创建一个容器div，类为.container。
		想要在下方建立多个横向条状区域来显示信息，所以在类为container的div元素之中建立一个div元素，他的类是.row。
			接着在.row的div中建立两个个div元素，想要获得一行两列左图右字或者左字右图的效果，则把类设置为.col-md-6。
				在之前建立的第一个div中创建h3元素与p元素。
				在之前建立的第二个div中创建img元素，将其类设置为.img-responsive与.center-block。
以上就是一个条目，将上面的内容复制若干，略作修改即可。设置css：
    `.tab2{
	    background-color: #eee;
	    padding:60px 40px;
	    text-align: center;
		}
	.tab3{
	     padding:60px;
	    text-align: center;
	 }
	.tab2 img{
	    width : 50%;
	    height : 20%;
	}
	.tab2 img{
	     width : 40%;
	     height : 30%;
	 }`
但是现在在大屏幕设备上显示时虽然是图片一左一右，而在手机等设备上显示时图片一上一下，在小屏幕上留有很大空隙，并且字体在小屏幕与大屏幕上都一样大与文本不能垂直居中等，以上问题应当改进。
所以在所有类为.col-md-6的元素上添加类.col-sm-6。
在类为.col-md-6的元素上添加类text，在css中调整大屏幕字体。
    `.text h3 {
	    font-size: 20px;
	}
	.text p {
	    font-size: 14px;
	}
	@media (min-width: 768px) {
		// ...
	    .text h3 {
	        font-size: 22px;
	    }
	    .text p {
	        font-size: 15px;
	    }
	}
	@media (min-width: 992px) {
		// ...
	    .text h3 {
	        font-size: 24px;
	    }
	    .text p {
	        font-size: 16px;
	    }
	}
	@media (min-width: 1200px) {
		// ...
	    .text h3 {
	        font-size: 26px;
	    }
	    .text p {
	        font-size: 18px;
	    }
	}`
为了调整图片在小屏幕设备上的位置，将类为.col-md-6的div元素添加类.table2-img与.table-text，并修改css文件设置位置：
	`@media (min-width: 768px) {
	    .tab-h2 {
		// ...
	    .tab2-text {
	        float: right;
	    }
	    .tab2-img {
	        float: left;
	    }
	}
	@media (min-width: 992px) {
		// ...
	    .tab2-text {
	        float: left;
	    }
	    .tab2-img {
	        float: right;
	    }}
	@media (min-width: 1200px) {
		// ...
	    .tab2-text {
	        float: left;
	    }
	    .tab2-img {
	        float: right;
	    }
	}`
为了让文字垂直居中，将文字div添加id或者类方便获取元素，现在将两处文字div添加类.jz，将两处图片添加类.tp，利用jquery设置偏移（文字div边距）：
	`for (var i = 0; i < 2; i++) {
        $(".jz").eq(i).css("margin-top", ($(".tp").eq(i).height() - $(".jz").eq(i).height()) / 2 + "px");
        $(window).resize(function () {
            $(".jz").eq(i).css("margin-top", ($(".tp").eq(i).height() - $(".jz").eq(i).height()) / 2 + "px");
        });
     }`


下面制作底部的页脚网站信息：

首先在body中首页内容div后边创建footer元素。
	同理，在footer中创建容器div，类为.container。
		在div元素中创建两个p元素，内容如下:
			`<p>意见建议 | 商业合作 | 加入我们</p>
        	<p>鲁 ICP 备 187425272，&copy 2016-2020 大连理工大学，Powered by Bootstrap<p>`
主要是对其进行css设置：
	`footer {
	    background-color: #eee;
	    border-top: 1px solid;
	    padding: 20px;
	    text-align: center;
	}`

四、子栏目内容：

超大屏幕（Jumbotron）。顾名思义该组件可以增加标题的大小，并为登陆页面内容添加更多的外边距（margin）。使用超大屏幕（Jumbotron）的步骤如下：
创建一个带有 class .jumbotron. 的容器 <div>。
除了更大的 <h1>，字体粗细 font-weight 被减为 200。

想在资讯栏中做子栏目内容，新建html文件只保留导航栏与页脚，首先将导航栏中的资讯栏设为active。
首先建立一个div，他的类是.jumbotron。将css中.jumbotron的div背景改为灰色图片。
	在创建的div中新创建一个容器div，类为.container。
		<hgroup> 标签被用来对标题元素进行分组。当标题有多个层级（副标题）时，<hgroup> 元素被用来对一系列 <h1> - <h6> 元素进行分组。在容器中，创建一个群组。
			在新建的群组之中创建两个标题h1与h4。并修改相应的css样式。

顶部就做好了，下面开始填充各种新闻资讯内容：

新建一个div，id自设为.information。将其背景颜色修改为#eee并调整其他部分颜色。这是整个内容区的背景。
	紧接着在内部创建一个div容器.container。
		下面开始做栅格布局，新建一个div，将其类设置为.row。
			想要做成左8右4的布局，因此新建两个div类为.col-md-8与.col-md-4。首先考虑所测内容。
				.container 类用于固定宽度并支持响应式布局的容器。而.container-fluid 类用于 100% 宽度，占据全部外层（viewport）的容器。 .container-fluid可以将固定宽度的栅格布局转换为 100% 宽度的布局。它是一个流动容器。创建div其类为.container-fluid。
					然后再从流动容器之中进行栅格布局。创建类为.row的div。
						下面将左侧的内容分成两部分，新建两个div类为.col-md-5与.col-md-7。
							在新建的div中分别添加图片与文本。
为了控制刚才做的若干个条目，将几个.row的div添加类.info-content。对其css进行设置。

现在注意到在小屏幕上显示时，文本会自动换行。不想让网页的文本移动到图片下边，可以添加类使得在小屏幕设备上也使用栅栏式布局，所以在图片与文本所在的栅格div处添加类.col-sm-5 .col-xs-5或者.col-sm-7 .col-xs-7。最后再对不同的设备上的字体进行css的设置。然后注意在中大屏幕上的行h4标题有可能会换行，这样不美观。现在不想让他换行，而是希望只显示一行，过多内容用。。。来表示。可以修改在中大屏幕的css文件：
	`@media (min-width: 992px) {
	    .container h4 {
	        overflow: hidden;
	        white-space: nowrap;
	        text-overflow: ellipsis;
	    }
	}`

最后制作窗口右侧的内容，同样需要在之前写好的.col-md-4的div中添加类.info-right。并修改其css使得与左侧的样式相同或者相适应。
	在右侧区域应当有一个标题，创建一个blockquote元素，<blockquote> 标签定义块引用。
	<blockquote> 与 </blockquote> 之间的所有文本都会从常规文本中分离出来，经常会在左、右两边进行缩进（增加外边距，块引用拥有它们自己的空间。
		在<blockquote>中创建h2元素并添加标题。
	然后在标题下方建立一个div作为容器。由于想要使用栅栏式布局是继承的右侧一部分区域，所以类为.container-fluid。
		使用栅栏式布局，在内部创建一个div，其类为.row。
			之后的内容与左侧一样。修改css样式。