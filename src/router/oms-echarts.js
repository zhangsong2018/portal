const statistics = [
  {
    path:"/statistics/oms",
    meta:{
      title:"统计oms模块主页面"
    },
    component:(resolve) => require(['../views/oms-echarts/list.vue'],resolve),
  },
  {
    path:"/statistics/oms/every",
    meta:{
      title:"统计oms模块每一个苑的统计list"
    },
    component:(resolve) => require(['../views/oms-echarts/every.vue'],resolve),
  },
  {
    path:"/statistics/oms/echarts",
    meta:{
      title:"统计oms模块动态渲染每一个图表"
    },
    component:(resolve) => require(['../views/oms-echarts/echarts.vue'],resolve),
  },
  {
    path:"/statistics/oms/survey",
    meta:{
      title:"统计oms模块机构概况"
    },
    component:(resolve) => require(['../views/oms-echarts/surveyOrganization.vue'],resolve),
  },
]
export default statistics;
