// function setup() {
//   createCanvas(400, 400);
// }

// function draw() {
//   background(220);
// }

let CIRCLE_COUNT = 5
let EYE_COUNT = 5

let currentLang = "ja";  // 初期言語
const colors = ['#e50012FF', '#0068B6FF', '#33a532FF', '#f5b400FF'];

const translations = {
  ja: {
    start: "スタート",
    stop: "ストップ",
    back: "戻る",
    retry: "リトライ",
    addCells: "細胞をおく",
    addEyes: "目をつける",
    transparent: "透過",
    saveImage: "画像保存",
    complete:    "みてみる", 
    cell: "細胞",  
    eye: "目玉",  
    createPrompt: "キャンバスをタッチしてミャクミャクをつくってみよう！",
    what: "「ミャクミャク」は公益社団法人2025年日本国際博覧会協会のキャラクターです。\nミャクミャクの著作権などの権利はすべて権利者に帰属します。",
    rule: "【ルール】\n・色や形はランダムで表示されます。\n・個人利用の範囲でお楽しみください。",
    language: "言語"
  },
  en: {
    start: "Start",
    stop: "Stop",
    back: "Back",
    retry: "Retry",
    addCells: "Add Cell",
    addEyes: "Add Eyes",
    transparent: "Transparent",
    saveImage: "Save Image",
    complete:  "Check it out",
    cell: "Cells",
    eye: "Eyes",    
    createPrompt: "Touch the canvas and try making your own MYAKU-MYAKU!",
    what: " “Myakumyaku” is a registered character of the Japan Association for the 2025 World Exposition.\nAll rights, including copyright, of MYAKU-MYAKU belong to the respective rights holder.",
    rule: "【Rules】\n・Colors and shapes appear randomly.\n・Please enjoy within the scope of personal use.",
    language: "Language"
  },
  zh: {
    start: "开始",
    stop: "停止",
    back: "返回",
    retry: "重试",
    addCells: "添加细胞",
    addEyes: "添加眼睛",
    transparent: "透明",
    saveImage: "保存图片",
    complete:    "看一下",
    cell: "细胞",  
    eye: "眼睛",  
    createPrompt: "点击画布，试着创造一个属于你的MYAKU-MYAKU吧！",
    what: "MYAKU-MYAKU”是2025年日本国际博览会协会的注册角色。\nMYAKU-MYAKU的著作权等所有权利归原权利人所有。",
    rule: "【规则】\n・颜色和形状会随机出现。\n・请仅限于个人使用范围内使用和享受。",
    language: "语言"
  },
  ko: {
    start: "시작",
    stop: "정지",
    back: "뒤로가기",
    retry: "다시 시도",
    addCells: "세포 붙이기",
    addEyes: "눈 붙이기",
    transparent: "투명",
    saveImage: "이미지 저장",
    complete:    "보기",
    cell: "세포",  
    eye: "눈",  
    createPrompt: "캔버스를 터치해서 나만의 MYAKU-MYAKU를 만들어보세요!",
    what: " “MYAKU-MYAKU”는 2025 일본국제박람회협회의 등록 캐릭터입니다.\nMYAKU-MYAKU의 저작권 등 모든 권리는 원 저작권자에게 있습니다.",
    rule: "【규칙】\n・색상과 모양은 무작위로 나타납니다.\n・개인적인 이용 범위 내에서 즐겨주세요.",
    language: "언어"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations(currentLang);  // ページが読み込まれたら翻訳を適用
});


// 列挙値を Symbol で定義（変更不可にするため freeze）
const Scene = Object.freeze({
  CELL: Symbol("AddCell"),
  EYES: Symbol("AddEyes"),
  COMP: Symbol("Complete")
});
let currentScene = Scene.CELL;

let cells = [];
let eyes = [];

class FacePart {
  constructor(i, faceColor) {

    // 楕円かどうかを確率で決定 
    let isEllipse = random() <  0.3 //(2 / CIRCLE_COUNT);

    // シェイプのサイズ設定

    let w = random(95, 100);
    if (random() < 0.5) {
      w = random(60, 70);
    }
    let h = isEllipse ? random(40, 59) : w; // 楕円なら高さを別に、円なら正円
    this.index = i
    this.shape = {
      faceColor: faceColor,
      centerX: random(180, 220),
      centerY: random(180, 220),
      radiusX: random(130, 140),
      radiusY: random(120, 130),
      angle: TWO_PI / CIRCLE_COUNT * this.index , // random(TWO_PI),
      speed: random(0.02, 0.02),
      width: w,
      height: h,
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05),
      stoped: false
      //color: color(random(255), random(255), random(255))
    };
  }

  update() {

    // まだ固定されていないならば動かす
    if (this.shape.stoped == false) {
      this.shape.angle += this.shape.speed;
      this.shape.rotation += this.shape.rotationSpeed;
    }
  }

  draw() {
    
    // シェイプをを座標に配置
    let x = this.shape.centerX + cos(this.shape.angle) * this.shape.radiusX;
    let y = this.shape.centerY + sin(this.shape.angle) * this.shape.radiusY;

    push();
    translate(x, y);       // 原点をシェイプの中心へ
    rotate(this.shape.rotation); // シェイプ自体を回転
    fill(this.shape.faceColor);
    noStroke();
    ellipse(0, 0, this.shape.width, this.shape.height); // 原点に描画
    pop();
  }
}

class EyePart {
  constructor(i, color) {

    this.index = i
    this.shape = {
      color: color,
      centerX: random(170, 230),
      centerY: random(170, 230),
      radius: random(130, 135),
      angle: random(TWO_PI),
      speed: random(0.02, 0.02),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05),
      size: random(20, 40),
      stoped: false
    };
  }

  update() {

    // まだ固定されていないならば動かす
    if (this.shape.stoped == false) {
      this.shape.angle += this.shape.speed;
      this.shape.rotation += this.shape.rotationSpeed;
    }

  }

  draw() {
    let eye = this.shape
    // シェイプをを座標に配置
    let x = eye.centerX + cos(eye.angle) * eye.radius;
    let y = eye.centerY + sin(eye.angle) * eye.radius;

    push();
    translate(x, y);
    rotate(eye.rotation);
    noStroke();

    // 白目
    fill(255);
    ellipse(0, 0, eye.size, eye.size);

    // 黒目（中心）
    fill(eye.color);
    //ellipse(eye.size / 4, 0, eye.size / 2, eye.size / 2);
    ellipse(eye.size / 4, 0, eye.size / 2.2, eye.size / 2.2);
    pop();
  }
}
