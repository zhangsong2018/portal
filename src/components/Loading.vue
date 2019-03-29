<template>
  <div :class="{'wrap_load':true, 'saveloading':pageType.pageType == 'saveloading'}" v-if="pageType.isShow">
    <div class="loading">
      <div class="error" v-if="pageType.pageType == 'error'" @click="handleClick">
        <img src="@/static/images/inter_err.png"/>
        <div class="error-wrap clearfloat">
          <div class="err-left">可能原因:</div>
          <div class="err-right">
            <p>网络不稳定</p>
            <p>尚未接入互联网</p>
            <p>服务器发生未知异常</p>
            <p>安全软件禁止访问网络</p>
          </div>
        </div>
        <p class="text">轻触屏幕，重新加载试试</p>
      </div>
      <div class="loading" v-if="pageType.pageType == 'networkerr'" @click="handleClick">
        <img src="@/static/images/network.png"/>
        <p>网络君发生异常!</p>
        <p>请轻触重试</p>
        <p class="text">轻触屏幕，重新加载试试</p>
      </div>
      <div class="loading" v-if="pageType.pageType == 'empty'" @click="handleClick">
        <img src="@/static/images/no_data.png" style="width: 88px"/>
        <p class="text">轻触屏幕，重新加载试试</p>
      </div>
      <div class="loading" v-if="pageType.pageType == 'loading'">
        <Spinner type="android" size="40px"></Spinner>
        <p class="text_content">{{pageType.text==null?'正在加载...':pageType.text}}</p>
      </div>
      <!-- 保存load  -->
      <div class="loading" v-if="pageType.pageType == 'saveloading'" @click="handleClick">
        <!-- <img :src="pageType.img" alt="loading"> -->
        <Spinner type="android" size="40px"></Spinner>
        <p class="text_content">{{pageType.text}}</p>
      </div>
      <div class="loading" v-if="pageType.pageType == 'customer'" @click="handleClick">
        <img :src="pageType.img" alt="loading">
        <p class="text_content">{{pageType.text}}</p>
      </div>
    </div>
  </div>


</template>

<script>
  import {Spinner} from 'vux'

  export default {
    name: 'loading',
    props: ["pageType"],
    data() {
      return {}
    },
    components: {Spinner},
    created() {
      this.init();
    },
    methods: {
      init() {
        this.local = dsBridge.call("getLanguage", "getLanguage");
        if (/zh/.test(this.local)) {
          this.setLanguage('CN')
          // Vue.i18n.set('zh-CN')
        } else {
          this.setLanguage('EN')
          // Vue.i18n.set('en')
        }
      },
      handleClick() {
        this.pageType.isShow = true
        this.pageType.pageType = 'loading'
        console.log(this.pageType.errName)
        this.$emit('childEvent', this.pageType.errName)
      }
    }
  }
</script>

<style scoped>
.saveloading{
  background: rgba(0, 0, 0, .4);
}
  .wrap_load {
    width: 100%;
    height: 100%;
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
  }

  .loading {
    margin-top: 100px;
    text-align: center;
  }

  .loading img {
    width: 150px;
    height: auto;
  }

  .text {
    margin-top: 10px;
    font-size: 15px;
    color: #1c76dc
  }

  .text_content {
    line-height: 35px;
    color: #666
  }

  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearfloat {
    zoom: 1
  }

  .error-wrap {
    /*width: 220px;*/
    width: 250px;
    margin: 0 auto;
  }

  .err-left {
    float: left;
    color: #747474;
    line-height: 25px;
    font-size: 14px;
  }

  .err-right {
    margin-left: 70px;
  }

  .err-right p {
    text-align: left;
    color: #747474;
    line-height: 25px;
    font-size: 14px;
    position: relative;
  }
</style>
