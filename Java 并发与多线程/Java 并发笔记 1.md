# Java 并发笔记 1

## 线程状态

线程从创建到死亡，可以分为七个状态（也可以分为五大类），如下图

![](https://i.imgur.com/xInt0M7.jpg)

1. 首先 new 一个线程，创建一个新的线程对象。此时处于**新建状态** **New**。

2. **就绪状态**（可运行状态） **Runnable**，线程对象创建之后，其他线程调用了此线程对象的 start() 方法。该状态的线程位于“**可执行线程池**”中，变得可以运行，等待 CPU 资源的使用权。即就绪状态的线程除了 CPU 资源之外，已经获得了其他所有的执行资源。

3. **运行状态 Running**，就绪状态的线程获得了 CPU 的使用权，执行线程程序。

4. **阻塞状态 Blocked**，阻塞状态是某个线程从运行状态放弃了 CPU 的使用权，暂时停止执行。阻塞状态只能进入就绪状态，然后再一次获得 CPU 的使用权的时候执行代码。

   其中，阻塞状态还可以细分为 3 中情况：

   1. **等待阻塞**，当运行线程执行了 wait() 方法的时候，那么此时该线程会释放所有占用的资源，此线程进入“**等待池**”，进入这个状态之后，是不能自己唤醒的，必须要依靠其他线程使用 **notify()** 或者 **notifyAll()** 这两个方法来唤醒等待阻塞线程。
   2. **同步阻塞**，运行的线程在试图获取资源的**同步锁**的时候，如果此时另外的线程正占用着这个锁，那么这个线程会进入“**锁池**”中。
   3. **其他阻塞**，当运行线程执行 **sleep()** 与 **join()** 方法或者进行 **I/O 请求**的时候，线程暂时处于阻塞状态，等待这三种任务执行完毕的时候，会自动转入就绪状态。

5. **死亡状态 Dead**，线程代码执行完毕或者是通过异常而中断的时候，则结束线程的声明周期。线程死亡，不会再“复活”。即不能在线程死亡后执行 start() 方法，否则会有 IllegalThreadStateException 异常。

几种方法的对比：

1. Thread.sleep(long millis)，一定是当前线程调用此方法，当前线程进入阻塞，但不释放对象锁，millis 后线程自动苏醒进入可运行状态。作用：给其它线程执行机会的最佳方式。
2. Thread.yield()，一定是当前线程调用此方法，当前线程放弃获取的 CPU 时间片，由运行状态变会可运行状态，让 JVM 再次选择线程。作用：让相同优先级的线程轮流执行，但并不保证一定会轮流执行。实际中无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中。Thread.yield() 不会导致阻塞。
3. t.join()/t.join(long millis)，当前线程里调用其它线程的 join 方法，当前线程阻塞，但不释放对象锁，直到其他线程执行完毕或者 millis 时间到，当前线程进入可运行状态。
4. obj.wait()，当前线程调用对象的 wait() 方法，当前线程释放对象锁，进入等待队列。依靠 notify()/notifyAll() 唤醒或者 wait(long timeout)timeout 时间到自动唤醒。
5. obj.notify() 唤醒在此对象监视器上等待的单个线程，选择是任意性的。notifyAll() 唤醒在此对象监视器上等待的所有线程。

```java
public class NewThread implements Runnable{
  @Override
  public void run() {
    while (true) {
      System.out.println("自定义线程正在运行");
      try {
        Thread.sleep(200);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  public static void main(String[] args) {
    // 创建线程，将 runnable 实现对象传入构造器指定线程任务
    Thread thread = new Thread(new NewThread());

    // 启动线程
    thread.start();

    while (true) {
      System.out.println("主线程正在运行");
      try {
        Thread.sleep(200);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
}
```



## 创建线程的几种方式

### 继承 Thread 类创建线程

```java
public class CreateThread1 extends Thread {
  int count = 100;
  public CreateThread1(String name) {
    super(name);
  }
  @Override
  public void run() {
    while (count-- > 0) {
      System.out.println(getName() + " 线程正在运行...");
    }
  }
  public static void main(String[] args) {
    CreateThread1 thread1 = new CreateThread1("gakki");
    CreateThread1 thread2 = new CreateThread1("新垣结衣");
    thread1.setDaemon(true);
    thread1.start();
    thread2.start();
  }
}
```

其中有个 setDaemon() 方法，是用来设置当前的线程是否是守护线程。Java 中的线程分为两类，一类是**用户线程**，另一类是**守护线程**（也称服务线程）。线程默认是用户线程，主线程结束之后如果还有用户线程，那么 JVM 将继续执行，直到用户线程执行结束；如果没有用户线程，剩下的线程只有守护线程，那么 JVM 将结束。

### 实现 Runnble 接口创建线程

```java
public class CreateThreadByImplementsRunnable implements Runnable{
  @Override
  public void run() {
    while (true) {
      System.out.println("线程正在执行...");
    }
  }

  public static void main(String[] args) {
    CreateThreadByImplementsRunnable runnable = new CreateThreadByImplementsRunnable();
    Thread thread = new Thread(runnable);
    thread.start();
  }
}
```

其实到这里，就会发现通过第一种方式，即继承 Thread 类的方式开启线程，其实也是实现 runnable 接口（Thread 类本身就实现了 runnable 接口），可以看 Thread 源码，它实现的 run() 方法就是执行构造其中传入的 Runnble 接口实例的重写的 run() 方法，源码如下：

```java
/**
 * If this thread was constructed using a separate
 * <code>Runnable</code> run object, then that
 * <code>Runnable</code> object's <code>run</code> method is called;
 * otherwise, this method does nothing and returns.
 * <p>
 * Subclasses of <code>Thread</code> should override this method.
 *
 * @see     #start()
 * @see     #stop()
 * @see     #Thread(ThreadGroup, Runnable, String)
 */
@Override
public void run() {
  if (target != null) {
    target.run();
  }
}
```

### 匿名内部类创建线程

```java
public class CreateThreadByNestedClass {
  public static void main(String[] args) {
    new Thread() {
      public void run() {
        while (true) {
          System.out.println("Thread1 方法正在运行 ...");
        }
      }
    }.start();

    new Thread(new Runnable() {
      @Override
      public void run() {
        while (true) {
          System.out.println("正在运行 Thread2 方法 ...");
        }
      }
    }).start();
    
    new Thread(new Runnable() {
      @Override
      public void run() {
        while (true) {
          System.out.println("执行 Runnable 方法");
        }
      }
    }){
      public void run() {
        while (true) {
          System.out.println("执行子类方法");
        }
      }
    }.start();
  }
}
```

匿名类创建线程方法很简单，没什么特殊的地方。但是注意上边代码的第三个开启的线程，它向构造器中传入了一个接口实现，另外匿名内部子类也重写了 run() 方法。实际上还是匿名子类调用的 start() 方法。所以这里输出的是“执行子类方法”。

### 实现 Callable 接口创建线程

```java
public class CreateThreadByImplementsCallable implements Callable<String> {
  @Override
  public String call() throws Exception {
    for (int i = 0; i <= 100; i += 5) {
      System.out.println("线程执行进度：" + i + "%");
      Thread.sleep(200);
    }
    return "Done!";
  }

  public static void main(String[] args) {
    CreateThreadByImplementsCallable callable = new CreateThreadByImplementsCallable();
    FutureTask<String> task = new FutureTask<String>(callable);
    Thread thread = new Thread(task);
    thread.start();
    try {
      System.out.println(task.get());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
```

可以看到，实现 Callable 接口与之前的 Runnable 接口很类似，Callable 接口中有一个 call() 泛型方法应当在实现类中重写，方法体就是线程要执行的代码，其中的泛型类型就是线程返回值的类型。步骤即是，首先实现 Callable 接口，然后实例化实现类对象，然后实例化 FutureTask 对象并传入 Callable 接口的实现对象，再然后创建 Thread 对象并传入刚才的 FutureTask 实例，最后还是调用 start() 方法启动线程。如果想要得到线程的返回值，可以使用 FutureTask 实例调用 get() 方法。

### 定时器创建线程

```java
public class CreateThreadByTimer {
  public static void main(String[] args) {
    Timer timer = new Timer();
    timer.schedule(new TimerTask() {
      @Override
      public void run() {
        // 实现定时任务
        System.out.println("有没有人去吃饭呀？没有的话我 5 秒钟之后再问一遍");
      }
    }, 0, 5000);

    while (true) {
      try {
        Thread.sleep(1000);
      } catch (Exception e) {
        e.printStackTrace();
      }
      System.out.println("好饿啊...");
    }
  }
}
```

定时器也可以创建一个线程，但是它创建的线程不够灵活，局限很多。如果使用定时器来创建定时任务线程，只需要实例化 Timer 对象，然后调用它的 schedule() 方法。另外有一个名字叫做 Quartz 的开源作业调度框架，可以用来方便的实现定时任务线程。

### 使用线程池来获取线程

线程池与数据库连接池、常量池等各种池一样，是一种以持续维护来减少线程频繁创建与销毁的线程容器。常见的线程池有四种：分别是 CachedThreadPool 可缓存线程池，FixedThreadPool 控制最大并发数的定长线程池，ScheduledThreadPool 可定时及周期执行任务的定长线程池，SingleThreadExecutor 顺序队列单线程线程池。

```java
public class CreateThreadByThreadPool {
  public static void main(String[] args) {
    // 设定线程池类型与缓存线程的数量
    Executor threadPool = Executors.newFixedThreadPool(10);
    // 线程池调用 execute 方法，并传入 Runnable 接口实现来执行线程任务
    for (int i = 0; i < 20; i++) {
      threadPool.execute(new Runnable() {
        @Override
        public void run() {
          while (true) {
            try {
              Thread.sleep(1000);
            } catch (Exception e) {
              e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + " 线程执行中...");;
          }
        }
      });
    }
  }
}
```



## 线程的中断与销毁

线程对象有 interrupt() 方法与 isInterrupted() 方法。首先 interrupt() 方法的含义并不是将线程直接进行结束，而是给线程发送一个信号，告诉这个线程应当要结束了。并将相应的中断标志位置为 true，线程自己通过检测标志位来做出相应的操作判断（中断的操作应由程序员自己实现）。这样相对于已经废弃的方法 stop() 来说，提高了安全性。另外的 isInterrupted() 方法来获取标志位，还有一个 interrupted() 方法也是返回标志位，但是这个方法会将中断状态置为 false。

将之前代码改动如下：

```java
public class CreateThreadByImplementsRunnable implements Runnable{
  @Override
  public void run() {
    while (true) {
      System.out.println("线程正在执行...");
    }
  }

  public static void main(String[] args) {
    CreateThreadByImplementsRunnable runnable = new CreateThreadByImplementsRunnable();
    Thread thread = new Thread(runnable);
    thread.start();
  }
}
```

那么以上这两种方式哪一个更好呢？其实我更倾向于实现 Runnable 接口的方式，因为我们面向对象编程有一个很优秀的原则即是**面向接口编程**，面向接口编程可以将程序解耦，更加的松耦合。



## 参考与感谢

1. [Java线程的状态及切换](http://blog.csdn.net/pange1991/article/details/53860651)
2. [Java线程的几种状态](http://blog.csdn.net/pange1991/article/details/53860651)
3. [java创建线程的三种方式及其对比](http://blog.csdn.net/longshengguoji/article/details/41126119)
4. [java中创建线程的三种方法以及区别](http://www.cnblogs.com/3s540/p/7172146.html)
5. [Thread.setDaemon详解](http://blog.csdn.net/xyls12345/article/details/26256693)
6. [从头认识多线程 interrupt() 和 isInterrupted()](http://blog.csdn.net/raylee2007/article/details/51161434)
7. [Java里一个线程调用了Thread.interrupt()到底意味着什么？](https://www.zhihu.com/question/41048032?sort=created)
8. [Java中匿名类的两种实现方式](http://blog.csdn.net/cntanghai/article/details/6094481)
9. [一道小测试题，一个线程既实现了 Runnable 接口又继承 Thread 方法](http://blog.csdn.net/wangbaokangfei/article/details/7853196)
10. [Callable 接口解析](http://blog.csdn.net/sunp823/article/details/51569314)
11. [说说 Runnable 与 Callable](http://www.cnblogs.com/frinder6/p/5507082.html)
12. [Java 多线程编程：Callable、Future 和 FutureTask 浅析（多线程编程之四）](http://blog.csdn.net/javazejian/article/details/50896505)
13. [深入理解 Java 之线程池](http://www.cnblogs.com/exe19/p/5359885.html)
14. [线程池，这一篇或许就够了](https://www.jianshu.com/p/210eab345423)
15. [Java 四种线程池newCachedThreadPool,newFixedThreadPool,newScheduledThreadPool,newSingleThreadExecutor](http://www.cnblogs.com/zhujiabin/p/5404771.html)