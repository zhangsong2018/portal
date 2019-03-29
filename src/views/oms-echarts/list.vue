<template>
    <div class="statistics-oms">
      <Header-bar-iT><h2 style="font-size: 18px" slot="title">OMS</h2></Header-bar-iT>
      <!--<x-header>-->
        <!--OMS-->
      <!--</x-header>-->
      <div class="statistics-oms-list">
        <!--<p @click="$router.push({path:'/statistics/oms/survey',query:{id:'209'}})">-->
          <!--<img src="@/static/images/Introduction.png"/>-->
          <!--<span>机构概况</span>-->
        <!--</p>-->
        <!--<p @click="list_click(v)" v-for="(v,i) in list_data" :key="i">-->
          <!--<img src="@/static/images/congratulate.png"/>-->
          <!--<span>{{v.name}}</span></p>-->
        <grid :show-lr-borders="true" :show-vertical-dividers="true" :cols=3>
          <grid-item @click.native="$router.push({path:'/statistics/oms/survey',query:{id:'201'}})">
            <img slot="icon" src="@/static/images/Introduction.png" class="bi-list-icon">
            <div  style="text-align: center;" slot="label" class="bi-list-title">{{'机构概况'}}</div>
          </grid-item>
          <grid-item v-for="(item,index) in list_data_item" :key="index" @click.native="list_click(item)">
            <img slot="icon" src="@/static/images/congratulate.png" class="bi-list-icon">
            <div style="text-align: center;" slot="label" class="bi-list-title">{{item.name}}</div>
          </grid-item>
        </grid>
        <Loading style="top: 80px" :pageType="type" @childEvent="toParent"></Loading>
      </div>
    </div>
</template>

<script>
  import {XHeader,Grid,GridItem} from "vux";
  import dateCutYc from "./components/dateCut";
  // import * as sysApi from '../../services/sys';
  import Vue from "vue";
  import store from '../../store/modules/oms-echarts/index.js';
  import {mapMutations, mapState , mapActions } from 'vuex';
  import HeaderBarIT from "../HeaderBarIT"
  import Loading from '@/components/Loading.vue'
  export default {
        name: "list",
        store,
        components:{
          // XHeader,
          dateCutYc,
          HeaderBarIT,
          Grid,
          GridItem,
          Loading
        },
        data(){
          return{
            list:[],
            type:{
              isShow:false, //是否显示
              pageType:"loading", //显示类型
              text:"正在加载...",  // 用户自定义显示文字
              errName:"loadData",//需要重新调用的方法名
            },
          }

        },
        created(){
          Vue.prototype.TenantId = '0';
        },
        mounted(){
          this.init();
        },
    computed: {
      ...mapState([
        "list_data"
      ]),
      list_data_item(){
        let data = this.list_data;
        return data
      }
    },
        methods:{
          // ...mapMutations(["changeList"]),
          ...mapActions(["actions_get"]),
          init(){
            this.type = {
              isShow: true, //是否显示
              pageType: "loading", //显示类型
              text: "正在加载...",  // 用户自定义显示文字
              errName: "loadData",//需要重新调用的方法名
            }
            this.actions_get().then(res=>{
              this.type.isShow = false;
            }).catch(error=>{
              console.log(error);
              this.type = {
                isShow: true, //是否显示
                pageType: "error", //显示类型
                text: "重试...",  // 用户自定义显示文字
                errName: "errorData",//需要重新调用的方法名
              }
            })

            // sysApi.CurrentLoginInformations().then(res=>{
            //   console.log(res);
            //   let list = res.result.myTenants;
            //   list = list.filter(v=>{
            //     return v.name != '营销中心'
            //   });
            //   this.changeList(list);
            // })
          },
          list_click(v){
            Vue.prototype.TenantId = v.id;
            localStorage.setItem('tenantId',v.id);
            this.$router.push({path:"/statistics/oms/every",query:{name:v.name,tenant_id:v.id}});
          },
          toParent(v){
            if(v=='errorData'){
              this.init();
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
  .statistics-oms{
    height: 100vh;
    /*background: #fff;*/
    &-list{
      margin-top: 80px;
      /*display: flex;*/
      /*flex-wrap: wrap;*/
      /*p{*/
        /*width: 33%;*/
        /*display: flex;*/
        /*flex-direction: column;*/
        /*justify-content: center;*/
        /*align-items: center;*/
        /*margin-top: 10px;*/
        /*img{*/
          /*width: 40px;*/
          /*height: 40px;*/
        /*}*/
      /*}*/
    }
  }
</style>
<style lang="scss">
  .weui-grid__icon{
    width: 40px!important;
    height: 40px!important;
  }
</style>
