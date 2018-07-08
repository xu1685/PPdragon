<template>
  <div>
    <el-breadcrumb  class="header" separator=">" v-show="showHeader">
      <el-breadcrumb-item :to="{ path: '/bookLists' }"  class="items">书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item class="notShow items" ></el-breadcrumb-item>
      <el-dropdown trigger="hover"
          menu-align="end"
          @command="handleCommand">
          <span class="el-dropdown-link">
          {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="signup" v-show="userName=='未登录'?false:true">添加管理员</el-dropdown-item>
          <el-dropdown-item command="signout">退出</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </el-breadcrumb>
    <div class="elRow"
      element-loading-text="拼命加载中"
      v-loading="fullscreenLoading">
    <div class="count">
      <router-link :to="'/homeworks'" @click="showHeader=false"><el-button type="primary" class = "homework">作业管理</el-button></router-link>
      <router-link :to="'/record'" @click="showHeader=false"><el-button type="primary" class = "homework">日志分析</el-button></router-link>
    </div>
      <div class="flexbox">
        <div  class="boxitems">
          <el-card :body-style="{ padding: '0px' }">
            <div class="image" @click="dialogFormVisible1 = true"><img src="../assets/plus.png" ></div>
          </el-card>
        </div>
        <div class="boxitems" v-for="(book, index) in bookList" :key="book.id" >
          <el-card :body-style="{ padding: '0px' }" >
            <div class="image2">
            <router-link :to="'/book/'+book.id " :key="book.id" @click="showHeader=false"><img :src="book.cover" width="100%" height="100%"></router-link></div>
            <div style="padding: 14px;">
              <h2>{{book.alias}}</h2>
              <div class="bottom clearfix">
                <el-button  @click="dialogForm(index)"><i class="el-icon-edit icon"></i>编 辑</el-button>                                  
                <!--<el-button type="text" @click="open2(index)"><i class="el-icon-delete icon"></i></el-button>-->
              </div>
            </div>
          </el-card>
        </div>

      </div>
      <el-dialog title="编辑书信息" :visible.sync="dialogFormVisible" @close="cancelReviseBook" :lock-scroll="false">
        <div class="dialogbody">
          <div class="edit-img" v-show="editImage">
            <div>
              <div class="bottom clearfix">
                <el-button   @click="viewImage=true"><i class="el-icon-view icon"></i> </el-button>                                  
                <el-button type="text" @click="deleteImage"><i class="el-icon-delete icon"></i></el-button>
              </div>
            </div>
            <img :src="bookInfo.cover">
          </div>
          <div class="edit-img" v-show="showEditImg">
            <div>
              <div class="bottom clearfix" >
                <el-button   @click="viewImage=true"><i class="el-icon-view icon"></i> </el-button>                                  
                <el-button type="text" @click="deleteEditImage"><i class="el-icon-delete icon"></i></el-button>
              </div>
            </div>  
            <img :src="imgURL" />
          </div>
          <!--<div class="input-img" v-show="changImage">
            <input ref="in" type="file" accept="image/*" @change="handleFile2" :value = "inputValue"/>
          </div>-->
          <el-upload
            class="upload-demo"
            drag
            action="/return200"
            :multiple="false"
            :before-upload="handleFile2"
            v-show="changImage"
            accept="image/*">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
          </el-upload>
          <el-form :model="bookInfo" label-position="left">
            <el-form-item label="书名：" :label-width="formLabelWidth">
              <el-input v-model="bookInfo.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="别名：" :label-width="formLabelWidth">
              <el-input v-model="bookInfo.alias" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="版本号：" :label-width="formLabelWidth"  class="number">
                <span>第</span>
                <el-input-number v-model="bookInfo.edition"  :min="1" ></el-input-number>
                <span>版</span>
            </el-form-item>

            <el-form-item label="出版社：" :label-width="formLabelWidth">
              <el-input v-model="bookInfo.press" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="条形码：" :label-width="formLabelWidth">
              <el-input v-model="bookInfo.bar_code" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="cancelReviseBook">取 消</el-button>
          <el-button type="primary" @click="checkForm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="viewImage"
        size="tiny" :lock-scroll="false">
        <img :src="bookInfo.cover" width="300PX">
      </el-dialog>
      <el-dialog
        :lock-scroll="false"
        :visible.sync="viewInputImage"
        size="tiny">
        <img :src="imgURL" width="300PX">
      </el-dialog>
      <el-dialog
        :lock-scroll="false"
        :visible.sync="showImageCropper"
        class="cropper">
        <div class="cropper-father">
          <vueCropper
            ref="cropper"
            :img="imgURL"
            :autoCrop="true"
            :canScale="true"
            :autoCropWidth="cropperWidth"
            :autoCropHeight="cropperHeight"
            :fixed="true"
            :fixedNumber="[3,4]"
            style="height=400px"
          ></vueCropper>
          </div>
        <el-button type="primary" @click="cropperImage">确认裁剪</el-button>
      </el-dialog>
      <el-dialog title="添加书籍" :visible.sync="dialogFormVisible1"  @close="cancelAddBook" :lock-scroll="false" >
        <div class="dialogbody">
          <!--<div class="input-img" v-show="showInput">
            <input ref="in" type="file" accept="image/*" @change="handleFile1" :value = "inputValue"/>-->
          <el-upload
            class="upload-demo"
            drag
            action="/return200"
            :multiple="false"
            :before-upload="handleFile1"
            v-show="showInput"
             accept="image/*">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
          </el-upload>
         <!-- </div>-->
          <div class="edit-img" v-show="showImg">
            <div>
              <div class="bottom clearfix" >
                <el-button   @click="viewInputImage=true"><i class="el-icon-view icon"></i> </el-button>                                  
                <el-button type="text" @click="deleteInputImage"><i class="el-icon-delete icon"></i></el-button>
              </div>
            </div>
            <img :src="imgURL" />
          </div>
          <el-form :model="form"  label-position="left" label-suffix="：" >
            <el-form-item label="书 名" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="别 名" :label-width="formLabelWidth">
              <el-input v-model="form.alias" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="版本号" :label-width="formLabelWidth"  class="number">
                <span>第</span>
                <el-input-number v-model="form.edition"  :min="1" ></el-input-number>
                <span>版</span>
            </el-form-item>
            
            <el-form-item label="出版社" :label-width="formLabelWidth">
              <el-input v-model="form.press" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="条形码" :label-width="formLabelWidth">
              <el-input v-model="form.barCode" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
            <el-button @click="cancelAddBook">取 消</el-button>
            <el-button type="primary" @click="addBook">确 定</el-button>
        
        </div>
 
      </el-dialog>
      <el-dialog
        :lock-scroll="false"
        title="请登录"
        :visible.sync="showLogin"
        size="tiny"
        :show-close="false"
        top="40%"
        >
        <span>您还未登录，请登录</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeShowLogin">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>  
  import router from '../router'
  import VueCropper from "vue-cropper"
  export default {
    name: 'bookLists',
    data () {
      return {
        bookList:[],
        number:0,
        formLabelWidth: '70px',
        visible2:false,
        bookInfo:{edition:0},
        dialogFormVisible: false,
        form: {
          alias:'',
          barCode:'',
          edition:'',
          name:'',
          press:'',
          image:''
        },
        dialogFormVisible1:false,
        formLabelWidth1: '70px',
        num:0,
        file:'',
        fileList:[],
        img:{},
        viewImage:false,
        editImage:true,
        changImage:false,
        showImg:false,
        showInput:true,
        imgURL:'',
        showEditImg:false,
        viewInputImage:false,
        fullscreenLoading: false,
        showImageCropper:false,
        addImg:true,
        inputValue:'',
        showHeader:true,
        showLogin:false,
        userName:'未登录',
        dialogSize:'small',
        cropperWidth:150,
        cropperHeight:200
      }
    },
    components:{
      VueCropper,
    },
    created() {
      this.pageInit();

      },
    // mounted() {

    //   window.onresize = function reDialogSize() {
    //     var cWidth = document.body.clientWidth;
    //     console.log(cWidth);
    //     if(cWidth > 1170) {
    //       this.dialogSize = 'small';
    //       console.log(this.dialogSize);
    //     }
    //     else if(cWidth > 700 ) this.dialogSize = 'large';
    //     else this.dialogSize = 'full';
    //   }
    // },
    methods : {

      //加载
      openFullScreen() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1300);
      },

      //获取用户上传的图片
      handleFile1(file) {
        let reader = new FileReader();
        var that = this;
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          let base64 = this.result;
          let img = new Image();
          img.src = base64;
          img.onload = function () {
            let width = parseInt(img.width);
            let height = parseInt(img.height);
            let l = height / 400;
            console.log(width,height,l);
            if(width >= height) {
              that.corpperHeight = height > 400 ? 400 : height;
              that.cropperWidth = that.corpperHeight * 3 / 4;
            }else {
              that.cropperWidth = parseInt(width / l) > 300 ? 300 : parseInt(width / l);
              console.log(that.cropperWidth);
              that.corpperHeight = parseInt(that.cropperWidth * 4 / 3);
            }
          }
        }
        this.imgURL = URL.createObjectURL(file);
        this.showImageCropper = true;
        this.addImg = true;
        this.inputValue = '';
      },
      handleFile2(file) {
        let reader = new FileReader();
        var that = this;
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          let base64 = this.result;
          let img = new Image();
          img.src = base64;
          img.onload = function () {
            let width = parseInt(img.width);
            let height = parseInt(img.height);
            let l = height / 400;
            console.log(width,height,l);
            if(width >= height) {
              that.corpperHeight = height > 400 ? 400 : height;
              that.cropperWidth = that.corpperHeight * 3 / 4;
            }else {
              that.cropperWidth = parseInt(width / l) > 300 ? 300 : parseInt(width / l);
              console.log(that.cropperWidth);
              that.corpperHeight = parseInt(that.cropperWidth * 4 / 3);
            }
          }
        }
        this.imgURL = URL.createObjectURL(file);
        this.showImageCropper = true;
        this.addImg = false;
        this.inputValue = '';
      },

      //裁剪后获取显示裁剪图片
      cropperImage() {
        this.$refs.cropper.getCropData((data) => {
          //base64封装成blob对象

          var binary = atob(data.split(',')[1]);
          var ary = [] ;
          for(var i = 0; i < binary.length;i ++) {
            ary.push(binary.charCodeAt(i));
          }
          this.showImageCropper = false;
          if(this.addImg) {
            this.form.image = new Blob([new Uint8Array(ary)],{type:'image/*'});
            this.showImg = true;
            this.showInput = false;
          }else {
            this.bookInfo.image = new Blob([new Uint8Array(ary)],{type:'image/*'});
            this.showEditImg = true;
            this.changImage = false;
          }
          this.imgURL = data;
          if(this.addImg) {
            this.form.cover = this.imgURL; 
          } else {
            this.bookInfo.cover = data;
          }
        });
      },

      //初始化页面
      pageInit() {
        this.$http.get('/book_list').then( res => {
          console.log(res);
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            this.openFullScreen();
            this.bookList = res.data.data;
            console.log(this.bookList);
            this.number = this.bookList.length;
          }
        this.$http.get('/admin/userinfo').then(res =>{
          if(res.data.data.username) {
            this.userName = res.data.data.username;
            console.log(this.userName);
          }  
        });

      });
      },

      //初始化编辑书籍页面表单信息
      dialogForm(index) {
        this.dialogFormVisible = true;
        this.num = index;
        console.log(this.num);
        // for(var key in this.bookList[index]){
        //     this.bookInfo[key]= this.bookList[index][key];
        // }
        this.bookInfo = Object.assign({}, this.bookList[index])
        if(this.bookInfo.barCode)
          this.bookInfo.bar_code = this.bookInfo.barCode;
        console.log('bookInfo',this.bookInfo);
      },

      //确定更改书籍信息
      checkForm(){
        this.dialogFormVisible = false;
        this.bookList[this.num] = Object.assign({}, this.bookInfo);
        // post上传更改的值
        this.reviseBook(this.num);

      },
      open2(index){
          this.$confirm('此操作将永久删除 《'+this.bookList[index].name+'》,是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteBook(index);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '未删除'
            });          
          });
      },
      deleteBook(i) { 
        console.log(this.bookList[i]) ;
        this.$http.delete('/book',{
          params:{
            bookId:this.bookList[i].id
            }}
        ).then(res => {
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            this.bookList.splice(i,1);
          }
        });
        //console.log(this.bookList);
      },

        //上传更新书籍信息
      reviseBook(i) {
        let formData =  new FormData();
        console.log(this.bookInfo);
        formData.append('name',this.bookInfo.name ? this.bookInfo.name : '');
        formData.append('press',this.bookInfo.press ? this.bookInfo.press : '');
        formData.append('alias',this.bookInfo.alias ? this.bookInfo.alias : '');
        formData.append('barCode',this.bookInfo.bar_code ? this.bookInfo.bar_code : '');
        formData.append('edition',this.bookInfo.edition ? this.bookInfo.edition : '');
        formData.append('image',this.bookInfo.image ? this.bookInfo.image : '');
        formData.append('ossPath',this.bookInfo.cover ? this.bookInfo.cover : '');
        formData.append('bookId',this.bookInfo.id ? this.bookInfo.id : '');
        this.$http.post('/book',formData).then( res => {
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            console.log(this.bookList[i].cover);
            this.cancelReviseBook();
          }

        }); 
      },

      //上传新增书籍
      addBook() {
        let formData =  new FormData();
        formData.append('name',this.form.name ? this.form.name : '');
        formData.append('press',this.form.press ? this.form.press : '');
        formData.append('alias',this.form.alias ? this.form.alias : '');
        formData.append('barCode',this.form.barCode ? this.form.barCode : '');
        formData.append('edition',this.form.edition ? this.form.edition : '');
        formData.append('image',this.form.image  ? this.form.image : '');

        this.$http.post('/book',formData).then(res => {
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            this.form.id = res.data.data;
            this.bookList.unshift(this.form);
            //console.log(this.form)
            this.cancelAddBook();  
          }

          
        });      
      },

      //取消上传，重置上传书籍部分表单
      cancelAddBook() {
        this.dialogFormVisible1 = false;
        this.form = {
          alias:'',
          barCode:'',
          edition:'',
          name:'',
          press:'',
          image:''
        };
        this.showImg = false;
        this.showInput = true;

      },

      //取消上传，重置更新书籍部分表单
      cancelReviseBook() {
        this.dialogFormVisible = false;
        this.editImage = true;
        this.changImage = false;

      },

      //更改书籍信息时，删除图片
      deleteImage() {
        this.editImage = false;
        this.changImage = true;
      },

      //更改书籍信息时，删除更改图片
      deleteEditImage() {
        this.showEditImg = false;
        this.changImage = true;
      },

      //上传书籍时，更改要上传图片
      deleteInputImage() {
        this.showImg = false;
        this.showInput = true;
      },

      //关闭提示未登录窗口，跳转登录界面
      closeShowLogin() {
        this.showLogin  = false;
        router.push({path:'/'});
      },

      //操作账号
      handleCommand(e) {
        if(e === 'signout'){
          this.$http.get('/admin/logout').then(res => {
              router.push('/');
          });
        } else if(e === 'signup') {
          router.push('/signUp');
        }  
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .flexbox {
    display:flex;
    flex-flow:row wrap;
    justify-content:left;
    align-items:flex-start;
    align-content: flex-start;
    margin:100px auto;
    margin-bottom:70px;
    width:1200px;
  }
  .boxitems {
    flex:none;
    width:220px;
    height:346px;
    margin:0 10px;
    margin-bottom:20px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image2 {
    width: 180px;
    height:240px;
    display: block;
    margin:auto;
    margin-top:25px;
    border-radius:10px;
  }
  /*.image{
    width: 100%;
    height: 100%;
  }*/

  div.image {
    height:344px;
    width:100%;
    margin:0;
  }

  div.image img {
    width:64px;
    height:64px;
    margin-top:140px;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .left {
    float:left;
  }


  .el-card:hover {
    background-color:#ccc;
  }



  .icon {
    width:91px;
  }

  h2 {
    margin:0;
    padding:0;
    font-weight:500;
    font-size:18px;
    color:rgb(16, 142, 233);
    overflow:hidden;
    height:24px;
  }


  .bottom > .el-button {
    background-color:rgba(255,255,255,0);
    border:none;
    width:100%;
    margin:0;
    padding:0;
    color:white;
  }

  .el-button .el-icon-edit {
    width:25px;
  }
  .bottom  > .el-button:hover{
    color:black;
  }

  .dialogbody {
    margin:auto;
    width:85%;
    position:relative; 
    height:320px;
  }

  .el-dialog form {
    width:56%;
  }


  .el-input input.el-input__inner {
    border:none;
    border-bottom:1px solid #bfcbd9;
  }

  .upload-demo {
    position:absolute;
    top:0;
    right:0;
    width:40%;
    overflow:hidden;
    margin-top:31px;
  }

  .el-input-number {
    display:inline-block;
    width:120px;
  }


  .el-input .el-input__inner {
    width:50%;
  }

  .number {
    width:250px;
  }

  .el-input-number{
    width:120px;
    margin-right:10px;
  }
  
/*  .el-dialog__body div.input-img{
    position:absolute;
    top:14px;
    right:0;
    width:190px;
    height:240px;
    color:gray;
    font-size:18px;
    border:1px solid lightgray;
    background-image:url(../assets/addImg.png);
  }

  .el-dialog__body div.input-img:hover {
    border:darkgray 1px solid;
  }

  .el-dialog__body div.input-img input {
    width:100%;
    height:100%;
    opacity:0;
    cursor:pointer;
  }*/

  .editImage .el-dialog__body >img {
    width:180px;
    height:200px;
    position:absolute;
    right:70px;
    top:100px;
  }

  div.edit-img {
    position:absolute;
    top:0;
    right:0;
    width:190px;
    height:240px;
    margin-top:14px;
    color:gray;
    font-size:18px;
    border-radius:5px;
    border:1px solid lightgray;
  }

  div.edit-img div{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    margin:0;
  }
  div.edit-img div button {
    display:none;
  }
  div.edit-img  img{
    width:180px;
    height:230px;
    margin:5px;
  }

  div.edit-img div:hover{
    background-color:rgba(0,0,0,.3);
  }

  .dialogbody div.edit-img div:hover button {
    display:inline-block;
    position:absolute;
    height:10px;
    top:50%;
    margin:0;
    margin-top:-5px;
    left:0;
    width:50%;
  }

  .dialogbody div.edit-img div:hover .el-button+.el-button {
    margin-left:50%;
  }

  div.edit-img div:hover button:hover {
    color:lightgray;
  }

  .vue-cropper{
    height:400px;
  }

  .cropper .el-button {
    margin-top:15px;
  }

  .el-dialog--small {
    max-width:680px;
  }

  .dialogbody .el-button {
    position:absolute;
    right:0;
    bottom:0;
    width:64px;
  }

  .dialogbody .el-button +.el-button {
    margin-left:128px;
    right:80px;
  }


  .count {
    overflow:hidden;
    margin:0;
    line-height:64px;
    margin-top: 60px;
    margin-bottom: -60px;
    margin-right: 50px;
  }
  .count p {
    float:left;
    color:gray;
    margin:0
  }
 .homework {
    float:right;
    margin:15px;
    margin-right:0;
  }
  .homework:hover{
    background-color:#108ee9;
  }


</style>

