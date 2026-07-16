let canvasW = 700;
let canvasH = 700;

let spacing = 12;

function setup() {
  createCanvas(canvasW, canvasH);
  angleMode(DEGREES);
  noLoop();
  noStroke();
}

function draw() {

  //--------------------
  // 背景
  //--------------------
  background(20,45,120);

  fill(150,150,220);
  rect(0,520,width,180);

 

//=========================
// 向日葵
//=========================
function sunflower(cx,cy,r){

  //--------------------
  // 花瓣
  //--------------------
  for(let x=cx-r;x<=cx+r;x+=spacing){

    for(let y=cy-r;y<=cy+r;y+=spacing){

      let d=dist(x,y,cx,cy);

      if(d<r && d>r*0.35){

        push();

        translate(x,y);

        rotate(random([0,30,60,90,120,150,180,210,240,270,300,330]));

        fill(
          random([245,250,255]),
          random([170,190,210]),
          random([20,40,60])
        );

        triangle(
          0,-9,
          -6,9,
          6,9
        );

        pop();

      }
    }
  }

  //--------------------
  // 花心
  //--------------------
  for(let x=cx-r*0.4;x<=cx+r*0.4;x+=8){

    for(let y=cy-r*0.4;y<=cy+r*0.4;y+=8){

      let d=dist(x,y,cx,cy);

      if(d<r*0.38){

        push();

        translate(x,y);

        rotate(random([0,45,90,135]));

        fill(
          random([100,120,130]),
          random([60,70,80]),
          random([20,30,40])
        );

        triangle(
          0,-5,
          -4,4,
          4,4
        );

        pop();

      }
    }
  }

  //--------------------
  // 花茎
  //--------------------
  fill(70,120,60);

  rect(cx-4,cy+r*0.35,8,190);

}

//--------------------
  // 三朵花
  //--------------------
  sunflower(350,180,95);
  sunflower(260,290,80);
  sunflower(430,310,70);


 // 花瓶瓶口（倒梯形）
//====================
fill(160, 195, 150);

quad(
290, 400,   // 左上
405, 400,   // 右上
370, 450,   // 右下（缩进去）
330, 450    // 左下（缩进去）
);

//====================
// 花瓶主体（梯形）
//====================
fill(125,170,120);

quad(
235,450,   // 左上
465,450,   // 右上
400,630,   // 右下（收一点）
300,630    // 左下（收一点）
);
  
}


