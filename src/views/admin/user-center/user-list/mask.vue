<template>
  <!-------------------楼层------------------->
  <section class="section" style="width:280px;">
    <div class="title">
      <div class="title-group">
        <group>
          <cell
            @click.native="formData.floorShow = !formData.floorShow"
            :arrow-direction="formData.floorShow ? 'up' : 'down'"
            is-link
            title="楼层"
          ></cell>
        </group>
      </div>
      <checker
        v-show="formData.floorShow"
        class="checker-parent"
        selected-item-class="checkout"
        default-item-class="check-item"
        v-model="formData.floorValue"
      >
        <checker-item :key="index" v-for="(item,index) in floor" :value="item.key">{{item.value}}</checker-item>
      </checker>
    </div>
    <!----------------用户状态------------------>
    <div>
      <div class="title-group">
        <group>
          <cell
            @click.native="formData.userShow = !formData.userShow"
            :arrow-direction="formData.userShow ? 'up' : 'down'"
            is-link
            title="住户状态"
          ></cell>
        </group>
      </div>
      <checker
        v-show="formData.userShow"
        class="checker-parent"
        selected-item-class="checkout"
        default-item-class="check-item"
        v-model="formData.userValue"
      >
        <checker-item
          :key="index"
          v-for="(item,index) in userStatus"
          :value="item.key"
        >{{item.value}}</checker-item>
      </checker>
    </div>
    <!-----------------能力等级----------------->
    <div>
      <div class="title-group">
        <group>
          <cell
            @click.native="formData.abilityShow = !formData.abilityShow"
            :arrow-direction="formData.abilityShow ? 'up' : 'down'"
            is-link
            title="能力等级"
          ></cell>
        </group>
      </div>
      <checker
        v-show="formData.abilityShow"
        class="checker-parent"
        selected-item-class="checkout"
        default-item-class="check-item"
        v-model="formData.abilityVlaue"
        type="checkbox"
        :max="2"
      >
        <checker-item :key="index" v-for="(item,index) in ability" :value="item.key">{{item.value}}</checker-item>
      </checker>
    </div>
    <!------------按钮------------>
    <div class="btn">
      <div>
        <x-button class="btn-wid" mini @click.native="reset" :gradients="['#1c76dc', '#1c76dc']">重置</x-button>
      </div>
      <div>
        <x-button
          class="btn-wid"
          mini
          @click.native="confirm"
          :gradients="['#1c76dc', '#1c76dc']"
        >确认</x-button>
      </div>
    </div>
  </section>
</template>

<script>
import { Checker, CheckerItem, Cell, Group, XButton } from "vux";
export default {
  components: {
    Checker,
    CheckerItem,
    Cell,
    Group,
    XButton
  },
  data() {
    return {
      formData: {
        abilityShow: true,
        abilityVlaue: [1],
        userShow: true,
        userValue: 1,
        floorShow: true,
        floorValue: 1
      },
      floor: [],
      userStatus: [
        {
          key: 1,
          value: "申请"
        },
        {
          key: 2,
          value: "预约"
        },
        {
          key: 3,
          value: "在住"
        },
        {
          key: 4,
          value: "退住"
        },
        {
          key: 5,
          value: "临时离院"
        }
      ],
      ability: [
        {
          key: 1,
          value: "能力完好"
        },
        {
          key: 2,
          value: "轻度失能"
        },
        {
          key: 3,
          value: "中度失能A"
        },
        {
          key: 4,
          value: "中度失能B"
        },
        {
          key: 5,
          value: "重度失能A"
        },
        {
          key: 6,
          value: "重度失能B"
        }
      ]
    };
  },
  created() {
    //----------模拟数据floor
    for (let i = 0; i < 11; i++) {
      this.floor.push({
        key: i + 1,
        value: i < 9 ? `0${i + 1}` : i + 1
      });
    }
  },
  methods: {
    reset() {
      //----------重置数据
      this.formData.abilityVlaue = [1];
      this.formData.userValue = 1;
      this.formData.floorValue = 1;
      this.$vux.toast.text("重置完毕", "bottom");
    },
    confirm() {
      this.$emit("on-sub", {
        floor: this.formData.floorValue,
        userValue: this.formData.userValue,
        abilityVlaue: this.formData.abilityVlaue,
        close: false
      });
    }
  }
};
</script>

<style scoped lang='less'>
@them: #1c76dc;
.rem(@name,@px) {
  @{name}: unit(@px / 75, rem);
}
.section {
  background: #fff;
  margin-top: 80px;
  .checker-parent {
    display: flex;
    flex-wrap: wrap;
    .check-item {
      width: 30%;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #ccc;
      background-color: #fff;
      margin: 6px 0px 6px 6px;
    }
    .checkout {
      background: @them;
      color: white;
    }
  }
  .btn {
    .rem(margin-top, 60);
    display: flex;
    justify-content: space-around;
    align-items: center;
    .rem(margin-bottom, 80);
    .btn-wid {
      .rem(height, 65);
    }
    //  display: flex;
    //  justify-content: flex-end;
  }
}
</style>
