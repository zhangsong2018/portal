<template>
  <div id="wrap">
    <HeaderBar><span slot="title">客户详情</span></HeaderBar>
    <section class="section">
      <div class="menu_list">
        <h3 class="menu_list_item" style="color:#282828">{{personInfo.name}}（{{personInfo.degree}}）</h3>
        <p class="menu_list_item">意向机构：{{personInfo.organization}}</p>
        <p class="menu_list_item">最近跟进时间：{{personInfo.communicationCreationTime | data }}</p>
        <p class="menu_list_item">主管业务员:{{personInfo.operationName}}</p>
        <p class="apply_for" @click="communication_jump">
          <img src="@/static/images/gt.png" alt="" style="width: 40px;height: 40px;padding: 10px">
        </p>
      </div>
      <div class="tab_bigbox">
        <div class="tab_items" id="fixedBar" :class="{ fixedBar: isFixed }">
          <tab active-color="#1c76dc" :line-width="2" custom-bar-width="100%">
            <tab-item selected @on-item-click="onItemClick(0)">客户信息</tab-item>
            <tab-item @on-item-click="onItemClick(1)">老人信息</tab-item>
            <tab-item @on-item-click="onItemClick(2)">沟通记录</tab-item>
          </tab>
        </div>
        <div class="tab_list">
          <ul class="tab_list_box" v-if="tabNum == 0">
            <li class="item_cell">
              <p>姓名</p>
              <p>{{personInfo.name}}</p>
            </li>
            <li class="item_cell">
              <p>性别</p>
              <p v-if="personInfo.gender == 2">女</p>
              <p v-if="personInfo.gender == 1">男</p>
            </li>
            <li class="item_cell">
              <p>年龄</p>
              <p>{{personInfo.age}}</p>
            </li>
            <li class="item_cell">
              <p>出生日期</p>
              <p>{{personInfo.birthday | data}}</p>
            </li>
            <li class="item_cell">
              <p>联系电话</p>
              <p @click="call(personInfo.phoneNumber)" style="color: rgb(28, 118, 220);">{{personInfo.phoneNumber}}</p>
            </li>
            <li class="item_cell">
              <p>微信号</p>
              <p>{{personInfo.weChatName}}</p>
            </li>
            <li class="item_cell">
              <p>邮件</p>
              <p>{{personInfo.email}}</p>
            </li>
            <li class="item_cell">
              <p>信息渠道</p>
              <p>{{personInfo.infoSource}}</p>
            </li>
            <li class="item_cell">
              <p>意向程度</p>
              <p>{{personInfo.degree}}</p>
            </li>
            <li class="item_cell">
              <p>所在省份</p>
              <p>{{personInfo.province}}</p>
            </li>
            <li class="item_cell">
              <p>所在市</p>
              <p>{{personInfo.city}}</p>
            </li>
            <li class="item_cell">
              <p>所在区/县</p>
              <p>{{personInfo.district}}</p>
            </li>
            <li class="item_cell">
              <p>居住社区名称</p>
              <p>{{personInfo.community}}</p>
            </li>
            <li class="item_cell">
              <p>登记日期</p>
              <p>{{personInfo.creationTime | data}}</p>
            </li>
          </ul>
          <div class="tab_list_box" v-if="tabNum == 1 && personInfo.crmCustomers.length > 0">
            <ul v-for="item in personInfo.crmCustomers">
              <li class="item_cell">
                <p>与客户关系</p>
                <p>{{item.relation}}</p>
              </li>
              <li class="item_cell">
                <p>姓名</p>
                <p>{{item.name}}</p>
              </li>
              <li class="item_cell">
                <p>年龄</p>
                <p>{{item.age}}</p>
              </li>
              <li class="item_cell">
                <p>性别</p>
                <p v-if="item .gender == 2">女</p>
                <p v-if="item .gender == 1">男</p>
              </li>
              <li class="item_cell">
                <p>身份证号</p>
                <p>{{item.cardNo}}</p>
              </li>
              <li class="item_cell">
                <p>联系电话</p>
                <p>{{item.phoneNumber}}</p>
              </li>
              <li class="item_cell">
                <p>目前居住情况</p>
                <p>{{item.livingSituation}}</p>
              </li>
              <li class="item_cell">
                <p>生活状态</p>
                <p>{{item.lifeState}}</p>
              </li>
              <li class="item_cell">
                <p>身体状况</p>
                <p>{{item.bodyState}}</p>
              </li>
              <li class="item_cell">
                <p>所在省份</p>
                <p>{{item.province}}</p>
              </li>
              <li class="item_cell">
                <p>所在市</p>
                <p>{{item.city}}</p>
              </li>
              <li class="item_cell">
                <p>所在区/县</p>
                <p>{{item.district}}</p>
              </li>
              <li class="item_cell">
                <p>居住社区名称</p>
                <p>{{item.community}}</p>
              </li>
              <li class="item_cell">
                <p>职业</p>
                <p>{{item.occupationInfo}}</p>
              </li>
              <li class="item_cell">
                <p>入住意愿</p>
                <p>{{item.liveDesire}}</p>
              </li>
              <li class="item_cell">
                <p>意向入住机构</p>
                <p>{{item.targetOrg}}</p>
              </li>
              <li class="item_cell">
                <p>意向入住类型</p>
                <p>{{item.targetLiveType}}</p>
              </li>
              <li class="item_cell">
                <p>意向入住房型</p>
                <p>{{item.targetHouseType}}</p>
              </li>
              <li class="item_cell">
                <p>是否入住过其他养老机构</p>
                <p v-if="item.hasEnteredOtherOrg">是</p>
                <p v-if="!item.hasEnteredOtherOrg">否</p>
              </li>
              <li class="item_cell">
                <p>曾入住次数</p>
                <p>{{item.hasEnteredTimes}}</p>
              </li>
              <li class="item_cell">
                <p>曾入机构</p>
                <p>{{item.hasEnteredOrgName}}</p>
              </li>
              <li class="item_cell">
                <p>经济来源</p>
                <p>{{item.economicSource}}</p>
              </li>
              <li class="item_cell">
                <p>兴趣爱好</p>
                <p>{{item.hobby}}</p>
              </li>
              <li class="item_cell">
                <p>优先考虑因素</p>
                <p>{{item.considerReason}}</p>
              </li>

            </ul>
          </div>

          <ul class="tab_list_box" v-if="tabNum == 2">
            <li class="item_cells" v-for="item in communicationInfo">
              <p>{{item.userName}} | {{item.date | data}} <br>
                {{item.eventType}} | {{item.probability}} | {{item.organization}}
              </p>
              <p>{{item.memo}}</p>
            </li>
          </ul>
        </div>


      </div>
    </section>
    <div v-transfer-dom>
      <confirm v-model="show5"
               ref="confirm5"
               :title="confirm_title"
               @on-confirm="onConfirm5">
        <div>
          <select name="" id="confirm_select">
            <option v-for="(v,i) in confim_data" :key="i" :value="v.id">{{v.value}}</option>
          </select>
        </div>
      </confirm>
    </div>
    <div v-transfer-dom>
      <!--<loading :show="show2" text=""></loading>-->
      <YC-load style="top: 80px;" :pageType="type" @childEvent="toParent"></YC-load>
    </div>
  </div>
</template>
<script>
  import {
    Confirm,
    Group,
    Icon,
    Loading,
    Popup,
    PopupHeader,
    Radio,
    Tab,
    TabItem,
    Toast,
    TransferDomDirective as TransferDom,
    XButton,
    XSwitch
  } from 'vux'
  import * as sysApi from '../../../services/sys'
  import HeaderBar from '@/views/HeaderBarIT';
  import Vue from 'vue'
  import getDsBridge from '@/static/js/getDsBridge.js'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        type: {
          isShow: false, //是否显示
          pageType: "loading", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        },
        title: "客户详情",
        tabNum: 0,
        id: "",
        show2: false,
        show5: false,
        confirm_title: "发起申请",
        confim_data: [],
        personInfo: {},
        isFixed: false, // bar浮动
        offsetTop: 0,   // 触发bar浮动的阈值
        marginTop: 0,   // 触发bar浮动的同时 给数据列表一个margin-top 防止列表突然上移 会很突兀
        communicationInfo: []
      }
    },
    created() {
      this.init();
    },
    directives: {
      TransferDom
    },
    components: {
      HeaderBar,
      Loading,
      Toast,
      Group,
      XSwitch,
      XButton,
      Icon,
      PopupHeader,
      Popup,
      Radio,
      Tab,
      TabItem,
      Confirm
    },
    computed: {},
    mounted() {
      window.addEventListener('scroll', this.handleScroll, true);
      this.dictQuery('Organization');
    },
    methods: {
      toParent(v) {
        if (v == 'errorData') {
          this.init();
        }
      },
      communication_jump() {
        console.log(this.personInfo)
        let obj = {
          id: this.$route.params.id,
          name: this.personInfo.name,
          organization: this.personInfo.organization,
          degree: this.personInfo.degree
        }
        this.$router.push({path: '/crm/AddCommunication', query: obj})
      },
      onItemClick(item) {
        this.tabNum = item;
      },
      init() {
        this.id = this.$route.params.id;
        // this.show2 = true;
        this.type = {
          isShow: true, //是否显示
          pageType: "loading", //显示类型
          text: "正在加载...",  // 用户自定义显示文字
          errName: "loadData",//需要重新调用的方法名
        };
        sysApi.CrmContactGet({
          id: this.id
        })
          .then(res => {
            if (res.success) {
              this.personInfo = res.result;
              this.show2 = false;
              this.type.isShow = false;
              sysApi.CrmCommunicationQuery({
                name: res.result.name
              })
                .then(res => {
                  if (res.success) {
                    console.log(res)
                    this.communicationInfo = res.result.items;
                  }
                }).catch((error) => {
                this.type = {
                  isShow: true, //是否显示
                  pageType: "error", //显示类型
                  text: "",  // 用户自定义显示文字
                  errName: "errorData",//需要重新调用的方法名
                };
                // this.$vux.toast.text('请求失败', 'bottom');
              })
            }
          }).catch((error) => {
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          };
          // this.$vux.toast.text('请求失败', 'bottom');
        });
      },
      // 滚动监听  滚动触发的效果写在这里
      handleScroll() {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        console.log(scrollTop)
        //  当滚动超过 50 时，实现吸顶效果
        if (scrollTop > 80) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }

      },
      call(number) {
        getDsBridge.callPhone(number);
      },
      onConfirm5() {
        console.log('=-----');
      },
      dictQuery(type) { //crm/getTenants
        sysApi.omsCRMgetTenants({type: type}).then(res => {
          if (res.data.result) {
            let option_val = [];
            this.confim_data = [];
            let result = res.data.result;
            if (Array.isArray(result) && result.length > 0) {
              result.forEach(value => {
                option_val.push({value: value.name, id: value.id})
              });
              this.confim_data = option_val;
            }
          }
        }).catch(error => {
          this.type = {
            isShow: true, //是否显示
            pageType: "error", //显示类型
            text: "",  // 用户自定义显示文字
            errName: "errorData",//需要重新调用的方法名
          };
          // this.$vux.toast.text('接口异常', 'bottom');
          console.log('接口' + error);
        })
      },
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          alert(val);
        },
        // 深度观察监听
        deep: true
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll, true);
    }
  }

  Vue.filter('data', function (value) {
    if (value) {
      return value.substr(0, 10);
    }
  });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #app {
    width: 100%;
    height: 100%;
  }

  body {
    width: 100%;
    height: 100%;
  }

  #wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f4f4f4;

  }

  .section {
    margin-top: 80px;
    background: #fff;
    flex: 1;
    overflow: scroll;
  }

  .menu_list {
    background: #fff;
    padding: 15px 0;
    position: relative;
    border-bottom: 20px solid #f4f4f4;
  }

  .menu_list_item {
    padding-left: 35px;
    color: #999;
  }

  .tab_bigbox {
    background: #fff;

  }

  .item_cell {
    width: 90%;
    margin: 0 5%;
    min-height: 50px;
    border-bottom: 1px solid #ccc;
    padding: 5px 0;

  }

  .item_cells {
    width: 90%;
    margin: 0 5%;
    border-bottom: 1px solid #ccc;
    padding: 5px 0;
  }

  .item_cell p, .item_cells p {
    line-height: 25px;
    margin-left: 5px;
  }

  .item_cell p:nth-child(1) {
    color: #999;
  }

  .item_cells p:nth-child(1) {
    color: #999;
  }

  .tab_list {
    height: 100%;
    overflow-y: auto;

  }

  .menu_list .apply_for {
    position: absolute;
    top: 25px;
    right: 20px;
  }

  #confirm_select {
    min-width: 80px;
    min-height: 25px;
    background: #fff;
  }

  .fixedBar {
    position: fixed;
    top: 80px;
    z-index: 999;
    width: 100%;
  }

  .tab_list_box ul:nth-child(1) {
    border: none;
  }

  .tab_list_box ul {
    border-top: 20px solid #f4f4f4;
  }
</style>

