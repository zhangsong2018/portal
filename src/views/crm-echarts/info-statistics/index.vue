<template>
  <div id="wrap">
    <HeaderBarIT>
      <div class="close_pic" slot="close" @click="toCrmList()">
        <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
      </div>
      <span slot="title">渠道统计</span>
    </HeaderBarIT>
    <section class="section">
      <h2 class="center">一级渠道统计</h2>
      <div id="FirstInfoSourceData"></div>
      <table class="table">
        <thead>
        <tr>
          <th>渠道</th>
          <th>数量</th>
          <th>占比</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="result.length > 0" v-for="item in result">
          <td>{{item.Name}}</td>
          <td>{{item.ResultCount}}</td>
          <td>{{item.count}}%</td>
        </tr>
        </tbody>
      </table>
      <div style="display: flex;height: 44px;width: 280px;margin: 10px auto">
        <group style="width: 280px">
          <selector placeholder="一级渠道名称" v-model="optionName"  :options="list"  @on-change="getFirstInfoSourceData"></selector>
        </group>
        <!--<div class="btn" @click="getFirstInfoSourceData()">查询</div>-->
      </div>
      <h2 class="center">二级渠道统计</h2>
      <div id="SecondInfoSourceData"></div>
      <table class="table">
        <thead>
        <tr>
          <th>渠道</th>
          <th>数量</th>
          <th>占比</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="sourceData.length > 0" v-for="item in sourceData">
          <td>{{item.Name}}</td>
          <td>{{item.ResultCount}}</td>
          <td>{{item.count}}%</td>
        </tr>
        </tbody>
      </table>
      <div style="display: flex;height: 44px;width: 280px;margin: 10px auto">
        <group style="width: 140px">
          <selector placeholder="一级渠道名称" v-model="ThirdInfoOneData"  :options="ThirdInfolist"  @on-change="onChange"></selector>
        </group>
        <group style="width: 140px">
          <selector placeholder="二级级渠道名称" v-model="ThirdInfoTwoData"  :options="ThirdInfolistTwo"  @on-change="getThirdInfoSourceData"></selector>
        </group>
        <!--<div class="btn" @click="getThirdInfoSourceData()">查询</div>-->
      </div>
      <h2 class="center">三级渠道统计</h2>
      <div id="ThirdInfoSourceData"></div>
      <table class="table">
        <thead>
        <tr>
          <th>渠道</th>
          <th>数量</th>
          <th>占比</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="thirdInfoSourceData.length > 0" v-for="item in thirdInfoSourceData">
          <td>{{item.Name}}</td>
          <td>{{item.ResultCount}}</td>
          <td>{{item.count}}%</td>
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
    </section>

  </div>
</template>

<script>
  import HeaderBarIT from '@/views/HeaderBarIT'
  import {Selector,Group} from 'vux'
  import tabBar from '../components/tabBar'
  import * as sysApi from '../../../services/sys'
  var echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require("echarts/lib/component/dataZoom");
  require("echarts/lib/component/legendScroll");
  require("echarts/lib/chart/pie");
  require("echarts/lib/chart/gauge");
  export default {
    name: 'HelloWorld',
    title:"",
    components: {
      HeaderBarIT,
      Selector,
      Group,
      tabBar,
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        show:false,
        creatTime:"",
        endTime:"",
        done:'完成',
        cancel:'重置',
        id: 'AreaStatistics',
        data:[],
        secondInfoData:[],
        thirdInfoData:[],
        optionName:"媒体推广",
        list:['媒体推广','渠道推广', '自然到访'],
        ThirdInfoOneData:"媒体推广",
        ThirdInfoTwoData:"报纸",
        ThirdInfolist:['媒体推广','渠道推广', '自然到访'],
        ThirdInfolistTwo:[],
        result:'',
        sourceData:"",
        thirdInfoSourceData:""

      }
    },
    mounted(){
      this.init();
      this.setOptionFirstInfo();
      this.setOptionThirdInfo();
    },
    methods:{
      init(){
        sysApi.GetFirstInfoSourceData().then(res => {
          this.result = res.data;
          let _this = this;
          let count = 0;
          res.data.forEach(function(item,i){
            _this.data.push({name:item.Name,value:item.ResultCount});
            count += parseInt(item.ResultCount);
          });
          res.data.forEach(function(item,i){
            item.count = (item.ResultCount/count*100).toFixed(2);
          });
          this.setOption();
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });

      },
      setOption(){
        let myChart = echarts.init(document.getElementById('FirstInfoSourceData'));
        let option = {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            extraCssText: 'z-index:888;',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data:[]
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data:this.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option);
      },
      getFirstInfoSourceData(){
        if(this.secondInfoData.length>0){
          this.secondInfoData = []
        }
        console.log(this.secondInfoData,11111)
        sysApi.GetSecondInfoSourceData({
          type:this.optionName
         }
        ).then(res => {
          this.sourceData = res.data;
          let _this = this;
          let count = 0;
          res.data.forEach(function(item,i){
            _this.secondInfoData.push({name:item.Name,value:item.ResultCount});
            count += parseInt(item.ResultCount);
          });
          res.data.forEach(function(item,i){
            item.count = (item.ResultCount/count*100).toFixed(2);
          });
          this.setOptionFirstInfo();
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
      },
      setOptionFirstInfo(){
        let myChart = echarts.init(document.getElementById('SecondInfoSourceData'));
        let option = {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            extraCssText: 'z-index:888;',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data:[]
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data:this.secondInfoData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option);
      },
      onChange(){
        if(this.ThirdInfolistTwo.length>0){
          this.ThirdInfolistTwo = []
        }
        sysApi.GetDictValTextByName({
            type:this.ThirdInfoOneData
          }
        ).then(res => {
          let result = res.data;
          let _this = this;
          result.forEach(function(item,i){
            _this.ThirdInfolistTwo.push(item.Name);
          });
          console.log(this.ThirdInfolistTwo)
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
      },
      getThirdInfoSourceData(){
        if(this.thirdInfoData.length>0){
          this.thirdInfoData = []
        }
        sysApi.GetThirdInfoSourceData({
            firstName:this.ThirdInfoOneData,
            secondName:this.ThirdInfoTwoData
          }
        ).then(res => {
          this.thirdInfoSourceData = res.data;
          let _this = this;
          let count = 0;
          res.data.forEach(function(item,i){
            _this.thirdInfoData.push({name:item.Name,value:item.ResultCount});
            count += parseInt(item.ResultCount);
          });
          res.data.forEach(function(item,i){
            item.count = (item.ResultCount/count*100).toFixed(2);
          });
          this.setOptionThirdInfo();
        }) .catch((error) => {
          this.show2 = false;
          this.$vux.toast.text('请求失败，接口异常', 'center');
        });
      },
      setOptionThirdInfo(){
        let myChart = echarts.init(document.getElementById('ThirdInfoSourceData'));
        let option = {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            extraCssText: 'z-index:888;',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data:[]
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data:this.thirdInfoData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option);
      },
      prevPage(){
        this.$router.push({
          path: '/crm-crmEcharts/DealCycle',
          name: 'DealCycle'
        })
      },
      nextPage(){
        this.$router.push({
          path: '/crm-crmEcharts/visitTurnoverRate',
          name: 'visitTurnoverRate'
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
  #FirstInfoSourceData,#SecondInfoSourceData,#ThirdInfoSourceData{
    height:400px;
  }
  .btn {
    display: inline-block;
    padding: 0px 20px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 44px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-left: 10px;
  }
  .center{
    text-align: center;
    line-height: 1.5;
  }
</style>
