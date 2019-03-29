<template>
  <div class="communicationList">
    <HeaderYc @close="$router.go(-1)" text="沟通记录">
      <div @click="complete()">保存</div>
    </HeaderYc>
    <div class="content">
      <!--<group label-margin-right="1em">-->
      <!--<cell value-align="left" :value="name_organization"></cell>-->
      <!--</group>-->
      <h3 style="padding-left: 35px;padding-top: 10px;
      color: rgb(40, 40, 40);
      background: #fff;
      padding-bottom: 10px;">{{name_organization}}</h3>
      <group label-width="100px" label-margin-right="1em">
        <datetime :end-date="communication_data.Date.value" :title="`*${communication_data.Date.name}`"
                  :ref="communication_data.Date.key"
                  v-model="communication_data.Date.value" value-text-align="left"></datetime>
        <popup-picker :title="`*${communication_data.Organization.name}`" :ref="communication_data.Organization.key"
                      v-model="communication_data.Organization.value"
                      :data="communication_data.Organization.select_option" value-text-align="left"></popup-picker>
        <popup-picker :data="communication_data.Probability.select_option"
                      :title="`*${communication_data.Probability.name}`" :ref="communication_data.Probability.key"
                      v-model="communication_data.Probability.value" value-text-align="left"></popup-picker>
        <popup-picker :title="`*${communication_data.EventType.name}`"
                      :data="communication_data.EventType.select_option"
                      :ref="communication_data.EventType.key"
                      v-model="communication_data.EventType.value" value-text-align="left"></popup-picker>
        <datetime :start-date="communication_data.Date.value" :title="`${communication_data.NextDate.name}`"
                  :ref="communication_data.NextDate.key"
                  v-model="communication_data.NextDate.value" value-text-align="left"></datetime>
        <x-input :title="`*${communication_data.Memo.name}`" :ref="communication_data.Memo.key" type="text" required
                 placeholder="请输入" v-model="communication_data.Memo.value"></x-input>
      </group>
    </div>

  </div>
</template>

<script>
  import {Cell, Datetime, Group, Picker, PopupPicker, XInput} from 'vux';
  import HeaderYc from '../headers.vue'
  import dictQueryMixins from '../../crm-mixins/dictQueryMixins.vue'

  export default {
    name: "communicationList",
    props: {
      communication_data: {
        type: Object,
        default: {}
      }
    },
    mixins: [dictQueryMixins],
    components: {
      Group,
      Cell,
      XInput,
      PopupPicker,
      Datetime,
      Picker,
      HeaderYc
    },
    data() {
      return {
        value: "2018-02-02",
        arr: [],
        name_organization: ""
      }
    },
    mounted() {
      let query = this.$route.query;
      this.name_organization = `${query.name||''}   (${query.degree||''})`;
    },
    methods: {
      complete() {
        let sure = this.verify([this.communication_data], ["NextDate"], this.$refs);
        if (sure) {
          this.$emit('complete', true);
        }
      }
    },
  }

</script>

<style lang="less" scoped>
  .communicationList {
    .content {
    }
  }

</style>
<style lang="less">
  .communicationList {
    .weui-cells{
      margin-top: 10px;
    }
  }
</style>
