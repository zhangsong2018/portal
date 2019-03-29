<template>
  <div class="statistics-oms-surveyOrganization">
    <!--<x-header>OMS</x-header>-->
    <Header-bar-iT><h2 style="font-size: 18px" slot="title">机构概况</h2></Header-bar-iT>
    <div style="margin-top: 80px">
      <date-cut-yc @cut-click="cut_date_click" :year.sync="year" :month.sync="month"></date-cut-yc>
      <div class="pages-tables" id="pages-tables">
        <div class="waterMask" id="watermark"></div>
        <div class="rolling-table meal-table" ref="tableBox" :style="{height: maxHeight + 'px'}">
          <table v-show="table_data.yList.length>0" class="table" id="table" cellpadding="0" cellspacing="0" ref="rollingTable">
            <tr v-for="(x,i) in table_data.xList" :key="i">
              <th
                class="rows"
                :class="{'cross': index == 0 && i == 0}"
                v-for="(l,index) in x"
                :key="index"
              >{{l.name}}
              </th>
            </tr>
            <tr v-show="table_data.yList.length>0" v-for="(l,i) in table_data.yList" :key="i + 'a'">
              <template v-for="(x, xKey) in table_data.xField">
                <td
                  v-for="(ll,yKey) in l"
                  :key="yKey"
                  v-if="x === yKey"
                  :class="{'cols': yKey == table_data.xField[0]}"
                >{{ table_data.yList[i][yKey]}}
                </td>
              </template>
            </tr>
            <!--<tr v-if="!(table_data.yList.length>0)">-->
            <!--<td :colspan="table_data.xField.length" style="text-align: center;">暂无数据</td>-->
            <!--</tr>-->
          </table>
          <div style="text-align: center;margin-top: 20px;font-size: 16px;" v-if="!(table_data.yList.length>0)">暂无数据
          </div>
        </div>
      </div>
      <Loading style="top: 80px;" :pageType="type" @childEvent="toParent"></Loading>
    </div>
  </div>
</template>

<script>
  import {XHeader} from "vux";
  import dateCutYc from "./components/dateCut";
  import HeaderBarIT from "../HeaderBarIT"
  import {createIScroller} from "./js/mescroll.js";
  import {OmsGraphDynamicGet} from "../../services/sys.js";
  import Vue from "vue";
  import Loading from '@/components/Loading.vue'
  export default {
    name: "surveyOrganization",
    components: {
      // XHeader,
      dateCutYc,
      HeaderBarIT,
      Loading
    },
    data() {
      return {
        type:{
          isShow:false, //是否显示
          pageType:"loading", //显示类型
          text:"正在加载...",  // 用户自定义显示文字
          errName:"loadData",//需要重新调用的方法名
        },
        year: "",
        month: "",
        maxHeight: "100%",
        scroll: {
          scroller: null
        },
        table_data: {
          xList: [
            [
              // {
              //   field_name: "area_name",
              //   name: "第一行合并3行1列"
              // },
              // {
              //   field_name: "area_name1",
              //   name: "第一行合并2列"
              // },
              // {
              //   field_name: "area_name2",
              //   name: "第一行合并2列"
              // },
              // {
              //   field_name: "area_name3",
              //   name: "第一行合并3列"
              // }
            ]
          ],
          xField: [],
          //  ["area_name", "area_name1", "area_name2", "area_name3"],
          yList: [
            // {
            //   area_name: "新增数据开始",
            //   area_name1: "新增数据开始1",
            //   area_name2: "新增数据开始2",
            //   area_name3: "新增数据开始3"
            // },
            // {
            //   area_name: "新增数据",
            //   area_name1: "新增数据1",
            //   area_name2: "新增数据2",
            //   area_name3: "新增数据3"
            // }
          ]
        },
        get_data: {
          graphId: ""
        },
        title: "",
      };
    },
    created(){
      this.handle_date();
      this.init();
    },
    mounted() {
      // this.maxHeight = window.screen.height;
      this.scroll.scroller = createIScroller(".meal-table");
        // this.maxHeight = window.screen.height;
        // this.scroll.scroller = createIScroller(".meal-table");
      // addWaterMarker(document.getElementById('watermark'))
    },
    methods: {
      init() {
        let arr = [
          {
            Logic: "AND",
            First: "月",
            Operator: 0,
            After: 12,
            ValueType: 0,
            InputControl: 0,
            DataType: "float",
            DictType: null,
            FieldViewName: "月",
            Group: null
          },
          {
            Logic: "AND",
            First: "年",
            Operator: 0,
            After: 2018,
            ValueType: 0,
            InputControl: 0,
            DataType: "float",
            DictType: null,
            FieldViewName: "年",
            Group: null
          }
        ];
        arr.forEach(v => {
          if (v.First == "年") {
            v.After = this.year;
          } else if (v.First == "月") {
            v.After = this.month;
          }
        });
        // Vue.prototype.TenantId = "1";
        localStorage.setItem('tenantId','1');
        this.get_data.DynamicConditions = arr;
        this.echarts_get_data();
      },
      echarts_get_data() {
        this.get_data.graphId = this.$route.query.id;
        // this.$vux.loading.show({
        //   text: "Loading",
        //   delay: 1e3
        // });
        this.type.isShow = true;
        OmsGraphDynamicGet(this.get_data)
          .then(res => {
            if (res.data) {
              this.handle_data(res.data); //处理完数据

            }
          })
          .catch(error => {
            console.log(error);
            this.type.isShow = false;
            this.type = {
              isShow:true, //是否显示
              pageType:"error", //显示类型
              text:"重试...",  // 用户自定义显示文字
              errName:"errorData",//需要重新调用的方法名
            }
            // this.$vux.loading.hide();
          });
      },
      handle_data(data) {
        let xfields = JSON.parse(data.xfields) || [];
        let yfields = JSON.parse(data.yfields) || [];
        let reportTable = JSON.parse(data.reportTable.data) || [];
        let table_column_data = data.reportTable.columnNames;
        let x_y_fields = [...xfields, ...yfields];
        let no_show_item = ['年', '月'];
        x_y_fields = x_y_fields.filter(v => !no_show_item.includes(v));
        table_column_data = table_column_data.filter(v => {
          return x_y_fields.includes(v.name)
        });
        let keys = table_column_data.map(v => v.field);
        table_column_data = table_column_data.map(v => {
          return {field_name: v.field, name: v.name}
        });
        // reportTable.forEach((v) => {
        //   Object.keys(v).forEach(item => {
        //     if (!keys.includes(item)) {
        //       delete v[item];
        //     }else if(v[item]==0){
        //       v[item] = '--';
        //     }
        //   })
        // });

        this.table_data = {
          xList: [table_column_data],
          xField: keys,
          yList: reportTable
        };
        this.type.isShow = false;
        // this.$vux.loading.hide();
        // this.reportName = data.reportTable.title;
      },
      handle_date() {
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth() + 1;
      },
      cut_date_click(date_data) {
        this.get_data.DynamicConditions.forEach(v => {
          switch (v.First + "") {
            case "月":
              v.After = date_data.month;
              break;
            case "年":
              v.After = date_data.year;
              break;
            default:
          }
        });
        this.echarts_get_data();
      },
      toParent(v){
        if(v=='errorData'){
          this.init();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./css/mescroll.scss";

  .statistics-oms-surveyOrganization {
    background: #fff;
    height: 100vh;
  }
</style>
