## Java 网络编程



InetAddress对象是用来代表IP地址的一个类，存在于java.net包下。一个InetAddress对象代表一个IP地址。可以使用InetAddress的静态工厂方法来获取实例（前提是已经联上网）。

```java
public static void test1 () {
  try {
    InetAddress inet = InetAddress.getByName("www.baidu.com");
  } catch (UnknownHostException) {

  }

  System.out.println(inet);
  System.out.println(inet.getAddress());
  System.out.println(inet.getHostAddress());
  System.out.println(inet.getHostName());
}

// 输出如下：
www.baidu.com/119.75.216.20
[B@7006c658
119.75.216.20
www.baidu.com
```

通讯要素：

1. IP地址与端口
2. 网络通信协议



TCP 协议：

1. 使用TCP协议的之前，首先要建立TCP连接，形成数据传输通道。
2. 传输之前，采用三次握手。确定连接是可靠的。
3. 在连接中可以进行大量数据传输。
4. 传输完毕需关闭已建立的连接，效率较低。

UDP 协议：

1. 将数据、源、目的封装成数据包，不需要建立连接。
2. 每个数据报的大小应限制在64kb之内。
3. 无需连接，不可靠。
4. 发送结束不需要关闭资源，速度较快。





TCP:

客户端：

```java
public static void client() {
  Socket socket = null;
  OutputStream os = null;
  try {
    socket = new Socket(InetAddress.getByName("127.0.0.1"), 9999);
    os = socket.getOutputStream();
    os.write("新垣结衣的微笑就由我来守护".getBytes());
  } catch (UnknownHostException e) {
    e.printStackTrace();
  } catch (IOException e) {
    e.printStackTrace();
  } finally {
    try {
      os.close();
      socket.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}

// 1. 获得IP地址实例
// 2. 利用以上实例创建一个Socket对象
// 3. 在Socket对象上获取输出流
// 4. 对输出流内容进行编写
// 5. 关闭资源
```

服务器端：

```java
public static void server () {
  ServerSocket ss = null;
  Socket socket = null;
  InputStream is = null;
  try {
    ss = new ServerSocket(9999);
    socket = ss.accept();
    is = socket.getInputStream();
    byte[] content = new byte[20];
    int len = 0;
    while ((len = is.read(content)) != -1) {
      System.out.println(new String(content));
    }
  } catch (IOException e) {
    e.printStackTrace();
  } finally {
    try {
      is.close();
      socket.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}

// 1. 获取一个ServerSocket服务器端对象
// 2. 使用服务器端对象的accept阻塞方法来创建一个Socket对象
// 3. 使用以上对象获取输入流
// 4. 对输入流进行读取
// 5. 关闭资源
```

分别运行以上的服务器端与客户端，就可以进行单向的通信了。

再举一个栗子，现在要从客户端发送信息，然后服务端接受完毕之后保存成文件，并返回响应，关闭连接。

```java
package Learning1025;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.Socket;

public class FileClient {
    public static void main (String[] args) {
        communicate();
    }

    public static void communicate () {
        Socket socket = null;
        FileInputStream fis = null;
        OutputStream os = null;
        InputStream is = null;
        try {
            socket = new Socket(InetAddress.getByName("127.0.0.1"), 9999);
            File picture = new File("C:\\Users\\liyanxiang\\Desktop\\1.jpg");
            fis = new FileInputStream(picture);
            os = socket.getOutputStream();
            byte[] data = new byte[100];
            int len = 0;
            while ((len = fis.read(data)) != -1) {
                os.write(data, 0, len);
            }
            socket.shutdownOutput();
            is = socket.getInputStream();
            byte[] response = new byte[100];
            int len2 = 0;
            while ((len2 = is.read(response)) != -1) {
                String str = new String(response, 0, len2);
                System.out.println(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                os.close();
                fis.close();
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

```java
package Learning1025;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class FileServer {
    public static void main (String[] args) {
        server();
    }

    public static void server () {
        ServerSocket ss = null;
        Socket socket = null;
        InputStream is = null;
        FileOutputStream fos = null;
        OutputStream os = null;
        try {
            ss = new ServerSocket(9999);
            socket = ss.accept();
            File picture = new File("../GakkiPic.jpg");
            is = socket.getInputStream();
            fos = new FileOutputStream(picture);
            byte[] data = new byte[100];
            int len = 0;
            while ((len = is.read(data)) != -1) {
                fos.write(data, 0, len);
            }
            System.out.println("收到" + socket.getInetAddress().getHostName() + "发来的照片");
            os = socket.getOutputStream();
            os.write("已收到GAKKI！".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                socket.close();
                is.close();
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
}

```

以上是socket网络编程的大体原理，下面来看一下使用tomcat服务器作为客户端。





Tomcat：

Tomcat 服务器是一个免费的开放源代码的Web 应用服务器，属于轻量级应用服务器，是开发和调试JSP 程序的首选。对于一个初学者来说，可以这样认为，当在一台机器上配置好Apache 服务器，可利用它响应HTML页面的访问请求。实际上Tomcat是Apache 服务器的扩展，但运行时它是独立运行的，所以当你运行tomcat 时，它实际上作为一个与Apache 独立的进程单独运行的。

将tomcat服务器下载并解压之后，在bin目录中启动startup.bat，

我这里闪退了，在bat文件最后加上“PAUSE”来让窗口暂停，显示报错如下：

```
Neither the JAVA_HOME nor the JRE_HOME environment variable is defined
At least one of these environment variable is needed to run this program
```

原因是没有配置好jdk的环境变量。配置好环境变量继续往下做：

然后在../webapps/examples目录中新建文件并编辑，现在怎么访问这个新建的文件呢？打开浏览器，在本地服务器即127.0.0.1的8080端口进行对webapps的访问。

```
http://127.0.0.1:8080/examples/gakki.txt
```

现在就可以访问刚才新建的文件了。



UDP 连接：

UDP连接主要使用 DatagramSocket 与 DatagramPacket 这两个类实现网络协议。UDP数字报通过数字报套接字 DatagramSocket 进行发送与接收，不保证数据包一定能够安全到达目的地，也不保证什么时候到达。

DatagramPacket对象封装了UDP数字报，在数据报中包含着发送端与接收端的IP地址与端口信息。每一个UDP数据报都包含着完整的发送方与接收方的信息，所以无需建立发送方与接收方的连接。

发送端：

```java
package Learning1025;

import java.net.*;

public class UDPSend {
    public static void main (String[] args) {
        DatagramSocket ds = null;
        try {
            ds = new DatagramSocket();
            byte[] data = "新垣结衣的微笑就由我来守护！".getBytes();
            DatagramPacket = new DatagramPacket(data, data.length,
                    InetAddress.getByName("127.0.0.1"), 9999);
            ds.send(dp);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ds.close();
        }
    }
}

// 1. 创建UDP套接字对象DatagramSocket
// 2. 创建一个数据接收数据
// 3. 创建一个数据包UDP对象，需要提供地址，端口等信息
// 4. 套接字对象调用send方法发送数据
// 5. 关闭套接字对象
```

接收端：

```java
package Learning1025;

import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UDPReceive {
    public static void main (String[] args) {
        DatagramSocket ds = null;
        try {
            ds = new DatagramSocket(9999);
            byte[] data = new byte[100];
            DatagramPacket dp = new DatagramPacket(data, 0, data.length);
            ds.receive(dp);
            String str = new String(dp.getData(), 0, dp.getLength());
            System.out.println(str);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ds.close();
        }
    }
}

// 1. 创建一个UDP套接字对象
// 2. 创建一个数据接收数组
// 3. 创建一个数字报对象
// 4. 套接字对象调用receive方法来接收数据
// 5. 数字报对象调用getData获取内容，调用getLength获取数据长度
// 6. 关闭套接字对象资源
```

UDP协议与TCP协议相似，都是套路。











参考链接：

1. [tomcat](https://tomcat.apache.org/)
2. [java文档](http://tool.oschina.net/apidocs/apidoc?api=jdk-zh)