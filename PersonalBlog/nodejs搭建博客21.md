---
title: nodejs搭建博客21
date: 2017-05-03 09:58:26
tags:
---


下面要做的是对左侧的个人信息与状态发布的两个功能进行修改。我想把左侧分成两个区域，然后点击其中一个区域的时候，这个区域就会放大至整个左侧区域。

后首先修改index的pug模板，注意到#information与#moments已经是在两个div中了，现在只需要修改css样式把两个区域看起来是两个部分。我想把那个分割线单独拿出来，这样左端就分成了三个区域。在内容被展之后，同时应当有个返回的按钮。我一开始的jquery代码是这么写的：

    $information.on('click', function () {
        $moments.hide();
        $return.show();
        $(this).css('height', '99%');
    });
    $moments.on('click', function () {
        $information.hide();
        $return.show();
        $(this).css('height', '99%');
    });
    $return.on('click', function (event) {
        $leftItem.show();
        $information.css('height', '49%');
        $moments.css('height', '50%');
    });
但是点击return没有效果，就很纳闷，为什么呢？其实还是事件冒泡，return是在information或者moments里的，所以当执行完点击return，就会执行点击左侧的这两个区域的点击的代码。所以应当阻止事件冒泡，并且抽象这两个函数：

	$leftItem.on('click', function () {
        $(this).siblings('.left-item').hide();
        $return.show();
        $(this).css('height', '99%');
        console.log('clicked 1');
    });
    $return.on('click', function (event) {
        $leftItem.show();
        $information.css('height', '49%');
        $moments.css('height', '50%');
        $return.hide();
        event.stopPropagation();
    });
现在做完了这一部分的内容，需要对后端的多条状态进行展示。状态可能有三种，一是纯文字，二是纯图片，三是文字与图片混合。我们之前展示的就是一个文字与图片混合的状态。现在是想让状态moments还没有打开的时候显示最新的有图片的状态（这条状态不一定是最新的，因为有可能有时间上更新但是是纯文字的状态），但是但我们点击moments来展开所有状态的时候，就按照时间进行展示。

这个功能的的前端很简单，但是后端实现难度比较大。因为我们的对图片进行储存不能用之前的方法来操作mongodb，而图片的展示等逻辑最好是依赖于数据库。我们现在的展示的一张图片是直接存放在服务器文件夹里的。经过一番百度，很多人说的是对图片传到云端，然后在mongodb中储存url，在利用url进行图片的展示。我觉得不好，首先要上传图片到某云的url不能自动处理，然后是上传的图片的隐私性不能保证。

所以我就在想，要不然用数据库储存在服务器上的图片的路径。所以说这样我们就是和上传博客一样的，但是储存的关系却利用数据库。所以之前的picture的schema就不要了，重新创建一个新的描述moments的schema。所以当一条moments上传的时候，我们收到的可能是包括一条moods与几张图片。

之前写的通过ajax的方法上传文件用的时候没有问题，但是现在我在用表单提交多个图片的时候，发现只有一张图片上传上去了，而且之后的回调函数不能执行。经查资料得知，上传多个文件需要把每个文件都进行发送。然后我就折腾了快一天，终于发现了一直不成功的问题。。。之前的表单最后的input是submit类型，但是，我给他绑定了click事件，然后这一此我也把默认事件给阻止了，但是就是不能够正确上传图片。。。讲道理的话，监听事件会在默认事件之前完成，然后可以在这中间的地方阻止默认事件。但是这里submit不知为什么还是会跳转。这里应该研究一下，回去看看书。嗯。

在控制台可以看到，传进去文件之后，可以看到监测如下结果：

    console.log('1: ' + req.files);
    console.log(req.body);
    console.log('3: ' + req.picture);
    console.log('4: ' + req.body.moods);
![](http://i.imgur.com/ECLfzwr.png)
所以我们就可以将其中的值取出然后存放进数据库，其中我一直感到很神奇的地方就是req.file.filename。请求经过multer中间件后可以有这个req.file属性。我们得到一个数组的文件，也就会有一个长度不定的数组的文件名，把这个文件名连同moods一起存放在一个数据的条目之中。

    for (var i  = 0; i < req.files.length; i++) {
        console.log(req.files[i].filename)
    }
    for (var file in req.files) {
        address.push(file.filename);
        console.log(address);
    }
我一开始用的是下边的写法，可是结果全是undefined。
![](http://i.imgur.com/h2PMlDp.png)
这是因为下边这种for...in...的写法是只能用在对象的属性遍历上的。而现在的address是一个数组。
修改完之后，moments储存成功。然后我们需要做的是对moments的展示。我们首先添加几个moments，其中包括纯文字的与纯图片的。我们首页的那一张图片的逻辑，就是在数据库中查找哪一条数据的时间最早并且有图片。就把这个图片显示出来。那现在为了按照时间排序，我们应该给记录添加一个时间的字段。同时，我们也可以给记录添加一个是否有图片的字段，方便之后的查询。这样我们对moments数据重新添加。同时把之前的时间日期的代码封装成一个函数，在博客与状态中进行调用。并且为了以后的排序与显示方便，我们对时间保存两个字段，一个是要显示的时间，一个就是用来排序的时间戳。

现在就是要想对index进行渲染的时候进行查找，按照时间戳，时间戳表示1970年1月1日到目前的毫秒数，所以我们如果想要最近的信息，那么应该找找时间戳最大的。所以应该按照降序排列。一开始还没有展开moments我们只需要一条图片信息就够了。所以对index.pug文件与indexServer.js进行修改：

    .picture
      img(src = momentPicUrl)
    .moods
      p= momentMoods
这样的话我们就该从后端向模板再发送两个数据。

    moments.find({
        hasPic: true
    }).limit(1).sort('-sortTime').then(function (lastMoment) {
        var pictureName = lastMoment[0].picture[0];
        var moods = lastMoment[0].moods;
    });
把两个查询的代码合并一下：

    moments.findOne({
        hasPic: true
    }).sort('-sortTime').then(function (lastMoment) {
        var pictureName = lastMoment[0].picture[0];
        var moods = lastMoment[0].moods;
        blogs.count().then(function (count) {
            var lastPage = Math.ceil(count / articleNumber);
            blogs.find().limit(articleNumber).skip(articleNumber * (pages - 1)).sort('-date')
                .then(function (blogs) {
                    console.log('当前的pages是：' + pages);
                    res.render('index', {
                        blogs: blogs,
                        pages: pages,
                        lastPage: lastPage,
                        showSignin: app.SendInfo.showSignin,
                        showRegister: app.SendInfo.showRegister,
                        showInformation: app.SendInfo.showInformation,
                        username: app.SendInfo.username,
                        isAdmin: app.SendInfo.isAdmin,
                        momentPicUrl: pictureName,
                        momentMoods: moods
                    });
                });
        });
    });
OK了。











参考链接：
1. [http://blog.csdn.net/joeyon1985/article/details/46652717](http://blog.csdn.net/joeyon1985/article/details/46652717)
2. [https://cnodejs.org/topic/5508e5c23135610a365b012a](https://cnodejs.org/topic/5508e5c23135610a365b012a)
3. [http://mongoosejs.com/docs/schematypes.html](http://mongoosejs.com/docs/schematypes.html)
4. [http://mongoosejs.com/docs/schematypes.html](http://mongoosejs.com/docs/schematypes.html)
5. [https://segmentfault.com/q/1010000004218827/a-1020000008349718](https://segmentfault.com/q/1010000004218827/a-1020000008349718)
6. [https://segmentfault.com/q/1010000000483901](https://segmentfault.com/q/1010000000483901)
7. [http://bbs.csdn.net/topics/391002313](http://bbs.csdn.net/topics/391002313)
8. [http://blog.csdn.net/zljjava/article/details/9932787](http://blog.csdn.net/zljjava/article/details/9932787)
9. [https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/append](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/append)
10. [http://www.cnblogs.com/fangshidaima/p/5910604.html](http://www.cnblogs.com/fangshidaima/p/5910604.html)
11. [http://www.w3school.com.cn/js/js_loop_for.asp](http://www.w3school.com.cn/js/js_loop_for.asp)
12. [http://codego.net/551501/](http://codego.net/551501/)
13. [http://www.cnblogs.com/bugda/p/6036282.html](http://www.cnblogs.com/bugda/p/6036282.html)
