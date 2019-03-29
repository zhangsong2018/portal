<template>
  <div style="height:100%;min-height: 100vh;" class="wraps-info">
      <tab class="fixed" custom-bar-width="60px" v-model="tabIndex">
        <tab-item selected>居住记录</tab-item>
        <tab-item>合同记录</tab-item>
      </tab>
      <div ref="swiper" class="swiper swiper-container">
        <div class="swiper-wrapper">
          <!--第一块-->

          <div ref="swiper-silder1" class="swiper-slide">
            到顶了
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
            <p>1111111111111111111111</p>
          </div>

            <!--第二块-->
          <div ref="swiper-silder2" class="swiper-slide">
            <div class="contract">

            </div>
            <div class="footer-box">
              <section>
                到顶了
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>

                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>

                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>

                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>
                <p>222222222222222222222222222</p>


              </section>
            </div>
          </div>
        </div>
      </div>
      <!--<loading @childEvent="loadingEvent" class="loading" :pageType="loading"></loading>-->
  </div>
</template>

<script>
  import {Cell, Group, Tab, TabItem, ViewBox} from "vux";
  import {OmsHouseGetid, OmsHouseLive} from "@/services/hourse-face.js";
  import loading from "@/components/Loading.vue";
  import timePiacker from "../../public/time";
  import Swiper from "../../../../../../static/swiper/swiper.js";

  export default {
    components: {
      TabItem,
      Tab,
      loading,
      Group,
      Cell,
      ViewBox
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
    methods: {},
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
        // this.
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
