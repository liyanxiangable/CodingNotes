# 通过Spring与JDBC使用数据库



Spring自带了一组数据访问框架，集成了多种数据访问技术。我们可以依赖Spring来处理底层的数据访问，这样就可以专注于应用程序中数据的管理了。

## Spring 的数据访问哲学

为了避免持久化的逻辑分散到应用的各个组件中，最好将数据访问的功能放到一个或多个专注于此项任务的组件中。这样的组件通常成为数据访问对象（data access object，DAO）或者Repository。

为了避免应用于特定的数据访问策略耦合在一起，编写良好的Repository应该是以接口的方式暴露功能。数据访问层是与持久化技术无关的方式来进行访问的。这可以实现灵活的设计，并且切换持久化框架对应用程序的其他部分所带来的影响最小。如果将数据访问层的实现细节渗透到应用程序的其他部分中，那么整个应用程序会与数据访问层耦合在一起，从而导致僵化的设计。

为了将数据访问层与应用程序的其他部分隔离开来，Spring采用的方式之一就是提供统一的异常体系，这个异常体系用在了他支持的所有持久化方案中。一方面，JDBC的异常体系过于简单；另一方面，Hibernate的异常体系是其本身所独有的。我们需要的数据访问异常体系要具有描述性而且又与特定的持久化框架无关。

Spring JSBC提供的数据访问异常体系解决了以上两个问题。不同于JDBC，Spring提供了多个数据访问异常，分别描述了他们抛出时所对应的问题。部分异常如下：

| 异常                                       | 何时抛出                                     |
| ---------------------------------------- | ---------------------------------------- |
| CleanupFailureDataAccessException        | 一项操作成功地执行，但在释放数据库资源时发生异常（例如，关闭一个Connection） |
| DataAccessResourceFailureException       | 数据访问资源彻底失败，例如不能连接数据库                     |
| DataIntegrityViolationException          | Insert或Update数据时违反了完整性，例如违反了惟一性限制        |
| DataRetrievalFailureException            | 某些数据不能被检测到，例如不能通过关键字找到一条记录               |
| DeadlockLoserDataAccessException         | 当前的操作因为死锁而失败                             |
| IncorrectUpdateSemanticsDataAccessException | Update时发生某些没有预料到的情况，例如更改超过预期的记录数。当这个异常被抛出时，执行着的事务不会被回滚 |
| InvalidDataAccessApiusageException       | 一个数据访问的JAVA API没有正确使用，例如必须在执行前编译好的查询编译失败了 |
| invalidDataAccessResourceUsageException  | 错误使用数据访问资源，例如用错误的SQL语法访问关系型数据库           |
| OptimisticLockingFailureException        | 乐观锁的失败。这将由ORM工具或用户的DAO实现抛出               |
| TypemismatchDataAccessException          | Java类型和数据类型不匹配，例如试图把String类型插入到数据库的数值型字段中 |
| UncategorizedDataAccessException         | 有错误发生，但无法归类到某一更为具体的异常中                   |

尽管Spring的异常体系比JDBC简单的SQLException要丰富得多，但是他没有与塔顶得持久化方式相关联。这意味着我们可以使用Spring抛出一致的异常，而不用关心所选择得持久化方案。这有助于我们将所选择持久化机制与数据访问层隔离开来。

上表中所列出得异常都是继承自DataAccessException，DataAccessException的特殊之处在于他是一个非检查型异常，也就是说没有必要捕获Spring所抛出的数据访问异常（当然也可以进行捕获）。为了利用Spring的数据访问异常，我们必须使用Spring所支持的数据访问模板。

### 数据访问模板化

模板方法将过程中与特定实现相关的部分委托给接口，而这个接口的不同实现定义了过程中的具体行为。Spring将数据访问过程中固定的和可变的部分明确划分为两个不同的类：模板（template）与回调（callback）。模板管理过程中固定的部分，回调处理自定义的数据访问代码。

Spring的模板类处理数据访问的固定部分——事物控制、管理资源以及处理异常；同时，应用程序相关的数据访问——语句、绑定参数以及整理结果集这些内容在回调的实现中处理。

针对不同的持久化平台，Spring提供了多个可选的模板。如果直接使用JDBC，那你可以选择JdbcTemplate；如果你希望使用对象关系映射框架，那么HibernateTemplate或者JapTemplate会更适合。



## 配置数据源

无论选择Spring的哪种数据访问方式，都需要配置一个数据源的引用。Spring提供了在Spring上下文中配置数据源bean的多种方式。包括：

1. 通过JDBC驱动程序定义的数据源
2. 通过JNDI查找的数据源
3. 连接池的数据源

### 使用JNDI数据源

Spring应用程序经常部署在java EE应用服务器中，如WebSphere、JBoss或者Tomcat这样的Web容器中。这些服务器允许你配置通过JNDI获取数据源。这种配置的好处在于数据源完全可以在应用程序之外进行管理，这样应用程序只需要在访问数据库的时候查找数据源就可以了。另外，在应用服务器中管理的数据源通常以“池”的方式阻止，从而具有更好的性能，并且还可以支持系统管理员对其进行热切换。

利用Spring，我们可以想使用Spring bean那样配置JNDI中数据源的引用将其装配到所需要的类中。

位于jee命名空间下的“jndi-lookup”元素可以用于检索JNDI中的任何对象（包括数据源）并将其作为Spring的bean。例如，如果应用程序的数据源配置在JNDI中，此时就可以使用jndi-lookup元素将其装配到Spring中。如下：

```xml
jee:jndi-lookup id="dataSource" jndi-name="/jdbc/gagaDS" resource-ref="true" />
```

其中jndi-name属性用于指定JNDI中的资源的名称。如果只设置了jndi-name属性，那么就会根据指定的名称查找数据源。但是，如果应用程序运行在Java应用服务器中，你需要将resource-ref属性设置为true，这样给定的jndi-name将会自动添加“java:comp/env/”前缀。

如果要想使用Java配置，那么可以借助JndiObjectFactoryBean从JNDI中查找DataSource：

```java
@bean
public JndiObjectFactoryBean dataSource() {
    JndiOjectFactoryBean jndiObjectFB = new JndiObjectFactoryBean();
	jndiObjectFB.setJndiName("jdbc/gagaDS");
	jndiObjectFB.setResourceRef(true);
	jndiObjectFB.setProxyInterface(javax.sql.DataSource.class);
	return jndiObjectFB;
}
```



### 使用数据源连接池

> 此处挖坑待填
>
> 同样挖坑待填的还有使用嵌入式的数据源、使用Profile选择数据源



### 基于JDBC驱动的数据源

在Spring中，通过JDBC驱动定义数据源是最简单的配置方式。Spring提供了三个这样的数据源类：

1. DriverManagerDataSource: 在每个连接请求时都会返回一个新建的连接
2. SimpleDriverDataSource: 与DriverManagerDataSource的工作方式类似。但是它直接使用JDBC驱动，来解决在特定环境下的类加载问题
3. SingleConnectionDataSource: 在每个连接请求时都会返回同一个的连接

以上的这些数据源的配置与DBCP BasicDataSource的配置类似。如下：

```java
@Bean
public DataSource dataSource() {
    DriverManagerDataSource ds = new DriverManagerDataSource();
	ds.setDriverClassName("org.h2.Driver");
	ds.setUrl("jdbc:h2:top://localhost/~/gaga");
	ds.setUsername("name");
	ds.setPassword("password");
	return ds;
}
```

与具备池功能的数据源相比，唯一的区别在于这些数据源bean都没有提供连接池功能，所以没有可配置的池的相关属性。

SingleConnectionDataSource有且只有一个数据库连接，所以不适合用于多线程的应用程序，最好只在测试的时候使用；DriverManagerDataSource与SimpleDriverDataSource尽管支持多线程，但是在每次请求连接的时候都会创建新的连接，这是以性能为代价的。鉴于以上的这些限制，使用数据源连接池方法较好。



## 在Spring中使用JDBC



> 挖坑待填









































参考与感谢：

1. [什么是 JNDI](http://blog.csdn.net/zhaosg198312/article/details/3979435)
2. [JNDI 在 J2EE 中的角色](https://www.ibm.com/developerworks/cn/java/j-jndi/)
3. ​