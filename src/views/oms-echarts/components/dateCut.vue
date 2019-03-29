<template>
    <div class="statistics-oms-date-cut vux-1px-b">
      <div>
        <span @click="prev" class="statistics-oms-date-cut-prev"><</span>
        <span class="statistics-oms-date-cut-date">{{year}}.{{month}}</span>
        <span @click="next" class="statistics-oms-date-cut-next">></span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "dateCut.vue",
        props:{
          year:{
            default:new Date().getFullYear(),
            type:[String,Number]
          },
          month:{
            default:new Date().getMonth()+1,
            type:[String,Number]
          }
        },
        data(){
          return{
            // year:2019,
            // month:3,
          }
        },
        methods:{
          prev(){
            let year = this.year;
            let month = this.month;
            if(month==1){
              month=12;
              year--;
            }else{
              month--;
            };
            this.$emit('cut-click',{year:year,month:month});
            this.$emit('update:year', year);
            this.$emit('update:month', month);
          },
          next(){
            let myDate = new Date();
            let year = this.year;
            let month = this.month;
            if(myDate.getFullYear()==year&&month>=(myDate.getMonth()+1)){
              this.$vux.toast.text('已经是最后的月份了', 'middle');
            }else{
              if(month==12){
                month=1;
                year++;
              }else{
                month++;
              };
              this.$emit('cut-click',{year:year,month:month});
              this.$emit('update:year', year);
              this.$emit('update:month',month);
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
  $height:30px;
  .statistics-oms-date-cut{
    padding-top: 15px;
    padding-bottom: 15px;
    width: 100%;
    background: #fff;
    /*border-bottom: 1px solid #3333;*/
    div{
      display: flex;
      justify-content: center;
    }
    &-prev{
      margin-right: 20px;
      text-align: center;
      background: #1c76dc;
      border-radius: 50%;
      width: 30px;
      height: $height;
      line-height: $height;
      color: #fff;
    }
    &-next{
      text-align: center;
      margin-left: 20px;
      background: #1c76dc;
      border-radius: 50%;
      width: 30px;
      height: $height;
      line-height: $height;
      color: #fff;
    }
    &-date{
      min-width: 60px;
      text-align: center;
      line-height: $height;
    }
  }
</style>
