import Vue from 'vue'
import 'bulma'
import './assets/global.sass'
import VueRouter from 'vue-router'
import routes from './routes'
import store from './store'

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h('router-view'),
  store,
  router: new VueRouter({
    routes,
    scrollBehavior () {
      return { x: 0, y: 0 }
    }
  })
})
