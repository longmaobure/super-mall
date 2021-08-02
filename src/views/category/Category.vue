<template>
  <div class="category">
    <nav-bar class="category-nav">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>
    </div>
  </div>

</template>

<script>

import NavBar from "../../components/common/navbar/NavBar";
import TabMenu from "./childComps/TabMenu";
import {getCategory, getSubcategory, getCategoryDetail} from "../../network/category";
import {POP, NEW, SELL} from "../../common/const";


export default {
  name: "Category",
  components: {
    NavBar,
    TabMenu
  },
  data() {
    return {
      categories: [],
      currentIndex: -1,
      categoryData: {},
    }
  },
  created() {
    this._getCategory();
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

.category-nav {
  background-color: var(--color-tint);
  color: white;
  padding-top: 5px;
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
</style>
