/**************交接班**************/
export default [{
    path: '/hand/index',
    name: 'hand',
    meta: {
        title: 'OMS交接班首页'
    },
    component: resolve => require(['../views/hand-over/index.vue'], resolve), //OMS交接班首页
}, {
    path: '/hand/InfoAdd',
    name: 'HandAdd',
    meta: {
        title: 'OMS交接班信息添加'
    },
    component: resolve => require(['../views/hand-over/add-user/handInfo.vue'], resolve), //OMS交接班信息添加
}, {
    path: '/hand/hisInfo',
    name: 'hisInfo',
    meta: {
        title: 'OMS交接班信息添加'
    },
    component: resolve => require(['../views/hand-over/see-user/historyInfo.vue'], resolve), //OMS交接班信息添加
}]