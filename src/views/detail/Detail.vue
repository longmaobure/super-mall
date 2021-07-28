<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"></detail-nav-bar>
    <scroll class="content" ref="scroll" :pull-up-load="true">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="param" :param-info="paramsInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
  </div>
</template>

<script>

import DetailNavBar from "./childComps/DetailNavBar";
import {getDetailMultiata, Goods, Shop, GoodsParam} from "../../network/detail";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";

import GoodsList from "../../components/content/goods/GoodsList";

import {getRecommend} from "../../network/detail";
import Scroll from "../../components/common/scroll/Scroll";

import {itemListenerMixin} from "../../common/mixin";
import {debounce} from "../../common/utils";

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
    Scroll
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
      getThemeYs: null
    }
  },
  mixins: [itemListenerMixin],
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
      console.log(this.themeTopYs);
    }, 200)
  },
  mounted() {

  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();

      this.getThemeYs();
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      // this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200);
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
  height: calc(100% - 44px);
}


</style>
