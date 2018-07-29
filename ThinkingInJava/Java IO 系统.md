# 十八章 Java I/O 系统



## File 类

File 类既可以代表一个特定文件的名称，又能代表一个目录下的一组文件的名称又能代表目录下的一组文件的名称。如果它指的是一个文件集，那么就可以对这个集合调用 list() 方法，这个方法会返回一个字符数组。我们很容易就可以理解返回的是一个数组而不是某个更具灵活性的类容器，因为元素的个数是固定的。

假设我们想查看一个目录列表，可以使用两种方法来使用 File 对象。如果我们调用不带参数的 list() 方法，便可以获得此 File 对象包含的全部列表。然而，如果我们想要获得一个受限的列表，例如找到所有扩展名为java的文件，那么我们就要使用“目录过滤器”，这个类告诉我们怎样显示符合过滤条件的File对象。如下：

```java
import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.regex.Pattern;

public class DirList {
  public static void main (String[] args) {
    File path = new File(".");
    String[] list;
    list = path.list(new DirFilter(args[0]));
    // 使用 String 的 CASE_INSENSITIVE_ORDER 是按照字母顺序进排序
    Arrays.sort(list, String.CASE_INSENSITIVE_ORDER);
    for (String dirItem : list) {
      System.out.println(dirItem);
    }
  }

  class DirFiler implements FilenameFilter {
    private Pattern pattern;
    public DirFiler (String regex) {
      pattern = Pattern.compile(regex);
    }
    public boolean accept(File dir, String name) {
      return pattern.matcher(name).matches();
    }
  }
}
```

示例代码中首先定义了一个过滤器类，这个类实现了文件过滤器接口 FilenameFilter，其中需要重写一个 accept 方法。然后文件目录列表类使用 list() 方法来获得指定目录的所有文件名字符串数组。通过 Arrays 类的进行方法对这个数组进行排序。其中的 list() 方法中可以传递一个实现了 FilenameFilter 接口的对象，在这个例子中可以传递 DirFiler 的实例进去。创建这个类的唯一原因就是将 accept() 方法提供给 list() 方法使用。使用 list() 方法可以回调 accept，进而决定哪些文件包含在列表中。因此，这种结构也常常成为回调。accept() 方法必须接收一个代表某个特定文件所在目录的 File 对象以及包含了那个文件名的 String，list() 方法会自动调用 accept() 方法来判断目录总的每个文件名。

File 类不仅仅只代表存在的文件或者目录，也可以使用 File 对象创建新的目录或者尚不存在的整个目录路径，以及查看文件的特性（如大小，最后修改日期，读/写等），检查 File 代表的是一个目录还是一个文件，并可以删除文件等功能。



## 输入与输出

**流**代表任何有能力产出数据的数据源对象或者是有能力接收数据的接收端对象，“流”屏蔽了实际的 I/O 设备中处理数据的细节。

Java 类库中的 I/O 类分成输入和输出两个部分，通过继承：

* 任何自 InputStream 或者 Reader 派生而来的类都含有名为 read() 的基本方法，用于读取单个字节或者字节数组
* 任何自 OutputStream 或者 Writer 派生而来的类都含有名为 write() 的基本方法，用于写单个字节或者字节数组

### InputStream 与 OutputStream 类型

InputStream 的作用是用来表示从不同数据源产生输入的类，这些数据源包括：

* 字节数组
* String 对象
* 文件
* “管道”
* 一个由其他种类的流组成的序列
* 其他数据源，如 Internet 连接等

每种数据源都有自己相应的 InputStream 子类。相对应的，OutputStream 类决定了输出所要去往的目标：如字节数组或者管道。

## Reader 和 Writer

InputStream 和 OutputStream 在以字节形式的 I/O 中提供很重要的功能，Reader 与 Writer 提供兼容 Unicode 与面向字符的 I/O 功能。有时我们需要将字节与字符结合起来，为了实现这个目的需要使用“适配器”类：而 InputStreamReader 可以把 InputStream 转换为 Reader，同理 OutputStreamWriter 可以把 OutputStream 转换为 Writer。添加 Reader 与 Writer 继承层次结构主要是为了国际化，在所有的 I/O 操作中都支持 Unicode。

## I/O 流的典型使用方式

若要打开一个文件用于字符输入，可以使用 String 或者 File 对象作为文件名的 FileInputReader，但是为了提高速度，我们可以为这个要读取的文件进行缓冲，此时我们可以将产生的引用传递给一个 BufferedReader 构造器，由于 BufferedReader 也提供 readLine() 方法，所以现在就可以用过带缓存功能的 BufferedReader 来进行字符的读写，当 readLine() 方法的返回值为 null 的时候，即达到了文件的末尾。

```java
package TIJ;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class BufferedInputFile {
  public static String read(String fileName) throws IOException {
    BufferedReader in = new BufferedReader(
      new FileReader(fileName)
    );
    String s = null;
    StringBuilder sb = new StringBuilder();
    while ((s = in.readLine()) != null) {
      sb.append(s + "\n");
    }
    in.close();
    return sb.toString();
  }

  public static void main(String[] args) throws Exception {
    // 注意在 IDEA 中的当前的路径是项目目录
    System.out.println(new File("").getAbsolutePath());
    System.out.println(read("src/TIJ/BufferedInputFile.java"));
  }
}
```

进一步，还可以将上个例子中的 BufferedInputFile 的 read() 静态方法返回的 String 结果创建一个 StringReader，并使用这个 StringReader 的 read() 方法来发送给控制台。

```java
package TIJ;

import java.io.StringReader;

public class MemoryInput {
  public static void main(String[] args) throws Exception {
    StringReader in = new StringReader(BufferedInputFile.read("src/TIJ/MemoryInput.java"));
    int character = 0;
    while ((character = in.read()) != -1) {
      Thread.sleep(50);
      // 注意 StringReader 返回的是 int 形式的下一字节，所以类型需要转换为 char
      System.out.print((char) character);
    }
  }
}
```

如果想要格式化输出数据，可以使用 DataInputStream，它是一个面向字节（而非面向字符）的 I/O 类，所以 DataInputStream 必须使用 InputStream 类而不是 Reader 进行初始化，而 ByteArrayInputStream 是一个很适合传递给 DataInputStream 的 InputStream。对于 DataInputStream，我们可以使用 available() 方法查看还有多少可供存取的字符，如下：

```java
package TIJ;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.FileInputStream;

public class TestEOF {
  public static void main(String[] args) throws Exception {
    DataInputStream dis = new DataInputStream(
      new BufferedInputStream(
        new FileInputStream("src/TIJ/TestEOF.java")
      )
    );
    while (dis.available() != 0) {
      Thread.sleep(50);
      System.out.print((char) dis.readByte());
    }
  }
}
```

### 基本的文件输入

FileWriter 对象可以向文件写入数据。首先，创建一个与制定文件相连接的 FileWriter。如下：

```java
package TIJ;

import java.io.*;

public class BasicFileOutput {
  static String file = "BasicFileOutput.out";
  public static void main(String[] args) throws Exception {
    BufferedReader in = new BufferedReader(
      new StringReader(
        BufferedInputFile.read("src/TIJ/BasicFileOutput.java")
      )
    );
    PrintWriter out = new PrintWriter(
      new BufferedWriter(
        new FileWriter(file)
      )
    );
    int lineCode = 1;
    String s = null;
    while ((s = in.readLine()) != null) {
      out.println(lineCode++ + ": " + s);
    }
    out.close();
    System.out.println(BufferedInputFile.read(file));
  }
}
```

 上边的例子中，首先使用 StringReader 来读取一个字符串数据，然后通过它来创建一个 BufferedReader 字符流缓存对象。接着通过一个字符串来指定文件的输出路径，创建一个 FileWriter，使用 BufferedWriter 来包装这个文件的输出对象，最后再使用打印流包装缓存对象。之后要做的就是对文件进行边读取边操作，每读取一行字符，就在输出流中进行相应的写入，组后关闭输出流，如果不为所有的输出文件调用 close() 方法，就会使得缓冲区内容不会被刷新清空，那么向文件输出的内容也就会缺失。运行之后可以看到在文件目录中创建了一个 BasicFileOutput.out 文件并写入了修改的内容。

在 Java 5 之后，PrintWriter 中添加了一个辅助构造器，使得不必在每次希望创建文本文件并输出内容的时候，都去执行以上的繁琐的装饰操作。如下：

```java
package TIJ;

import java.io.BufferedReader;
import java.io.PrintWriter;
import java.io.StringReader;

public class FileOutputShortcut {
  static String file = "FileOutputShortcut.out";
  public static void main(String[] args) throws Exception {
    BufferedReader in = new BufferedReader(
      new StringReader(
        BufferedInputFile.read("src/TIJ/FileOutputShortcut.java")
      )
    );
    PrintWriter out = new PrintWriter(file);
    int lineCount = 1;
    String s = null;
    while ((s = in.readLine()) != null) {
      out.println(lineCount++ + ": " + s);
    }
    out.close();
    System.out.println(BufferedInputFile.read(file));
  }
}
```

对比上边两段代码，PrintWriter 的构造只需要一个表示文件路径与名称的字符串即可。



## 标准 I/O

 标准 I/O 的意义在于：我们可以很容易地把程序串联起来，一个程序的标准输出可以称为另一个程序的标准输入。

### 从标准输入中读取

按照标注 I/O 模型，Java 提供了 System.in、System.out 和 System.err。其中 System.out 和 System.err 已经是事先被包装成了 PrintStream 的对象，而 System.in 却是一个没有被包装过的未经加工的 InputStream，这意味着尽管我们可以立即使用 System.out 和 System.err，但是在读取 System.in 之前必须对其进行包装。

如果使用 readLine() 方法一次一行地进行读取输入，那么可以通过 InputStreamReader 把 System.in 转换成 Reader，从而将 System.in 包装成 BufferedReader。如下：

```java
package TIJ;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Echo {
  public static void main(String[] args) throws Exception {
    BufferedReader in = new BufferedReader(
      new InputStreamReader(
        System.in
      )
    );
    String s = null;
    while ((s = in.readLine()) != null) {
      System.out.println(s);
    }
  }
}
```

以上代码可以对终端中的输入进行回显。

### 将 System.in 转换为 PrintWriter

System.out 是一个 PrintStream，而 PrintStream 是一个 OutputStream，PrintWriter 有一个可以接收 OutputStream 作为参数的构造器。

```java
package TIJ;

import java.io.PrintWriter;

public class ChangeSystemOut {
  public static void main(String[] args) {
    PrintWriter out = new PrintWriter(System.out, true);
    out.println("hello, world.");
  }
}
```

重点在于此时 PrintWriter 的构造器的第二个参数，表示开启自动刷新输出缓冲区的功能。

### 标准 I/O 重定向

通过 System 类的 setIn/setOut/setErr 方法可以对标准输入输出以及错误进行重定向。I/O 重定向操纵的是字节流，而非字符流。因此进行重定向的时候使用的是 InputStream 和 OutputStream 而非 Reader 与 Writer。

```java
package TIJ;

import java.io.*;

public class Redirecting {
  public static void main(String[] args) throws Exception {
    PrintStream console = System.out;
    BufferedInputStream in = new BufferedInputStream(
      new FileInputStream("src/TIJ/Redirecting.java")
    );
    PrintStream out = new PrintStream(
      new BufferedOutputStream(
        new FileOutputStream("test.out")
      )
    );
    System.setIn(in);
    System.setOut(out);
    System.setErr(out);
    BufferedReader br = new BufferedReader(
      new InputStreamReader(
        System.in
      )
    );
    String s = null;
    while ((s = br.readLine()) != null) {
      System.out.print(s);
    }
    out.close();
    System.setOut(console);
  }
}
```

以上代码中，已经使用了 setIn setOut 等方法进行了输入与输出的重定向，所以运行代码时，不会再看到控制台中的输出，而是输出到了新建的文件之中。

## NIO

JDK 1.4 中的 java.nio.* 包中引入了新的 java I/O 类库，其目的在于提高速度。NIO 速度的提高来自于所使用的结构更接近于操作系统执行 I/O 的方式：**通道与缓冲器**。唯一与通道直接进行交互的缓冲器是 ByteBuffer，示例如下：

```java
package TIJ;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

public class GetChannel {
  private static final int BSIZE = 1024;
  public static void main(String[] args) throws Exception {
    FileChannel fileChannel = new FileOutputStream("data.txt").getChannel();
    fileChannel.write(ByteBuffer.wrap("some text".getBytes()));
    fileChannel.close();

    fileChannel = new FileInputStream("data.txt").getChannel();
    ByteBuffer buffer = ByteBuffer.allocate(BSIZE);
    fileChannel.read(buffer);
    buffer.flip();
    while (buffer.hasRemaining()) {
      System.out.print((char) buffer.get());
    }
  }
}
```

在旧的 I/O 类中有三个类被修改，可以产生 FIleChannel，即 FileInputStream、FileOutputStream 与 RandomAccessFile，这些都是字节操作。以上的流可以通过 getChannel() 方法来产生一个 FileChannel，然后就可以向获得的通道传送用于读写的 ByteBuffer 了。

将字节存放于 ByteBuffer 的方法可以使用 put 方法对其直接进行填充，填入一个或者多个字节，或者是基本类型的数据。也可以通过 wrap 方法将已存在的字节数组“包装到” ByteBuffer 之中，即为数组支持的 ByteBuffer。

对于只读访问，必须显式地使用静态的 allocate() 或者是 allocateDirect() 方法来分配 ByteBuffer，然后通道对象就可以对这个 ByteBuffer 对象进行读取。一旦调用通道的 read() 方法来将 ByteBuffer 中存放字节，那么就必须调用 ByteBuffer 的 flip() 方法，让 ByteBuffer 对象做好等待从他这里读取字节的准备。如果想要使用缓冲器执行进一步的 read() 操作，那么也必须使用 clear() 方法来使每一个 read() 做好准备。如下：

```java
package TIJ;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

public class ChannelCopy {
  private static final int BSIZE = 1024;
  public static void main(String[] args) throws Exception {
    FileChannel in = new FileInputStream("src/log4j2.xml").getChannel();
    FileChannel out = new FileOutputStream("out.txt").getChannel();
    ByteBuffer buffer = ByteBuffer.allocate(BSIZE);
    while (in.read(buffer) != -1) {
      buffer.flip();
      out.write(buffer);
      buffer.clear();
    }
  }
}
```

以上就是将一个文件通过通道传输到另一个文件，但是有一对特殊方法 transferTo() / transferFrom() 允许将一个通道与另一个通道直接相连，如下：

```java
package TIJ;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.channels.FileChannel;

public class TransferTo {
  public static void main(String[] args) throws Exception {
    FileChannel in = new FileInputStream("src/log4j2.xml").getChannel();
    FileChannel out = new FileOutputStream("out.txt").getChannel();
    in.transferTo(0, in.size(), out);
  }
}
```

### 转换数据

缓冲器容纳的是普通的字节，为了把它们转换成字符，我们要么在输入它们的时候对其进行编码，那么在将其从缓冲器输出时进行解码。可以使用 java.nio.charset.Charset 类实现这些功能，该类提供了把数据编码成各种不同类型的字符集的工具。

### 用缓冲器操纵数据

如果想把一个字节数组写到文件中去，那么就应该使用 ByteBuffer.wrap() 方法把字节数组包装起来，然后用 getChannel() 方法在 FileOutputStream 上打开一个通道，接着将来自 ByteBuffer 的数据写到 FileChannel 中。ByteChanel 是将数据转移出通道的唯一方式，我们不能把基本类型的缓冲器转换成 ByteBuffer。

### 缓冲器的细节

Buffer 由数据与可以高效访问及并且操纵这些数据的四个索引组成，这四个索引依次是：

* mark（标记）：用于重复一个读入或者写出操作
* position（位置）：下一个值将在此位置进行读写
* limit（界限）：超过这个位置进行读写是没有意义的
* capacity（容量）：永远不可变

以上的四个索引满足以下条件：

0 <= 标记 <= 位置 <= 界限 <= 容量

之前提到的那两个函数 flip() 与 clear() 就是对以上的索引进行操作，调用 flip() 方法将界限设置到当前位置，并把位置复位到 0；而调用 clear() 方法则是将位置复位到 0，并将界限复位到容量。

### 内存映射文件

内存映射文件允许我们创建和修改哪些因为太大而不能放入内存的文件。通过内存映射文件，我们就可以假定整个文件都放在内存中，而且可以完全把它当作非常大的数组来访问。通过文件上的通道，对其调用 map() 产生 MappedByteBuffer，这是一种特殊类型的直接缓冲器。注意必须对其指定文件的初始位置与映射区域的长度。这意味着我们可以映射某个较大文件的较小部分。例如：

```java
package TIJ;

import java.io.FileInputStream;
import java.nio.CharBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;

public class LargeMappedFiles {
  static int length = 0x000FFFFF;
  public static void main(String[] args) throws Exception {
    Charset charset = Charset.forName("GBK");
    MappedByteBuffer in = new FileInputStream("C:\\Users\\liyanxiang\\Desktop\\天龙八部.txt")
      .getChannel().map(FileChannel.MapMode.READ_ONLY, 0, length);
    CharBuffer charBuffer = charset.decode(in);
    while (charBuffer.remaining() > 0) {
      System.out.print(charBuffer.get());
    }
  }
}
```

### 文件加锁

JDK 1.4 引入了文件加锁机制，它允许我么同步访问某个作为共享资源的文件。不过，竞争同一个文件的两个线程可能不在同一个 Java 虚拟机上，或者一个是 Java 线程，另一个是操作系统中的其他的某个本地线程。文件锁对其他的操作系统进程是可见的，因为 Java 的文件加锁直接映射到了本地操作系统的加锁工具。

```java
package TIJ;

import java.io.FileOutputStream;
import java.nio.channels.FileLock;
import java.util.concurrent.TimeUnit;

public class FileLocking {
  public static void main(String[] args) throws Exception {
    FileOutputStream fos = new FileOutputStream("file.txt");
    FileLock fileLock = fos.getChannel().tryLock();
    if (fileLock != null) {
      System.out.println("Locked file");
      TimeUnit.MILLISECONDS.sleep(100000);
      fileLock.release();
      System.out.println("Release lock");
    }
    fos.close();
  }
}
```

运行以上代码的时候，如果在操作系统本地进行 file.txt 的修改，系统会提示文件正在被占用。这就验证了 Java 的文件加锁直接映射到本地操作系统的加锁工具。

通过对 FileChannel 调用 tryLock() 或者是 lock()，就可以获得整个文件的 FileLock。tryLock() 是非阻塞式的，这个方法设法获取文件锁，但是如果不能获得（当其他一些进程已经持有相同的锁并且不共享时），它将直接从方法调用返回。lock() 则是阻塞式的，它要阻塞进程直至锁可以获得，或调用 lock() 的线程中断，或者是调用 lock() 的通道关闭。使用 FileLock.release() 可以释放文件锁。

或者也可以使用如下方法对文件的一部分进行上锁：

```java
tryLock(long position, long size, boolean shared)
lock(long position, long size, boolean shared)
```

其中，加锁的区域由 size-positoin 决定，第三个参数指定是否是共享锁。具有固定尺寸的锁不随文件尺寸的变化而变化，如果获得了某个一区域（从 position 到 position+size）上的锁，当文件增大超出 position+size 时，那么在范围之外的部分则不会不锁定。而无参数的加锁方法则会对整个文件进行加锁，并且文件变大之后也是整个文件有效。

### 对映射文件进行部分加锁

文件映射通常应用于极大的文件。我们可能需要对这种巨大的文件进行部分加锁，以便其他进程可以修改文件中未被加锁的部分。下面的例子中两个线程分别加锁文件的不同部分：

```java
package TIJ;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.util.RandomAccess;

public class LockingMappedFiles {
  static final int LENGTH = 0X8FFFFFF;
  static FileChannel fileChannel;
  public static void main(String[] args) throws Exception {
    fileChannel = new RandomAccessFile("test.data", "rw").getChannel();
    MappedByteBuffer out = fileChannel.map(FileChannel.MapMode.READ_WRITE, 0, LENGTH);
    for (int i = 0; i < LENGTH; i++) {
      out.put((byte) 'x');
    }
    new LockAndModify(out, 0, 0 + LENGTH/3);
    new LockAndModify(out, LENGTH/2, LENGTH/2 + LENGTH/4);
  }

  private static class LockAndModify extends Thread {
    private ByteBuffer buff;
    private int start, end;
    LockAndModify(ByteBuffer mbb, int start, int end) {
      this.start = start;
      this.end = end;
      mbb.limit(end);
      mbb.position(start);
      buff = mbb.slice();
      start();
    }
    public void run() {
      try {
        FileLock fileLock = fileChannel.lock(start, end, false);
        System.out.println("Locked: " + start + " to " + end);
        while (buff.position() < buff.limit() - 1) {
          buff.put((byte) (buff.get() + 1));
        }
        fileLock.release();
        System.out.println("Released: " + start + " to " + end);
      } catch (IOException e) {}
    }
  }
}
```

线程类 LockAndModify 创建了缓冲区和用于修改的 slice()，然后在 run() 中，获得文件通道上的锁。



## 对象序列化

Java 的对象序列化将那些实现了 Serializable 接口的对象转换成一个字节序列，并能够在以后将这个字节序列完全恢复为原来的对象。利用对象的序列化，可以实现轻量级持久性，“持久性”意味着一个对象的生存周期并不取决于程序是否正在执行，它可以生存于程序的调用之间。对象必须在程序中显式地序列化（serialize）和反序列化还原（deserialize）。只要对象实现了 Serializable 接口，对象的序列化处理就会非常简单。

要序列化一个对象，首先要创建某些 OutputStream 对象，然后将其封装在一个 ObjectOutputStream 对象内。这时，只需要调用 writeObject() 即可将对象序列化，并将其发送给 OutputStream 内，然后调用 readObject()，可以获得一个引用，它指向一个向上转型的 Object，所以必须向下转型才能直接设置他们。示例如下：

```java
package TIJ;

import java.io.*;
import java.util.Random;

public class Worm implements Serializable {
  private static Random random = new Random(47);
  private Data[] d = {
    new Data(random.nextInt(10)),
    new Data(random.nextInt(10)),
    new Data(random.nextInt(10))
  };
  private Worm next;
  private char c;

  public Worm(int i, char x) {
    System.out.println("Worm constructor: " + i);
    c = x;
    if (--i > 0) {
      next = new Worm(i, (char) (x + 1));
    }
  }
  public Worm() {
    System.out.println("Default constructor");
  }
  public String toString() {
    StringBuilder result = new StringBuilder(":");
    result.append(c);
    result.append("（");
    for (Data data : d) {
      result.append(data);
    }
    result.append(")");
    if (next != null) {
      result.append(next);
    }
    return result.toString();
  }

  public static void main(String[] args) throws Exception {
    Worm w = new Worm(6, 'a');
    System.out.println("w = " + w);
    ObjectOutputStream objectOutputStream = new ObjectOutputStream(
      new FileOutputStream("worm.out")
    );
    objectOutputStream.writeObject("worm storage\n");
    objectOutputStream.writeObject(w);
    objectOutputStream.close();
    ObjectInputStream objectInputStream = new ObjectInputStream(
      new FileInputStream("worm.out")
    );
    String s = (String) objectInputStream.readObject();
    Worm w2 = (Worm) objectInputStream.readObject();
    System.out.println(s + " w2 = " + w2);
    ByteArrayOutputStream bout = new ByteArrayOutputStream();
    ObjectOutputStream out2 = new ObjectOutputStream(bout);
    out2.writeObject("Worm storage\n");
    out2.writeObject(w);
    out2.flush();
    ObjectInputStream in2 = new ObjectInputStream(
      new ByteArrayInputStream(
        bout.toByteArray()
      )
    );
    s = (String) in2.readObject();
    Worm w3 = (Worm) in2.readObject();
    System.out.println(s + " w3 = " + w3);
  }
}

class Data implements Serializable {
  private int n;
  public Data(int n) {
    this.n = n;
  }
  public String toString() {
    return Integer.toString(n);
  }
}
```

其中有几个小细节，就不详细说了：

* transient 修饰的属性，不会被序列化，反序列化的时候为 0 值
* 静态属性不能被序列化与反序列化，静态成员的默认初始值都是 0
* serialVersionUID 是一个需要经过特殊处理的静态变量，用于保证版本的正确。如果对象的某些字段发生了改变，那么对象的版本就不正确，报出异常 InvalidClassException。



参考与感谢：

1. [序列化Serializable serialVersionUID的作用](https://blog.csdn.net/lazyer_dog/article/details/51672070)