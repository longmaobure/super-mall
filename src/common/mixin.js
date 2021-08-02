import {debounce} from "./utils";
import BackTop from "../components/content/backTop/BackTop";
import {POP, NEW, SELL} from "./const";

// Home组件+detail组件相同代码混入
export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    //1. 图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImageListener = () => {
      console.log(this.$route.path + '图片加载完成监听');
      refresh();
    }
    this.$bus.$on('itemImageLoad', this.itemImageListener);
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    // 回到顶部
    backClick() {
      this.$refs.scroll.scroll.scrollTo(0, 0, 500);
    },
  }

}


export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}
