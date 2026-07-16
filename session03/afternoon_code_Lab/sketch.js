// 全局变量存地铁线路数据
let tubeData = [];

function setup() {
    createCanvas(800, 600);
    // 只填你Profile里的Primary key，删掉appId
    const apiKey = '1ea92680c0f459298b43b125271930a';

    // 请求所有地铁线路基础信息
    fetch(`https://api.tfl.gov.uk/Line/Mode/tube`)
        .then(response => response.json())
        .then(data => {
            // 把接口数据存入全局变量，供draw绘图
            tubeData = data;
            console.log('STATUS', data);
        });

    // 开启线条发光，提升画面质感（美学加分）
    drawingContext.shadowBlur = 12;
    drawingContext.shadowColor = color(100, 180, 255);
}

function draw() {
    background(8, 12, 28); // 深色高级底色，替换原来浅灰220
    noFill();

    // 如果数据还没加载完，直接跳过绘图
    if (tubeData.length === 0) return;
    let lineCount = tubeData.length;

    // 鼠标控制流动快慢
    let flowSpeed = map(mouseX, 0, width, 0.2, 3);
    let lineGap = height / tubeData.length;

    for (let i = 0; i < lineCount; i++) {
    let lineData = tubeData[i];

    // 容错修复拥堵数据报错
    let congestion = 10;
    if(lineData.lineStatuses && lineData.lineStatuses.length > 0){
        congestion = lineData.lineStatuses[0].statusSeverity;
    }

    // 线路间粗细差距拉大
    let railWeight = map(congestion, 0, 10, 14, 1);
    let lineColor = getTubeLineColor(i);
    stroke(lineColor);
    drawingContext.shadowColor = lineColor;

    let offset = frameCount * flowSpeed;

    // 分段绘制波浪，单条线内部粗细起伏
    for (let x = -100; x < width + 100; x += 8) {
        let y1 = getTubeLineY(i, x, offset);
        let y2 = getTubeLineY(i, x+8, offset);

        let segmentNoise = sin(x * 0.012 + i * 2 + frameCount * 0.008);
        let dynamicWeight = map(segmentNoise, -1, 1, railWeight * 0.4, railWeight * 3);
        strokeWeight(dynamicWeight);
        drawingContext.shadowBlur = map(dynamicWeight, 1, 14, 4, 25);
        line(x, y1, x+8, y2);
    }

    // 流动列车光点，大小同步起伏
    fill(255, 220);
    noStroke();
    for (let dotX = -100; dotX < width + 100; dotX += 140) {
        let posX = dotX + offset * 1.5;
        let posY = getTubeLineY(i, posX, 0);
        let dotNoise = sin(posX * 0.012 + i * 2);
        let dotSize = map(dotNoise, -1, 1, railWeight * 0.6, railWeight * 2.2);
        circle(posX, posY, dotSize);
    }
    noFill();
}
}
// 给每条地铁线分配不同颜色
function getTubeLineColor(index) {
    let colors = [
        color(220, 30, 60),    // 红
        color(0, 150, 220),    // 蓝
        color(80, 180, 80),    // 绿
        color(255, 180, 0),    // 橙
        color(160, 80, 160),   // 紫
        color(255, 255, 255),  // 白
        color(100, 100, 100),  // 灰
        color(0, 100, 180),    // 深蓝
        color(230, 120, 130),  // 浅红
        color(120, 200, 255),  // 浅蓝
        color(180, 220, 180),  // 浅绿
        color(255, 220, 100)   // 黄
    ];
    return colors[index % colors.length];
}

// 计算波浪穿插线路的Y坐标
function getTubeLineY(index, x, offset) {
    let lineCount = tubeData.length;
    let baseY = map(index, 0, lineCount, 100, height - 100);
    let amplitude = 90 + (index % 3) * 40;
    let frequency = 0.006 + (index % 4) * 0.002;
    let phase = index * PI / 3;
    let wave = sin((x + offset) * frequency + phase) * amplitude;
    return baseY + wave;
}
