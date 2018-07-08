import Vue from 'vue'
import Router from 'vue-router'
import bookLists from '@/components/bookLists'
import book from '@/components/book'
import homeworks from '@/components/homeworks'
import login from '@/components/login'
import signUp from '@/components/signUp'
import record from '@/components/record'
import agreement from '@/components/agreement'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/bookLists',
      name: 'bookLists',
      component: bookLists
    },
    {
      path: '/book/:id',
      name: 'book',
      component: book
    },
    {
      path: '/homeworks',
      name: 'homeworks',
      component: homeworks
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp
    },
    {
      path:'/record',
      name:'record',
      component: record
    },
    {
      path:'/agreement',
      name:'agreement',
      component: agreement
    }
  ]
})
