// 视频素材
let videoIdle;
let actionVideos = [];
const videoNames = [
  "assets/action_left.mp4",
  "assets/action_right.mp4",
  "assets/action_up.mp4",
  "assets/action_down.mp4",
  "assets/action_leftUp.mp4",
  "assets/action_rightUp.mp4",
  "assets/action_leftDown.mp4",
  "assets/action_rightDown.mp4"
];

// 手势识别
let handsModel;
let cam;
let camDom;
let currentVideo;
let currentState = "idle";
let coolDown = 0;
let modelReady = false;

function preload() {
  // 加载待机视频
  videoIdle = createVideo("assets/idle.mp4");
  videoIdle.volume(0);
  videoIdle.hide();

  // 批量加载8段动作视频
  for (let i = 0; i < videoNames.length; i++) {
    let v = createVideo(videoNames[i]);
    v.volume(0);
    v.hide();
    actionVideos.push(v);
  }
}

async function setupHandModel() {
  handsModel = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  handsModel.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });
  handsModel.onResults(onHandResult);
  // 关键：等待模型初始化完成
  await handsModel.initialize();
  modelReady = true;
  setTimeout(sendFrameToModel, 500);
}

// setup 里改为异步调用
async function setup() {
  createCanvas(windowWidth, windowHeight);
  switchToIdle();

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  camDom = document.getElementById("camBox");
  camDom.appendChild(cam.elt);

  // 异步初始化模型
  await setupHandModel();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  switchToIdle();

  // 创建隐藏摄像头
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  camDom = document.getElementById("camBox");
  camDom.appendChild(cam.elt);

  // 初始化手部模型
  handsModel = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  handsModel.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });
  handsModel.onResults(onHandResult);
  modelReady = true;

  // 延迟启动帧推送，避免DOM未加载报错
  setTimeout(sendFrameToModel, 500);
}

function draw() {
  background(242, 240, 235);
  if(currentVideo) image(currentVideo, 0, 0, width, height);
  if (coolDown > 0) coolDown--;

  // 仅待机状态显示英文提示文字
  if(currentState === "idle"){
    fill(0,0,0,180); // 半透明黑色文字
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Tilt your palm in 8 directions: Up/Down/Left/Right/Top-left/Bottom-left/Top-right/Bottom-right to trigger different Tai Chi animations", width/2, height - 100, width - 400);
  }
}

// 循环持续推送摄像头画面
async function sendFrameToModel() {
  if (!cam?.elt || !modelReady) {
    setTimeout(sendFrameToModel, 100);
    return;
  }
  try {
    await handsModel.send({ image: cam.elt });
  } catch (e) {
    // 捕获识别报错，不中断程序
  }
  setTimeout(sendFrameToModel, 30);
}

// 手势检测回调：识别【手指指尖指向】而非掌心
function onHandResult(results) {
  // 无手 / 正在播放动作视频 直接返回
  if (!results.multiHandLandmarks.length || currentState === "action") return;
  let hand = results.multiHandLandmarks[0];

  // 关键点：0=手掌根部，12=中指指尖（代表手指指向）
  const wrist = hand[0];
  const middleTip = hand[12];

  // 向量：从手掌根指向中指指尖 = 手指朝向
  let dx = middleTip.x - wrist.x;
  let dy = middleTip.y - wrist.y;

  // 向量过短判定为握拳，忽略不触发
  let dist = sqrt(dx * dx + dy * dy);
  if (dist < 0.12) return;

 let angle = atan2(dy, dx);
let idx = -1;

// 第一步：优先判断四个斜向（窄区间，先匹配防止被主方向拦截）
// 右上 中线-67.5°(-0.375π) 边界 -0.5π ~ -0.25π
if (angle > -PI*0.5 && angle < -PI*0.25) idx = 4;
// 右下 中线22.5°(0.125π) 边界 0 ~ 0.25π
else if (angle > 0 && angle < PI*0.25) idx = 6;
// 左上 中线-157.5°(-0.875π) 边界 -1.0π ~ -0.75π
else if (angle > -PI*1.0 && angle < -PI*0.75) idx = 5;
// 左下 中线112.5°(0.625π) 边界 0.5π ~ 0.75π
else if (angle > PI*0.5 && angle < PI*0.75) idx = 7;

// 第二步：判断上下主方向
// 上 中线-112.5°(-0.625π) 边界 -0.75π ~ -0.5π
else if (angle > -PI*0.75 && angle < -PI*0.5) idx = 2;
// 下 中线67.5°(0.375π) 边界 0.25π ~ 0.5π
else if (angle > PI*0.25 && angle < PI*0.5) idx = 3;

// 第三步：最后判断纯左右主方向（不覆盖斜向）
// 左 中线157.5°(0.875π) 边界 0.75π ~ 1.0π
else if (angle > PI*0.75 && angle < PI*1.0) idx = 1;
// 右 中线-22.5°(-0.125π) 边界 -0.25π ~ 0
else if (angle > -PI*0.25 && angle < 0) idx = 0;

if (idx >= 0) switchToAction(idx);
}

// 切待机视频
function switchToIdle() {
  if (currentVideo) currentVideo.pause();
  currentVideo = videoIdle;
  currentVideo.loop();
  currentState = "idle";
}

// 切换对应动作视频
function switchToAction(idx) {
  if (coolDown > 0 || currentState === "action") return;
  coolDown = 90; // 1.5秒冷却防连击

  if (currentVideo) currentVideo.pause();
  currentVideo = actionVideos[idx];
  currentVideo.play();
  currentState = "action";

  currentVideo.onended(() => {
    switchToIdle();
  });
}

// 窗口自适应
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}