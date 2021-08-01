<template>
  <div class="toast" v-show="isShow">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  /*props:{
    message:{
      type:String,
      default:''
    },
    show:{
      type:Boolean,
      default: false
    }
  },*/
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    // message: 提示用户的信息,如已添加购物车....
    // duration: 信息显示时间
    show(message, duration = 1500) {
      this.message = message;
      this.isShow = true;
      setTimeout(() => {
        this.isShow = false;
        this.message = '';
      }, duration)
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 10px;
  background-color: rgba(0, 0, 0, .7);
  color: white;

  z-index: 99;
}
</style>
