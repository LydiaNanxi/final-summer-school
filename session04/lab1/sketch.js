// Lab1 Cyberpunk Collage 防黑屏修复版
let charImg, cityBg, handImg;
let handY = 0;
let scaleFactor = 1;
let loadCount = 0; // 统计成功加载的图片数量

function preload() {
  // 加载每张图，加载成功计数+1
  cityBg = loadImage("city.jpg", ()=>{ loadCount++; console.log("城市背景加载成功"); });
  charImg = loadImage("character.jpg", ()=>{ loadCount++; console.log("人物图加载成功"); });
  handImg = loadImage("cyberhand.jpg", ()=>{ loadCount++; console.log("机械手加载成功"); });
}

function setup() {
  createCanvas(900, 1200);
  imageMode(CENTER);
}

function draw() {
  // 底层先铺赛博朋克深紫底色，就算图没加载也不会纯黑
  background(10, 0, 20);

  push();
  scale(scaleFactor);

  // 全部3张图加载完成后才渲染拼贴
  if(loadCount === 3){
    // 1. 底层城市背景铺满画布
    image(cityBg, width/2, height/2, width, height);

    // 2. 中间人物，鼠标左右拖动偏移
    let shiftX = map(mouseX, 0, width, -180, 180);
    image(charImg, width/2 + shiftX, height/2, 600, 900);

    // 3. 上层机械手浮动动画
    handY = sin(frameCount * 0.02) * 80;
    image(handImg, width * 0.72, height/2 + handY, 420, 700);
  }else{
    // 图片未加载完成时，显示加载文字提示
    fill(255, 0, 220);
    textSize(28);
    textAlign(CENTER);
    text("素材加载中...", width/2, height/2);
    textSize(16);
    text(`已加载 ${loadCount}/3 张图片`, width/2, height/2 + 40);
  }

  pop();

  // 底部交互说明
  fill(255, 0, 200);
  textSize(16);
  textAlign(LEFT);
  text("鼠标左右移动切换人物位置 | 滚轮缩放画面", 30, height - 30);
}

// 滚轮缩放
function mouseWheel(event) {
  scaleFactor += event.delta * -0.001;
  scaleFactor = constrain(scaleFactor, 0.4, 1.6);
}