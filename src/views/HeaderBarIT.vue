<template>
    <div>
      <div class="headerbar"></div>
      <header class="header">
          <div class="close">
            <slot name="close">
              <div class="close_pic" slot="close" @click="$router.go(-1)">
                <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
              </div>
            </slot>
          </div>
          <h2 class="title">
            <span><slot name="title">照护计划</slot></span>
          </h2>
          <div class="icon">
            <slot name="icon"></slot>
          </div>
       </header>
    </div>
</template>

<script>
import { toggleClass } from '@/utils/index'
export default {
  name: 'HelloWorld',
  data () {
    return {
      title: "",
    }
  },
  created () {
  },
  methods: {
    create(){
      this.$router.go(-1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app{
   width: 100%;
}
body{
  width:100%;
  height: 100%
}
.wrap{
  width:100%;
  height: 100%;
  background: #f4f4f4;
}
.headerbar{
  width: 100%;
  height:30px;
  background: #1c76dc;
  position: fixed;
  top:0px;
  z-index: 999;
}
.header{
  width: 100%;
  height:50px;
  background: #1c76dc url(../static/images/sy.png) no-repeat;
  background-size: cover;
  position: fixed;
  top:30px;
  z-index: 999;
  display: flex;
}
.title{
  flex:7;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
  overflow: hidden;
}
.title span{
  display: inline-block;
  width: 100%;
  font-size: 18px;
  text-align: center;
}

.close{
  flex:1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size:24px;
}
.close_pic{
  display: flex;
}
.close_pic img{
  width: 100%;
  height: 100%;
}
.icon{
  flex:1.5;
  display: flex;
  justify-content: center;
  align-items: center;

}
.userList{
   width: 75px;
   background: #ffffff;
   border-radius: 5px;
   position: fixed;
   top:80px;
   right: 10px;
   z-index: 999999
}
.userList li{
   border-bottom: 1px solid #f0f0f0;
   height: 35px;
   line-height: 35px;
   text-align: center;
   display: flex;
}
.userList li:last-child{
   border: 0;
}
.userList li a span{
   width: 75px;
   display: inline-block;
   text-align: center;
   color: #282828;
}
.mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    background: rgba(0,0,0,.3);
}
</style>

