let myVideo;      // 用于存储摄像头视频的变量
let mySlider;     // 滑块元素（调节亮度）
let myButton;     // 按钮元素（切换滤镜）
let myInput;      // 输入框元素（添加文字）

let filterType = 'NORMAL'; // 记录当前滤镜状态的变量

function setup() {
  // 1. 创建画布
  createCanvas(640, 480);

  // 2. 开启摄像头视频采集 (任务 2 核心)
  myVideo = createCapture(VIDEO);
  myVideo.size(640, 480);
  myVideo.hide(); // 隐藏浏览器自带的、画布外的原生视频标签

  // 3. 创建界面元素 (任务 3 核心：至少3个元素)
  
  // 元素①：创建滑块 (最小值 0, 最大值 255, 默认初始值 100)
  // 用来控制覆盖在视频上的白光透明度，从而调节亮度
  createP('调节亮度：'); // 创建一个文本标签
  mySlider = createSlider(0, 255, 0);

  // 元素②：创建按钮 (点击切换滤镜)
  createP('切换滤镜：'); 
  myButton = createButton('点击切换滤镜效果');
  myButton.mousePressed(changeFilter); // 当按钮被点击时，执行 changeFilter 函数

  // 元素③：创建文本输入框
  createP('在画面上写字：');
  myInput = createInput('在这里输入文字...');
}

function draw() {
  background(255);

  // A. 将摄像头的实时画面画在画布上
  image(myVideo, 0, 0, width, height);

  // B. 根据按钮状态应用 p5.js 内置滤镜
  if (filterType === 'GRAY') {
    filter(GRAY);  // 变成黑白滤镜
  } else if (filterType === 'INVERT') {
    filter(INVERT); // 变成反色（底片）滤镜
  } else if (filterType === 'THRESHOLD') {
    filter(THRESHOLD); // 高对比度黑白
  }
  // 如果是 'NORMAL' 则什么滤镜都不加

  // C. 使用滑块的值调节亮度
  // 原理：在画面上叠加一层半透明的白色（滑块值越大，白色越浓，画面看起来越亮）
  let brightnessVal = mySlider.value();
  fill(255, brightnessVal); 
  noStroke();
  rect(0, 0, width, height);

  // D. 获取输入框的文字并画在视频画面上
  let userText = myInput.value();
  fill(255, 0, 0);       // 文字颜色设为红色，确保显眼
  textSize(32);          // 文字大小
  textAlign(CENTER, CENTER);
  text(userText, width / 2, height - 50); // 把字画在画面底部中央
}

// 按钮点击后触发的自定义函数
function changeFilter() {
  if (filterType === 'NORMAL') {
    filterType = 'GRAY';
  } else if (filterType === 'GRAY') {
    filterType = 'INVERT';
  } else if (filterType === 'INVERT') {
    filterType = 'THRESHOLD';
  } else {
    filterType = 'NORMAL';
  }
}