## Servlet 提交表单



表单的提交基本上有两种方式：

1. get
2. post

首先表单在html中需要有一个form元素，在这个form元素中用户进行各项数据的填写，其中form标签有一个action属性，之前学习ajax或者nodejs的直到，这个属性是用来指定用户的数据向哪里发送的，也就是处理这个表单的程序所在的url，同时form还有一个methods的属性，这个属性是用来指定表单向后端提交的方法，比如说最常用的是post与get。form元素中就是各种的input元素用以用户输入信息，注意这些元素必须要有一个name属性，这个属性用来作为表单提交的时候的各项信息的键。这个表单的最后可以有一个type属性为submit的按钮，用于确认提交。可以在web应用目录下新建一个html页面如下：

```html
// login.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <form action="loginServlet" methods="get">
        <label>用户名</label>
        <input type="text" name="username">
        <label>密码</label>
        <input type="password" name="password">
        <input type="submit" value="LOG IN">
    </form>
</body>
</html>
```

现在的登录表单就做完了，然后后端需要一个servlet程序来对表单进行处理，在src目录的包中新建一个login.servelt。顺便吐槽一句，idea中默认创建的servlet不是引入包，而是写的全名，真的好难看。

```java
package gakki;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "LoginServlet")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doPost....");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doGet....");
    }
}
```

现在当收到相应的get或者post请求的时候，就会在控制台打印输出相应的方法名。

接下来的步骤与之前一样，就是在web.xml中进行注册servlet与servlet的映射。于是修改web.xml文件如下：

```xml
<servlet>
    <display-name>LoginServlet</display-name>
    <servlet-name>LoginServlet</servlet-name>
    <servlet-class>gakki.LoginServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>LoginServlet</servlet-name>
    <url-pattern>/loginServlet</url-pattern>
</servlet-mapping>
```

然后启动项目，在浏览器本地服务器地址后边加上刚才做的login.html，输入信息并点击提交。这时候可以看到Server的控制台中显示了doGet...，这样就说明后端接收到了发送的表单数据。

### Servlet 生命周期

1. new instance 实例化创建开始，
2. 调用 init 方法进行初始化
3. servlet 进入ready准备就绪状态
4. 客户端由请求的时候，这个servlet实例就会不断的service并返回ready状态。（service分别调用doGet或者goPost方法）
5. 如果对服务器进行关闭时候，那么servlet调用destroy。

回到servlet实例中，查看继承父类的declaration，发现以上的这些方法都是继承的父类的方法。现在为了研究servlet的生命周期，进行以上方法的重写。

```java
package gakki;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "LoginServlet")
public class LoginServlet extends HttpServlet {
    public LoginServlet () {
        super();
        System.out.println("new LoginServlet...");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doPost...");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doGet...");
    }

    public void init () throws ServletException {
        super.init();
        System.out.println("init...");
    }

    public void destroy () {
        super.destroy();
        System.out.println("destroy...");
    }
}
```

现在启动应用 -> 填写表单 -> 关闭应用的时候，会看到控制台输出顺序就是按照上边所说的顺序：

```
new LoginServlet...
init...
doGet...
doGet...
destroy...
```



### Servlet 创建页面

创建页面，其实就是在doGet或者是doPost这两个接收请求并作出响应的函数中进行html字符串的返回。

首先在response实例调用getWriter方法获得一个打印流的实例。然后用这个实例调用write方法写入html字符串。

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  System.out.println("doPost...");
  PrintWriter ps = response.getWriter();
  ps.print("<h1>HELLO GAKKI</h1>");
}
```

现在启动项目并输入对应servlet在web.xml中的url，就可以看到输出的一级标题。



这是简单的html的输出，如果要输出一个完成的html文档，也可以使用类 StringBuilder，如下：

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  System.out.println("doPost...");

  response.setCharacterEncoding("utf-8");
  PrintWriter pw = response.getWriter();
  // pw.print("<h1>HELLO GAKKI</h1>");
  StringBuilder sb = new StringBuilder();
  sb.append("<!DOCTYPE html>");
  sb.append("<html lang=\"en\">");
    sb.append("<head>");
      sb.append("<meta charset=\"utf-8\">");
      sb.append("<title>");
      	sb.append("HELLO!");
      sb.append("</title>");
    sb.append("</head>");
    sb.append("<body>");
      sb.append("<h1>新垣结衣的微笑就由我来守护</h1>");
      sb.append("<div>");
        sb.append("新垣结衣（Aragaki Yui），1988年6月11日出生于冲绳县那霸市。日本女演员、歌手、模特。毕业于日出高中[1]  。......\n");
      sb.append("</div>");
    sb.append("</body>");
  sb.append("</html>");
  pw.print(sb.toString());
}
```

其中使用了StringBuilder 类进行html字符串内容的拼接，最后将StringBuilder实例调用toString方法来转换成字符串。通过PrintWriter实例调用print方法进行打印。然后这里很有可能出现中文乱码的问题，这是由于服务器端的字符编码与客户端的字符编码不同而导致的，因为客户端一般是使用utl-8编码，而服务器端一般是使用ISO-8859-1编码。所以在编码的时候可以将PrintWriter来调用setCharacterEncoding方法来设置字符的编码，当然编码的格式就是utf-8。现在再启动web应用并发送相应的url进行请求，就会得到上边编写的html页面。

另外servelt还有几个有用的功能：

1. 请求重定向redirect：

   ```java
   protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     System.out.println("doPost...");
     response.sendRedirect("http://www.baidu.com/");
   }
   ```

   HttpServletResponse 这个响应实例对象调用sendRedirect方法，参数就是想要重定向跳转的url，注意这里如果想要跳转到百度，那么必须要加上http或者https等请求，否则响应会将闯进去的url作为一个当前服务器的相对路径来跳转，当然如果想要在当前主机内跳转是没问题的。但是如果想要跳转到其他的域名的时候，就需要加上协议名，即一个完整的url格式的字符串。

2. 请求转发forward：

   ```java
   request.getRequestDispatcher("TestServlet").forward(request, response);
   ```

   这种情况很多用来比如说用户登录，先达到一个临时的页面，但是这个请求还没有结束，而是继续向后进行请求。请求转发与请求重定向的区别就在于：请求转发是服务器的行为，而请求重定向是客户端的行为（服务器返回信息让客户端对某个地址进行另一个请求）。另外请求重定向是一个新的请求，之前的请求的数据就没有了；而请求转发还包含着之前请求的数据。

   步骤就是request请求对象调用getRequestDispatcher方法，传入一个web.xml中注册过的元素。然后调用forward方法继续携带着request对象与response对象对这个目标进行请求。

3. 请求包含include：

   ```java
   PrintWriter pw = response.getWriter();
   pw.write("<h1>INCLUDE</h1>");
   request.getRequestDispatcher("TestServlet").include(request, response);
   ```

   感觉其实就是forward的加强版，可以在中间进行输出。

最后发现这里边有坑，我一开始发现好好的forward与include无效了。后来检查了半天发现并没有错，可能是缓存的原因，刷新页面就好了，用的chrome浏览器。这里边的原理我还没有搞明白，先挖一个坑。



参考链接:

1. [form 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)
2. [post get 区别](http://www.cnblogs.com/hyddd/archive/2009/03/31/1426026.html)
3. [response request 中文乱码](http://blog.csdn.net/zhupengqq/article/details/51093307)
4. [redirect forward 的区别](http://www.cnblogs.com/Qian123/p/5345527.html)