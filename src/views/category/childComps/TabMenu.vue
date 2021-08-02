<template>
  <scroll class="tab-menu">
    <div class="menu-list">
      <div class="menu-list-item"
           v-for="(item,index) in categories"
           :key="index"
           :class="{active: index===currentIndex}" @click="itemClick(index)">
        {{ item.title }}
      </div>
    </div>
  </scroll>
</template>

<script>
import Scroll from "../../../components/common/scroll/Scroll";

export default {
  name: "TabMenu",
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  components: {
    Scroll
  },
  methods: {
    itemClick(index) {
      // 点击后传入当前index, 赋值给 currentIndex 切换active类名
      this.currentIndex = index;
      // $emit向父组件发送数据
      this.$emit('selectItem', index);
    }
  }
}
</script>

<style scoped>
.tab-menu {
  background-color: #f6f6f6;
  height: 100%;
  width: 100px;
  box-sizing: border-box;
}

.menu-list-item {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
}

.menu-list-item.active {
  font-weight: 700;
  color: var(--color-high-text);
  background-color: #fff;
  border-left: 3px solid var(--color-high-text);
}
</style>
