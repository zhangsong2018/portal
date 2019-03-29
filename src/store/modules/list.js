import Vue from 'vue'
const state = {
  items: [],
  page: 1,
}
const mutations = {  
  getUpCallbackList (state, payload) {
     state.page += 1;
     state.items = state.items.concat(payload.res);
     
  }
}

const actions = {

  getUpCallbackList ({commit, state}, upParams) {
      // var token = dsBridge.call("testSyn","testSyn");
      // var tokenobj = JSON.parse(token);
      // var Authorization = tokenobj.token;
      //if(Authorization){
        Vue.prototype.$http.get('http://192.168.103.189:8146/itservice-getList-'+{commit, state}.state.page+'.json',
          { headers: {
            "content-type":"application/json",
            'Authorization': 'Bearer '+ 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY2Y2NmNmYwMjQyMGRiZmMyYmE3ZTczYWI0ZmMyNjM0IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDI3NjYzMDksImV4cCI6MTU0MzYzMDMwOSwiaXNzIjoiaHR0cDovL2p1amlhMDEueWNzZW5pb3IuY29tOjUwMDAiLCJhdWQiOlsiaHR0cDovL2p1amlhMDEueWNzZW5pb3IuY29tOjUwMDAvcmVzb3VyY2VzIiwiU3RhZmZJbmZvIl0sImNsaWVudF9pZCI6InJvLmNsaWVudCIsInN1YiI6IkM4RkRGQkU3LUJGQjktNDEzMi1CRURGLUJFRUQwRjIxRkRFNSIsImF1dGhfdGltZSI6MTU0Mjc2NjMwOSwiaWRwIjoibG9jYWwiLCJzY29wZSI6WyJTdGFmZkluZm8iXSwiYW1yIjpbInB3ZCJdfQ.HUJFRQ9bNb9l_l4Qwg7NvYOIbq9KR74tIHSHujnlSuhy7MmjZ50jV83MoEIVfegAlpamZH5OoszIzUNW7P3AOhXQY8TkdZSjzu9v5_7sZyqH86ay-R9unjdiT1f9jN4Z3Qqgas5DVUCNQl3rI6zMS97D45gn5A1YGobZgcaZgtzNN_t_zlqrDvrCWxxIrqxJHXH8ACKu_g7Bc6XqTZ5Ooa_XI9KPqV_YapDznRlGFL2OEbYBX42a-6kkArejfVPxePQzZ0S4r9f10GFKYdbk6AqvBcEBnEkKCIS7WZmP5bVbgq2jyLNGg9lK6hY1YKjcEGW-HnEJtO_XWji50v6Pog'
          }
        })
        .then((response) => {
          let len = response.data.data.task_data.length
          if (len === 0) {
            // 重写关于数据为空的dom
            upParams.mescrollUp.empty = {
              warpId: 'dataList', // 父布局的id;
              icon: './static/mescroll/mescroll-empty.png', // 图标,支持网络图
              tip: '暂无相关数据~', // 提示
              btntext: '去逛逛 >', // 按钮,默认""
              btnClick () { // 点击按钮的回调,默认null
                // 数据为空点击btn的回调，或者直接不再这里重写，直接用listView的默认配置
                alert('数据为空点击btn的回调')
              }
            }
          }
          Vue.prototype.showToast('请求成功')
          commit({
            type: 'getUpCallbackList',
            res: response.data.data.task_data
          })
          // 数据渲染成功后,隐藏下拉刷新的状态
          upParams.mescroll.endSuccess(response.data.data.task_data.length)
          console.log('成功返回：', response.data)
        }, (error) => {
          // 联网异常,隐藏上拉和下拉的加载进度
          upParams.endErr()
          // 弹窗提示或者请求错误页面
          Vue.prototype.showToast('请求失败：' + error);
        })
     // }
      
  }
}
export default {
  state,
  mutations,
  actions
}
