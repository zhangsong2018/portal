/**************OMS管理端********************/
export default [{
  path: '/admin/index',
  name: 'Page',
  meta: {
    title: 'OMS管理端首页'
  },
  component: resolve => require(['../views/admin/index.vue'], resolve), //OMS管理端首页
}, {
  path: '/admin/userList',
  name: 'UserList',
  meta: {
    title: 'OMS管理端住户中心'
  },
  component: resolve => require(['../views/admin/user-center/user-list/household.vue'], resolve), //OMS管理端-住户中心
}, {
  path: '/admin',
  redirect: '/admin/userDetails/:id',
  meta: {
    title: 'OMS管理端老人详情主页面'
  },
  component: resolve => require(['../views/admin/user-center/user-details/workers.vue'], resolve), //OMS管理端-老人详情主页面
  children: [{
    path: '/admin/userDetails/:id',
    name: 'UserDetails',
    meta: {
      title: 'OMS管理端老人详细信息'
    },
    component: resolve => require(['../views/admin/user-center/user-details/personal-info/detaileInfo.vue'], resolve), //OMS管理端-老人详细信息
  }, {
    path: '/admin/liveDetails',
    name: 'LiveDetails',
    meta: {
      title: 'OMS管理端老人居住信息'
    },
    component: resolve => require(['../views/admin/user-center/user-details/personal-info/detailsLive.vue'], resolve), //OMS管理端-老人居住信息
  },
    {
      path: '/admin/payDetails',
      name: 'PayDetails',
      meta: {
        title: 'OMS管理端老人费用信息'
      },
      component: resolve => require(['../views/admin/user-center/user-details/personal-info/detailsPay.vue'], resolve), //OMS管理端-老人居住信息
    },
  ]
}]
