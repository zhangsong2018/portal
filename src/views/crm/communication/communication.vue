<template>
    <div class="communication demo-list-box">
      <communication-list @complete="complete" :communication_data="communication_data"></communication-list>
    </div>
</template>

<script>
    import CommunicationList from "../components/communication/communicationList.vue";
    import {getNowFormatDate} from "../../../assets/js/utils.js";
    import dictQueryMixins from  '../crm-mixins/dictQueryMixins.vue'
    import {omsCrmCustomerCommunication} from '../../../services/sys';
    export default {
      name: "communication",
      components:{
        CommunicationList
      },
      mixins:[dictQueryMixins],
      data(){
        return{
          communication_data:{
            Date:{
              value:getNowFormatDate(new Date),
              name:"沟通日期",
              key:'Date',
            },
            Organization:{
              value:[],
              name:"意向机构",
              key:'Organization',
              select_option:[],
              option_val:[]
            },
            Probability:{
              value:['30%'],
              name:"成交率",
              key:'Probability',
              select_option:[['30%','60%','90%']],
              option_val:[{value:'30%',id:'30'},{value:'60%',id:'60'},{value:'90%',id:'90'}]
            },
            EventType:{
              value:[],
              name:"沟通方式",
              key:'EventType',
              select_option:[],
              option_val:[]
            },
            NextDate:{
              value:"",
              name:"下次跟进日期",
              key:'NextDate',
            },
            Memo:{
              value:"",
              name:"沟通信息",
              key:'Memo',
            },
          }
          }
      },
      mounted(){
          this.init();
          this.communication_data.Organization.value = [this.$route.query.organization] || [];
      },
      methods:{
        init(){
          this.dictQuery(3,'Organization',this.communication_data.Organization);//意向机构
          this.dictQuery(1,'CommunicateMode',this.communication_data.EventType);//沟通方式
        },
        complete(sure){
          console.log(this.communication_data);
          if(sure){
            let obj = this.processing_data(this.communication_data);
            console.log(obj);
            obj.CrmContactId = this.$route.query.id;
            omsCrmCustomerCommunication(obj).then(res=>{
              console.log(res);
              if(res.data.result){
                let vue = this;
                this.$vux.alert.show({
                  title: '操作提示',
                  content: '新增成功',
                  onHide () {
                    vue.$router.go(-1);
                  }
                })
              }else{
                this.$vux.alert.show({
                  title: '操作提示',
                  content: '新增失败请重新添加',
                  onHide () {
                    vue.$router.go(-1);
                  }
                })
              }
            })
          }
        },
        handle_data(){

        },
      }
    }
</script>

<style scoped lang="less">
  .communication{
    height: 100vh;
    background: #f4f4f4;
  }
  .demo-list-box {
    background-color: #fff;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
