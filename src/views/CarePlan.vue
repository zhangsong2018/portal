<template>
  <div id="app">
    <div class="wrap"  @touchmove="move()" @touchend='end()'>
      <!-- 头部 -->
      <div class="headerbar"></div>
      <header class="header">
        <div class="close" @click="toAddUserList()">
          <div class="close_pic">
              <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
          </div>
        </div>
        <h2 class="title">
          <span>照护计划</span>
        </h2>
        <!-- <div class="icon">
          <img src="@/static/images/adduser.png" style="transform: scale(0.6);" @click="toAddUserList()">
        </div> -->
        <div class="icon" @click="tabMenuList()">
          <img src="@/static/images/userlist.png" style="transform: scale(0.6);">
        </div>
      </header>
      <ul class="userList" v-if="menuList">
        <li v-for="v in userlists" @click="tabUserList(v)">
          <p class="item">{{v.name}}</p>
          <p class="item_sex"><span v-if="v.gender == 'Male'">男</span><span v-if="v.gender != 'Male'">女</span></p>
          <p class="item">{{v.bedCode}}</p>
        </li>
      </ul>
      <section class="section">
        <div class="personList">
          <p class="item" style="justify-content: left;padding-left: 30px ">{{person.customerName}}</p>
          <p class="item">{{person.age}}岁</p>
          <p class="item" v-if="person.bedCode">{{person.bedCode}}床</p>
          <p class="items">{{person.abilityLevel}}</p>
        </div>
        <span class="right_tit" v-if="personList.length>0">
            今日进度<span style="color:#73d005">{{person.executedCount}}</span>/{{personList.length}}
        </span>
        <div class="mask" v-if="isShowSuss | isShowerr"></div>
        <div class="taskList" v-if="personList.length>0">
          <div class="taskList_item" v-for="(item,index) in personList" >
            <!-- 弹出框 -->
            <div class="dialog" v-if="item.isShow == 'Yes' && isShowSuss">
              <div class="dialog-content">
                <h3 class="title_dialog">执行</h3>
                <div class="text_center">
                  <div class="radio-box" v-for="(item,index) in radios1" :key="item.id" v-if="outputStyle.length>0 & outputStyle[0].type == 'option'">
                    <span class="radio" :class="{'on':item.isChecked}"></span>
                    <input v-model="radio1" :value="item.value" class="input-radio" :checked='item.isChecked'  @click="check1(index)" type="radio">{{item.label}}
                  </div>
                  <input type="tel" class="input_txts" placeholder="请输入次数[0-9]" v-model="numBer" maxlength="1" v-if="outputStyle[0].type == 'text'" style="display: block;">
                  <div class="check-box" v-if="outputStyle.length>0 & outputStyle[0].type == 'text'" style="height: 20px">
                    <checklist v-model="listValue1" :options="outputStyle[1].value">
                      {{outputStyle[1].value}}
                    </checklist>
                  </div>
                  <div class="check-box" v-if="outputStyle.length>0 & outputStyle[0].type == 'check'">
                    <checklist v-model="listValue" :options="outputStyle[0].value">
                      {{outputStyle[0].value}}
                    </checklist>
                  </div>
                </div>
                <div class="text">
                  <p @click="recordShow(item,1)"><img src="../static/images/y.png" alt="" ></p>
                  <input type="text" class="input_txt" placeholder="请输入执行中的异常情况" v-model="item.memo">
                </div>
                <div class="btn-group">
                  <div class="btn" >
                    <span @click="cancel(item)" >取消</span>
                  </div>
                  <div class="btn">
                    <span @click="submit(item)">保存</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="dialog" v-if="item.isShow == 'No' && isShowerr">
              <div class="dialog-content">
                <h3 class="title_dialog">不执行</h3>
                <div class="text_center">
                  <div class="radio-box" v-for="(items,index) in radios" :key="items.id" >
                    <span class="radio" :class="{'on':items.isChecked}"></span>
                    <input v-model="item.noExecReasonKey" :value="items.value" class="input-radio" :checked='items.isChecked'  @click="check(item.noExecReasonKey,index)" type="radio">{{items.label}}
                  </div>
                </div>
                <div class="text">
                  <p @click="recordShow(item,0)"><img src="../static/images/y.png" alt="" ></p>
                  <input type="text" class="input_txt" placeholder="请输入执行中的异常情况" v-model="item.memo">
                </div>

                <div class="btn-group">
                  <div class="btn">
                    <span @click="cancel(item)">取消</span>
                  </div>
                  <div class="btn" >
                    <span @click="submitErr(item)">保存</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 遮罩层 -->
            <div class="draw_box" v-if="item.careLogItemId>0">
              <div class="draw_radius"></div>
              <div class="draw_content"></div>
            </div>
            <div class="radius_time">
              <p class='time_tit'>{{item.workShift}}</p>
              <p class='time_tit'>{{item.startTime}}</p>
            </div>
            <div class="task_content">
              <div class="big_box" @click="gotoDetail(item)">
                <h3 class="task_title">{{item.serviceItemName | ellipsis}}</h3>
                <p class="task_continer" v-if="item.description">{{item.description | ellipsis}}</p>
                <p class="task_continer" v-if="item.steps">{{JSON.parse(item.steps)[0].Desc | ellipsis}}</p>
              </div>
              <div class="radio_box">
                <div class="radio_item" @click="errorAlert(item)" v-if="item.execResult != 0">
                  <img src="@/static/images/erorr.png" alt="">
                </div>
                <div class="radio_item" v-if="item.execResult == 0" @click="errorAlertCancel(item)" @touchstart="gtouchstartError(item)" @touchend="gtouchendError(item)">
                  <img src="@/static/images/erorr_active.png" alt="">
                </div>
                <div class="line"></div>

                <div class="radio_item"  v-if="item.execResult != 1" @click="successAlert(item)">
                  <img src="@/static/images/success.png" alt="">
                </div>
                <div class="radio_item" v-if="item.execResult == 1" @click="successAlertCancel(item)" @touchstart="gtouchstartSuccess(item)"
                @touchmove="gtouchmove()" @touchend="gtouchendSuccess(item)">
                  <img src="@/static/images/success_active.png" alt="">
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="noData" v-if="personList.length==0">
          <img src="@/static/images/noData.png" alt="">
          <p>暂无数据</p>
        </div>
        <!-- 跳转按钮 -->
        <div class="mask_router" v-if="showList" @click="showList = !showList"></div>
        <div class="route_bigbox" v-if="local">
          <router-link :to="'/VitalSigns/BloodPressure/'+rid+'/'+isBP">
            <div class="routers_box router_item1" v-if="showList">
              <span class="rou_tit">血压</span>
              <img src="@/static/images/xy.png" style="transform: scale(1.5);">
            </div>
          </router-link>
          <router-link :to="'/VitalSigns/BloodSugar/'+rid+'/'+isBP">
            <div class="routers_box router_item2" v-if="showList">
              <span class="rou_tit">血糖</span>
              <img src="@/static/images/yt.png" style="transform: scale(1.5);">
            </div>
          </router-link>
          <router-link :to="'/VitalSigns/Temperature/'+rid+'/'+isBP">
            <div class="routers_box router_item3" v-if="showList">
              <span class="rou_tit">体温</span>
              <img src="@/static/images/tw.png" style="transform: scale(1.5);">
            </div>
          </router-link>
          <router-link :to="'/VitalSigns/Weight/'+rid+'/'+isBP">
            <div class="routers_box router_item4" v-if="showList">
              <span class="rou_tit">体重</span>
              <img src="@/static/images/tz.png" style="transform: scale(1.5);">
            </div>
          </router-link>
            <div v-show='tokenS' @click='toHand' class="routers_box router_item5" v-if="showList">
              <span class="rou_tit">交接</span>
              <img src="@/static/images/handover/hand.png" style="transform: scale(1.5);">
            </div>
          <div class="router_box" @click="toShowPage()">
            <img src="@/static/images/xz.png" style="transform: scale(1.5);">
          </div>
        </div>
      </section>
      <div class="sub_btn" v-if="disabeld">服务完成</div>
      <div class="sub_btn" @click="serviceShow()" v-if="!disabeld">服务完成</div>
    </div>
    <div class="mask" v-if="menuList | isShows" @click="closeDraw()"></div>
    <div class="mask_box" v-if="isShowAlert | isShowsFuWu  | isShowLogin"></div>
    <div class="dialog" v-if="isShowLogin" >
      <div class="dialog-content">
        <h3 class="title_dialog">提示</h3>
        <p class="textBox" style="text-align: center">
          您确认要退出登录吗？<br>
          退出后未提交的数据将被清空！
        </p>
        <div class="btn-group">
          <div class="btn" @click="isShowLogin = !isShowLogin">取消</div>
          <div class="btn" @click="close()">确认</div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="isShowsFuWu" >
      <div class="dialog-content">
        <h3 class="title_dialog">提示</h3>
        <p class="textBox" style="text-align: center;line-height: 70px">
          您确认提交服务记录么?
        </p>
        <div class="btn-group">
          <div class="btn" @click="isShowsFuWu = !isShowsFuWu">取消</div>
          <div class="btn" @click="MoCareLogSave()">确认</div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="isShows" >
      <div class="dialog-content">
        <h3 class="title_dialog">注意</h3>
        <p class="textBox" style="text-align: center;height: 70px;line-height: 1.5">
          有未提交的服务数据,请确认是否要提交？
        </p>
        <div class="btn-group">
           <div class="btn" @click="isShows = !isShows">取消</div>
           <div class="btn" @click="romeveSave()">不提交</div>
           <div class="btn" @click="MoCareLogSave()" style="border:none;">提交</div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="isShowAlert" >
      <div class="dialog-content">
        <div class="icon_close" @click="iconClose()">X</div>
        <h3 class="title_dialog">{{conTextTitle}}</h3>
        <p class="text_Box" v-if="steps.length==0">
          {{conTextAlert}}
        </p>
        <p class="text_Box" v-if="steps.length>0">
            <span v-for="v in steps" style="display: block;font-size: 14px">
              {{v.Desc}}
            </span>
        </p>
      </div>
    </div>
    <toast v-model="show" type="text" :position="position" width="20em">{{conText}}</toast>
    <div v-transfer-dom>
      <!-- <loading :show="show2" text=""></loading> -->
      <YC-load style="top: 80px;" @childEvent="toParent" :pageType="type"></YC-load>
    </div>
  </div>
</template>
<script>
  import { Scroller, Divider, Spinner,Toast,Loading,Group, XSwitch,Checklist, XButton,TransferDomDirective as TransferDom} from 'vux'
  import Vue from 'vue'
  import getDsBridge from '@/static/js/getDsBridge.js'
  import MUTATINTYPE from "@/store/modules/hand-over/type/muations-type.js";
  var Authorization = getDsBridge.getToken()
  export default {
    name: 'HelloWorld',
    data () {
      return {
        type: {
        isShow: true, //是否显示
        pageType: "loading", //显示类型
        text: "正在加载...",  // 用户自定义显示文字
        errName: "loadData",//需要重新调用的方法名
      },
        tokenS:false,
        title: "登录页",
        num: 1,
        numBer:'',
        radio1: 3,
        showList:false,
        local:true,
        menuList:false,
        isShowSuss:false,
        isShowerr:false,
        isShows:false,
        isShowsFuWu:false,
        isShowAlert:false,
        isShowLogin:false,
        isMemo:false,
        isMemoTrue:false,
        conTexts:"",
        access_token:"",
        outputStyle:"",
        show:false,
        show2:false,
        conText:"",
        person:"",
        listValue:[],
        listValue1:[],
        startTime:"",//开始时间
        disabeld:false,
        personList:[],
        steps:[],
        serviceItems:[],//保存服务过的项目
        conTextTitle:"",
        conTextAlert:"",
        position:'default',
        outputValue:"",
        items:"",
        rid:"",
        isBP:0,
        outputStyleValue:"",
        userlists:[],
        timeOutEvent:0,
        noExecReasonKey:'外出',
        radios:[
          {
            label: '外出',
            value:'外出',
            isChecked: true,
          },
          {
            label: '拒绝',
            value:'拒绝',
            isChecked: false,
          },
          {
            label: '无法执行',
            value:'无法执行',
            isChecked: false,
          },
        ],
        radios1:[
          {
            label: '好',
            value:'好',
            isChecked: true,
          },
          {
            label: '尚好',
            value:'尚好',
            isChecked: false,
          },
          {
            label: '差',
            value:'差',
            isChecked: false,
          },
        ]

      }
    },
    created () {
      this.setUserInfo();
      this.getUserList();
      localStorage.getItem('hand') == 'true' ?  this.tokenS = true : this.tokenS = false
    },
    filters : {
      ellipsis (value) {
        if (!value) return ''
        if (value.length > 10) {
          return value.slice(0,10) + '...'
        }
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Toast,
      Group,
      XSwitch,
      XButton,
      Loading,
      Scroller,
      Divider,
      Spinner,
      Checklist
    },
    methods: {
      toParent(){
        
      },
      toHand () {
      this.$router.push({
        path: "/hand/InfoAdd"
      });
      },
      closeLogin(){
        this.isShowLogin = true;
      },
      close(){ // 和安卓交互 关闭当前页  异步
        dsBridge.call("testAsyn","testAsyn", function (v) {
          alert("你好世界")
        });
        this.isShowLogin = false;
        var storage = window.localStorage;
        storage.clear();
        window.history.length = 0;
      },
      subut(){
        this.isShows = false;
        var storage=window.localStorage;
        storage.setItem("userInfo",""); //清空缓存数据
        dsBridge.call("toClose","toClose", function (v) {
          alert("你好世界")
        })

      },
      recordShow(item,i){
        dsBridge.call("recordStart","recordStart");
        var _this = this;
        if(i == 0){
          dsBridge.registerAsyn('recordResult', function (arg1, arg2) {
            _this.$set(item, 'memo', arg1) //未执行
          });
        }else{
          this.isShowInput = true;
          dsBridge.registerAsyn('recordResult', function (arg1, arg2) {
            //item.memo = arg1;//执行
            _this.$set(item, 'memo', arg1)
          });
        }
      },
      move(){
        $(".route_bigbox").css({'transform':'translateX(20px)',"opacity":0.4});
        if(this.showList){
          this.showList = false;
        }
      },
      end(){
        $(".route_bigbox").css({'transform':'translateX(0px)',"opacity":1});
      },
      gotoDetail(item){
        var _this = this;
        this.conTextTitle = item.serviceItemName;
        if(item.steps != "" && item.steps != null){
          this.steps =  JSON.parse(item.steps);
          this.isShowAlert = true;
        }else if(item.description!= "" && item.description!= null){
          this.conTextAlert = item.description;
          this.isShowAlert = true;
        }else{
          this.conTextAlert = "暂无描述信息!";
          this.isShowAlert = true;
        }

      },
      check(text,index) {
        // 先取消所有选中项
        this.radios.forEach((item) => {
          item.isChecked = false;
        });
        //再设置当前点击项选中
        text = this.radios[index].value;
        // 设置值，以供传递
        this.radios[index].isChecked = true;
      },
      check1(index) {
        // 先取消所有选中项
        this.radios1.forEach((item) => {
          item.isChecked = false;
        });
        //再设置当前点击项选中
        this.outputValue= this.radios1[index].value;
        // 设置值，以供传递
        this.radios1[index].isChecked = true;
      },
      iconClose(){
        this.isShowAlert = false;
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
      toShowPage(){
        if(this.serviceItems.length>0){
          this.isShows = true;
          return;
        }
        this.showList = !this.showList;
      },
      routerLink(){
        if(this.serviceItems.length>0){
          this.isShows = true;
          return;
        }
        this.$router.push('/AddUser');
      },
      getUserList(){ // 获取切换列表信息
          var url = this.url;
          var _this = this;
          $.ajax({
            type:"post",    //请求方式
            url:url+"/api/services/app/OmsCareService/MoCareRelationQuery",
            dataType:"json",    //跨域json请求一定是jsonp
            timeout:10000,
            headers: {
               'Authorization': 'Bearer '+ Authorization,
               'Oms-Tenant-Id': _this.TenantId
            },
            data:{
              //"TenantId":this.TenantId,
              "StaffId":this.StaffId
            },
            success: function(data) {
              if(data.success){
                 _this.userlists = data.result.items;
              }
            },
            complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            }
          })

      },
      setUserInfo(){ //渲染用户信息
        this.rid = this.$route.params.rid;
        
        if(this.rid ){
          this.callSyn(this.rid);//重新渲染页面
        }
      },
      toAddUserList(){
        if(this.serviceItems.length>0){
          this.isShows = true;
          return;
        }
        this.$router.push({
          path: 'AddUser',
          name: 'AddUser',
        })
      },
      tabMenuList(){
        if(this.serviceItems.length>0){
          this.isShows = true;
          return;
        }
        this.menuList = !this.menuList;
      },
      closeDraw(){
        this.menuList = false;
        this.isShows = false;
      },
      callSyn(rid){
        var _this = this;
        var url = this.url;
        this.show2 = true;
        _this.type.isShow = true;
        this.startTime = this.dateFtt("yyyy-MM-dd hh:mm:ss",new Date());//开始时间
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
              "ResidentId":rid,
              //"TenantId":_this.TenantId,
              "StaffId":_this.StaffId
            },
            success: function(data) {
              //请求成功处理，和本地回调完全一样
              if(data.success){
                _this.show2 = false;
                _this.type.isShow = false;
                _this.person = data.result;
                  //添加到vuex数据
                _this.$store.commit(MUTATINTYPE.USER_INFO,{
                  abilityLevel:data.result.abilityLevel,
                  bedCode:data.result.bedCode,
                  name:data.result.customerName,
                  residentId:rid
                });
                _this.personList = data.result.items;
                _this.personList.forEach(function(item,i){
                  item.isShow = 'Null';
                  if(item.careLogItemId > 0 && item.execResult == "Yes"){
                    item.execResult = 1;
                  }else if(item.careLogItemId > 0 && item.execResult == "Null"){
                    item.execResult = 0;
                  }else{
                    item.execResult = item.execResult;
                  }
                })
              }else{
                _this.position= "middle"
                _this.conText= "请求失败，请检查原因!"
                _this.disabeld = false;
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
      serviceShow(){
        if(this.person.executedCount==this.personList.length){
          this.show = true;
          this.position = "middle";
          this.conText = "今日任务已完成，无法继续提交！";
          return;
        }
        if(this.serviceItems.length == 0){
          this.show = true;
          this.position = "middle";
          this.conText = "您还没有进行服务执行！";
          return;
        }
        this.isShowsFuWu = true;
      },
      MoCareLogSave: function () {
        this.disabeld = true;
        this.isShowsFuWu = false;
        this.isShows = false;
        var _this = this;
        var url = this.url;
        var endTime = this.dateFtt("yyyy-MM-dd hh:mm:ss", new Date());
        this.show2 = true;
        _this.type.isShow = false;

        function ajaxSendSave() {
          $.ajax({
            type: "post",    //请求方式
            async: true,    //是否异步
            url: url + "/api/services/app/OmsCareService/MoCareLogSave",
            dataType: "json",    //跨域json请求一定是jsonp
            headers: {
               'Authorization': 'Bearer '+ Authorization,
               'Oms-Tenant-Id': _this.TenantId
            },
            data: {
              "StaffId": _this.StaffId,
              "startDateTime": _this.startTime,
              "endDateTime": endTime,
              "customers": [
                {
                  "ResidentId": _this.rid,
                  "serviceItems": _this.serviceItems
                }
              ]
            },
            success: function (data) {
              //请求成功处理，和本地回调完全一样
              if (data.success) {
                _this.show = true;
                _this.show2 = false;
                _this.type.isShow = false;
                _this.position = "middle"
                _this.conText = "提交成功!"
                _this.disabeld = false;
                _this.serviceItems = [];
                if (_this.rid) {
                  _this.callSyn(_this.rid);//重新渲染页面
                }
              } else {
                _this.show = true;
                _this.show2 = false;
                _this.type.isShow = false;
                _this.position = "middle"
                _this.conText = "保存失败，请检查原因!"
                _this.disabeld = false;
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              let status = XMLHttpRequest.status;
              if (status != 200) {
                _this.show2 = false;
                _this.type.isShow = false;
                _this.disabeld = false;
                _this.showServeUnknowError({
                  onCancel() {
                    ajaxSendSave();
                  }
                })
              }
            },
            complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
              console.log(status)
              if (status == 'timeout') {//status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
                _this.show2 = false;
                _this.type.isShow = false;
                _this.disabeld = false;
                _this.showServeUnknowError({
                  onCancel() {
                    ajaxSendSave();
                  }
                })
              }
            }
          });
        }

        ajaxSendSave()
      },
      romeveSave(){
        this.isShows = false;
        this.serviceItems = [];
        this.personList.forEach(function(item,i){
          if(item.careLogItemId == 0){
             item.execResult = 2;
          }
        });

      },
      //开始按
      gtouchstartSuccess(item){
          var _this = this;
          this.timeOutEvent = setTimeout(function(){
              _this.longPress(item);
          },500);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
          return false;
      },
       //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      gtouchmove(){
          clearTimeout(this.timeOutEvent);//清除定时器
          this.timeOutEvent = 0;
      },
      gtouchendSuccess(item){
          clearTimeout(this.timeOutEvent);//清除定时器
          return false;
      },
       //开始按
      gtouchstartError(item){
          var _this = this;
          this.timeOutEvent = setTimeout(function(){
              _this.longPressAlert(item);
          },500);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
          return false;
      },
      //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
      gtouchendError(item){
          clearTimeout(this.timeOutEvent);//清除定时器
          return false;
      },
      longPress(item){

          this.timeOutEvent = 0;
          //长按如果特殊
          console.log(item)
          if(item.memo && item.noExecReasonKey){
              item.memo = "";
              item.noExecReasonKey = '';
          }
          Vue.set(item, 'memo', item.memo)
          if(item.outputStyle!='' && item.outputStyle!=null){
              this.outputStyle = JSON.parse(item.outputStyle);
              item.isShow = "Yes";
              this.isShowSuss = true;
          }else{
              this.outputStyle = [{"type":"input"}];
              item.isShow = "Yes";
              this.isShowSuss = true;
          }
      },
      successAlertCancel(item){  //清除执行弹框
         let _this = this;
         this.serviceItems.forEach(function (v, i) {
            if (v.careProgramServiceItemId == item.careProgramServiceItemId) {
              _this.serviceItems.splice(i, 1);
            }
         });
         item.execResult = 2;
         item.memo = "";
      },
      errorAlertCancel(item){  //清除执行弹框
         let _this = this;
         this.serviceItems.forEach(function (v, i) {
            if (v.careProgramServiceItemId == item.careProgramServiceItemId) {
              _this.serviceItems.splice(i, 1);
            }
         });
         item.execResult = 2;
         item.memo = "";
      },
      successAlert(item){  //执行弹框
        //恢复默认
        this.radios1.forEach((item) => {
          item.isChecked = false;
        });
        this.radios1[0].isChecked = true;

        if(item.outputStyle!='' && item.outputStyle!=null){
          this.outputStyle = JSON.parse(item.outputStyle);
          item.isShow = "Yes";
          this.isShowSuss = true;
        }else{
          this.submit(item);
        }
      },
      longPressAlert(item){ // 未执行弹框长按显示
        //回显
        if(item.memo && !item.noExecReasonKey){
            item.memo = "";
        }
        this.isShowerr = true;
        item.isShow = "No";
        if(item.noExecReasonKey == '外出'){
          this.radios.forEach((item) => {
            item.isChecked = false;
          });
          this.radios[0].isChecked = true;
        }else if(item.noExecReasonKey == '拒绝'){
          this.radios.forEach((item) => {
            item.isChecked = false;
          });
          this.radios[1].isChecked = true;
        }else{
          this.radios.forEach((item) => {
            item.isChecked = false;
          });
          this.radios[2].isChecked = true;
        }
      },
      errorAlert(item){ // 未执行弹框
          if(item.memo && !item.noExecReasonKey){
            item.memo = "";
          }
          var _this = this;
          this.serviceItems.forEach(function (v, i) {
            if (v.careProgramServiceItemId == item.careProgramServiceItemId) {
              _this.serviceItems.splice(i, 1);
            }
          });
          item.execResult = 2;
          this.isShowerr = true;
          item.isShow = "No";
          this.noExecReasonKey = "外出";    //默认
      },
      cancel(item){ //关闭弹框并且未执行任务
        this.isShowSuss = false;
        this.isShowerr = false;
        item.isShow = "Null";
        //清空选项
        item.memo = "";
        item.noExecReasonKey = '';
        this.radios.forEach((item) => {
          item.isChecked = false;
        });
        this.radios[0].isChecked = true;
        //执行弹框
        this.radios1.forEach((item) => {
          item.isChecked = false;
        });
        this.radios1[0].isChecked = true;
      },
      submit(item){ //执行任务
        item.isShow = false;
        this.isShowSuss = false;
        let _this = this;
        if(item.memo && item.noExecReasonKey){
          item.memo = "";
          item.noExecReasonKey = '';
        }
        this.serviceItems.forEach(function (v, i) {
          if (v.careProgramServiceItemId == item.careProgramServiceItemId) {
            _this.serviceItems.splice(i, 1);
          }
        });
        if(item.outputStyle!='' && item.outputStyle!=null){
          var outputStyle = JSON.parse(item.outputStyle);
          if(outputStyle[0].type == 'option'){
            this.outputStyleValue = this.outputValue;
          }else if(outputStyle[0].type == 'text'){
            this.outputStyleValue = this.numBer+"|"+this.listValue1.join();
          }else if(outputStyle[0].type == 'check') {
            this.outputStyleValue = this.listValue.join();
          }

        }
        item.execResult = 1;
        console.log(this.serviceItems);
        this.serviceItems.push({
          "serviceItemId":  item.serviceItemId,
          "outputValue":_this.outputStyleValue,
          "execResult":1,
          "noExecReasonKey":item.noExecReasonKey,
          "timePeriodId":item.timePeriodId,
          "memo":item.memo,
          "outputStyle":item.outputStyle,
          "careProgramId":item.careProgramId,
          "careLogItemId":item.careLogItemId,
          "cycle":item.cycle,
          "id":item.id,	//否	int	临时照护Id
          "careProgramServiceItemId":item.careProgramServiceItemId
        });

      },
      submitErr(item){ //不执行任务
        this.isShowerr  = false;
        item.isShow = false;
        item.execResult = 0;
        let _this = this;
        this.serviceItems.forEach(function (v, i) {
          if (v.careProgramServiceItemId == item.careProgramServiceItemId) {
            _this.serviceItems.splice(i, 1);
          }
        });
        //默认
        if(item.noExecReasonKey == "" || item.noExecReasonKey == null){
          item.noExecReasonKey = "外出";
        }
        this.serviceItems.push({
          "serviceItemId":item.serviceItemId,
          "execResult":0,
          "noExecReasonKey":item.noExecReasonKey,
          "timePeriodId":item.timePeriodId,
          "memo":item.memo,
          "careProgramId":item.careProgramId,
          "careLogItemId":item.careLogItemId,
          "cycle":item.cycle,
          "id":item.id,	//否	int	临时照护Id
          "careProgramServiceItemId":item.careProgramServiceItemId
        });
        this.radios.forEach((item) => {
          item.isChecked = false;
        });
        this.radios[0].isChecked = true;
      },
      tabUserList(item){
        this.menuList = false;
        this.rid = item.residentId;
        this.callSyn(this.rid)
        this.$router.push({
          path: 'CarePlan',
          name: 'CarePlan',
          params: {
            rid: this.rid,
          }
        });
      }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #app{
    width: 100%;

  }
  body{
    width:100%;
  }
  .wrap{
    width:100%;
    height: 100%;
    display: flex;
    flex-direction:column;
    background: #f4f4f4;
  }
  .section{
    margin-top: 80px;
    margin-bottom: 50px;
    background: #f4f4f4;
    overflow-y:auto;
    flex: 1;
  }
  .headerbar{
    width: 100%;
    height:30px;
    background: #1c76dc;
    position: fixed;
    top:0px;
  }
  .header{
    width: 100%;
    height:50px;
    background: #1c76dc url(../static/images/sy.png) no-repeat;
    background-size: cover;
    position: fixed;
    top:30px;
    display: flex;
  }
  .title{
    flex:6;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 100;

  }
  .close{
    flex:1.5;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .close_pic{
    display: flex;
  }
  .close_pic img{
    width: 100%;
    height: 100%;
  }
  .icon{
    flex:1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .personList{
    display: flex;
    height: 40px;
    background-color:#fff;
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
  .right_tit{
    float: right;
    height: 30px;
    display:inline-block;
    line-height: 30px;
    color: #a3a3a3;
    margin-right: 20px
  }
  .taskList{
    margin-top:30px;

  }
  .taskList_item{
    display: flex;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }
  .radius_time{
    width: 55px;
    height: 55px;
    border: 1px dashed #0077D9;
    border-radius: 50%;
    margin-left: 15px;
    background: #fff;
    z-index: 887
  }

  .time_tit{
    width: 100%;
    height: 18px;
    text-align: center;
    color: #0077D9;
    border: none;
  }
  .time_tit:nth-child(1){
    padding-top: 7px
  }
  .task_content{
    flex:1;
    height: 57px;
    background: #fff;
    margin-left: -28px;
    display: flex;
  }
  .task_title{
    margin-left: 45px;
    margin-top:5px;
    font-weight: 400;
  }
  .big_box{
    flex: 1;
  }
  .task_continer{
    margin-left: 45px;
  }
  .radio_box{
    width: 90px;
    float: right;
    margin-top:15px;
    margin-right:15px;
    display: flex;
  }
  .radio_item{
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 16px;

  }
  .radio_item img{
    width: 100%;
    height: 100%;
  }
  .line{
    width: 1px;
    height: 25px;
    background:#535353;
    margin: 0 15px;
  }
  .route_bigbox{
    position: fixed;
    right: 5px;
    bottom: 122px;
    z-index: 999;
    transition: all .5s ease-in-out;

  }
  .router_box{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
    margin-top: 5px;
    background: #fff;

  }
  .router_box img{
    width: 100%;
    height: 100%;
  }
  .sub_btn{
    width: 100%;
    height:50px;
    background: #0077D9;
    line-height: 50px;
    color: #fff;
    display: flex;
    justify-content: center;
    position: fixed;
    left:0;
    bottom: 0;
    font-size: 16px;
    z-index: 995;
  }
  .routers_box img{
    width: 100%;
    height: 100%;

  }
  .routers_box{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #fff;
    position: absolute;
  }
  .router_item1{
    top:-40px;
    right: 5px;
  }
  .router_item2{
    top:-85px;
    right: 5px;
  }
  .router_item3{
    top:-130px;
    right: 5px;
  }
  .router_item4{
    top:-175px;
    right: 5px;
  }
  .router_item5{
    top:-220px;
   right: 2px;
   background: #fff;
   height: 35px;
   width: 33px;
   text-align: center;
  }
  .router_item5 img{
     width: 80%;
     height: 80%;
  }
  .suc_active{
    border-color: #a6ea66;
    color: #a6ea66;
  }
  .err_active{
    border-color: #cf1615;
    color: #cf1615;
  }
  .draw_box{
    width: 96%;
    height: 100%;
    display: flex;
    position: absolute;
    right: 0;
    z-index: 888;
    margin-left: 15px;
    background: #000;
    opacity: 0.3;
    border-radius: 50px 0 0 50px
  }
  .userList{
    width: 180px;
    background: #ffffff;
    border-radius: 5px;
    position: fixed;
    top:80px;
    right: 10px;
    z-index: 50002;
    max-height: 240px;
    overflow-y:scroll;
  }
  .userList li{
    border-bottom: 1px solid #f0f0f0;
    height: 44px;
    line-height:44px;
    display: flex;
  }
  .userList li .item{
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .userList li .item_sex{
    flex:0.5;
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
  .text {
    font-size: 14px;
    height: 70px;
    color: #555;
    display: flex;
  }
  .text p{
    padding-top:15px;
    padding-left: 30px;
    padding-right: 10px;
    width: 25px;
    height: 25px;
  }
  .text p img{
    width: 100%;
    height: 100%;
  }
  .input_txt{
    border: 0;
    border-bottom: 1px solid #bdbdbd;
    float: left;
    width: 70%;
    height: 25px;
    margin-top:10px ;
    padding-left: 10px;
    font-size: 14px;
  }
  .input_txts{
    border: 0;
    border-bottom: 1px solid #bdbdbd;
    float: left;
    width: 85%;
    height: 25px;
    display: inline-block;
    margin-left: 7%;
    padding-left: 15px;
    font-size: 14px;
  }
  .btn-group {
    display: flex;
    height: 50px;
    border-top: 0.1px solid #D5D5D6;
  }
  .btn {
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #999999;

  }
  .btn:last-child {
    color: #0077D9;
    border-left: 0.1px solid #D5D5D6;
  }
  .btn span{
     padding: 5px 30px;
  }
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9995;
    background: rgba(0,0,0,.3);
  }
  .mask_box{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9995;
    background: rgba(0,0,0,.3);
    color: #fff;
  }
  .text_center{
    text-align: center;
    width: 90%;
    margin-left: 5%;
  }
  .items{
    flex: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .textBox{
    height: 70px;
    font-size: 16px;
    color: #282828;
    padding:0 20px;
  }
  .icon_close{
    width:30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #f0f0f0;
    border-radius: 50%;
    position: absolute;
    right: -10px;
    top:-10px;
    font-size:20px;
    background:#fff;
    color: #999;
  }
  .radio-box{
    flex: 1;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    position: relative;
    margin-right: 5px;
    font-size: 14px;
    margin-top:10px;
    padding: 0 5px;
  }
  .check-box{
    flex: 1;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    margin-right: 5px;
    font-size: 14px;
    margin-top:10px;
    padding: 0 10px;
  }
  .radio {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    cursor: pointer;
    background-image: url('../static/images/radio.png');
    background-position: 0 16px;
    background-size: cover;
    margin-right: 3px;

  }
  .input-radio {
    display: inline-block;
    position: absolute;
    opacity: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    left: 0px;
    outline: none;
    margin-right: 3px;
    -webkit-appearance: none;
  }
  .on {
    background-position: 0 0;
  }
  .mask_router{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 997;
    background: rgba(0,0,0,.3);
  }
  .noData{
    margin-top:30%;
  }
  .noData p{
    text-align: center;
    font-size: 14px;
    line-height: 50px;
    color: #282828;
  }
  .noData img{
     width:120px;
     height: 120px;
     margin-left:50%;
     transform: translateX(-50%);
  }
  .text_Box{
    padding: 20px;
    color: #282828;
    font-size: 16px;
  }
  .rou_tit{
    position: absolute;
    top:5px;
    left: -55px;
    padding: 2px 10px;
    background: #ccc;
    color:#282828;
    border-radius: 4px;
  }
  .dialog-bottom{
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;
    z-index: 9999;
  }
  .dialog-bottom .btn{
    line-height: 50px;
    height: 50px;
    color: #282828;
  }
  .dialog-bottom .btn:nth-child(2){
    border-top:1px solid rgba(0,0,0,.3);
    color: #282828;
  }
  .dialog-bottom .btn:nth-child(3){
    border-top:1px solid rgba(0,0,0,.3);
    color: #0077D9;
  }
  .dialog-bottom .btn:last-child{
    border-top:10px solid rgba(0,0,0,.3);
    color: #999999;
  }
  .wrap  >>> .weui-cells_checkbox {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    border: 0;

  }
  .wrap >>> .weui-cell:before{
    border-top:0;

  }
  .wrap >>> .weui-cells ,.wrap >>> .weui-cell{
    position: static;
  }
  .wrap >>> .weui-cell{
    padding: 0 8px;
  }
  .wrap >>> .weui-cells_checkbox .weui-icon-checked:before{
    font-size:17px;
  }
  .wrap >>> .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before{
    color: #0077D9;
  }
</style>

