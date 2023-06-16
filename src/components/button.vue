<template>
  <el-button v-bind="customAttrs"></el-button>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
let customAttrs = computed(() => {
  return { type: "primary", ...proxy!.$attrs };
});
</script>

<style scoped></style>
