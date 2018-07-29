## URL编程





url为统一资源定位符（uniform resource locator），他表示网络上某一资源的地址，URL的格式为：

```
<协议名>://<主机名>:<端口号>/<文件名>
```

一个URL对象对应着互联网上的一个资源。可以通过URL对象调用相应的方法将资源读取。比如说，现在打开tomcat服务器，可以在浏览器中打开服务器examples中的资源，地址栏中的内容就是一个URL，这个地址可以用来传入URL构造函数来生成一个URL对象。

```java
try {
  URL url = new URL("http://127.0.0.1:8080/examples/gakki.txt");

  System.out.println(url.getAuthority());
  System.out.println(url.getContent());
  System.out.println(url.getDefaultPort());
  System.out.println(url.getFile());
  System.out.println(url.getHost());
  System.out.println(url.getPath());
  System.out.println(url.getPort());
  System.out.println(url.getProtocol());
  System.out.println(url.getQuery());
  System.out.println(url.getRef());
} catch (Exception e) {
  e.printStackTrace();
}

// 结果如下，都是字面意思，很简单
127.0.0.1:8080
sun.net.www.content.text.PlainTextInputStream@39fb3ab6
80
/examples/gakki.txt
127.0.0.1
/examples/gakki.txt
8080
http
null
null
```

那么如何对服务器端的资源进行读取如下：

```java
......
InputStream is = null;
URL url = new URL("http://127.0.0.1:8080/examples/gakki.txt");
is = url.openStream();
byte[] data= new byte[10];
int len = 0;
while ((len = is.read(data)) != -1) {
  String temp = new String(data, 0, len, "gb2312");
  System.out.print(temp);
}
```

URL对象的openStream方法可以返回一个输入流来将资源进行读取。然后剩下的过程就与普通输入流的读取操作没有什么区别了。唯一需要注意的一点就是由于文件的编码格式不同，所以在组后构建字符串对象的时候需要设置一个与文件编码相同的charset，在这里我是gb2312。

如果希望输出数据，那么需要先使用URL的方法openConnection与URL建立连接，才能对其进行读写。这个方法返回一个URLConnection对象，在这个对象中可以获得输入流输出流，从而进行读写。

```java
......
FileOutputStream fos = null;      
URLConnection uc = url.openConnection();
InputStream ucis = uc.getInputStream();
File file = new File("../url.txt");
fos = new FileOutputStream(file);
byte[] ucdata = new byte[12];
int uclen = 0;
while ((uclen = ucis.read(ucdata)) != -1) {
  fos.write(ucdata, 0, uclen);
}
fos.close();
```

现在就可以将网络上的资源写到本地的文件中。



参考链接： 

1. [Socket shutdownOutput](http://blog.csdn.net/dabing69221/article/details/17351881)
2. [openStream 编码](http://bbs.csdn.net/topics/370137885)