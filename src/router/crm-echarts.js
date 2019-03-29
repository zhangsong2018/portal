/**********************  CRM模块  **********************/
const crmEcharts = [
  {
    path: '/crm-crmEcharts/echartsList',
    name: 'echartsList',
    meta: {
      title: '报表列表'
    },
    component: resolve => require(['../views/crm-echarts/echarts-list/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/incomingCallQuantity',
    name: 'incomingCallQuantity',
    meta: {
      title: '来电量报表'
    },
    component: resolve => require(['../views/crm-echarts/incoming-call-quantity/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/visitorVolume',
    name: 'visitorVolume',
    meta: {
      title: '来访量报表'
    },
    component: resolve => require(['../views/crm-echarts/visitor-volume/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/InfoStatistics',
    name: 'InfoStatistics',
    meta: {
      title: '渠道分布'
    },
    component: resolve => require(['../views/crm-echarts/info-statistics/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/DealCycle',
    name: 'DealCycle',
    meta: {
      title: '成交周期'
    },
    component: resolve => require(['../views/crm-echarts/deal-cycle/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/AreaStatistics',
    name: 'AreaStatistics',
    meta: {
      title: '区域占比统计'
    },
    component: resolve => require(['../views/crm-echarts/area-statistics/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/visitTurnoverRate',
    name: 'visitTurnoverRate',
    meta: {
      title: '访转成交率'
    },
    component: resolve => require(['../views/crm-echarts/visit-turnover-rate/index.vue'], resolve)
  },
  {
    path: '/crm-crmEcharts/dianZhuanVisit',
    name: 'dianZhuanVisit',
    meta: {
      title: '电转访'
    },
    component: resolve => require(['../views/crm-echarts/dian-zhuan-visit/index.vue'], resolve)
  }
]

export default crmEcharts;
