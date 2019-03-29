//使用方法
// this.showServeUnknowError()
// 可以传递一个对象作为参数，和AlertMoudle的参数一致

import  { ConfirmPlugin } from 'vux'

var ServeUnknowError = {

}

ServeUnknowError.install = function (Vue, options) {

  // 1. 添加实例方法或属性

  Vue.prototype.showServeUnknowError = function (config) {
    let def = {
      // 组件除show外的属性
      content:"网络连接失败，请检查手机网络状态",
      confirmText:"去设置",
      cancelText:"重试",
      onCancel () {

      },
      onConfirm () {
        dsBridge.call("toSetting","toSetting");
      }
    }
    if(typeof config === 'string' || typeof config === 'number'){
      this.$vux.confirm.show(Object.assign(def, {
        content: config
      }))
    }else{
      this.$vux.confirm.show(Object.assign(def, config))
    }
  }

}

export default ServeUnknowError
