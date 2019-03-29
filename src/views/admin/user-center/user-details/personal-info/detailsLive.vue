<template>
  <div class="wraps-info">
    <tab class="fixed" custom-bar-width="60px" v-model="tabIndex">
      <tab-item @on-item-click="backIndex" selected>居住记录</tab-item>
      <tab-item @on-item-click="backIndex">合同记录</tab-item>
    </tab>
    <div ref="swiper" class="swiper swiper-container">
      <div class="swiper-wrapper">
        <!--第一块-->
        <div ref="swiper-silder1" class="swiper-slide">
          <ul class="list">
            <li :key="index" v-for="(item,index) in list" class="items">
              <div class="top">
                <p>{{item.startDate | format}}</p>
                <p>
                  <span>操作人:</span>
                  {{item.userName}}
                </p>
              </div>
              <div class="bottom">
                <p>{{item.typeStr}}</p>
                <p>{{item.desc}}</p>
              </div>
            </li>
          </ul>
        </div>
        <!--第二块-->
        <div ref="swiper-silder2" class="swiper-slide">
          <div class="contract">
            <div class="left">
              <p>
                <b>{{contract.stateStr}}</b>
              </p>
              <p>提交人：{{contract.submitor}}</p>
              <p>审批人：{{contract.auditorId}}</p>
            </div>
            <div class="right">
              <p>生效日期： {{contract.auditDate | format(2)}}</p>
              <p>开始日期： {{contract.startDate | format(2)}}</p>
              <p>结束日期： {{contract.endDate | format(2)}}</p>
            </div>
            <div class="triangle">
              <p>1.0</p>
              <div class="triangle-bottomleft"></div>
            </div>
          </div>
          <div class="footer-box">
            <header class="header">
              <h4>长照入驻合同</h4>
              <p>
                <span>编号：{{contract.code}}</span>
                <span>版本：1.0</span>
              </p>
            </header>
            <section>
              <group>
                <cell :value="contract.residentName" title="住户姓名："></cell>
                <cell :value="contract.cardTypeStr" title="证件类型："></cell>
                <cell :value="contract.cardNo" title="证件号码："></cell>
                <cell :value="contract.careClassStr" title="居住类型："></cell>
                <cell :value="contract.signTypeStr" title="签署对象："></cell>
                <cell :value="contract.payerTypeStr" title="费用承担者："></cell>
                <cell :value="contract.payTypeStr" title="缴费模式："></cell>
                <cell :value="contract.totalPrice" title="合计金额："></cell>
                <cell :value="contract.deposit" title="押金金额："></cell>
                <cell :value="contract.startDate | format(2)" title="开始日期："></cell>
                <cell :value="contract.endDate | format(2)" title="结束日期："></cell>
                <cell :value="contract.memo" title="备注："></cell>
              </group>
            </section>
          </div>
        </div>
      </div>
    </div>
    <loading @childEvent="loadingEvent" class="loading" :pageType="loading"></loading>
  </div>
</template>

<script>
import { Tab, TabItem, Cell, Group } from "vux";
import { OmsHouseLive, OmsHouseGetid } from "@/services/hourse-face.js";
import loading from "@/components/Loading.vue";
import timePiacker from "../../public/time";
import Swiper from "../../../../../../static/swiper/swiper.js";
export default {
  components: {
    TabItem,
    Tab,
    loading,
    Group,
    Cell
  },
  props: {
    id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      //swiper
      swiper: null,
      //loading
      loading: {
        pageType: "loading",
        isShow: false
      },
      tabIndex: 0,
      //居住列表列表数据
      list: [],
      //合同
      contract: {}
    };
  },
  created() {
    this.getLiveList();
  },
  mounted() {
    let _this = this;
    this.swiper = new Swiper(".swiper-container", {
      on: {
        slideChange() {
          _this.tabIndex = _this.swiper.activeIndex;
        }
      }
    });
  },
  methods: {
    backIndex(index) {
      this.tabIndex = index;
    },
    parCatyHeight() {
      let topHeight = document.getElementsByClassName("vux-slider")[0]
          .offsetTop,
        diffHeight = window.screen.height + topHeight + 68;
      this.$nextTick(_ => {
        this.$refs.cateSwiper.xheight = diffHeight + "px";
      });
    },
    //获取居住记录列表API
    getLiveList() {
      this.loading.isShow = true;
      OmsHouseLive({
        ResidentId: this.id
      })
        .then(res => {
          if (res.success) {
            if (res.result == 0) {
              this.loading.pageType = "empty";
            } else {
              this.loading.isShow = false;
              this.list = res.result;
              this.getContract();
            }
          } else {
            this.loading.pageType = "error";
          }
        })
        .catch($ => {
          his.loading.pageType = "error";
        });
    },
    getContract() {
      OmsHouseGetid({ id: this.id }).then(res => {
        if (res.success) {
          this.contract = res.result;
        }
      });
    },
    loadingEvent() {
      this.getLiveList();
    }
  },
  filters: {
    format(str, status = 1) {
      if (status == 1) {
        return str ? timePiacker("yyyy-M-d hh:mm:ss", new Date(str)) : "";
      } else {
        if (str == "长期") {
          return "长期";
        } else {
          return str ? timePiacker("yyyy-M-d", new Date(str)) : "";
        }
      }
    }
  },
  watch: {
    tabIndex(index) {
      this.swiper.slideTo(index);
      // console.log(document.getElementsByClassName('wraps-info')[0].scrollTop)
      //this.$refs["swiper-silder" + (index+1)].scrollTop = 0;
    }
  }
};
</script>

<style scoped lang='less'>
@import url("../../../../../../static/swiper/swiper.css");
@them: #1c76dc;
@font: #777474;
@bg: white;
@border: #ccc;
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
.wraps-info {
  .fixed {
    position: fixed;
    width: 100%;
    z-index: 9999;
  }
  .loading {
    margin-top: 120px;
  }
  .swiper {
    padding-top: 44px;
    background: @bg;
    .list {
      .items {
        .rem(padding, 25);
        border-bottom: 1px solid @border;
        .top {
          display: flex;
          justify-content: space-between;
          margin-left: 5px;
          p:first-child {
            color: @them;
          }
          p:last-child {
            color: @font;
          }
          span {
            color: @them;
          }
        }
        .bottom {
          margin-top: 5px;
          display: flex;
          flex-direction: column;
          p:first-child {
            color: @them;
            margin-left: 5px;
          }
          p:last-child {
            margin-top: 5px;
            // .rem(margin-left, 90);
            // overflow: hidden;
            // word-break: keep-all;
            // white-space: nowrap;
            // text-overflow: ellipsis;
          }
          color: @font;
        }
      }
    }
    .contract {
      display: flex;
      background: @bg;
      font-size: 12px;
      color: @font;
      .triangle {
        flex: 1;
        p {
          float: right;
          color: white;
        }
        .triangle-bottomleft {
          width: 0;
          height: 0;
          border-top: 50px solid @them;
          border-left: 50px solid transparent;
        }
      }

      .left {
        width: 40%;
        p:first-child {
          color: @them;
          font-size: 13px;
        }
      }
      .right {
        width: 50%;
      }
      p {
        .rem(padding, 15);
        .rem(padding-left, 55);
      }
    }
    .footer-box {
      background: @bg;
      padding-top: 10px;
      color: @font;
      margin-top: 10px;
      .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50px;
        p {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
