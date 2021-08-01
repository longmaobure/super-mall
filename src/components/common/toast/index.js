// toast 组件 index.js

import Toast from "./Toast";

const obj = {};

/*
* 初步思路
*   在Vue实例中使用了模块 Vue.use(toast);
*   会自动调用 install方法
*   在install 方法中, 将组件挂载到 Vue的原型上
*   挂载后可全局调用
*
* */
obj.install = function (Vue) {
  /*
    $el 属性, 用于获取vue挂载的实例的dom对象，在mounted生命周期中才有效。
    console.log(Toast.$el); // undefined, 获取不到Toast的dom对象, 需要在mounted生命周期挂载后才能获取
    document.body.appendChild(Toast.$el);
  */

  // 1. 创建组件构造器
  const toastConstructor = Vue.extend(Toast);

  // 2. new 的方式, 根据组件构造器, 可以创建出一个组件对象
  const toast = new toastConstructor();

  // 3. 将组件对象, 手动挂载到某一个元素上, 使用 .$mount('dom')
  toast.$mount(document.createElement('div'));

  // 4. toast.$el 对应的就是 document.createElement('div')了
  // 挂载
  document.body.appendChild(toast.$el);
  Vue.prototype.$toast = toast;

};

export default obj;
