<template>
  <div class="addUser demo-list-box">
    <add-user-list @submit="submit"></add-user-list>
  </div>
</template>
<script>
  import addUserList from '../components/add-user/addUserList.vue';
  // import headerYc from "../header/headers.vue";
  import {constants} from 'fs';
  import dictQueryMixins from '../crm-mixins/dictQueryMixins.vue'
  import {CrmContactSave, CRMDegreeDictQuery, CRMInfoSourceDictQuery} from '../../../services/sys.js'
  import store from '../../../store/modules/crm/addUser';
  import {mapMutations, mapState} from 'vuex';

  export default {
    name: "addUser",
    store,
    components: {
      addUserList,
    },
    mixins: [dictQueryMixins],
    data() {
      return {
        // user_data:{
        //     name:{
        //         value:"",
        //         name:"客户姓名",
        //         key:'name',
        //     },
        //     PhoneNumber:{
        //         value:"",
        //         name:"联系电话",
        //         key:'PhoneNumber',
        //     },
        //     age:{
        //         value:"",
        //         name:"年龄",
        //         key:'age',
        //     },
        //     InfoSource:{
        //         value:[],
        //         name:"信息渠道",
        //         key:'InfoSource',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     Degree:{
        //         value:[],
        //         name:"意向程度",
        //         key:'Degree',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     creationTime:{
        //         value:getNowFormatDate(new Date),
        //         name:"登记日期",
        //         key:'creationTime',
        //     },
        //     Organization:{
        //         value:[],
        //         name:"意向机构",
        //         key:'Organization',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     ContactInfo:{
        //         value:[],
        //         name:"沟通方式",
        //         key:'ContactInfo',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     nextDate:{
        //         value:"",
        //         name:"下次跟进日期",
        //         key:'nextDate',
        //     },
        //     memo:{
        //         value:"",
        //         name:"沟通描述",
        //         key:'memo',
        //     },
        // },
        // old_man_data:{
        //     Relation:{
        //         value:[],
        //         name:"与客户关系",
        //         key:'old_man_Relation',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     Name:{
        //         value:"",
        //         name:"老人姓名",
        //         key:'old_man_name'
        //     },
        //     age:{
        //         value:"",
        //         name:"老人年龄",
        //         key:'old_man_age'
        //     },
        //     LivingSituation:{
        //         value:[],
        //         name:"目前居住情况",
        //         key:'old_man_LivingSituation',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     LifeState:{
        //         value:[],
        //         name:"生活状态",
        //         key:'old_man_LifeState',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     BodyState:{
        //         value:[],
        //         name:"身体状况",
        //         key:'old_man_BodyState',
        //         select_option:[],
        //         option_val:[]
        //     },
        //     ConsiderReason:{
        //         value:'',
        //         name:"优先考虑因素",
        //         key:'old_man_ConsiderReason',
        //         select_option:[],
        //         option_val:[]
        //     }
        // }
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      ...mapState([
        "user_data",
        "old_man_data",
      ])
    },
    created() {
      this.mResState();
    },
    methods: {
      ...mapMutations(['CHANGE_OLD_DATA', 'CHANGE_USER_DATA__MORE', 'CHANGE_USER_DATA', "mResState"]),
      init() {
        //老人 select
        let old_man = ['LivingSituation', 'LifeState', 'BodyState'];
        old_man.forEach(v => {
          this.dictQuery(1, v, {}).then(res => {
            this.CHANGE_OLD_DATA({key: v, res});
          })
        });
        this.dictQuery(1, 'ContactRelation', {}).then(res => {
          this.CHANGE_OLD_DATA({key: 'Relation', res});
        })
        // this.dictQuery(1,'IntentionDegree',{}).then(res=>{
        //   this.CHANGE_USER_DATA({key:'Degree',res});
        // })
        CRMDegreeDictQuery({type: "IntentionDegree"}).then(res => {
          let select_option = [];
          let option_val = [];
          let result = res.data.result.items;
          if (Array.isArray(result) && result.length > 0) {
            result.forEach(value => {
              select_option.push(value.valText);
              option_val.push({value: value.valText, id: value.keyCode})
            });
            this.CHANGE_USER_DATA({key: 'Degree', res: {select_option: select_option, option_val: option_val}});
          }
        })

        this.dictQuery(1, 'CommunicateMode', {}).then(res => {
          this.CHANGE_USER_DATA({key: 'ContactInfo', res});
        })
        this.dictQuery(1, 'ConsiderReason', {}).then(res => {
          this.CHANGE_OLD_DATA({key: 'ConsiderReason', res});
        })
        this.dictQuery(3, 'Organization', {}).then(res => {
          this.CHANGE_USER_DATA({key: 'Organization', res});
        });
        // //信息渠道 数据需要三级联动特殊处理
        // this.dictQuery(2,'InfoChannel',{}).then(res=>{
        //   this.CHANGE_USER_DATA__MORE({key:'InfoSource',res});
        // })
        CRMInfoSourceDictQuery({type: 'InfoChannel'}).then(res => {
          console.log(res, '2222');
          let msg_data = this.handle_data(res.data.result);
          this.CHANGE_USER_DATA__MORE({key:'InfoSource',res:msg_data});
        })


        // let old_man = ['LivingSituation','LifeState','Relation','BodyState']
        // this.dictQuery(1,'LivingSituation',{}).then(res=>{
        //   this.CHANGE_OLD_DATA({key:'LivingSituation',res});
        // })
        // this.dictQuery(1,'LifeState',{}).then(res=>{
        //   this.CHANGE_OLD_DATA({key:'LifeState',res});
        // });
        // this.dictQuery(1,'Relation',{}).then(res=>{
        //   this.CHANGE_OLD_DATA({key:'LifeState',res});
        // });
        // this.dictQuery(1,'LifeState',{}).then(res=>{
        //   this.CHANGE_OLD_DATA({key:'LifeState',res});
        // });
        // this.dictQuery(1,'LifeState',{}).then(res=>{
        //   this.CHANGE_OLD_DATA({key:'LifeState',res});
        // });
        // this.dictQuery(1,'LivingSituation',this.old_man_data.LivingSituation); //目前居住情况
        // this.dictQuery(1,'LifeState',this.old_man_data.LifeState); //生活状态
        // this.dictQuery(1,'Relation',this.old_man_data.Relation); //与客户关系
        // this.dictQuery(1,'BodyState',this.old_man_data.BodyState);//身体状况
        // // 上面是老人那块    下面是客户和沟通的信息
        // this.dictQuery(1,'IntentionDegree',this.user_data.Degree);//意向程度
        // this.dictQuery(3,'Organization',this.user_data.Organization);//意向机构
        // this.dictQuery(1, 'CommunicateMode', this.user_data.ContactInfo);//沟通方式
        // //信息渠道 数据需要三级联动特殊处理
        // this.dictQuery(2,'InfoChannel',this.user_data.InfoSource);//信息渠道
        // //多选
        // this.dictQuery(1,'ConsiderReason',this.old_man_data.ConsiderReason);//优先考虑因素
      },
      // handle_data(data){
      //     let arr = [];
      //     data.items.forEach(v=>{
      //         if(v.parentKeyCode=="InfoChannel"){
      //             arr.push({parent:0,name:v.valText,value:v.valText,id:v.id});
      //         }else{
      //             arr.push({parent:v.parentKeyCode,name:v.valText,value:v.valText,id:v.id});
      //         }
      //     });
      //     return arr;
      // },
      submit() {
        let obj = this.processing_data(this.user_data);
        let old_obj = this.processing_data(this.old_man_data);
        let InfoSource = obj.InfoSource.split(',');
        old_obj.gender = old_obj.gender == '男' ? 1 : 2;
        old_obj.ConsiderReason = old_obj.ConsiderReason.split(',').join('^');
        obj.gender = obj.gender == '男' ? 1 : 2;
        obj.hasEnteredOtherOrg = false;
        obj.InfoSource = `${InfoSource[0] ? InfoSource[0] : ''}-${InfoSource[1] ? InfoSource[1] : ''}:${InfoSource[2] ? InfoSource[2] : ''}`;
        obj.CustomerSource = 'app';
        obj.CrmCustomers = [old_obj];
        console.log(obj);
        CrmContactSave(obj).then(res => {
          if (res.data.result === true) {
            let vue = this;
            this.$vux.alert.show({
              title: '操作提示',
              content: '新增成功',
              onHide() {
                vue.$router.go(-1);
              }
            })
          } else {
            this.$vux.alert.show({
              title: '操作提示',
              content: '新增失败请重新添加',
              onHide() {
                vue.$router.go(-1);
              }
            })
          }
        });
      }
    }

  }
</script>
<style lang="less" scoped>
  .addUser {
    height: 100vh;
    background: #fff;
  }

  .demo-list-box {
    background-color: #fff;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

</style>

