// ml5 + Teachable Machine + p5.sound 手势乐器 Lab2
let classifier;
// 替换成你自己Teachable Machine导出的模型地址
let imageModelURL = "https://teachablemachine.withgoogle.com/models/is4tr0f0N/";

// 摄像头变量
let video;
let flippedVideo;
let label = "";

// 音效变量（3个手势对应3段声音）
let sound1, sound2, sound3;
// 防重复播放标记，避免手势停留时疯狂循环播放
let lastGesture = "";

// 预加载：模型 + 音效
function preload() {
  // 加载图像分类模型
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  
  // 加载三段音效，替换成你上传的音频文件名
  sound1 = loadSound("assets/electric.mp3");
  sound2 = loadSound("assets/piano.mp3");
  sound3 = loadSound("assets/pop.mp3");
}

function setup() {
  createCanvas(320, 260);
  // 开启摄像头
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // 开始实时识别
  classifyVideo();
}

function draw() {
  background(0);
  // 绘制镜像摄像头画面
  image(flippedVideo, 0, 0);

  // 底部显示当前识别到的手势标签
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text("识别结果：" + label, width / 2, height - 8);
}

// 循环识别每一帧画面
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// 识别回调，核心音效触发逻辑
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // 获取置信度最高的分类标签
  label = results[0].label;
  
  // 只有手势切换时才播放声音，防止长按重复爆音
  if (label !== lastGesture) {
    if (label === "empty") {
      // 无音频执行代码
    }
    // 匹配3种手势，分别播放对应音效
    if (label === "openhand") { // 你的第一个手势分类名
      sound1.play();
    } else if (label === "fist") { // 第二个手势
      sound2.play();
    } else if (label === "peace") { // 第三个手势
      sound3.play();
    }
    // no-gesture 空手势不播放任何声音
    lastGesture = label;
  }

  // 持续循环识别
  classifyVideo();
}