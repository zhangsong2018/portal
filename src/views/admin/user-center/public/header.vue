<template>
  <div class="wraps_headers">
    <slot name='backing'></slot>
    <header class="header">
      <div class="headerLeft">
        <div @click="callback" v-show="backLeft">
          <img class="back" src="@/static/images/arrer_left.png" :alt="alt">
        </div>
      </div>
      <h2 class="title">{{title}}</h2>
      <div class="headerRight">
        <div v-show="rightShow" @click="menu">
          <img class="menu" :src="rightImg" :alt="alt">
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from "vux";
import defaultImg from "@/static/images/userlist.png";
export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  props: {
    title: {
      type: String,
      required: true,
      default: ""
    },
    backLeft: {
      type: Boolean,
      default: true
    },
    rightImg: {
      type: [String, Object],
      default: defaultImg
    },
    rightShow: {
      type: Boolean,
      default: true
    },
    leftSpacing: {
      type: Number,
      default: 35
    },
    link: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      alt: "乐成集团"
    };
  },
  methods: {
    callback() {
      if (this.link) {
        this.$router.push(this.link);
      } else {
        this.$router.back(-1);
      }
    },
    menu() {
      this.$emit("on-menu", true);
    }
  },
  computed: {
    spacing() {
      return this.leftSpacing / 75 + "rem";
    }
  }
};
</script>

<style lang='less' scoped>
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
@them: #1c76dc;
@font: #fff;

.wraps_headers {
  background: @font;
  position: fixed;
  z-index: 999999999;
   width: 100%;
  .header {
    height: 50px;
    background: @them;
    display: flex;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 6;
      color: @font;
      font-weight: 500;
      font-size: 18px;
    }
    .headerLeft {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1.5;
      .back {
        .rem(width, 45);
        .rem(height, 45);
      }
    }
    .headerRight {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1.5;
      .menu {
        height: 100%;
        .rem(width, 40);
        .rem(margin-top, 7);
      }
    }
  }
}
</style>
