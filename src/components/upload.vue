<template>
  <!-- <el-upload
    v-bind="customizedAttrs"
    class="avatar-uploader"
    :show-file-list="true"
    :before-upload="beforeAvatarUpload"
  >
    class="avatar-uploader"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :on-success="handleAvatarSuccess"

  v-on="$listeners" 
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload> -->
  <!-- v-bind="customizedAttrs" -->
  <el-upload
    v-bind="customizedAttrs"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :before-upload="beforeAvatarUpload"
  >
    <slot></slot>
  </el-upload>
</template>

<script lang="ts">
// 使用普通的 <script> 来声明选项
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import {
  ref,
  computed,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import { ElMessage } from "element-plus";

import type { UploadProps, UploadUserFile } from "element-plus";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customizedAttrs = computed(() => {
  return { listType: "picture-card", ...proxy!.$attrs };
});

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};
console.log(customizedAttrs);
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 1px;
  height: 1px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
// border: 1px dashed var(--el-border-color);

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
