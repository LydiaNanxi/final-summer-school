function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(220);
  drawBear(250, 260);
}

function drawBear(centreX, centreY){
  noStroke();
  // 深棕皮毛
  fill(130, 85, 40);
  // 身体大圆
  circle(centreX, centreY, 130);
  // 头部
  circle(centreX, centreY - 110, 100);

  // 手臂椭圆
  ellipse(centreX - 90, centreY - 30, 60, 35);
  ellipse(centreX + 90, centreY - 30, 60, 35);

  // 左腿
  push();
  translate(centreX - 55, centreY + 75); // 移动到左腿中心
  rotate(0.3); // 逆时针转，往左撇
  ellipse(0, 0, 40, 60);
  pop();

  // 右腿
  push();
  translate(centreX + 55, centreY + 75); // 移动到右腿中心
  rotate(-0.3); // 顺时针转，往右撇
  ellipse(0, 0, 40, 60);
  pop();
  // ===============================================

  // 耳朵（盖在头上，有遮挡）
  circle(centreX - 45, centreY - 160, 40);
  circle(centreX + 45, centreY - 160, 40);

  // 浅棕内耳、手心
  fill(170, 120, 70);
  circle(centreX - 45, centreY - 160, 22);
  circle(centreX + 45, centreY - 160, 22);
  ellipse(centreX - 105, centreY - 30, 16, 20);
  ellipse(centreX + 105, centreY - 30, 16, 20);

  // 旋转后腿的浅棕色脚心（同步旋转）
  fill(170, 120, 70);
  push();
  translate(centreX - 60, centreY + 85);
  rotate(0.3);
  ellipse(0, 0, 18, 28);
  pop();

  push();
  translate(centreX + 60, centreY + 85);
  rotate(-0.3);
  ellipse(0, 0, 18, 28);
  pop();

  // 脸部口鼻
  fill(210, 170, 130);
  circle(centreX, centreY - 90, 60);

  // 眼睛
  fill(30, 20, 10);
  circle(centreX - 28, centreY - 115, 14);
  circle(centreX + 28, centreY - 115, 14);

  // 鼻子
  fill(90, 55, 25);
  circle(centreX, centreY - 85, 16);
}