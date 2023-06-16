<script setup lang="ts">
import { ref } from "vue";
import Slide from "./components/slide.vue";
import upload from "./views/uploadfather.vue";
import cloud from "@/assets/images/cloud.jpg";
import jian from "@/assets/images/jian.jpg";
import sea from "@/assets/images/sea.jpeg";
import tuan from "@/assets/images/tuan.jpg";
import "vue3-carousel/dist/carousel.css";
import { onMounted } from "vue";
import date from "./components/date.vue";
import todo from "./components/Todo.vue";

import VueCarousel from "vue-carousel";
// import { Carousel, Slie, Pagination, Navigation } from 'vue3-carousel'
let isChoose = ref(-1);
let imgsrc = [
  { name: "cloud", src: cloud },
  { name: "jian", src: jian },
  { name: "sea", src: sea },
  { name: "tuan", src: tuan },
];

let buttons = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }];
onMounted(() => {
  // console.log(refs.images?.value);
  setTimeout(() => {
    console.log(imgsrc);
  }, 3000);
});
function click(index: any) {
  console.log(index);
  isChoose.value = index;
  // isChoose.value=value;
}
</script>

<template>
  <h1>Hello App!</h1>
  <p>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/image">Go to image</router-link>
    <router-link to="/about">Go to about</router-link>
  </p>
  <date></date>
  <div class="background">
    <Slide :slideImage="imgsrc" test="123"></Slide>
    <!-- <Imagehelper zoomMax="15"></Imagehelper> -->
    <vue-carousel>
      <img src="./assets/images/cloud.jpg" />
      <img src="./assets/images/cloud.jpg" />
      <img src="./assets/images/cloud.jpg" />
    </vue-carousel>
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
        <h2 class="service-title">需求沟通</h2>
        <p class="servive-content">
          客户提出网站建设的基本需求，包括设计要求及功能要求
        </p>
      </div>
      <div class="service-item">
        <i class="fas fa-comments"></i>
        <h2 class="service-title">项目评估</h2>
        <p class="servive-content">
          根据客户提出的需求进行评估，估算出相应的时间与费用
        </p>
      </div>
      <div class="service-item">
        <i class="fas fa-comments"></i>
        <h2 class="service-title">签订合同</h2>
        <p class="servive-content">
          合作双方确认费用、工期、合作要求的基础上，双方共同签订合同
        </p>
      </div>
      <div class="service-item">
        <i class="fas fa-comments"></i>
        <h2 class="service-title">提案阶段</h2>
        <p class="servive-content">
          完成网站初稿DEMO设计,包括首页风格,内页风格页面
        </p>
      </div>
      <div class="service-item">
        <i class="fas fa-comments"></i>
        <h2 class="service-title">制作阶段</h2>
        <p class="servive-content">
          完成所有页面的设计，进行程序开发以及前后台的页面整合
        </p>
      </div>
      <div class="service-item">
        <i class="fas fa-comments"></i>
        <h2 class="service-title">网站验收</h2>
        <p class="servive-content">
          根据合同条款进行网站验收,并签署网站验收确认单
        </p>
      </div>
    </div>
  </section>
  <section class="service2">
    <button
      v-for="(item, index) in buttons"
      :class="isChoose <= lastindex && isChoose >= startIndex ? 'Active' : ''"
      @click="click(index)"
      :key="index"
    >
      {{ item.name }}
    </button>
  </section>
  <router-view></router-view>
  <upload></upload>
  <todo></todo>
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
  object-fit: cover;
  object-position: center;
}

.service2 {
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.Active {
  color: red;
}

.services {
  display: flex;
}

.services .service-item {
  margin: 10px;
  background-color: lightblue;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 10px 10px 10px gray;
}

.services .service-item:hover {
  transform: translate(-10px, -20px);
  transition: transform 0.5s ease-in;
  font-size: 20px;
  color: white;
}
</style>
