# 构建 Spring Web 程序 2



之前简单的学习了一下spring mvc 的基本配置（通过Java进行配置），但是作为初学者，还是有很多不明白的地方。现在再来详细梳理一下：

## 配置 DispatcherServlet

对DispatcherServlet的配置以往是在web.xml文件中，如果要使用Java进行配置，那么需要三个基本的配置

```java
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class DispatcherServlet extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected String[] getServletMappings () {
        return new String[] {"/"};
    }

    @Override
    protected Class<?>[] getRootConfigClasses () {
        return new Class<?>[] {RootConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses () {
        return new Class<?>[] {WebConfig.class};
    }
}
```

首先这个配置类要继承 AbstractAnnotationConfigDispatcherServletInitializer，只要是继承 AbstractAnnotationConfigDispatcherServletInitializer 的任意的类都会自动配置DispatcherServlet与Spring上下文。然后重写三个方法。

1. 第一个方法是getServletMappings()，它会将一个或者多个路径映射到DispatcherServlet上。在以上的代码中，它映射的是“/”，所以它会是应用默认servlet，即处理所有的请求。说白了，之前学习servlet的时候（建议先了解学习servelt再学习springMVC），web.xml文件中有个servlet-mapping标签。这个方法就是对应的servlet-mapping标签（其实仅仅看名字也知道DispatcherServlet也是一个Servlet，不过它主要用于“分发”功能）。就是说客户端请求的路径如果与服务器端能够对的上，那么就使用当前的DispatcherServlet进行处理。以之前的那个helloworld应用为例，由于这里映射的为“/”，所以所有的请求都会通过它来处理，访问一个jsp资源是直接在端口号之后添加控制器（之后会详细介绍）的对应请求：

   ![](https://i.imgur.com/OOK9GqY.png)

   现在如果进行修改为“/hello/*”。那么就是只对路径为hello的请求进行处理：

   ![](https://i.imgur.com/0RSRd6t.png)

   当然现在的映射返回的是一个数组，所以可以进行多个请求路径的设置。例如返回数组包括以上代码中的两个参数，就可以使用任意一种方法来请求同样的资源：

   ```java
   @Override
   protected String[] getServletMappings () {
     return new String[] { "/", "/hello/*"};
   }
   ```

   但是有一点需要注意的是，如果是默认的所有请求，此时不需要使用通配符"*"，然而如果是设置某一个特定的路径（如"hello"），那么路径之后必须添加“/\*”通配符。

2. 当DispatcherServlet启动的时候，他会创建spring应用上下文，并加载配置文件或者配置类中所声明的bean。在getServletConfigClasses()方法中，我们要求DispatcherServlet加载应用上下文的时候，使用定义在WebConfig配置类中的bean。

   但是在Spring Web应用中，通常还有另外一个应用上下文。另外的应用上下文是由ContextLoaderListener创建的。通常情况下，我们希望DispatcherServlet加载包含Web组件的bean（例如控制器、视图解析器、处理器映射等），而驱动应用后端的中间层和数据层组件等其他的bean是通过另外的这个ContextLoaderListener来进行加载的。

   AbstractAnnotationConfigDispatcherServletInitializer 会同时创建 DispatcherServlet 与 ContextLoaderListener。getServletConfigClass()方法会返回带有 @Configuration 注解的符合的类，这些类将会用来定义DispatcherServlet应用上下文中定义的bean。而getRootConfigClasses()方法会返回带有 @Configuration 注解的符合的类，这些类将会用来配置 ContextLoaderListener 创建的应用上下文中的bean。

   在本例中，根配置定义在RootConfig中，DispatcherServlet 的配置声明在WebConfig中。也就是说，之后要定义的各种配置，需要在这两个方法的返回值中进行注册，例如一开始的视图解析器就是在WebConfig这个bean中进行配置的。



## 启用 Spring MVC

之前在配置DispatcherServlet的bean中已经说明了，所需要的两类上下文由RootConfig类与WebConfig类进行配置。一个最最基础的Spring MVC配置就是单纯的一个不含任何内容的空的带有 @EnableWebMvc 注解的 WebConfig 类。这是一个最基本但是却难以实际使用的配置类。因为：

1. 现在没有视图解析器。这会使得Spring使用默认的BeanNameViewResolver，这个视图解析器会查找ID与逻辑视图名相匹配的bean，并且查找的bean要实现View接口。
2. 没有启用组件扫描。这样会使得Spring只能找到显式声明在配置类中的控制器。
3. DispatcherServlet会映射为默认的Servlet，所有他会处理包括静态资源在内所有请求。

所以我们需要对目前的这个名为WebConfig的配置类添加配置规则：

```java
import ...

@Configuration
@EnableWebMvc
@ComponentScan("spittr.web")
public class WebConfig extends WebMvcConfigurerAdapter {
    @Bean
    public ViewResolver viewResolver () {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        resolver.setExposeContextBeansAsAttributes(true);
        return resolver;
    }

    @Override
    public void configureDefaultServletHandling
            (DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }
}
```

现在对其中的配置进行解释。首先，这个配置类需要由注解@ComponentScan("XXX")，这样就会自动扫描XXX包来查找组件，这样的话就不需要在配置类中显式地配置控制器，只需要在XXX包中添加相应地注解就可以配置各种控制器。然后添加了一个ViewResolver的bean。这个方法对视图解析器进行配置，给逻辑视图名添加前缀后缀。另外的一个方法是对WebMvcConfigurerAdapter的configureDefaultServletHandling方法进行重写，通过调用DefaultServletHandlerConfigurer的enable()方法，可以让DisaptcherServlet将所有的对静态资源的请求都转发到Servlet容器默认的Servlet上，而非DispatcherServlet本身来处理这些请求。



## 编写基本的控制器

在Spring MVC 中，控制器只是方法上添加了 @RequestMapping 注解的类，这个注解声明了这些控制器所要处理的请求。如下：

```java
import ...
@Controller
public class HomeController {
    @RequestMapping(value = "/home", method = GET)
    public String home () {
        System.out.println("HOME!");
        return "home";
    }
}
```

可以在类的范围内添加 @Controller 注解，这个注解是一个构造性注解，它基于 @Component 注解，他本身并没有特别之处，只是相对于编程人员来说表意性更强。真正发挥作用的是 @RequestMapping注解，这个注解的作用范围是方法，并且由两个属性，value表示请求的路径，method表示的是请求的方法。一旦有相匹配的路径进行请求，就会通过这个控制器进行处理。带有这种注解的方法必须要（以某种形式）返回一个字符串作为逻辑视图名，DispatcherServlet将会自动的将这个返回的逻辑视图名发送给视图解析器来将逻辑视图名转换为实际的视图。

同时，也可以定义类级别的请求处理。当控制器在类级别上添加 @RequestMapping 注解的时候，这个注解则会应用到控制器的所有处理器方法之上；而处理器方法上的 @RequestMapping 注解会对类级别上的 @RequestMapping 的声明进行补充。并且，@RequestMapping 注解的value属性还可以映射一个String类型的数组以接收多种请求。



## 向视图中传递模型数据

有多种方式可以向视图中传递模型数据，比如说ModelAndView、Model/Map/ModelMap、@SessionAttributes或者@ModelAttribute。

首先使用最简单的方式——Model/Map/ModelMap来进行传递数据。如下对之前的控制器代码进行修改：

```java
@Controller
public class HomeController {
    @RequestMapping(value = "/home", method = GET)
    public String home (Model model) {
        System.out.println("HOME!");
        model.addAttribute("home", "山东济南");
        return "home";
    }

    @RequestMapping(value = "/gakki", method = GET)
    public String gakki (Map<String, Object> map) {
        System.out.println("GAKKI!");
        map.put("girlfriend", "新垣结衣");
        return "home";
    }
}
```

以上使用了两种方式来传递模型数据，第一种为使用模型对象，第二种为使用集合来传递。然后对JSP视图稍加修改，如下：

```html
<body>
    <h1>HELLO WORLD</h1>
    <P>${ requestScope.home }</P>
    <P>${ requestScope.get("girlfriend") }</P>
</body>
```

所以现在对两个路径发送请求可以看到数据已经在视图中可以获得了。

![](https://i.imgur.com/PByCnzv.png)

![](https://i.imgur.com/UnMQBY3.png)

其他的传递数据方式各有特点，暂且按下不表。



## 接收请求的输入

Spring MVC允许以多种方式将客户端中的数据传递到控制器的处理器方法中。如下：

1. 查询参数（Query Parameter）
2. 表单参数（Form Patameter）
3. 路径变量（Path Variable）

首先来看一下两个较为简单的输入的处理：查询参数与路径变量。查询参数是在请求路径的"?"后边以键值对的形式传递的值。可以通过@RequestParam 注解来获取。这个注解标注在某个变量之前可以对这个变量作为参数进行赋值。如下：

```java
@RequestMapping(value = "/gakki", method = GET)
public String getGakki (Model model, @RequestParam("girlfriend") String girl) {
  model.addAttribute("girlfriend", girl + "是你的女朋友。");
  return "home";
}
```

超简单吧！结果如下：

![](https://i.imgur.com/Q5lKqw3.png)

以上就是用过查询参数来接收输入。

下面是通过路径变量接收输入：

路径变量与刚才的查询参数相类似，不过它不是请求的“?”之后的键值对所携带的数据。例如在面向资源的角度，我们不想使用这种查询参数的形式来对资源进行访问，在理想情况下，要识别的资源应该通过URL路径进行表示，而不是通过查询参数。这一点就是两种类似的数据的输入的用途的区别之处。

为了实现这种路径变量，Spring MVC允许我们在 @RequestMapping路径中添加占位符。占位符的名称需要使用花括号括起来。路径中的其他部分要与所处理的请求完全匹配，但是占位符部分可以是任意的值。看个栗子就明白了：

```java
@RequestMapping(value = "/{girlfriend}", method = GET)
public String getGakki (Model model, @PathVariable String girlfriend) {
  model.addAttribute("girlfriend", girlfriend + "是你的女朋友。");
  return "home";
}
```

就是说在@RequestMapping这个注解中定义占位符，然后在对应的控制器方法中的参数列表中就可以进行捕获，由于现在是使用的路径变量的方式，因此由之前的RequestParam 修改为现在的 PathVariable 注解。运行结果如下：

![](https://i.imgur.com/E8zjSYl.png)

出现了喜闻乐见的中文乱码！这是由于默认的URL编码格式与web应用中的编码格式不一致导致的。解决的方法有很多，这里我使用的方式是对接收到的路径变量进行重新的编码，如下：

```java
@RequestMapping(value = "/{girlfriend}/haha", method = GET)
public String getGakki (Model model, @PathVariable String girlfriend) throws Exception{
  girlfriend = new String(girlfriend.getBytes("ISO-8859-1"), "UTF-8");
  model.addAttribute("girlfriend", girlfriend + "是你的女朋友。");
  return "home";
}
```

现在好了。

![](https://i.imgur.com/qdEwITJ.png)



## 处理表单

当有大量的数据进行提交的时候，之前的两种方式就不太合适了。这个时候需要使用表单来对数据进行提交。要先使用表单进行数据的提交，首先需要有一个表单。我这就去弄一个：

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Form</title>
</head>
<body>
    <h1>表单提交测试专属页面</h1>
    <form method="post">
        专业: <input type="text" name="major">
        位置: <input type="number" name="room">
        女友: <input type="password" name="password">
        <input type="submit" value="提交">
    </form>
</body>
</html>
```

如上述代码所示，表单通过post方法来提交一个某个硕士研究生的信息。然后需要编写控制器来对相应的请求进行处理：

```java
import ...
@SessionAttributes({"boy"})
@Controller
public class formController {
    @RequestMapping(value = "/form", method = GET)
    public String showForm () {
        return "form";
    }

    @RequestMapping(value = "/form", method = POST)
    public String handleForm (Map<String,Object> map, Student student) {
        map.put("boy", student);
        return "redirect:/hello/" + student.getName();
    }

    @RequestMapping(value = "/{studentName}", method = GET)
    public String showFormData () {
        return "studentInfo";
    }
}
```

首先这个控制器上有@SessionAttributes注解，表明这个配置类中储存的数据是在会话范围内有效的。这里我使用SessionAttributes的原因是用户在提交表单之后一般为了防止重复提交而重定向，此时就属于两次请求，因而原来默认的请求的数据作用域范围就无法满足要求了。

重点在于handleForm()这个方法，这个方法用来处理表单的提交。可以看到这个函数有两个参数，一个是map，这个不用多说了，是用来对模型数据进行存储的；另一个是一个POJO对象实例，这个POJO对象是关于我们表单的数据的一个汇总的对象。也就是说为什么数据叫模型（model）呢？我想就是将用户所需要的各种信息进行抽象，而对于一个表单来说，如果事先建立好这个表单的模型类，那么就可以使用这个类的实例来对用户的输入进行完全的描述。所以现在创建一个表单的模型类：

```java
public class Student {
    private String name;
    private String major;
    private String password;
    private int room;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getMajor() {
        return major;
    }
    public void setMajor(String major) {
        this.major = major;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public int getRoom() {
        return room;
    }
    public void setRoom(int room) {
        this.room = room;
    }
}
```

POJO就是Data对象，如上代码只有setter于getter，这个类的实例在控制器中作为参数的时候，会自动接收变量名相对应的值。

然后注意handleForm()方法的return的String变量，一般来说这就是逻辑视图名，然而对于视图解析器InternalResourceViewResolver来说，字符串中有两种特殊的情况，即“redirect:”前缀与“forward:”前缀，在返回值有这两个前缀的时候，视图解析器会进行重定向与转发。并且注意的是重定向的路径是从根目录开始的，因为它是重新进行了一次请求。

最后编写结果的JSP视图：

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Information</title>
</head>
<body>
    <H1>学生信息</H1>
    <H3>姓 名：${ requestScope.get("boy").name }</H3>
    <H3>教研室：${requestScope.boy.room}</H3>
    <H3>专 业：${requestScope.boy.major}</H3>
    <H3>女朋友：${requestScope.boy.password}</H3>
</body>
</html>
```

进行表单输入并提交结果如下：

![](https://i.imgur.com/20BQq9l.png)





参考与感谢：

1. [Spring 4.24 参考文档中文翻译 gitbook](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/)
2. [向视图中传递模型数据的数据方法](http://blog.csdn.net/u010412719/article/details/71835621)
3. [SpringMVC URL 中文乱码解决方式](http://www.codingyun.com/article/78.html)
4. [redirect与forward区别](http://zhulin902.iteye.com/blog/939049)