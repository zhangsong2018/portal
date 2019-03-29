<template>
  <div class="wrap" v-title="title">
    <!--标题-->
    <div style="height: 20px;background:#0077D9;"></div>
    <HeaderBarIT><span slot="title">血糖历史</span></HeaderBarIT>
    <!--滑动区域-->
    <section>
       <div id="mescroll" class="mescroll_top">
          <ul id="dataList" class="data-list">
             <li v-for="item in items" :key="item.id" class='lists'>
                 <span class="flex_item" style="flex: 2">{{item.obsTime | dateFormat}}</span>
                 <span class="flex_item" v-if="item.item == 10">早餐前</span>
                 <span class="flex_item" v-if="item.item == 11">早餐后</span>
                 <span class="flex_item" v-if="item.item == 12">午餐前</span>
                 <span class="flex_item" v-if="item.item == 13">午餐后</span>
                 <span class="flex_item" v-if="item.item == 14">晚餐前</span>
                 <span class="flex_item" v-if="item.item == 15">晚餐后</span>
                 <span class="flex_item" v-if="item.item == 16">睡前</span>
                 <span class="flex_item" v-if="item.item == 9">随机血糖</span>
                 <span class="flex_item" style="flex: 1.5">{{item.value}}mmol / L</span>
             </li>
          </ul>
       </div>
       <!--<div class="noData" v-show="items.length==0">-->
          <!--<img src="@/static/images/noData.png" alt="">-->
          <!--<p>暂无数据</p>-->
       <!--</div>-->
    </section>
     <div v-transfer-dom>
        <!--<loading :show="show2" text=""></loading>-->
    </div>
  </div>
</template>

<script>
// 引入mescroll.min.js和mescroll.min.css
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import HeaderBarIT from '@/views/HeaderBarIT'
//import Loading from '@/components/Template/Loading'
import {Loading,TransferDomDirective as TransferDom} from 'vux'
import getDsBridge from '@/static/js/getDsBridge.js'
import no_data_icon from '@/static/images/no_data.png';

var Authorization = getDsBridge.getToken()
export default {
  name: 'mescrollOptions',
  components: {HeaderBarIT,Loading},
  directives: {
    TransferDom
  },
  filters:{
    dateFormat:function(value){
        return value.substring(0,16).replace(/T/g, ' ')
    }
  },
  data () {
    return {
      title:'服务历史',
      mescroll: null, // mescroll实例对象
      isShow:false,
      items: [], // 列表数据
      pdType: 0, // 菜单
      Authorization:"",
      show2:false
    }
  },
  created(){

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
            // alert('点击了按钮,具体逻辑自行实现')
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
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page,mescroll) {
      this.show2 = true;
      var _this = this;
      var url = this.url;
      this.rid = this.$route.params.rid;
      $.ajax({
        type:"post",    //请求方式
        async:true,    //是否异步
        url:url+"/api/services/app/OmsMedical/MoVitalSignObsLogQuery",
        dataType:"json",    //跨域json请求一定是jsonp
        timeout: 10000,
        headers: {
           'Authorization': 'Bearer '+ Authorization,
           'Oms-Tenant-Id': _this.TenantId
        },
        data:{
          "ResidentId":this.rid,
          "Items":[9,10,11,12,13,14,15,16],
          "skipCount":(page.num-1)*page.size,// 是 int 跳过计数
          "maxResultCount":page.size
        },
        success: function(data) {
          //请求成功处理，和本地回调完全一样
          if(data.success){
            if (page.num === 1) _this.items = [];
            _this.show2 = false;
            _this.items = _this.items.concat(data.result.items)
            // 数据渲染成功后,隐藏下拉刷新的状态
            _this.$nextTick(() => {
                _this.mescroll.endSuccess(data.result.items.length)
            })
          }
        },
        complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
          console.log(status)
          if (status == 'timeout') {//status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
            _this.show2 = false;
            _this.showServeUnknowError({
              onCancel(){
                ajaxSend();
              }
            })
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          let status = XMLHttpRequest.status;
          if(status != 200){
            _this.show2 = false;
            _this.showServeUnknowError({
              onCancel(){
                ajaxSend();
              }
            })
          }
        }});

    },
    toParent(data){
       switch(data){
         case 'upCallback':
         this.upCallback ({num:1},mescroll);
         break;
       }
    }


  }
}
</script>

<style scope>
  /* html{
    font-size: 62.5px !important;
  } */
  .wrap{
     width: 100%;
     height: 100%;
     display: flex;
     flex-direction: column;
     background: #f4f4f4;

   }
   section{
     flex: 1;
     background: #f4f4f4;
   }
  /*以fixed的方式固定mescroll的高度*/
  .mescroll_top {
    width: 100%;
    overflow-y: auto;
    position: fixed;
    top:80px;
    bottom:0;
    height: auto;
  }

  .lists{
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #efefef;
    line-height: 50px;
    display: flex;
  }
  .flex_item{
    flex: 1;
    padding-left: 10px;
    justify-content: left;
    align-items: center;

  }
  .time_tit{
    line-height: 34px;
    border-bottom:1px solid #eeeeee ;
  }
  .time_tit p {
    margin-left: 12px;
    font-size: 14px;
    color: #7f7f7f;
  }
  .time_tit span{
    float: right;
    margin-right: 12px;
    color: #c10202;
  }
  .author{
    color:#1d1d1d;
    padding: 20px 15px;
  }
  .conText{
    color: #1d1d1d;
    line-height: 1.5;
    font-size: 15px;
  }
  #empty_wrap{
    line-height: 25px;
    height: 25px;
    text-align: center;

  }
  .noData{
    margin-top:30%;
  }
  .noData p{
    text-align: center;
    font-size: 14px;
    line-height: 50px;
    color: #282828;
  }
  .noData img{
     width:120px;
     height: 120px;
     margin-left:50%;
     transform: translateX(-50%);
  }
</style>
