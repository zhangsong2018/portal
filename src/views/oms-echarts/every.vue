<template>
  <div class="statistics-oms-every">
    <!--<x-header>-->
    <!--{{$route.query.name}}-->

    <!--</x-header>-->
    <Header-bar-iT><h2 style="font-size: 17px" slot="title">{{title_name}}</h2></Header-bar-iT>
    <group class="statistics-oms-every-group">
      <div style="background: #fff">
        <cell @click.native="handle_list_click(v,i)" v-for="(v,i) in list" :title="v.name" :key="i" :is-link="true">

        </cell>
        <!--<cell title="1" is-link></cell>-->
        <!--<cell title="3" is-link></cell>-->
        <!--<cell title="34" is-link></cell>-->
      </div>

    </group>
    <Loading style="top: 80px;" :pageType="type" @childEvent="toParent"></Loading>
  </div>
</template>

<script>
  import {Cell, Group, XHeader} from "vux";
  import {GraphListQuery} from "../../services/sys.js";
  import Vue from "vue";
  import HeaderBarIT from "../HeaderBarIT";
  import store from '../../store/modules/oms-echarts/index.js';
  import {mapActions, mapMutations, mapState} from 'vuex';
  import Loading from '@/components/Loading.vue'

  export default {
    name: "every",
    store,
    components: {
      // XHeader,
      Cell,
      Group,
      HeaderBarIT,
      Loading
    },
    data() {
      return {
        list: [],
        title_name: "",
        type:{
          isShow:false, //是否显示
          pageType:"loading", //显示类型
          text:"正在加载...",  // 用户自定义显示文字
          errName:"loadData",//需要重新调用的方法名
        },
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      ...mapState([
        "list_data"
      ])
    },
    created() {
    },
    methods: {
      ...mapActions(["actions_get"]),
      async init() {
        await this.actions_get().catch(v => {
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "重试...",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          }
        });
        let tenant_value = this.list_data.filter(v => v.id == (localStorage.getItem('tenantId')|| Vue.prototype.TenantId));
        this.title_name = tenant_value[0]?tenant_value[0].name:'';
        this.type = {
          isShow: true, //是否显示
          pageType: "loading", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        }
        GraphListQuery({OnMb: '1', MaxResultCount: '100'}).then(res => {
          if (res.data) {
            this.type.isShow = false;
            let data = res.data;
            this.list = data.items;
            if(this.list.length<=0){
              this.type = {
                isShow: true, //是否显示
                pageType: "empty", //显示类型
                text: "空...",  // 用户自定义显示文字
                errName: "errorData",//需要重新调用的方法名
              }
            }
              // data.items;
            let ccc = ['年', '月']
            this.list.forEach(v => {
              let xfields = JSON.parse(v.xfields) || [];
              let sure = xfields.some(v => {
                return ccc.includes(v)
              });
              sure = xfields.length > 0 ? sure : 0;
              v.date_sure = sure ? 1 : 0;
            })
          }
        }).catch(error => {
          console.log(error);
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "重试...",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          }
        })
      },
      handle_list_click(v, i) {
        console.log(Vue.prototype.TenantId);
        this.$router.push({
          path: "/statistics/oms/echarts",
          query: {
            id: v.id,
            chartType: v.chartType,
            name: v.name,
            index: i,
            tenant_id: Vue.prototype.TenantId || this.$route.query.tenant_id,
            date_sure: v.date_sure,
          }
        })
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
  .statistics-oms-every {
    .weui-cells {
      margin-top: 0;
    }

    &-group {
      margin-top: 80px;
    }
  }
</style>
<style lang="scss">
  .statistics-oms-every {
    .weui-cells {
      margin-top: 0;
    }
  }
</style>
