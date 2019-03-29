/**********************  生命体征  **********************/
const vitalSign = [
  {
    path: '/VitalSigns/BloodSugar/:rid/:isBP',
    name: 'BloodSugar',
    meta: {
      title: '测试血糖'
    },
    component: resolve => require(['../views/vital-signs/blood-sugar/index.vue'], resolve)//生命体征里面的测试血糖页
  },
  {
    path: '/VitalSigns/BloodPressure/:rid/:isBP',
    name: 'BloodPressure',
    meta: {
      title: '测试血压'
    },
    component: resolve => require(['../views/vital-signs/blood-pressure/index.vue'], resolve)//生命体征里面的测试血压页
  },
  {
    path: '/VitalSigns/Temperature/:rid/:isBP',
    name: 'Temperature',
    meta: {
      title: '测试体温'
    },
    component: resolve => require(['../views/vital-signs/temperature/index.vue'], resolve)//生命体征里面的测试体温页
  },
  {
    path: '/VitalSigns/Weight/:rid/:isBP',
    name: 'Weight',
    meta: {
      title: '测试体重'
    },
    component: resolve => require(['../views/vital-signs/weight/index.vue'], resolve)//生命体征里面的测试体重页
  },
  {
    path: '/History/HistoryTemperature/:rid',
    name: 'HistoryTemperature',
    meta: {
      title: '体温历史记录'
    },
    component: resolve => require(['../views/history/Temperature.vue'], resolve)//生命体征里面的历史体温页
  },
  {
    path: '/History/HistoryBloodPressure/:rid',
    name: 'HistoryBloodPressure',
    meta: {
      title: '血压历史记录'
    },
    component: resolve => require(['../views/history/BloodPressure.vue'], resolve)//生命体征里面的历史血压页
  },
  {
    path: '/History/HistoryBloodSugar/:rid',
    name: 'HistoryBloodSugar',
    meta: {
      title: '血糖历史记录'
    },
    component: resolve => require(['../views/history/BloodSugar.vue'], resolve)//生命体征里面的历史血糖页
  },
  {
    path: '/History/HistoryWeight/:rid',
    name: 'HistoryWeight',
    meta: {
      title: '体重历史记录'
    },
    component: resolve => require(['../views/history/BloodSugar.vue'], resolve)//生命体征里面的测历史重页
  }
]

export default vitalSign;
