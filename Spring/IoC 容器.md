# IoC 容器

## IoC 概述

IoC（Inverse of Control）的字面意思即是控制反转。对于软件来说，即某一接口具体实现类的选择控制权从调用类中移除，转交给第三方决定，即由 Spring 容器借由 Bean 配置来进行控制。

DI（Dependency Injection）依赖注入的概念被提出用来代替 IoC，即让调用类对某一接口实现来的依赖关系由第三方（容器或协作类）注入，以移除调用类对某一接口实现类的依赖。

### IoC 的类型

IoC 主要可以划分为 3 种类型：

* 构造函数注入：即在构造函数中通过构造函数变量传入**接口实现类**
* 属性注入：属性注入可以有选择地通过 Setter 方法完成调用类所需依赖的注入，更加灵活方便
* 接口注入：将调用类所有依赖注入的方法抽取到一个接口中，调用类通过实现该接口提供相应的注入方法。但是由于通过接口注入需要额外声明一个接口，增加了类的数目却与属性注入的效果并没有本质区别，所以不提倡采用这种注入方式

### 通过容器完成依赖关系的注入

程序中第三方的容器帮助完成类的初始化与装配工作，让开发者从这些底层实现类的实例化、依赖关系装配等工作种解脱出来，专注于等有意义的业务逻辑开发工作。Spring 就是这样的一个容器，它通过配置文件或者注解描述类和类之间的关系，自动完成类的初始化和依赖注入工作。

在容器启动时，Spring 根据配置文件的描述信息，自动实例化 Bean 并完成依赖关系的装配，从容器种即可返回准备就绪的 Bean 实例，后续可以直接使用。



## 相关 Java 基础知识

Java 语言通过本身所有的类反射功能完成以上的 Bean 的实例化与装配。

### 反射简单实例

```java
public class Car {
  private String brand;
  private String color;
  private int maxSpeed;
  
  // 默认构造函数
  public Car() {}
  
  // 带参数的构造函数
  public Car(String brand, String color, int maxSpeed) {
    this.brand = brand;
    this.color = color;
    this.maxSpeed = maxSpeed;
  }
  
  // getter setter 
  ...
}
```

一般情况下要创建 Car 实例通过以上的两个构造器：

```java
Car car1 = new Car();
car.setBrand("奥托");
Car car2 = new Car("奥迪", "black"， 200)；
```

除了以上的直接调用目标类的方法，还可以通过 Java 的反射机制以间接方式操控目标类：

```java
public class ReflectTest {
    public static Car initByDefaultConst() throws Throwable {
        // 通过类加载器获取 Car 的 class 对象，注意如有包应写类的全名
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        Class clazz = loader.loadClass("packageName.Car");

        // 获取类的默认构造器对象并通过它来实例化 Car
        Constructor cons = clazz.getDeclaredConstructor((Class[]) null);
        Car car = (Car) cons.newInstance();

        // 通过反射方法设置属性
        Method setBrand = clazz.getMethod("setBrand", String.class);
        setBrand.invoke(car, "丰田");
        Method setColor = clazz.getMethod("setColor", String.class);
        setColor.invoke(car, "white");
        Method setMaxSpeed = clazz.getMethod("setMaxSpeed", int.class);
        setMaxSpeed.invoke(car, 200);
      
      	// 或者调用含参构造器
      	Constructor cons2 = clazz.getDeclaredConstructor(new Class[] {String.class, String.class, int.class});
        Car car2 = (Car) cons2.newInstance("凯迪拉克", "red", 200);

      	// return car2；
        return car;
    }

    public static void main(String[] args) throws Throwable {
        Car car = initByDefaultConst();
        System.out.println(car.toString());
    }
}
```

以上代码有几个重要的反射类，分别是 ClassLoader，Class，Constructor 和 Method，通过这些反射类就可以间接调用目标 Class 的各项功能。

### 类加载器 ClassLoader

类加载器就是寻找类的字节码文件并构造出类在 JVM 内部表示对象的组件。在 Java 中，类加载器把一个类装入 JVM 中，需要经过以下步骤：

1. 装载：查找和导入 Class 文件
2. 链接：执行校验、准备和解析步骤，其中解析步骤可选
3. 初始化：对类的静态变量、静态代码块执行初始化工作

类加载的工作由 ClassLoader 及其子类负责。ClassLoader 是一个重要的 Java 运行时系统组件，它负责在运行时查找和装入 Class 字节码文件。JVM 在运行时会产生 3 个 ClassLoader：根加载器、ExtClassLoader（扩展类加载器）以及 AppClassLoader（应用类加载器）。其中根加载器不是 ClassLoader 的子类，它使用 C++ 语言编写，因而在 Java 中看不到它，根加载器负责加载 JRE 的核心类库。另外的 ExtClassLoader 与 AppClassLoader（是 ExtClassLoader 的子类） 都是 ClassLoade 的子类，其中 ExtClassLoader 负责加载 JRE 扩展目录 ext 中的 JAR 类包，而 AppClassLoader 负责加载 ClassPath 路径下的类包。

它们的父子继承关系如下证明：

```java
public class ClassLoaderTest {
  public static void main(String[] args) {
    ClassLoader loader = Thread.currentThread().getContextClassLoader();
    System.out.println("current loader: " + loader);
    System.out.println("parent loader: " + loader.getParent());
    System.out.println("grandparent loader: " + loader.getParent().getParent());
  }
}
/** OUTPUT
* current loader: jdk.internal.loader.ClassLoaders$AppClassLoader@726f3b58
* parent loader: jdk.internal.loader.ClassLoaders$PlatformClassLoader@e73f9ac
* grandparent loader: null
*/
```

注意以上的输出，首先调用当前线程的 getContextClassLoader 方法获得类加载器，即得到 AppClassLoader，为什么是获得这个类加载器呢？这实际上是类加载的父委托机制，当加载一个类的时候，首先使用最低级的类加载器进行尝试加载，如果这个类加载器可以加载，那么就对相应的类进行加载；如果这个类不能够被加载，则使用当前类加载器的父类进行加载，依次执行，就像 JavaScript 中的事件冒泡一样。但是获取它的父类的时候，则没有得到 ExtClassLoader，这是由于在 JDK 9（我当前使用的版本）中使用 PlatformClassLoader 代替了 ExtClassLoader。然后第三行的输出为 null 是因为 PlatformClassLoader 的父类为 BootstrapClassLoader 根类加载器，它不是由 java 语言编写，所以无法获得，因此返回 null。

每个类在 JVM 中都拥有一个对应的 java.lang.Class 对象，它提供了类结构信息的描述。Class 没有 public 的构造方法，Class 对象是在装载类时由 JVM 通过调用类加载器中的 defineClass 方法自动构造的。

### Java 反射机制

Class 反射对象描述语义结构，可以从 Class 对象中获取构造函数、成员变量、方法类等元素的反射对象，并以编程的方式通过这些反射对象对目标类对象进行操作。这些反射对象类在 java.lang.reflect 包中定义。主要的反射类如下：

* Constructor：类的构造函数反射类，通过 Class#getConstructors() 方法可以获取类的所有构造函数反射对象数组。还可以通过 Class#getConstructor(Class\<T\>... paramaterTypes) 来获取拥有特定参数的构造函数对象。这个类的实例有一个重要的方法就是 newInstance(Object... initargs)。这个方法可以使用当前实例所表示的构造器函数来构造某个类的实例，相当于 new 关键字。
* Method：类方法的反射类，通过 Class#getDeclaredMethods() 方法可以获取类的所有方法反射类对象数组 Method[]。也可以通过 getDeclaredMethod(String name, Class... parameterTypes) 获取特定签名的方法，其中 name 为方法名，parameterTypes 为方法的参数类型列表。而 Method 最主要的方法是 invoke(Object obj， Object... args)，其中 obj 表示操作的目标对象，args 表示方法的各个参数。
* Field：类的成员变量的反射类，通过 Class#getDeclaredFields() 方法可以获取类的成员变量反射数组，通过 getDeclaredField(String name) 方法可以获取某个特定名称的成员变量反射对象。Field 类重要的方法有 set(Object obj, Object value)，其中 obj 表示操作的目标对象，value 表示要设定的值。对于基础类型的值，还可以通过专门的方法来设定域的值。



## 资源访问利器

### 资源抽象接口

JDK 所提供的访问资源的类（如 java.net.URL、File 等）并不能很好地满足各种底层资源的访问需求。Spring 设计了一个 Resource 接口，他为应用提供了更强的底层资源访问能力，该接口拥有对应不同资源类型的实现类。Resource 接口的主要方法如下：

```java
boolean exists()									// 资源是否存在
boolean isOpen()									// 资源是否打开
URL getURL() throws IOException			// 返回 URL 对象
File geteFile() throws IOException	// 返回 File 对象
InputStream getInputStream() throws IOException	// 返回资源对应的输入流
```



### 资源加载

Spring 提供了一个强大的加载资源的机制，不但能够通过 "classpath:"、"file:" 等资源地址前缀识别不同的资源类型，还支持 Ant 风格带通配符的资源地址。

#### 资源表达式地址

Spring 支持以下的资源类型地址前缀：

* classpath：从类路径中加载资源，"classpath:" 与 "classpath:/" 是等价的，都是相对于类的根路径。
* file：使用 UrlResource 从文件系统目录中装载资源
* http://：使用 UrlResource 从 Web 服务器中装载资源
* ftp://：使用 UrlResource 从 FTP 服务器中装载资源

Ant 风格的资源地址支持 3 种匹配符：

1. "?"：匹配文件名中的一个字符
2. "*"：匹配文件名中的任意字符
3. "**"：匹配多层路径

#### 资源加载器

ResourceLoader 接口仅有一个 getResource(String location) 方法，可以根据一个资源地址加载文件资源。不过资源地址仅支持带资源类型前缀的表达式，不支持 Ant 风格的资源路径表达式。ResourcePatternResolver 扩展 ResourceLoader 接口，定义了一个新的 getResources(String locationPattern) 方法，此方法支持带资源类型前缀及 Ant 风格的资源路径表达式。



## BeanFactory 和 ApplicationContext

Spring 通过一个配置文件描述 Bean 与 Bean 之间的依赖关系，利用 Java 语言的反射功能实例化 Bean 并建立 Bean 之间的依赖关系。Spring 的 IoC 容器在完成这些底层工作的基础上，还提供了 Bean 实例缓存、Bean 实例代理、生命周期管理、事件发布、资源装载等高级服务。

Bean 工厂（BeanFactory）是 Spring 框架最核心的接口，它提供了高级 IoC 的配置机制，BeanFactory 使管理不同类型的 Java 对象成为可能。应用上下文（ApplicationContext）建立在 BeanFactory 的基础之上，提供了更多面向应用的功能，它提供了国际化支持和框架事件体系，更易于创建实际应用。我们一般称 BeanFactory 为 IoC 容器，而称 ApplicationContext 为应用上下文。

### BeanFactory 介绍

BeanFactory 是一个类的通用工厂，它可以创建并管理各种类的对象。所有可以被 Spring 容器实例化并管理的 Java 类都可以成为 Bean。通过 BeanFactory 启动 IoC 容器时，并不会初始化配置文件中定义的 Bean，因为初始化的动作是发生在第一个调用的时候。对于单例（Singleton）的 Bean 来说，BeanFactory 会缓存 Bean 实例，所以在第二次使用 getBean() 方法获取 Bean 实例的时候，将直接从 IoC 容器的缓存中获取 Bean 实例。Spring 在 DefaultSingletonBeanRegistry 类中提供了一个用于缓存单例 Bean 的缓存器，它是一个用 HashMap 实现的缓存器，单例 Bean 以 beanName 为键保存在这个 HashMap 中。

如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans   
                           http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">

  <bean id="car" class="com.smart.Car"
        p:brand="奔驰"
        p:color="红色"
        p:maxSpeed="220" />

</beans>
```

```java
package com.smart;

import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

public class BeanFactoryTest {
  public void getBean() throws Exception {
    ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
   
    Resource res = resolver.getResource("classpath:beans.xml");
    System.out.println(res.getURL());

    DefaultListableBeanFactory factory = new DefaultListableBeanFactory();
    XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(factory);
    reader.loadBeanDefinitions(res);

    System.out.println("Init BeanFactory.....");

    Car car = factory.getBean("car", Car.class);
    System.out.println("Car bean is ready for use");
    System.out.println(car);
  }

  public static void main(String[] args) {
    BeanFactoryTest test = new BeanFactoryTest();
    try {
      test.getBean();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
```



### ApplicationContext 介绍

ApplicationContext 由 BeanFactory 派生而来，功能可以通过配置的方式来进行实现。ApplicationContext 的主要实现类为 ClassPathXmlApplicationContext 与 FileSystemXmlApplicationContext，前者默认从类路径加载配置文件，后者默认从文件系统中装载配置文件。和 BeanFactory 初始化相似，ApplicationContext 的初始化也很简单。如果配置文件放置在类路径下，则可以优先考虑使用 ClassPathXmlApplicationContext 实现类。如下：

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("com/beans.xml");
```

FileSystemXmlApplicationContext 同理。还可以指定一组配置文件，spring 会自动将多个配置文件在内存中”整合“成一个配置文件。

在获取 ApplicationContext 实例之后，就可以像 BeanFactory 一样调用 getBean() 方法返回 Bean 了。ApplicationContext 的初始化和 BeanFactory 有一个重大的区别在于：BeanFactory 在初始化容器时，并未实例化 Bean，直到第一次访问某个 Bean 的时候才实例化目标 Bean；而 ApplicationContext 则在初始化应用上下文时就实例化所有单例的 Bean。因此 ApplicationContext 的初始化时间会比 BeanFactory 的时间稍长一些。

另外 Spring 还提供了注解类的配置方式的 AnnotationConfigApplicationContext 实现类。如下：

```java
@Configuration
public class Config {
  @Bean(name = "car")
  public Car buildCar() {
    return new Car("法拉利", "yellow", 340);
  }
}
```

以上代码的 @Configuration 注解就是说明这个类是一个配置信息提供类，然后在工厂方法上边使用了 @Bean 注解来表明这个方法用于提供 Bean，这个 Bean 的 name 即括号中的字符串。

```java
public void getBean2() {
  ApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
  Car car = context.getBean("car", Car.class);
  System.out.println(car);
}
```

以上的 ApplicationContext 就是加载了这个配置信息提供类，然后获得相应的 Bean 实例。

最后 Spring 4.0 之后还提供 Groovy DSL 来进行 Bean 的配置，就不详细说了。

WebApplicationContext 是专门为 Web 应用准备的，它允许从相对于 Web 根目录路径中装载配置文件完成初始化工作。在非 Web 应用的环境下，Bean 只有 Singleton 和 Prototype 两种作用域，而 WebApplicationContext 为 Bean 添加了三个新的作用域：request、session 和 global session。WebApplicationContext 的初始化方式和 BeanFactory、ApplicationContext 有所区别，因为 WebApplicationContext 需要 ServletContext 实例，所以它必须在拥有 Web 容器的前提之下才能完成启动工作。



## Bean 的生命周期

### BeanFactory 中 Bean 的生命周期

![](https://i.imgur.com/TiqtpA5.png)

以上图片来自 [SpringBean生命周期详解](https://blog.csdn.net/lisongjia123/article/details/52091013)，其中拼写略有错误，但是大致就是这样的过程。

Bean 的完整生命周期从 Spring 容器着手实例化 Bean 开始，直到最终销毁 Bean。其中经历许多方法调用，这些方法大致分为 4 类：

* Bean 自身的方法，如调用 Bean 的构造函数进行实例化，调用 Setter 设置 Bean 的属性值及通过 \<bean\> 的 init-method 和 destroy-method 所指定的方法。
* Bean 级生命周期接口方法，如 BeanNameAware、BeanFactoryAware、InitializingBean 和 DisposableBean。
* 容器级生命周期接口方法，当 Spring 容器创建任何 Bean 的时候，这些后处理器都会发生作用，默认的影响是全局性的。
* 工厂后处理器接口方法，工厂后处理器也是容器级的，在应用上下文装配配置文件后立即调用。



## Spring 配置概述

要使一个用程序中的 Spring 容器成功启动，需要同时具备以下三个方面的条件：

* Spring 框架的类都已经放到应用程序的类路径下。
* 应用程序为 Spring 提供了完备的 Bean 配置信息。
* Bean 的类都已经放到应用程序的类路径下。

Spring 启动时读取应用程序提供的 Bean 配置信息，并在 Spring 容器中生成了一份相应的 Bean 配置注册表，然后根据这张注册表实例化 Bean，装配好 Bean 之间的依赖关系，为上层应用提供准备就绪的运行环境。

Spring 支持多种形式的 Bean 配置方式。Bean 配置信息首先定义了 Bean 的实现及依赖关系，Spring 容器根据各种形式的 Bean 配置信息在容器内部建立 Bean 定义注册表；然后根据注册表加载并实例化 Bean、并建立 Bean 之间的依赖关系；最后将这些准备就绪的 Bean 放到 Bean 缓存池中，以供外层的应用程序调用。

Spring 2.0 之后采用 Schema 格式的 xml 配置文件。Schema 在文档根节点中通过 xmlns 对文档所应用的命名空间进行声明。除了支持 XML 配置方式外，Spring 还支持基于注解、Java 类以及该 Groovy 的配置方式，不同的配置方式在“质”上时基本相同的，只是存在“形”的差别。

## Bean 基本配置

一般情况下，Spring IoC 容器中的一个 Bean 对应配置文件中的一个 \<bean\>，这种镜像映射关系容易理解，其中 id 为这个 Bean 的名称，通过容器的 getBean() 方法即可获取对应的 Bean，在容器中起到定位查找的作用，class 属性则指定了 Bean 对应的实现类。如：

```xml
<bean id="Student" class="com.hello.Student" />
```

一般情况下，在配置一个 Bean 时，需要为其指定一个 id 属性作为 Bean 的名称，id 在 IoC 容器中必须时唯一的，而且 id 的命名需要满足 XML 对 id 的命名规范，如果用户确实希望使用一些特殊的字符，那么可以转而使用 name 属性。如：

```xml
<bean name="#sharp" class="com.hello.Sharp">
```

Spring 配置文件虽然不允许出现两个相同 id 的\<bean\>，但却可以出现两个相同 name 的\<bean\>，如果有多个 name 相同的 Bean，那么通过 getBean(beanName) 方法获取 Bean 时，会返回后面声明的 Bean，原因是后面的 Bean 覆盖了前面同名的 Bean。如果 id 和 name 两个属性都未指定，那么 Spring 自动将全限定类名作为 Bean 的名称。

## 依赖注入

### 属性注入

属性注入指通过 setXxx() 方法注入 Bean 的属性值或依赖的对象，属性注入方式具有可选择性和灵活性高的优点，因此属性注入是实际应用中最常采用的注入方式。

属性注入要求 Bean 提供一个默认的构造函数，并为需要注入的属性提供对应的 Setter 方法。例如：

```java
public class Car {
  public Car() {}
  private int price;
  public void setPrice(int price) {
    this.price = price;
  }
}
```

对于以上的这个类，可以对 Bean 进行如下的属性注入：

```xml
<bean id="car" class="com.hello.car">
	<property name="price"><value>3000</value></property>
</bean>
```

Spring 配置文件中 \<property\> 元素所指定的属性名和 Bean 实现类的 Setter 方法满足：xxx 的属性名对应 setXxx() 方法。此时需要注意一点 JavaBean 命名规范中若变量开头字母大写，那么变量的前两个字母要么全部大写，要么全部小写。

### 构造函数注入

```xml
<bean id="car" class="com.smart.Car">
  <constructor-arg index="1" type="java.lang.String">
    <value>银灰</value>
  </constructor-arg>
  <constructor-arg index="0" type="java.lang.String">
    <value>本田</value>
  </constructor-arg>
  <constructor-arg index="2" type="int">
    <value>180</value>
  </constructor-arg>
</bean>
```

以上的构造函数注入中，有两个参数都是 String 类型，此时通过显式指定参数的索引能够消除这种不确定性。

### 工厂方法注入

#### 非静态工厂方法

```Java
public class CarFactory {
  private Car getCar() { 
    return new Car("通用", "天蓝", 300);
  }
}
```

```xml
<bean id="carFactory" class="com.smart.CarFactory"></bean>
<bean id="carMadeInFactory" factory-bean="carFactory" factory-method="getCar"></bean>
```

由于 CarFactory 工厂类的工厂方法不是静态的，所以首先需要定义一个工厂类的 Bean，然后通过 factory-bean 引用工厂类的实例，最后通过 factory-method 属性指定对应工厂类的方法。

#### 静态工厂方法

当使用静态工厂类型的方法后，用户就无需再配置文件中定义工厂类的 Bean，只需将实体类的 Bean 设定工厂类与对应方法即可：

```java
public class StaticCarFactory {
  public static Car getCar() {
    return new Car("大众", "红色", 10);
  }
}
```

```xml
<bean id="carMadeInStaticFactory" class="com.smart.StaticCarFactory" factory-method="getCar"></bean>
```



## 注入参数

### 字面值

```xml
<bean id="carWithConstructor" class="com.smart.Car">
  <constructor-arg index="1" type="java.lang.String">
    <value>银灰</value>
  </constructor-arg>
  <constructor-arg index="0" type="java.lang.String">
    <value><![CDATA[梅赛德斯&奔驰]]></value>
  </constructor-arg>
  <constructor-arg index="2" type="int">
    <value>180</value>
  </constructor-arg>
</bean>
```

字面值即是可用字符串表示的值，这些值可以通过 \<value\> 元素标签进行注入。XML 中有 5 个特殊字符，分别是 &、<、>、"、'。如果配置文件中的注入值包含这些特殊字符，那么就需要进行特殊处理，有两种办法：

* 使用 \<![CDATA[ ]]\> 标签让 XML 解释器将标签中的字符串当作普通文本对待
* 使用 XML 转译序列表示这些特殊字符

String 中不会忽略元素标签内部字符串的前后空格

### 引用其他 Bean

Spring IoC 容器中的 Bean 可以相互引用，通过 ref 元素，即可通过以下两个属性引用容器中其他 Bean：

* bean：通过该属性可以引用同一容器或父容器的 Bean
* parent：引用父容器中的 Bean

### 内部 Bean

如果一个 Bean 只能够被另一个 Bean 应用，而不能被容器中任何其他 Bean 应用，则可以将它以内部 Bean 的方式注入，内部 Bean 和 Java 的匿名内部类相似，它既没有名字，也不能被其他 Bean 引用，只能在声明处为外部 Bean 提供实例注入。

内部 Bean 即使是提供了 id、name、scope 等属性，也会被忽略；scope 属性默认为 prototype。

### null 值

如果想要注入一个 null 值，需要使用专门的 \<null\> 元素标签，通过它可以为字符串以及其他的对象类型的属性注入 null 值。

### 集合类型属性

java.util 包中的集合类型是最常用的数据结构类型，主要包括 List、Set、Map、Properties 等，Spring 为这些集合类型属性提供了专属的配置标签。

* List 与 Set 属性可以通过 \<value\> 注入字符串，也可以通过 \<ref\> 注入容器中其他的 Bean。
* Map 可以通过 \<entrty\> 标签来设定一个映射，其中分为两部分，一个 \<key\> 与一个 \<value\>，其中的这两个标签都可以设定 \<ref\> 与 \<value\>。
* Properties 类型是 Map 类型的特例，Properties 属性的键和值都只能是字符串。

### 简化配置方式

以上的各种配置实在是纷繁复杂，实际上不论是 value 属性还是 ref 属性都可以合并到它的上一层中。另外还可以使用 p 命名空间，通过 \<bean\> 元素属性的方式配置 Bean 的属性，使用 p 命名空间之后，基于 XML 的配置方式将进一步简化。

```xml
xmlns:p="http://www.springframework.org/schema/p"
```



## \<bean\> 之间的关系

### 继承

如果多个 \<bean\> 存在相同的配置信息，则 Spring 允许定义一个父 \<bean\>，子 \<bean\> 将自动继承父 \<bean\> 的配置信息。

```xml
<bean id="abstractCar" class="com.smart.Car" p:brand="路虎" p:maxSpeed="200" p:color="黑色" abstract="true" />

<bean id="redCar" p:color="red" parent="abstractCar" />
<bean id="whiteCar" p:color="white" parent="abstractCar" />
```

### 依赖

一般可以使用 \<ref\> 元素标签建立对其他 Bean 的依赖关系，Spring 负责管理这些 Bean 的关系，当实例化一个 Bean 时，Spring 保证该 Bean 所依赖的其他 Bean 已经初始化。

Spring 也允许用户通过 depends-on 属性显式地指定 Bean 前置依赖的 Bean，前置依赖的 Bean 会在 Bean 实例化之前创建好。

## 整合多个配置文件

对于一个大型应用来说，可能存在多个 XML 配置文件，在启动 Spring 容器时，可以通过一个 Spring 数组指定这些配置文件。Spring 还允许通过 \<import\> 将多个配置文件引入到一个文件中，进行配置文件的集成。这样，在启动 Spring 容器时，仅需指定这个合并好的配置文件即可。

```xml
<import resource="classpath:com/hello/impt/beans1.xml" />
<import resource="classpath:com/hello/impt/beans2.xml" />
```

一个 XML 配置文件可以通过 \<import\> 组合多个外部的配置文件，resource 属性支持 Spring 标准的资源路径。



## 参考与感谢

1. [分析BootstrapClassLoader/ExtClassLoader/AppClassLoader的加载路径 及"父委托机制"](https://blog.csdn.net/irelandken/article/details/7048817)
2. [classpath到底指的哪里](http://www.cnblogs.com/lfjjava/p/6100831.html)
3. [SpringBean生命周期详解](https://blog.csdn.net/lisongjia123/article/details/52091013)