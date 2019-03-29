<template>
  <div ref="warps" class="wraps">
    <div class="headerbar"></div>
    <header-group class="header-group" :rightShow="false" title="交接班(养护)"></header-group>
    <main class="main">
      <card>
        <div slot="content" class="card">
          <div class="vux-1px-r">
            <span>姓名</span>
            <span>{{handInfo.name}}</span>
          </div>
          <div class="vux-1px-r">
            <span>床位号</span>
            <span>{{handInfo.bedCode}}</span>
          </div>
          <div>
            <span>护照等级</span>
            <span class="special">{{handInfo.abilityLevel}}</span>
          </div>
        </div>
      </card>
      <!--文本域-->
      <group>
        <x-textarea
          :max="info.max"
          v-model.trim="info.content"
          :row="info.row"
          :height="info.height"
          placeholder="交班重点"
        ></x-textarea>
      </group>
      <div class="btn">
        <x-button @click.native="submit" type="primary">保存</x-button>
        <x-button @click.native="toHistory">查看历史记录</x-button>
      </div>
      <div :style="{'position':fixedShow? 'absolute' :'static'}" class="voice">
        <p>您可以尝试用语音 说出您的的交班重点</p>
        <img class="video" src="@/static/images/maike.png" alt>
      </div>
      <!-- <Loading @childEvent='reload' :pageType="type"></Loading> -->
    </main>
  </div>
</template>

<script>
import headerGroup from "../../admin/user-center/public/header.vue";
import { Card, XTextarea, Group, XButton, Spinner } from "vux";
import { OmsHandOverSave } from "@/services/hand-face.js";
export default {
  components: {
    headerGroup,
    Card,
    XTextarea,
    Group,
    XButton,
    Spinner
    // Loading
  },
  data() {
    return {
      type: {
        isShow: true,
        pageType: "networkerr",
        text: "正在保存",
        errName: "loadData"
      },
      timer: null,
      fixedShow: true,
      //人员详细信息
      handInfo: {
        //默认值防止刷新出错
        abilityLevel: "",
        bedCode: "",
        gender: "",
        id: "",
        name: "",
        priority: "",
        residentId: ""
      },
      //性别验证
      sex: {
        Male: "Male"
      },
      //准备提交的信息
      info: {
        content: "",
        max: 400,
        height: 80,
        row: 4
      }
    };
  },
  created() {
    this.sysInit();
  },
  mounted() {
    this.watchKeybord();
    //---与原生交互
    this.create();
    //---原生按钮
    this.btn(1);
    //兼容ios
    this.$refs.warps.addEventListener("touchmove", e => {
      e.stopPropagation();
      e.preventDefault();
    });
  },
  methods: {
    //系统初始化头部信息
    sysInit() {
      this.handInfo = Object.assign({}, this.$store.state.handOver.handInfo);
    },
    //结束清空数据
    clear() {
      this.info.content = "";
    },
    //fixed 解决方案
    watchKeybord() {
      let me = this;
      let oriWinHeight = window.innerHeight;
      let _this = this;
      window.onresize = function() {
        me.isKeybordAvail = true;
        let newHeight = window.innerHeight;
        _this.fixedShow = false;
        _this.$refs.warps.style["touch-action"] = "none";
        // 阀值大于140判断为键盘收起
        if (newHeight - oriWinHeight > 140) {
          _this.fixedShow = true;
          _this.$refs.warps.style["touch-action"] = "auto";
        }
        oriWinHeight = newHeight;
      };
    },
    btn(boolean) {
      dsBridge.call("isShowTextBtn", boolean);
    },
    //原生话筒返回
    create() {
      let _this = this;
      dsBridge.registerAsyn("recordResult", function(text) {
        _this.info.content += text;
      });
    },
    //提交
    submit() {
      //this.loading = true;
      if (this.info.content.length < 1) {
        return this.$vux.toast.text("交接班内容不能为空", "center");
      }
      let _this = this;
      let residentId = this.$store.state.handOver.handInfo.residentId; //id
      this.$vux.loading.show();
      //安卓原生方法
      dsBridge.call(
        "handOverParameter",
        {
          "Oms-Tenant-Id": localStorage.getItem('tenantId'),
          ShiftType: 1,
          ResidentId: residentId,
          Content: this.info.content
        },
        function(msg) {
          if (msg == 1) {
            _this.showToast("保存成功");
            _this.clear();
          } else {
            _this.showToast("保存失败");
          }
          _this.$vux.loading.hide();
        }
      );
      this.timer = setTimeout(_ => {
        this.$vux.loading.hide();
      }, 20000);
    },
    toHistory() {
      this.btn(0);
      this.$router.push({
        name: "hisInfo"
      });
    }
    // reload () {
    //   this.type.pageType = 'loading'
    // }
  },
  //组件销毁
  beforeDestroy() {
    this.btn(0);
    this.$vux.loading.hide();
    clearTimeout(this.timer);
  }
};
</script>

<style scoped lang='less'>
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
@them: #1c76dc;
@font: #777474;
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.wraps {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
  // overflow: hidden;
  .headerbar {
    z-index: 99999;
    position: fixed;
    height: 30px;
    top: 0px;
    width: 100%;
    background: #1c76dc;
  }
  .header-group {
    margin-top: 30px;
  }
  .main {
    margin-top: 80px;
    /*card列表*/
    .card {
      display: flex;
      .rem(padding, 15);
      div {
        width: 33%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span:first-child {
          color: @them;
        }
        span:last-child {
          color: @font;
        }
        .special {
          display: inline-block;
          width: 80%;
          text-align: center;
        }
      }
    }
    .btn {
      .rem(margin-top, 60);
      .rem(padding, 40);
    }
    //话筒
    .voice {
      position: fixed;
      .rem(bottom, 25);
      width: 100%;
      text-align: center;
      color: @font;
      .video {
        .rem(height, 100);
        .rem(padding-top, 25);
        .rem(width, 100);
      }
    }
    .ios-mask {
      position: absolute;
      z-index: 999999999999999;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(149, 149, 149, 0.4);
    }
  }
}
</style>
