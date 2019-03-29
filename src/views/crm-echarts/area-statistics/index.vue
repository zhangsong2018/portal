<template>
  <div id="wrap">
    <HeaderBarIT>
      <div class="close_pic" slot="close" @click="toCrmList()">
        <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
      </div>
      <span slot="title">区域占比</span>
    </HeaderBarIT>
    <section class="section">
      <div id="AreaStatistics"></div>
      <table class="table">
        <thead>
        <tr>
          <th>区域名称</th>
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
  import * as sysApi from '../../../services/sys'
  import tabBar from '../components/tabBar'
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
        myChart:"",
        result:[]
      }
    },
    mounted(){
      this.init();
    },
    methods:{
      init(){
        sysApi.GetAreaData().then(res => {
          if(this.myChart){
            this.myChart.clear();
          }
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
        this.myChart = echarts.init(document.getElementById('AreaStatistics'));
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
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
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
        this.myChart.setOption(option);
      },
      prevPage(){
        this.$router.push({
          path: '/crm-crmEcharts/visitorVolume',
          name: 'visitorVolume'
        })
      },
      nextPage(){
        this.$router.push({
          path: '/crm-crmEcharts/DealCycle',
          name: 'DealCycle'
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
  #AreaStatistics{
    height: 450px;
  }
</style>
