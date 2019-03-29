<template>
  <div class="addUserList">
    <!--<header-yc  text="新增客户" @complete="complete" back_text="" right_text="保存"></header-yc>-->
    <div v-show="!popup_show">
      <div class="headerbar"></div>
      <header class="header">
        <div class="close" @click="$router.go(-1)">
          <div class="close_pic">
            <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
          </div>
        </div>
        <div class="title">
          <span>新增客户</span>
        </div>
        <div class="icon" @click="complete()">
          保存
        </div>
      </header>
    </div>

    <div v-show="!popup_show" class="content">
      <div class="gropTitle">
        <span>客户信息</span>
      </div>
      <group class="group" label-width="100px" label-margin-right="1em">
        <x-input :title="`*${user_data.name.name}`" :ref="user_data.name.key" required placeholder="请输入"
                 v-model="user_data.name.value"></x-input>
        <x-input :title="`*${user_data.PhoneNumber.name}`" :ref="user_data.PhoneNumber.key" type="tel" required
                 is-type="china-mobile" placeholder="请输入" v-model="user_data.PhoneNumber.value"></x-input>
        <x-input :title="`*${user_data.age.name}`" :is-type="age_type" required ref="age" :max='3'
                 placeholder="请输入" v-model="user_data.age.value"></x-input>
        <popup-picker :title="`*${user_data.gender.name}`" :ref="user_data.gender.key"
                      :data="user_data.gender.select_option" v-model="user_data.gender.value"
                      value-text-align="left"></popup-picker>
        <popup-picker :title="`*${user_data.InfoSource.name}`" @on-change="infoSource_change" :ref="user_data.InfoSource.key"
                      :data="user_data.InfoSource.select_option" :columns="3" v-model="user_data.InfoSource.value"
                      value-text-align="left"></popup-picker>
        <!--<cell @click.native="cascade_popup=true" :title="`*${user_data.InfoSource.name}`"-->
        <!--:ref="user_data.InfoSource.key" value-align="left" :value="user_data.InfoSource.value"-->
        <!--is-link></cell>-->
        <popup-picker :title="`*${user_data.Degree.name}`" :ref="user_data.Degree.key"
                      :data="user_data.Degree.select_option" v-model="user_data.Degree.value"
                      value-text-align="left"></popup-picker>
        <datetime :title="`*${user_data.creationTime.name}`" :end-date="user_data.creationTime.value"
                  :ref="user_data.creationTime.key"
                  :data="user_data.creationTime.select_option" v-model="user_data.creationTime.value"
                  value-text-align="left"></datetime>
      </group>
      <div class="gropTitle">
        <span>沟通信息</span>
      </div>



      <group class="group" label-width="100px" label-margin-right="1em">
        <popup-picker :title="`*${user_data.Organization.name}`" :ref="user_data.Organization.key"
                      :data="user_data.Organization.select_option" v-model="user_data.Organization.value"
                      value-text-align="left"></popup-picker>
        <popup-picker :title="`*${user_data.ContactInfo.name}`" :ref="user_data.ContactInfo.key"
                      :data="user_data.ContactInfo.select_option" v-model="user_data.ContactInfo.value"
                      value-text-align="left"></popup-picker>
        <popup-picker :title="`*${user_data.Probability.name}`" :ref="user_data.Probability.key"
                      :data="user_data.Probability.select_option" v-model="user_data.Probability.value"
                      value-text-align="left"></popup-picker>
        <datetime :title="`${user_data.nextDate.name}`" :start-date="user_data.creationTime.value"
                  :ref="user_data.nextDate.key" v-model="user_data.nextDate.value"
                  value-text-align="left"></datetime>
        <x-input :title="`*${user_data.memo.name}`" :ref="user_data.memo.key" :show-clear="true"
                 placeholder="请输入" v-model="user_data.memo.value"></x-input>
      </group>


      <div class="gropTitle">
        <span>老人信息</span>
      </div>


      <group class="group" label-width="100px" label-margin-right="1em">
        <popup-picker @on-change="relation_change" :title="`*${old_man_data.Relation.name}`"
                      :ref="old_man_data.Relation.key"
                      :data="old_man_data.Relation.select_option" v-model="old_man_data.Relation.value"
                      value-text-align="left"></popup-picker>
        <x-input :title="`*${old_man_data.Name.name}`" required :ref="old_man_data.Name.key" type="text"
                 :show-clear="true" placeholder="请输入" v-model="old_man_data.Name.value"></x-input>
        <x-input :title="`*${old_man_data.age.name}`" required ref="old_age" :is-type="old_age_type" :max='3'
                 :show-clear="true" placeholder="请输入" v-model="old_man_data.age.value"></x-input>
        <popup-picker :title="`*${old_man_data.gender.name}`" :ref="old_man_data.gender.key"
                      :data="old_man_data.gender.select_option" v-model="old_man_data.gender.value"
                      value-text-align="left"></popup-picker>
        <popup-picker :title="`*${old_man_data.LivingSituation.name}`" :ref="old_man_data.LivingSituation.key"
                      :data="old_man_data.LivingSituation.select_option" v-model="old_man_data.LivingSituation.value"
                      value-text-align="left"></popup-picker>
        <popup-picker :title="`*${old_man_data.LifeState.name}`" :ref="old_man_data.LifeState.key"
                      :data="old_man_data.LifeState.select_option" v-model="old_man_data.LifeState.value"
                      value-text-align="left"></popup-picker>
        <popup-picker :title="`*${old_man_data.BodyState.name}`" :ref="old_man_data.BodyState.key"
                      :data="old_man_data.BodyState.select_option" v-model="old_man_data.BodyState.value"
                      value-text-align="left"></popup-picker>
        <cell @click.native="popup_show=true" :title="`*${old_man_data.ConsiderReason.name}`"
              :ref="old_man_data.ConsiderReason.key" value-align="left" :value="old_man_data.ConsiderReason.value"
              is-link></cell>
      </group>


    </div>



    <div class="popup">
      <popup-yg v-show="popup_show" :show.sync="popup_show" text="优先考虑因素" right_text="完成" :data="popupYg_data"
                @right_click="popup_click"></popup-yg>
    </div>



    <!--<div class="cascade">-->
    <!--<popup-vant position="bottom" :overlay="true" v-model="cascade_popup">-->
    <!--<picker-vant title="" show-toolbar @cancel="cascade_popup=false" @confirm="cascade_click" :columns="user_data.InfoSource.select_option"-->
    <!--confirm-button-text='完成' @change="onChange"></picker-vant>-->
    <!--</popup-vant>-->
    <!--</div>-->
  </div>
</template>
<script>
  import {Cell, Datetime, Group, Picker, PopupPicker, XInput} from 'vux';
  import headerYc from "../headers.vue";
  import popupYg from "./popup.vue"
  import dictQueryMixins from '../../crm-mixins/dictQueryMixins.vue'
  import store from '../../../../store/modules/crm/addUser';
  import {mapMutations, mapState} from 'vuex';
  // import PickerVant from 'vant/lib/picker';
  // import 'vant/lib/picker/style';
  // import PopupVant from 'vant/lib/popup';
  // import 'vant/lib/popup/style';

  // const citys = {
  //   '福建': {
  //     children: {
  //       '福州': {children: ['1', '2', '3']},
  //       '厦门': {children: ['4', '5', '6']},
  //       '莆田': {children: ['7', '8', '9']},
  //       '三明': {children: ['10', '11', '12']},
  //       '泉州': {children: []}
  //     },
  //   },
  // }
  export default {
    store,
    name: "addUserList",
    mixins: [dictQueryMixins],
    props: {
      // user_data: {
      //   default: {},
      //   type: Object,
      // },
      // old_man_data: {
      //   default: {},
      //   type: Object,
      // }
    },
    components: {
      Group,
      Cell,
      XInput,
      PopupPicker,
      Datetime,
      popupYg,
      Picker,
      headerYc,
      // PickerVant,
      // PopupVant
    },
    data() {
      return {
        // cascade_popup: false,
        popup_show: false,
        infoSource_sure:true,
        age_type: function (value) {
          return {
            valid: /^[0-9]*$/.test(value),
            msg: "请输入数字!"
          }
        },
        old_age_type: function (value) {
          return {
            valid: /^[0-9]*$/.test(value),
            msg: "请输入数字!"
          }
        },
        relation_val:"",
        // columns: [{
        //   values: Object.keys(citys),
        //   className: 'column1'
        // },
        //   {
        //     values: Object.keys(citys['福建'].children),
        //     className: 'column2',
        //     defaultIndex: 2
        //   },
        //   {
        //     values: Object.keys(citys['福建'].children['福州'].children),
        //     className: 'column3',
        //     defaultIndex: 2
        //   },
        // ]
      }
    },
    computed: {
      ...mapState([
        "user_data",
        "old_man_data",
      ]),
      popupYg_data() {
        return this.old_man_data.ConsiderReason.option_val;
      }
    },
    methods: {
      ...mapMutations(['OLD_DATA_VAL_CHANGE', 'SELECT_RELATION_CHANGE','SELECT_EMPTY_CHANGE','SELECT_INfOSOURCE_CHANGE']),
      popup_click(data) {
        // this.old_man_data.ConsiderReason.value = data.join(',');
        this.OLD_DATA_VAL_CHANGE(data.join(','));
        this.popup_show = false;
      },
      infoSource_change(value){
          if(this.infoSource_sure){
            let data = this.$refs.InfoSource.getNameValues(value[0]).split(' ');
            this.SELECT_INfOSOURCE_CHANGE(data);
            this.infoSource_sure = false;
            setTimeout(()=>{
              this.infoSource_sure = true;
            },300)
          }

      },
      relation_change(value) {
        if (value[0] == '本人') {
          this.SELECT_RELATION_CHANGE();
        }else{
          this.SELECT_EMPTY_CHANGE();
        };
        this.relation_val = value[0];
      },
      // onChange(picker, values) {
      //   let obj = this.user_data.InfoSource.option_val;
      //   console.log(picker, values,obj[values[0]]);
      //   picker.setColumnValues(1, Object.keys(obj[values[0]].children));
      //   if(obj[values[0]].children){
      //     picker.setColumnValues(2, obj[values[0]].children[values[1]].children);
      //   }else{
      //     let key = Object.keys(obj[values[0]].children);
      //     console.log(key,'22222223333333333333');
      //     picker.setColumnValues(2, obj[values[0]].children[key[0]].children);
      //   }
      // },
      // cascade_click(a,b){
      //   console.log(a,b)
      // },
      complete() {
        let cc = this.verifys();
        if (cc) {
          this.$emit('submit');
        }
        ;
        console.log(this.$refs)
      },
      verifys() {
        let error_arr = [];
        let sure = [...Object.keys(this.user_data), ...Object.keys(this.old_man_data)].every(val => {
          let obj = this.user_data[val] ? this.user_data[val] : this.old_man_data[val];
          if (obj.key == 'nextDate') {
            return true;    //不是必填 忽略
          }
          if (Array.isArray(obj.value)) {
            if (obj.value.length > 0) {
              return true;
            } else {
              error_arr.push(obj);
              return false;
            }
          } else {
            if (obj.value == '') {
              error_arr.push(obj);
              return false
            } else {
              return true;
            }
          }
        });
        console.log(this.$refs, error_arr)
        if (!sure) {
          let error_msg = `${error_arr[0].name}必填哦`;
          this.$vux.toast.text(error_msg, 'bottom');
        } else {
          let refs_error = [];
          Object.keys(this.$refs).forEach(val => {
            for (let ccc in this.$refs[val].errors) {
              refs_error.push(this.$refs[val]);
            }
          });
          if (refs_error.length > 0) {
            for (let ii in refs_error[0].errors) {
              let aa = refs_error[0].title[0] == '*' ? refs_error[0].title.slice(1) : refs_error[0].title;
              this.$vux.toast.text(aa + refs_error[0].errors[ii], 'bottom');
            }
            return false;
          } else {
            return true;
          }
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  .addUserList {
    /*min-height: 4000px;*/
    .gropTitle {
      padding: 12px 0 16px 0;
      font-size: 14px;
      background-color: #fff;
      span {
        padding-left: 6px;
        font-weight: 900;
        border-left: 5px solid #0076FF;
      }
    }

    .group {
      /*margin-left: 13px;*/
    }

    .headerbar {
      width: 100%;
      height: 30px;
      background: #1c76dc url(../../../../static/images/sy.png) no-repeat;
      position: fixed;
      top: 0px;
      z-index: 499
    }

    .content {
      margin-top: 90px;
    }

    .header {
      width: 100%;
      height: 50px;
      background: #1c76dc url(../../../../static/images/sy.png) no-repeat;
      background-size: cover;
      position: fixed;
      top: 30px;
      display: flex;
      z-index: 499
    }

    .title {
      flex: 6;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: 100;
      font-size: 20px;
    }

    .close {
      flex: 1.5;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }

    .close_pic {
      display: flex;
    }

    .close_pic img {
      width: 100%;
      height: 100%;
    }

    .icon {
      flex: 1.5;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
    }
  }
</style>
<style lang="less">
  .addUserList {
    .weui-input {
      font-size: 14px;
    }
    .weui-cells{
      margin-top: 0;
    }
    .weui-label {
      font-size: 14px;
    }

    .vux-datetime p {
      font-size: 14px;
    }
  }
</style>

