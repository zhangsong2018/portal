import Vue from 'vue';
import Vuex from 'vuex';
import {getNowFormatDate} from "../../../assets/js/utils.js"

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
  user_data:{},
  old_man_data:{},
  Deep_user_data: {
    name: {
      value: "",
      name: "客户姓名",
      key: 'name',
    },
    PhoneNumber: {
      value: "",
      name: "联系电话",
      key: 'PhoneNumber',
    },
    age: {
      value: "",
      name: "年龄",
      key: 'age',
    },
    gender:{
      value: [],
      name: "性别",
      key: 'gender',
      select_option: [['男','女']],
      option_val: ['男','女']
    },
    InfoSource: {
      value: [],
      name: "信息渠道",
      key: 'InfoSource',
      select_option: [],
      option_val: []
    },
    Degree: {
      value: [],
      name: "意向程度",
      key: 'Degree',
      select_option: [],
      option_val: []
    },
    creationTime: {
      value: getNowFormatDate(new Date),
      name: "登记日期",
      key: 'creationTime',
    },
    Organization: {
      value: [],
      name: "意向机构",
      key: 'Organization',
      select_option: [],
      option_val: []
    },
    ContactInfo: {
      value: [],
      name: "沟通方式",
      key: 'ContactInfo',
      select_option: [],
      option_val: []
    },
    Probability:{
      value:['30%'],
      name:"成交率",
      key:'Probability',
      select_option:[['30%','60%','90%']],
      option_val:[{value:'30%',id:'30'},{value:'60%',id:'60'},{value:'90%',id:'90'}]
    },
    nextDate: {
      value: "",
      name: "下次跟进日期",
      key: 'nextDate',
    },
    memo: {
      value: "",
      name: "沟通描述",
      key: 'memo',
    },
  },
  Deep_old_man_data: {
    Relation: {
      value: [],
      name: "与客户关系",
      key: 'old_man_Relation',
      select_option: [],
      option_val: []
    },
    Name: {
      value: "",
      name: "老人姓名",
      key: 'old_man_name'
    },
    age: {
      value: "",
      name: "老人年龄",
      key: 'old_man_age'
    },
    gender:{
      value: [],
      name: "性别",
      key: 'old_man_gender',
      select_option: [['男','女']],
      option_val: ['男','女']
    },
    LivingSituation: {
      value: [],
      name: "目前居住情况",
      key: 'old_man_LivingSituation',
      select_option: [],
      option_val: []
    },
    LifeState: {
      value: [],
      name: "生活状态",
      key: 'old_man_LifeState',
      select_option: [],
      option_val: []
    },
    BodyState: {
      value: [],
      name: "身体状况",
      key: 'old_man_BodyState',
      select_option: [],
      option_val: []
    },
    ConsiderReason: {
      value: '',
      name: "优先考虑因素",
      key: 'old_man_ConsiderReason',
      select_option: [],
      option_val: []
    }
  },
};
const mutations = {
    mResState(state){
      state.user_data = deepCopy(state.Deep_user_data);
      state.old_man_data = deepCopy(state.Deep_old_man_data);
    },
    CHANGE_OLD_DATA(state,data){
        console.log(state.old_man_data,data);
        state.old_man_data[data.key].select_option = [data.res.select_option];
        state.old_man_data[data.key].option_val = data.res.option_val;
    },
    CHANGE_USER_DATA(state,data){
      state.user_data[data.key].select_option = [data.res.select_option];
      state.user_data[data.key].option_val = data.res.option_val;
    },
    CHANGE_USER_DATA__MORE(state,data){
      state.user_data[data.key].select_option = data.res;
      state.user_data[data.key].option_val = data.res;
    },
    OLD_DATA_VAL_CHANGE(state,data){
      state.old_man_data.ConsiderReason.value = data;
    },
    SELECT_RELATION_CHANGE(state){
      state.old_man_data.Name.value = state.user_data.name.value;
      state.old_man_data.age.value = state.user_data.age.value;
      state.old_man_data.gender.value = state.user_data.gender.value;
    },
    SELECT_EMPTY_CHANGE(state){
      state.old_man_data.Name.value = '';
      state.old_man_data.age.value = '';
      state.old_man_data.gender.value = [];
    },
    SELECT_INfOSOURCE_CHANGE(state,data){
      state.user_data.InfoSource.value = data;
    }

}

const actions = {
}


export default new Vuex.Store({
  state,
  mutations,
  actions
})
