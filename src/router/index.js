import Vue from 'vue'
import Router from 'vue-router'
import care from './care' //照护模块
import vitalSign from './vital-sign' //生命体征模块
import crm from './crm' //CRM模块
import crmEcharts from './crm-echarts' //CRM模块
import oms_echarts from "./oms-echarts.js"
import admin from "./admin"
import handOver from './hand-over'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name:'index',
      meta: {
        title: 'OMS'
      },
      component: resolve => require(['../views/index/index.vue'], resolve)//首页
    },
    ...vitalSign,
    ...care,
    ...crm,
    ...oms_echarts,
    ...crmEcharts,
    ...admin,
    ...handOver
  ]
});

export default router


