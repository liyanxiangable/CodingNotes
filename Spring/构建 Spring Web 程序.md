# 构建 Spring Web 程序



## Spring MVC 起步

每当用户再 Web 浏览器中点击连接或者提交表单的时候，请求就开始工作了。如下图：

![Spring MVC 从请求到相应的过程](http://img.my.csdn.net/uploads/201304/13/1365825529_4693.png)

当请求离开浏览器的时候，会带有用户所有请求内容的信息，至少会包含请求的url信息。

1. 请求首先到达Spring的DispatcherServlet。Spring MVC 所有的请求都会通过一个前端控制器（front controller）Servlet，前端控制器常用的Web应用程序模式，再Spring MVC 中，DispatcherServlet 就是前端控制器。
2. DispatcherServlet 的任务是将请求发送给Spring MVC 控制器（controller）。控制器是一个用于处理请求的Spring 组件。DispatcherServlet需要直到应该将请求发送给哪一个控制器。所以DispatcherServlet会查询一个或者多个处理器映射（handler mapping）来确定请求的下一站在哪里。处理器映射会根据请求所携带的URL 信息来进行决策。
3. 一旦选择了合适的控制器，DispatcherServlet 会将请求发送给选中的控制器，请求会卸下负载（用户提交的信息）并耐心等待控制器处理这些信息。
4. 控制器在完成逻辑处理之后，通常会产生一些信息，这些信息需要返回给用户并在浏览器中进行显示。这些信息称之为模型（model），这些信息以用户友好的方式进行格式化，一般会是HTML。所以，信息需要发送给一个视图（view），通常会是JSP。
5. 控制器所做的最后一项工作就是将模型数据打包，并且标识出用于渲染输出的视图名。他接下来会将请求、模型与视图名发送回DispatcherServelt。
6. 这样，控制器就不会与特定的视图相耦合，传递给DispatcherServlet的视图名并不是直接表示某个JSP，它仅仅是一个逻辑名称，使用这个逻辑名称来查找真正的视图。DispatcherServlet 将会使用视图解析器（view resolver）来将逻辑视图命名匹配为一个特定的视图实现，它可能是JSP，也可能不是。
7. 现在DispatcherServlet已经知道了渲染哪一个视图，那么请求任务基本上也就完成了。他将模型数据交付给JSP，请求就结束了，视图将使用模型数据渲染输出，这个输出会通过相应对象传递给客户端。

由于新版本的Spring与Servlet的功能增强，现在可以使用Java来进行配置，而不是繁琐的web.xml文件。如下代码展示了所需的Java类：

```java
package spittr.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class SpittrWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
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

任何扩展 AbstractAnnotationConfigDispatcherServletInitializer 的任意类都会自动配置DispatcherServlet和Spring上下文，Spring应用上下文会位于应用程序的Servlet上下文之中。这个配置类目前重写三个方法：

第一个方法是 getServletMappings()。他可以将一个或者多个路径映射到 DispatcherServlet 中。

当DispatcherServlet启动的时候，他会创建spring应用上下文，并加载配置文件或配置类中所声明的bean。其中示例代码 getServletConfigClasses()方法可以要求在DispatcherServlet加载应用上下文时，使用定义在WebConfig配置类中的bean。

我们希望DispatcherServlet加载包含Web组件的bean，比如说控制器、视图解析器以及处理器映射，而ContextLoaderListener要加载应用中的其他bean。这些bean通常是驱动应用后端的中间层和数据层组件。

AbstractAnnotationConfigDispatcherServletInitializer 会同时创建DispatcherServlet和ContextLoaderListener。getServletClasses() 方法返回的带有@Configuraion注解的类，这些类将会用来定义DispatcherServlet一个用上下文中的bean。getRootConfigClasses()方法返回带有@Configuration注解的类将会用来配置ContextLoaderListener创建的应用上下文中的bean。

我们能够创建的最简单的SpringMVC配置就是一个带有@EnableWebMvc注解的类。

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

以上示例代码的第一个方法用来配置JSP视图解析器，即创建一个InternalResourceViewResolver对象，并调用它的setPrefix与setSuffix设定添加给逻辑视图的前缀与后缀。另外一个方法为配置静态资源的处理，否则DispatcherServlet会映射为应用的默认Servlet，这样就会处理对静态资源的请求。



## 编写基本的控制器

在SpringMVC中，控制器只是方法上添加了@RequestMapping注解的类，这个注解声明了它要处理的请求。

```java
package Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class FirstController {
    @RequestMapping(value="/", method=GET)
    public String home () {
        return "home";
    }
}
```

@Controller注解是一个构造型（stereotype）的注解，它基于@Component注解，在这里，他的目的就是辅助实现组件扫描。组件扫描器会自动找到HomeController，并将其声明为Spring应用上下文中的一个bean。其实也可以使用@Conponent注解，他所实现的效果是一样的，但是在表意性上可能会差一些。@RequestMapping注解的value属性指定了当前方法所要处理的请求路径，method属性细化了他所处理的HTTP方法。然后编写相应的JSP视图，就可以进行请求访问了。

Spring现在包含了一种mock spring mvc并针对控制器执行HTTP请求的机制。这样的话，在测试控制器的时候，就没有必要再启动Web服务器与Web浏览器了。创建测试类如下：

```java
package spittr.web;

import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

public class HomeControllerTest {
    @Test
    public void testHomePage () throws Exception {
        HomeController controller = new HomeController();
        MockMvc mockMvc = standaloneSetup(controller).build();
        mockMvc.perform(get("/")).andExpect(view().name("home"));
    }
}
```

可以看到现在的单元测试首先使用standaloneSetup方法传递进一个controller对象性调用build方法来获取一个MockMvc对象，通过这个对象可以调用perform方法来进行各种操作。这里使用get方法发送http请求并返回一个名为home的视图。

也可以定义类级别的请求处理，同时@RequestMapping的value属性能够接收一个String类型的数组。



















参考连接：