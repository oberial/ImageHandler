<template>
    <div class="image_modual">
        <div class="image_form">
            <div class="header">更换头像            
                <span>x</span>
            </div>

            <div class="func">
                    <input type="file" accept=".jpg, .jpeg, .png" @input="handlefile" />
            </div>
            <div class="content">
                <div id="container">
                    <div id="imagecontent"></div>
                    <div id="suo">
                        <button @click="">-</button>
                        <input type="range" min="0" :max="9" v-model="zoom" />
                        <button @click="">+</button>
                    </div>
                    <div id="imagelist"></div>
                </div>
            </div>
            <div class="bottom">
                <button @click="drag" class="button" :class="doingTh==='drag'?'isChoose':''">拖拽</button>
                <button @click="draw" class="button" :class="doingTh==='draw'?'isChoose':''">画图</button>
                <button @click="clip" class="button" :class="doingTh==='clip'?'isChoose':''">裁切</button>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import {ref} from 'vue';

    type ScaleInfo={
        isWidthScale?:boolean,
        scaleBei:number
    };
    type DoingType = "drag" | "draw"|"clip"|"none";
    // 操作类型
    let doingTh=ref<DoingType>('none');

    // 原始图像
    let img:any ;
    // 画布展示框大小及图像缩放参数
    let docHeight:number;
    let docWidth:number;
    let scaleInfo:ScaleInfo;


    // 实时画布对象、上下文及画布初始大小
    let canvas:HTMLCanvasElement;
    let ctx:CanvasRenderingContext2D|null;
    let baseCanvasHeight:number;
    let baseCanvasWidth:number;

    // 原始画布x y轴移动坐标值
    let movingLenghtY:number=0;
    let movingLenghtX:number=0;

    // 鼠标点击画布偏移量坐标
    let startPointX:number;
    let startPointY:number;
    // 鼠标松开画布偏移量坐标
    let endPointX:number;
    let endPointY:number;


    // 画图圆形、半径及画布圆形缩放到截图栏缩放系数
    let drawCenterX:number;
    let drawCenterY:number;
    let radius:number;
    let scaleInfo2:ScaleInfo={scaleBei:1};

    // 缩放指数 ，缩放等级，及缩放倍数
    const zoomConst:number=1.1;
    let zoom=ref<number>(0);
    let zoomBei=1;

    function drag() {
        doingTh.value="drag";
    }

    function draw() {
        doingTh.value="draw";
    }

    onMounted(()=>{
        docWidth=document.getElementById('imagecontent')?.clientWidth as number;
        docHeight=document.getElementById('imagecontent')?.clientHeight as number;
        console.log(docWidth,docHeight);
    })

    function handlefile(e:any) {
        let file = e.target.files;
        console.log(file[0]);
        const blob = file[0].slice(1024 * 1024 * 1024, 1 * 1024 * 1024 * 1024);
        console.log(blob);
        let reader = new FileReader();
        reader.readAsDataURL(file[0]);
            // reader 读取文件成功的回调
            reader.onload = function(e) {
                console.log(this);
                fileAndBlobToCanvas(reader.result);
        };
    }

    function fileAndBlobToCanvas(fileDataURL: string ) {
        if(canvas){
            document.getElementById('imagecontent')?.removeChild(canvas);
        }
        let isPressed=false;
        img = new Image()
        img.src = fileDataURL;
        canvas = document.createElement('canvas')
        if(!canvas.getContext) {
            alert('浏览器不支持canvas')
            return;
        }
        ctx = canvas.getContext('2d')
        document.getElementById('imagecontent')?.appendChild(canvas)
        img.onload = function() {
            let wBei=img.width/docWidth;
            let hBei=img.height/docHeight;
            scaleInfo={isWidthScale:wBei<hBei,scaleBei:wBei<hBei?wBei:hBei};
            baseCanvasHeight=canvas.height=img.height/scaleInfo.scaleBei;
            baseCanvasWidth=canvas.width=img.width/scaleInfo.scaleBei;
            console.log(JSON.stringify({wBei,hBei}));
            ctx?.drawImage(img, (docWidth-baseCanvasWidth)/2, (docHeight-baseCanvasHeight)/2,  img.width/scaleInfo.scaleBei, img.height/scaleInfo.scaleBei)
            ctx!.font = "10px serif";
            ctx!.fillText("Hello canvas", 50, 90);
        }

        canvas?.addEventListener('mousedown', (e) => {
            ctx?.restore();
            isPressed = true;
            startPointX = e.offsetX
            startPointY = e.offsetY
        })
        canvas?.addEventListener('mouseup', (e) => {
            isPressed=false;
            endPointX = e.offsetX
            endPointY = e.offsetY
            if(doingTh.value==="draw") {
                ctx?.beginPath();
                drawCenterX=(endPointX-startPointX)/2+startPointX;
                drawCenterY=(endPointY-startPointY)/2+startPointY;
                radius=Math.round(Math.sqrt((endPointX-startPointX)*(endPointX-startPointX)+(endPointY-startPointY)*(endPointY-startPointY))/2),
                ctx?.arc(
                    drawCenterX,
                    drawCenterY,
                    radius,
                    0, 2 * Math.PI);
                ctx!.strokeStyle = `rgba(255,0,255,0.5)`;
                // ctx!.fillStyle = 'rgba(0,0,0,0.6)';
                ctx?.stroke();
            }
        })

        canvas?.addEventListener('mousemove', (e) => {
            if(isPressed  && doingTh.value==="drag") {
                ctx?.clearRect(0,0,canvas.width,canvas.height);
                    endPointY = e.offsetY;
                    endPointX = e.offsetX;
                    let movingY=(endPointY - startPointY)/zoomBei;
                    let movingX=(endPointX - startPointX)/zoomBei;
                    startPointY = endPointY;
                    startPointX = endPointX;
                    movingLenghtY= movingY + movingLenghtY;
                    movingLenghtX= movingX + movingLenghtX;
                    boundaryCalc();
                    ctx?.drawImage(img, ((docWidth-canvas.width)/2)+(movingLenghtX*zoomBei),((docHeight-canvas.height)/2)+(movingLenghtY*zoomBei),img.width*zoomBei/scaleInfo.scaleBei, img.height*zoomBei/scaleInfo.scaleBei)
            }
        })

        canvas?.addEventListener('mousewheel',(e:any)=>{
            if (e.wheelDelta > 0) {
                // 放大
                zoom.value++;
                if(zoom.value>9) {
                    zoom.value=9;
                }
            } else {
                // 缩小
                zoom.value--;
                if(zoom.value<0) {
                    zoom.value=0;
                }
            }
        })
    }

    function boundaryCalc() {
        //画布上鼠标右滑，画布偏移坐标正向增大，图片跟随鼠标右移movingLenghtX，方向为正
        console.log(movingLenghtX,movingLenghtY);
        if(movingLenghtX*zoomBei-(canvas.width-docWidth)/2>0) {
            movingLenghtX = (canvas.width-docWidth)/(2*zoomBei);
        }
        //画布上鼠标左滑，画布偏移坐标反向增大，图片跟随鼠标左移movingLenghtX，方向为负
        if(movingLenghtX*zoomBei +(canvas.width-docWidth)/2<0)
        {
            movingLenghtX=(docWidth-canvas.width)/(2*zoomBei);
        }

        //画布上鼠标下滑，画布偏移坐标正向增大，图片跟随鼠标下移movingLenghtX，方向为正
        if(movingLenghtY*zoomBei-(canvas.height-docHeight)/2>0) {
            movingLenghtY=(canvas.height-docHeight)/(2*zoomBei);
        }
        //画布上鼠标上滑，画布偏移坐标反向增大，图片跟随鼠标上移movingLenghtX，方向为负数
        if(movingLenghtY*zoomBei+(canvas.height-docHeight)/2 <0)
        {
            movingLenghtY=(docHeight-canvas.height)/(2*zoomBei);
        }
    }

    function clip() {
        // let imageData=ctx?.getImageData(drawCenterX-radius,drawCenterY-radius,2*radius,2*radius) as ImageData ;
        if(doingTh.value!=="draw"){
            return;
        }
        let c2 = document.createElement('canvas');
        // c2.height=canvas.height;
        // c2.width=canvas.width;
        let hei=document.getElementById('imagelist')?.clientHeight as number;
        scaleInfo2.scaleBei=2*radius/hei; 

        c2.height=hei;
        c2.width=hei;
        document.getElementById('imagelist')?.appendChild(c2);
        // let c2 = document.getElementById("c2") as HTMLCanvasElement;
        // c2.height= canvas.height;
        // c2.width=canvas.width;
        let ctx2=c2?.getContext('2d');
        // ctx2?.save();
        ctx2?.arc(
            radius/scaleInfo2.scaleBei,
            radius/scaleInfo2.scaleBei,
            radius/scaleInfo2.scaleBei,
            0, 2 * Math.PI);

        ctx2?.clip();
        // ctx2?.fill();
        // ctx2?.scale(1,-1);
        // ctx2?.fill();
        // if(scaleInfo.isWidthScale) {
        ctx2?.drawImage(img,
        (radius-drawCenterX+movingLenghtX*zoomBei+(docWidth-canvas.width)/2)/scaleInfo2.scaleBei,
        (radius-drawCenterY+movingLenghtY*zoomBei+(docHeight-canvas.height)/2)/scaleInfo2.scaleBei,
        baseCanvasWidth*zoomBei/scaleInfo2.scaleBei ,
        baseCanvasHeight*zoomBei/scaleInfo2.scaleBei
        );
        doingTh.value="clip";
        // }
        // ctx2?.putImageData(imageData,0,0);
    }

    // 监听缩放级别
    watch(zoom,(newValue,oldValue)=>{
        zoomBei=round(Math.pow(zoomConst,zoom.value));
            canvas.height=baseCanvasHeight*zoomBei;
            canvas.width=baseCanvasWidth*zoomBei;
            //滚动时，要重新计算边缘情况，
            // 缩小时不进行边缘计算会导致绘图时使用的是上个倍数的偏移量，绘图偏移量过大。导致边缘出现空白
            boundaryCalc();
            ctx?.drawImage(img,movingLenghtX*zoomBei+((docWidth-canvas.width)/2),movingLenghtY*zoomBei+((docHeight-canvas.height)/2),zoomBei*baseCanvasWidth ,zoomBei*baseCanvasHeight);
    })

    function convertCanvasToImage(canvas:HTMLCanvasElement) {
        let image=new Image();
        image.src=canvas.toDataURL();
        return image;
    }

    function round(number:number, precision:number=2) {
        return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
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
        background: rgba(155,155,155,0.5);
    }

    .image_form {
        height: 50%;
        width: 50%;
        max-height:1000px;
        max-width: 500px;
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
        box-shadow: 10px 10px 10px rgb(155,155,155);
        border-radius: 20px;

        .header {
            height: 5%;
            width: 100%;
            border-radius: 20px 20px 0px 0px;
            background-color: lightskyblue;
            text-align: center;
            display: flex;
            span {
                justify-self: right;
                background-color: red;
                width: 10px;
                height: 100%;
            }
        }

        .func {
            height: 5%;
            background-color: lightblue;
            width: 100%;
        }

        .content {
            height: 80%;
            overflow: hidden;
            #container{
                height: 100%;
                #imagecontent {
                    height: 80%;
                    overflow: hidden;
                    background-color: lightcyan;
                }
                #suo {
                    margin:0 auto;
                    * {
                        margin: 1%;
                    }
                    height: 5%;
                    width: 100%;
                    input {
                        width: 80%;
                    }
                    button {
                        width:5%;
                    }
                }
                #imagelist {
                    height: 15%;
                    background-color: lightblue;
                    overflow: hidden;
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
                color:white;
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