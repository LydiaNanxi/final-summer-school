let bgImg, vImg, uiImg;
let angle = 0;

function setup() {
  createCanvas(1000, 600);
  imageMode(CENTER); // 居中模式

 
  bgImg = loadImage('../assets/bg.jpg');
  vImg = loadImage('../assets/v.jpg');
  uiImg = loadImage('../assets/ui.jpg');
}

function draw() {
  // 💡 安全检查：确保图片在浏览器中被真正解析出来（宽度大于0）
  if (bgImg && bgImg.width > 0 && vImg && vImg.width > 0 && uiImg && uiImg.width > 0) {
    
    // ==================== 完美的纯图片海报逻辑 ====================

    // 1. 绘制背景图
    image(bgImg, width / 2, height / 2, width, height);
    
    // 2. 绘制会旋转的 UI 元件
    push();
    translate(width / 2 + 150, height / 2 - 100); // 移动到画面右上方旋转
    rotate(angle);
    image(uiImg, 0, 0, 180, 180); // 绘制手部UI图
    angle += 0.02; 
    pop();
    
    // 3. 绘制主角 V (带有鼠标视差跟随)
    let vX = width / 2 + (mouseX - width / 2) * 0.05;
    let vY = height / 2 + (mouseY - height / 2) * 0.05;
    
    // 如果键盘被按下，触发故障抖动与霓虹黄滤镜
    if (keyIsPressed) {
      vX += random(-5, 5); 
      
      // 闪烁亮黄色滤镜（赛博朋克经典视觉错乱）
      if (frameCount % 4 < 2) {
        push();
        fill(255, 237, 0, 100);
        rectMode(CORNER);
        rect(0, 0, width, height);
        pop();
      }
    }
    
    // 绘制赛博朋克主角（调整至合适画布的比例大小）
    image(vImg, vX - 100, vY + 50, 300, 500);

  } else {
    // 图片还没进内存时，显示全英文的黑客风格加载提示
    background(10, 10, 20);
    fill(0, 255, 204); // 霓虹青色文字
    textAlign(CENTER, CENTER);
    textSize(22);
    text("DECRYPTING CYBERPUNK ASSETS...", width / 2, height / 2);
  }
}