<template>
  <div class='tab-bar-item'>
    <div v-if="!isActive" @click="itemClick()">
      <slot name="item-icon"></slot>
    </div>
    <div v-else @click="itemClick()">
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle" @click="itemClick()">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: '',
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {

    }
  },
  computed: {
    isActive() {
      return [this.$route.path].includes(this.path);
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {};
    }
  }
  ,
  methods: {
    itemClick() {
      console.log(this.activeColor)
      // console.log(this.path)
      console.log(this.$route.path);
      if (this.$route.path !== this.path) {
        this.$router.push(this.path);
      }
    }
  }
}
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
}

.active {
  color: red;
}
</style>
