// Vuex index.js文件
import Vue from "vue";
import Vuex from "vuex";
import {ADD_COUNT, ADD_TO_CART} from "../router/Mutations-type";

// 1. 安装（应用）插件
Vue.use(Vuex);

// 2. new 一个 store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    // mutations 唯一的目的就是修改state中的状态
    // mutations 中的每个方法尽可能完成的事件比较单一一点
    [ADD_COUNT](state, payload) {
      // console.log(state)
      payload.count += 1;
    },
    [ADD_TO_CART](state, payload) {
      console.log(state)
      payload.checked = true;
      payload.count = 1;
      state.cartList.push(payload);
    }

  },
  actions: {
    /* addCart(context, payload) {
       // payload新添加的商品
       //1. 查找之前数组中是否有该商品
       let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
       if (oldProduct) {
         // oldProduct.count += 1;
         context.commit(ADD_COUNT, oldProduct);
       } else {
         // payload.count = 1;
         // state.cartList.push(payload);
         context.commit(ADD_TO_CART, payload);
       }
     }*/
    addCart(context, payload) {
      return new Promise(resolve => {
        // payload新添加的商品
        //1. 查找之前数组中是否有该商品
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
        if (oldProduct) {
          // oldProduct.count += 1;
          context.commit(ADD_COUNT, oldProduct);
          resolve('当前的商品数量+1');
        } else { // 添加新的商品
          // payload.count = 1;
          // state.cartList.push(payload);
          context.commit(ADD_TO_CART, payload);
          resolve('添加了新的商品');
        }
      })
    }
  },
  getters: {
    cartLength(state) {
      return state.cartList.length;
    },
    cartList(state) {
      return state.cartList
    }
  }
})


// 3. 导出
export default store;

