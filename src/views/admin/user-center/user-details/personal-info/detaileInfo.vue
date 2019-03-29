<template>
  <!--------详细信息--------->
  <main class="main">
    <tab v-model="tabIndex" class="fixed">
      <tab-item @on-item-click="backIndex" selected>基本信息</tab-item>
      <tab-item @on-item-click="backIndex">个性化信息</tab-item>
      <tab-item @on-item-click="backIndex">纪念日信息</tab-item>
      <tab-item @on-item-click="backIndex">体检报告</tab-item>
    </tab>
    <div class="items">
      <div class="swiper swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div>
              <ul class="list">
                <li>入住日期：{{result.resident.startDate | formatTime}}</li>
                <li>年龄：{{result.resident.customer.age}}岁</li>
                <li>生日：{{result.resident.customer.birthOfDate | formatTime}}</li>
                <li>籍贯：{{result.resident.customer.nativePlace}}</li>
                <li>名族：{{result.resident.customer.nationKeyStr}}</li>
                <li>常住类型：{{result.resident.customer.residentTypeKeyStr}}</li>
                <li>申请类型：{{result.resident.careClassKeyStr}}</li>
                <li>联系电话：{{result.resident.customer.phoneNumber}}</li>
                <li>居住地址：{{result.resident.customer.residentialAddress}}</li>
                <li>政治面貌：{{result.resident.customer.politicalStatusKeyStr}}</li>
                <li>婚姻状况：{{result.resident.customer.maritalStatusKey}}</li>
                <li>宗教信仰：{{result.resident.customer.religiousBeliefKeyStr}}</li>
                <li>文化程度：{{result.resident.customer.educationDegreeKey}}</li>
                <li>入住前住处：{{result.resident.customer.comeFromPreceInParam}}</li>
                <li>生活状态：{{result.resident.customer.lifeState}}</li>
                <li>原单位：{{result.resident.customer.originalEnterprise}}</li>
                <li>原职业：{{result.resident.customer.originalProfession}}</li>
              </ul>
            </div>
          </div>
          <div class="swiper-slide">
            <div>
              <ul class="list">
                <li>同住人：{{result.resident.customer.customerExtraInfo.liveWith}}</li>
                <li>起床时间：{{result.resident.customer.customerExtraInfo.getUp}}</li>
                <li>午休时间：{{result.resident.customer.customerExtraInfo.noonBreak}}</li>
                <li>夜眠时间：{{result.resident.customer.customerExtraInfo.nightSleep}}</li>
                <li>移动方式：{{result.resident.customer.customerExtraInfo.movementModeKeyStr}}</li>
                <li>步行情况：{{result.resident.customer.customerExtraInfo.movement_TreadKeyStr}}</li>
                <li>口味偏好：{{result.resident.customer.customerExtraInfo.tasteKeyStr}}</li>
                <li>忌口：{{result.resident.customer.customerExtraInfo.taboosKeyStr}}</li>
                <li>是否回民餐：{{result.resident.customer.customerExtraInfo.isHuiZu}}</li>
                <li>锻炼频率：{{result.resident.customer.customerExtraInfo.exerciseFrequencyKeyStr}}</li>
                <li>每次锻炼时间：{{result.resident.customer.customerExtraInfo.eachExerciseTimeKeyStr}}</li>
                <li>吸烟状况：{{result.resident.customer.customerExtraInfo.smokingStatusKeyStr}}</li>
                <li>饮酒状况：{{result.resident.customer.customerExtraInfo.drinkingStatusKeyStr}}</li>
                <li>沐浴频次：夏季{{result.resident.customer.customerExtraInfo.otherLiving_InSummerBathRateKeysStr}} 冬季{{result.resident.customer.customerExtraInfo.otherLiving_InWinterBathRateKeysStr}}</li>
                <li>住户喜欢与人谈论的话题：{{result.resident.customer.customerExtraInfo.favoriteTopicDesc}}</li>
                <li>住户敏感禁忌的话题：{{result.resident.customer.customerExtraInfo.tabooTopicDesc}}</li>
                <li>近期是否发生对生活有重大影响的事件：{{result.resident.customer.customerExtraInfo.social_Events}}</li>
              </ul>
            </div>
          </div>
          <div class="swiper-slide">
            <div>
              <ul class="anniversaries">
                <li :key="index" v-for="(item,index) in result.resident.customer.anniversaries">
                  <div class="userList">
                    <p class="big">{{item.month}}月</p>
                    <p>{{item.day}}日</p>
                  </div>
                  <div class="children">
                    <p>{{item.name}}</p>
                    <p class="remake">{{item.memo}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="swiper-slide">
            <div>
              <ul class="presentation">
                <li :key="index" v-for="(item,index) in physical">
                  <div class="left">
                    <p>{{item.attachClass}}</p>
                    <p>{{item.createTime | formatTime(2)}}</p>
                  </div>
                  <div class="right">
                    <span>{{item.name}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading @childEvent="loadingEvent" class="loading" :pageType="loading"></loading>
  </main>
</template>
<script>
import { Tab, TabItem } from "vux";
import { OmsHouseDetail, OmsHousePhysical } from "@/services/hourse-face.js";
import timePicker from "../../public/time";
import loading from "@/components/Loading.vue";
import Swiper from "../../../../../../static/swiper/swiper.js";
export default {
  props: {
    id: {
      type: [Number, String]
    }
  },
  components: {
    TabItem,
    Tab,
    loading
  },
  data() {
    return {
      swiper: null,
      loading: {
        pageType: "loading",
        isShow: false
      },
      //索引
      tabIndex: 0,
      //super object so big data
      result: {
        resident: {
          //居住信息
          customer: {
            customerExtraInfo: {},
            //纪念日
            anniversaries: []
          }
        },
        //用户个性化信息
        extraInfo: {}
      },
      //体检info
      physical: []
      // //swiper
      // swiper:null,
    };
  },
  created() {
    //初始化 解构
    this.extendFace().then(({ erly, tation }) => this.logic(erly, tation));
  },
  mounted() {
    let _this = this;
    this.swiper = new Swiper(".swiper", {
      on: {
        slideChange() {
          _this.tabIndex = _this.swiper.activeIndex;
        }
      }
    });
  },
  methods: {
    //tab index
    backIndex(index) {
      this.tabIndex = index;
    },
    //vux swiper 的坑
    parCatyHeight(g) {
      let topHeight = document.getElementsByClassName("vux-slider")[0]
          .offsetTop,
        diffHeight = window.screen.height + topHeight + 60;
      this.$nextTick(_ => {
        this.$refs.cateSwiper.xheight = diffHeight + "px";
      });
    },
    //----基本信息 个性化信息 纪念日信息
    getElderly() {
      this.loading.isShow = true;
      return new Promise((resolve, reject) => {
        OmsHouseDetail({ id: this.id })
          .then(res => {
            if (res.success) {
              resolve(res.result);
            } else {
              reject(false);
            }
          })
          .catch($ => {
            reject(false);
          });
      });
    },
    //--------体检报告
    getPresentation() {
      return new Promise((resolve, reject) => {
        OmsHousePhysical({
          residentId: this.id
        })
          .then(res => {
            if (res.success) {
              resolve(res.result);
            } else {
              reject(false);
            }
          })
          .catch(e => {
            reject(false);
          });
      });
    },
    //es7 处理多个接口
    async extendFace() {
      try {
        let erly = await this.getElderly();
        let tation = await this.getPresentation();
        return {
          erly,
          tation
        };
      } catch (e) {
        return {
          erly: false,
          tation: false
        };
      }
    },
    //处理逻辑logic
    logic(erly, tation) {
      if (erly && tation) {
        this.result = erly;
        this.physical = tation.items;
        this.loading.isShow = false;
      } else {
        this.loading.pageType = "error";
      }
      console.log(erly, tation);
    },
    //loading 失败处理
    loadingEvent() {
      this.extendFace().then(({ erly, tation }) => this.logic(erly, tation));
    }
  },
  filters: {
    formatTime(str, status = 1) {
      if (status == 1) {
        if (str) {
          return timePicker("yyyy/M/dd", new Date(str));
        } else {
          return "";
        }
      } else {
        return str ? timePicker("yyyy-M-dd hh:mm:ss", new Date(str)) : "";
      }
    }
  },
  watch: {
    tabIndex(newVal) {
      this.swiper.slideTo(newVal);
    }
  }
};
</script>

<style  scoped lang='less'>
@import url("../../../../../../static/swiper/swiper.css");
@them: #1c76dc;
@font: #777474;
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
.loading {
  margin-top: 120px;
}
.main {
  background: #fff;
  .list {
    padding-top: 44px;
    li {
      .rem(height, 90);
      border-bottom: 1px dashed #ccc;
      display: flex;
      align-items: center;
      .rem(padding-left, 30);
    }
  }
  .anniversaries {
    padding-top: 44px;
    li {
      .rem(height, 90);
      border-top: 8px solid #f4f4f4;
      display: flex;
      .userList {
        margin: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-right: 1px dashed #ccc;
        color: @them;
        .rem(width, 120);
        .big {
          font-size: 1.2em;
          font-weight: 700;
        }
      }
      .children {
        color: #777b81;
        .rem(margin-left, 60);
        display: flex;
        flex-direction: column;
        justify-content: center;
        p:nth-child(1) {
          font-weight: 600;
        }
        .remake {
          font-size: 12px;
        }
      }
    }
    li:last-child {
      border-bottom: 8px solid #f4f4f4;
    }
  }
  .presentation {
    padding-top: 44px;
    li {
      border-top: 8px solid #f4f4f4;
      display: flex;
      justify-content: space-between;
      .rem(height, 100);
      .left {
        .rem(margin-left, 30);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        color: @font;
      }
      .right {
        display: flex;
        align-items: center;
        .rem(margin-right, 30);
        span {
          text-decoration: underline;
          color: #39b6f7;
        }
      }
    }
    li:last-child {
      border-bottom: 8px solid #f4f4f4;
    }
  }
  .fixed {
    position: fixed;
    width: 100%;
    z-index: 9999;
  }
}
</style>
