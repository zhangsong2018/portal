<template>
  <div id="app" v-title="title">
    <div class="wrap">
      <HeaderBar @on-hand="toHnad">体重</HeaderBar>
      <section class="section">
        <div class="personList">
          <p class="item" style="justify-content: left;padding-left: 30px ">{{person.customerName}}</p>
          <p class="item">{{person.age}}岁</p>
          <p class="item" v-if="person.bedCode">{{person.bedCode}}床</p>
          <p class="items">{{person.abilityLevel}}</p>
        </div>
        <div class="content_box" style="border: none">
          <span class="title">体重:</span>
          <span class="center">
            <input
              type="number"
              v-model="weight"
              class="t_width"
              oninput="if(value.length>6)value=value.slice(0,6)"
            >
          </span>
          <span class="unit">公斤</span>
        </div>
        <div class="content_box">
          <div class="center">
            <group>
              <datetime
                v-model="dataValue"
                format="YYYY-MM-DD HH:mm"
                :end-date="endDate"
                :title="$t('测量时间:')"
                @on-confirm="onConfirm"
              ></datetime>
            </group>
          </div>
        </div>
        <div class="sub_btn active" @click="save()">保存</div>
        <div class="sub_btn active1" @click="toHistory()">查看历史记录</div>
        <div class="footer">
          <p class="yuyin_dome">您可以说:体重50公斤</p>
          <div class="maike_pic">
            <img src="@/static/images/maike.png">
          </div>
        </div>
      </section>
    </div>
    <toast v-model="show" type="text" :position="position" width="20em">{{conTextAlert}}</toast>
    <!-- <div class="mask" v-if="show2"></div> -->
    <div v-transfer-dom v-if="isBP == 0">
      <confirm
        v-model="isShowSuss"
        :close-on-confirm="false"
        confirmText="继续录入"
        cancelText="返回照护计划"
        @on-confirm="subut"
        @on-cancel="close"
      >
        <p style="text-align:center;">{{ $t('录入成功！') }}</p>
      </confirm>
    </div>
    <div v-transfer-dom v-if="isBP == 1">
      <confirm
        v-model="isShowSuss"
        :close-on-confirm="false"
        confirmText="继续录入"
        cancelText="关闭"
        @on-confirm="subut"
        @on-cancel="closeBP"
      >
        <p style="text-align:center;">{{ $t('录入成功！') }}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <!-- <loading :show="show2" text=""></loading> -->
      <YC-load style="top: 80px;" @childEvent="toParent" :pageType="type"></YC-load>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/views/HeaderBar";
import {
  Toast,
  Confirm,
  AlertModule,
  Cell,
  Alert,
  Loading,
  Datetime,
  Group,
  XSwitch,
  XButton,
  TransferDomDirective as TransferDom
} from "vux";
import * as sysApi from "../../../services/sys";
import { mapGetters, mapActions, mapMutations } from "vuex";
import getDsBridge from "@/static/js/getDsBridge.js";
import MUTATINTYPE from "@/store/modules/hand-over/type/muations-type.js";
var Authorization = getDsBridge.getToken();
export default {
  data() {
    return {
      type: {
        isShow: true, //是否显示
        pageType: "loading", //显示类型
        text: "正在加载...", // 用户自定义显示文字
        errName: "loadData" //需要重新调用的方法名
      },
      title: "测体重",
      lang: "cn",
      num: 0,
      person: "",
      weight: "",
      dataValue: "",
      endDate: "",
      conText: "录入成功",
      position: "default",
      show: false,
      show2: false,
      isShowSuss: false,
      conTextAlert: "",
      rid: "1",
      isBP: ""
    };
  },
  created() {
    this.getUserInfo();
    this.vital_signs();
    this.defaultTime();
    this.endDateTime();
  },
  directives: {
    TransferDom
  },
  components: {
    HeaderBar: HeaderBar,
    Datetime,
    Group,
    Loading,
    XSwitch,
    XButton,
    Cell,
    Alert,
    Toast,
    Confirm
  },
  methods: {
    toParent() {},
    vital_signs() {
      // alert(dsBridge.call("vital_signs","vital_signs"))
      // this.menuList = dsBridge.call("vital_signs","vital_signs");
      var _this = this;
      //返给我数据
      dsBridge.registerAsyn("append", function(arg1, arg2) {
        var result = JSON.parse(arg1);
        result.forEach(function(v, i) {
          _this.weight = v.weight;
        });
      });
    },
    close() {
      this.rid = this.$route.params.rid;
      this.$router.push({
        path: "CarePlan",
        name: "CarePlan",
        params: {
          rid: this.rid
        }
      });
      this.create(false);
    },
    create(boolean) {
      //话筒交互
      dsBridge.call("isShowbut", boolean, function(v) {});
    },
    closeBP() {
      this.$router.push({
        path: "AddUserBP",
        name: "AddUserBP"
      });
      this.create(false);
    },
    defaultTime() {
      this.dataValue = this.dateFtt("yyyy-MM-dd hh:mm", new Date());
    },
    endDateTime() {
      this.endDate = this.dateFtt("yyyy-MM-dd", new Date());
    },
    dateFtt(fmt, date) {
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    getUserInfo() {
      this.rid = this.$route.params.rid;
      this.isBP = this.$route.params.isBP;
      var _this = this;
      var url = this.url;
      this.show2 = true;
      this.type.isShow = true;
      function ajaxSend() {
        $.ajax({
          type: "post", //请求方式
          async: true, //是否异步
          url: url + "/api/services/app/OmsCareService/MoCareResidentGet",
          dataType: "json", //跨域json请求一定是jsonp
          timeout: 10000,
          headers: {
            Authorization: "Bearer " + Authorization,
            "Oms-Tenant-Id": _this.TenantId
          },
          data: {
            ResidentId: _this.rid,
            //"TenantId":_this.TenantId,
            StaffId: _this.StaffId
          },
          success: function(data) {
            //请求成功处理，和本地回调完全一样
            if (data.success) {
              _this.show2 = false;
              _this.type.isShow = false;
              _this.person = data.result;
              _this.$store.commit(MUTATINTYPE.USER_INFO, {
                abilityLevel: data.result.abilityLevel,
                bedCode: data.result.bedCode,
                name: data.result.customerName,
                residentId: _this.rid
              });
            }
          },
          complete: function(XMLHttpRequest, status) {
            //当请求完成时调用函数
            console.log(status);
            if (status == "timeout") {
              //status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
              _this.show2 = false;
              _this.type.isShow = false;
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSend();
                }
              });
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            let status = XMLHttpRequest.status;
            if (status != 200) {
              _this.show2 = false;
              _this.type.isShow = false;
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
    change() {},
    onConfirm() {},
    save() {
      var measureDateTime = this.dataValue;
      var weight = this.weight;
      var dataSource = getDsBridge.isIphone();
      if (weight == "") {
        this.show = true;
        this.position = "middle";
        this.conTextAlert = "请填写体重！";
        return false;
      }
      if (isNaN(weight) || weight < 0) {
        this.show = true;
        this.position = "middle";
        this.conTextAlert = "请检查格式是否正确！";
        return false;
      }
      this.show2 = true;
      // this.type.isShow = true;
      this.$vux.loading.show({
          text: '',
          delay: 1e3
        });
      var _this = this;
      var url = this.url;
      var lists = [
        {
          dataSource: dataSource, //是 int 数据来源 0=Web 1-Android 2-IOS
          residentId: _this.rid,
          item: 4, //是 int 类型枚举
          obsUser: _this.obsUser, // 检查人姓名
          obsTime: measureDateTime, //是 datetime  检查时间
          memo: "",
          value: weight, //是 string  结果
          creatorUserId: _this.StaffId //创建人Id
        }
      ];
      function ajaxSendSave() {
        $.ajax({
          type: "post", //请求方式
          async: true, //是否异步
          url: url + "/api/services/app/OmsMedical/MoVitalSignObsLogSave",
          dataType: "json", //跨域json请求一定是jsonp
          timeout: 10000,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + Authorization,
            "Oms-Tenant-Id": _this.TenantId
          },
          data: JSON.stringify(lists),
          success: function(data) {
            //请求成功处理，和本地回调完全一样
            if (data.success) {
              _this.show2 = false;
              // _this.type.isShow = false;
               _this.$vux.loading.hide();
              _this.conText = "录入成功";
              _this.isShowSuss = true;
            }
          },
          complete: function(XMLHttpRequest, status) {
            //当请求完成时调用函数
            console.log(status);
            if (status == "timeout") {
              //status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
              _this.show2 = false;
              // _this.type.isShow = false;
               _this.$vux.loading.hide();
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSendSave();
                }
              });
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(textStatus);
            alert(errorThrown);
            let status = XMLHttpRequest.status;
            if (status != 200) {
              _this.show2 = false;
               _this.$vux.loading.hide();
              // _this.type.isShow = false;
              _this.showServeUnknowError({
                onCancel() {
                  ajaxSendSave();
                }
              });
            }
          }
        });
      }
      ajaxSendSave();
    },
    subut() {
      this.isShowSuss = false;
      this.weight = "";
      this.dataValue = this.dateFtt("yyyy-MM-dd hh:mm", new Date());
    },
    toHistory() {
      this.create(false);
      this.$router.push({
        path: "History/HistoryWeight",
        name: "HistoryWeight",
        params: {
          rid: this.rid
        }
      });
    },
    toHnad(token) {
      if (token) {
        this.$router.push({
          path: "/hand/InfoAdd"
        });
      }
    }
  },
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
}
section {
  flex: 1;
  margin-top: 80px;
}
.personList {
  display: flex;
  height: 40px;
  background-color: #fff;
  margin-bottom: 10px;
}
.personList .item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sub_btn {
  width: 94%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  border-radius: 2px;
}
.active {
  color: #fff;
  background: #0077d9;
  margin: 50px auto 15px auto;
}
.active1 {
  color: #282828;
  background: #fff;
  margin: 10px auto 15px auto;
}
.title {
  padding-left: 15px;
}
.content_box {
  width: 100%;
  height: 40px;
  background: #fff;
  line-height: 40px;
  display: flex;
}
.footer {
  width: 100%;
  height: 135px;
  position: fixed;
  bottom: 0;
  background: #fff;
  border-radius: 50% 50% 0 0;
}
.yuyin_dome {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #282828;
}
.maike_pic {
  width: 50px;
  height: 50px;
  margin: 20px auto;
}
.maike_pic img {
  width: 100%;
  height: 100%;
}
.unit {
  float: right;
  margin-right: 15px;
}
.center {
  flex: 1;
  text-align: right;
}
.items {
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  border: none;
  width: 50px;
  text-align: center;
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
  border-radius: 5px;
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

.input_txt {
  border: 0;
  border-bottom: 1px solid #999999;
  float: left;
  width: 65%;
  margin-top: 25px;
  margin-left: 10px;
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
.textBox {
  height: 70px;
  line-height: 70px;
  font-size: 16px;
  color: #282828;
  text-align: center;
}

.btn:last-child {
  color: #0077d9;
  border-left: 0.1px solid #d5d5d6;
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
.center /deep/ .vux-no-group-title {
  margin: 0;
  font-size: 14px;
}
.center /deep/ .weui-cell__ft {
  display: inline-block;
  height: 20px;
  border: 0;
  margin: 0;
}
.center /deep/ .vux-cell-value {
  line-height: 22px;
}
.t_width {
  width: 90%;
  height: 38px;
  border: none;
  text-align: right;
  margin-right: 15px;
}
</style>
