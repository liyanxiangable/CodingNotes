# 装配 bean



## 自动化装配bean

Spring从两个角度来实现自动化装配bean：

1. 组件扫描（component scanning）：spring会自动发现应用上下文中所创建的额bean
2. 自动装配（autowiring）：spring自动满足bean之间的依赖

例如，接口CompactDisc定义了CD的概念：

```java
package soundsystem;

public interface CompactDisc {
    void play();
}
```

CompactDisc 作为一个接口，他定义了CD播放器能够对一盘CD所能进行的操作。现在创建一个此接口的实现：

```java
package soundsystem;

import org.springframework.stereotype.Component;
@Component
public class LoveSong  implements CompactDisc {
    private String title = "小小恋歌";
    private String artist = "新垣结衣";

    public void play() {
        System.out.println("正在播放 " + artist + " 的歌曲 " + title);
    }
}
```

注意到这个实现类的上方有一个Component注解，那么spring就会将这个类看作为一个组建类，并且在运行的时候为这个类创建bean。不过组件扫描时默认不启用的，所以需要显式的配置spring，让spring去寻找带有component注解的类，并为这些类创建bean。

```java
package soundsystem;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan
public class CDPlayerConfig {
}
```

以上的CDPlayerConfig类就是通过java代码来对spring的装配规则进行了配置。如果没有其他的配置的画，@ComponentScan注解会默认扫描与配置类相同的包，这个注解就是用来启动组件扫描的，所以现在Spring会扫描这个包以及这个包下的所有子包，找出其中的带有@Component注解的类。

Spring应用上下文中所有的bean都会给定一个ID，spring会根据类型为bean制定一个默认ID，这个ID就是将类名的第一个字母小写。如果想为这个bean设置不同的ID，那么就可以将期望的ID作为参数传递给@Component注解，比如说：

```java
@Component("myFavoriteId")
public class LoveSong implements CompactDisc {
    // ......
}
```

除了component注解之外还有一个name的命名方式通过java依赖注入规范中的@Name来为bean设置ID。这两种方式的大多数情况下是可以替换的。

如果不对@Component注解进行任何的配置，那么就会按照默认的规则以配置类的包作为基础包来扫描组件。为了指定不同的基础包，我们需要做的就是在@Component注解中的value属性中指定想要扫描的包的名称：

```java
@Comfiguration
@ComponentScan("soundsystem")
public class CDPlayerConfig {}
```

或者使用basePackage属性，如果有多个包想要进行扫描，那么就将注解修改为：

```java
@ComponentScan(basePackage={"soundsystem", "video"})
```

除了像以上这样使用字符串来设置之外，也可以指定包中的类或者接口：

```java
@Comfiguration
@ComponentScan(basePackageClasses = {CDPlayer.class, DVDPlayer.class})
public class CSPlayerConfig {}
```

最后还可以通过为bean添加注解实现自动装配：自动装配就是让spring自动满足bean依赖的一种方法，在满足依赖的过程中，追在spring应用上下文中寻找匹配某个bean需求的其他的bean。为了声明要自动装配，我们可以借助spring的@Autowired注解。

假设有代码如下：

```java
package soundsystem;
import ...
@Component
public class CDPlayer implements MediaPlayer {
    private CompactDisc cd;
  	@Autowired
  	public CDPlayer(CompactDisc cd) {
        this.cd = cd;
    }
  	public void play () {
        cd.play();
    }
}
```

@Autowired注解可以使用在类的任何方法中，此时spring创建这个类的bean的时候，会自动的将一个自动装配的类的bean进行实例化然后传递给函数。不管是构造器，Setter方法还是其他的方法，Spring都会尝试满足各方法参数所声明的依赖。假设只有一个bean匹配以来需求的话，那么这个bean就会被自动给装配过来。如果没有匹配的bean，那么在应用上下文创建的时候，spring会抛出一个异常，此时为了避免这种抛出异常的发生，可以在@Autowired注解的required属性设置为false，此时spring会尝试自动装配，但是如果没有匹配的bean，那么就会让这个bean处于未匹配的状态。还有一种情况就是有多个可以进行匹配的bean，此时spring也会抛出一个异常，表示没有明确指定哪一个bean来进行装配。



























