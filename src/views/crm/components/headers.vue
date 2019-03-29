<template>
  <div class="headers">
    <div class="headerbar"></div>
    <header class="header">
      <div class="close" @click="$emit('close')">
        <div class="close_pic">
          <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
        </div>
      </div>
      <div class="title">
        <span>{{text}}</span>
      </div>
      <div class="icon" @click="complete()">
        <slot></slot>
      </div>
    </header>
  </div>

</template>
<script>

  export default {
    props: {
      text: {
        default: "",
        type: String
      },
    },
    name: "headers",
    data() {
      return {}
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
      complete() {
        this.$emit('complete');
      }
    },
    components: {},
  }
</script>
<style lang="less" scoped>
  .headers{
    height: 80px;
    .headerbar {
      width: 100%;
      height: 30px;
      background: #1c76dc;
      position: fixed;
      top: 0px;
      z-index: 499
    }

    .content {
      margin-top: 80px;
    }

    .header {
      width: 100%;
      height: 50px;
      background: #1c76dc url(../../../static/images/sy.png) no-repeat;
      background-size: cover;
      position: fixed;
      top: 30px;
      display: flex;
      z-index: 499
    }

    .title {
      flex: 6;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: 100;
      font-size: 20px;
    }

    .close {
      flex: 1.5;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }

    .close_pic {
      display: flex;
    }

    .close_pic img {
      width: 100%;
      height: 100%;
    }

    .icon {
      flex: 1.5;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
    }
  }


</style>
