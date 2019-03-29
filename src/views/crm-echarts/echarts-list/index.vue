<template>
  <div id="wrap">
     <HeaderBarIT>
       <div class="close_pic" slot="close" @click="toClocse()">
         <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
       </div>
       <span slot="title">CRM报表</span>
     </HeaderBarIT>
     <section class="section">
       <ul id="dataList" class="data-list">
         <li class="userlist_item" v-for="item in echartsList" @click="toUserDetails(item)">
           <p>{{item.title}} <span style="float: right;margin-right: 15px;">  </span></p>
         </li>
       </ul>
     </section>
  </div>
</template>

<script>
  import HeaderBarIT from '@/views/HeaderBarIT'
  import * as sysApi from '../../../services/sys'
  export default {
    name: 'echartsList',
    data () {
      return {
        title:"报表首页",
        echartsList:[
          {
            title:"来电量统计",
            path: '/crm-crmEcharts/incomingCallQuantity',
            name: 'incomingCallQuantity'
          },
          { title:"来访量统计",
            path: '/crm-crmEcharts/visitorVolume',
            name: 'visitorVolume'
          },
          {title:"区域占比",
            path: '/crm-crmEcharts/AreaStatistics',
            name: 'AreaStatistics'
          },
          { title:"成交周期",
            path: '/crm-crmEcharts/DealCycle',
            name: 'DealCycle'},
          { title:"渠道统计",
            path: '/crm-crmEcharts/InfoStatistics',
            name: 'InfoStatistics'},
          { title:"访转成交率",
            path: '/crm-crmEcharts/visitTurnoverRate',
            name: 'visitTurnoverRate'
          },
          {
            title:"电转访",
            path: '/crm-crmEcharts/dianZhuanVisit',
            name: 'dianZhuanVisit'
          },
        ]
      }
    },
    created () {

    },
    components: {
      HeaderBarIT
    },
    methods: {
      toClocse(){
        window.location.href = 'http://jujia01.ycsenior.com:5012/#/bi-list';  // 测试地址
        //window.location.href = 'http://portal.yuechenggroup.com:18796/#/bi-list'; //线上地址
      },
      toUserDetails(item){
        this.$router.replace({
          path: item.path,
          name: item.name,
        })
      }
    },
    watch:{
      $route:{
        handler: function(val, oldVal){
          alert(val);
        },
        // 深度观察监听
        deep: true
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  html,body{
    width:100%;
    height: 100%;
  }
  #wrap{
    width:100%;
    min-height: 100%;
    background: #f4f4f4;

  }
  section{
    margin-top:80px;
  }
  .userlist_item{
    width: 100%;
    background: #ffffff;
    padding: 5px 0;
    height:30px;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  .userlist_item {
    line-height: 30px;
  }
  .userlist_item p{
    padding-left: 25px;
  }
</style>

