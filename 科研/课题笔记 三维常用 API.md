# 课题笔记 三维常用 API

## Kinect

获得默认 kinect2 设备

```c++
IKinectSensor * m_pKinect;
GetDefaultKinectSensor(&m_pKinect);
```

启动/关闭 kinect2 设备

```c++
m_pKinect->Open();
m_pKinect->Close();
```

获取色彩帧源

```
IColorFrameSource* pColorFrameSource = nullptr;
m_pKinect->get_ColorFrameSource(&pColorFrameSource);
```

获取色彩帧读取器

```c++
pColorFrameSource->OpenReader(&m_pColorFrameReader);
```

获取色彩帧数据

```c++
m_pColorFrameReader->
```





















## PCL













## OpenCV