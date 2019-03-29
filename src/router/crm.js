/**********************  CRM模块  **********************/
const crm = [
  {
    path: '/crm/UserListCRM/:degree/:endDistributeTime/:nextDate/:endNextDate/:isRemindCycle/:operationUserId/:sorting',
    name: 'UserListCRM',
    meta: {
      title: '用户列表'
    },
    component: resolve => require(['../views/crm/user-list-crm/index.vue'], resolve)
  },
  {
    path:"/crm/AddUserCrm",
    name:"AddUserCrm",
    meta: {
      title: '添加用户'
    },
    component: resolve => require(['../views/crm/add-user/addUser.vue'], resolve)
  },
  {
    path: '/crm/UserDetail/:id',
    name: 'UserDetail',
    meta: {
      title: '用户详情'
    },
    component: resolve => require(['../views/crm/user-detail/UserDetail.vue'], resolve)
  },
  {
    path: '/crm/AddCommunication',
    name: 'AddCommunication',
    meta: {
      title: '填写沟通（新增）'
    },
    component: resolve => require(['../views/crm/communication/communication.vue'], resolve)
  }
]

export default crm;
