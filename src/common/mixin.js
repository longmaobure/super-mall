import {debounce} from "./utils";

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
