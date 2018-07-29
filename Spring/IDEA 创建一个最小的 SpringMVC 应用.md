# IDEA 创建一个最小的 SpringMVC 应用



最近想要学习一下spring，刚开始接触java感觉各种不适应啊，第三方各种包各种库需要引入。网上的很多资料或者交流都是使用的eclipse，但是2017年了，没人用eclipse了好吗？所以写一个在IDEA上配置springMVC环境的图文记录，方便以后查阅与新学的盆友上手。IDEA 版本为2017.2.5，JDK版本为9，spring版本为4.3.12，tomcat版本为9.0.1。



1. 首先，File -> New Project 新建项目。

2. 弹出窗口中左侧选择Spring，右侧选择SpringMVC，点击next。

   ![新建项目](https://i.imgur.com/e7KHaQa.png)

3. 根据自己的情况，设定项目存放位置与名称，点击finish，IDEA会自动下载相关的各种包

   ![设定项目名称与位置](https://i.imgur.com/KGr7mMs.png)

4. 项目初始化的结构如下:

   ![项目结构](https://i.imgur.com/FsPVceg.png)

5. 打开web目录下的WEB-INF目录下的web.xml文件，这个文件在学习servlet与JSP的时候就打过交道，是在web应用中非常重要的配置文件。但是在servlet3与Spring3.1之后，这种方式已经不是唯一的方案了，《Sping实战》推荐使用java进行配置，所以所有的config都使用java配合注解来实现，于是我们就不管这个文件了。但是有一个比较容易出错的地方，一直在报错，让我折腾了好久（当然根本原因时我也是新学，理解不是很深刻），需要将web.xml的默认配置进行清空！

   ​	再说一遍，需要将web.xml中的默认配置进行清空！

   ```XML
   <?xml version="1.0" encoding="UTF-8"?>
   <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
            version="3.1">
   </web-app>
   ```

   使用java进行配置可以再src目录下新建一个项目目录，其中创建一个config配置文件目录，其中再创建 org.springframework.web.servlet.DispatcherServlet，这个DispatcherServlet是SpringMVC的核心，所有的请求都是先经过他，由他来将所有的请求路由到不同的组件之中。配置文件如下：

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

   首先这个类需要继承AbstractAnnotationConfigDispatcherServletInitializer，因为任何扩展这个名字超级长的类都会自动配置DispatcherServlet和Spring应用上下文，Spring的应用上下文会位于应用程序的servlet上下文中。继承类重写了三种方法，首先是getServletMappings，顾名思义，这个方法会将一个或者多个路径映射到DispatcherServlet上，注意他返回一个字符串数组，但是本例中只有一个"/"，这说明他应用默认的servelt，处理进入应用的所有请求。

   同理，重写的第二个与第三个方法也是会返回带有各相关注解的bean，来创建ContextLoaderListener与DispatcherServlet。

6. 配置DispatcherServlet

   在同级目录(src/first/config目录)中创建Webconfg类用以配置DispatcherServlet：

   ```java
   package spittr.config;
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

   这个类需要有三个注解，@Configuration标识这个类作为一个配置文件来配置ContextLoaderListener创建的应用上下文中的bean；@EnableWebMvc标识这个类是SpringMVC的配置文件类；@ComponentScan("spittr.web")标识这个配置文件所需要的组件（控制器）的包名。这个类需要继承WebMvcConfigurerAdapter，有两个方法。第一个方法是一个视图解析器，负责将返回的视图名添加前缀与后缀来寻找物理视图名称；第二个方法是重写的，用来启用将静态资源的请求转发到servlet容器中默认的servlet而不是使用DispatcherServlet。

7. 编写RootConfig

   这个类主要用来配置ContextLoaderListener，而对于现在我们的web应用来说，相关的配置已经由DispatcherServlet配置好了，所以rootConfig如下：

   ```java
   package spittr.config;
   import ...
   @Configuration
   @ComponentScan(basePackages = {"spittr"}, excludeFilters = {
           @Filter(type= FilterType.ANNOTATION, value= EnableWebMvc.class)
   })
   public class RootConfig {
   }
   ```

8. 编写Controller

   在项目的src/first目录中新建web包用于存放各种的控制器，并新建一个HomeController用于第一个页面的控制。

   代码如下：

   ```java
   package Controller;

   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import static org.springframework.web.bind.annotation.RequestMethod.GET;

   @Controller
   public class FirstController {
       @RequestMapping(value="/home", method=GET)
       public String home () {
           return "home";
       }
   }
   ```

   这个控制器的代码很简单，其中需要一个@Controller注解，这个注解没有什么特殊的地方，其实与@Component注解一样，目的只是实现扫描，不过这个注解可以提高辨识度。然后有个自定义方法，方法上边标识了一个@RequestMapping注解，这个注解是用来将所有url为value并且请求方法为GET的请求，都映射到这个函数进行控制。然后这个函数返回一个字符串，返回的字符串就是视图的名称。即DispatcherServlet会要求视图解析器将这个逻辑名称解析为实际的视图做出响应。

9. 创建视图

   现在在WEB-INF目录中创建一个视图目录，并创建一个JSP文件作为视图。

   ![](https://i.imgur.com/PMR6c4x.png)

   编写这个JSP文件如下:

   ```jsp
   <%@ taglib prefix="c" uri="http://www.springframework.org/tags" %>
   <%@ page contentType="text/html;charset=UTF-8" language="java" %>
   <html>
   <head>
       <title>Home</title>
       <link rel="stylesheet" type="text/css" href="<c:url value="/resources/style.css"/>" />
   </head>
   <body>
       <h1>HELLO WORLD</h1>
       <P>新垣结衣的微笑就由我来守护</P>
   </body>
   </html>
   ```

10. 然后配置tomcat容器，点击IDEA右上角的select debug/run configuration，选择edit configurations...。

  ![](https://i.imgur.com/HxnWUHS.png)

  然后在弹出的窗口中点击左上角加号，会弹出列表，往下找找到tomcat，选择local。如果有警告提示no artifacts marked for devlopment，接着点击右下角的fix，然后确定。

11. 最后还有一点是IDEA默认下载的lib的目录位置不太对，我们需要自己修改一下，把lib目录直接拖拽（更正，复制好一些）到WEB-INF目录下。现在点击run按钮，可以启动tomcat并在浏览器访问刚才的jsp页面了。


以下是最终的目录结构（由于我中间进行了多次修改，项目的目录名称与文件名有与之前说的不同的地方，但是仅有名称上的差异，代码都一样）：

![](https://i.imgur.com/3tGAoFl.png)

在浏览器端进行访问：

![最终效果](https://i.imgur.com/hm5scet.png)

各文件代码：

```java
// SpittrWebAppInitializer.class

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

```java
// RootConfig.class
package spittr.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@ComponentScan(basePackages = {"spittr"}, excludeFilters = {
        @Filter(type= FilterType.ANNOTATION, value= EnableWebMvc.class)
})
public class RootConfig {
}
```

```java
// WebConfig.class
package spittr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

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










## 参考与感谢：

1. [context:component-scan 报错](http://blog.csdn.net/ytdxyhz/article/details/51520430)
2. [context:component-scan StackOverflow](https://stackoverflow.com/questions/13589470/the-matching-wildcard-is-strict-but-no-declaration-can-be-found-for-element-co)
3. [SpringMVC HelloWorld](http://blog.csdn.net/industriously/article/details/52851588)
4. [Failed to start component StandardEngine Catalina    .StandardHost localhost .StandardContext /jsp](http://bbs.csdn.net/topics/390497557/)
5. [启动tomcat时报错Failed to start component](https://segmentfault.com/q/1010000007741035)