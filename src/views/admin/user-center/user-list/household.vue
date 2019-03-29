<template>
  <div class="wrpas">
    <div class="header-fixed">
      <div class="header-bar"></div>
      <headerGroup
        style="position:fixed;top:30px;"
        @on-menu="sidebar"
        :rightImg="screenImg"
        title="住户中心"
      ></headerGroup>
    </div>
    <!--输入框-->
    <group class="group">
      <x-input :max="16" :show-clear="true" placeholder="请输入姓名或房间床位号" v-model="search.FilterText">
        <icon is-img slot="label" type="search"></icon>
        <x-button @click.native="userSearch" slot="right" type="default" mini>搜索</x-button>
      </x-input>
    </group>
    <!--meScroll-->
    <main ref="scroll" id="main" class="main mescroll">
      <div>
        <section :key="index" v-for="(item,index) in data" class="areo">
          <div @click="goWorkers(item)" class="left">
            <p class="number">{{item.facilityBedCode?item.facilityBedCode:'未预约'}}</p>
            <p :class="['color'+item.residentState]" class="switch">{{item.residentStateStr}}</p>
          </div>
          <div @click="goWorkers(item)" class="center">
            <span class="sex">{{item.genderStr}}</span>
            <b class="name">{{item.name}}</b>
            <span v-show="item.careLevelName" class="grade">{{item.careLevelName}}</span>
            <span>{{item.age}}岁</span>
          </div>
          <div class="right">
            <div @click="details(item.id)" class="content">
              <img class="imgs" :src="success" alt>
            </div>
            <div @click="goWorkers(item)">
              <img class="imgs rightImage" src="@/static/images/hourse/right.png" alt>
            </div>
          </div>
        </section>
      </div>
    </main>
    <!--话筒-->
    <div v-show="maikeStatus" class="maike">
      <div class="maike-mask">
        <img class="maike-img" src="@/static/images/hourse/audio.png" alt>
      </div>
    </div>
    <loading @childEvent="netError" :pageType="loading"></loading>
    <confirm
      :hide-on-blur="true"
      :show-cancel-button="false"
      :show-confirm-button="false"
      class="confirm"
      theme="android"
      title="紧急联系人"
      v-model="confirm.show"
    >
      <div>
        <p>姓名:{{confirm.data.name}}</p>
        <p>性别:{{confirm.data.sex}}</p>
      </div>
      <div>
        <p>家庭地址:{{confirm.data.adders}}</p>
      </div>
      <div>
        <img class="imgCall" src="@/static/images/hourse/call.png" alt>
        <a
          @click.stop="confirm.show = false"
          :href="'tel:'+confirm.data.tel"
          class="call"
        >{{confirm.data.tel}}</a>
      </div>
    </confirm>
    <popup style="background:#fff" v-model="control.aside" position="right" should-rerender-on-show>
      <mask-view @on-sub="subData"></mask-view>
    </popup>
  </div>
</template>

<script>
import headerGroup from "../public/header.vue";
import success from "@/static/images/hourse/people.png";
import error from "@/static/images/hourse/unsubscribe.png";
import { XInput, Icon, XButton, Group, Confirm, Popup } from "vux";
import MeScroll from "mescroll.js";
import "mescroll.js/mescroll.min.css";
import screenImg from "@/static/images/hourse/app.png";
import errorImg from "@/static/images/no_data.png";
//侧边栏抽离出来maskView
import maskView from "./mask";
//接口
import { OmsHourseQuery } from "@/services/hourse-face.js";
//loading
import loading from "@/components/Loading.vue";
export default {
  components: {
    headerGroup,
    XInput,
    Icon,
    XButton,
    Group,
    Confirm,
    Popup,
    maskView,
    loading
  },
  data() {
    return {
      //话筒状态
      maikeStatus: false,
      //loading errror
      loading: {
        pageType: "error",
        isShow: false
      },
      //input 搜索
      search: {
        FilterText: ""
      },
      control: {
        aside: false //右边栏配置
      },
      screenImg, //头部img传递
      mescroll: null, //mescroll实例
      //confirm 数据配置
      confirm: {
        show: false,
        data: {
          adders: "",
          name: "",
          sex: "",
          tel: null
        }
      },
      //图片
      success,
      error,
      //真实数据
      data: []
    };
  },
  mounted() {
    let _this = this;
    this.scroll(this.$refs.scroll, {
      up: {
        callback: this.getUserList,
        page: {
          num: 0,
          size: 10
        },
        empty: {
          warpId: "main",
          icon: errorImg,
          tip: "暂无相关数据~",
          btntext: "重新加载",
          btnClick() {
            _this.mescroll.resetUpScroll();
          },
          supportTap: false
        },
        noMoreSize: 5,
        isLock: false,
        isBoth: true,
        isBounce: true,
        htmlNodata: '<p class="upwarp-nodata">-- 没有更多了 --</p>',
        toTop: {
          warpId: "main",
          src: "./static/mescroll/mescroll-totop.png",
          html: `<div style='width:30px;height:30px'><img width='100%' height='100%' src='./static/mescroll/mescroll-totop.png'></div>`,
          offset: 1000,
          warpClass: "mescroll-totop",
          showClass: "mescroll-fade-in",
          hideClass: "mescroll-fade-out",
          duration: 300,
          supportTap: false
        }
      },
      down: {
        callback(mescroll) {
          mescroll.resetUpScroll();
        }
      }
    });
  },
  methods: {
    //侧边栏控制中心
    sidebar(params) {
      console.log("触发");
      //点击展开右边栏
      this.control.aside = !this.control.aside;
    },
    //子组件传递的事件
    subData(params) {
      //点击确认隐藏
      console.log(params);
      this.control.aside = params.close;
    },
    //跳转
    goWorkers(data) {
      console.log(data);
      this.$router.push({
        path: `/admin/userDetails/${data.id}`,
        query: {
          name: data.name,
          genderStr: data.genderStr,
          careLevelName: data.careLevelName,
          facilityBedCode: data.facilityBedCode,
          lifePictureId: data.lifePictureId
        }
      });
    },
    //即将到来的 mescroll
    scroll(id, obj) {
      this.mescroll = new MeScroll(id, obj);
    },
    //query查询列表
    getUserList(page, mescroll) {
      OmsHourseQuery({
        //分页
        SkipCount: (page.num - 1) * page.size,
        MaxResultCount: page.size,
        //搜索
        FilterText: this.search.FilterText
      })
        .then(res => {
          this.loading.isShow = false;
          if (page.num === 1) this.data = [];
          this.data = this.data.concat(res.result.items);
          this.$nextTick(_ => {
            mescroll.endSuccess(res.result.items.length);
            //-------话筒逻辑
            this.maikeStatus = true;
            this.maikeShow(true);
            this.maikeMsg();
            //------------
          });
        })
        .catch(e => {
          //网络接口失败 等等各种异常
          this.loading.pageType = "error";
          this.loading.isShow = true;
          this.maikeStatus = false;
          this.maikeShow();
          mescroll.endErr();
        });
    },
    userSearch() {
      this.mescroll.resetUpScroll(true);
    },
    //联系人数据
    details(id) {},
    //网络失败点击的时候
    netError() {
      this.mescroll.resetUpScroll(true);
    },
    maikeShow(boolean = false) {
      dsBridge.call("isShowbut", boolean);
    },
    //接受话筒信息
    maikeMsg() {
      let _this = this;
      dsBridge.registerAsyn("recordResult", function(a, b, c) {
        if (a) {
          _this.search.FilterText = ""; //先清空一下
          _this.search.FilterText = a;
          _this.mescroll.resetUpScroll(true);
        }
      });
    }
  },
  //组件消失
  beforeDestroy() {
    this.maikeStatus = false;
    this.maikeShow();
  },
  watch: {
    "control.aside"(newVal, oldVal) {
      if (newVal) {
        this.maikeStatus = false;
        this.maikeShow();
      } else {
        this.maikeStatus = true;
        this.maikeShow(true);
      }
    }
  }
};
</script>

<style scoped lang='less'>
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
@them: #1c76dc;
@font: #b4a49c;
.wrpas {
  background: white;
  .header-fixed {
    z-index: 100000;
    .header-bar {
      position: fixed;
      width: 100%;
      height: 30px;
      background: @them;
    }
    .header {
      margin-top: 30px;
    }
    position: fixed;
    width: 100%;
  }
  .group {
    position: fixed;
    width: 100%;
    top: 60px;
  }
  .main {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: auto;
    top: 130px;
    background: #f4f4f4;
    .areo {
      background: #fff;
      margin-bottom: 8px;
      .rem(height, 95);
      display: flex;
      justify-content: space-between;
    }
    .left {
      .rem(width, 120);
      .rem(margin-left, 20);
      text-align: center;
      .number {
        color: @them;
        font-weight: 600;
      }
      .switch {
        color: #fff;
        border-radius: 8px;
        font-size: 12px;
        .rem(padding-top, 3);
      }
      .color3 {
        background: #1c76dc;
      }
      .color2 {
        background: #89ca87;
      }
      .color4 {
        background: #d2d1d1;
      }
      .color5 {
        background: #d2d1d1;
      }
      .color1 {
        background: #ff4081;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .imgs {
        .rem(height, 50);
        .rem(width, 50);
      }
      .rightImage {
        .rem(margin-left, 20);
      }
      .content {
        display: flex;
        align-items: center;
      }
    }
    .center {
      display: flex;
      flex: 1;
      align-items: center;
      color: @font;
      .grade {
        .rem(width, 160);
        .rem(margin-right, 20);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .sex {
        .rem(margin-left, 23);
      }
      .name {
        .rem(margin-left, 23);
        .rem(margin-right, 23);
        color: #777474;
      }
    }
  }
  .maike {
    position: fixed;
    bottom: 35px;
    width: 100%;
    z-index: 999999;
    display: flex;
    justify-content: center;
    .maike-mask {
      .rem(width, 100);
      .rem(height, 100);
      background: @them;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .maike-img {
        .rem(width, 80);
        .rem(height, 80);
      }
    }
  }
  .confirm {
    .call {
      color: red;
      text-decoration: underline;
    }
    .imgCall {
      .rem(width, 35);
      .rem(height, 35);
    }
  }
}
</style>
