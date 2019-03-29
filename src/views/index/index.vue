<template>
  <div id="wrap">
    <div class="headerbar"></div>
    <header class="header">
      <div class="close" @click="close()">
        <div class="close_pic">
          <img src="@/static/images/arrer_left.png" alt style="transform: scale(0.45)">
        </div>
      </div>
      <h2 class="title">
        <span>养老运营系统</span>
      </h2>
      <div class="icon"></div>
    </header>
    <div class="tenant">
      <span style="margin-left:15px;margin-right: 10px;">当前机构:</span>
      {{tenant.name}}
      <div class="icon_tab" @click="listShow()" v-if="myTenants.length>0">
        <!-- <img src="@/static/images/icon_tab.png" style="transform: scale(0.6);"> -->
        切换机构
      </div>
    </div>
    <section style="margin: 0">
      <grid class="big_box">
        <grid-item class="big_box_item" @click.native="toAdduser()" v-if="CreateActionPlan">
          <img src="@/static/images/zhzx.png">
          <p style="color:black">照护执行</p>
        </grid-item>
        <grid-item class="big_box_item" @click.native="toAdduserBP()" v-if="VitalSignCreate">
          <img src="@/static/images/yzgl.png">
          <p style="color:black">生命体征</p>
        </grid-item>
        <grid-item class="big_box_item" @click.native="toUserListCRM()" v-if="CrmCommunications" style="width: 33%">
          <img src="@/static/images/crm.png">
          <p style="color:black">CRM</p>
        </grid-item>
        <grid-item class="big_box_item" @click.native="toHandOver()" v-if='HandShiftExchange'>
          <img src="@/static/images/handover/handover.png">
          <p style="color:black">交接班</p>
        </grid-item>
      </grid>
      <!-- <p @click="toAdduser()" class="title">跳转照护执行</p>
      <p @click="toAdduserBP()" class="title">跳转生命体征</p>-->
    </section>
    <toast v-model="show" type="text" :position="position" width="20em">{{conText}}</toast>
    <div class="mask_box" v-if="isShowLogin |listShowMenu" @click="closeList()"></div>
    <ul class="lists_box" v-if="listShowMenu">
      <li
        class="list_item"
        :key="i"
        v-for="(item,i) in myTenants"
        @click="tabMenu(item)"
      >{{item.name}}
      </li>
    </ul>
    <div v-transfer-dom>
      <!--<loading :show="show2" text></loading>-->
    </div>
    <div class="dialog" v-if="isShowLogin">
      <div class="dialog-content">
        <h3 class="title_dialog">提示</h3>
        <p class="textBox">您确定要退出吗？</p>
        <div class="btn-group">
          <div class="btn" @click="isShowLogin = !isShowLogin">取消</div>
          <div class="btn" @click="close()">确认</div>
        </div>
      </div>
    </div>
    <YC-load style="top: 115px;" @childEvent="toParent" :pageType="type"></YC-load>
  </div>
</template>

<script>
  import {Grid, GridItem, Group, Loading, Toast, TransferDomDirective as TransferDom, XButton, XSwitch} from "vux";
  import Vue from "vue";
  import * as sysApi from "../../services/sys";

  export default {
    name: "HelloWorld",
    data() {
      return {
        type: {
          isShow: true, //是否显示
          pageType: "error", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        },
        title: "首页",
        show: false,
        conText: "",
        position: "default",
        isShowLogin: false,
        tenant: {},
        myTenants: [],
        listShowMenu: false,
        VitalSignCreate: false,
        CreateActionPlan: false,
        CrmCommunications: false,
        HandShiftExchange: false,
        // show2: false
      };
    },
    created() {
      this.getTenantId();
    },
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Toast,
      Group,
      XSwitch,
      XButton,
      Grid,
      GridItem,
    },
    methods: {
      getTenantId() {
        //单点
        // this.show2 = true;
        this.type =  {
          isShow: true, //是否显示
          pageType: "loading", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        }
        sysApi
          .CurrentLoginInformations()
          .then(res => {
            if (res.success) {
              this.tenant = res.result.tenant; //当前机构
              if (res.result.myTenants) {
                this.myTenants = res.result.myTenants;
              } else {
                this.myTenants = [];
              }
              localStorage.setItem("tenantId", res.result.tenant.id); // 存入一个值
              Vue.prototype.StaffId = res.result.user.id; //员工id
              Vue.prototype.TenantId = res.result.tenant.id; //机构id
              //权限接口
              sysApi
                .GrantedPermissions({
                  id: res.result.user.id
                })
                .then(res => {
                  if (res.success) {
                    if (
                      res.result.grantedPermissionNames.indexOf(
                        "Resthome.Medical.VitalSign.Create"
                      ) != -1
                    ) {
                      this.VitalSignCreate = true;
                    }
                    if (
                      res.result.grantedPermissionNames.indexOf(
                        "Resthome.CareImplement.CreateActionPlan"
                      ) != -1
                    ) {
                      this.CreateActionPlan = true;
                    }
                    if (
                      res.result.grantedPermissionNames.indexOf(
                        "Resthome.CrmContacts.Create"
                      ) != -1
                    ) {
                      this.CrmCommunications = true;
                    }

                    if (
                      res.result.grantedPermissionNames.indexOf(
                        "Resthome.ShiftExchange"
                      ) != -1
                    ) {
                      this.HandShiftExchange = true;
                      localStorage.setItem('hand', true)
                    } else {
                      localStorage.setItem('hand', false)
                    }
                    // this.show2 = false;
                    this.type.isShow = false;
                  }
                })
                .catch(error => {
                  this.type =  {
                    isShow: true, //是否显示
                    pageType: "error", //显示类型
                    text: "服务器异常...",  // 用户自定义显示文字
                    errName: "errorData",//需要重新调用的方法名
                  }
                  // this.$vux.toast.text("请求失败，接口异常", "center");
                  console.log(error);
                });
            }
          })
          .catch(error => {
            // this.show2 = false;
            this.type =  {
              isShow: true, //是否显示
              pageType: "error", //显示类型
              text: "服务器异常...",  // 用户自定义显示文字
              errName: "errorData",//需要重新调用的方法名
            }
            // this.$vux.toast.text("请求失败，接口异常", "center");
            console.log(error);
          });
      },
      closeList() {
        this.listShowMenu = false;
      },
      close() {
        // 和安卓交互 关闭当前页  异步
        dsBridge.call("testAsyn", "testAsyn", function (v) {
          alert("你好世界");
        });
        this.isShowLogin = false;
        var storage = window.localStorage;
        storage.clear();
        window.history.length = 0;
      },
      listShow() {
        this.listShowMenu = true;
      },
      tabMenu(item) {
        localStorage.setItem("tenantId", item.id); // 存入一个值
        this.listShowMenu = false;
        this.VitalSignCreate = false;
        this.CreateActionPlan = false;
        this.CrmCommunications = false;
        this.HandShiftExchange = false;
        this.getTenantId();
      },
      toAdduser() {
        this.$router.push({
          path: "index/AddUser",
          name: "AddUser"
        });
      },
      toAdduserBP() {
        this.$router.push({
          path: "index/AddUserBP",
          name: "AddUserBP"
        });
      },
      toUserListCRM() {
        this.$router.push({
          path: "index/UserListCRM",
          name: "UserListCRM",
          params: {
            degree: "null",
            endDistributeTime: "null",
            nextDate: "null",
            endNextDate: "null",
            isRemindCycle: false,
            operationUserId: 'null',
            sorting: 'null'
          }
        });
      },
      toHandOver() {
        this.$router.push({path: "/hand/index"});
      },
      toParent(v) {
        if (v == 'errorData') {
          this.getTenantId();
        }
      },
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          alert(val);
        },
        // 深度观察监听
        deep: true
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,
  body {
    width: 100%;
    height: 100%;
  }

  #wrap {
    width: 100%;
    min-height: 100%;
    background: #f4f4f4;
  }

  .section {
    margin-bottom: 60px;
  }

  .headerbar {
    width: 100%;
    height: 30px;
    background: #1c76dc;
    position: fixed;
    top: 0px;
  }

  .header {
    width: 100%;
    height: 50px;
    background: #1c76dc url(../../static/images/sy.png) no-repeat;
    background-size: cover;
    top: 30px;
    position: fixed;
    display: flex;
    z-index: 55;
  }

  .title {
    flex: 7;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
  }

  .close {
    flex: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 26px;
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

  section {
    margin-top: 80px;
  }

  .dialog {
    position: relative;
  }

  .dialog-content {
    position: fixed;
    box-sizing: border-box;
    width: 85%;
    min-height: 170px;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background: #fff;
    z-index: 50002;
  }

  .title_dialog {
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    color: #282828;
    margin-top: 20px;
  }

  .textBox {
    height: 70px;
    font-size: 16px;
    line-height: 70px;
    color: #282828;
    text-align: center;
  }

  .btn-group {
    display: flex;
    height: 50px;
    border-top: 0.1px solid #d5d5d6;
  }

  .btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #999999;
  }

  .btn:last-child {
    color: #0077d9;
    border-left: 0.1px solid #d5d5d6;
  }

  .mask_box {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
  }

  .tenant {
    height: 35px;
    line-height: 35px;
    width: 100%;
    background: #fff;
    margin-top: 80px;
    color: #282828;
    position: relative;
  }

  .icon_tab {
    height: 35px;
    position: absolute;
    right: 15px;
    top: 0;
    color: #0077d9;
  }

  .lists_box {
    width: 80%;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 1001;
  }

  .list_item {
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #b7b7b7;
    font-size: 16px;
    color: #282828;
  }

  .list_item:last-child {
    border: none;
  }

  .big_box {
    background: #fff;
    margin-top: 15px;
  }

  .big_box_item {
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
  }

  .big_box_item img {
    width: 40px;
    height: 40px;
  }

  .big_box_item p {
    margin-top: 3px;
  }
</style>

