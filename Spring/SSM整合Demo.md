# SSM整合Demo



本demo主要使用练习示范Spring / SpringMVC / Mybatis三个框架的整合使用。

## 1. 准备工作

使用集成开发环境IDEA创建Spring项目的时候勾选SpringMVC，此时IDEA会自动导入Spring与SpringMVC的相关18个jar包，所以另外需要手动导入的jar包有如下：

1. druid        数据库连接池
2. junit         单元测试
3. mybatis-spring        mybatis与spring整合包
4. mysql-connector        mysql的jdbc驱动

另外需创建数据库。



## 2. 编写配置文件

1. Mybatis全局配置文件sqlMapConfig.xml：

   此文件为Mybatis的核心配置文件。此处主要配置了POJO对象的别名，将POJO对象的包设置别名，则就可以直接使用类名而不用写全名。

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE configuration PUBLIC "-//mybatis.org/DTD Config 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-config.dtd">
   <configuration>
       <!-- 配置别名 -->
       <typeAliases>
           <package name="com.liyanxiang.crm.pojo"></package>
       </typeAliases>
   </configuration>
   ```

2. Spring配置文件与Dao配置文件 applicationContext-dao.xml。如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

       <!-- 配置 读取properties文件 -->
       <context:property-placeholder location="classpath:jdbc.properties"></context:property-placeholder>

       <!-- 配置数据源连接池 -->
       <bean name="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
           <property name="url" value="${jdbc.url}"></property>
           <property name="driver" value="${jdbc.driver}"></property>
           <property name="username" value="${jdbc.user}"></property>
           <property name="password" value="${jdbc.password}"></property>
       </bean>

       <!-- 配置mybatis工厂 -->
       <bean name="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
           <!-- 设置mybatis核心配置文件位置 -->
           <property name="configLocation" value="classpath:mybatis/sqlMapConfig.xml"></property>
           <!-- 设置数据源 -->
           <property name="dataSource" ref="dataSource"></property>
       </bean>

       <!-- 配置mapper扫描 -->
       <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
           <!-- 设置mapper扫描包 -->
           <property name="basePackage" value="com.liyanxiang.crm.mapper"></property>
       </bean>
       
   </beans>
   ```

   首先配置了jdbc的properties文件，这个文件的代码就不贴了，因为每个人的数据库的配置都不一样。然后配置了数据库连接池，druid与之前的C3P0的连接池大体上是一样的，只不过driver属性改为了driverClassName。之后要配置mybatis工厂bean，他有两个依赖，一是mybatis核心配置文件，而是数据源。最后配置了mybatis的扫描，即不再使用传统的Dao方式，而是采用mapper的方式来简化代码，mapper扫描需指定扫描包，此包中的接口都可以自动实现。

3. 配置Service扫描 applicationContext-Service.xml：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

       <!-- 配置Service扫描 -->
       <context:component-scan base-package="com.liyanxiang.crm.service"></context:component-scan>

   </beans>
   ```

   此配置文件用来配置各Service bean的扫描位置。

4. 配置SpringMVC表现层，对controller扫描、注解驱动、视图解析器进行配置。springmvc.xml：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:mvc="http://www.springframework.org/schema/mvc"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">

       <!-- 指定controller扫描位置 -->
       <context:component-scan base-package="com.liyanxiang.crm.controller"></context:component-scan>

       <!-- 配置注解驱动 -->
       <mvc:annotation-driven></mvc:annotation-driven>

       <!-- 配置视图解析器 -->
       <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
           <!-- 前缀 -->
           <property name="prefix" value="/WEB-INF/jsp/"></property>
           <!-- 后缀 -->
           <property name="suffix" value=".jsp"></property>
       </bean>
   </beans>
   ```

5. 最后配置web.xml文件：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
            version="3.1">

       <!-- 配置spring -->
       <context-param>
           <param-name>contextConfigLocation</param-name>
           <param-value>classpath:spring/applicationContext-*.xml</param-value>
       </context-param>

       <!-- 配置监听器加载Spring -->
       <listener>
           <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
       </listener>
       
       <!-- 配置过滤器并解决字符编码不统一问题 -->
       <filter>
           <filter-name>encoding</filter-name>
           <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
           <init-param>
               <param-name>encoding</param-name>
               <param-value>UTF-8</param-value>
           </init-param>
       </filter>
       <filter-mapping>
           <filter-name>encoding</filter-name>
           <url-pattern>/*</url-pattern>
       </filter-mapping>

       <!-- 配置SpringMVC -->
       <servlet>
           <servlet-name>boot-crm</servlet-name>
           <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
           <init-param>
               <param-name>contextConfigLocation</param-name>
               <param-value>classpath:spring/springmvc.xml</param-value>
           </init-param>
           <!-- 配置 SpringMVC 何时启动，参数必须为整数 -->
           <!-- 若参数大于等于0，则SpringMVC随容器启动而启动 -->
           <!-- 若参数小于0，则在第一次请求进入的时候启动 -->
           <load-on-startup>1</load-on-startup>
       </servlet>
       <servlet-mapping>
           <servlet-name>boot-crm</servlet-name>
           <!-- 所有请求都进入SpringMVC -->
           <url-pattern>/</url-pattern>
       </servlet-mapping>

   </web-app>
   ```

根据以上的配置中的文件目录属性，整个项目的大体结构如下：

![](https://i.imgur.com/Nw5ZriW.png)



## 3. 加入静态资源

将静态资源加入项目，包括html，css，JavaScript等文件。注意jsp文件应当放到WEB-INF目录中的jsp子目录中。并将相关的工具类添加到项目中。现在项目的结构如下：

![](https://i.imgur.com/QjSfRgd.png)



## 4. 实现页面展示

By the way，目前还没有学习maven，所以对于项目依赖等配置不太了解，在使用idea来创建项目的时候控制台报错

```
ClassNotFoundException: org.apache.ibatis.session.SqlSessionFactory
```

以及其他的错误信息，目前来看解决方法是需要将相关的依赖的包添加到WEB-INF目录下。另外又添加了jstl与standard等jar包。

在controller包中新建一个控制器类CustomerController用于处理客户页面请求。如下：

```java
@Controller
public class CustomerController {
    // 入口
    @RequestMapping("/customer/list")
    public String list(){
        return "customer";
    }
}
```

现在通过tomcat启动项目，并在地址栏输入localhost:[youtPort]/customer/list并发起请求。可以得到页面如下：

![](https://i.imgur.com/lb8kXis.png)

但是发现没有样式，这是因为在web.xml中配置的是所有请求都通过DispatcherServlet，但是这样就会阻挡了静态资源的请求。所以下面对springmvc.xml进行修改，来配置对静态资源放行：

```xml

<!-- 配置对静态资源放行 -->
<mvc:resources location="/css/" mapping="/css/**"></mvc:resources>
<mvc:resources location="/js/" mapping="/js/**"></mvc:resources>
<mvc:resources location="/fonts/" mapping="/fonts/**"></mvc:resources>
```

现在再次进行请求如下：

![](https://i.imgur.com/elkYdvV.png)



## 5. 实现查询条件初始化

首先创建POJO类，来辅助查询。实例域如下，并生成setter与getter：

```java
package com.liyanxiang.crm.pojo;

public class BaseDict {
    private String dict_id;
    private String dict_type_code;
    private String dict_type_name;
    private String dict_item_code;
    private String dict_item_name;
    private String dict_memo;
    private String dict_enable;
    private Integer dict_sort;
	......
}
```

现在使用Mybatis的mapper映射的方式来对数据库进行操作，所以在mapper包创建BaseDictDao接口：

```java
public interface BaseDictDao {
    // 查询
    public List<BaseDict> selectBaseDictListByCode(String code);
}
```

然后再在mapper目录创建同名的xml文件进行映射：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.liyanxiang.crm.mapper.BaseDictDao">
    <select id="selectBaseDictByCode" resultType="BaseDict" parameterType="String">
        SELECT * FROM base_dict where dict_name_code = #{code}
    </select>
</mapper>
```

现在做好了数据库操作功能的映射，就可以在service中使用了。创建service接口如下：

```java
public interface BaseDictService {
    public List<BaseDict> selectBaseDictListByCode(String code);
}
```

可以看到service接口中含有dao接口的同名方法，这样对此接口进行实现的时候，就必须重写此方法：

```java
@Service
public class BaseDictServiceImp implements BaseDictService{
    @Autowired
    private BaseDictDao baseDictDao;

    public List<BaseDict> selectBaseDictListByCode(String code) {
        return baseDictDao.selectBaseDictListByCode(code);
    }
}
```

现在这个Service中自动装配一个BaseDictDao，然后在重写的方法中调用接口的方法。这样这个功能简单的service就写好了，可以在controller中进行调用。

所以现在修改CustomerController如下：

```java
@Controller
public class CustomerController {
    @Autowired
    private BaseDictService baseDictService;
    // 入口
    @RequestMapping("/customer/list")
    public String list(Model model){
        List<BaseDict> fromType =  baseDictService.selectBaseDictListByCode("002");
        List<BaseDict> industryType =  baseDictService.selectBaseDictListByCode("002");
        List<BaseDict> levelType =  baseDictService.selectBaseDictListByCode("002");
        model.addAttribute("fromType", fromType);
        model.addAttribute("industryType", industryType);
        model.addAttribute("levelType", levelType);
        return "customer";
    }
}
```

现在在控制器中自动装配BaseDictService，并调用service的方法与数据库交互之后将数据添加到模型传入视图。

以上使用的硬编码的方式来查询数据，这样耦合性太高。下面创建配置文件将要查询的数据选项放到配置文件中，于是创建resource.properties文件如下：

```properties
fromType=002
industryType=001
levelType=006
```

配置文件写好之后需要在springmvc.xml文件中进行注册，：

```xml
<!-- 读取配置文件 -->
<context:property-placeholder location="classpath:resource.properties"></context:property-placeholder>
```

然后将resource.properties配置文件注解到成员变量上去。如下：

```java
@Value("${fromType}")
private String fromTypeCode;
@Value("${industryType}")
private String industryTypeCode;
@Value("${levelType}")
private String levelTypeCode;

// 入口
@RequestMapping("/customer/list")
public String list(Model model){
  List<BaseDict> fromType =  baseDictService.selectBaseDictListByCode(fromTypeCode);
  List<BaseDict> industryType =  baseDictService.selectBaseDictListByCode(industryTypeCode);
  List<BaseDict> levelType =  baseDictService.selectBaseDictListByCode(levelTypeCode);
  model.addAttribute("fromType", fromType);
  model.addAttribute("industryType", industryType);
  model.addAttribute("levelType", levelType);

  return "customer";
}
```



## 6. 查询功能的实现

对用户进行查询并进行显示，可以创建模型类，在pojo目录创建查询信息QueryVo类如下：

```java
public class QueryVo {
    // 客户信息
    private String custName;
    private String custSource;
    private String custLeval;
    private String custIndustry;
    // 当前分页页码
    private int page;
    // 每页信息条数
    private int size;
    private Integer startRow;

	// setter and getter
}
```

然后如果要通过以上的这个信息来对用户进行查询，就需要对返回的数据进行捕获，所以创建返回的用户的模型类。在pojo包中创建Customer类如下：

```java
public class Customer {
    private Long cust_id;
    private String cust_name;
    private Long cust_user_id;
    private Long cust_create_id;
    private String cust_source;
    private String cust_industry;
    private String cust_linkman;
    private String cust_level;
    private String cust_phone;
    private String cust_mobile;
    private String cust_zopcode;
    private String cust_address;
    private Date cust_createtime;
  
	// setter and getter
}
```

然后就可以进行分页查询，于是创建CustomerService接口与实现类CustomerServiceImp：

```java
@Service
public class CustomerServiceImp implements CustomerService {
    @Autowired
    private CustomerDao customerDao;

    @Override
    // 通过四个条件查询分页对象
    public Page<Customer> selectPageByQueryVo(QueryVo queryVo) {
        Page<Customer> customerPage = new Page<>();
        customerPage.setSize(5);
        // 查询信息是否为空
        if (queryVo != null) {
            // 判断是否有当前页数信息
            if (queryVo.getPage() != null) {
                customerPage.setPage(queryVo.getPage());
            }
            if (queryVo.getCustName() != null && (queryVo.getCustName().trim().equals(""))) {
                queryVo.setCustName(queryVo.getCustName().trim());
            }
            if (queryVo.getCustLevel() != null && (queryVo.getCustLevel().trim().equals(""))) {
                queryVo.setCustLevel(queryVo.getCustLevel().trim());
            }
            if (queryVo.getCustIndustry() != null && (queryVo.getCustIndustry().trim().equals(""))) {
                queryVo.setCustIndustry(queryVo.getCustIndustry().trim());
            }
            if (queryVo.getCustSource() != null && (queryVo.getCustSource().trim().equals(""))) {
                queryVo.setCustSource(queryVo.getCustSource().trim());
            }
            customerPage.setTotal(customerDao.customerCountByQueryVo(queryVo));
            customerPage.setRows(customerDao.selectCustomerListByQueryVo(queryVo));
        }
        return customerPage;
    }
}
```

service需要mapper来操作数据库，所以创建相应的dao接口与xml文件如下：

```java
public interface CustomerDao {
    // 总条数
    public Integer customerCountByQueryVo(QueryVo queryVo);
    // 结果集
    public List<Customer> selectCustomerListByQueryVo(QueryVo queryVo);
}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.liyanxiang.crm.mapper.CustomerDao">
    <!-- 总条数 -->
    <select id="customerCountByQueryVo" parameterType="QueryVo" resultType="Integer">
        SELECT COUNT(1) FROM customer
        <where>
            <if test="custName != null and custName != ''">
                cust_name LIKE "%"#{custName}"%"
            </if>
            <if test="custSource != null and custSource != ''">
                AND cust_source LIKE "%"#{custSource}"%"
            </if>
            <if test="custLevel != null and custLevel != ''">
                AND cust_level LIKE "%"#{custLevel}"%"
            </if>
            <if test="custIndustry != null and custIndustry != ''">
                AND cust_industry LIKE "%"#{custIndustry}"%"
            </if>
        </where>
    </select>
    <select id="selectCustomerListByQueryVo" resultType="Customer" parameterType="QueryVo">
        SELECT * FROM customer
        <where>
            <if test="custName != null and custName != ''">
                cust_name LIKE "%"#{custName}"%"
            </if>
            <if test="custSource != null and custSource != ''">
                AND cust_source LIKE "%"#{custSource}"%"
            </if>
            <if test="custLevel != null and custLevel != ''">
                AND cust_level LIKE "%"#{custLevel}"%"
            </if>
            <if test="custIndustry != null and custIndustry != ''">
                AND cust_industry LIKE "%"#{custIndustry}"%"
            </if>
        </where>
        LIMIT #{startRow}, #{size}
    </select>
</mapper>
```

现在在控制器中进行修改：

```java
@Controller
public class CustomerController {

    @Autowired
    private BaseDictService baseDictService;
    @Autowired
    private CustomerService customerService;

    @Value("${fromType}")
    private String fromTypeCode;
    @Value("${industryType}")
    private String industryTypeCode;
    @Value("${levelType}")
    private String levelTypeCode;

    // 入口
    @RequestMapping("/customer/list")
    public String list(QueryVo queryVo, Model model){
        List<BaseDict> fromType =  baseDictService.selectBaseDictListByCode(fromTypeCode);
        List<BaseDict> industryType =  baseDictService.selectBaseDictListByCode(industryTypeCode);
        List<BaseDict> levelType =  baseDictService.selectBaseDictListByCode(levelTypeCode);
        model.addAttribute("fromType", fromType);
        model.addAttribute("industryType", industryType);
        model.addAttribute("levelType", levelType);

        // 通过四种条件进行客户的查询分页对象
        Page<Customer> customerPage = customerService.selectPageByQueryVo(queryVo);
        System.out.println(customerPage.getSize());
        model.addAttribute("page", customerPage);

        return "customer";
    }
}
```

OK了，现在启动项目进行查询结果如下：

![](https://i.imgur.com/2ZXgauj.png)

最后对视图进行完善，回显输入数据，添加代码到controller：

```java
@Controller
public class CustomerController {

    @Autowired
    private BaseDictService baseDictService;
    @Autowired
    private CustomerService customerService;

    @Value("${fromType}")
    private String fromTypeCode;
    @Value("${industryType}")
    private String industryTypeCode;
    @Value("${levelType}")
    private String levelTypeCode;

    // 入口
    @RequestMapping("/customer/list")
    public String list(QueryVo queryVo, Model model){
        List<BaseDict> fromType =  baseDictService.selectBaseDictListByCode(fromTypeCode);
        List<BaseDict> industryType =  baseDictService.selectBaseDictListByCode(industryTypeCode);
        List<BaseDict> levelType =  baseDictService.selectBaseDictListByCode(levelTypeCode);
        model.addAttribute("fromType", fromType);
        model.addAttribute("industryType", industryType);
        model.addAttribute("levelType", levelType);

        // 通过四种条件进行客户的查询分页对象
        Page<Customer> customerPage = customerService.selectPageByQueryVo(queryVo);
        System.out.println(customerPage.getSize());
        model.addAttribute("page", customerPage);

        model.addAttribute("custLever", queryVo.getCustLevel());
        model.addAttribute("custIndustry", queryVo.getCustIndustry());
        model.addAttribute("custName", queryVo.getCustName());
        model.addAttribute("custSource", queryVo.getCustSource());

        return "customer";
    }
}
```



## 7. 修改功能的实现

在页面显示的每一条数据的最后有一个修改按钮，他可以获得要修改的数据记录的cust_id，这样的话可以通过这个cust_id来获得此条记录的详细信息并回显到页面的弹出div中，以供用户进行修改。

首先进行详细数据显示的功能添加：

所以与之前一样，修改相应的mapper接口与xml文件，分别如下：

```JAVA
// 详细查询一条记录
public Customer selectCustomerById(Integer id);
```

```xml
<select id="selectCustomerById" parameterType="Integer" resultType="Customer">
  SELECT *
  <where>
    cust_id = #{id}
  </where>
</select>
```

然后需要修改service的接口与实现类：

```java
public Customer selectCustomerById(Integer id);
```

```java
@Override
public Customer selectCustomerById(Integer id) {
  Customer customer = customerDao.selectCustomerById(id);
  return customer;
}
```

最后在控制器中进行requestMapping并调用相关的方法：

```java
    @RequestMapping("/customer/edit.action")
    public @ResponseBody
    Customer editCustomer(Integer id) {
        return customerService.selectCustomerById(id);
    }
```

现在点击修改可以看到回显：

![](https://i.imgur.com/EjvKxMA.png)

接下来就是对记录进行修改，都是一个套路。代码如下：

```java
// 修改控制器
@RequestMapping("/customer/update.action")
public @ResponseBody String updateCustomer(Customer customer) {
  customerService.updateCustomerById(customer);
  return "OK";
    }
```

```xml
<!-- 修改CustomerDao.xml -->

<update id="updateCustomerById" parameterType="Customer">
  UPDATE customer
  <set>
    <if test="cust_name != null">cust_name = #{cust_name},</if>
    <if test="cust_name != null">cust_source = #{cust_source},</if>
    <if test="cust_name != null">cust_industry = #{cust_industry},</if>
    <if test="cust_name != null">cust_level = #{cust_level},</if>
    <if test="cust_name != null">cust_linkman = #{cust_linkman},</if>
    <if test="cust_name != null">cust_phone = #{cust_phone},</if>
    <if test="cust_name != null">cust_mobile = #{cust_mobile},</if>
    <if test="cust_name != null">cust_zipcode = #{cust_zipcode},</if>
    <if test="cust_name != null">cust_address = #{cust_address},</if>
  </set>
  <where>
    cust_id = #{cust_id};
  </where>
</update>
```

其余的代码就不贴了，都很简单。运行效果如下：

![](https://i.imgur.com/SaKQj1V.png)

最后完善删除操作，很简单，就不细说了，都与之前的一样的。完成了！



有条件的时候再上传代码与资源文件。





## 参考与感谢：

1. [URI Is Not Registered 报错](http://blog.csdn.net/matthew_zhang/article/details/50757251)
2. [Mybatis 配置](http://www.mybatis.org/mybatis-3/zh/configuration.html)
3. [applicationContext.xml 配置](http://blog.csdn.net/heng_ji/article/details/7022171)
4. [IntellIj IDEA中JSP页面 cannot resolve method 的解决方案](http://blog.csdn.net/u012292853/article/details/39301807)
5. [Spring + Spring MVC + MyBatis搭建一个简单的项目](http://listenzhangbin.com/post/2016/04/java-spring-spring-mvc-mybatis-demo/)
6. [Could not autowire. No beans of 'xxxx' type found](http://blog.csdn.net/u012453843/article/details/54906905)
7. [spring注解方式 idea报could not autowire，eclipse却没有问题](http://www.oschina.net/question/202626_181237)
8. [Spring配置文件 context:property-placeholder 标签使用漫谈](http://blog.csdn.net/Rickesy/article/details/50791534)
9. [springmvc的注解@responsebody 无法返回json数据](http://bbs.csdn.net/topics/390940946)
10. [ json转换错误：No converter found for return value of type](http://blog.csdn.net/gsycwh/article/details/56675836)