<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" class="tab-control"
                 @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick" ref="tabControl2"></tab-control>

      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-if="isShowBackTop"></back-top>
  </div>

</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "../../components/common/navbar/NavBar";
import TabControl from "../../components/content/tabControl/TabControl";
import GoodsList from "../../components/content/goods/GoodsList";
import Scroll from "../../components/common/scroll/Scroll";
import BackTop from "../../components/content/backTop/BackTop";
import {debounce} from "../../common/utils";


import {getHomeMultiata, getHomeGoods} from "../../network/home";


export default {
  name: "home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {
          page: 0,
          list: []
        },
        'new': {
          page: 0,
          list: []
        },
        'sell': {
          page: 0,
          list: []
        }
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      itemImageListener: null
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    //  1. 请求多个数据
    this.getHomeMultiata();
    // 2. 请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');

  },
  mounted() {
    //1. 图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    this.itemImageListener = () => {
      console.log(this.$route.path + '图片加载完成监听');
      refresh();
      // this.$refs.scroll && this.$refs.scroll.refresh();
    }
    this.$bus.$on('itemImageLoad', this.itemImageListener)


  },
  methods: {
    /*
    * 事件监听相关
    * */

    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = 'pop';
          break;
        case 1:
          this.currentType = 'new';
          break;
        case 2:
          this.currentType = 'sell';
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // 回到顶部
    backClick() {
      console.log(this.$refs.scroll.scroll);
      this.$refs.scroll.scroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      // console.log(position);
      // 1. 判断BackTop是否显示
      this.isShowBackTop = Math.abs(position.y) > 1000;
      // 2. 判断tabControl 是否吸顶(position: fixed)
      this.isTabFixed = Math.abs(position.y) > this.tabOffsetTop;
    },
    loadMore() {
      console.log('上拉加载更多');
      this.getHomeGoods(this.currentType);
      this.$refs.scroll.finishPullUp();
      // this.$refs.scroll.refresh();
    },
    swiperImageLoad() {
      //获取tabControl 的offsetTop
      //所有的组件都有一个属性 $el: 用于获取组件种的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      console.log(this.tabOffsetTop);
    },

    /*
    * 网络请求相关
    * */
    getHomeMultiata() {
      getHomeMultiata().then(res => {
        // console.log(res)
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        console.log(res.data.list);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        // this.$refs.scroll.refresh();
      })
    }
  },
  // 使用keep-alive 包裹的组件在切换路由时执行
  deactivated() {
    console.log(`Home路由切换`)
    this.$bus.$off('itemImageLoad',this.itemImageListener);
  }
}
</script>

<style scoped>
/*.wrapper{*/
/*  overflow: hidden;*/
/*}*/
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: white;
  padding-top: 5px;
  /*position: fixed;*/
  /*width: 100%;*/
  /*top: 0;*/
  /*left: 0;*/
  /*z-index: 9;*/
}

.tab-control {
  position: relative;
  z-index: 10;
  background-color: white;
}

/*.tab-control {*/
/*  position: sticky;*/
/*  top: 44px;*/
/*  background-color: #fff;*/
/*  z-index: 10;*/
/*}*/


.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
