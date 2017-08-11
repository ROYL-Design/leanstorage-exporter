import Vue from 'vue'
import 'normalize.css'
import 'bulma'
import './assets/global.sass'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h('router-view'),
  router: new VueRouter({
    routes,
    mode: 'history',
    scrollBehavior () {
      return { x: 0, y: 0 }
    }
  })
})
