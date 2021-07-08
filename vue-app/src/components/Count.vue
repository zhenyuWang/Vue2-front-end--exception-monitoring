<template>
  <div>
    <div>{{count}}</div>
    <button @click="add">add</button>
  </div>
</template>
<style lang='scss' scoped>
</style>
<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      count: 0
    };
  },
  methods: {
    add() {
      this.count++;
      throw Error("123");
    }
  }
};
</script>
