<script setup lang="ts">
import Slide from './components/slide.vue';
import cloud from '@/assets/images/cloud.jpg';
import jian from '@/assets/images/jian.jpg';
import sea from '@/assets/images/sea.jpeg';
import tuan from '@/assets/images/tuan.jpg';
import 'vue3-carousel/dist/carousel.css'
import { onMounted } from 'vue';
import slide1 from './slide/slide'
import Imagehelper from './components/imagehelper.vue'
// import { Carousel, Slie, Pagination, Navigation } from 'vue3-carousel'

let imgsrc=[{name:'cloud',src:cloud},
{name:'jian',src:jian},
{name:'sea',src:sea},
{name:'tuan',src:tuan}]

onMounted(()=>{
        // console.log(refs.images?.value);
        setTimeout(()=>{console.log(imgsrc);},3000)
    })
</script>

<template>
  <div class="background">
    <Slide :slideImage="imgsrc" test="123"></Slide>
    <Imagehelper></Imagehelper>
  </div>
  <!-- <div>
    <slide1 :slideImage="imgsrc"></slide1>
  </div> -->
  <section class="service">
            <h2></h2>
            <p class="intro"></p>
            <div class="services">
                <div class="service-item">
                    <i class="fas fa-comments"></i>
                    <h2 class="service-title">
                        需求沟通
                    </h2>
                    <p class="servive-content">
                        客户提出网站建设的基本需求，包括设计要求及功能要求
                    </p>
                </div>
                <div class="service-item">
                    <i class="fas fa-comments"></i>
                    <h2 class="service-title">
                        项目评估
                    </h2>
                    <p class="servive-content">
                        根据客户提出的需求进行评估，估算出相应的时间与费用
                    </p>
                </div>
                <div class="service-item">
                    <i class="fas fa-comments"></i>
                    <h2 class="service-title">
                        签订合同
                    </h2>
                    <p class="servive-content">
                        合作双方确认费用、工期、合作要求的基础上，双方共同签订合同
                    </p>
                </div>
                <div class="service-item">
                    <i class="fas fa-comments"></i>
                    <h2 class="service-title">
                        提案阶段
                    </h2>
                    <p class="servive-content">
                        完成网站初稿DEMO设计,包括首页风格,内页风格页面
                    </p>
                </div>
                <div class="service-item">
                    <i class="fas fa-comments"></i>
                    <h2 class="service-title">
                        制作阶段
                    </h2>
                    <p class="servive-content">
                        完成所有页面的设计，进行程序开发以及前后台的页面整合
                    </p>
                </div>
                <div class="service-item">
                    <i class="fas fa-comments"></i>
                    <h2 class="service-title">
                        网站验收
                    </h2>
                    <p class="servive-content">
                        根据合同条款进行网站验收,并签署网站验收确认单
                    </p>
                </div>
            </div>
  </section>
</template>

<style scoped>
@media screen and (max-width: 1500px) {
    .background {
        background-color: yellow;
    }
}

.background {
        background-color: lightblue;
    }

.img {
  object-fit:cover;
  object-position:center;
}
</style>
