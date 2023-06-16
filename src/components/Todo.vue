<template>
  <div class="hello">
    <input type="text" @input="input" />
    <ul v-for="(item, index) in todoList">
      <li>{{ item.content }}</li>
      <button @click="del(item, $event)">x</button>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
type todoThi = {
  id: number;
  content: string;
};
let i = 0;
const todoList = ref<Array<todoThi>>([]);
const input = (item: any) => {
  console.log(item);
  todoList.value.push({ id: i++, content: item.data });
};

const del = (selectedItem: any, event: any) => {
  console.log(todoList.value.findIndex((item) => item.id === selectedItem.id));
  console.log(selectedItem.id);

  todoList.value.splice(
    todoList.value.findIndex((item) => item.id === selectedItem.id),
    1
  );
};
</script>

<style scoped>
li {
  display: inline-block;
}
</style>
