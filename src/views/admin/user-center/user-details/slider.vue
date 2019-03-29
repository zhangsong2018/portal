<template>
  <transition name="slide-fade">
    <div @click="close" v-show="show" class="slider">
      <div>
        <ul class="list">
          <li :key="index" v-for="(item,index) in list">
            <span :class="{'active':active===index}" @click="back(item,index)">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id:{
      type:[Number,String],
    }
  },
  data() {
    return {
      list: [
        { name: "详细信息", path: `/admin/userDetails/${this.id}` },
        { name: "居住信息", path: "/admin/liveDetails" },
        { name: "评估信息", path: "" },
        { name: "养护信息", path: "" },
        { name: "费用信息", path: "/admin/payDetails" },
        { name: "档案信息", path: "" },
        { name: "社工探访", path: "" },
        { name: "医疗信息", path: "" }
      ],
      //---------高亮class
      active: 0
    };
  },
  methods: {
    back(item, index) {
      this.active = index;
      this.$emit("on-back", item, false);
      this.$emit("update:show", false);
      this.$vux.toast.hide();
      this.$vux.toast.text(`您选择了 ${item.name}`, "bottom");
    },
    close() {
      this.$emit("update:show", false);
    }
  },
  watch: {
    show(newVal) {
      console.log(newVal);
    }
  }
};
</script>

<style scoped lang='less'>
@them: #1c76dc;
@light: #5c94d4;
@font: white;
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slider {
  background-color: rgba(119, 116, 116, 0.8);
  position: fixed;
  z-index: 10000;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  touch-action: none;
  overflow: hidden;
  section {
    float: right;
    opacity: 1;
  }
  .list {
    li {
      display: flex;
      justify-content: flex-end;
      .active {
        background: @them;
      }
      span {
        background: @light;
        color: @font;
        .rem(width, 150);
        .rem(height, 50);
        display: inline-block;
        .rem(margin, 30);
        .rem(line-height, 53);
        text-align: center;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
      }
    }
  }
}
</style>
