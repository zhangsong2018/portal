/**********************  照护执行  **********************/
const care = [
  {
    path: '/CarePlan/:rid',
    name: 'CarePlan',
    meta: {
      title: '护理计划'
    },
    component: resolve => require(['../views/CarePlan.vue'], resolve)//照护列表
  },
  {
    path: '/index/AddUser',
    name: 'AddUser',
    meta: {
      title: '添加用户'
    },
    component: resolve => require(['../views/index/add-user/index.vue'], resolve)//照护添加用户
  },
  {
    path: '/index/AddUserBP',
    name: 'AddUserBP',
    meta: {
      title: '添加用户生命体征'
    },
    component: resolve => require(['../views/index/add-user-bp/index.vue'], resolve)//生命体征 添加用户
  }
]

export default care;
