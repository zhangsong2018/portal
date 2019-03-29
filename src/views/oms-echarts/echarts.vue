<template>
    <div ref="oms-echarts" class="statistics-oms-echarts demo-list-box">
      <ViewBox ref="viewBox">
      <!--<x-header>-->
      <!--{{$route.query.name||''}}-->
      <!--<span slot="right" @click="show1=true">切换机构</span>-->
      <!--</x-header>-->
      <Header-bar-iT>

        <h2 style="font-size: 18px;
      overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
" slot="title">{{$route.query.name}}</h2>
        <span slot="icon" style="padding-right: 10px;color: #fff;white-space: nowrap;" @click="show1=true">切换机构</span>
      </Header-bar-iT>
      <div style="margin-top: 80px;">
        <div class="vux-1px-b" style="text-align: center;
    font-size: 18px;
    font-weight: 900;
    color: #333;
    line-height: 40px;">
          当前机构:{{current_jigou_data.name||''}}
        </div>
        <date-cut-yc v-show="$route.query.date_sure=='1'" :year.sync="year" :month.sync="month"
                     @cut-click="cut_date_click"></date-cut-yc>
        <div v-show="no_data_sure" class="sure">

          <div v-show="$route.query.chartType=='99'&&table_data.length>0" class="statistics-oms-echarts-jggk">
            <p v-for="(value,index) in table_data" :key="index">
              <span class="statistics-oms-echarts-jggk-content">{{value.value}}</span>
              <span class="statistics-oms-echarts-jggk-title">{{value.name}}</span>
            </p>
          </div>


          <div v-show="$route.query.chartType!='99'"
               style="width: 80%;height: 300px;margin: 20px auto;margin-top: 0;padding-top: 0px;"
               id="main"></div>
          <div v-show="$route.query.chartType=='0'||$route.query.chartType=='2'"
               class="statistics-oms-echarts-pie-table">
            <p><span>{{xfields.join(" ").replace(/年|月|排序/g,"")}}</span><span style="border-right: none;">数量</span><span>占比</span>
            </p>
            <p v-for="(v,i) in pie_table" :key="i"><span>{{v.name}}</span><span
              style="border-right: none;">{{v.value}}</span><span>{{v.percentage}}</span></p>
          </div>
          <!--<div style="width: 80%;height: 300px;margin: 20px auto;" id="main1"></div>-->
          <!--<div style="width: 80%;height: 300px;margin: 20px auto;" id="main2"></div>-->
          <div v-transfer-dom>
            <popup v-model="show1">
              <!-- group already has a top border, so we need to hide header's bottom border-->
              <popup-header
                left-text="取消"
                right-text="确定"
                :show-bottom-border="false"
                @on-click-left="show1 = false"
                @on-click-right="sure_click"></popup-header>
              <group gutter="0">
                <radio v-model="radio_data" :options="jigou_list"></radio>
              </group>
            </popup>
          </div>
          <div class="statistics-oms-echarts-cut">
            <p class="statistics-oms-echarts-cut-prev" @click="cut_echarts('prev')"><img
              style="transform: scale(0.5)" src="@/static/images/prev_pic.png"/></p>
            <p class="statistics-oms-echarts-cut-next" @click="cut_echarts('next')"><img
              style="transform: scale(0.5)" src="@/static/images/next_pic.png"/></p>
          </div>
        </div>
        <Loading style="top: 80px;" :pageType="type" @childEvent="toParent"></Loading>
      </div>
      <div style="text-align: center;margin: 20px 0;font-size: 16px;" v-show="!no_data_sure">
        数据为空请及时切换!
      </div>
      </ViewBox>
    </div>
</template>

<script>
  import dateCutYc from "./components/dateCut";
  import {Group, Popup, PopupHeader, Radio, TransferDom, XHeader , ViewBox } from 'vux'
  import {GraphListQuery, OmsGraphDynamicGet} from "../../services/sys.js"
  import store from '../../store/modules/oms-echarts/index.js';
  import {mapActions, mapState} from 'vuex';
  import Vue from "vue";
  import HeaderBarIT from "../HeaderBarIT"
  import Loading from '@/components/Loading.vue'

  var echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require("echarts/lib/component/dataZoom");
  require("echarts/lib/component/legendScroll");
  require("echarts/lib/chart/pie");
  require("echarts/lib/chart/gauge");
  // var echarts = require('echarts');
  export default {
    name: "echarts",
    store,
    components: {
      // XHeader,
      dateCutYc,
      PopupHeader,
      Popup,
      Group,
      Radio,
      HeaderBarIT,
      Loading,
      ViewBox
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        type: {
          isShow: false, //是否显示
          pageType: "loading", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        },
        radio_data: "",
        year: '',
        month: "",
        x_data: [],
        y_data: [],
        title: "",
        reportName: '',
        xfields: [],
        xfields_key: [],
        yfields: [],
        yfields_key: [],
        show1: false,
        get_data: {
          graphId: '',
        },
        every_list_data: [],
        my_echarts: "",
        table_data: [],
        pie_table: [],
        current_jigou_data: {},
        no_data_sure: true,
      }
    },
    computed: {
      ...mapState([
        "list_data"
      ]),
      jigou_list() {
        return this.list_data.map(v => {
          return {value: v.name, key: v.id}
        })
      }
    },
    mounted() {
      this.radio_data = this.$route.query.tenant_id || '';
      this.init();
    },
    methods: {
      ...mapActions(["actions_get"]),
      toParent(v) {
        if (v == 'errorData') {
          this.init();
        }
      },
      every_get() {
        return GraphListQuery({OnMb: '1', MaxResultCount: '100'}).then(res => {
          if (res.data) {
            let data = res.data;
            this.every_list_data = data.items;
            let ccc = ['年', '月']
            this.every_list_data.forEach(v => {
              let xfields = JSON.parse(v.xfields) || [];
              let sure = xfields.some(v => {
                return ccc.includes(v)
              });
              sure = xfields.length > 0 ? sure : 0;
              v.date_sure = sure ? 1 : 0;
            })
          }
        }).catch(error => {

        })
      },
      init() {
        this.actions_get().then(res => {
          let id = this.$route.query.tenant_id || '';
          let query_name = this.list_data.filter(v => {
            return v.id == id
          });
          query_name = query_name.length > 0 ? query_name[0] : {};
          this.current_jigou_data = query_name;
        }).catch(error => {
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "重试...",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          }
        })
        this.every_get().catch(error => {
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "重试...",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          }
        });
        this.handle_date();

        let arr = [
          {
            "Logic": "AND",
            "First": "月",
            "Operator": 0,
            "After": 12,
            "ValueType": 0,
            "InputControl": 0,
            "DataType": "float",
            "DictType": null,
            "FieldViewName": "月",
            "Group": null
          },
          {
            "Logic": "AND",
            "First": "年",
            "Operator": 0,
            "After": 2018,
            "ValueType": 0,
            "InputControl": 0,
            "DataType": "float",
            "DictType": null,
            "FieldViewName": "年",
            "Group": null
          }]
        arr.forEach(v => {
          if (v.First == '年') {
            v.After = this.year;
          } else if (v.First == '月') {
            v.After = this.month;
          }
        });
        this.get_data.DynamicConditions = arr;

        this.echarts_get_data();
      },
      echarts_get_data() {
        this.get_data.graphId = this.$route.query.id;
        // this.$vux.loading.show({
        //   text: 'Loading',
        //   delay: 1e3
        // });
        this.type = {
          isShow: false, //是否显示
          pageType: "loading", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        }
        this.type.isShow = true;
        if (this.$route.query.date_sure && this.$route.query.date_sure == '1') {

        } else {
          this.get_data.DynamicConditions ? delete this.get_data.DynamicConditions : '';
        }
        let chartType = this.$route.query.chartType;
        OmsGraphDynamicGet(this.get_data).then(res => {
          if (res.data) {
            let sure = this.handle_data(res.data);

            if (sure) {
              if (this.my_echarts) {
                this.my_echarts.clear();
              }
              ;
              switch (chartType + "") {
                case "2":
                  this.one();
                  break;
                case "0":
                  this.two();
                  break;
                case "4":
                  this.three();
                  break;
                case "99":
                  this.four();
                  break;
                default :
                  this.$vux.toast.text('信息有误，请及时切换', 'middle');
                  // this.$vux.loading.hide();
                  this.type.isShow = false;
              }
            }

          }
        }).catch(error => {
          console.log(error);
          this.type.isShow = false;
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "重试...",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          }
        })
      },
      handle_data(data) {
        let xfields = JSON.parse(data.xfields) || [];
        let yfields = JSON.parse(data.yfields) || [];
        this.xfields = xfields || [];
        this.yfields = yfields || [];
        let reportTable = JSON.parse(data.reportTable.data) || [];
        if (reportTable.length <= 0) {
          this.no_data_sure = false;
          this.type.isShow = false;
          // this.type = {
          //   isShow: true, //是否显示
          //   pageType: "empty", //显示类型
          //   text: "重试...",  // 用户自定义显示文字
          //   errName: "errorData",//需要重新调用的方法名
          // }
          return false;
        } else {
          this.no_data_sure = true;
          let x_data = [];
          let y_data = [];
          let x_fieid = data.reportTable.columnNames.map((v) => {
            if (xfields && xfields.includes(v.name) && v.name != '年' && v.name != '月') {
              return v.field;
            } else {
              return false;
            }
          });
          let y_fieid = data.reportTable.columnNames.map((v) => {
            if (yfields && yfields.includes(v.name)) {
              return v.field;
            } else {
              return false;
            }
          })
          x_fieid = x_fieid.filter(v => !!v);
          y_fieid = y_fieid.filter(v => !!v);

          this.xfields_key = x_fieid;
          this.yfields_key = y_fieid;
          reportTable.forEach(v => {
            let str = "";
            let handle_y_data = {};
            this.xfields_key.forEach(item => {

              str += v[item] || ''
            });
            x_data.push(str);
            this.yfields_key.forEach((item, index) => {
              handle_y_data[item] = v[item] || 0;
            });
            y_data.push(handle_y_data);
          });
          let n = 12;
          this.title = data.name.length > n ? data.name.slice(0, n) + '\n' + data.name.slice(n) : data.name;
          this.x_data = x_data;
          this.y_data = y_data;
          this.get_data.DynamicConditions = JSON.parse(data.reportTable.conditionsForDynamic) || '';
          this.reportName = data.reportTable.title;
          // console.log(this.$refs['oms-echarts'].scrollTop)
          // this.$refs['oms-echarts'].scrollTo(0,0);
          this.$refs['viewBox'].scrollTo(0);
          return true;
        }
      },
      one() {
        this.my_echarts = echarts.init(document.getElementById('main'));
        let obj = {
          name: '',
          type: 'bar',
          data: '',
          itemStyle: {
            normal: {
              barBorderRadius: 5,
            }
          },
        };
        let series_data = [];
        let datas = [];
        if (this.yfields_key.length > 1) {
          this.yfields_key.forEach((v, i) => {
            let obj1 = JSON.parse(JSON.stringify(obj));
            obj1.name = this.yfields[i];
            // obj1.barWidth = (100/this.yfields_key.length)+'%';
            obj1.data = this.y_data.map(v => v[this.yfields_key[i]]);
            datas.push(obj1.data);
            series_data.push(obj1);
          })
        } else {
          let obj1 = JSON.parse(JSON.stringify(obj));
          obj1.name = this.yfields[0];
          let c = this.y_data.map(v => v[this.yfields_key[0]]);
          obj1.data = c;
          datas.push(obj1.data);
          obj1.itemStyle.normal.color = new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              // {offset: 0, color: '#14c8d4'},
              // {offset: 1, color: '#43eec6'},
              {offset: 0, color: '#a1c4fd'},
              {offset: 1, color: '#c2e9fb'}
            ]
          );

          series_data = obj1;
        }
        ;
        console.log(series_data, datas)
        let option = {
          backgroundColor: "#fff",
          title: {
            text: this.title,
            x: 'center',
            padding: [10, 0],
          },
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:888;',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: [this.title],
            textStyle: {
              color: '#333',
            },
            top: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.x_data,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          dataZoom: [
            {
              show: true,
              start: 0,
              end: 100,
              textStyle: false,
            },
            {
              type: 'inside',
              start: 94,
              end: 100
            },
            // {
            //   show: true,
            //   yAxisIndex: 0,
            //   filterMode: 'empty',
            //   width: 10,
            //   height: '80%',
            //   showDataShadow: false,
            //   left: '93%'
            // }
          ],
          series: series_data
        };
        let reduce_num = this.y_data.reduce((pre, cur) => {
          if (pre.constructor === Number) {
            return parseInt(pre || 0) + parseInt(cur[this.yfields_key[0]] || 0)
          } else {
            return parseInt(pre[this.yfields_key[0]] || 0) + parseInt(cur[this.yfields_key[0]] || 0)
          }
        });
        this.pie_table = this.x_data.map((v, i) => {
          let value = datas[0][i];
          let percentage_num = (parseInt(value) / parseInt(reduce_num) * 100).toFixed(2);
          let percentage = isNaN(percentage_num) ? '&nbsp;' : '' + percentage_num + '%';

          return {name: v, value: value, percentage: percentage}
        })
        this.my_echarts.setOption(option);
        this.type.isShow = false;

      },
      two() {
        let reduce_num = this.y_data.reduce((pre, cur) => {
          if (pre.constructor === Number) {
            return parseInt(pre || 0) + parseInt(cur[this.yfields_key[0]] || 0)
          } else {
            return parseInt(pre[this.yfields_key[0]] || 0) + parseInt(cur[this.yfields_key[0]] || 0)
          }
        });
        let data = this.x_data.map((v, i) => {
          let value = this.y_data[i][this.yfields_key[0]];
          let percentage_num = (parseInt(value) / parseInt(reduce_num) * 100).toFixed(2)
          let percentage = isNaN(percentage_num) ? '&nbsp;' : '' + percentage_num + '%';
          return {
            name: v,
            value: value,
            percentage: percentage
          };
        });
        this.pie_table = data;
        this.my_echarts = echarts.init(document.getElementById('main'));
        let option = {
          title: {
            text: this.title,
            x: 'center',
            padding: [10, 0],
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            extraCssText: 'z-index:888;',
            position: function (point, params, dom, rect, size) {
              return [params[0] - 220, '10%'];

            }
          },

          label: {
            align: 'left',
            normal: {
              formatter(v) {
                let text = Math.round(v.percent) + '%' + '' + v.name
                if (text.length <= 8) {
                  return text;
                } else if (text.length > 8 && text.length <= 16) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8)}`
                } else if (text.length > 16 && text.length <= 24) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`
                } else if (text.length > 24 && text.length <= 30) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24)}`
                } else if (text.length > 30) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24, 30)}\n${text.slice(30)}`
                }
              },
              textStyle: {
                fontSize: 8
              }
            }
          },


          // legend: {
          //   show:false,
          //   orient: 'vertical',
          //   left: 'left',
          //   data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
          // },
          series: [
            {
              name: this.title,
              type: 'pie',
              radius: '45%',
              center: ['50%', '50%'],
              data: data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        this.my_echarts.setOption(option);
        this.type.isShow = false;
      },
      three() {
        this.my_echarts = echarts.init(document.getElementById('main'));
        let option = {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%",
            extraCssText: 'z-index:888;',
          },
          title: {
            text: this.title,
            x: 'center',
            padding: [10, 0],
          },
          // toolbox: {
          //   feature: {
          //     restore: {},
          //     saveAsImage: {}
          //   }
          // },
          series: [
            {
              name: this.title,
              type: 'gauge',
              detail: {
                formatter: '{value}%',
                textStyle: {
                  fontSize: 14
                }
              },
              data: [{value: this.y_data[0][this.yfields_key[0]] || 0, name: this.yfields[0]}],
              textStyle: {
                fontSize: 14
              }
            }
          ]
        };
        this.my_echarts.setOption(option);
        this.type.isShow = false;
      },
      four() {
        this.table_data = [];
        this.yfields_key.forEach((value, index) => {
          let obj = {
            name: this.yfields[index],
            value: this.y_data[0][value],
          };
          this.table_data.push(obj);
        })
        this.type.isShow = false;
      },
      cut_date_click(date_data) {
        this.get_data.DynamicConditions.forEach(v => {
          switch (v.First + '') {
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
      cut_echarts(type) {
        if (type == 'prev') {
          if (this.$route.query.index == '0') {
            this.$vux.toast.text('已经是第一个图表了', 'middle')
          } else {
            let query2 = JSON.parse(JSON.stringify(this.$route.query));
            query2.index--;
            let data = this.every_list_data[query2.index];
            query2.id = data.id;
            query2.chartType = data.chartType;
            query2.name = data.name;
            query2.date_sure = data.date_sure;
            console.log(data, 'dddddddddddddddddddddwww');
            this.$router.replace({path: '/statistics/oms/echarts', query: query2});
            let obj = {graphId: this.get_data.graphId};
            console.log(query2, 'query信息prev')
            this.get_data = obj;
          }
        } else if (type == 'next') {
          if (this.$route.query.index == this.every_list_data.length - 1) {
            this.$vux.toast.text('已经是最后图表了', 'middle')
          } else {
            let query2 = JSON.parse(JSON.stringify(this.$route.query));
            query2.index++;
            let data = this.every_list_data[query2.index];
            query2.id = data.id;
            query2.chartType = data.chartType;
            query2.name = data.name;
            query2.date_sure = data.date_sure;
            console.log(query2, 'query信息next')
            this.$router.replace({path: '/statistics/oms/echarts', query: query2});
            let obj = {graphId: this.get_data.graphId};
            this.get_data = obj;
          }
        }
      },
      handle_date() {
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth() + 1
      },
      async sure_click(v) {
        console.log(v);
        Vue.prototype.TenantId = this.radio_data;
        localStorage.setItem('tenantId', this.radio_data);


        let query_name = this.list_data.filter(v => {
          return v.id == this.radio_data
        });
        query_name = query_name.length > 0 ? query_name[0] : {};
        this.current_jigou_data = query_name;
        console.log(query_name, '机构名称')
        this.show1 = false;
        await this.every_get();
        let {index, name, id, chartType} = this.$route.query;
        // if(this.every_list_data[index]);
        this.every_list_data.forEach((v, i) => {
          v.index = i;
        });
        let data = this.every_list_data.filter((v, i) => {
          return (v.name == name && v.chartType == chartType)
        });
        console.log(data, 'datatatatata');
        let obj = {};
        let current_data = [];
        if (data.length > 0) {
          current_data = data[0];
        } else {
          current_data = this.every_list_data[0];
        }
        ;
        obj.name = current_data.name;
        obj.id = current_data.id;
        obj.chartType = current_data.chartType;
        obj.index = current_data.index;
        obj.date_sure = current_data.date_sure;
        let TenantId = localStorage.getItem('tenantId');
        obj.tenant_id = TenantId;
        this.$router.replace({path: '/statistics/oms/echarts', query: obj});
      }
    },
    watch: {
      "$route"(v) {
        this.handle_date();
        let arr = [
          {
            "Logic": "AND",
            "First": "月",
            "Operator": 0,
            "After": 12,
            "ValueType": 0,
            "InputControl": 0,
            "DataType": "float",
            "DictType": null,
            "FieldViewName": "月",
            "Group": null
          },
          {
            "Logic": "AND",
            "First": "年",
            "Operator": 0,
            "After": 2018,
            "ValueType": 0,
            "InputControl": 0,
            "DataType": "float",
            "DictType": null,
            "FieldViewName": "年",
            "Group": null
          }]
        arr.forEach(v => {
          if (v.First == '年') {
            v.After = this.year;
          } else if (v.First == '月') {
            v.After = this.month;
          }
        });
        this.get_data.DynamicConditions = arr;
        this.echarts_get_data();
      },
    },
    destroyed() {
      // console.log(this.$vux.toast.isVisible(),'-------------------------')
      if (this.my_echarts) {
        this.my_echarts.dispose();
      }
    },

  }
</script>

<style lang="scss" scoped>
  .demo-list-box {
    background-color: #fff;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .statistics-oms-echarts {
    background: #fff;
    min-height: 100vh;
    height: 100%;
    &-pie-table {
      /*width: 90%;*/
      margin: 0 30px;
      padding-bottom: 30px;

      p {
        height: 40px;
        display: flex;
        width: 100%;
        line-height: 40px;

        &:nth-child(2n-1) {
          border-bottom: none;
          border-top: none;
        }

        &:first-child {
          border-top: 1px solid #333;
        }

        &:last-child {
          border-bottom: 1px solid #333;
        }

        border-bottom: 1px solid #333;
        border-top: 1px solid #333;

        span {
          &:first-child {
            border-right: none;
          }

          flex: 1;
          text-align: center;
          border: 1px solid #333;
          border-bottom: none;
          border-top: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }
      }

    }

    &-jggk {
      height: 80px;
      width: 90%;
      margin: 20px auto;
      display: flex;
      border: 1px solid #ccc;
      border-right: none;

      p {
        flex: 1;
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ccc;
      }
    }

    &-cut {
      position: fixed;
      top: 50%;
      width: 100%;

      &-prev {
        position: absolute;
        left: 5px;
      }

      &-next {
        position: absolute;
        right: 5px;
      }

      /*&-prev, &-next {*/
      /*width: 30px;*/
      /*height: 30px;*/
      /*text-align: center;*/
      /*line-height: 30px;*/
      /*background: #1c76dc;*/
      /*color: #fff;*/
      /*border-radius: 50%;*/
      /*}*/
    }
  }
</style>
