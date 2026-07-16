let ants = []; 
let maxAnts = 6;
let mode = 'BRUSH'; // 当前模式：'BRUSH' (画笔) 或 'SPRAY' (杀虫剂)
let pesticideBtn, brushBtn; // 按钮变量
let cleanTimer = 0; // 计时器：计算屏幕变白了多久
let reviveTimer = 0; // 计时器：控制3秒后虫子复活
let totalCleanTime = 60; // 喷白后需要保持的帧数

function setup() {
  createCanvas(600, 600);
  background(255);

  // 初始化：让6只蚂蚁散布在四面八方
  for (let i = 0; i < maxAnts; i++) {
    ants.push(new Ant(i));
  }

  // 创建 UI 按钮
  pesticideBtn = createButton('pesticide');
  pesticideBtn.position(width + 10, 20); 
  pesticideBtn.mousePressed(switchToSprayMode);
  
  brushBtn = createButton('brush');
  brushBtn.position(width + 10, 60);
  brushBtn.mousePressed(switchToBrushMode);
}

function draw() {
  // 1. 根据模式判断鼠标按下的互动
  if (mouseIsPressed && mode === 'BRUSH') {
    // 画笔模式：画黑线
    stroke('orange');
    strokeWeight(4);
    line(mouseX, mouseY, pmouseX, pmouseY);
  } else if (mouseIsPressed && mode === 'SPRAY') {
    // 杀虫剂模式：喷雾状白色画笔
    sprayPesticide();
    
    // 如果虫子全死光了，开始计算喷白页面的时间
    if (ants.length === 0) {
      cleanTimer++;
      if (cleanTimer >= totalCleanTime) {
        resetScreenToWhite();
      }
    }
  }

  // 2. 蚂蚁的死活与运动逻辑
  if (mode === 'SPRAY') {
    // 如果是杀虫剂模式，检测虫子有没有被喷死
    checkPesticideCollisions();
  } else {
    // 如果是画笔模式，蚂蚁正常朝鼠标爬行
    for (let i = 0; i < ants.length; i++) {
      ants[i].update();
    }
  }

  // 3. 3秒后虫子重新复活出来的逻辑
  if (reviveTimer > 0) {
    reviveTimer--;
    if (reviveTimer === 0) {
      ants = [];
      for (let i = 0; i < maxAnts; i++) {
        ants.push(new Ant(i));
      }
    }
  }

  // 4. 渲染所有活着的蚂蚁
  for (let i = 0; i < ants.length; i++) {
    ants[i].display();
  }
}

// 杀虫剂喷雾效果（白色散落粒子）
function sprayPesticide() {
  for (let i = 0; i < 20; i++) {
    let xOff = randomGaussian() * 30;
    let yOff = randomGaussian() * 30;
    noStroke();
    fill(255, 30); // 半透明白，多喷几下就变纯白了
    ellipse(mouseX + xOff, mouseY + yOff, random(10, 30), random(10, 30));
  }
}

// 检查蚂蚁是否被杀虫剂碰到
function checkPesticideCollisions() {
  for (let i = ants.length - 1; i >= 0; i--) {
    let d = dist(ants[i].x, ants[i].y, mouseX, mouseY);
    // 如果蚂蚁靠近喷雾中心，就被消灭
    if (d < 35 && mouseIsPressed) {
      ants.splice(i, 1); // 从数组中移除这只蚂蚁
    }
  }
}

// 变回纯白画布，并开启3秒复活倒计时
function resetScreenToWhite() {
  background(255);
  cleanTimer = 0; 
  reviveTimer = 180; // 180帧大约就是3秒（在60fps下）
  mode = 'BRUSH'; // 自动切回画笔模式
}

// 按钮切换函数
function switchToSprayMode() { mode = 'SPRAY'; }
function switchToBrushMode() { mode = 'BRUSH'; cleanTimer = 0; }

function doubleClicked() {
  background(255);
  reviveTimer = 0; 
}

// ==========================================
// 🐜 核心：大蚂蚁类 (Ant Class)
// ==========================================
class Ant {
  constructor(index) {
    // 强制让6只蚂蚁均匀分布在画布四周
    if (index % 4 === 0) { this.x = random(width); this.y = 0; }         
    else if (index % 4 === 1) { this.x = random(width); this.y = height; } 
    else if (index % 4 === 2) { this.x = 0; this.y = random(height); }     
    else { this.x = width; this.y = random(height); }                     
    
    this.speed = random(1.5, 2.5); 
    this.personalAngle = (TWO_PI / maxAnts) * index; 
  }

  update() {
    let targetX = mouseX;
    let targetY = mouseY;
    let d = dist(this.x, this.y, mouseX, mouseY);

    // 靠近鼠标时优雅包围
    if (d < 35) {
      targetX = mouseX + cos(this.personalAngle) * 25;
      targetY = mouseY + sin(this.personalAngle) * 25;
    }

    let moveAngle = atan2(targetY - this.y, targetX - this.x);
    
    if (dist(this.x, this.y, targetX, targetY) > 2) {
      this.x += cos(moveAngle) * this.speed;
      this.y += sin(moveAngle) * this.speed;
    }
  }

  display() {
    // 擦除残影
    noStroke();
    fill(255, 40); 
    ellipse(this.x, this.y, 45, 45);

    // 绘制清晰的大蚂蚁
    push();
    translate(this.x, this.y); 
    let lookAtMouseAngle = atan2(mouseY - this.y, mouseX - this.x);
    rotate(lookAtMouseAngle); 

    fill(30); 
    
    // 6条腿
    stroke(30);
    strokeWeight(1.5);
    line(0, 0, 8, -12); line(0, 0, 8, 12);
    line(-4, 0, -4, -14); line(-4, 0, -4, 14);
    line(-8, 0, -14, -12); line(-8, 0, -14, 12);

    // 身体三节
    noStroke();
    ellipse(-10, 0, 14, 10); // 后腹
    ellipse(-2, 0, 8, 7);    // 胸
    ellipse(6, 0, 7, 7);     // 头
    
    // 触角
    stroke(30);
    strokeWeight(1);
    noFill();
    bezier(6, 0, 10, -4, 12, -6, 14, -4); 
    bezier(6, 0, 10, 4, 12, 6, 14, 4);   

    pop();
  }
}