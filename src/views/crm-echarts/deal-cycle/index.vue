<template>
  <div id="wrap">
    <HeaderBarIT>
      <div class="close_pic" slot="close" @click="toCrmList()">
        <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
      </div>
      <span slot="title">成交周期</span>
      <div class="icon" @click="complete()" slot="icon">
        <img src="@/static/images/shaixuan.png" style="width: 25px;height: 25px;;margin-left:3px">
      </div>
      </HeaderBarIT>
    <section class="section">
      <table class="table">
        <thead>
        <tr>
          <th>姓名</th>
          <th>创建日期</th>
          <th>入住日期</th>
          <th>周期(天)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="result.length > 0" v-for="item in result">
          <td>{{item.Name}}</td>
          <td>{{item.CreationTime | formatedate}}</td>
          <td>{{item.EnteredDate | formatedate}}</td>
          <td>{{item.DayCount}}</td>
        </tr>
        </tbody>
      </table>
      <div v-if="result.length == 0" class="center">
        暂无数据
      </div>
      <div v-transfer-dom>
        <popup v-model="show">
          <popup-header
            :left-text="cancel"
            :right-text="done"
            :title="$t('请按条件查询')"
            :show-bottom-border="false"
            @on-click-left="reset()"
            @on-click-right="fulfil()"></popup-header>
          <div style="display: flex;">
            <div style="width: 100px">
              <p class="tab_item" :class="{'actives':numitem=='0'}">成交周期</p>
            </div>
            <div style="flex:1;height: 200px;overflow-y: scroll;background: #fff">
              <group gutter="0">
                <radio title="title" :options="options" v-model="dataVal"></radio>
              </group>
            </div>
          </div>
        </popup>
      </div>

      <tabBar>
        <div slot="left_icon" @click="prevPage()">
          <img src="@/static/images/prev_pic.png" style="transform: scale(0.6)">
        </div>
        <div slot="right_icon" @click="nextPage()">
          <img src="@/static/images/next_pic.png" style="transform: scale(0.6)">
        </div>
      </tabBar>
    </section>

  </div>
</template>

<script>
  import HeaderBarIT from '@/views/HeaderBarIT'
  import {Radio,PopupHeader, Popup,Group,Toast,TransferDomDirective as TransferDom} from 'vux'
  import * as sysApi from '../../../services/sys'
  import tabBar from '../components/tabBar'
  var colors = ['#d14a61', '#675bba'];
  export default {
    name: 'HelloWorld',
    directives: {
      TransferDom
    },
    components: {
      HeaderBarIT,
      Toast,
      PopupHeader,
      Popup,
      Group,
      Radio,
      tabBar
    },
    filters: {
      formatedate: function (d) {
        if (d != "") {
          var date = new Date(parseInt(d.substring(6, 19)));
          var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
          };
          var fmt = 'yyyy-MM-dd hh:mm:ss'
          if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
          for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          return fmt;
          return date.toLocaleDateString();
        }
      }
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        show:false,
        startDate:"",
        endDate:"",
        done:'完成',
        cancel:'重置',
        numitem:0,
        result:"",
        dataValue:"",
        dataVal:"一个月内",
        options:['一个月内','三个月内','半年内'],
        type:""
      }
    },
    created(){
      this.fulfil()
    },
    methods:{
      complete(){
        this.show = true;
      },
      fulfil(){
        this.show = false;
        if(this.dataVal == '一个月内'){
          this.type = 30;
        }else if(this.dataVal == '三个月内'){
          this.type = 90;
        }else if(this.dataVal == '半年内'){
          this.type = 180;
        }
        sysApi.GetDealCycleData({
          type:this.type
        }).then(res => {
          this.result = res.data;
          console.log( this.result)
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
        this.startDate = '';
        this.endDate = '';
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
          path: '/crm-crmEcharts/AreaStatistics',
          name: 'AreaStatistics'
        })
      },
      nextPage(){
        this.$router.push({
          path: '/crm-crmEcharts/InfoStatistics',
          name: 'InfoStatistics'
        })
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
<style lang="scss" scoped>
  @import "../css/mescroll.scss";
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
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #282828;
    line-height:50px;
  }
  .tab_item{
    line-height: 45px;
    text-align: center;
    font-size: 16px;
  }
  .actives{
    background: #fff;
  }
</style>
