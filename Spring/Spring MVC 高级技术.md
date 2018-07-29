# Spring MVC 高级技术



## Spring MVC 配置的替代方案

在[构建Spring MVC应用](http://www.liyanxiang.cn/article/8)中，已经通过扩展 AbstractAnnotationConfigDispatcherServletInitializer 快速搭建了Spring MVC环境。通过这个类来对 DispatcherServlet 与 ContextLoaderListener 进行上下文的提供与配置。但是很多情况下，我们不仅仅需要 DispatcherServlet，而且还可能需要额外的 Servlet 或者 Filter；或者是还需要对 DispatcherServlet 本身做一些额外的配置。这些情况就不能仅仅通过java的来进行配置，而可能需要通过XML的进行辅助的配置。

如果要添加其他的Servlet和Filter，最简单的方式就是实现Spring的WebApplicationInitializer接口。基于Java的初始化器（initializer）的一个好处就在于我们可以定义任意数量的初始化器类。因此如果想往Web容器中注册其他组件的话，只需要创建一个新的初始化器即可。

> 此处挖坑待填——20171211





## 处理 multipart 形式的数据

一般来说，表单提交所形成的请求结果是很简单的，即使以“&”符号分隔的多个name-value对。这种编码形式是非常简单的。但是对于传送二进制数据，比如说上传图片，就显得力不从心了。与之不同的是，multipart格式的数据会将一个表单拆分为多个部分（part），每个部分对应一个输入域。在一般的表单输入域中，它所对应的部分（part）中会放置文本型数据，但是如果上传文件的话，它所对应的部分可以是二进制。

首先就是要配置multipart解析器。DispatcherServlet 并没有实现任何解析 multipart 请求数据的功能。他将该任务委托给了Spring中的MultipartResolver策略接口的实现，通过这个实现类来解析multipart请求中的内容。从Spring3.1开始，Spring内置了两个MultipartResolver的实现以供选择：

1. CommonsMultipartResolver
2. StandardServletMultipartResolver

一般来说，StandardServletMultipartResolver是优选地方案。因为它使用Servlet所提供地功能支持，并且不需要依赖任何地其他项目。兼容Servlet3.0的StandardServletMultipartResolver没有构造器参数，也没有要设置的属性。因此在Spring应用上下文中，将其声明为bean就会非常简单。如下：

```java
@Bean
public MultipartResolver multipartResolver () throws IOException {
    return new StandardServletMultipartResolver();
}
```

那么怎样对StandardServletMultipartResolver进行条件限制呢？由于Servlet 3.0不允许在解析器MultipartResolver的层级配置这些信息，所以需要在Servlet中指定multipart的配置。就是说要在web.xml或者Servlet初始化类中，将multipart的具体细节作为DispatcherServlet配置的一部分。

如果我们采用Servlet初始化类的方式来进行配置DispatcherServlet，那么这个初始化类应该已经实现了WebApplicationInitializer。就可以在Servlet registration上调用setMultipartConfig()方法并传入一个MultipartConfigElement实例。代码示例如下：

```java
import ...

public class SpittrWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected String[] getServletMappings () {
        return new String[] { "/", "/hello/*"};
    }

    @Override
    protected Class<?>[] getRootConfigClasses () {
        return new Class<?>[] {RootConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses () {
        return new Class<?>[] {WebConfig.class};
    }

    @Override
    protected void customizeRegistration (ServletRegistration.Dynamic registration) {
        registration.setMultipartConfig(getMultipartConfigElement());
    }

    MultipartConfigElement getMultipartConfigElement () {
        return new MultipartConfigElement(LOCATION, MAX_FILE_SIZE, MAX_REQUEST_SIZE, FILE_SIZE_THRESHOLD);
    }

    private static final String LOCATION = "C:\Users\XXX\Desktop";
    // 5MB : Max file size.
    private static final long MAX_FILE_SIZE = 5242880; 
    // Beyond that size spring will throw exception.
    // 20MB : Total request size containing Multi part.
    private static final long MAX_REQUEST_SIZE = 20971520;
    // Size threshold after which files will be written to disk
    private static final int FILE_SIZE_THRESHOLD = 0; 
}
```

以上代码就是在配置DispatcherServlet类中通过customizeRegistration()方法进行自定义的配置。实例通过调用setMultipartConfig()方法来进行文件的多路上传进行配置。这个方法传入一个MultipartConfigElement实例作为配置参数，可以看到这个实例的构造器又传入了多项配置，从前向后依次为：上传文件存放路径、单个文件最大限制、多个文件总体容量限制与超出容量是否放进缓存。

我先看个电影，明天继续。

回来了，继续。现在已经在Spring中对multipart的请求做好了配置，下面要做的就是编写控制器来对上传的文件进行接收。文件的接收与之前的参数接收不同，一般使用@RequestPart注解。现在对之前的form.jsp进行修改，让这个表单能够支持文件的上传：

```jsp
<form method="post" enctype="multipart/form-data">
  姓名: <input type="text" name="name">
  专业: <input type="text" name="major">
  位置: <input type="number" name="room">
  女友: <input type="password" name="password">
  照片: <input type="file" name="file">
  <input type="submit" value="提交">
</form>
```

表单的修改主要有两个地方，一是form标签中添加属性enctype="multipart/form-data"，这个属性是用来表示表单提交的数据不对字符进行编码，如果有文件上传的表单控件的时候，必须使用这个属性。在multipart中，每一个输入域都会对应一个part。另外一个就是文件的上传，type类型为file，同时这个input标签还可以设定accept属性来具体限制上传文件类型。

然后就是要对控制器进行修改。如下:

```java
@SessionAttributes({"boy"})
@Controller
public class formController {
    @RequestMapping(value = "/form", method = GET)
    public String showForm () {
        return "form";
    }

    @RequestMapping(value = "/form", method = POST)
    public String handleForm (Map<String,Object> map, Student student, @RequestPart("file") byte[] picture) {
        if (picture != null) {
            System.out.println("get picture");
        }
        map.put("boy", student);
        return "redirect:/hello/" + student.getName();
    }

    @RequestMapping(value = "/{studentName}", method = GET)
    public String showFormData () {
        return "studentInfo";
    }
}
```

可以看到，现在是使用的@RequestPart注解辅助对文件的接收，注解的value需要与表单的name一致。在参数列表中使用一个字节数组来获取文件。然后可以看到现在的文件的的确实存放在桌面上了，但是文件名却是Web应用自动设置的。

以上只是最最进本的方法，Spring提供了MultipartFile接口，他可以更好地处理multipart对象。他可以获得原始地文件名、大小以及内容类型，并且还提供了一个输入流用以将文件数据以流的方式进行读取。除此之外，Multipart还提供了一个transferTo()方法，这个方法能够将上传地文件写入到文件系统中。例如：

```java
@SessionAttributes({"boy"})
@Controller
public class formController {
    @RequestMapping(value = "/form", method = GET)
    public String showForm () {
        return "form";
    }

    @RequestMapping(value = "/form", method = POST)
    public String handleForm (Map<String,Object> map, Student student, @RequestParam("file") MultipartFile picture) {
        if (picture != null) {
            try {
                picture.transferTo(new File("C:\\Users\\XXX\\Desktop\\gaga\\" + picture.getOriginalFilename()));
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println("picture");
        }
        map.put("boy", student);
        System.out.println(student.getName());
        System.out.println(student.getMajor());
        System.out.println(student.getPassword());
        return "redirect:/hello/" + student.getName();
    }

    @RequestMapping(value = "/{studentName}", method = GET)
    public String showFormData () {
        return "studentInfo";
    }
}
```

注意以上代码地路径要改成自己电脑地路径，要不然会有IOException。运行代码并上传文件，现在可以看到指定目录下就有了上传地文件（文件名可能会乱码，需要将编码格式统一）。

另外还有一种以Part地形式接收上传地文件。与MultipartFile类似，不细说了。



## 处理异常

Spring提供了多种方式将异常转换为Servlet响应：

1. 特定地Spring异常将会自动映射为指定地HTTP状态码
2. 异常上可以添加@ResponseStatus注解，从而将其映射为某个HTTP状态码
3. 在方法上可以添加@ExceptionHandler注解，使其用来处理异常


在默认情况下，Spring会将自身的一些异常自动地转换为合适的状态码，这些异常一般会由Spring自身抛出，作为DispatcherServlet处理过程种或执行校验时出现问题的结果。

| Spring异常                                | HTTP状态码 |
| --------------------------------------- | ------- |
| BindException                           | 400     |
| ConversionNotSupportedException         | 500     |
| HttpMediaTypeNotAcceptableException     | 406     |
| HttpMediaTypeNotSupportedException      | 415     |
| HttpMessageNotReadableException         | 400     |
| HttpMessageNotWritableException         | 500     |
| HttpRequestMethodNotSupportedException  | 405     |
| MethodArgumentNotValidException         | 400     |
| MissingServletRequestParameterException | 400     |
| MissingServletRequestPartException      | 400     |
| NoSuchRequestHandlingMethodException    | 404     |
| TypeMismatchException                   | 400     |

然而这些内置的异常映射对于应用所抛出的异常却无能无力，此时可以通过@ResponseStatus注解将异常映射为HTTP状态码。示例代码如下：

```java
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Gakki not found")
public class CanNotFindGirlfriendException extends RuntimeException {
}
```

然后假如在某个控制器中添加异常的抛出，如下：

```java
public String getGakki (Model model, @PathVariable String girlfriend) throws Exception{
  girlfriend = new String(girlfriend.getBytes("ISO-8859-1"), "UTF-8");
  model.addAttribute("girlfriend", girlfriend + "是你的女朋友。");
  if (girlfriend.equals("gakki")) {
    System.out.println("新垣结衣才不是你的女盆友。");
    throw new CanNotFindGirlfriendException();
  } else {
    System.out.println("嗯？");
  }
  return "home";
}
```

现在如果请求的url路径为"/gakki/haha"，就会抛出CanNotFindGirlfriendException异常。刚才新创建的这个异常的注解包含两个属性，一是状态码，二是异常原因。这些信息都可以在客户端进行显示：

![](https://i.imgur.com/YBybEGo.png)

以上将异常映射为状态码简单易用，但是如果想要在响应中既包括状态码，又包含所产生的错误，那么就不能将异常视为HTTP错误，此时需要按照处理请求的方式来处理异常。

首先需要在控制器逻辑中抛出一个错误，然后通过一个方法来对异常进行捕获。示例代码如下：

```java
@RequestMapping(value = "/{girlfriend}/haha", method = GET)
public String getGakki (Model model, @PathVariable String girlfriend) throws Exception{
  girlfriend = new String(girlfriend.getBytes("ISO-8859-1"), "UTF-8");
  model.addAttribute("girlfriend", girlfriend + "是你的女朋友。");
  if (girlfriend.equals("gakki")) {
    System.out.println("新垣结衣才不是你的女盆友。");
    throw new CanNotFindGirlfriendException();
  } else {
    System.out.println("嗯？");
  }
  isGirlfriendGakki(girlfriend);
  return "home";
}

void isGirlfriendGakki (String girlfriend) {
  if (girlfriend.equals("xinyuanjieyi")) {
    throw new QingxiehanziException();
  }
}

@ExceptionHandler(QingxiehanziException.class)
public String handleQingxiehanziException() {
  return "error/hanzi";
}
```

```java
public class QingxiehanziException extends RuntimeException {}
```

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head><title>汉字异常</title></head>
<body><h1>请不要写汉语拼音</h1></body>
</html>
```

以前的时候是在控制器中有一个try-catch语句块用来捕捉异常，这样的代码不够简洁，现在使用@ExceptionHandler注解可以避免这种问题。现在会在路径为“xinyuanjieyi”的时候抛出一个QingxiehanziException异常，然后被handleQingxiehanziException()方法捕捉。如下：

![](https://i.imgur.com/ULMdciH.png)

这种带有@ExceptionHandler注解的异常处理函数也需要返回一个String，这个String代表的视图名，这里我在views目录下专门创建了一个error目录用以存放各种错误视图。另外这种注解相对于try-catch语句的一点好处就是，这种方式能够处理同一个控制器中所有处理器方法所抛出的异常，这样就大大简化了代码。



## 为控制器添加通知

如果控制器类的特定切面能够运用到整个应用程序的所有控制器中，那么这将会便利很多。刚才说带有@ExceptionHandler的方法可以捕获他所在的控制器类中所有的相同类型的异常，但是如果有多个控制器类，而且抛出的异常也有重复，那么需要在不用的控制器中编写多个相同的函数，或者是创建一个基础的控制器类，然后所有的控制器来继承这个类，从而继承父类中的带有@ExceptionHandler方法。但是在Spring3.2中，有了更好的解决方法：控制器通知。

控制器通知（controller advice）是任意带有@ControllerAdvice注解的类，这个类会包含一个或者多个如下类型的方法：

1. @ExceptionHandler注解标注的方法
2. @InitBinder注解标注的方法
3. @ModelAttribute注解标注的方法

在带有@ControllerAdvice注解的类中，以上所述的这些方法会运用到整个程序所有控制器中带有@RequestMapping注解的方法上。@ControllerAdice注解本身已经使用了@Component，因此@ControllerAdvice注解苏标注的类将会自动的被组件扫面获取到，就像带有@Component注解的类一样。

@ControllerAdvice标注最为使用的一个场景就是将所有的@ExceptionHandler方法收集到一个类中，这样所有的控制器的异常就能在一个地方进行一致的处理。如下：

```java
@ControllerAdvice
public class AppWideExceptionHandler {
    @ExceptionHandler(QingxiehanziException.class)
    public String handleQingxiehanziException() {
        return "error/hanzi";
    }
}
```

以上代码将之前在某个控制器中的异常处理函数转移到这个通知类中，现在这个方法已经可以处理整个web应用范围内中的异常。现在如果任意的控制器方法抛出了异常，不管这个方法位于哪个控制器中，都会调用这个方法来处理异常。



## 跨重定向请求传递数据

在处理完成Post请求之后，通常来讲最好需要进行重定向。当控制器方法返回的String字符串以“redirect:”开头的话，那么这个String就不是用来查找视图的，而是用来指导浏览器进行重定向的路径。

一般来讲，当处理器方法完成之后，该方法所制定的模型数据将会复制到请求之中，并作为请求中的属性，请求会转发到视图上进行渲染。因为控制器方法和视图所处理的是同一个请求，所以在妆发的过程中，请求属性能够得以保存。

但是，当控制器放回的结果是重定向的话，原始的请求就结束了，并且会发起一个新的Get请求，原始请求中所带有的模型数据也就随着请求一起消亡了，在新的请求中，没有任何的模型数据。

所以，对于重定向来说，模型并不能用来传递数据，但是可以使用其他的方法将数据传递到新的请求中：

1. 使用URL模板以路径变量或查询参数的形式传递数据
2. 通过flash属性发送数据

通过路径变量和查询参数的形式跨重定向传递数据是很简单的方式，这里就不具体说了。但是这种方式有一定的限制，它只能用来发送简单的值。在URL中，并没有办法发送更为复杂的值，所以着重讲一下flash属性发送数据。

Spring提供了将数据发送为flash属性（flash attribute）的功能，flash属性会一致携带这些数据直到下一次请求才会消失。Spring提供了通过RedirectAtributes设置flash属性的方法，这是Sprign3.1引入的Model的一个子接口。RedirectAttributes提供了Model的所有功能，初次之外，还有几个方法使用了设置flash属性的。RedirectAttributes提供了一组addFilashAttribute()方法来添加flash属性。示例代码如下：

```java
@RequestMapping(value = "/redirect", method = GET)
public String gettingRedirect (RedirectAttributes model) {
  model.addFlashAttribute("city", "Flash");
  model.addFlashAttribute("girlfriend", "转发接收数据");
  return "redirect:/hello/home";
}
```

以上代码为某个控制器中的接收器，可见注入的参数为一个RedirectAttributes对象，这个对象调用addFlashAttribute()方法来添加参数（不要在意变量名），这样在进行转发的时候还是可以接收到参数。



参考与感谢：

1. [Spring MVC 实现文件上传](http://blog.csdn.net/w605283073/article/details/51340880)