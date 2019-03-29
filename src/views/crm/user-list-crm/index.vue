<template>
  <div id="wrap">
    <div class="headerbar"></div>
    <header class="header">
      <div class="close" @click="close()" v-if="!titleShow">
        <div class="close_pic">
          <img src="@/static/images/arrer_left.png" alt="" style="transform: scale(0.5)">
        </div>
      </div>
      <div class="close" @click="closePage()" v-if="titleShow">
        <div class="close_pic">
          <img src="@/static/images/close.png" alt="" style="transform: scale(0.4)">
        </div>
      </div>
      <div class="title">
        <input type="text" v-model="searchData" placeholder="请输入姓名或手机号" class="search">
        <icon type="search" class="iconBox"></icon>
        <span class="search_btn" @click="search()">搜索</span>
      </div>
      <div class="icon" @click="toUserAdd()">
        <img src="@/static/images/adduser.png" style="transform: scale(0.6);">
      </div>
    </header>
    <div class="filter">
      <!--v-if="personList.length>0"-->
      <p @click="showl = !showl" style="font-size: 14px;display: flex;height: 40px ">
        <span :style="{'color':pxShow?'#1c76dc':'#282828'}">排序</span>
        <img src="@/static/images/px.png" style="width: 20px;height: 18px;margin-top:10px;margin-left:3px">
      </p>
      <p @click="show1 = !show1" style="font-size: 14px;display: flex;height: 40px ">
        <span :style="{'color':optionsShow?'#1c76dc':'#282828'}">筛选</span>
        <img src="@/static/images/sx.png" style="width: 20px;height: 18px;margin-top:10px;margin-left:3px">
      </p>
    </div>
    <section class="section" >
             <!--v-show="personList.length>0"-->

      <div id="mescroll" class="mescroll_top">
        <ul id="dataList" class="data-list">
          <li class="userlist_item" v-for="item in personList" @click="toUserDetails(item)">
            <p class="username">{{item.name}}</p>
            <p class="userTantant">意向机构：{{item.organization}}</p>
            <p class="userfuwu">{{item.degree}}</p>
          </li>
        </ul>
      </div>
    </section>
    <section class="section" v-show="personList.length==0 && sectionShow">
      <div class="adduser_list">
        <img src="@/static/images/no_data.png" style="transform:translateX(-50%);margin-left: 50%;width: 120px;height: 120px;margin-top:150px;">
        <p style="text-align: center;margin-top:15px;font-size: 14px;color: #282828;">无匹配结果</p>
      </div>
      <div class="sub_btns" @click="reset()" >重置筛选项</div>
    </section>
    <!--<section class="section" v-show="personList.length==0 && !sectionShow">-->
      <!--<div class="adduser_list">-->
        <!--<img src="@/static/images/no_data.png" style="transform:translateX(-50%);margin-left: 50%;width: 120px;height: 120px;margin-top:150px;">-->
        <!--<p style="text-align: center;margin-top:15px;font-size: 14px;color: #282828;">无匹配结果</p>-->
      <!--</div>-->
    <!--</section>-->
    <toast v-model="show" type="text" :position="position" width="20em">{{conText}}</toast>
    <div v-transfer-dom>
      <popup v-model="showl">
        <popup-header
          :left-text="cancel"
          :right-text="done"
          :title="$t('请按条件排序')"
          :show-bottom-border="false"
          @on-click-left="reset()"
          @on-click-right="sortList()"></popup-header>
        <div style="width: 100%">
            <group gutter="0">
              <radio title="title" :options="option" v-model="sortVal"></radio>
            </group>
        </div>

      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="show1">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          :left-text="cancel"
          :right-text="done"
          :title="$t('请按条件筛选')"
          :show-bottom-border="false"
          @on-click-left="reset()"
          @on-click-right="fulfil()"></popup-header>
        <div style="display: flex;">
          <div style="width: 100px">
            <p class="tab_item" @click="tabMenuList(0)" :class="{'actives':numitem=='0'}">意向程度</p>
            <p class="tab_item" @click="tabMenuList(1)" :class="{'actives':numitem=='1'}">意向机构</p>
            <p class="tab_item" @click="tabMenuList(2)" :class="{'actives':numitem=='2'}">分配日期</p>
            <p class="tab_item" @click="tabMenuList(3)" :class="{'actives':numitem=='3'}">下次跟进日期</p>
            <p class="tab_item" @click="tabMenuList(4)" :class="{'actives':numitem=='4'}">登记日期</p>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll;" v-if='numitem == 0'>
            <group gutter="0">
              <radio title="title" :options="options" v-model="degreeVal"></radio>
            </group>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll" v-if='numitem == 1'>
            <group gutter="0">
              <radio title="title" :options="organizationArr" v-model="organizationval"></radio>
            </group>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll;background: #fff" v-if='numitem == 2'>
            <h3 style="line-height: 30px;margin:10px 0 10px 10px;">时间段</h3>
            <div class="center">
              <group>
                <datetime
                  v-model="distributeTime"
                  format="YYYY-MM-DD"
                  :end-date="endDistributeTime"
                  :title="$t('请选择开始时间:')"
                  @on-confirm="onConfirm"
                ></datetime>
              </group>
            </div>
            <div class="center">
              <group>
                <datetime
                  v-model="endDistributeTime"
                  format="YYYY-MM-DD"
                  :start-date="distributeTime"
                  :title="$t('请选择结束时间:')"
                  @on-confirm="onConfirm"
                ></datetime>
              </group>
            </div>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll;background: #fff" v-if='numitem == 3'>
            <h3 style="line-height: 30px;margin:10px 0 10px 10px;">时间段</h3>
            <div class="center">
              <group>
                <datetime
                  v-model="nextDate"
                  format="YYYY-MM-DD"
                  :end-date="endNextDate"
                  :title="$t('请选择开始时间:')"
                  @on-confirm="onConfirm"
                ></datetime>
              </group>
            </div>
            <div class="center">
              <group>
                <datetime
                  v-model="endNextDate"
                  format="YYYY-MM-DD"
                  :start-date="nextDate"
                  :title="$t('请选择结束时间:')"
                  @on-confirm="onConfirm"
                ></datetime>
              </group>
            </div>
          </div>
          <div style="flex:1;height: 230px;overflow-y: scroll;background: #fff" v-if='numitem == 4'>
              <h3 style="line-height: 30px;margin:10px 0 10px 10px;">时间段</h3>
              <div class="center">
                  <group>
                    <datetime
                      v-model="creationTime"
                      format="YYYY-MM-DD"
                      :end-date="dataValue"
                      :title="$t('请选择开始时间:')"
                      @on-confirm="onConfirm"
                    ></datetime>
                  </group>
                </div>
                <div class="center">
                  <group>
                    <datetime
                      v-model="endCreationTime"
                      format="YYYY-MM-DD"
                      :start-date="creationTime"
                      :title="$t('请选择结束时间:')"
                      @on-confirm="onConfirm"
                    ></datetime>
                  </group>
               </div>
          </div>


        </div>

      </popup>
    </div>
  </div>
</template>
<script>
  import { PopupHeader, Popup,Radio ,Datetime,Icon,Toast, Group, XSwitch, XButton ,TransferDomDirective as TransferDom} from 'vux'
  import MeScroll from 'mescroll.js'
  import 'mescroll.js/mescroll.min.css';
  import no_data_icon from '@/static/images/no_data.png';

  import Vue from 'vue'
  import * as sysApi from '../../../services/sys'
  export default {
    name: 'HelloWorld',
    data () {
      return {
        title: "添加用户",
        show:false,
        show2:false,
        showl:false,
        dataValue:"",
        conText:"",
        position:'default',
        sectionShow:false,
        optionsShow:false,
        pxShow:false,
        personList:[],
        searchData: '',
        list:[],
        endDate:"",
        show1:false,
        sorting:null,
        numitem:0,
        degreeVal:'全部',
        degree:'',
        sortVal:'默认排序',
        organizationval:'全部',
        organization:"",
        valueTime:'全部',
        done:'完成',
        cancel:'重置',
        creationTime:"",
        endCreationTime:"",
        distributeTime:"",
        endDistributeTime:"",
        nextDate:"",
        endNextDate:"",
        option:['默认排序','按登记时间正序','按登记时间倒序','按最近跟进时间正序','按最近跟进时间倒序'],
        options:['全部','A','B','C','D','E','F'],
        organizationArr:['全部',"双井恭和苑","双桥恭和苑" ,"恭和老年公寓","慈溪恭和苑","海口恭和苑","双桥恭和家园"],
        titleShow:false
      }
    },
    created () {
      localStorage.setItem("tenantId", '0'); // 存入一个值
      this.dataValue = this.dateFtt("yyyy-MM-dd",new Date());
    },
    directives: {
      TransferDom
    },
    components: {
      Toast,
      Group,
      XSwitch,
      XButton,
      Icon,
      PopupHeader,
      Popup,
      Radio,
      Datetime,
    },
    computed: {

    },
    mounted () {
      // 创建MeScroll对象
      this.mescroll = new MeScroll('mescroll', { // 在vue的mounted生命周期初始化mescroll,确保此处配置的id能够被找到
        // 下拉刷新的所有配置项
        down: {
          use: true, // 是否初始化下拉刷新; 默认true
          auto: true, // 是否在初始化完毕之后自动执行下拉回调callback; 默认true
          autoShowLoading: false, // 如果在初始化完毕之后自动执行下拉回调,是否显示下拉刷新进度; 默认false
          isLock: false, // 是否锁定下拉,默认false;
          isBoth: false, // 下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载;默认false,两者不可同时触发;
          callback: function (mescroll) {
            console.log('down --> callback');
            // 加载轮播数据
            // loadSwiper();
            // 下拉刷新的回调,默认重置上拉加载列表为第一页(down的auto默认true,初始化Mescroll之后会自动执行到这里,而mescroll.resetUpScroll会触发up的callback)
            mescroll.resetUpScroll()
          },
          offset:80, // 触发刷新的距离,默认80
          outOffsetRate: 0.2, // 超过指定距离范围外时,改变下拉区域高度比例;值小于1且越接近0,越往下拉高度变化越小;
          bottomOffset: 20, // 当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
          minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
          hardwareClass: 'mescroll-hardware', // 硬件加速样式;解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css
          mustToTop: false, // 是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.
          warpId: null, // 可配置下拉刷新的布局添加到指定id的div;默认不配置,默认添加到mescrollId
          warpClass: 'mescroll-downwarp', // 容器,装载布局内容,参见mescroll.css
          resetClass: 'mescroll-downwarp-reset', // 高度重置的动画,参见mescroll.css
          textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
          textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
          textLoading: '加载中 ...', // 加载中的提示文本
          htmlContent: '<p class="downwarp-progress"></p><p class="downwarp-tip"></p>', // 布局内容
          inited: function (mescroll, downwarp) {
            console.log('down --> inited')
            // 初始化完毕的回调,可缓存dom
            mescroll.downTipDom = downwarp.getElementsByClassName('downwarp-tip')[0]
            mescroll.downProgressDom = downwarp.getElementsByClassName('downwarp-progress')[0]
          },
          inOffset: function (mescroll) {
            console.log('down --> inOffset')
            // 进入指定距离offset范围内那一刻的回调
            if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textInOffset
            if (mescroll.downProgressDom) mescroll.downProgressDom.classList.remove('mescroll-rotate')
          },
          outOffset: function (mescroll) {
            console.log('down --> outOffset')
            // 下拉超过指定距离offset那一刻的回调
            if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textOutOffset
          },
          onMoving: function (mescroll, rate, downHight) {
            // 下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离offset的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
            console.log('down --> onMoving --> mescroll.optDown.offset=' + mescroll.optDown.offset + ', downHight=' + downHight + ', rate=' + rate)
            if (mescroll.downProgressDom) {
              var progress = 360 * rate
              mescroll.downProgressDom.style.webkitTransform = 'rotate(' + progress + 'deg)'
              mescroll.downProgressDom.style.transform = 'rotate(' + progress + 'deg)'
            }
          },
          beforeLoading: function (mescroll, downwarp) {
            console.log('down --> beforeLoading')
            // 准备触发下拉刷新的回调
            return false // 如果要完全自定义下拉刷新,那么return true,此时将不再执行showLoading(),callback();
          },
          showLoading: function (mescroll) {
            console.log('down --> showLoading')
            // 触发下拉刷新的回调
            if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textLoading
            if (mescroll.downProgressDom) mescroll.downProgressDom.classList.add('mescroll-rotate')
          },
          afterLoading: function (mescroll) {
            console.log('down --> afterLoading');
            // 结束下拉之前的回调. 返回延时执行结束下拉的时间,默认0ms; 常用于结束下拉之前再显示另外一小段动画,才去结束下拉的场景, 参考案例【dotJump】
            return 0
          }
        },
        // 上拉加载的所有配置项
        up: {
          use: true, // 是否初始化上拉加载; 默认true
          auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认true
          isLock: false, // 是否锁定上拉,默认false
          isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
          isBounce: true, // 是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
          callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20, // 每页数据条数
            time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
          },
          noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          offset: 100, // 离底部的距离
          toTop: {
            // 回到顶部按钮,需配置src才显示
            warpId: null, // 父布局的id; 默认添加在body中
            src: null,// 图片路径,默认null;
            html: null, // html标签内容,默认null; 如果同时设置了src,则优先取src
            offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
            warpClass: 'mescroll-totop', // 按钮样式,参见mescroll.css
            showClass: 'mescroll-fade-in', // 显示样式,参见mescroll.css
            hideClass: 'mescroll-fade-out', // 隐藏样式,参见mescroll.css
            duration: 300, // 回到顶部的动画时长,默认300ms
            supportTap: false, // 默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
            btnClick: null // 点击按钮的回调; 小提示:如果在回调里return true,将不执行回到顶部的操作.
          },
          loadFull: {
            use: false, // 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止;默认false,因为可通过调高page.size或者嵌套mescroll-bounce的div避免这个情况
            delay: 500 // 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
          },
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
            warpId: 'mescroll', // 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
            icon: no_data_icon, // 图标,默认null
            tip: '暂无相关数据~', // 提示
            btntext: '重新加载', // 按钮,默认""
            btnClick:  ()=> { // 点击按钮的回调,默认null
              // callback()
              this.mescroll.resetUpScroll();
            },
            supportTap: false // 默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
          },
          clearId: null, // 加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值; 使用vue则不能配置此项
          clearEmptyId: null, // 相当于同时设置了clearId和empty.warpId; 简化写法,默认null; 使用vue则不能配置此项
          hardwareClass: 'mescroll-hardware', // 硬件加速样式,动画更流畅,参见mescroll.css
          warpId:null, // 可配置上拉加载的布局添加到指定id的div;默认不配置,默认添加到mescrollId
          warpClass: 'mescroll-upwarp', // 容器,装载布局内容,参见mescroll.css
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata">-- 没有更多了 --</p>', // 无数据的布局
          inited: function (mescroll, upwarp) {
            console.log('up --> inited')
            // 初始化完毕的回调,可缓存dom 比如 mescroll.upProgressDom = upwarp.getElementsByClassName("upwarp-progress")[0];
          },
          showLoading: function (mescroll, upwarp) {
            console.log('up --> showLoading')
            // 上拉加载中.. mescroll.upProgressDom.style.display = "block" 不通过此方式显示,因为ios快速滑动到底部,进度条会无法及时渲染
            upwarp.innerHTML = mescroll.optUp.htmlLoading
          },
          showNoMore: function (mescroll, upwarp) {
            console.log('up --> showNoMore')
            // 无更多数据
            upwarp.innerHTML = mescroll.optUp.htmlNodata
          },
          onScroll: function (mescroll, y, isUp) { // 列表滑动监听,默认onScroll: null;
            // y为列表当前滚动条的位置
            console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
          },
          scrollbar: {
            use: typeof window.orientation === 'undefined', // 默认只在PC端自定义滚动条样式
            barClass: 'mescroll-bar'
          },
          lazyLoad: {
            use: true, // 是否开启懒加载,默认false
            attr: 'imgurl', // html标签中,存放网络图片地址的属性名: <img src='占位图' imgurl='网络图'/>
            showClass: 'mescroll-lazy-in', // 显示样式,参见mescroll.css
            delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
            offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
          }
        }
      })
    },
    methods: {
      upCallback (page,mescroll) {
         if(this.$route.params.degree == 'null' && this.$route.params.endDistributeTime == 'null' && this.$route.params.endNextDate == 'null' ){
           this.titleShow = false;
         }else{
           this.titleShow = true;
         }
         if(this.$route.params.degree == 'null'){
           if(this.degreeVal == "全部"){
             this.degree = null;
           }else{
             this.degree = this.degreeVal;
           }
         }else{
            this.degree = this.$route.params.degree;
            if(this.degreeVal != "全部"){
               this.degree = this.degreeVal;
            }
         }
        if(this.organizationval == "全部"){
          this.organization = null;
        }else{
          this.organization = this.organizationval;
        }
        if(this.$route.params.nextDate !='null'){
          this.nextDate = this.$route.params.nextDate
        }
         if(this.$route.params.endNextDate !='null'){
           this.endNextDate = this.$route.params.endNextDate
         }
         if(this.$route.params.sorting !='null'){
           this.sorting = this.$route.params.sorting;
         }
         if(this.$route.params.endDistributeTime != 'null'){
           this.endDistributeTime = this.$route.params.endDistributeTime
         }
         //crm 列表接口
         sysApi.CrmContactQuery({
              name:this.searchData,
              creationTime:this.creationTime,
              endCreationTime:this.endCreationTime,
              nextDate:this.nextDate,
              endNextDate:this.endNextDate,
              permission:"",
              degree:this.degree,
              distributeTime:this.distributeTime,
              endDistributeTime:this.endDistributeTime,
              role:"",
              organization:this.organization,
              sorting:this.sorting,
              isRemindCycle: this.$route.params.isRemindCycle,
              operationUserId:this.$route.params.operationUserId,
              skipCount:(page.num-1)*page.size,// 是 int 跳过计数
              maxResultCount:page.size,

         })
          .then(res => {
            if(res.success){
              if (page.num === 1) this.personList = [];
              this.showl = false;
              this.show1 = false;
              this.personList = this.personList.concat(res.result.items);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                 this.mescroll.endSuccess(res.result.items.length)
              })
            }
          }) .catch((error) => {
             this.show2 = false;
             this.$vux.toast.text('请求失败，接口异常', 'center');
          })
      },
      sortList(){  //排序函数
          if(this.sortVal == '按登记时间正序'){
              this.sorting = 'creationTime asc';
              this.pxShow = true;
          }else if(this.sortVal == '按登记时间倒序'){
              this.sorting = 'creationTime desc';
              this.pxShow = true;
          }else if(this.sortVal == '按最近跟进时间正序'){
              this.sorting = 'communicationCreationTime asc';
              this.pxShow = true;
          }else if(this.sortVal == '按最近跟进时间倒序'){
              this.sorting = 'communicationCreationTime desc';
              this.pxShow = true;
          }else{
              this.sorting = null;
              this.pxShow = false;
          }
          //排序触发回调
          this.mescroll.options.up.callback({
            num: 1,
            size: 20,
            time: null
          })
      },
      search(){
          this.sectionShow = false;
          //搜索触发回调
          this.mescroll.options.up.callback({
              num: 1,
              size: 20,
              time: null
          })
      },
      reset(){ //重置所有
        this.show1 = false;
        this.value = '全部';
        this.valuenum = '全部';
        this.sortVal = '默认排序';
        this.optionsShow = false;
        this.pxShow = false;
        this.searchData = '';
        this.creationTime = '';
        this.endCreationTime = '';
        this.nextDate = '';
        this.endNextDate = '';
        this.degreeVal = '全部';
        this.organizationval = '全部';
        this.distributeTime = '',
        this.endDistributeTime = '',
        this.sorting = '';
        this.mescroll.options.up.callback({
          num: 1,
          size: 20,
          time: null
        })
      },
      fulfil(){ //完成
        this.optionsShow = true;
        this.sectionShow  = true;
        //筛选触发回调
        this.mescroll.options.up.callback({
          num: 1,
          size: 20,
          time: null
        })
      },
      close(){ //返回前一页
        this.$router.push({
          path: 'index',
          name: 'index',
        })
      },
      toUserAdd(){  // 去新增页
        this.$router.push({
          path: '/crm/AddUserCrm',
          name: 'AddUserCrm',
        })
      },
      toUserDetails(item){ //去列表详情页
        this.$router.push({
          path: '/crm/UserDetail',
          name: 'UserDetail',
          params: {
            id: item.id,
          }
        })
      },
      tabMenuList(item){
        this.numitem = item;
      },
      onConfirm(){

      },
      dateFtt(fmt,date){
        var o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate(),                    //日
          "h+" : date.getHours(),                   //小时
          "m+" : date.getMinutes(),                 //分
          "s+" : date.getSeconds(),                 //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
      },
      closePage(){
        // 和安卓交互 关闭当前页  异步
        dsBridge.call("testAsyn", "testAsyn", function(v) {
          alert("你好世界");
        });
      }


    },
    watch:{
      $route:{
        handler: function(val, oldVal){
          console.log(val);
        },
        // 深度观察监听
        deep: true
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .popupbox{
    width: 100%;
  }
  html,body{
    width:100%;
    height: 100%;
  }
  #wrap{
    width:100%;
    min-height: 100%;
    background: #f4f4f4;
    display: flex;
    flex-direction: column;
  }
  section{
    flex: 1;
    background: #f4f4f4;
  }
  .headerbar{
    width: 100%;
    height:30px;
    background: #1c76dc;
    position: fixed;
    top:0px;
    z-index: 499
  }
  .header{
    width: 100%;
    height:50px;
    background: #1c76dc url(../../../static/images/sy.png) no-repeat;
    background-size: cover;
    position: fixed;
    top:30px;
    display: flex;
    z-index: 499
  }
  .title{
    flex:7;
    color: #fff;
    font-weight: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    position: relative;
  }
  .search_btn{
     padding: 5px 20px;
     position: absolute;
     right: 0px;
     top:10px;
     color: #282828;
     font-size: 13px;
  }
  .iconBox{
    position: absolute;
    left: 8px;
    font-size: 14px
  }
  .close{
    flex:1.5;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size:26px;
  }
  .close_pic{
    display: flex;
  }
  .close_pic img{
    width: 100%;
    height: 100%;
  }
  .icon{
    flex:1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .userlist_item{
    width: 100%;
    background: #ffffff;
    padding: 5px 0;
    height:50px;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  .username{
    padding: 0 3px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    padding-left: 25px;
    color: #282828;
    font-size: 14px;
    font-weight: 600
  }
  .userTantant{
    padding-left: 25px;
    color: #999;
  }
  .userfuwu{
    position: absolute;
    right: 30px;
    color: #999;
    top:3px;
  }

  .search{
    width: 90%;
    background: #fff;
    border: 0;
    border-radius: 5px;
    height: 30px;
    font-size: 14px;
    padding-left:30px
  }
  .filter{
    height: 40px;
    line-height: 40px;
    margin-top:80px;
    background: #fff;

    display: flex;
  }
  .filter p{
    flex: 1;
    justify-content: center;
  }

  .tab_item{
    line-height: 45px;
    text-align: center;
    font-size: 16px;
  }
  .sub_btns{
    width: 220px;
    height: 40px;
    text-align: center;
    color: #0077D9;
    background: #fff;
    border: 1px solid #0077D9;
    line-height: 40px;
    font-size: 16px;
    margin: 50px auto;
    border-radius:5px;
  }
  .actives{
    background: #fff;
  }
  /*以fixed的方式固定mescroll的高度*/
  .mescroll_top {
    width: 100%;
    overflow-y: auto;
    position: fixed;
    top:123px;
    bottom:0;
    height: auto;
  }

</style>

