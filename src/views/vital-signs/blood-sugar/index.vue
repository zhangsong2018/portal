<template>
  <div id="app" v-title="title">
    <div class="wrap">
      <HeaderBar @on-hand='toHnad'>血糖</HeaderBar>
      <section class="section">
        <div class="personList">
          <p class="item" style="justify-content: left;padding-left: 30px ">{{person.customerName}}</p>
          <p class="item">{{person.age}}岁</p>
          <p class="item" v-if="person.bedCode">{{person.bedCode}}床</p>
          <p class="items">{{person.abilityLevel}}</p>
        </div>
        <div class="content_box" @click="isShowBox()">
          <span class="title">测血糖时间:</span>
          <span class="center">
            <input type="text" v-model="timevalueShow" style="border: 0;width: 100px;background: #fff;" disabled>
          </span>
          <span class="unit" style="padding-top:5px "><img src="@/static/images/time.png" alt="" style="transform: scale(0.6)"></span>
        </div>
        <div class="content_box"  style="border: none">
          <span class="title">血糖值:</span>
          <span class="center"><input type="number" v-model="bloodSugar" oninput="if(value.length>3)value=value.slice(0,4)" class="t_width"></span>
          <span class="unit">mmol / L</span>
        </div>
        <div class="content_box">
          <div class="center">
            <span class="title">测量日期:</span>
            <group>
              <datetime
                v-model="dataValue"
                :end-date="endDate"
                :title="$t('')"
                @on-confirm="onConfirm"></datetime>
            </group>
          </div>
        </div>
        <div class="sub_btn active" @click="saveInfo()">保存</div>
        <div class="sub_btn active1" @click="toHistory()">查看历史记录</div>
        <div class="footer" v-if="!isShow">
          <p class="yuyin_dome">您可以说:早餐前血糖5.6</p>
          <div class="maike_pic"><img src="@/static/images/maike.png"></div>
        </div>
      </section>

    </div>
    <picker :data='year7' v-model='timevalue' @on-change='change' style="z-index:9999;bottom:0;position: fixed;width:100%" v-if="isShow"></picker>
    <div class="btn-group pos" v-if="isShow">
      <div class="btns" @click="cacel()">取消</div>
      <div class="btns" @click="succes()">确定</div>
    </div>
    <toast v-model="show" type="text" :position="position" width="20em">{{conTextAlert}}</toast>
    <!-- <div class="mask" v-if="isShow | show2"></div> -->
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
  import { Toast,Confirm,AlertModule,Cell,Alert, Picker, GroupTitle,Loading,Datetime, Group, XSwitch, XButton,TransferDomDirective as TransferDom} from 'vux'
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
        title:"测血糖",
        lang: 'cn',
        num:0,
        isShow:false,
        person:"",
        bloodSugar:"",
        endDate:"",
        timevalueShow:"",
        timevalue:[],
        dataValue:"",
        conTextAlert:"",
        conText:"录入成功",
        position:"default",
        show:false,
        show2:false,
        isShowSuss:false,
        item:10,
        rid:"1",
        isBP:"",
        year7: [
          ["早餐前","早餐后","午餐前","午餐后","晚餐前","晚餐后","睡前",'随机血糖'],
          ["08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","01","02","03","04","05","06","07",],
          ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"],
        ],
        value: '',
      };
    },
    created () {
      this.vital_signs();
      this.getUserInfo();
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
      Cell,
      Picker,
      GroupTitle,
      XButton,
      Loading,
      XSwitch,
      Alert,
      Toast,
      Confirm
    },
    methods:{
    toParent() {},
      vital_signs(){
        // alert(dsBridge.call("vital_signs","vital_signs"))
        // this.menuList = dsBridge.call("vital_signs","vital_signs");
        var _this = this;
        dsBridge.registerAsyn('append', function (arg1, arg2) {
          var result = JSON.parse(arg1);
          result.forEach(function(v,i){
            _this.bloodSugar= v.bloodSugar;
            if(v.period=="早餐后"){
              _this.timevalue = ["早餐后","08","30"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else if(v.period=="午餐前"){
              _this.timevalue = ["午餐前","12","00"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else if(v.period=="午餐后"){
              _this.timevalue = ["午餐后","12","30"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else if(v.period=="晚餐前"){
              _this.timevalue = ["晚餐前","17","00"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else if(v.period=="晚餐后"){
              _this.timevalue = ["晚餐后","17","30"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else if(v.period=="睡前"){
              _this.timevalue = ["睡前","21","00"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else if(v.period=="随机"){
              _this.timevalue = ["随机","00","00"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }else{
              _this.timevalue = ["早餐前","08","00"];
              _this.timevalueShow = _this.timevalue[0]+" "+ _this.timevalue[1]+":"+_this.timevalue[2]
            }
          });
        });
      },
      defaultTime(){
        this.dataValue = this.dateFtt("yyyy-MM-dd",new Date());
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
      create(boolean){ //话筒交互
        dsBridge.call("isShowbut",boolean, function (v) {
          // alert("Hello World")
        });
      },
      endDateTime(){
        this.endDate = this.dateFtt("yyyy-MM-dd",new Date());
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
      change(value){
        console.log(value)
        //this.timevalueShow = this.timevalue[0]+" "+ this.timevalue[1]+":"+this.timevalue[2];
        if(value[0] == "早餐后" && value[1] == "08" && value[2] == "00"){
           this.timevalue = ["早餐后","08","30"];
        }else if(value[0] == "午餐前" && value[1] == "08" && value[2] == "30"){
          this.timevalue = ["午餐前","12","00"];
        }else if(value[0] == "午餐后" && value[1] == "12" && value[2] == "00"){
          this.timevalue = ["午餐后","12","30"];
        }else if(value[0] == "早餐前" && value[1] == "08" && value[2] == "30"){
          this.timevalue = ["早餐前","08","00"];
        }else if(value[0] == "早餐后" && value[1] == "12" && value[2] == "00"){
          this.timevalue = ["早餐后","08","30"];
        }else if(value[0] == "晚餐前" && value[1] == "12" && value[2] == "30" ){
          this.timevalue = ["晚餐前","17","00"];
        }else if(value[0] == "晚餐后" && value[1] == "17" && value[2] == "00" ){
          this.timevalue = ["晚餐后","17","30"];
        }else if(value[0] == "睡前" && value[1] == "17" && value[2] == "30"){
          this.timevalue = ["睡前","21","00"];
        }else if(value[0] == "午餐前" && value[1] == "12" && value[2] == "30"){
          this.timevalue = ["午餐前","12","00"];
        }else if(value[0] == "午餐后" && value[1] == "17" && value[2] == "00"){
          this.timevalue = ["午餐后","12","30"];
        }else if(value[0] == "晚餐前" && value[1] == "17" && value[2] == "30" ){
          this.timevalue = ["晚餐前","17","00"];
        }else if(value[0] == "晚餐后" && value[1] == "21" && value[2] == "00" ){
          this.timevalue = ["晚餐后","17","30"];
        }
      },
      isShowBox(){
        this.isShow = true;
        this.create(false);
      },
      succes(){
        if(this.timevalueShow == ""){
          this.timevalueShow = "早餐前 08:00";
        }
        this.timevalueShow = this.timevalue[0]+" "+ this.timevalue[1]+":"+this.timevalue[2];
        this.isShow = false;
        this.create(true);
      },
      cacel(){
        this.timevalue = [];
        this.isShow = false;
        this.create(true);
      },
      onConfirm(){

      },
      saveInfo(){
        if(this.timevalue.length == ""){
          this.show = true;
          this.position = "middle";
          this.conTextAlert = "请选择测血糖时间！";
          return false;
        }
        if(this.bloodSugar == ""){
          this.show = true;
          this.position = "middle";
          this.conTextAlert = "请填写血糖值！";
          return false;
        }
        if(isNaN(this.bloodSugar) || this.bloodSugar<0){
          this.show = true;
          this.position = "middle";
          this.conTextAlert = "请检查格式是否正确！";
          return false;
        }
        if (this.timevalue[0] == '早餐前') {
          this.item = 10;
        }else if(this.timevalue[0]  == '早餐后'){
          this.item = 11;
        }else if(this.timevalue[0]  == '午餐前'){
          this.item = 12;
        }else if(this.timevalue[0]  == '午餐后'){
          this.item = 13;
        }else if(this.timevalue[0]  == '晚餐前'){
          this.item = 14;
        }else if(this.timevalue[0]  == '晚餐后'){
          this.item = 15;
        }else if(this.timevalue[0]  == '睡前'){
          this.item = 16;
        }else if(this.timevalue[0]  == '随机'){
          this.item = 9;
        }
        var dataSource = getDsBridge.isIphone();
        var _this = this;
        var url = this.url;
        this.show2 = true;
        this.$vux.loading.show({
          text: '',
          delay: 1e3
        });
        var obsTime = this.dataValue+" "+this.timevalue[1]+":"+this.timevalue[2];
        var lists = [{
                'dataSource':dataSource,//是 int 数据来源 0=Web 1-Android 2-IOS
                'residentId':this.rid,
                //'tenantId':this.TenantId,
                'item':this.item,  //是 int 类型枚举
                'obsUser':this.obsUser, // 检查人姓名
                'obsTime':obsTime, //是 datetime  检查时间
                'memo':'',
                'value':this.bloodSugar, //是 string  结果
                'creatorUserId':this.StaffId //创建人Id
               }];
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
                  onConfirm(){
                    ajaxSendSave();
                  }
                })
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              alert(XMLHttpRequest.status, textStatus, errorThrown)
              let status = XMLHttpRequest.status;
              if(status != 200){
                _this.show2 = false;
                _this.$vux.loading.hide();
                _this.showServeUnknowError({
                  onConfirm(){
                    ajaxSendSave();
                  }
                })
              }
            }
          });
        }
        ajaxSendSave()
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
      subut(){
        this.isShowSuss = false;
        this.timevalue = [];
        this.bloodSugar= "";
        this.dataValue = this.dateFtt("yyyy-MM-dd",new Date());
        this.timevalueShow = "";
      },
      toHistory(){
           this.create(false);
           this.$router.push({
              path: 'History/HistoryBloodSugar',
              name: 'HistoryBloodSugar',
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
    overflow: hidden;
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
    position: absolute;
    left:15px ;
    z-index: 99;
  }
  .content_box{
    width: 100%;
    height: 40px;
    background: #fff;
    line-height: 40px;
    border-bottom: 1px solid #f4f4f4;
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
    position: relative;
  }
  .text{
    border: none;
    width: 50px;
    text-align: center;
  }
  .text_center{
    border: none;
    width: 80px;
    text-align: center;
  }
  .text_time{
    border: 0
  }
  .items{
    flex: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
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
    color:#0077D9;
    border-left: 0.1px solid #D5D5D6
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    background: rgba(0,0,0,.3);
  }
  .center /deep/ .vux-no-group-title{
    margin: 0;
    font-size: 14px;

  }
  .center /deep/ .vux-cell-value{
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
  .pos{
    width: 100%;
    height: 40px;
    position: fixed;
    background: #fff;
    bottom:238px;
    z-index: 99999;

  }
  .btns {
    width:50%;
    float: left;
    line-height: 44px;
    align-items: center;
    font-size: 18px;
    color: #828282;
    font-size: 16px;
    margin-left: 15px;
  }
  .btns:nth-child(2){
    float: right;
    color:#04BE02;
    text-align: right;
    margin-right: 15px;
  }
  .t_width{
    width: 80%;
    height:38px;
    border: none;
    text-align: right;
    margin-right: 15px;
  }
  .history_btn{
    width: 180px;
    text-align: right;
    margin: 5px auto 0px auto;
    color: #666666
  }
</style>
