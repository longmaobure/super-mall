<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计: ￥{{ totalPrice }}
    </div>

    <div class="calculate">
      去计算 {{ checkLength }}
    </div>
  </div>
</template>

<script>

import CheckButton from "./CheckButton";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      return this.$store.getters.cartList.filter(item => {
        console.log(item)
        return item.checked;
      }).reduce((preValue, item) => {

        return preValue + parseFloat(item.price.slice(1)) * item.count;
      }, 0).toFixed(2);
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length;
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  border: 1px solid #ccc;
  background-color: #fff;
  /*bottom: 40px;*/
  line-height: 40px;
  text-align: center;

}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 100px;
}

.check-button {
  margin-right: 5px;
}

.price {
  /*margin-left: 80px;*/
  /*margin-left: 19px;*/
}

.calculate {
  position: absolute;
  width: 100px;
  background-color: red;
  color: #fff;
  /*margin-left: 5px;*/
  right: 0;
}
</style>
