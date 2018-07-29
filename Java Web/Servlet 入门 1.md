# Servlet 入门



以《JSP&Servlet学习笔记》为参考，现在以一个简单的微博应用为例，跟着练习Servlet与JSP。当前的运行与开发环境为：

1. IDE: idea 2017.2.5
2. Servlet 容器: tomcat9.0

## 实现会员注册功能：

首先新建一个java web应用，加入需要依赖的tomcat目录下的servlet-api.jar包。file -> project structure -> modules -> dependencies -> 点击加号"+" -> JARs or directories -> 选择tomcat服务器目录下的lib目录中的servlet-api.jar包。在src目录中创建一个包，其中新建一个RegisterServlet。自己写这个servlet类也可以，不过在idea中，有写好的servlet模板可以使用：

```java
package weibo;

import java.io.IOException;

public class RegisterServlet extends javax.servlet.http.HttpServlet {

    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }
}
```

如果不用模板自己写的话就是创建一个继承HttpServlet（javax.servlet.http.HttpServlet）的类，并重写doGet与doPost两个方法。如下：

```java
// RegisterServlet
package weibo;

import javax.servlet.annotation.WebServlet;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

@WebServlet("/register.do")
public class RegisterServlet extends javax.servlet.http.HttpServlet {

    private final String USERS = "C:\\Users\\liyanxiang\\Desktop";
    private final String SUCCESS_VIEW = "success.view";
    private final String ERROR_VIEW = "error.view";

    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        // 获得请求参数
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String confirmedPasswd = request.getParameter("confirmedPasswd");
        List<String> errors = new ArrayList<>();
        // 判断表单输入是否合法
        if (isInvalidEmail(email)) {
            errors.add("未填写邮箱或邮箱格式不正确");
        }
        if (isInvalidUsername(username)) {
            errors.add("用户名为空或已存在");
        }
        if (isInvalidPassword(password, confirmedPasswd)) {
            errors.add("请确认密码符合格式并再次输入密码");
        }
        // 判断表单是否合法后的执行操作
        String resultPage = ERROR_VIEW;
        if  (!errors.isEmpty()) {
            request.setAttribute("errors", errors);
        } else {
            resultPage = SUCCESS_VIEW;
            createUserData(email, username, password);
        }
        // 进行转发
        request.getRequestDispatcher(resultPage).forward(request, response);
    }

    private boolean isInvalidEmail (String email) {
        return email == null || !email.matches("^[_a-z0-9-]+([.]+[_a-z0-9-]+)*@[_a-z0-9-]+([.][a-z0-9]+)*$");
    }

    private boolean isInvalidUsername (String username) {
        for (String file : new File(USERS).list()) {
            if (file.equals(username)) {
                return true;
            }
        }
        return false;
    }

    private boolean isInvalidPassword (String password, String confirmedPasswd) {
        return password == null || password.length() < 6 || password.length() > 16 || !password.equals(confirmedPasswd);
    }

    private void createUserData (String email, String username, String password) {
        File userhome = new File(USERS + "/" + username);
        userhome.mkdir();
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(userhome + "/profile"));
            writer.write(email + "\t" + password);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                writer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        doPost(request, response);
    }
}
```

然后需要对这个servlet发起请求并提交出局，所以现在还差一个html页面，这个页面在哪里无所谓，因为他发起请求：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
  <form action="http://localhost:9999/register.do" method="post">
    <label>邮箱</label>
    <input name="text" type="email" />
    <label>用户名</label>
    <input name="username" type="text" />
    <label>密码</label>
    <input name="password" type="password" >
    <label>确认密码</label>
    <input name="confirmedPasswd" type="password" >
    <input name="submit" type="submit" value="OK" >
  </form>
</body>
</html>
```

注意表单action属性的值要是对应RegisterServlet能够就收的url，在servlet这个实例上有一行说明：

```java
@WebServlet("/register.do")
```

所以就不用在web.xml中进行配置，当有请求访问/register.do这个相对路径的时候，就会使用这个servlet，然后现在的逻辑还需要两个页面来处理注册用户的正确与错误并进行相应的转发。

所以创建两个servlet分别用于注册失败的转发与注册成功的转发：

```java
// ErrorServlet
package weibo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/error.view")
public class ErrorServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.println("<!DOCTYPE html>");
        writer.println("<html>");
        writer.println("<head>");
        writer.println("<meta content='text/html; charset=utf-8'>");
        writer.println("<title>新增用户失败</title>");
        writer.println("</head>");
        writer.println("<body>");
        writer.println("<h1>新增用户失败</h1>");
        writer.println("<ul style='color:rgb(255, 0, 0);'>");
        List<String> errors = (List<String>) request.getAttribute("errors");
        for (String error : errors) {
            writer.println("<li>" + error + "</li>");
        }
        writer.println("</ul>");
        writer.println("<a href='register.html'>返回注册页面</a>");
        writer.println("</body>");
        writer.println("</html>");
        writer.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

以上的ErrorServlet也很简单，就是在之前的注册时出现的各种错误都放到一个泛型为String的List中，设置为请求的一个属性。然后进行转发的时候使用的是getRequestDispatcher方法后调用的forward方法。所以又转发到error这里的时候还是属于一次请求，那么在这个servlet中就可以获取带着错误信息的请求对象。并调用getAttrubute方法获得这个信息在页面中进行输出渲染。

最后想有个能够返回注册页面的链接，使用a元素没什么说的，所以把之前的注册页面html文件放到web应用的根目录下。并从web.xml中进行配置：

```xml
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.jpg</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.png</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.gif</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.ico</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.js</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.css</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.html</url-pattern>
</servlet-mapping>
```

以上就是一些静态资源的配置，当访问静态资源如图片 / 脚本 / html页面等资源的时候，就不用专门配置servlet来映射，而是可以使用defaultServlet进行处理。defaultServlet就是专门用来处理静态资源的servlet。

然后还有一个匹配success.view的注册成功的servlet要写：

```java
package weibo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/success.view")
public class SuccessServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.println("<!DOCTYPE html>");
        writer.println("<html>");
        writer.println("    <head>");
        writer.println("        <meta content='text/html; charset=UTF-8'>");
        writer.println("        <title>成功注册用户</title>");
        writer.println("    </head>");
        writer.println("    <body>");
        writer.println("    <h1>会员" + request.getParameter("username") + "注册成功！</h>");
        writer.println("    <a href='index.html'>回首页登录</a>");
        writer.println("    </body>");
        writer.println("</html>");
        writer.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

以上代码运行后，填写正确的表单信息，就会在之前指定的目录生成一个目录与用户信息文件。当然最后锚元素指向的index.html还没有写。



参考链接：

1. [web.xml 配置](http://blog.csdn.net/guihaijinfen/article/details/8363839)
2. [defaultServlet 静态资源](http://blog.csdn.net/hello5orld/article/details/9407905)
3. [defaultServlet tomcat](http://tomcat.apache.org/tomcat-6.0-doc/default-servlet.html)