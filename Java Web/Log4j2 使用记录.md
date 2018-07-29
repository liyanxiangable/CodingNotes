# Log4j2 使用记录



## 导包

首先在官网下载 log4j 2 版本文件，解压之后，将 log4j-api 与 log4j-core 两个 jar 包导入 libraries（目前只需要这两个 jar 包）。

## 举个栗子

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Log4jUsingTest {
  // 注意如果是 IDE 自动导入类，那么类名有可能与 java.util 包中的类重复
  private static Logger logger = LogManager.getLogger(Log4jUsingTest.class);

  public static void main(String[] args) {
    logger.trace("First trace.");
    logger.error("There is an ERROR.");
    logger.trace("Second trace.");
  }
}
/** OUTPUT
ERROR StatusLogger No Log4j 2 configuration file found. Using default configuration (logging only errors to the console), or user programmatically provided configurations. Set system property 'log4j2.debug' to show Log4j 2 internal initialization logging. See https://logging.apache.org/log4j/2.x/manual/configuration.html for instructions on how to configure Log4j 2
10:17:38.770 [main] ERROR Log4j.Log4jUsingTest - There is an ERROR.
*/
```

注意类中的静态成员日志记录器，它的初始化是使用 LogManager 类的 getLogger 静态方法，其中参数即当前的类。如果不传入当前类对象，那么就默认为调用类的日志记录器，而现在传入了类命，那么就是说把日志记录器绑定到我传入的 Log4jUsingTest 类上。

注意以上的控制台输出，其中第一行说了一大堆，就是说没有找到 log4j 的配置文件，所以使用的默认配置（只输出 error 级别的日志到控制台），这个先不管他。然后第二行就是代码运行的结果，首先是一个时间戳，然后中括号中是输出日志的函数名，日志级别是 ERROR，日志记录器是 Log4j.Log4jUsingTest（注意这个类是我们在 getLogger 函数中传入的），最后是代码中传入的字符串信息。

## 配置文件

那么现在解决一下 log4j2 的配置问题，log4j 可以由以下四种途径进行配置：

```
1. Through a configuration file written in XML, JSON, YAML, or properties format.
2. Programmatically, by creating a ConfigurationFactory and Configuration implementation.
3. Programmatically, by calling the APIs exposed in the Configuration interface to add components
to the default configuration.
4. Programmatically, by calling methods on the internal Logger class.
```

如果是使用配置文件的话，那么在使用 log4j 的时候，Java 项目会依次在 classpath 中寻找以下的文件作为配置文件：

1. Log4j will inspect the `"log4j.configurationFile"` system property and, if set, will attempt to load the configuration using the `ConfigurationFactory` that matches the file extension.
2. If no system property is set the properties ConfigurationFactory will look for `log4j2-test.properties` in the classpath.
3. If no such file is found the YAML ConfigurationFactory will look for `log4j2-test.yaml` or `log4j2-test.yml` in the classpath.
4. If no such file is found the JSON ConfigurationFactory will look for `log4j2-test.json` or `log4j2-test.jsn` in the classpath.
5. If no such file is found the XML ConfigurationFactory will look for `log4j2-test.xml` in the classpath.
6. If a test file cannot be located the properties ConfigurationFactory will look for `log4j2.properties` on the classpath.
7. If a properties file cannot be located the YAML ConfigurationFactory will look for `log4j2.yaml` or `log4j2.yml` on the classpath.
8. If a YAML file cannot be located the JSON ConfigurationFactory will look for `log4j2.json` or `log4j2.jsn` on the classpath.
9. If a JSON file cannot be located the XML ConfigurationFactory will try to locate `log4j2.xml` on the classpath.
10. If no configuration file could be located the `DefaultConfiguration` will be used. This will cause logging output to go to the console.

配置文件怎么写？官方文档已经给出了详细的例子，现在我在 src 目录下（Intellij Idea 的 classpath）创建一个 log4j2.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration status="error">
  <!--     先定义所有的appender -->
  <appenders>
    <!--         这个输出控制台的配置 -->
    <Console name="Console" target="SYSTEM_OUT">
      <!--             控制台只输出level及以上级别的信息（onMatch），其他的直接拒绝（onMismatch） -->
      <ThresholdFilter level="trace" onMatch="ACCEPT" onMismatch="DENY"/>
      <!--             这个都知道是输出日志的格式 -->
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %class{36} %L %M - %msg%xEx%n"/>
    </Console>

    <!--         文件会打印出所有信息，这个log每次运行程序会自动清空，由append属性决定，这个也挺有用的，适合临时测试用 -->
    <!--         append为TRUE表示消息增加到指定文件中，false表示消息覆盖指定的文件内容，默认值是true -->
    <File name="log" fileName="log/test.log" append="false">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} %-5level %class{36} %L %M - %msg%xEx%n"/>
    </File>

    <!-- 		 添加过滤器ThresholdFilter,可以有选择的输出某个级别以上的类别  onMatch="ACCEPT" onMismatch="DENY"意思是匹配就接受,否则直接拒绝  -->
    <File name="ERROR" fileName="logs/error.log">
      <ThresholdFilter level="error" onMatch="ACCEPT" onMismatch="DENY"/>
      <PatternLayout pattern="%d{yyyy.MM.dd 'at' HH:mm:ss z} %-5level %class{36} %L %M - %msg%xEx%n"/>
    </File>

    <!--         这个会打印出所有的信息，每次大小超过size，则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，作为存档 -->
    <RollingFile name="RollingFile" fileName="logs/web.log"
                 filePattern="logs/$${date:yyyy-MM}/web-%d{MM-dd-yyyy}-%i.log.gz">
      <PatternLayout pattern="%d{yyyy-MM-dd 'at' HH:mm:ss z} %-5level %class{36} %L %M - %msg%xEx%n"/>
      <SizeBasedTriggeringPolicy size="2MB"/>
    </RollingFile>
  </appenders>

  <!--     然后定义logger，只有定义了logger并引入的appender，appender才会生效 -->
  <loggers>
    <!--         建立一个默认的root的logger -->
    <root level="trace">
      <appender-ref ref="RollingFile"/>
      <appender-ref ref="Console"/>
      <appender-ref ref="ERROR" />
      <appender-ref ref="log"/>
    </root>

  </loggers>
</configuration>
```

以上这个配置文件是从网上找的，还是很简单的，直接可以看懂。但是注意这里有一个坑就是尽量不要使用 properties 文件作为配置文件，虽然网上有很多的资源或者教程是使用 properties 文件的。参考链接中有一个 StackOverflow 的问题，就是说的这个事情，log4j2 版本对于 properties 配置进行了修改，语法上与 log4j v1 不同，现在 v2 推荐的是使用 xml 文件或者 json 等文件格式，我因为这个问题折腾了半天。OK 啦。

## 参考与感谢

1. [apache log4j download](https://logging.apache.org/log4j/2.x/download.html)
2. [Apache Log4j API 2.11.0 API](https://logging.apache.org/log4j/2.x/log4j-api/apidocs/index.html)
3. [log4j2 configuration](https://logging.apache.org/log4j/2.x/manual/configuration.html)
4. [log4j2日志配置](http://www.cnblogs.com/0201zcr/p/6263295.html)
5. [log4j2 实际使用详解](https://blog.csdn.net/vbirdbest/article/details/71751835)
6. [Log4J使用详解(整理)](https://blog.csdn.net/u011781521/article/details/55002553)
7. [log4j.xml的配置--把日志输出到不同的文件去](https://blog.csdn.net/qq_27093465/article/details/62928590)
8. [Log4j 2.0在开发中的高级使用详解—读取配置文件(六)](https://blog.csdn.net/xmtblog/article/details/38982473)
9. [Log4j 2 doesn't support log4j.properties file anymore?](https://stackoverflow.com/questions/22485074/log4j-2-doesnt-support-log4j-properties-file-anymore)
10. [聊一聊log4j2配置文件log4j2.xml](http://www.cnblogs.com/hafiz/p/6170702.html)