<template>
  <div class="setup">
    <div>this is {{state.name}}</div>
    <button @click="changeName">change name</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const state = reactive({
  id: 1,
  name: 'setup Components',
});
const changeName = () => {
  state.id++;
  state.name = 'setup Components v' + state.id;
}
</script>

<style scoped>
.setup {
  margin-top: 20px;
  background: yellow;
}
</style>
