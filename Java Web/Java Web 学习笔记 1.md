## Java Web 学习笔记 1



Java web 应用由一组 servlet、HTML页面、类、以及其他可以被绑定的资源构成。他可以在个供应商提供的各种实现 servlet 规范的 servlet 容器中运行。

Java Web 应用可以包含以下的几种内容：

1. Servlet
2. 实用类
3. 静态资源 (HTML 等)
4. JSP
5. 描述 Web 应用的信息等

Servlet 容器为 Java web 应用提供运行时容器，他负责管理 Servlet 与 JSP 的生命周期，以及管理他们的共享数据。tomcat 就是目前流行的一种 Servlet 容器。



#### 部署 tomcat：

首先在 tomcat 的官网下载 tomcat ，进行解压缩之后进入 bin 目录，打开 startup.bat 就可以启动服务器（前提是已经配置好java_home环境，并且当前服务器制定的端口没有被占用）。如果要需改服务器的端口号，找到conf目录下的 server.xml 配置文件，对其进行修改：其中找到有一个connector 的标签，这里的端口就是服务器的端口号，对他进行修改即可（注意不能修改成系统占用的端口或是其他程序已经占用的端口）。重启服务器就可以生效更换端口号。

这个时候在浏览器打开本地服务器的8080端口就可以看到服务器已经运行。tomcat 提供了一个管理程序，用于查看部署到 tomcat 的 web 应用。在服务器的主页有一个 manager app 的入口，点击这个超链接会弹出对话框输入账户与密码。现在是没有这个账户与密码的，可以在conf目录中的tomcat-users.xml文件中进行配置。在其中的标签中嵌套标签配置如下：

```
<role rolename="manager-gui"/>
<user username="gakki" password="gakki" roles="manager-gui"/>
```

当然其中的用户名与密码可以自己设置。然后重新启动服务器。现在就可以登录这个 manager 进行查看了。

Servlet 定义了 web 应用的目录层次。以一个名为app的web应用为例：

```
	APP
	 |---- WEB-INF
	 |		|----- classes
	 | 				|----- haha
	 |				|		|----- HelloServlet.class
	 |				|	   	|----- Gakki.class		
	 |				|	   			
	 |				|----- lib
     |                |		 |----- gakki.jar
     |                |		 |----- ok.jar
     |                |
     |				 |----- web.xml
     |----- index.jsp
```



以上就是大体的介绍，下面使用idea（版本为2017.2.5）来创建第一个servlet项目。

1. 首先新建一个项目，web -> new -> project
2. 在新建项目的时候在 java EE 下面的 web application 复选框上打勾，然后确定。
3. 这时候就新建成了一个java项目，在src目录下可以新建java文件。
4. 右击src目录，new -> servlet。自行设定文件名与包名。
5. 加入需要依赖的tomcat目录下的servlet-api.jar包。file -> project structure -> modules -> dependencies -> 点击加号"+" -> JARs or directories -> 选择tomcat服务器目录下的lib目录中的servlet-api.jar包。

这样就在idea中将servlet的环境配置好了。

servlet 容器负责 servlet 与客户的通信以及调用 servlet 的方法。servlet 与客户的通信采用"请求 / 响应"的模式。servlet 可以完成：

1. 创建并返回基于客户请求的动态HTML页面。
2. 创建可以嵌入到现有HTML内部的HTML部分页面（片段）。
3. 与其他服务器资源（如数据库）进行通信。

servlet容器可以掌控servlet的整个生命周期。

现在新建一个 java web 应用，注意其中有一个web.xml，这个文件是用来对整个的工程应用进行配置。

一开始的时候配置是这个样子的：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <servlet>
        <servlet-name>FirstServlet</servlet-name>
        <servlet-class>gakki.FirstServlet</servlet-class>
    </servlet>
</web-app>
```



然后现在可以给项目加上一个欢迎页面，xml标签为welcome-file-list，其中包含若干个子项welcome-file，用以表示显示的html文件或者jsp页面。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <display-name>HELLO GAKKI</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <servlet>
        <servlet-name>FirstServlet</servlet-name>
        <servlet-class>gakki.FirstServlet</servlet-class>
    </servlet>
</web-app>
```

然后在当前web app项目目录下创建对应的资源文件，比如说其中第一个的index.html，我就在WEB-INF目录同级目录这里创建一个index.html并编辑内容，然后在idea的右上角点击run按钮来启动项目，这个时候（注意tomcat服务器端口不要被占用）就会像webstorm中的那样，自动在浏览器打开本地服务器的相应端口，显示刚才编辑的index.html界面。如下

![Image 025](D:\picked\Image 025.png)

然后来注意一下项目SRC目录下的servlet文件，这个类必须要继承 javax.servlet.http.HttpServlet 这个类并且覆盖doPost与doGet这两个方法。之前做过nodejs后端，这个就很好理解了，就是对请求的处理。这里也可以在doPost方法中调用doGet，如果这两个方法差别不大的话，其实功能完全可以使用只一个函数来精简代码。

原始代码如下：

```java
import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;

public class FirstServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }
}
```

可以看到，默认两个函数的返回值都为空，接收的参数有两个，一是http请求，二是http相应。并且抛出异常。下面就可以在doGet方法中写业务逻辑：

```java
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.*;
import javax.servlet.http.*;
public class FirstServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter pw = response.getWriter();
        pw.println("HELLO SERVLET");
    }
}
```

这里通过响应的response对象来调用getWriter方法获得一个PrintWriter对象，然后这个打印流就会将内容输出到页面上。

然后这个servlet类编写好之后，需要到刚才的web.xml文件中进行配置，当然这里由于servlet与web.xml文件都是idea自动生成的，所以在xml中会看到不用再手动声明。声明一个servlet类很简单，需要使用servlet标签，其中包裹两项，一个就是servlet-name，这个就填写servlet类的名称；另一个是servlet-class，这个标签填写对应servlet类的全名，要包括包名。

但是idea只是自动生成了这些，我们自己还要写映射，使得客户端可以调用servlet。标签名为servlet-mapping。对于映射，也包含一个标签servlet-name，这个就是和上边的servlet中填写的是一样的。然后有一个url-parttern的标签，这个标签就是用来让客户端调用映射的。比如说我这里的url-parttern标签填写“/hello”（注意不管是什么url，最前面的斜杠是必须的）。然后客户端在对/hello这个url进行请求的时候，就会调用上边的servlet-name所映射的servlet。

现在重新启动程序，在浏览器的地址栏中进行url-parttern的请求，就可以看到在servlet类中设定的输出。





参考链接：

1. [idea servlet](http://www.cnblogs.com/kwliu/p/4773517.html) 
2. [idea 配置 tomcat 环境](http://blog.csdn.net/mr_ooo/article/details/50976205)
3. [java api](http://tool.oschina.net/apidocs/apidoc?api=jdk-zh)