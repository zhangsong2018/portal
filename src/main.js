// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
import directive from './directive'
import store from './store/index'
import 'lib-flexible/flexible'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'//国际化设置
import vuxLocales from 'vux/src/locales/all.yml'
import componentsLocales from './locales/components.yml'
import objectAssign from 'object-assign'
import * as api from "./apis";
import http from "./utils/axios-utils.js";
import {LocalePlugin, ToastPlugin, ConfirmPlugin, AlertPlugin, LoadingPlugin, BusPlugin} from 'vux'
import LoadingComponent from "./components/Loading";
Vue.component('YCLoad',LoadingComponent);
Vue.prototype.url=api.omsUrl; //url地址
//定义全局变量
Vue.prototype.$http=http;
Vue.use(Vuex)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(VueI18n)
Vue.use(LocalePlugin)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(BusPlugin)


const i18n = new VueI18n({
  locale: 'CN',    // 语言标识
  messages: {
    'CN': objectAssign(vuxLocales['zh-CN'], componentsLocales['zh-CN']),   // 中文语言包
    'EN': objectAssign(vuxLocales['en'], componentsLocales['en']),    // 英文语言包
  },
})

Vue.prototype.setLanguage = function(lang) {
  i18n.locale = lang;
}

//公用的弹窗(全局变量)
Vue.prototype.showToast = function(text,width){
  Vue.$vux.toast.show({
    text: text,
    position:'bottom',
    width:width==null?'10em':width,
    type:'text',
  })
}

//公用的加载动画(全局变量)
Vue.prototype.showLoading= function(text){
  Vue.$vux.loading.show({
    text: text==null?'加载中...':text
  })
}
Vue.prototype.hideLoading= function(){
  Vue.$vux.loading.hide()
}

for(let key in directive){
  Vue.directive(key,directive[key])
}

Vue.config.productionTip = false;

const shouldUseTransition = !/transition=none/.test(location.href)
store.registerModule('vux', {
  state: {
    direction: shouldUseTransition ? 'forward' : ''
  },
  mutations: {
    updateDirection (state, payload) {
      if (!shouldUseTransition) {
        return
      }
      state.direction = payload.direction
    }
  }
})

// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})

// vue-router的beforeEach和afterEach来更改loading状态
router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', {direction: ''})
      } else {
        store.commit('updateDirection', { direction: 'reverse' })
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
  isPush = false
})
//控制台调试
import vconsole from "vconsole";
// if(process.env.NODE_ENV != 'production'){
  var vConsole = new vconsole();
// }

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
