<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :value="isSelectAll"
                    @click.native="checkClick"
      ></check-button>
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
import {mapGetters} from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return this.$store.getters.cartList.filter(item => {
        console.log(item)
        return item.checked;
      }).reduce((preValue, item) => {

        return preValue + parseFloat(item.price.slice(1)) * item.count;
      }, 0).toFixed(2);
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick() {
      console.log('点击全选');
      if (!this.isSelectAll) {
        this.cartList.forEach(item => item.checked = true)
      } else {
        this.cartList.forEach(item => item.checked = false)
      }

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
  line-height: 0;
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
