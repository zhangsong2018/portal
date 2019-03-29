<template>
  <div>
    <div class="tabBar">
      <div class="left_pic">
         <slot name="left_icon"><</slot>
      </div>
      <div class="right_pic">
         <slot name="right_icon">></slot>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
  .tabBar{
    width: 100%;
    position: fixed;
    top:45%;
    display: flex;
    justify-content: space-between;
    font-size: 25px;
  }
  .left_pic,.right_pic{
    padding: 10px;
  }
</style>
