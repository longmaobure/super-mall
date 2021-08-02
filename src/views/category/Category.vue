<template>
  <div class="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories"
                @selectItem="selectItem"/>

      <scroll class="tab-content"
              :data="[categoryData]"
              ref="scroll">
        <div>
          <tab-content-category :subcategories="showSubcategory"/>
          <tab-control :titles="['综合', '新品', '销量']"
                       @itemClick="tabClick"/>
          <goods-list :goods="showCategoryDetail"/>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";

import TabMenu from "./childComps/TabMenu";
import TabContentCategory from "./childComps/TabContentCategory";


import Scroll from "../../components/common/scroll/Scroll";
import TabControl from "../../components/content/tabControl/TabControl";
import GoodsList from "../../components/content/goods/GoodsList";

import {getCategory, getSubcategory, getCategoryDetail} from "../../network/category";
import {POP, NEW, SELL} from "../../common/const";
import {tabControlMixin} from "../../common/mixin";


export default {
  name: "Category",
  components: {
    TabContentCategory,
    NavBar,
    TabMenu,
    Scroll,
    TabControl,
    GoodsList
  },
  data() {
    return {
      categories: [],
      currentIndex: -1,
      categoryData: {},
    }
  },
  mixins: [tabControlMixin],
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  created() {
    this._getCategory();

    // 2.监听图片加载完成
    this.$bus.$on('itemImageLoad', () => {
      this.$refs.scroll.refresh()
    })
  },
  methods: {
    _getCategory() {
      // 1. 请求类别资源
      getCategory().then(res => {
        this.categories = res.data.category.list;
        // console.log(this.categories);
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }
        // console.log(this.categoryData)
        this._getSubcategories(0);

      })
    },
    // 根据类别获取对应资源并报错到对应数据中
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailKay = this.categories[index].maitKey;
      getSubcategory(mailKay).then(res => {
        // console.log(res);
        // 保存请求回来的数据
        this.categoryData[index].subcategories = res.data;
        // console.log(this.categoryData);
        this.categoryData = {...this.categoryData};
        // console.log(this.categoryData);
        // console.log(this.categoryData[index].subcategories)
        this._getCategoryDetail(POP);
        this._getCategoryDetail(NEW);
        this._getCategoryDetail(SELL);
      });
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // console.log(this.categories[this.currentIndex])
      // console.log(type,miniWallkey);
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // console.log(res);
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = {...this.categoryData};
      });
    },
    /**
     * 事件响应相关的方法
     */
    selectItem(index) {
      console.log(index);
      this._getSubcategories(index);
    }
  }
}
</script>

<style scoped>
.category {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
  line-height: 44px;
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;
  overflow: hidden;
  display: flex;
}

.tab-content {
  /*height: calc(100% - 44px - 49px);*/
  height: 100%;
  flex: 1;
}
</style>
