<template>
    <div class="popup">
        <!--<x-header @on-click-back="back" :left-options="{backText: '',preventGoBack:true}">{{text}}-->
            <!--<div slot="right" @click="complete">{{right_text}}</div>-->
        <!--</x-header>-->
        <HeaderLc text="优先考虑因素" @close="$emit('update:show', false)">
          <div @click="complete">完成</div>
        </HeaderLc>
        <ul v-if="data.length>0"  class="content_ul">
          <li>
            <label @click="" :key="i" v-for="(v,i) in data">
              <input :value="v.id" v-model="checked_data" type="checkbox">
              <span>{{v.value}}</span>
            </label>
          </li>
        </ul>
        <div style="text-align: center;font-size: 20px;padding-top: 20px;" v-else>
          暂无数据
        </div>
    </div>
</template>
<script>
// import {XHeader} from 'vux';
import HeaderLc from '../headers.vue'
export default {
    props:{
        text:{
            default:"",
            type:String
        },
        right_text:{
            default:"",
            type:String
        },
        data:{
            default:[],
            type:Array
        }
    },
    name:"popup",
    components: {
      HeaderLc,
    },
    data(){
        return{
            checked_data:[]
        }
    },
    methods:{
        back(){
            this.$emit('update:show', false);
        },
        complete(){
            this.$emit('right_click',this.checked_data);
        }
    }
}
</script>
<style lang="less" scoped>
    .popup{
        /*position: absolute;*/
        /*width: 100%;*/
        /*top: 0;*/
        height: 100%;
        .content_ul{
            label{
                height: 45px;
                line-height: 45px;
                display: flex;
                align-items: center;
                border-bottom:1px solid #ccc;
                span{
                    font-size: 15px;
                }
                input{
                    margin: 0 12px;
                    width: 22px;
                    height: 22px;
                }
            }
        }
    }
</style>

