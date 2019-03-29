<template>
  <div class="wraps">
    <headerGroup @on-menu="$sure" :title="title">
      <div class="slot-header" slot="backing"></div>
    </headerGroup>

    <header class="header">
      <card>
        <flexbox slot="content" :gutter="0">
          <flexbox-item :key="index" v-for="(item,index) in list" :span="span">
            <section class="vux-1px-r sections">
              <p class="num">{{item.value}}</p>
              <p class="text">{{item.attr}}</p>
            </section>
          </flexbox-item>
        </flexbox>
      </card>
    </header>
    <main class="main">
      <v-chart :height="150" class="charts" :data="data">
        <v-point
          :style="{
          stroke: '#fff',
          lineWidth: 1
        }"
          shape="smooth"
        />
        <v-line shape="line"/>
      </v-chart>
    </main>
    <footer class="footer">
      <grid :cols="3">
        <grid-item v-for="(item,index) in main" :key="index">
          <section @click="distribute(item)" class="sections">
            <img class="imgs" :src="item.icon">
            <p class="text">{{item.name}}</p>
          </section>
        </grid-item>
      </grid>
    </footer>
    <actionsheet @on-click-menu="search" theme="android" :menus="menu.data" v-model="menu.show"></actionsheet>
  </div>
</template>

<script>
import {
  Flexbox,
  FlexboxItem,
  VChart,
  VLine,
  VPoint,
  VScale,
  Grid,
  GridItem,
  Actionsheet,
  Card
} from "vux";
import people from "@/static/images/hourse/people.png";
import join from "@/static/images/hourse/join.png";
import hoursepito from "@/static/images/hourse/hoursepito.png";
import date from "@/static/images/hourse/date.png";
import status from "@/static/images/hourse/status.png";
import peading from "@/static/images/hourse/peading.png";
import headerGroup from "./user-center/public/header.vue";
import { CurrentLoginInformations } from "@/services/hourse-face.js";
export default {
  components: {
    Flexbox,
    FlexboxItem,
    VChart,
    VPoint,
    VLine,
    VScale,
    Grid,
    GridItem,
    headerGroup,
    Actionsheet,
    Card
  },
  data() {
    return {
      title: "双井恭合苑",
      list: [
        {
          value: "300",
          attr: "在住人数"
        },
        {
          value: "445",
          attr: "总床位数"
        },
        {
          value: "54",
          attr: "降级人数"
        },
        {
          value: "95.62%",
          attr: "入住率"
        }
      ],
      data: [
        { time: "1", tem: 10 },
        { time: "2", tem: 22 },
        { time: "3", tem: 20 },
        { time: "4", tem: 26 },
        { time: "5", tem: 20 },
        { time: "6", tem: 26 },
        { time: "7", tem: 28 },
        { time: "8", tem: 20 },
        { time: "9", tem: 18 }
      ],
      main: [
        {
          icon: people,
          name: "住户中心",
          path: "/admin/userList"
        },
        {
          icon: join,
          name: "床态",
          path: ""
        },
        {
          icon: hoursepito,
          name: "社工中心",
          path: ""
        },
        {
          icon: date,
          name: "日历",
          path: ""
        },
        {
          icon: status,
          name: "驾驶舱",
          path: ""
        },
        {
          icon: peading,
          name: "院内代办",
          path: ""
        }
      ],
      menu: {
        show: false,
        data: []
      }
    };
  },
  created() {
    //menu info
    this.getMenu();
  },
  methods: {
    distribute(info) {
      if (info.path) {
        this.$router.push({ path: info.path });
      }
    },
    $sure(status) {
      this.menu.show = status;
    },
    search(d, params) {
      console.log(params);
      //切换title
      this.title = params.label;
      localStorage.setItem("hourse-tenantId", params.id);
    },
    //getMenuy
    getMenu() {
      CurrentLoginInformations().then(res => {
        //不要营销中心
        this.menu.data = res.result.myTenants.filter(o => {
          if (o.name != "营销中心") {
            //vux 只要label
            o.label = o.name;
            return o;
          }
        });
        //默认id
        localStorage.setItem("hourse-tenantId", res.result.tenant.id);
      });
    }
  },
  computed: {
    span() {
      return 12 / this.list.length;
    }
  }
};
</script>

<style lang='less' scoped>
@them: #1c76dc;
@font: #777474;
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
.wraps {
  .slot-header {
    height: 30px;
    background: @them;
  }
  background: white;
  .header {
    .rem(margin-top, 150);
    .sections {
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      .rem(margin-top, 30);
      .rem(margin-bottom, 30);
      .num {
        color: @them;
        font-size: 1.4em;
      }
      .text {
        color: @font;
        .rem(margin-top, 30);
      }
    }
  }
  .main {
    .rem(margin-top, 30);
    .rem(margin-bottom, 30);
  }
  .footer {
    .sections {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .imgs {
        .rem(height, 50);
        .rem(width, 60);
      }
      .text {
        color: @font;
        .rem(margin-top, 40);
        font-size: 1.1em;
      }
    }
  }
}
</style>
