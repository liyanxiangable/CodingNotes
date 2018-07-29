



### Servlet 处理输入表单

表单的处理分为两种情况，一是处理get方法提交的表单，二是处理post方法提交的表单。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  System.out.println("doGet...");
  String username = request.getParameter("username");
  String password = request.getParameter("password");
  System.out.println(username + " : " + password);

  Enumeration<String> headerInfo = request.getHeaderNames();
  while (headerInfo.hasMoreElements()) {
    String headerName = headerInfo.nextElement();
    String headerValue = request.getHeader(headerName);
    System.out.println(headerName + " + " + headerValue);
  }
}
```

填写登录表单并提交，可以在控制台看到如下信息显示：

```
GAKKI : 123

host : localhost:9999
connection : keep-alive
upgrade-insecure-requests : 1
user-agent : Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
accept : text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
referer : http://localhost:9999/login.html
accept-encoding : gzip, deflate, br
accept-language : zh-CN,zh;q=0.8
cookie : ......
```

第一行就是打印的用户名与密码，通过get方法来获取表单的数据比较简单，调用request请求实例的getParameter的方法并传入相应的键就可以得到值。

接下来打印了头信息，首先调用请求的getHeaderNames方法获得一个Enumeration<String>集合，然后以这个集合中的元素为键，调用getHeader方法获取对应的值，最后打印输出。

1. host 表示主机名为localhost，端口9999
2. connection keep-alive 表示保持会话连接
3. upgrade-insecure-requests 1 表示自动升级请求，从http到https
4. user-agent 这个是用户代理，虽然这一项可以随便填。但是chrome好像太随便了，一下子填了好几个并不是他的浏览器内核
5. accept 表示浏览器可以接收的文件类型
6. referer 表示引用页，这是一个完整的url
7. accept-encoding 表示接收的编码类型
8. accept-language 表示接收的语言
9. cookie 表示cookie缓存



通过设置不同的content-type，可以返回不同的响应。比如说我要返回一个图片：

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

  response.setContentType("image/jpeg");
  // InputStream is = this.getClass().getClassLoader().getResourceAsStream("1.jpg");
  FileInputStream fis = new FileInputStream("../1.jpg");
  OutputStream os = response.getOutputStream();
  int len = 0;
  byte[] data = new byte[20];
  while ((len = fis.read(data)) != -1) {
    os.write(data);
  }
  os.flush();
  fis.close();
  os.close();
}
```

现在对对应的url进行请求的时候就可以看到设置好的名为1.jpg图片。

响应对象还可以通过响应头信息设定页面刷新，可以定时进行刷新。如下：

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  response.setHeader("refresh", "1");
  response.setCharacterEncoding("utf-8");
  response.setContentType("text/html");
  PrintWriter pw = response.getWriter();
  pw.println("<h1>当前时间" + new Date().toString() + "</h1>");
}
```

字符编码这里，就是上边这样写（在setCharacterEncoding方法中设置字符编码）。其实可以在setContentType方法中同时设置字符编码为utf-8。如下：

```java
response.setContentType("text/html; charset=utf-8");
```





### Cookie：

cookie 是保存在客户端本地的键值对，用来保存用户的某些信息。

当服务器端接收到请求的时候，就可以设置用户发送的相应信息的cookie。如下：

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  Cookie cookie = new Cookie("wife". "gakki");
  cookie.setMaxAge(60 * 60);
  response.addCookie(cookie);
}
```

以上就是将wife是gakki这个键值对存储在cookie中，并设定这条cookie的有效信息为60（秒） * 60（分钟） = 3600（秒，即一小时）。  

现在在另一个url中设置servlet来输出各项cookie，然后分别访问这两个url：

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  Cookie[] cookies = request.getCookies();
  response.setCharacterEncoding("utf-8");
  PrintWriter pw = response.getWriter();
  for (Cookie cookie : cookies) {
    pw.println("<p>" + cookie.getName() + " : " + cookie.getValue() + "</p>");
  }
}
```

可以看到页面输出如下：

```
Webstorm-1c100c77 : 2dfdea9d-9b3a-49d8-ba4e-a6f645be2fe8

MUSIC_U : 2a8ac72597d223bce5043ec949ea58c91af24f19231e377b7e7c6753dffb69114bc3b8ac936c393e7785b68505eda447384fe0dd1eca3a5f

wife : gakki
```

以上就是三条存储的cookie，也可以看到之前的cookie已经存在了。



### Session

除了cookie，还有session可以持久化保存对象状态。session是在服务器端用来跟踪当前登录状态的一种机制，只针对浏览器（单一）与服务器的一对一关系。常用于保存用户的登录状态。

以下就是登录session的例子：

由于需要结合数据库与jdbc，所以首先要创建一个测试用的数据库。打开MySQL：

```SQL
create database TestServlet;

use TestServlet;

create table Users
  (
    id int primary key auto_increment,
    username varchar(20),
    password varchar(20)
  );

insert into Users (username, password) values
  ('gakki', 'hello'),
  ('yui', 'goodmorning');
```

以上就是数据库信息的创建。

接下来进行创建一个类来实例化user对象与数据库中的信息进行匹配。在src目录中创建一个user.java：

```java
package gakki;

public class User {
    private int id;
    private String username;
    private String password;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
```

接下来创建一个dao接口文件。创建UserDao.class，其中有一个抽象方法来执行登录：

```java
package gakki;
public interface UserDao {
    public User login (String username, String password);
}
```



上边的session还没有写完，等过几天学完了JDBC补上。



### 共享变量

1. ServletContext：全局作用域
2. HttpSession：针对当前打开的浏览器共享
3. HttpSessionRequest：作用域最小，只能在一次请求中使用

可以通过对个对象attribute的get与set来设置与获得共享变量：

```java
ServletContext sc = this.getServletContext();
sc.setAttribute("myWife", "gakki");

HttpSession hs = request.getSession();
hs.setAttribute("gakki", "myWife");

request.setAttribute("gakki", "yui");
```

```java
ServletContext sc = this.getServletContext();
HttpSession hs = request.getHttpSession();

System.out.println((String) sc.getAttribute("myWife"));
System.out.println((String) hs.getAttribute("gakki"));
System.out.println((String) request.getAttribute("gakki"));
```

会看到这三个共享数据的作用于是不同的。



### Filter

filter顾名思义就是起到过滤的作用的，位于客户端与服务器端之间。请求与响应通过fiter可以被修改，filter常用于以下方面：

1. session 管理
2. 权限验证
3. 日志记录
4. 字符编码转换

filter与普通的servlet不同的地方在于他不是为了某一个特定的请求而设计，它更像是一层装饰。最直观的一点就在于它在web.xml中的注册，不同于servlet的某个固定的url-pattern（当然也可以让他固定作用一个url），filter可以通配作用于很多请求。添加代码修改web.xml文件如下：

```xml
<filter>
  <filter-name>TestFilter</filter-name>
  <filter-class>gakki.TestFilter</filter-class>
</filter>
<filter-mapping>
  <filter-name>TestFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

格式与作用与servlet的注册相似，唯一的不同在于url-pattern这里，现在只要有请求，就会通过映射的filter过滤器TestFilter。

下面在src目录中编写filter，在idea里，有默认的filter模板，不过没有模板也不要紧，一样写，他就是一个类，需要实现javax.servlet.Filter接口。重写doFilter方法，其中这个方法中有一个chain.doFilter(request.response)方法的调用，这行代码是为了继续当前的请求，因为filter作为一个过滤器当然要具有过滤的功能，如果没有这一行代码的话，请求就到达filter为止了，不会再向下进行，这就是所谓的把请求过滤掉了。在此之前可以执行其他的业务逻辑：

```java
package gakki;
import ...
@WebFilter(filterName = "Filter")
public class Filter implements javax.servlet.Filter {
    private static int count = 0;
    public void destroy() {
        System.out.println("Filter destroy...");
    }
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        System.out.println("Do filter...");
        if (count++ <= 5) {
            System.out.println(count);
            chain.doFilter(req, resp);
        }
    }
    public void init(FilterConfig config) throws ServletException {
        System.out.println("Filter init...");
    }
}
```

运行web应用，以上代码可以在执行filter的时候进行输出。并且我规定了一个静态变量，让这个计数变量在小于等于5的时候可以执行chain.doFilter(req, resp)继续请求。之后则不允许。可以在控制台上看到每次请求都有输出，但是请求执行了5次之后，页面就不能够进行跳转了。



### listener

listener是用来监听web工程状态改变的一种实现机制。listener有三对常用的接口：

1. ServletContextListener / ServletContextAttributeListener
2. HttpSessionListener / HttpSessionAttributeListener
3. ServletRequestListener / ServletRequestAttributeListener

每一对listener分别监听Context或者Session等本身的创建与销毁；以及他们属性的变化。listener非常像之前vuejs框架全家桶中的状态管理vuex，比较好理解。







参考链接：

1. [servlet api文档](http://tomcat.apache.org/tomcat-5.5-doc/servletapi/index.html)
2. [upgrade-insecure-requests](https://www.w3.org/TR/upgrade-insecure-requests/)
3. [请求与响应信息](http://www.cnblogs.com/shaoge/archive/2009/08/14/1546019.html)
4. [ClassLoader](http://blog.csdn.net/briblue/article/details/54973413)
5. [setCharacterEncoding setContentType](https://stackoverflow.com/questions/4864899/encoding-and-servlet-api-setcontenttype-or-setcharacterencoding)