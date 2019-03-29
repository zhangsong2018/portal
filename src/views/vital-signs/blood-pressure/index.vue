<template>
  <div id="app" v-title="title">
      <div class="wrap">
         <HeaderBar @on-hand='toHnad'>血压</HeaderBar>
         <section class="section">
            <div class="personList">
               <p class="item" style="justify-content: left;padding-left: 30px ">{{person.customerName}}</p>
               <p class="item">{{person.age}}岁</p>
               <p class="item" v-if="person.bedCode">{{person.bedCode}}床</p>
               <p class="items">{{person.abilityLevel}}</p>
            </div>
             <div class="content_box">
              <span class="title">血压值:</span>
              <span class="center">
                <input type="number" v-model="bloodPressureGao" class="text" oninput="if(value.length>3)value=value.slice(0,3)" > /
                <input type="number" v-model="bloodPressureTi" class="text" oninput="if(value.length>3)value=value.slice(0,3)" >
              </span>
              <span class="unit">mmHg</span>
            </div>
            <div class="content_box"  style="border: none">
              <span class="title">脉搏:</span>
              <span class="center"><input type="number" v-model="pulse" class="t_width" oninput="if(value.length>3)value=value.slice(0,3)"></span>
              <span class="unit">次 / 分</span>
            </div>
            <div class="content_box">
              <div class="center">
                  <group>
                      <datetime
                        v-model="dataValue"
                        format="YYYY-MM-DD HH:mm"
                        @on-change="change"
                        :end-date="endDate"
                        :title="$t('测量时间:')"
                        @on-confirm="onConfirm"></datetime>
                 </group>
              </div>
            </div>
            <p class="checkbox_box"><label><input type="checkbox" v-model="isRejectBP" class="checkbox"/>拒测</label></p>
            <div class="sub_btn active" @click="save()">保存</div>
            <div class="sub_btn active1" @click="toHistory()">查看历史记录</div>
            <div class="footer">
              <p class="yuyin_dome">您可以说：高压130，低压87，脉搏73</p>
              <div class="maike_pic"><img src="@/static/images/maike.png"></div>
            </div>
          </section>
      </div>
      <toast v-model="show" type="text" :position="position" width="25em">{{conTextAlert}}</toast>
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
  import HeaderBar from '@/views/HeaderBar'
  import { Toast,Confirm,Cell,Alert,Loading,Datetime, Group, XSwitch, XButton,TransferDomDirective as TransferDom} from 'vux'
  import getDsBridge from '@/static/js/getDsBridge.js'
  import MUTATINTYPE from "@/store/modules/hand-over/type/muations-type.js";
  var Authorization = getDsBridge.getToken()
  export default {
    data() {
      return {
        type: {
        isShow: true, //是否显示
        pageType: "loading", //显示类型
        text: "正在加载...", // 用户自定义显示文字
        errName: "loadData" //需要重新调用的方法名
      },
        title:"测血压",
        lang: 'cn',
        num:0,
        bloodPressureGao:"",
        bloodPressureTi:"",
        pulse:"",
        person:'',
        dataValue:"",
        endDate:"",
        conTextAlert:"",
        conText:"录入成功",
        position:"default",
        show:false,
        show2:false,
        isShowSuss:false,
        rid:"1",
        isRejectBP:false,
        isBP:""
      };
    },
    created () {
      this.getUserInfo();
      this.vital_signs();
      this.defaultTime();
      this.endDateTime();

    },
    directives: {
      TransferDom
    },
    components:{
      HeaderBar:HeaderBar,
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
    methods:{
        toParent() {},
        vital_signs(){

           // 交互原生 语音从原生获取语音的值
           var _this = this;
           dsBridge.registerAsyn('append', function (arg1, arg2) {
              var result = JSON.parse(arg1);
              if(result.length<3){
                   //血压高
                  _this.bloodPressureGao = result[0].bloodPressureGao?result[0].bloodPressureGao:_this.bloodPressureGao ;
                  //血压低
                  _this.bloodPressureTi= result[0].bloodPressureTi?result[0].bloodPressureTi:_this.bloodPressureTi;
                  //血糖
                  _this.pulse= result[0].pulse?result[0].pulse:_this.pulse;
              }else{
                 result.forEach(function(v,i){
                    _this.bloodPressureGao = v.bloodPressureGao;
                    _this.bloodPressureTi= v.bloodPressureTi;
                    _this.pulse= v.pulse;
                 });
              }

           });
       },
        create(boolean){ //话筒交互
          dsBridge.call("isShowbut",boolean, function (v) {});
        },
        close(){
          this.rid = this.$route.params.rid;
          this.$router.push({
            path: 'CarePlan',
            name: 'CarePlan',
            params: {
              rid: this.rid,
            }
          })
          this.create(false);
        },
        closeBP(){
          this.$router.push({
            path: 'AddUserBP',
            name: 'AddUserBP',
          })
          this.create(false);
        },
        defaultTime(){
          this.dataValue = this.dateFtt("yyyy-MM-dd hh:mm",new Date());
        },
        endDateTime(){
          this.endDate = this.dateFtt("yyyy-MM-dd",new Date());
        },
        change(){

        },
        onConfirm(){

        },
        dateFtt(fmt,date){
          var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
          };
          if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
          for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          return fmt;
        },
        getUserInfo(){
            this.rid = this.$route.params.rid;
            this.isBP = this.$route.params.isBP;
            var _this = this;
            var url = this.url;
            this.show2 = true;
            this.type.isShow = true;
            function ajaxSend() {
              $.ajax({
                type:"post",    //请求方式
                async:true,    //是否异步
                url:url+"/api/services/app/OmsCareService/MoCareResidentGet",
                dataType:"json",    //跨域json请求一定是jsonp
                timeout: 10000,
                headers: {
                   'Authorization': 'Bearer '+ Authorization,
                   'Oms-Tenant-Id': _this.TenantId
                },
                data:{
                  "ResidentId":_this.rid,
                  "StaffId":_this.StaffId,
                },
                success: function(data) {
                  //请求成功处理，和本地回调完全一样
                  if(data.success){
                    _this.show2 = false;
                    _this.type.isShow = false;
                    _this.person = data.result;
                      _this.$store.commit(MUTATINTYPE.USER_INFO,{
                      abilityLevel:data.result.abilityLevel,
                      bedCode:data.result.bedCode,
                      name:data.result.customerName,
                      residentId:_this.rid
                    });
                  }
                },
                complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
                  console.log(status)
                  if (status == 'timeout') {//status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
                    _this.show2 = false;
                    _this.type.isShow = false;
                    _this.showServeUnknowError({
                      onCancel(){
                        ajaxSend();
                      }
                    })
                  }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  let status = XMLHttpRequest.status;
                  if(status != 200){
                    _this.show2 = false;
                    _this.type.isShow = false;
                    _this.showServeUnknowError({
                      onCancel(){
                        ajaxSend();
                      }
                    })
                  }
                }});
             }
             ajaxSend();

        },
        save(){
            var measureDateTime = this.dataValue; //测量时间
            var systolicPressure = this.bloodPressureGao;//高压
            var diastolicPressure = this.bloodPressureTi;//低压
            var isRejectBP = this.isRejectBP;
            var pulse = this.pulse; //脉搏
            var dataSource = getDsBridge.isIphone();
            if(!isRejectBP){
              if(pulse ==""){
                if( (diastolicPressure !="" && systolicPressure == "" )
                  || (diastolicPressure =="" && systolicPressure != "" )) {
                  this.show = true;
                  this.position = "middle";
                  this.conTextAlert = "请填写完整的血压数据（收缩压/舒张压）";
                  return
                }else if(diastolicPressure =="" && systolicPressure == "" ){
                  this.conTextAlert = "血压、脉搏至少填写一项";
                  this.show = true;
                  this.position = "middle";
                  return
                }

              }else if(pulse !=""){
                if((diastolicPressure !="" && systolicPressure == "" )
                  || (diastolicPressure =="" && systolicPressure != "" )) {
                  this.show = true;
                  this.position = "middle";
                  this.conTextAlert = "请填写完整的血压数据（收缩压/舒张压）";
                  return
                }
              }
            }
            if(isNaN(systolicPressure)  || isNaN(diastolicPressure) || isNaN(diastolicPressure) || systolicPressure <0 || diastolicPressure < 0 || pulse <0){
              this.show = true;
              this.position = "middle";
              this.conTextAlert = "请检查格式是否正确";
              return false;
            }
            if(isRejectBP == false){
              isRejectBP = 0;
            }else{
              isRejectBP = 1;
            }
            var _this = this;
            var url = this.url;
            this.show2 = true; //loading
            var lists = [];
            this.$vux.loading.show({
              text: '',
              delay: 1e3
            });
            if(diastolicPressure !="" && systolicPressure != "" && pulse!= ""){
               var lists = [{
                  'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                  'residentId':this.rid,
                  //'tenantId':this.TenantId,
                  'item':8,  //是 int 类型枚举
                  'obsUser':this.obsUser, // 检查人姓名
                  'obsTime':measureDateTime, //是 datetime  检查时间
                  'memo':'',
                  'value':systolicPressure, //是 string  结果
                  'value2':diastolicPressure, //是 string  结果
                  'value3':isRejectBP, //是 string  结果
                  'creatorUserId':this.StaffId //创建人Id
               },{
                  'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                  'residentId':this.rid,
                  //'tenantId':this.TenantId,
                  'item':2,  //是 int 类型枚举
                  'obsUser':this.obsUser, // 检查人姓名
                  'obsTime':measureDateTime, //是 datetime  检查时间
                  'memo':'',
                  'value':pulse , //是 string  结果
                  'creatorUserId':this.StaffId //创建人Id
               }];
            }else if(diastolicPressure =="" && systolicPressure == "" && pulse == "" && isRejectBP == 1){
                  var lists = [{
                  'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                  'residentId':this.rid,
                  //'tenantId':this.TenantId,
                  'item':8,  //是 int 类型枚举
                  'obsUser':this.obsUser, // 检查人姓名
                  'obsTime':measureDateTime, //是 datetime  检查时间
                  'memo':'',
                  'value':'', //是 string  结果
                  'value2':'', //是 string  结果
                  'value3':isRejectBP, //是 string  结果
                  'creatorUserId':this.StaffId //创建人Id
               },{
                  'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                  'residentId':this.rid,
                  //'tenantId':this.TenantId,
                  'item':2,  //是 int 类型枚举
                  'obsUser':this.obsUser, // 检查人姓名
                  'obsTime':measureDateTime, //是 datetime  检查时间
                  'memo':'',
                  'value':'' , //是 string  结果
                  'creatorUserId':this.StaffId //创建人Id
               }];
            }else if(diastolicPressure !="" && systolicPressure != "" && pulse== ""){
               var lists = [{
                  'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                  'residentId':this.rid,
                  //'tenantId':this.TenantId,
                  'item':8,  //是 int 类型枚举
                  'obsUser':this.obsUser, // 检查人姓名
                  'obsTime':measureDateTime, //是 datetime  检查时间
                  'memo':'',
                  'value':systolicPressure, //是 string  结果
                  'value2':diastolicPressure, //是 string  结果
                  'value3':isRejectBP, //是 string  结果
                  'creatorUserId':this.StaffId //创建人Id
               }];
            }else if(diastolicPressure =="" && systolicPressure == "" && pulse!= ""){
               if(isRejectBP == 1){
                  var lists = [{
                      'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                      'residentId':this.rid,
                      //'tenantId':this.TenantId,
                      'item':8,  //是 int 类型枚举
                      'obsUser':this.obsUser, // 检查人姓名
                      'obsTime':measureDateTime, //是 datetime  检查时间
                      'memo':'',
                      'value':"", //是 string  结果
                      'value2':"", //是 string  结果
                      'value3':isRejectBP, //是 string  结果
                      'creatorUserId':this.StaffId //创建人Id
                   },{
                      'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                      'residentId':this.rid,
                      //'tenantId':this.TenantId,
                      'item':2,  //是 int 类型枚举
                      'obsUser':this.obsUser, // 检查人姓名
                      'obsTime':measureDateTime, //是 datetime  检查时间
                      'memo':'',
                      'value':pulse , //是 string  结果
                      'creatorUserId':this.StaffId //创建人Id
                   }];
               }else{
                  var lists = [{
                    'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                    'residentId':this.rid,
                    //'tenantId':this.TenantId,
                    'item':2,  //是 int 类型枚举
                    'obsUser':this.obsUser, // 检查人姓名
                    'obsTime':measureDateTime, //是 datetime  检查时间
                    'memo':'',
                    'value':pulse , //是 string  结果
                    'creatorUserId':this.StaffId //创建人Id
                 }];
               }

            }

            function ajaxSendSave(){
              $.ajax({
                type:"post",    //请求方式
                async:true,    //是否异步
                url:url+"/api/services/app/OmsMedical/MoVitalSignObsLogSave",
                dataType:"json",    //跨域json请求一定是jsonp
                timeout: 10000,
                headers: {
                  "content-type":"application/json",
                  'Authorization': 'Bearer '+ Authorization,
                  'Oms-Tenant-Id': _this.TenantId
                },
                data:JSON.stringify(lists),
                success: function(data) {
                  //请求成功处理，和本地回调完全一样
                  if(data.success){
                      _this.show2 = false;
                      _this.$vux.loading.hide();
                      _this.conText = "录入成功";
                      _this.isShowSuss = true;
                  }
                },
                complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
                  console.log(status)
                  if (status == 'timeout') {//status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
                    _this.show2 = false;
                    _this.$vux.loading.hide();
                    _this.showServeUnknowError({
                      onCancel(){
                        ajaxSendSave();
                      }
                    })
                  }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  let status = XMLHttpRequest.status;
                  if(status != 200){
                    _this.show2 = false;
                    _this.$vux.loading.hide();
                    _this.showServeUnknowError({
                      onCancel(){
                        ajaxSendSave();
                      }
                    })
                  }
                }
              });
            }
            ajaxSendSave()
        },
        subut(){
          this.isShowSuss = false;
          this.bloodPressureGao = "";//高压
          this.bloodPressureTi = "";//低压
          this.pulse = ""; //脉搏
          this.isRejectBP = false;
          this.dataValue = this.dateFtt("yyyy-MM-dd hh:mm",new Date());
        },
        toHistory(){
           this.create(false);//去掉话筒
           this.$router.push({
              path: 'History/HistoryBloodPressure',
              name: 'HistoryBloodPressure',
              params: {
                rid: this.rid,
              }
           })
       },
       toHnad (token) {
          if(token){
          this.$router.push({
             path: "/hand/InfoAdd"
            });
          }
       }

    },
    watch: {

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.wrap{
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
}
section{
   flex:1;
   margin-top:80px;
}
.personList{
    display: flex;
    height: 40px;
    background-color:#fff;
    margin-bottom: 10px;
 }
.personList .item{
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.sub_btn{
   width: 94%;
   height: 40px;
   text-align: center;
   line-height: 40px;
   font-size: 16px;
   border-radius: 2px;
}
.active{
   color: #fff;
   background: #0077D9;
   margin: 50px auto 15px auto;
}
.active1{
   color: #282828;
   background: #fff;
   margin: 10px auto 15px auto;
}
.title{
   padding-left: 15px;
}
.content_box{
  width: 100%;
  height: 40px;
  background: #fff;
  line-height: 40px;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
}
.footer{
  width: 100%;
  height: 135px;
  position: fixed;
  bottom: 0;
  background: #fff;
  border-radius:50% 50% 0 0;
}
.yuyin_dome{
  text-align: center;
  margin-top:30px;
  font-size: 14px;
  color: #282828
}
.maike_pic{
  width: 50px;
  height: 50px;
  margin: 20px auto
}
.maike_pic img{
  width: 100%;
  height: 100%;
}
.unit{
  float: right;
  margin-right: 15px;
}
.center{
  flex:1;
  text-align: right;
}
.text{
   border: none;
   width: 50px;
   text-align: center;
}
.t_width{
  width:95%;
  height: 38px;
  border: none;
  text-align: right;
  margin-right: 15px;
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

.input_txt{
  border: 0;
  border-bottom: 1px solid #999999;
  float: left;
  width: 65%;
  margin-top:25px;
  margin-left: 10px;
}
.btn-group {
  display: flex;
  height: 50px;
  border-top: 0.1px solid #D5D5D6

}
.btn {
  flex:1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #999999;

}
.textBox{
  height: 70px;
  line-height: 70px;
  font-size: 16px;
  color:#282828;
  text-align: center;
}

.btn:last-child {
  color: #0077D9;
  border-left: 0.1px solid #D5D5D6
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0,0,0,.3);
}
.center /deep/ .vux-no-group-title{
  margin: 0;
  font-size: 14px;

}
.center /deep/ .weui-cell__ft{
  display: inline-block;
  height: 20px;
  border: 0;
  margin: 0;
}
.center /deep/ .vux-cell-value{
  line-height: 22px;
}
.items{
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkbox_box{
  float: right;
  margin-top:10px;
  margin-right: 15px;
}
.checkbox_box input{
  width: 16px;
  height: 16px;
  float: left;
  margin-right: 5px;
  margin-top:3px;
}
.checkbox_box label{
  font-size: 14px;
  line-height: 22px;
  float: left;

}
.checkbox{
  border: 1px solid #ccc;
  background: #ccc;
}
.history_btn{
  width: 180px;
  text-align: right;
  margin: 5px auto 0px auto;
  color: #666666
}
</style>
