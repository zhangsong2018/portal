import Vue from 'vue';
import Vuex from 'vuex';
import * as sysApi from '../../../services/sys';
Vue.use(Vuex);
var copyState = deepCopy(state);  //拷贝state对象
function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
};

const state = {
  list_data:[],
};
const mutations = {
  mResState(state){
  },
  changeList(state,data){
    state.list_data = data;
  }
}

const actions = {
    actions_get(context){
     return sysApi.CurrentLoginInformations().then(res=>{
        console.log(res);
        let list = res.result.myTenants;
        list = list.filter(v=>{
          return v.name != '营销中心'
        });
        context.commit('changeList',list);
      }).catch(error=>{
        console.log(error);
      })
    }
}


export default new Vuex.Store({
  state,
  mutations,
  actions
})
