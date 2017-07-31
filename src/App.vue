<template>
  <div id="app">
  <!--导航-->
    <header class="header" :class="{ 'header-fixed' : headerFixed }" >
      <el-breadcrumb separator="/">
        <span class="bread">
          <el-breadcrumb-item :to="{ path: '/homePage' }"><span class="white">书籍管理</span></el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: this.path }"><span class="white">{{tagName}}</span></el-breadcrumb-item>
          
        </span>
      </el-breadcrumb>
    </header>

    <div class='content'>
      <!--i am content-->
      <router-view></router-view>
    </div>
    
  </div>
  
</template>

<script>
import Hub from './Hub.js'

export default {
  
  data() {
    return {
      tagName: '',
      bookid:0,
      headerFixed: true,
      path:''
    };
  },
  created(){
    Hub.$on('listenToChild',childData => {
      this.tagName = childData;
      console.log(this.tagName);
    });
    Hub.$on('listenToChild2',childData => {
      this.bookid = childData;
      console.log(this.bookid);
    });
     Hub.$on('listenToChild3',childData => {
      this.path = childData;
      console.log(this.path);
    });
    
  },
}

</script>

<style>
header{
    position: fixed;
    background: #404040;
    padding: 20px 50px;
    width: 100%;
    line-height: 64px;
    margin-bottom: 40px;
    z-index: 3;
}
.bread{
  font-size: 20px;

}
.white{
  color: white;
   cursor:pointer ;
}
.white:hover{
  color: #108ee9;
}
body {
  font-family: Helvetica, sans-serif;
}

</style>
