<script setup lang="ts">
import { onMounted, ref ,toRefs} from 'vue'

const props=defineProps({ imgList: {required:true,
  type:Array<any>,
  default:[]
}})

const { imgList} =toRefs(props);

onMounted(()=>{
  alert(imgList.value);
})
</script>

<template>
    <div class="box">
      <div class="img" v-for="item in imgList">
        <img :src="item.src">
      </div>
      <div>
        <span v-for="item in imgList">
        </span>
      </div>
    </div>
</template>

<style scoped>
.box {
  color: #888;
  height: 20vh;
  width: 100vw;
  position: relative;
}

.img {
  height: 800px;
  width: 1000px;
  display: flex;
}
.box .img img {
  object-fit:cover;
  object-position:center;
}
</style>
