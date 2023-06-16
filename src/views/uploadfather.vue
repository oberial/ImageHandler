<template>
  <upload
    :file-list="fileList"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
  >
    <el-icon><Plus /></el-icon>
  </upload>
  <jbutton type="error" icon="el-icon-search" circle></jbutton>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import upload from "../components/upload.vue";
import jbutton from "../components/button.vue";
import { Plus } from "@element-plus/icons-vue";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "plant-1.png",
    url: "/images/plant-1.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "plant-2.png",
    url: "/images/plant-2.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "figure-1.png",
    url: "/images/figure-1.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "figure-2.png",
    url: "/images/figure-2.png",
  },
]);

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
</script>

<style scoped></style>
