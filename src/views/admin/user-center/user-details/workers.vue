<template>
  <div style="height: 100%;min-height: 100vh;" class="wraps">
    <ViewBox ref="xxx">
    <div class="fixed">
      <div class="header-bar"></div>
      <headerGroup :rightShow="false" :title="info.name"></headerGroup>
      <header class="header">
        <section class="section">
          <p>床位：{{info.facilityBedCode}}</p>
          <p>性别：{{info.genderStr}}</p>
          <p>{{info.careLevelName}}</p>
          <p @click="down">
            <img class="drag" src="@/static/images/hourse/drag.png">
          </p>
        </section>
      </header>
    </div>
    <loading :pageType="loading"></loading>
    <router-view :id="id" class="main"></router-view>
    <slider :id="id" @on-back="search" :show.sync="open" class="slider"></slider>
    </ViewBox>
  </div>
</template>
<script>
import headerGroup from "../public/header";
import slider from "./slider";
import loading from "@/components/Loading.vue";
import { ViewBox } from 'vux'
export default {
  components: {
    headerGroup,
    slider,
    loading,
    ViewBox
  },
  data() {
    return {
      loading: {
        isShow: false,
        pageType: "loading"
      },
      data: [],
      id: null,
      open: false,
      info: {
        facilityBedCode: "",
        name: "",
        genderStr: "",
        careLevelName: "",
        lifePictureId:null
      }
    };
  },
  created() {
    this.testing();
  },
  methods: {
    testing() {
      //回退需要使用的id
      this.id = this.$route.params.id;
      //一键合并
      this.info = Object.assign({}, this.$route.query);
    },
    down() {
      this.open = !this.open;
    },
    search(item) {
      this.$router.replace({ path: item.path });
    }
  }
};
</script>

<style lang='less' scoped>
@them: #1c76dc;
@font: #777474;
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
.wraps {
  .fixed {
    position: fixed;
    width: 100%;
    z-index: 100;
  }
  .header-bar {
    height: 30px;
    background: @them;
    width: 100%;
  }
  .header {
    position: fixed;
    z-index: 9999;
    width: 100%;
    margin-top: 48px;
    .section {
      height: 40px;
      background: @them;
      color: white;
      display: flex;
      align-items: center;
      .drag {
        .rem(height, 50);
        .rem(width, 50);
      }
      p {
        width: 25%;
        justify-content: center;
        display: flex;
        align-items: center;
      }
    }
  }
  .main {
    overflow: hidden;
    margin-top: 118px;
  }
  .slider {
    margin-top: 118px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
