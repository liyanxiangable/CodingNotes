## JDBC 基础



jdbc 是独立于特定数据库管理系统，通用的 SQL 语句进行数据库存取操作的公共接口。定义了用来访问数据库的标准 java 类库。使用这个类库可以用标准的方法方便的访问数据库资源。JDBC 为各种不同的数据库提供了一种同意的途径，为开发者屏蔽了一些细节问题。JDBC 的目标是使java 程序员使用 JDBC 能够连接任何的提供了 JDBC 驱动程序的数据库管理系统。这样就使得 java 程序员无需过多的了解各种数据库管理系统的特点，从而简化了发开流程。

JDBC 接口（API）包含两个层次：

1. 面向应用的API
2. 面向数据库的API



### 通过 driver 获取数据库连接：

创建一个项目，首先将驱动jar包添加到当前的项目中。

需要获取一个驱动实例，这里需要使用的类为com.mysql.jdbc下的Driver。通过这个实例，就可以连接mysql数据库，但是还要两个参数，一个是MySQL的url地址，另一个是各种配置参数。

JDBC 常用的url格式如下：

```url
协议名:子协议名://主机地址:端口号/数据库名
```

另一个配置参数，Properties是一个持久的属性集。现在使用这个配置参数来填写MySQL的用户名与密码。如下：

```java
package Leaning1030;

import com.mysql.jdbc.Driver;

import java.sql.Connection;
import java.util.Properties;

public class JDBCTest {
    public static void main (String[] args) {
        testDriver();
    }
    public static void testDriver () {
        Connection connection = null;
        try {
            Driver driver = new Driver();
            String url = "jdbc:mysql://localhost:7777/yui";
            Properties info = new Properties();
            info.setProperty("user", "root");
            info.setProperty("password", "1992122208gg");
            connection = driver.connect(url, info);
            System.out.println(connection);
        } catch (Exception e) {
            e.printStackTrace();
        } 
    }
}
```

现在编译并启动这个程序，控制台就显示了connection实例。



然后对数据库的操作也比较简单，如下：

```java
Connection connection = null;
try {
  Driver driver = new Driver();
  String url = "jdbc:mysql://localhost:7777/yui";
  Properties info = new Properties();
  info.setProperty("user", "root");
  info.setProperty("password", "1992122208gg");
  connection = driver.connect(url, info);
  System.out.println(connection);

  String sql = "select id, name, age from gakki where id > 1;";
  Statement statement = connection.createStatement();
  ResultSet rs = statement.executeQuery(sql);
  while (rs.next()) {
    int id = rs.getInt(1);
    String name = rs.getString(2);
    int age = rs.getInt(3);
    System.out.println("id : " + id + " , name : " + name + " , age : " + age);
  }
} catch (Exception e) {
  e.printStackTrace();
} finally {
  if (connection != null) {
    try {
      connection.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}
```

首先编写sql的语句作为一个String，然后使用创建的连接实例调用createStatement方法获得执行静态SQL语句并返回结果的对象。最后调用此对象的executeQuery方法来执行编写好的sql语句并使用一个ResultSet获得返回值，ResultSet 是一个专门用于存放数据库查询结果集的数据表。这个数据表具有一个光标，一开始的时候位于第一行之前。所以可以每读一行，就通过getInt或者其他的读取信息方法来获得结果。最后连接实例要进行关闭。

运行以上程序，就可以看到在控制台输出的查询结果。



但是我们想编写一个通用的软件，在不修改源程序的条件下，可以获得任何数据库的连接，所以以上的代码有要进行修改的地方，比如说现在是写死了mysql数据库管理系统，但是如果想要连接其他的数据库就不行了。

所以现在创建一个工具类，来让java程序能够适应不同的数据库管理系统以及不同的执行参数。新建一个类DBUtil。这个数据库的工具类起码要有两个方法，一是打开即连接一个数据库；二是关闭当前的数据库连接。 然后这个类需要相应的静态变量来对连接数据库进行初始化：

```java
package Learning1030;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBUtil {
    static private String driver;
    static private String url;
    static private String user;
    static private String password;
    static {
        driver = "com.mysql.jdbc.Driver";
        url = "jdbc:mysql://localhost:7777/yui";
        user = "root";
        password = "1992122208gg";
    }
    public static Connection connect () {
        try {
            Class.forName(driver);
            return DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    public static void close (Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
```

这样就可以进行如下的调用：

```java
public static void testDBUtil () {
  Connection connection = DBUtil.connect();
  String sql = "select * from gakki;";
  ResultSet rs = null;
  try {
    Statement statement = connection.createStatement();
    rs = statement.executeQuery(sql);
    while (rs.next()) {
      int id = rs.getInt(1);
      String name = rs.getString(2);
      int age = rs.getInt(3);
      System.out.println("id : " + id + " , name : " + name + " , age : " + age);
    }
  } catch (Exception e) {
    e.printStackTrace();
  }
  DBUtil.close(connection);
}
```

现在运行上边的函数，就可以获得数据库查询的结果。不过现在还不是我们想要的结果，因为想实现的是可配置的JDBC，所以现在把数据库驱动 / url等所有的可变项都放在一个配置文件中，通过修改配置文件的方法来实现配置与数据库解耦。现在创建一个文件jdbc.properties：

```properties
driver=com.mysql.jdbc.Driver
jdbcUrl=jdbc:mysql://localhost:7777/yui
user=root
password=1992122208gg
```

需要注意的是，这个文件的后缀就是专门的properties文件，其中的内容以行分开，不使用逗号分号等符号，等号两边不能添加空格，字符串也不能添加冒号。

现在由于是读入外部的配置文件来进行设置，所以之前的DBUtil类的代码块需要进行如下修改：

```java
static {
  FileReader is = null;
  try {
    is = new FileReader("src/Learning1030/jdbc.properties");
  } catch (IOException e) {
    e.printStackTrace();
  }
  System.out.println(is);
  Properties properties = new Properties();
  try {
    properties.load(is);
    driver = properties.getProperty("driver");
    url = properties.getProperty("url");
    user = properties.getProperty("user");
    password = properties.getProperty("password");
  } catch (IOException e) {
    e.printStackTrace();
  } finally {
    if (is != null) {
      try {
        is.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
}
```



### Statement 语句：

 statement语句是SQL语句的描述，使用statement可以实现各种SQL语句。

现在新创建一个测试类，如下，可以进行增删改查，都差不多的就不全写了：

```JAVA
package Learning1030;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBCTest2 {
    public static void main (String[] args) {
        createTable();
        insertData();
        insertData();
    }

    public static void createTable () {
        Connection connection = DBUtil.connect();
        String sql = "CREATE TABLE eva" +
                "(" +
                "id int primary key auto_increment," +
                "name varchar(20)" +
                ");";
        try {
            Statement statement = connection.createStatement();
            statement.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(connection);
        }
    }
    public static void insertData () {
        Connection connection = DBUtil.connect();
        String sql = "INSERT INTO eva(name) VALUES('gakki')";
        try {
            Statement statement = connection.createStatement();
            statement.executeUpdate(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(connection);
        }
    }
}
```



### PreparedStatement 

PreparedStatement 为预定义语句，继承自statement类。与statement不同的是，statement只能执行静态的SQL语句，而preparedStatement可以动态操作SQL语句，preparedStatement常使用"?"占位符来预定义SQL语句。如下：

```java
public static void addField () {
  Connection connection = null;
  try {
    connection = DBUtil.connect();
    String addField = "ALTER TABLE eva ADD talk varchar(30);";
    Statement statement = connection.createStatement();
    statement.executeUpdate(addField);
  } catch (Exception e) {
    e.printStackTrace();
  } finally {
    DBUtil.close(connection);
  }
}

public static void preparedInsert (String name, String talk) {
  Connection connection = DBUtil.connect();
  try {
    String sql = "INSERT INTO eva(name, talk) VALUES(?, ?)";
    PreparedStatement ps = connection.prepareStatement(sql);
    ps.setString(1, name);
    ps.setString(2, talk);
    ps.executeUpdate();
  } catch (Exception e) {
    e.printStackTrace();
  } finally {
    DBUtil.close(connection);
  }
}
```

再进行调用：

```java
addField();
preparedInsert("gakki", "kunijiwa");
preparedInsert("lyx", "nihao");
preparedInsert("tom", "mew");
```

可以再SQL命令行中看到已经进行了修改。preparedStatement没有什么特别的，就是按照顺序依次采用了占位符。





### CallableStatement:

callableStatement为可调用的执行语句，他继承了preparedStatement，提供了调用存储过程的能力。他的用法有三种：

1. 调用简单的存储过程
2. 调用带有参数的存储过程
3. 调用有输入输出参数的存储过程

要执行callableStatement，首先要再数据库管理系统中有callable的语句，下面代开MySQL创建这样的一条语句：

```sql
CREATE PROCEDURE findGakki() SELECT id, name, talk FROM eva WHERE name = 'gakki';
CALL findGakki;
```

以上就是一个call语句的创建与调用，其实很简单，就是创建一个函数，这个函数能够代替某个较长的语句的执行，然后使用call关键字来调用它。所以在jdbc中使用如下：

```java
Connection connection = null;
try {
  connection = DBUtil.connect();
  String sql = "{call findGakki()}";
  CallableStatement cs = connection.prepareCall(sql);
  ResultSet rs = cs.executeQuery(sql);
  while (rs.next()) {
    int id = rs.getInt(1);
    String name = rs.getString(2);
    String talk = rs.getString(3);
    System.out.println(id + ", " + name + ", " + talk);
  }
} catch (SQLException e) {
  e.printStackTrace();
} finally {
  DBUtil.close(connection);
}
```

其中稍有区别的就是sql语句要使用花括号括起来，然后通过连接调用prepareCall获得一个CallableStatement对象，同样也是这个对象执行executeQuery方法来获得返回结果。

带有参数的call与之前的稍有区别，首先在MySQL中创建一个有参数的call：

```sql
mysql> CREATE PROCEDURE insertGakki(in newname varchar(20), in newtalk varchar(20)) INSERT INTO eva(name, talk) VALUES(newname, newtalk);
```

这种带有参数的call的参数声明中用in来表示一个要输入的参数。而在jdbc中调用的时候使用?来代替参数。

```java
Connection connection = null;
try {
  connection = DBUtil.connect();
  String sql = "{call insertGakki(?, ?)}";
  CallableStatement cs = connection.prepareCall(sql);
  cs.setString(1, "xinyuan jieyi");
  cs.setString(2, "ni hao a");
  int ret = cs.executeUpdate();
  System.out.println(ret);
} catch (SQLException e) {
  e.printStackTrace();
} finally {
  DBUtil.close(connection);
}
```

当看到控制台输出执行语句的返回值为1的时候，就说明sql语句执行好了。

如果有输出参数，那么也是与上边的同理，首先创建一个call：

```sql
 CREATE PROCEDURE gakkiTalk(in findid int, out findtalk varchar(20)) SELECT talk INTO findtalk FROM eva WHERE id = findid;
```

MySQL中的call与java当中的函数不同的是没有在前边声明返回值，而是将返回值也当作一个参数。区别就在于输入的参数使用in来标识，而输出的返回值要使用out来标识。然后select子句将字段选择出来之后使用into关键字传递给输出的变量名。jdbc代码如下：

```java
Connection connection = null;
try {
  connection = DBUtil.connect();
  String sql = "{call gakkiTalk(?, ?)}";
  CallableStatement cs = connection.prepareCall(sql);
  cs.setInt(1, 6);
  cs.registerOutParameter(2, Types.VARCHAR);
  cs.execute();
  String talk = cs.getString(2);
  cs.executeQuery();
  System.out.println(talk);
} catch (SQLException e) {
  e.printStackTrace();
} finally {
  DBUtil.close(connection);
}
```

其中由于需要返回一个参数，所以要提前进行注册，使用CallableStatement调用registerOutputParameter方法然后执行。



### DAO:

DAO设计模式简介: DAO设计模式可以减少代码量，增强程序的可移植性，提高代码的可读性实现。一个典型的DAO有下列几个组件：

- 一个DAO接口;
- 一个实现DAO接口的具体类; 
- 数据传递对象(DTO)：有些时候叫做值对象(VO)或领域模型（domain）

其中的DAO接口我的理解就是一个对数据进行操作的接口。然后再创建一个DAO接口的实现类，我感觉就相当于之前写的那个工具类。最后通过对这个工具类的操作就可以对数据库进行增删改查的操作。

 









参考链接：

