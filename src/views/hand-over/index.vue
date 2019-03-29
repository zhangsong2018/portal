<template>
  <div id="wrap">
    <div class="headerbar"></div>
    <header class="header">
      <!-- <div class="close" @click="closeLogin()">
             <div class="close_pic">
               <img src="@/static/images/close.png" alt="">
             </div>
      </div>-->
      <div class="close" @click="close()">
        <div class="close_pic">
          <img src="@/static/images/arrer_left.png" alt style="transform: scale(0.45)">
        </div>
      </div>
      <div class="title">
        <input type="text" v-model="searchData" placeholder="请输入姓名或房间号" class="search">
        <icon type="search" class="iconBox"></icon>
      </div>
      <div class="icon" @click="callSweep()">
        <img src="@/static/images/sys.png" style="transform: scale(0.45);">
      </div>
    </header>

    <div class="section" v-if="personList.length>0">
      <div v-if="longPressActive" class="tips-mask" @click="closeMask()"></div>
      <div class="filter">
        <p
          @click="show1 = !show1"
          style="margin-left: 50px;font-size: 14px;display: flex;align-items: center;"
        >
          <span :style="{'color':optionsShow?'#1c76dc':'#282828'}">筛选</span>
          <img src="@/static/images/sx.png" style="width: 20px;height: 18px;margin-left:3px">
        </p>
      </div>
      <div class="adduser_list">
        <div
          :key="index"
          class="userlist_item"
          :class="{'active':item.priority=='1'}"
          :style="{'background':item.longPressActive?'#eeeeee':''}"
          v-for="(item,index) in Newitems"
          ref='colorBar'
          @touchstart="gtouchstart(item)"
          @touchmove="gtouchmove()"
          @touchend="gtouchend(item,index)"
        >
          <p class="usernum">{{item.bedCode}}</p>
          <p class="username">{{item.name}}</p>
          <p class="usersex">
            <span v-if="item.gender == 'Male'">
              <img src="@/static/images/nan.png" style="transform:scale(0.5);margin-top:5px">
            </span>
            <span v-if="item.gender != 'Male'">
              <img src="@/static/images/nv.png" style="transform:scale(0.5);margin-top:5px">
            </span>
          </p>
          <p class="userfuwu">{{item.abilityLevel}}</p>
          <ul class="my-tips" :style="{'display':item.longPressActive?'block':'none'}" ref="myTips">
            <li @touchend.stop="remove(item)" ref="remove">移除住户</li>
            <li @touchend.stop="setTopTop(item)" ref="setTop" v-if="item.priority=='0'">置顶</li>
            <li @touchend.stop="cancelToTop(item)" ref="cancelTop" v-if="item.priority=='1'">取消置顶</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="section" v-if="personList.length==0 && sectionShow">
      <div class="adduser_list">
        <img
          src="@/static/images/no_data.png"
          style="transform:translateX(-50%);margin-left: 50%;width: 120px;height: 120px;margin-top:150px;"
        >
        <p style="text-align: center;margin-top:15px;font-size: 14px;color: #282828;">无匹配结果</p>
      </div>
      <div class="sub_btns" @click="reset()">重置筛选项</div>
    </div>
    <div class="section" v-if="personList.length==0 && !sectionShow">
      <div class="adduser_list">
        <img
          src="@/static/images/sysIcon.png"
          style="transform:translateX(-50%);margin-left: 50%;width: 120px;height: 120px;margin-top:150px;"
        >
        <p style="text-align: center;margin-top:15px;font-size: 14px;color: #282828;">请扫码添加住户</p>
      </div>
      <div class="sub_btn" @click="callSweep()">扫一扫</div>
    </div>
    <toast v-model="show" type="text" :position="position" width="20em">{{conText}}</toast>

    <div class="mask_box" v-if="isShows | isShowLogin  |listShowMenu"></div>
    <ul class="lists" v-if="listShowMenu">
      <li
        :key="index"
        class="list_item"
        v-for="(item,index) in tenants"
        @click="tabMenu(item)"
      >{{item.name}}</li>
    </ul>
    <div class="dialog" v-if="isShows">
      <div class="dialog-content">
        <h3 class="title_dialog">提示</h3>
        <p class="textBox">您确定要移除么？</p>
        <div class="btn-group">
          <div class="btn" @click="isShows = !isShows">取消</div>
          <div class="btn" @click="subut()">确认</div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="isShowLogin">
      <div class="dialog-content">
        <h3 class="title_dialog">提示</h3>
        <p class="textBox">您确定要退出登录？</p>
        <div class="btn-group">
          <div class="btn" @click="isShowLogin = !isShowLogin">取消</div>
          <div class="btn" @click="close()">确认</div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show1">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          :left-text="cancel"
          :right-text="done"
          title="请按条件筛选"
          :show-bottom-border="false"
          @on-click-left="reset()"
          @on-click-right="fulfil()"
        ></popup-header>
        <div style="display: flex;">
          <div style="width: 100px">
            <p class="tab_item" @click="tabMenuList(0)" :class="{'actives':numitem=='0'}">照护等级</p>
            <p class="tab_item" @click="tabMenuList(1)" :class="{'actives':numitem=='1'}">所在楼层</p>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll;" v-if="numitem == 0">
            <group gutter="0">
              <radio title="title" :options="options" v-model="value"></radio>
            </group>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll;" v-if="numitem == 1">
            <group gutter="0">
              <radio title="title" :options="optionsnum" v-model="valuenum"></radio>
            </group>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <!--<loading :show="show2" text></loading>-->
      <YC-load style="top: 80px;" @childEvent="toParent" :pageType="type"></YC-load>
    </div>
  </div>
</template>
<script>
import {
  PopupHeader,
  Popup,
  Radio,
  Icon,
  Toast,
  Group,
  XSwitch,
  XButton,
  Loading,
  TransferDomDirective as TransferDom
} from "vux";
import Vue from "vue";
import * as sysApi from "../../services/sys";
import getDsBridge from "@/static/js/getDsBridge.js";
import MUTATINTYPE from "@/store/modules/hand-over/type/muations-type.js";
var Authorization = getDsBridge.getToken();
export default {
  name: "HelloWorld",
  data() {
    return {
      type: {
        isShow: true, //是否显示
        pageType: "loading", //显示类型
        text: "正在加载...",  // 用户自定义显示文字
        errName: "loadData",//需要重新调用的方法名
      },
      title: "添加用户",
      num: 1,
      show: false,
      show2: false,
      rid: "",
      conText: "",
      position: "default",
      isshowAlert: false,
      isShows: false,
      userInfo: "",
      isShowLogin: false,
      isShowss: false,
      personList: [],
      rids: [],
      addShow: true,
      tenant: {},
      tenants: [],
      listShowMenu: false,
      timeOutEvent: 0,
      longPressActive: false,
      sectionShow: false,
      optionsShow: false,
      searchData: "",
      list: [],
      show1: false,
      numitem: 0,
      value: "全部",
      valuenum: "全部",
      done: "完成",
      cancel: "重置",
      options: [
        "全部",
        "基础服务",
        "照护一级",
        "照护二级A",
        "照护二级B",
        "照护三级A",
        "照护三级B",
        "照护三级B（失智）"
      ],
      optionsnum: ["全部", "1", "2", "3", "5", "6", "7", "8", "9", "10", "11"]
    };
  },
  created() {
    this.init();
    this.getUserInfo();
    this.setUserInfo();
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
    Icon,
    PopupHeader,
    Popup,
    Radio
  },
  computed: {
    Newitems() {
      var _this = this;
      var Newitems = [];
      _this.personList.map(function(item) {
        if (
          item.bedCode.search(_this.searchData) != -1 ||
          item.name.search(_this.searchData) != -1
        ) {
          Newitems.push(item);
        }
      });
      return Newitems;
    }
  },
  methods: {
    toParent(v) {
      if (v == 'errorData') {
        // this.getTenantId();
      }
    },
    reset() {
      this.show1 = false;
      this.value = "全部";
      this.valuenum = "全部";
      this.optionsShow = false;
      this.init();
    },
    fulfil() {
      //完成
      this.show1 = false;
      var _this = this;
      var url = this.url;
      var Newitem = [];
      $.ajax({
        type: "post", //请求方式
        url: url + "/api/services/app/OmsCareService/MoCareRelationQuery",
        dataType: "json", //跨域json请求一定是jsonp
        timeout: 10000,
        headers: {
          Authorization: "Bearer " + Authorization,
          "Oms-Tenant-Id": localStorage.getItem('tenantId')
        },
        data: {
          //"TenantId":localStorage.getItem('tenantId'),
          StaffId: _this.StaffId
        },
        success: function(data) {
          if (data.success) {
            if (_this.value == "全部" && _this.valuenum == "全部") {
              _this.personList = data.result.items;
              _this.optionsShow = false;
            } else {
              data.result.items.map(function(item) {
                if (
                  item.abilityLevel.search(_this.value) != -1 &&
                  _this.valuenum == "全部"
                ) {
                  Newitem.push(item);
                } else if (
                  item.bedCode.substring(0, 1).search(_this.valuenum) != -1 &&
                  _this.value == "全部"
                ) {
                  Newitem.push(item);
                } else if (
                  item.abilityLevel.search(_this.value) != -1 &&
                  item.bedCode.substring(0, 1).search(_this.valuenum) != -1
                ) {
                  Newitem.push(item);
                }
              });
              if (Newitem.length == 0) {
                _this.sectionShow = true;
              }
              if (Newitem.length > 0) {
                _this.optionsShow = true;
              }
              _this.personList = Array.from(new Set(Newitem));
            }
          }
        },
        complete: function(XMLHttpRequest, status) {
          //当请求完成时调用函数
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          let status = XMLHttpRequest.status;
          if (status != 200) {
            _this.showServeUnknowError({
              onCancel() {
                ajaxSend();
              }
            });
          }
        }
      });
    },
    closeLogin() {
      this.isShowLogin = true;
    },
    tabMenuList(item) {
      this.numitem = item;
    },
    close() {
      // 和安卓交互 关闭当前页  异步
      // dsBridge.call("testAsyn","testAsyn", function (v) {
      //   alert("你好世界")
      // });
      // this.isShowLogin = false;
      // var storage = window.localStorage;
      // storage.clear();
      // window.history.length = 0;
      this.$router.push({
        path: "index",
        name: "index"
      });
    },
    closeMask() {
      this.longPressActive = false;
      this.personList.forEach(function(item, i) {
        if (item.longPressActive) {
          item.longPressActive = false;
        }
      });
    },
    //开始按
    gtouchstart(item) {
      var _this = this;
      this.timeOutEvent = setTimeout(function() {
        _this.longPress(item);
      }, 500); //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
      return false;
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gtouchend(item,index) {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
        this.toCarePlan(item,index);
      }
      return false;
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },

    //真正长按后应该执行的内容
    longPress(item) {
      this.timeOutEvent = 0;
      //执行长按要执行的内容，如弹出菜单
      item.longPressActive = true;
      this.longPressActive = true;
    },
    removeUser(item) {
      var _this = this;
      var url = this.url;
      function ajaxSend() {
        _this.show2 = true;
        _this.type.isShow = true;
        $.ajax({
          type: "post", //请求方式
          url: url + "/api/services/app/OmsCareService/MoRemoveCareRelation",
          dataType: "json", //跨域json请求一定是jsonp
          timeout: 10000,
          headers: {
            Authorization: "Bearer " + Authorization,
            "Oms-Tenant-Id": localStorage.getItem('tenantId')
          },
          data: {
            //"TenantId":localStorage.getItem('tenantId'),
            Id: item.id
          },
          success: function(data) {
            _this.position = "middle";
            _this.show = true;
            _this.conText = "移除成功";
            _this.init();
            _this.show2 = false;
            _this.type.isShow = false;
            _this.longPressActive = false;
          },
          complete: function(XMLHttpRequest, status) {
            //当请求完成时调用函数
            _this.show2 = false;
            _this.type.isShow = false;
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            let status = XMLHttpRequest.status;
            if (status != 200) {
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSend();
                }
              });
            }
          }
        });
      }
      ajaxSend();
    },
    setTopTop(item) {
      var _this = this;
      var url = this.url;
      this.show2 = true;
      _this.type.isShow = true;
      function ajaxSend() {
        $.ajax({
          type: "post", //请求方式
          url:
            url + "/api/services/app/OmsCareService/MoSetCareRelationPriority",
          dataType: "json", //跨域json请求一定是jsonp
          timeout: 10000,
          headers: {
            Authorization: "Bearer " + Authorization,
            "Oms-Tenant-Id": localStorage.getItem('tenantId')
          },
          data: {
            //"TenantId":localStorage.getItem('tenantId'),
            Id: item.id,
            Priority: 1
          },
          success: function(data) {
            _this.position = "middle";
            _this.show = true;
            _this.conText = "置顶成功";
            _this.init();
            _this.show2 = false;
            _this.type.isShow = false;
            _this.longPressActive = false;
          },
          complete: function(XMLHttpRequest, status) {
            //当请求完成时调用函数
            _this.show2 = false;
            _this.type.isShow = false;
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            let status = XMLHttpRequest.status;
            if (status != 200) {
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSend();
                }
              });
            }
          }
        });
      }
      ajaxSend();
    },
    cancelToTop(item) {
      var _this = this;
      var url = this.url;
      this.show2 = true;
      _this.type.isShow = true;
      function ajaxSend() {
        $.ajax({
          type: "post", //请求方式
          url:
            url + "/api/services/app/OmsCareService/MoSetCareRelationPriority",
          dataType: "json", //跨域json请求一定是jsonp
          timeout: 10000,
          headers: {
            Authorization: "Bearer " + Authorization,
            "Oms-Tenant-Id": localStorage.getItem('tenantId')
          },
          data: {
            //"TenantId":localStorage.getItem('tenantId'),
            Id: item.id,
            Priority: 0
          },
          success: function(data) {
            _this.position = "middle";
            _this.show = true;
            _this.conText = "取消置顶成功";
            _this.init();
            _this.show2 = false;
            _this.type.isShow = false;
            _this.longPressActive = false;
          },
          complete: function(XMLHttpRequest, status) {
            //当请求完成时调用函数
            _this.show2 = false;
            _this.type.isShow = false;
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            let status = XMLHttpRequest.status;
            if (status != 200) {
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSend();
                }
              });
            }
          }
        });
      }
      ajaxSend();
    },
    setUserInfo() {
      var storage = window.localStorage;
      var userInfo = JSON.parse(storage.getItem("userInfo"));
      if (userInfo) {
        this.personList = userInfo;
      }
    },
    callSweep() {
      dsBridge.call("callSweep", "callSweep");
    },
    init() {
      var _this = this;
      var url = this.url;
      function ajaxSend() {
        _this.show2 = true;
        _this.type.isShow = true;
        $.ajax({
          type: "post", //请求方式
          url: url + "/api/services/app/OmsCareService/MoCareRelationQuery",
          dataType: "json", //跨域json请求一定是jsonp
          timeout: 10000,
          headers: {
            Authorization: "Bearer " + Authorization,
            "Oms-Tenant-Id": localStorage.getItem('tenantId')
          },
          data: {
            //"TenantId":localStorage.getItem('tenantId'),
            StaffId: _this.StaffId
          },
          success: function(data) {
            if (data.success) {
              _this.show2 = false;
              _this.type.isShow = false;
              _this.personList = data.result.items;
            }
          },
          complete: function(XMLHttpRequest, status) {
            //当请求完成时调用函数
            _this.show2 = false;
            _this.type.isShow = false;
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            let status = XMLHttpRequest.status;
            if (status != 200) {
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSend();
                }
              });
            }
          }
        });
      }
      ajaxSend();
    },
    getUserInfo() {
      //扫码获取rid 请求用户信息
      var _this = this;
      var url = this.url;
      dsBridge.registerAsyn("getuserinfo", function(arg1, arg2) {
        _this.rid = arg1;
        //_this.rid = 268;
        if (_this.rid != 0) {
          function ajaxSend() {
            _this.show2 = false;
            _this.type.isShow = false;
            $.ajax({
              type: "post", //请求方式
              url: url + "/api/services/app/OmsCareService/MoCareResidentGet",
              dataType: "json", //跨域json请求一定是jsonp
              timeout: 10000,
              headers: {
                Authorization: "Bearer " + Authorization,
                "Oms-Tenant-Id": localStorage.getItem('tenantId')
              },
              data: {
                ResidentId: _this.rid,
                //"TenantId":localStorage.getItem('tenantId'),
                StaffId: _this.StaffId
              },
              success: function(data) {
                //限制重复添加
                _this.personList.forEach(function(v, i) {
                  if (
                    v.id == data.result.careRelationId ||
                    v.careRelationId == data.result.careRelationId
                  ) {
                    _this.position = "middle";
                    _this.show = true;
                    _this.conText = "用户已存在！";
                    _this.show2 = false;
                    _this.type.isShow = false;
                    _this.addShow = false;
                    return false;
                  }
                });
                if (!data.success) {
                  _this.position = "middle";
                  _this.show = true;
                  _this.show2 = false;
                  _this.type.isShow = false;
                  _this.conText = "无效的二维码！";
                }
                if (
                  data.result.customerName == "" ||
                  data.result.customerName == null
                ) {
                  _this.position = "middle";
                  _this.show = true;
                  _this.conText = "没有找到该住户信息!";
                  _this.show2 = false;
                  _this.type.isShow = false;
                  return false;
                }
                if (_this.addShow) {
                  var result = data.result;
                  result.residentId = _this.rid;
                  result.name = result.customerName;
                  _this.personList.unshift(result);
                  _this.position = "middle";
                  _this.show = true;
                  _this.conText = "添加成功";
                  _this.show2 = false;
                  _this.type.isShow = false;
                  _this.init();
                }
                _this.addShow = true;
              },
              complete: function(XMLHttpRequest, status) {
                //当请求完成时调用函数
                _this.show2 = false;
                _this.type.isShow = false;
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                let status = XMLHttpRequest.status;
                if (status != 200) {
                  _this.showServeUnknowError({
                    onCancel() {
                      ajaxSend();
                    }
                  });
                }
              }
            });
          }
          ajaxSend();
        } else {
          _this.position = "middle";
          _this.show = true;
          _this.conText = "无效的二维码！";
        }
      });
    },
    remove(item) {
      item.longPressActive = false;
      this.longPressActive = false;
      this.isShows = true;
      this.userInfo = item;
    },
    subut() {
      this.isShows = false;
      this.removeUser(this.userInfo);
    },
    toCarePlan(item,index) {
      this.$refs['colorBar'][index].classList.add('addclass')
      this.$store.commit(MUTATINTYPE.USER_INFO, item);
      this.$router.push({
        path: "/hand/InfoAdd"
      });
    },
    listShow() {
      this.listShowMenu = true;
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
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
.popupbox {
  width: 100%;
}
html,
body {
  width: 100%;
  height: 100%;
}
#wrap {
  width: 100%;
  min-height: 100%;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
}
.addclass{
   background: #f4f4f4 !important;
}
.section {
  margin-top: 80px;
  background: #f4f4f4;
  overflow-y: auto;
  flex: 1;
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
  position: fixed;
  top: 30px;
  display: flex;
  z-index: 499;
}
.title {
  flex: 7;
  color: #fff;
  font-weight: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  position: relative;
}
.iconBox {
  position: absolute;
  left: 8px;
  font-size: 16px;
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
.sub_btn {
  width: 100%;
  height: 50px;
  text-align: center;
  color: #fff;
  background: #0077d9;
  line-height: 50px;
  font-size: 16px;
  position: fixed;
  bottom: 0;
}
.sub_btns {
  width: 220px;
  height: 40px;
  text-align: center;
  color: #0077d9;
  background: #fff;
  border: 1px solid #0077d9;
  line-height: 40px;
  font-size: 16px;
  margin: 50px auto;
  border-radius: 5px;
}

.userlist_item {
  width: 100%;
  background: #ffffff;
  display: flex;
  height: 50px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.active {
  background: #f2f2f2;
}
.username {
  flex: 0.8;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.usersex {
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
}
.usernum {
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userfuwu {
  flex: 3;
  display: flex;
  justify-content: left;
  align-items: center;
}

.line {
  width: 1px;
  height: 25px;
  background: #bfbfbf;
  margin: 12px 0px;
  float: left;
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
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
}
.tenant {
  height: 35px;
  line-height: 35px;
  width: 100%;
  background: #fff;
  margin-top: 70px;
  color: #282828;
  position: relative;
}
.icon_tab {
  width: 35px;
  height: 35px;
  position: absolute;
  right: 15px;
  top: 0;
}
.lists {
  width: 80%;
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 100;
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
.my-tips {
  position: absolute;
  display: none;
  background: #fff;
  z-index: 1000;
  right: 15%;
  top: 20px;
  box-shadow: 0 0 5px #eee;
  border-radius: 4px;
  width: 100px;
}
.my-tips li {
  height: 35px;
  line-height: 35px;
  text-align: left;
  text-decoration: none;
  list-style: none;
  font-size: 14px;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  color: #282828;
}
/*设置一像素边线*/
.my-tips li:after {
  position: absolute;
  content: " ";
  top: 0;
  left: 0;
  -webkit-transform-origin: top left;
  transform-origin: top left;
  width: 100%;
  height: 100%;
  -webkit-transform: scale(1);
  transform: scale(1);
  border-bottom: 1px solid #eee;
}
.my-tips li:last-child:after {
  display: none;
}
.tips-mask {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}
.search {
  width: 90%;
  background: #fff;
  border: 0;
  border-radius: 5px;
  height: 30px;
  font-size: 14px;
  padding-left: 30px;
}
.filter {
  height: 40px;
  line-height: 40px;
  background: #fff;
  margin-bottom: 3px;
}
.tab_item {
  line-height: 45px;
  text-align: center;
  font-size: 16px;
}
.actives {
  background: #fff;
}
.wrap >>> .vux-popup-header-right {
  color: #0077d9;
}
</style>

