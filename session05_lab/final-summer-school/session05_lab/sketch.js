let video;

let facemesh;
let handpose;

let faceResults = [];
let handResults = [];

let score = 0;
let energy = 100;
let maxEnergy = 100;

let gameState = "play"; // play / over


function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 👁️ FaceMesh
  facemesh = ml5.facemesh(video, () => {
    console.log("FaceMesh ready");
  });

  facemesh.on("face", results => {
    faceResults = results;
  });

  // ✋ HandPose
  handpose = ml5.handpose(video, () => {
    console.log("HandPose ready");
  });

  handpose.on("hand", results => {
    handResults = results;
  });
}

function getHand() {
  return handResults.length > 0 ? handResults[0] : null;
}

function getFacePoint(i) {
  if (faceResults.length > 0) {
    return faceResults[0].scaledMesh[i];
  }
  return null;
}

function isMouthOpen() {
  let top = getFacePoint(13);
  let bottom = getFacePoint(14);

  if (!top || !bottom) return false;

  return dist(top[0], top[1], bottom[0], bottom[1]) > 15;
}

function isHandOpen(hand) {
  if (!hand) return false;

  let thumb = hand.annotations.thumb[3];
  let pinky = hand.annotations.pinky[3];

  return dist(thumb[0], thumb[1], pinky[0], pinky[1]) > 120;
}

function isFist(hand) {
  if (!hand) return false;

  let index = hand.annotations.indexFinger[3];
  let wrist = hand.landmarks[0];

  return dist(index[0], index[1], wrist[0], wrist[1]) < 60;
}

function updateGame(hand,mouth){

    if(gameState!="play") return;

    energy-=0.3;

    if(hand && isHandOpen(hand)){
        energy+=1.5;
    }

    if(hand && isFist(hand)){
        score+=2;
    }

    if(mouth){
        score+=5;
        energy-=2;
    }

    checkAttack(hand);

    energy=constrain(energy,0,maxEnergy);

    if(energy<=0){
        gameState="over";
    }

}

  

function drawEnergyBar() {
  let w = map(energy, 0, maxEnergy, 0, 200);

  fill(50);
  rect(20, 20, 200, 20);

  fill(0, 255, 100);
  rect(20, 20, w, 20);

  fill(255);
  text("ENERGY", 20, 15);
}

function drawScore() {
  fill(255);
  text("SCORE: " + score, 20, 70);
}

function drawAlienFace() {
  let nose = getFacePoint(1);
  if (!nose) return;

  fill(3,105,40);
  noStroke();
  circle(nose[0], nose[1], 15);

  stroke(3,105,40);
  line(nose[0], nose[1], nose[0], nose[1] + 60);
}

function drawWarpFace() {

  if (faceResults.length == 0) return;

  let mesh = faceResults[0].scaledMesh;

  stroke(3,105,40);
  strokeWeight(2);
  noFill();

  beginShape();

  for(let i=0;i<mesh.length;i++){

    let x=mesh[i][0];
    let y=mesh[i][1];

    // 根据鼻子的距离产生变形
    let nose = mesh[1];

    let d = dist(x,y,nose[0],nose[1]);

    let angle = atan2(y-nose[1],x-nose[0]);

    let strength = map(d,0,180,40,0,true);

    x += cos(angle)*strength;
    y += sin(angle)*strength;

    vertex(x,y);
    fill(3,105,40);

    noStroke();

    circle(x,y,4);
  }

  endShape();
}


function drawGameOver() {
  if (gameState !== "over") return;

  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  fill(255, 0, 0);
  textSize(40);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);

  textSize(20);
  text("Final Score: " + score, width / 2, height / 2 + 40);
}



function spawnEnemy() {

  enemies.push({

    x: random(width),
    y: random(height),

    vx: random(-2,2),
    vy: random(-2,2),

    r: random(20,35),

    angle: random(TWO_PI),
    rotateSpeed: random(-0.05,0.05),

    alive:true

  });

}

function updateEnemies(){

  for(let e of enemies){

    if(!e.alive) continue;

    e.x += e.vx;
    e.y += e.vy;

    e.angle += e.rotateSpeed;

    // 撞墙反弹
    if(e.x < e.r || e.x > width-e.r){
      e.vx *= -1;
    }

    if(e.y < e.r || e.y > height-e.r){
      e.vy *= -1;
    }

  }

}

setInterval(() => {
  spawnEnemy();
}, 20000);

let enemies = [];
function drawEnemies(){

  for(let e of enemies){

    if(!e.alive) continue;

    push();

    translate(e.x,e.y);

    rotate(e.angle);

    // 发光
    noStroke();

    fill(0,255,255,50);
    ellipse(0,0,e.r*3);

    fill(0,255,255);
    ellipse(0,0,e.r*2);

    // 眼睛
    fill(255);

    ellipse(-6,-3,5);

    ellipse(6,-3,5);

    fill(0);

    ellipse(-6,-3,2);

    ellipse(6,-3,2);

    // 触手
    stroke(0,255,255);

    line(-e.r,0,-e.r-8,10);

    line(e.r,0,e.r+8,10);

    line(0,e.r,0,e.r+10);

    pop();

  }

}

let bullets = [];
function shootBullet(hand){

  let finger = getIndexFinger(hand);

  if(!finger) return;

  bullets.push({

    x:finger[0],
    y:finger[1],

    r:10

  });

}

function getIndexFinger(hand) {
  if (!hand) return null;
  return hand.annotations.indexFinger[3]; // 指尖
}

function checkAttack(hand) {
  if (!hand) return;

  if (!isFist(hand)) return;

  let finger = getIndexFinger(hand);
  if (!finger) return;

  for (let e of enemies) {
    if (!e.alive) continue;

    let d = dist(finger[0], finger[1], e.x, e.y);

    if (d < e.r + 20) {
      // 💀 击中
      e.alive = false;

      // 🧮 加分
      shootBullet(hand);

      // ✨ 特效
      spawnEffect(e.x, e.y);
    }
  }
}

let effects = [];

function spawnEffect(x,y){

  effects.push({

    x:x,

    y:y,

    life:40,

    text:"+10"

  });

}

function drawEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    let f = effects[i];

   fill(255,60,0);

   textSize(20);

   text(f.text,f.x,f.y);

   f.y-=1;

   circle(f.x,f.y,40-f.life/2);
    if (f.life <= 0) {
      effects.splice(i, 1);
    }
  }
}

function updateBullets(){

  for(let b of bullets){

    b.y-=8;

    for(let e of enemies){

      if(!e.alive) continue;

      let d=dist(b.x,b.y,e.x,e.y);

      if(d<e.r){

        e.alive=false;

        score+=10;

        spawnEffect(e.x,e.y);

        b.dead=true;

      }

    }

  }

  bullets=bullets.filter(b=>!b.dead&&b.y>-20);

}

function drawBullets(){

  for(let b of bullets){

    fill(0,255,255);

    noStroke();

    circle(b.x,b.y,15);

  }

}

function drawScore() {
  fill(255);
  textSize(24);
  text("SCORE: " + score, 20, 40);
}

function draw(){

  image(video,0,0,width,height);

  let hand=getHand();
  let mouth=isMouthOpen();

  updateGame(hand,mouth);

  // 每2秒生成一个敌人
  if(frameCount%120==0){
      spawnEnemy();
  }

  updateEnemies();
  updateBullets();

  drawWarpFace();
  drawAlienFace();

  drawEnemies();
  drawBullets();
  drawEffects();

  drawEnergyBar();
  drawScore();
  drawGameOver();

}