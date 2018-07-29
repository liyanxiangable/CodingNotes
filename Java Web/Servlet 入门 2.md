# Servlet 入门 2





接着之前的做，下面编写登录的servlet：

```java
package weibo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/login.do")
public class LoginServlet extends HttpServlet {
    private final String USERS = "C:\\Users\\liyanxiang\\Desktop";
    private final String SUCCESS_VIEW = "member.view";
    private final String ERROR_VIEW = "index.html";
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        List<String> errors = new ArrayList<>();
        if (isValidUsername(username)) {
            if (isValidPassword(username, password)) {
                request.getRequestDispatcher(SUCCESS_VIEW).forward(request, response);
            }
        } else {
            errors.add("用户名不存在！");
            response.sendRedirect(ERROR_VIEW);
        }
    }

    private boolean isValidUsername (String username) {
        File rootDirectory = new File(USERS + "\\" + username);
        if (rootDirectory.exists()) {
            System.out.println("DIRECTORY EXISTS!");
            File userFile = new File(rootDirectory + "\\profile.txt");
            if (userFile.exists()) {
                System.out.println("USERFILE EXISTS!");
                return true;
            } else {
                System.out.println("USERFILE NOT EXISTS!");
            }
        }
        System.out.println("DIRECTORY NOT EXIST!");
        return false;
    }

    private boolean isValidPassword (String username, String password) {
        FileReader fis = null;
        BufferedReader br = null;
        String[] infos = null;
        try {
            File userFile = new File(USERS + "\\" + username + "\\profile.txt");
            fis = new FileReader(userFile);
            br = new BufferedReader(fis);
            String info = br.readLine();
            infos = info.split("\t");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fis != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        if (infos[1] == password) {
            return true;
        }
        return false;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

登录的界面如下：

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LOGIN</title>
</head>
<body>
    <form method="get" action="login.do">
        <label>用户名</label>
        <input name="username" type="text">
        <label>密码</label>
        <input name="password" type="password">
        <input type="submit" value="Login">
    </form>
</body>
</html>
```

现在再编写登录成功的servlet：

```java
package weibo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.WritableRenderedImage;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/member.view")
public class MemberServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.println("<!DOCTYPE html>");
        writer.println("<html>");
        writer.println("    <head>");
        writer.println("        <meta charset='UTF-8'>");
        writer.println("        <title>欢迎登录</title>");
        writer.println("    </head>");
        writer.println("    <body>");
        writer.println("        <h1>会员 " + request.getParameter("username") + " 你好</h1>");
        writer.println("    </body>");
        writer.println("</html>");
        writer.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
```

唯一有一点需要注意的是windows路径名不区分大小写。没什么难度与新东西。

现在加入对话管理功能：

修改LoginServlet：

```java
if (isValidUsername(username)) {
  if (isValidPassword(username, password)) {
    System.out.println("转发至会员页面...");
    request.getSession().setAttribute("login", username);
    request.getRequestDispatcher(SUCCESS_VIEW).forward(request, response);
  }
}
```

其中添加了session的变量保存，当用户输入的账户与密码无误的时候，那么就储存一个login的session，他的值就是当前的用户名（用户名唯一），表示当前用户已登录。

设置了登录的session，在浏览器没有关闭的期间内，不论什么时候访问会员页面，都能够确定用户是否已登录，所以memberServlet中获得用户名就进行如下修改：

```	java
private final String LOGIN_VIEW = "/login.html";
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  response.setContentType("text/html; charset=UTF-8");
  PrintWriter writer = response.getWriter();
  Object loginUser = request.getSession().getAttribute("login");
  String username = null;
  if (loginUser == null) {
    response.sendRedirect(LOGIN_VIEW);
  } else {
    username = loginUser.toString();
  }
  ......
}
```

现在只要登录一次以后，不用再次登录，就可以查看会员页面。然后在会员页面增加一个注销的功能：

```html
writer.println("        <a href='/logout.do'>注销</a>");
writer.println("        <div class='write'>");
writer.println("            <h3>分享新鲜事......</h3>");
writer.println("            <form action='message.do' mothed='get'>");
writer.println("                <textarea rows='4' cols='50' name='weibo' placeholder='140 字以内'></textarea>");
writer.println("                <input type='submit' value='发送'>");
writer.println("            </form>");
writer.println("        </div>");
writer.println("        <div class='sent'>");
writer.println("        </div>");
```

注销的逻辑很简单：

```java
package weibo;
import ...
@WebServlet("/logout.do")
public class LogoutServlet extends HttpServlet {
    private final String LOGIN_VIEW = "/login.html";
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getSession().invalidate();
        response.sendRedirect(LOGIN_VIEW);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

然后写微博发送的处理：

```java
package weibo;
import ...
@WebServlet(name = "MessageServlet")
public class MessageServlet extends HttpServlet {
    private final String USERS = "C:\\Users\\liyanxiang\\Desktop";
    private final String SUCCESS_VIEW = "member.view";
    private final String ERROR_VIEW = "member.view";
    private final String LOGIN_VIEW = "login.html";
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("login") == null) {
            response.sendRedirect(LOGIN_VIEW);
            return;
        }
        request.setCharacterEncoding("utf-8");
        String content = request.getParameter("weibo");
        if (content != null && content.length() != 0) {
            if (content.length() <= 140) {
                String username = (String) request.getSession().getAttribute("login");
                addMessage(username, content);
                response.sendRedirect(SUCCESS_VIEW);
            } else {
                request.getRequestDispatcher(ERROR_VIEW).forward(request, response);
            }
        } else {
            response.sendRedirect(ERROR_VIEW);
        }
    }

    private void addMessage(String username, String content) {
        String file = USERS + "\\" + username + "\\" + new Date().getTime() + ".txt";
        FileOutputStream fos = null;
        BufferedWriter writer = null;
        try {
            fos = new FileOutputStream(file);
            writer = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8"));
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

即首先判断用户是否





























参考链接：

1. [转换流用例](http://blog.csdn.net/some_times/article/details/44406803)