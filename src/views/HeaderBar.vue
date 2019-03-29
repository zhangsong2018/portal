<template>
  <div>
    <div class="headerbar"></div>
    <header class="header">
      <div class="close" @click="create(false)" v-if="isBP == 0">
        <div class="close_pic">
          <img src="@/static/images/arrer_left.png" alt style="transform: scale(0.45)">
        </div>
      </div>
      <div class="close" @click="createBP(false)" v-if="isBP == 1">
        <div class="close_pic">
          <img src="@/static/images/arrer_left.png" alt style="transform: scale(0.5)">
        </div>
      </div>
      <h2 class="title">
        <span>
          <slot>照护计划</slot>
        </span>
      </h2>
      <div class="icon" @click="listShow()">
        <img src="@/static/images/tabIcon.png" style="transform: scale(0.6);">
      </div>
    </header>
    <ul class="userList" v-if="showList">
      <li @click="close()">
        <router-link :to="'/VitalSigns/BloodSugar/'+rid+'/'+isBP">
          <span>血糖</span>
        </router-link>
      </li>
      <li @click="close()">
        <router-link :to="'/VitalSigns/BloodPressure/'+rid+'/'+isBP">
          <span>血压</span>
        </router-link>
      </li>
      <li @click="close()">
        <router-link :to="'/VitalSigns/Temperature/'+rid+'/'+isBP">
          <span>体温</span>
        </router-link>
      </li>
      <li @click="close()">
        <router-link :to="'/VitalSigns/Weight/'+rid+'/'+isBP">
          <span>体重</span>
        </router-link>
      </li>
      <li v-show='token' @click="close('交接班')">
        <a>
          <span>交接班</span>
        </a>
      </li>
    </ul>
    <div class="mask" v-if="isShowSuss" @click="close()"></div>
  </div>
</template>

<script>
import { toggleClass } from "@/utils/index";
export default {
  name: "HelloWorld",
  data() {
    return {
      token:false,
      title: "登录页",
      num: 1,
      radio: "success",
      showList: false,
      local: true,
      menuList: false,
      isShowSuss: false,
      rid: "",
      isBP: ""
    };
  },
  created() {
    this.getRid();
    this.create(true);
    localStorage.getItem('hand') == 'true' ? this.token = true  : this.token = false
  },
  methods: {
    getRid() {
      this.rid = this.$route.params.rid;
      this.isBP = this.$route.params.isBP;
      console.log(this.isBP);
    },
    create(boolean) {
      //话筒交互
      dsBridge.call("isShowbut", boolean, function(v) {
        // alert("Hello World")
      });
      if (!boolean) {
        this.$router.push({
          path: "CarePlan",
          name: "CarePlan",
          params: {
            rid: this.rid
          }
        });
      }
    },
    createBP(boolean) {
      //话筒交互
      dsBridge.call("isShowbut", boolean, function(v) {
        // alert("Hello World")
      });
      if (!boolean) {
        this.$router.push({
          path: "/index/AddUserBP",
          name: "AddUserBP"
        });
      }
    },
    listShow() {
      this.isShowSuss = true;
      this.showList = true;
    },
    close(token) {
      this.$emit('on-hand',token)
      this.isShowSuss = false;
      this.showList = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  width: 100%;
}
body {
  width: 100%;
  height: 100%;
}
.wrap {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
}
.headerbar {
  width: 100%;
  height: 30px;
  background: #1c76dc;
  position: fixed;
  top: 0px;
  z-index: 999;
}
.header {
  width: 100%;
  height: 50px;
  background: #1c76dc url(../static/images/sy.png) no-repeat;
  background-size: cover;
  position: fixed;
  top: 30px;
  z-index: 999;
  display: flex;
}
.active {
  top: 40px;
}
.title {
  flex: 7;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.title span {
  font-size: 20px;
}

.close {
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
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
}
.userList {
  width: 75px;
  background: #ffffff;
  border-radius: 5px;
  position: fixed;
  top: 80px;
  right: 10px;
  z-index: 999999;
}
.userList li {
  border-bottom: 1px solid #f0f0f0;
  height: 35px;
  line-height: 35px;
  text-align: center;
  display: flex;
}
.userList li:last-child {
  border: 0;
}
.userList li a span {
  width: 75px;
  display: inline-block;
  text-align: center;
  color: #282828;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.3);
}
</style>

