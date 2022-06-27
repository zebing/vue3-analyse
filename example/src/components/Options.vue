<template>
  <div class="OptionName">
    <div>this is {{name}}</div>
    <button @click="changeName">change name</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: 'Options Components',
      id: 1,
    }
  },
  methods: {
    changeName () {
      this.id++;
      this.name = 'Options Components v' + this.id;
    }
  }
}
</script>
<style scoped>
.OptionName {
  background: blue;
  color: #fff;
}
</style>