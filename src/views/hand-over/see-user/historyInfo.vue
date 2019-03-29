<template>
  <div class="wrpas">
    <!--头部-->
    <div class="header-main">
      <div class="headerbar"></div>
      <header-group class="header-group" :rightShow="false" title="交接班历史记录"></header-group>
      <div class="card-bar">
        <card>
          <div slot="content" class="card">
            <div class="vux-1px-r">
              <span>姓名</span>
              <span>{{handInfo.name}}</span>
            </div>
            <div class="vux-1px-r">
              <span>床位号</span>
              <span>{{handInfo.bedCode}}</span>
            </div>
            <div>
              <span>护照等级</span>
              <span class="special">{{handInfo.abilityLevel}}</span>
            </div>
          </div>
        </card>
      </div>
    </div>
    <!--滚动区域-->
    <div class="scroll">
      <main ref="scroll" id="scroll" class="main mescroll">
        <div>
          <div class="group">
            <group class="group-item" :key="index" v-for="(info,index) in items">
              <cell
                style="font-size:12px;color:#ccc;padding-bottom:0px"
                :style="{'padding-bottom':info.flag ? '0px' :''}"
                :arrow-direction="info.flag ? 'up' : 'down'"
                @click.native="info.flag = !info.flag"
                is-link
              >
                <div class="cell-title" slot="title">
                  <p>
                    <span style="color:#808080">提交人:</span>
                    <span style="color:black">{{info.UserName}}</span>
                  </p>
                  <p class="last-right">
                    <span style="color:#808080">交班时间:</span>
                    <span style="color:black">{{info.ShiftTime | format}}</span>
                  </p>
                </div>
              </cell>
              <aside class="slide" :class="[info.flag ?  'animate'  : '']">
                <cell style="color:#808080;font-size:12px;padding-top:0px;" title="交班重点:">
                  <div style="color:black;padding-top:10px" slot="inline-desc">{{info.Content}}</div>
                </cell>
                <div :key="ins" v-for="(fre,ins) in info.arrchamentArray">
                  <p @click="audioPlay($event,fre)" class="audio-item">
                    <img class="audio-img" src="@/static/images/handover/audio.png" alt="乐成集团">
                    <img
                      v-show="!fre.flag"
                      class="audio-img"
                      src="@/static/images/handover/play.png"
                      alt
                    >
                    <img
                      v-show="fre.flag"
                      class="audio-img"
                      src="@/static/images/handover/pause.png"
                      alt
                    >
                  </p>
                  <audio ref="audio" :src="url+'/'+fre.AttachmentFile"></audio>
                </div>
              </aside>
            </group>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import headerGroup from "../../admin/user-center/public/header.vue";
import { Card, Cell, Group, Spinner, CellBox } from "vux";
import { OmsHandOverShow } from "@/services/hand-face.js";
import MeScroll from "mescroll.js";
import "mescroll.js/mescroll.min.css";
import { omsUrl } from "@/apis";
import errorImg from '@/static/images/no_data.png'
export default {
  components: {
    headerGroup,
    Card,
    Cell,
    Group,
    Spinner,
    CellBox
  },
  data() {
    return {
      //音频地址
      url: omsUrl,
      //插件
      mescroll: null,
      //分页
      page: {
        SkipCount: 0,
        MaxResultCount: 10
      },
      handInfo: {
        //默认值防止刷新出错
        abilityLevel: "",
        bedCode: "",
        gender: "",
        id: "",
        name: "",
        priority: "",
        residentId: ""
      },
      //分槽
      items: []
    };
  },
  created() {
    this.sysInit();
  },
  mounted() {
    //初始化scroll
    this.initScroll();
  },
  methods: {
    initScroll() {
      let _this = this;
      this.mescroll = new MeScroll(this.$refs.scroll, {
        up: {
          callback: this.showRecord,
          page: {
            num: 0,
            size: 10
          },
          noMoreSize: 5,
          isLock: false,
          isBoth: true,
          isBounce: true,
          htmlNodata: '<p class="upwarp-nodata">-- 没有更多了 --</p>',
          empty: {
            warpId: "scroll",
            icon: errorImg,
            tip: "暂无相关数据~",
            btntext: "重新加载",
            btnClick() {
              _this.mescroll.resetUpScroll()
            },
            supportTap: false
          },
          toTop: {
            warpId: "scroll",
            src: "./static/mescroll/mescroll-totop.png",
            html: `<div style='width:30px;height:30px'><img width='100%' height='100%' src='./static/mescroll/mescroll-totop.png'></div>`,
            offset: 1000,
            warpClass: "mescroll-totop",
            showClass: "mescroll-fade-in",
            hideClass: "mescroll-fade-out",
            duration: 300,
            supportTap: false
          }
        },
        down: {
          outOffsetRate: 0.2,
          bottomOffset: 20,
          minAngle: 45,
          callback(mescroll) {
            mescroll.resetUpScroll();
          }
        }
      });
    },
    sysInit() {
      this.handInfo = Object.assign({}, this.$store.state.handOver.handInfo);
    },
    showRecord(page, mescroll) {
      // this.$vux.loading.show();
      let resdeintName = this.$store.state.handOver.handInfo.name;
      OmsHandOverShow({
        resdeintName,
        skipCount: (page.num - 1) * page.size, // 是 int 跳过计数
        maxResultCount: page.size,
        Sorting: "shiftTime desc"
      })
        .then(res => {
          console.log(page);
          //  if (res.Items && res.Items.length > 0) {
          res.Items.forEach(o => (o.flag = true)); //增加控制器
          res.Items.forEach(o => {
            if (o.arrchamentArray) {
              o.arrchamentArray.forEach(d => {
                d.flag = false;
              });
            }
          });

          if (page.num === 1) this.items = [];
          this.items = this.items.concat(res.Items);
          this.$nextTick(_ => {
            mescroll.endSuccess(res.Items.length);
            let label = document.querySelectorAll(".vux-label");
            [...label].forEach(o => (o.style["display"] = "inline"));
          });
          // this.mescroll.endSuccess(initArr.length);
          //} else {
          //  mescroll.endErr();
          // }
          // this.$vux.loading.hide();
        })
        .catch(e => {
          // this.$vux.loading.hide();
          mescroll.endErr();
        });
    },
    //播放音频
    audioPlay(e, item) {
      this.$refs.audio.forEach(o => (o.pause(), (o.currentTime = 0)));
      if (item.flag) {
        this.formaAudio();
        e.srcElement.parentNode.lastElementChild.pause();
      } else {
        this.formaAudio();
        item.flag = true;
        e.srcElement.parentNode.lastElementChild.play();
      }
      //----------播放完毕
      e.srcElement.parentNode.lastElementChild.addEventListener("ended", _ => {
        item.flag = false;
      });
    },
    //格式化音频
    formaAudio() {
      this.items.forEach(o => {
        o.arrchamentArray.forEach(d => {
          if (d.flag) {
            d.flag = false;
          }
        });
      });
    }
  },
  //离开
  beforeDestroy() {
    this.$vux.toast.hide();
    this.$vux.loading.hide();
  },
  filters: {
    format(time) {
      let arr = time.split(":");
      arr.pop();
      return arr.join(":");
    }
  }
};
</script>

<style scoped lang='less'>
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
@them: #1c76dc;
@font: #777474;
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.wrpas {
  .header-main {
    position: relative;
  }
  .headerbar {
    height: 30px;
    width: 100%;
    background: #1c76dc;
  }
  .card-bar {
    position: fixed;
    width: 100%;
    top: 80px;
    z-index: 99999;
  }
  .card {
    .rem(padding, 15);
    display: flex;
    .special {
      display: inline-block;
      width: 80%;
      text-align: center;
    }
    div {
      width: 33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span:first-child {
        color: @them;
      }
      span:last-child {
        color: @font;
      }
    }
  }
  .scroll {
    position: absolute;
    top: 137px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    .main {
      background: #f4f4f4;
      .group {
        .audio-img {
          .rem(width, 50);
          .rem(height, 50);
        }
        .last-right {
          .rem(margin-right, 30);
        }
        .cell-title {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .audio-item {
          .rem(width, 200);
          border-radius: 8px;
          border: 1px solid #ccc;
          border-width: 1px;
          .rem(margin, 20);
          display: flex;
          align-items: center;
          .rem(height, 70);
          justify-content: space-around;
          span {
            display: flex;
            align-items: center;
          }
        }
      }
      // .group-item:first-child{
      //     margin-top: 126px;
      // }
    }
  }
}
//动画
.slide {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}
//没数据
.noData {
  position: absolute;
  top: 40%;
  z-index: 333333;
  width: 100%;
}
.noData p {
  text-align: center;
  font-size: 14px;
  line-height: 50px;
  color: #282828;
}
.noData img {
  width: 120px;
  height: 120px;
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>
