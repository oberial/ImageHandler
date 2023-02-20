<template>
    <div class="image_modual">
        <div class="image_form">
            <div class="header">更换头像</div>
            <div class="func">
                    <input type="file" accept=".jpg, .jpeg, .png" @input="handlefile" />
            </div>
            <div class="content">
                <div id="container">
                    <div id="imagecontent"></div>
                    <div id="suo">
                        <button>-</button>
                        <input type="range" min="0" :max="9" :value="zoom" @input="zoomTo"/>
                        <button>+</button>
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
import { onMounted } from 'vue';
import {ref} from 'vue';

    type ScaleInfo={
        isWidthScale:boolean,
        scaleBei:number
    };
    type DoingType = "drag" | "draw"|"clip"|"none";
    let canvas:HTMLCanvasElement;


    let ctx:CanvasRenderingContext2D|null;
    let img:any ;
    let scaleInfo:ScaleInfo;
    let scaleInfo2:ScaleInfo={scaleBei:1,isWidthScale:false};

    let drawCenterX:number;
    let drawCenterY:number;
    let radius:number;


    let doingTh=ref<DoingType>('none');

    let baseCanvasHeight:number;
    let baseCanvasWidth:number;
    let docHeight:number;
    let docWidth:number;

    let startPointX:number;
    let startPointY:number;
    let endPointX:number;
    let endPointY:number;

    let movingLenghtY:number=0;
    let movingLenghtX:number=0;

    let zoom=ref<number>(0);
    const scaleConst:number=1.1;

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
                    let bei=Math.pow(scaleConst,zoom.value);
                    let movingY=(endPointY - startPointY)/bei;
                    let movingX=(endPointX - startPointX)/bei;
                    startPointY = endPointY;
                    startPointX = endPointX;
                    movingLenghtY= movingY + movingLenghtY;
                    movingLenghtX= movingX + movingLenghtX;
                    console.log(movingLenghtY,movingLenghtX);
                    if(movingLenghtY+(docHeight-baseCanvasHeight)/2>0) {
                        movingLenghtY=-(docHeight-baseCanvasHeight)/2;
                    }
                    if(movingLenghtX+(docWidth-baseCanvasWidth)/2>0) {
                        movingLenghtX=-(docWidth-baseCanvasWidth)/2;
                    }
                    if(movingLenghtY + canvas.height+(docHeight-baseCanvasHeight)/2<docHeight)
                    {
                        movingLenghtY=docHeight-canvas.height-(docHeight-baseCanvasHeight)/2;
                    }
                    if(movingLenghtX + canvas.width+(docWidth-baseCanvasWidth)/2 <docWidth)
                    {
                        movingLenghtX=docWidth- canvas.width-(docWidth-baseCanvasWidth)/2;
                    }
                    ctx?.drawImage(img, (movingLenghtX+(docWidth-baseCanvasWidth)/2)*bei, (movingLenghtY+(docHeight-baseCanvasHeight)/2)*bei,img.width*bei/scaleInfo.scaleBei, img.height*bei/scaleInfo.scaleBei)
            }
        })

        canvas?.addEventListener('mousewheel',(e)=>{
            if (e.wheelDelta > 0) {
                zoom.value++;
                // 放大
            } else {
                // 缩小
                zoom.value--;
            }

            if(zoom.value>9) {
                zoom.value=9;
            }
            if(zoom.value<0) {
                zoom.value=0;
            }
            let bei=Math.pow(scaleConst,zoom.value);
            console.log(zoom.value);
            canvas.height=baseCanvasHeight*bei;
            canvas.width=baseCanvasWidth*bei;
                // ctx?.beginPath();
                // ctx?.rect((movingLenghtX+docWidth)/4,(movingLenghtY+docHeight)/4,(movingLenghtX+docWidth)/2,(movingLenghtY+docHeight)/2);
                // ctx?.clip();
            // alert(bei);
            ctx?.drawImage(img,((docWidth-canvas.width)/2),((docHeight-canvas.height)/2),bei*img.width/(scaleInfo.scaleBei*scaleInfo2.scaleBei) ,bei*img.height/(scaleInfo.scaleBei*scaleInfo2.scaleBei));
        })
    }

    function clip() {
        // let imageData=ctx?.getImageData(drawCenterX-radius,drawCenterY-radius,2*radius,2*radius) as ImageData ;
        
        doingTh.value="clip";
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
        ctx2?.save();
        ctx2?.beginPath();
        ctx2?.arc(
            radius/scaleInfo2.scaleBei,
            radius/scaleInfo2.scaleBei,
            radius/scaleInfo2.scaleBei,
            0, 2 * Math.PI);

        ctx2?.clip();
        ctx2?.fill();
        // ctx2?.scale(1,-1);
        // ctx2?.fill();
        // if(scaleInfo.isWidthScale) {
        ctx2?.drawImage(img,(radius-drawCenterX+movingLenghtX+(docWidth-baseCanvasWidth)/2)/scaleInfo2.scaleBei,(radius-drawCenterY+movingLenghtY+(docHeight-baseCanvasHeight)/2)/scaleInfo2.scaleBei,img.width/(scaleInfo.scaleBei*scaleInfo2.scaleBei) ,img.height/(scaleInfo.scaleBei*scaleInfo2.scaleBei));
        // }
        

        // ctx2?.putImageData(imageData,0,0);
    }

    function zoomTo(e:any) {
        zoom.value=e.target.value;
        console.log(zoom.value);
        let bei=Math.pow(scaleConst,zoom.value);
        canvas.height=baseCanvasHeight*bei;
        canvas.width=baseCanvasWidth*bei;
        ctx?.drawImage(img,((docWidth-canvas.width)/2),((docHeight-canvas.height)/2),bei*img.width/(scaleInfo.scaleBei*scaleInfo2.scaleBei) ,bei*img.height/(scaleInfo.scaleBei*scaleInfo2.scaleBei));
    }

    function convertCanvasToImage(canvas:HTMLCanvasElement) {
        let image=new Image();
        image.src=canvas.toDataURL();
        return image;
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
            border-radius: 20px 20px 0px 0px;
            background-color: lightskyblue;
            text-align: center;
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