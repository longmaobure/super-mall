<template>
  <div class="tab-control">
    <div
      v-for="(item,index) in titles"
      :key="index"
      class="tabControl-item"
      :class="index===currentIndex?'active':''"
      @click="itemClick(index)">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      console.log(index);
      this.currentIndex = index;
      this.$emit('tabClick',index);
    }
  }
}
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
}

.tabControl-item span {
  padding: 5px;
}

.tabControl-item {
  flex: 1;
  height: 40px;
  line-height: 40px;
}

.active {
  color: var(--color-high-text);

}

.active span {
  border-bottom: 3px solid var(--color-tint);
}
</style>
