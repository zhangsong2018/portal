<template>
  <div id="wrap">
    <HeaderBarIT>
      <div class="close_pic" slot="close" @click="toCrmList()">
        <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
      </div>
      <span slot="title">来访量</span>
      <div class="icon" @click="complete()" slot="icon">
        <img src="@/static/images/shaixuan.png" style="width: 25px;height: 25px;;margin-left:3px">
      </div>
    </HeaderBarIT>
    <section class="section">
      <div class="center_time">{{dataValueWeek}}  至  {{dataValue}}</div>
      <div id="visitorVolume"></div>
      <table class="table">
        <thead>
        <tr>
          <th>日期</th>
          <th>来访数量</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="result.length > 0" v-for="item in result">
          <td>{{item.Name}}</td>
          <td>{{item.ResultCount}}</td>
        </tr>
        </tbody>
      </table>
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
  import { PopupHeader, Popup,Group,Datetime,Toast,TransferDomDirective as TransferDom} from 'vux'
  import * as sysApi from '../../../services/sys'
  import tabBar from '../components/tabBar'
  let echarts = require('echarts/lib/echarts');
      require('echarts/lib/chart/bar');
      require('echarts/lib/component/tooltip');
      require('echarts/lib/component/title');
      require("echarts/lib/component/dataZoom");
      require("echarts/lib/component/legendScroll");
      require("echarts/lib/chart/pie");
      require("echarts/lib/chart/gauge");
  let colors = ['#d14a61', '#675bba'];
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
        startDate:'',
        endDate:'',
        done:'完成',
        cancel:'重置',
        id: 'visitorVolume',
        pieOption:'',
        data:[],
        timeData:[],
        isShow:false,
        dataValue:"",
        myChart:"",
        dataValueWeek:"",
        dafultValue:"",
        result:""
      }
    },
    created(){
      //this.defaultTime();
    },
    mounted(){
      this.defaultTime();
      this.$nextTick(()=>{
        this.setOption();
      })
    },
    methods:{
      complete(){
        this.show = true;
      },
      fulfil(){
        if(this.data.length>0){
          this.data = []
        }
        if(this.timeData.length>0){
          this.timeData = []
        }
        this.dataValue = this.endDate;
        this.dataValueWeek = this.startDate;
        this.show = false;
        sysApi.GetVisitDataCount({
          startDate:this.startDate,
          endDate:this.endDate
        }).then(res => {
          this.isShow = true;
          this.result = res.data;
          let _this = this;
          res.data.forEach(function(item,i){
            _this.data.push(item.ResultCount);
            _this.timeData.push(item.Name);
          });
          this.setOption();
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
        this.startDate = '';
        this.endDate = '';
      },
      setOption(){
        let myChart = echarts.init(document.getElementById('visitorVolume'));
        let option = {
          color: colors,
            title:{
            text:'',
            itemGap:5,
            left:'40',
            textStyle:{
            fontSize:16,
          }
        },
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:888;',
          },
          grid: {
            right: '5%',
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: false
              },
              data: this.timeData
            }
          ],
            yAxis: [
          {
            type: 'value',
            name: '',
            min: 0,
            max: 500,
            show:false,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '',
            show:false,
            min: 0,
            max: 500,
            position: 'right',
            offset: 80,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '',
            nameLocation:'middle',
            // nameRotate:0,
            min: 0,
            position: 'left',
            axisLine: {
              lineStyle: {
                //        color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
          series: [
          {
            name:'来访量',
            type:'bar',
            yAxisIndex: 2,barWidth:20,
            data:this.data
          },
        ]
        }
        myChart.setOption(option);
        this.myChart = myChart;
      },
      defaultTime(){
        this.dafultValue = this.dateFtt("yyyy-MM-dd",new Date());
        this.dataValue = this.dateFtt("yyyy-MM-dd",new Date());
        this.dataValueWeek = this.dateFttWeek("yyyy-MM-dd",new Date());
        sysApi.GetVisitDataCount({
          startDate:this.dataValueWeek,
          endDate:this.dataValue
        }).then(res => {
          this.isShow = true;
          this.result = res.data;
          let _this = this;
          res.data.forEach(function(item,i){
            _this.data.push(item.ResultCount);
            _this.timeData.push(item.Name);
          });
        }).then(res=>{
            this.setOption();
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
        this.startDate = '';
        this.endDate = '';
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
        this.creatTime="";
        this.endTime="";
      },
      onConfirm(){

      },
      prevPage(){
        this.$router.replace({
          path: '/crm-crmEcharts/incomingCallQuantity',
          name: 'incomingCallQuantity'
        })
      },
      nextPage(){
        this.$router.replace({
          path: '/crm-crmEcharts/AreaStatistics',
          name: 'AreaStatistics'
        })
      },
      toCrmList(){
        this.$router.push({
          path: '/crm-crmEcharts/echartsList',
          name: 'echartsList'
        })
      }
    },
    beforeDestroy(){
      this.myChart.dispose();
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
    overflow-y:scroll ;
  }
  #visitorVolume{
    width: 100%;
    height: 450px;
  }
  .center_time{
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    color: #282828;
  }
</style>
