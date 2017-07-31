import homePage from './components/homePage.vue'
import book from './components/book.vue'
import homework from './components/homework.vue'


export default {
  routes: [
    {name:'home', path:'/',component: homePage},
    {name:'homePage', path:'/homePage',component: homePage},
    {name:'book', path:'/book/:id',component: book},
    {name:'homework', path:'/homework',component: homework},
  ]
}