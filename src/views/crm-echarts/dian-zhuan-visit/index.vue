<template>
  <div id="wrap">
    <HeaderBarIT>
      <div class="close_pic" slot="close" @click="toCrmList()">
        <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
      </div>
      <span slot="title">电转访</span>
      <div class="icon" @click="complete()" slot="icon">
        <img src="@/static/images/shaixuan.png" style="width: 25px;height: 25px;;margin-left:3px">
      </div>
      </HeaderBarIT>
    <section class="section">
      <div class="center_time">{{dataValueWeek}}  至  {{dataValue}}</div>
      <div class="center">
        电转访率为:{{resultCount}}%
      </div>
      <tabBar>
        <div slot="left_icon" @click="prevPage()">
          <img src="@/static/images/prev_pic.png" style="transform: scale(0.6)">
        </div>
        <div slot="right_icon" @click="nextPage()">
          <img src="@/static/images/next_pic.png" style="transform: scale(0.6)">
        </div>
      </tabBar>
      <div v-transfer-dom>
        <popup v-model="show">
          <popup-header
            :left-text="cancel"
            :right-text="done"
            :title="$t('请按条件筛选')"
            :show-bottom-border="false"
            @on-click-left="reset()"
            @on-click-right="fulfil()"></popup-header>
          <div style="display: flex;">
            <div style="flex:1;height: 150px;overflow-y: scroll;background: #fff;" >
              <h3 style="line-height: 30px;margin:10px 0 10px 15px;">时间段</h3>
              <div class="center">
                <group>
                  <datetime
                    v-model="startDate"
                    format="YYYY-MM-DD"
                    :end-date="dafultValue"
                    :title="$t('请选择开始时间:')"
                    @on-confirm="onConfirm"
                  ></datetime>
                </group>
              </div>
              <div class="center">
                <group>
                  <datetime
                    v-model="endDate"
                    format="YYYY-MM-DD"
                    :start-date="startDate"
                    :end-date="dafultValue"
                    :title="$t('请选择结束时间:')"
                    @on-confirm="onConfirm"
                  ></datetime>
                </group>
              </div>
            </div>
          </div>

        </popup>
      </div>
    </section>

  </div>
</template>

<script>
  import HeaderBarIT from '@/views/HeaderBarIT'
  import {PopupHeader, Popup,Group,Datetime,Toast,TransferDomDirective as TransferDom} from 'vux'
  import tabBar from '../components/tabBar'
  import * as sysApi from '../../../services/sys'
  var colors = ['#d14a61', '#675bba'];
  export default {
    name: 'HelloWorld',
    directives: {
      TransferDom
    },
    components: {
      HeaderBarIT,
      Datetime,
      Toast,
      PopupHeader, Popup,Group,tabBar
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        show:false,
        startDate:"",
        endDate:"",
        done:'完成',
        cancel:'重置',
        resultCount:"",
        dataValue:"",
        dataValueWeek:"",
        dafultValue:""
      }
    },
    created(){
      this.defaultTime();
    },
    methods:{
      complete(){
        this.show = true;
      },
      fulfil(){
        this.show = false;
        this.dataValue = this.endDate;
        this.dataValueWeek = this.startDate;
        sysApi.GetCallVisitData({
          startDate:this.startDate,
          endDate:this.endDate
        }).then(res => {
          this.resultCount = res.data;
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
        this.startDate = '';
        this.endDate = '';
      },
      defaultTime(){
        this.dafultValue = this.dateFtt("yyyy-MM-dd",new Date());
        this.dataValue = this.dateFtt("yyyy-MM-dd",new Date());
        this.dataValueWeek = this.dateFttWeek("yyyy-MM-dd",new Date());
        sysApi.GetCallVisitData({
          startDate:this.dataValueWeek,
          endDate:this.dataValue
        }).then(res => {
          this.resultCount = res.data;
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
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
      dateFttWeek(fmt,date){
        var o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate()-7,                    //日
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
      reset(){
        this.show = false;
        this.startDate="";
        this.endDate="";
      },
      onConfirm(){

      },
      prevPage(){
        this.$router.push({
          path: '/crm-crmEcharts/visitTurnoverRate',
          name: 'visitTurnoverRate'
        })
      },
      nextPage(){
        this.$vux.toast.text('已经是最后图表了', 'middle')
      },
      toCrmList(){
        this.$router.push({
          path: '/crm-crmEcharts/echartsList',
          name: 'echartsList'
        })
      }
    }
  }
</script>
<style scoped>
  html,body{
    width:100%;
    height: 100%;
  }
  #wrap{
    width:100%;
    min-height: 100%;
    background: #f4f4f4;
    display: flex;
    flex-direction: column;
  }
  .section{
    flex: 1;
    background: #ffffff;
    margin-top: 80px;
  }
  .center{
    text-align: center;
    font-size: 24px;
    color: #282828;
    line-height:100px;
  }
  .center_time{
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    color: #282828;
  }
</style>
