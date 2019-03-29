<template>
    <div id="app" v-bind:style="{minHeight:height+'px'}">
        <transition :name="viewTransition" :css="!!direction">
          <router-view class="router-view"></router-view>
        </transition>
    </div>
</template>

<script>
import './static/css/reset.css'
import './static/js/dsbridge.js'
import { XHeader, TransferDom, Loading } from 'vux'
import { mapState } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    TransferDom,
    Loading
  },
  created(){
    this.getHeight();
    this.goBack();
  },
  methods: {
    getHeight() {
      var _this = this
      this.height =  window.innerHeight;
      window.onresize = function(){
        _this.height =  window.innerHeight;
      }
    },
    goBack(){
      var  _this  = this;
      dsBridge.registerAsyn('goBack', function (arg1, arg2) {
        _this.$router.go(-1);
      });
    }
  },
  computed: {
    // 使用对象展开运算符将此对象混入到外部对象中,即：把一个对象的key和value展开混入到另一个对象里面，相当于对象的深拷贝
    ...mapState({
      isLoading: state => state.vux.isLoading,
      // 箭头函数属于匿名函数,(参数..)=>返回值,如果只有一个参数括号可省略
      direction: state => state.vux.direction
    }),
    viewTransition () {
      if (!this.direction) return ''
      return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';
  *{
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  #app {
    font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width:100%;
    height: 100%;
    margin:0 auto;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    background: #f4f4f4;
  }
  input {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-user-select:auto;
  }
  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  img{
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -webkit-user-select:none;
    -o-user-select:none;
    user-select:none;
  }
  .router-view {
    width: 100%;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }
  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .weui-dialog__bd:first-child{
    padding: 2em 20px 1.2em;
  }
  .weui-dialog__ft{
    font-size: 16px;
  }
  #app .btn-group .btns:nth-child(2){
    color: #0077D9
  }
  .vux-popup-header .vux-popup-header-right{
    color: #0077D9
  }
  .weui-cells .weui-cells_radio .weui-check:checked + .weui-icon-checked:before{
    color: #0077D9
  }
  .center .vux-no-group-title{
    margin-top: 0;
  }
  .center .weui-cell_select .weui-select{
    margin-top: 0;
  }
  .section .weui-cells{
    margin-top: 0;
  }
</style>
