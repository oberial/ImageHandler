<template>
  <div class="image_modual" v-show="showEdit">
    <div class="image_form">
      <div class="header">
        <span>更换头像</span>
        <button @click="showEdit = false" class="close">x</button>
      </div>

      <div class="content">
        <div id="container">
          <div id="imagecontent"></div>
          <div class="func" ref="func" @drop="handleDrag"></div>
          <div id="suo">
            <button @click="zoom > 0 ? zoom-- : (zoom = 0)">-</button>
            <input type="range" min="0" :max="zoomMax" v-model="zoom" />
            <button @click="zoom < zoomMax ? zoom++ : (zoom = zoomMax)">
              +
            </button>
          </div>
          <div id="imagelist"></div>
        </div>
      </div>
      <div class="bottom">
        <button
          @click="drag"
          class="button"
          :class="doingTh === 'drag' ? 'isChoose' : ''"
        >
          拖拽
        </button>
        <button
          @click="draw"
          class="button"
          :class="doingTh === 'draw' ? 'isChoose' : ''"
        >
          画图
        </button>
        <button
          @click="clip"
          class="button"
          :class="doingTh === 'clip' ? 'isChoose' : ''"
        >
          裁切
        </button>
        <button @click="download" class="button">下载</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { ref } from "vue";
let func = ref(null);
type ScaleInfo = {
  isWidthScale?: boolean;
  scaleBei: number;
};
type NS = number | string;
type DoingType = "drag" | "draw" | "clip" | "none";
// 操作类型
let doingTh = ref<DoingType>("none");
let props = defineProps({
  zoomMax: {
    type: Number,
    default: () => 9,
  },
});

// 原始图像
let img: any;
// 画布展示框大小及图像缩放参数
let docHeight: number;
let docWidth: number;
let scaleInfo: ScaleInfo;
let showEdit = ref(true);

// 实时画布对象、上下文及画布初始大小
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let baseCanvasHeight: number;
let baseCanvasWidth: number;

// 原始画布x y轴移动坐标值
let movingLenghtY: number = 0;
let movingLenghtX: number = 0;

// 鼠标点击画布偏移量坐标
let startPointX: number;
let startPointY: number;
// 鼠标松开画布偏移量坐标
let endPointX: number;
let endPointY: number;

// 画图圆形、半径及画布圆形缩放到截图栏缩放系数
let drawCenterX: number;
let drawCenterY: number;
let radius: number;
let scaleInfo2: ScaleInfo = { scaleBei: 1 };

let canvaslist = Array<HTMLCanvasElement>();

// 缩放指数 ，缩放等级，及缩放倍数
const zoomConst: number = 1.1;
let zoom = ref<number>(0);
let zoomBei = 1;

function drag() {
  doingTh.value = "drag";
}

function draw() {
  doingTh.value = "draw";
}

onMounted(() => {
  docWidth = document.getElementById("imagecontent")?.clientWidth as number;
  docHeight = document.getElementById("imagecontent")?.clientHeight as number;

  func.value.addEventListener("dragenter", (e: any) => {
    func.value.style.borderColor = "red";
    e.preventDefault();
  });
  func.value.addEventListener("dragleave", (e: any) => {
    func.value.style.borderColor = "white";
    e.preventDefault();
  });
  func.value.addEventListener("dragover", (e: any) => {
    e.preventDefault();
  });
});

function handleDrag(e: any) {
  const fileList = e.dataTransfer.files;
  handlefile(fileList);
  e.preventDefault();
}
function handlefile(file) {
  func.value.style.display = "none";
  console.log(file[0]);
  const blob = file[0].slice(1024 * 1024 * 1024, 1 * 1024 * 1024 * 1024);
  console.log(blob);
  let reader = new FileReader();
  reader.readAsDataURL(file[0]);
  // reader 读取文件成功的回调
  reader.onload = function (e) {
    console.log(this);
    fileAndBlobToCanvas(reader.result);
  };
}

function fileAndBlobToCanvas(fileDataURL: string) {
  if (canvas) {
    document.getElementById("imagecontent")?.removeChild(canvas);
  }
  let isPressed = false;
  img = new Image();
  img.src = fileDataURL;
  canvas = document.createElement("canvas");
  if (!canvas.getContext) {
    alert("浏览器不支持canvas");
    return;
  }
  ctx = canvas.getContext("2d");
  document.getElementById("imagecontent")?.appendChild(canvas);
  img.onload = function () {
    let wBei = img.width / docWidth;
    let hBei = img.height / docHeight;
    scaleInfo = {
      isWidthScale: wBei < hBei,
      scaleBei: wBei < hBei ? wBei : hBei,
    };
    baseCanvasHeight = canvas.height = img.height / scaleInfo.scaleBei;
    baseCanvasWidth = canvas.width = img.width / scaleInfo.scaleBei;
    console.log(JSON.stringify({ wBei, hBei }));
    ctx?.drawImage(
      img,
      (docWidth - baseCanvasWidth) / 2,
      (docHeight - baseCanvasHeight) / 2,
      img.width / scaleInfo.scaleBei,
      img.height / scaleInfo.scaleBei
    );
    ctx!.font = "10px serif";
    ctx!.fillText("Hello canvas", 50, 90);
  };

  canvas?.addEventListener("mousedown", (e) => {
    ctx?.restore();
    isPressed = true;
    startPointX = e.offsetX;
    startPointY = e.offsetY;
  });
  canvas?.addEventListener("mouseup", (e) => {
    isPressed = false;
    endPointX = e.offsetX;
    endPointY = e.offsetY;
    if (doingTh.value === "draw") {
      ctx?.beginPath();
      drawCenterX = (endPointX - startPointX) / 2 + startPointX;
      drawCenterY = (endPointY - startPointY) / 2 + startPointY;
      (radius = Math.round(
        Math.sqrt(
          (endPointX - startPointX) * (endPointX - startPointX) +
            (endPointY - startPointY) * (endPointY - startPointY)
        ) / 2
      )),
        ctx?.arc(drawCenterX, drawCenterY, radius, 0, 2 * Math.PI);
      ctx!.strokeStyle = `rgba(255,0,255,0.5)`;
      // ctx!.fillStyle = 'rgba(0,0,0,0.6)';
      ctx?.stroke();
    }
  });

  canvas?.addEventListener("mousemove", (e) => {
    if (isPressed && doingTh.value === "drag") {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      endPointY = e.offsetY;
      endPointX = e.offsetX;
      let movingY = (endPointY - startPointY) / zoomBei;
      let movingX = (endPointX - startPointX) / zoomBei;
      startPointY = endPointY;
      startPointX = endPointX;
      movingLenghtY = movingY + movingLenghtY;
      movingLenghtX = movingX + movingLenghtX;
      boundaryCalc();
      ctx?.drawImage(
        img,
        (docWidth - canvas.width) / 2 + movingLenghtX * zoomBei,
        (docHeight - canvas.height) / 2 + movingLenghtY * zoomBei,
        (img.width * zoomBei) / scaleInfo.scaleBei,
        (img.height * zoomBei) / scaleInfo.scaleBei
      );
    }
  });

  canvas?.addEventListener("mousewheel", (e: any) => {
    if (e.wheelDelta > 0) {
      // 放大
      zoom.value++;
      if (zoom.value > props.zoomMax) {
        zoom.value = props.zoomMax;
      }
    } else {
      // 缩小
      zoom.value--;
      if (zoom.value < 0) {
        zoom.value = 0;
      }
    }
  });
}

function boundaryCalc() {
  //画布上鼠标右滑，画布偏移坐标正向增大，图片跟随鼠标右移movingLenghtX，方向为正
  console.log(movingLenghtX, movingLenghtY);
  if (movingLenghtX * zoomBei - (canvas.width - docWidth) / 2 > 0) {
    movingLenghtX = (canvas.width - docWidth) / (2 * zoomBei);
  }
  //画布上鼠标左滑，画布偏移坐标反向增大，图片跟随鼠标左移movingLenghtX，方向为负
  if (movingLenghtX * zoomBei + (canvas.width - docWidth) / 2 < 0) {
    movingLenghtX = (docWidth - canvas.width) / (2 * zoomBei);
  }

  //画布上鼠标下滑，画布偏移坐标正向增大，图片跟随鼠标下移movingLenghtX，方向为正
  if (movingLenghtY * zoomBei - (canvas.height - docHeight) / 2 > 0) {
    movingLenghtY = (canvas.height - docHeight) / (2 * zoomBei);
  }
  //画布上鼠标上滑，画布偏移坐标反向增大，图片跟随鼠标上移movingLenghtX，方向为负数
  if (movingLenghtY * zoomBei + (canvas.height - docHeight) / 2 < 0) {
    movingLenghtY = (docHeight - canvas.height) / (2 * zoomBei);
  }
}

function clip() {
  // let imageData=ctx?.getImageData(drawCenterX-radius,drawCenterY-radius,2*radius,2*radius) as ImageData ;
  if (doingTh.value !== "draw") {
    return;
  }

  let c2 = document.createElement("canvas");
  document.getElementById("imagelist")?.appendChild(c2);
  // c2.height=canvas.height;
  // c2.width=canvas.width;
  let hei = document.getElementById("imagelist")?.clientHeight as number;
  scaleInfo2.scaleBei = (2 * radius) / hei;
  c2.height = hei;
  c2.width = hei;

  // let c2 = document.getElementById("c2") as HTMLCanvasElement;
  // c2.height= canvas.height;
  // c2.width=canvas.width;
  let ctx2 = c2?.getContext("2d");
  // ctx2?.save();
  ctx2?.arc(
    radius / scaleInfo2.scaleBei,
    radius / scaleInfo2.scaleBei,
    radius / scaleInfo2.scaleBei,
    0,
    2 * Math.PI
  );

  ctx2?.clip();
  // ctx2?.fill();
  // ctx2?.scale(1,-1);
  // ctx2?.fill();
  // if(scaleInfo.isWidthScale) {
  ctx2?.drawImage(
    img,
    (radius -
      drawCenterX +
      movingLenghtX * zoomBei +
      (docWidth - canvas.width) / 2) /
      scaleInfo2.scaleBei,
    (radius -
      drawCenterY +
      movingLenghtY * zoomBei +
      (docHeight - canvas.height) / 2) /
      scaleInfo2.scaleBei,
    (baseCanvasWidth * zoomBei) / scaleInfo2.scaleBei,
    (baseCanvasHeight * zoomBei) / scaleInfo2.scaleBei
  );
  doingTh.value = "clip";
  // }
  // ctx2?.putImageData(imageData,0,0);
}

// 监听缩放级别
watch(zoom, (newValue, oldValue) => {
  zoomBei = round(Math.pow(zoomConst, zoom.value));
  canvas.height = baseCanvasHeight * zoomBei;
  canvas.width = baseCanvasWidth * zoomBei;
  //滚动时，要重新计算边缘情况，
  // 缩小时不进行边缘计算会导致绘图时使用的是上个倍数的偏移量，绘图偏移量过大。导致边缘出现空白
  boundaryCalc();
  ctx?.drawImage(
    img,
    movingLenghtX * zoomBei + (docWidth - canvas.width) / 2,
    movingLenghtY * zoomBei + (docHeight - canvas.height) / 2,
    zoomBei * baseCanvasWidth,
    zoomBei * baseCanvasHeight
  );
});

function convertCanvasToImage(canvas?: HTMLCanvasElement) {
  canvas = document.getElementById("imagelist")
    ?.lastElementChild as HTMLCanvasElement;
  canvas.toDataURL();
  let alink = document.createElement("a");
  alink.setAttribute("href", canvas.toDataURL());
  alink.setAttribute("download", "jietu");
  alink.dataset.downloadurl = ["image/png", alink.download, alink.href].join(
    ":"
  );
  alink.click();
  // let image=new Image();
  // image.src=canvas.toDataURL();
  // return image;

  // var MIME_TYPE = "image/png";
  // var imgURL = canvasElement.toDataURL(MIME_TYPE);
  // var dlLink = document.createElement('a');
  // dlLink.download = fileName;
  // dlLink.href = imgURL;
  // dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
  // document.body.appendChild(dlLink);
  // dlLink.click();
  // document.body.removeChild(dlLink);
}

function download() {
  convertCanvasToImage();
}

function round(number: number, precision: number = 2) {
  return Math.round(+number + "e" + precision) / Math.pow(10, precision);
  //same as:
  //return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
}
</script>

<style scoped lang="scss">
.image_modual {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(155, 155, 155, 0.5);
}

.image_form {
  //   height: 50%;
  //   width: 50%;
  height: 800px;
  width: 500px;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  display: flex;
  /* align-items: center; */
  /* justify-content: center; */
  flex-direction: column;
  background-color: rgb(225, 233, 238);
  box-shadow: 10px 10px 10px rgb(155, 155, 155);
  border-radius: 20px;

  .header {
    height: 5%;
    width: 100%;
    position: relative;
    border-radius: 20px 20px 0px 0px;
    background-color: lightskyblue;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .close {
      border-style: none;
      background-color: transparent;
      width: 10%;
      height: 100%;
      color: white;
      position: absolute;
      right: 1%;
      font-size: xx-large;
    }
    // span {
    //   justify-self: right;
    //   background-color: red;
    //   width: 10px;
    //   height: 100%;
    // }
  }

  .func {
    height: 5%;
    background-color: lightblue;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    input[type="file"] {
      box-sizing: border-box;
      color: white;
      height: 25px;
      text-align: center;
      border-radius: 4px;
      border: 1px solid #c8cccf;
      display: block;
      outline: 0;
      padding: 0 1em;
      text-decoration: none;
    }

    .fileFunc {
      //   visibility: hidden;
      //   z-index: -1;
    }
  }

  .content {
    height: 80%;
    overflow: hidden;
    #container {
      height: 100%;
      position: relative;
      #imagecontent {
        height: 80%;
        overflow: hidden;
        background-color: lightcyan;
      }
      .func {
        position: absolute;
        top: 0px;
        height: 80%;
        border: 4px dashed white;
      }
      #suo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 5%;
        width: 100%;
        input {
          width: 80%;
        }
        button {
          margin: 0 auto;
          background-color: aqua;
          width: 5%;
          border-style: none;
        }
      }
      #imagelist {
        height: 15%;
        background-color: lightblue;
        white-space: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
        * {
          margin: 10px;
        }
      }

      #imagelist::-webkit-scrollbar {
        width: 100%;
        height: 5px;
      }

      #imagelist::-webkit-scrollbar-track {
        background: transparent;
      }

      #imagelist::-webkit-scrollbar-button {
        background: gray;
      }
      #imagelist::-webkit-scrollbar-thumb {
        background: black;
      }
    }
  }

  .bottom {
    height: 10%;
    background-color: lightskyblue;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      margin: 4px;
    }
    .button {
      border-style: none;
      color: white;
      background-color: lightblue;
      width: 50px;
      height: 25px;
    }

    .isChoose {
      background-color: rgb(173, 226, 230);
      font-size: large;
      height: 30px;
    }
  }
}
</style>
