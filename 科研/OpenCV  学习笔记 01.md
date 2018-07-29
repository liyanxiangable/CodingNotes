

# OpenCV  学习笔记 01

首先我想使用 Java 来作为科研与程序的主要开发语言，原因有三：

1. 对于机械专业的我来说，编程并不是强项，代码能力有待加强。目前用的比较顺手的语言就是 Java 与 JavaScript（nodejs）
2. Java 语言的开发效率一般来说比 C++ 来说要高，没有各种内存问题，调试也更为简单。当然对于目前的程序用途来说，应该不需要编写大型程序
3. OpenCV 竟然有 js 版本的，考虑到性能，还是先用 Java 吧

当然 OpenCV 只是一个第三方库，他支持多种语言。虽然语言不同，但是算法都是相同的，api 也都是相类似的。

## getOpenCV

我的环境是 win10 的系统，使用的 IDE 是宇宙最强最好用的 IDEA 2017.2。首先[在这里](https://opencv.org/releases.html)找到 OpenCV 的最新版本或者是适合版本，目前最新版本为 3.4，我就使用 3.4 版本了，点击 win pack 获取 OpenCV win 下的包 opencv-3.4.0-vc14_vc15.exe。双击打开，会使用 7z 解压，进入在同级目录下创建的目录 opencv，进入 build/java 子目录。现在会看到其中有一个 文件名为 opencv-340 的 jar 包，对于各位 Java 老司机来说这个再也熟悉不过了，我们要的就是这个 jar 包。

## importOpenCV

现在将 jar 包与相关的 dll 动态链接库引入到项目之中，还是在刚才的那个 Java 目录中，有两个文件夹，分别是 x64 与 x86，我的电脑是 64 为的系统，那我就使用 x64 目录中的 dll。

现在我在 IDE 中创建一个新的项目，然后导入 jar 包（因 IDE 而异，[IDEA 过程如下](http://blog.csdn.net/a153375250/article/details/50851049) ），将 x64 目录中的 dll 文件放到 IDE 所使用的那一个 JDK 的 bin 目录（C:\Program Files\Java\jdk-9\bin）中。



## testOpenCV

现在来做一个测试，看看刚才配置的 OpenCV 能够资瓷 Java 开发。首先需要有一个图片资源，我放到了桌面上。然后代码如下（代码参考于下方参考链接 6）：

```java
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class FirstOpenCVTest {
    private JLabel imageView;
    private Mat image;
    private String windowName;

    public FirstOpenCVTest(Mat image) {
        this.image = image;
    }

    public FirstOpenCVTest(Mat image, String windowName) {
        this.image = image;
        this.windowName = windowName;
    }

    /**
     * 图片显示
     */
    public void imshow() {
        setSystemLookAndFeel();
        Image loadedImage = toBufferedImage(image);
        JFrame frame = createJFrame(windowName, image.width(), image.height());
        imageView.setIcon(new ImageIcon(loadedImage));
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);// 用户点击窗口关闭
    }

    private void setSystemLookAndFeel() {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (UnsupportedLookAndFeelException e) {
            e.printStackTrace();
        }
    }

    private JFrame createJFrame(String windowName, int width, int height) {
        JFrame frame = new JFrame(windowName);
        imageView = new JLabel();
        final JScrollPane imageScrollPane = new JScrollPane(imageView);
        imageScrollPane.setPreferredSize(new Dimension(width, height));
        frame.add(imageScrollPane, BorderLayout.CENTER);
        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        return frame;
    }


    private Image toBufferedImage(Mat matrix) {
        int type = BufferedImage.TYPE_BYTE_GRAY;
        if (matrix.channels() > 1) {
            type = BufferedImage.TYPE_3BYTE_BGR;
        }
        int bufferSize = matrix.channels() * matrix.cols() * matrix.rows();
        byte[] buffer = new byte[bufferSize];
        matrix.get(0, 0, buffer); // 获取所有的像素点
        BufferedImage image = new BufferedImage(matrix.cols(), matrix.rows(), type);
        final byte[] targetPixels = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
        System.arraycopy(buffer, 0, targetPixels, 0, buffer.length);
        return image;
    }

    public static void main(String[] args) throws Exception{
        System.load("C:\\Program Files\\Java\\jdk-9\\bin\\opencv_java340.dll");
        FirstOpenCVTest firstOpenCVTest = new FirstOpenCVTest(Imgcodecs.imread("C:\\Users\\XXX\\Desktop\\gakki.jpg"), "Gakki");
        firstOpenCVTest.imshow();
        Thread.currentThread().sleep(9999);
    }
}
```

运行程序可以看到图片能够正常显示：

![](https://i.imgur.com/uZ8tKBZ.png)

以上的环境搭建就完成了。



## 参考与感谢

1. [OpenCV introduction to java devlopment](https://docs.opencv.org/2.4.11/doc/tutorials/introduction/desktop_java/java_dev_intro.html)
2. [OpenCV Binding Java 环境搭建](http://blog.csdn.net/jia20003/article/details/68944486)
3. [OpenCV 官方 java 引导教程中文翻译](http://blog.csdn.net/kingroc/article/details/51995678)
4. [Java OpenCV Windows 配置和项目中 jar 包的简单配置](http://blog.csdn.net/u012476249/article/details/53389763)
5. [IDEA 导入 jar 包](http://blog.csdn.net/a153375250/article/details/50851049)
6. [java opencv 读取并显示图片示例](http://www.cnblogs.com/superbool/p/5331196.html)
7. [opencv时报错：java.lang.UnsatisfiedLinkError的解决方法](http://blog.csdn.net/sinat_31135199/article/details/51395741)
8. [stackoverflow UnsatisfiedLinkError](https://stackoverflow.com/questions/37413197/java-lang-unsatisfiedlinkerror-org-opencv-imgcodecs-imgcodecs-imread-0ljava-la)