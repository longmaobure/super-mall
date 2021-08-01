<template>
  <div id="detail">
    <!--    详情导航-->
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick" ref="detailNav"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            :pull-up-load="true"
            @scroll="detailContentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="param" :param-info="paramsInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <!--详情底部-->
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backClick" v-if="isShowBackTop"></back-top>
<!--    <Toast :message="message" :show="show"></Toast>-->
  </div>
</template>

<script>

import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import GoodsList from "../../components/content/goods/GoodsList";
import Scroll from "../../components/common/scroll/Scroll";

import {getDetailMultiata, Goods, Shop, GoodsParam} from "../../network/detail";
import {itemListenerMixin, backTopMixin} from "../../common/mixin";
import {debounce} from "../../common/utils";
import {getRecommend} from "../../network/detail";

import {mapActions} from 'vuex';
//
// import Toast from "../../components/common/toast/Toast";

export default {
  name: "Detail",
  components: {
    GoodsList,
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    // Toast
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramsInfo: {},
      commentInfo: {},
      recommends: null,
      themeTopYs: [],
      getThemeYs: null,
      currentIndex: 0,
      // message:'',
      // show:false
    }
  },
  // 混入 图片加载监听 refresh
  mixins: [itemListenerMixin, backTopMixin],
  created() {
    // 1. 保存传入的id
    this.iid = this.$route.params.iid;
    // console.log(this.$route.params.iid);

    //  2. 根据iid请求详情数据
    getDetailMultiata(this.iid).then(res => {
      // console.log(res);
      const data = res.result;
      //1. 获取顶部轮播数据
      this.topImages = data.itemInfo.topImages;

      //  2. 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
      // console.log(this.goods);

      //  3. 获取商铺信息
      this.shop = new Shop(data.shopInfo);

      //  4. 保存商品的详情数据
      this.detailInfo = data.detailInfo;

      //  5. 获取参数信息
      this.paramsInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

      //  6. 获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

    }).catch(err => {
      console.log(err)
    });
    //  3. 获取推荐信息
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
      console.log(this.recommends);
    })

    // 4.给getThemeYs 函数赋值, 用于获取详情页标题点击跳转对应的top值,
    // debounce 函数进行防抖操作,防止多次调用
    this.getThemeYs = debounce(() => {
      this.themeTopYs = [];

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
      this.themeTopYs.push(Number.MAX_VALUE);
      console.log(this.themeTopYs);
    }, 200)
  },
  methods: {
    // 映射Vuex中的 addCart函数
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh();

      this.getThemeYs();
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      // this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200);
    },
    // // 回到顶部
    // backClick() {
    //   this.$refs.scroll.scroll.scrollTo(0, 0, 500);
    // },
    detailContentScroll(position) {
      //1. 获取滚动的y值
      const positionY = -position.y;
      //  2. 根据y值跟主题中的值进行对比
      //  [0, 14157, 15050, 15246]
      //   y 值在 0-14157之间 index = 0
      //   y 值在 14157-15050之间 index = 1
      //   y 值在 15050-15246之间 index =2
      //   y 值超过 15246 index = 3
      let length = this.themeTopYs.length
      /**
       * 判断的方案:
       *  方案一:
       *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
       *    优点: 不需要引入其他的内容, 通过逻辑解决
       *    缺点: 判断条件过长, 并且不容易理解
       *  方案二:
       *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
       *    优点: 简洁明了, 便于理解
       *    缺点: 需要引入一个较大的int数字
       * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
       * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
       */
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i;

          this.$refs.detailNav.currentIndex = this.currentIndex;
        }
      }
      this.isShowBackTop = positionY >= 1000;
      // if (positionY)
      // for (let i = 0; i < length; i++) {
      //   if (this.currentIndex!==i&&(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ||
      //     (i === length - 1 && positionY >= this.themeTopYs[i])) {
      //     this.currentIndex = i;
      //     // console.log(this.currentIndex)
      //     this.$refs.detailNav.currentIndex = this.currentIndex;
      //   }
      // }

    },
    addToCart() {
      // 1. 获取购物车需要展示的信息
      // img, title, info,price
      const product = {};
      product.image = this.topImages[0];
      // console.log(this.goods);
      product.title = this.goods.title;
      product.info = this.goods.desc;
      product.price = this.goods.newPrice;
      product.iid = this.iid;

      // 2. 将商品添加到购物车中 (Vuex)
      // this.$store.commit('addCart', product);
      // this.$store.dispatch('addCart', product).then(res=>{
      //   console.log(res);
      // });
      // 映射 Vuex中的 actions后
      this.addCart(product).then(res => {
        // console.log(res);
        // this.message = res;
        // this.show = true;
        //
        // setTimeout(()=>{
        //   this.show = false;
        //   this.message = '';
        // },1500)
        // this.$toast.show('测试Toast组件',1500);
        this.$toast.show(res);
        console.log(this.$toast);
      });


    }
  },
  destroyed() {
    console.log(`详情页组件销毁,事件总线停止监听`);
    this.$bus.$off('itemImageLoad', this.itemImageListener);
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
  padding-top: 10px;
}

.content {
  /*height: calc(100% - 65px);*/
  height: calc(100% - 44px - 60px);
}


</style>
