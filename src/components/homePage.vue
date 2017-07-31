<template>
	<div v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="^-^加载中"
       class="bookPage">

		<el-row style="margin:0 auto;    max-width: 1360px;
    min-width: 1360px;" :gutter="20">

        <el-card class="card add" :body-style="{ padding: '0px' }">
          <a @click="addBookShow" href="#">
            <img id="addimg" src="../assets/add.png" width="70px" height="70px">
          </a>
        </el-card>

        <el-col style="padding: 0px; margin-right:30px;" :span="4" v-for="(book, index) in bookList" :key="book" :offset="0">           
          <el-card class="card" :body-style="{ padding: '0px' }">
           <router-link :to="'/book/'+bookList[index].id">
            <img :src="bookList[index].cover" style="width: 100%;display: block;" height="270px;">
            <div style="padding-top:14px;
                      padding-bottom:5px;
                      text-align:center;
                     color:#108ee9;">
               <span style="text-overflow:ellipsis;
               white-space:nowrap;
               overflow:hidden;
               width:200px;
               display:inline-block">{{ bookList[index].alias }}</span>
            </div>
           </router-link> 
           
           <div>
             <a href="#" @click="edit(index)" class="icon">
               <i class="el-icon-edit"></i>
             </a>
             <a @click="confirm(index)" class="icon" href="#">
               <i class="el-icon-delete"></i>
             </a>
            </div>
          </el-card>
         </el-col>
    </el-row>

 <!--editform--> 
     <div>
      <el-dialog size="large" style="width:700px;margin:0 auto" title="书籍信息" :visible.sync="dialogFormVisible">
        <el-form ref="newbookEdit" :rules="rules" class="editform" :model="newbookEdit" :before-close="visible2">
          <el-form-item prop="name" label="书名" :label-width="formLabelWidth">
            <el-input v-model="newbookEdit.name" auto-complete="true"></el-input>
          </el-form-item>
          <el-form-item prop="alias" label="别名" :label-width="formLabelWidth">
            <el-input v-model="newbookEdit.alias" auto-complete="true"></el-input>
          </el-form-item>
          <el-form-item label="版本号" :label-width="formLabelWidth">
            <el-input-number v-model="newbookEdit.edition" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item prop="barCode" label="条形码" :label-width="formLabelWidth">
            <el-input v-model="newbookEdit.barCode" auto-complete="true"></el-input>
          </el-form-item>
          <el-form-item label="出版社" :label-width="formLabelWidth">
            <el-input v-model="newbookEdit.press" auto-complete="true"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button style="margin-left:50%"  @click="visible2">取 消</el-button>
          <el-button  type="primary" @click="editBook">确 定</el-button>
          </el-form-item>  
        </el-form>
      
        <div style="float:left;display:inline-block">
        <span style="margin-left:70px;font-size:1.2em;">点击编辑图片</span>
        <!-- 阴影浮层 -->
        <div @click="ok = false" class="formimg2" v-show="ok">
          <a @click="cancelImg" class="icon" style="margin-left:70px; margin-top:40%;display:inline-block;" >
           <i size="200%" class="el-icon-delete"></i></a>
          <a @click="imgdalog = true" class="icon" style="margin-left:20px; margin-top:40%;display:inline-block;" >
           <i size="200%" class="el-icon-view"></i></a>
        </div>
        <!-- 删除后增加图片 -->
        <div v-if="showUpload" class="upLoad">
          <div >
            <img v-show="showadd" class="inputimg editimg" src="../assets/addimg.png">
            <input class="input" type="file" @change="editHandleFile">
            <img v-if="preview" :src="this.dataURL" style="width:200px; height:180px;" >
          </div>
        </div>
        <img @click="ok = true" class="formimg" :src="newbookEdit.image" width="200px" height="180px" >
        </div>
      </el-dialog>
       <el-dialog :visible.sync="imgdalog">
         <form>
           <img style="margin-left:10%" :src="newbookEdit.image">
         </form>
       </el-dialog>
    </div>

<!--addform-->
    <el-dialog  size="large" style="width:700px;margin:0 auto"  :before-close="visible" title="书籍信息" :visible.sync="addFormVisible">
      <el-form style="margin-right:40px;" class="addform" :model="newbook" ref="newbook" :rules="rules">
        <el-form-item prop="name" label="书名" :label-width="formLabelWidth">
          <el-input placeholder="请输入书名" v-model="newbook.name" auto-complete="true"></el-input>
        </el-form-item>
        <el-form-item prop="alias" label="别名" :label-width="formLabelWidth">
          <el-input placeholder="请输入别名" v-model="newbook.alias" auto-complete="true"></el-input>
        </el-form-item>
        <el-form-item prop="edition" label="版本号" :label-width="formLabelWidth">
          <el-input-number v-model="newbook.edition" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item prop="barCode" label="条形码" :label-width="formLabelWidth">
          <el-input v-model="newbook.bar_code" placeholder="请输入条形码" auto-complete="true"></el-input>
        </el-form-item> 
        <el-form-item prop="press" placeholder="请输入出版社" label="出版社" :label-width="formLabelWidth">
          <el-input v-model="newbook.press" auto-complete="true"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:60%;">
          <el-button @click="visible()">取 消</el-button>
          <el-button type="primary" @click="addBook">确 定</el-button>
        </el-form-item>
              
    </el-form>
       <div>
            <span style="margin-left:20px;padding-bottom:15px;display:inline-block;font-size:1.2em">点击添加图片</span>
            <div v-show="showadd">
            <img  class="inputimg" src="../assets/addimg.png">
            <input class="input" type="file"  @change="handleFile">
            </div>
            <p v-if="!preview" style="margin-top:25%;color:white">aaaa</p>
            <img v-if="preview" :src="this.dataURL" style="width:130px; height:130px;padding:5px; border:solid;border-color:#97a8be; border-radius:10px;" >
            <el-button style="margin-left:30px;margin-top:10px;" v-show="preview" @click="deleteImg">删除图片</el-button>
        </div>    


    </el-dialog>
      
    <el-dialog size="large" style="width:700px;margin:0 auto" title="书籍信息" :visible.sync="cropperVisible">
      <div style="width:500px;height:600px" class="wrapper">
      <vueCropper
        ref="cropper"
        :img="this.dataURL0"
        :outputSize="option1.size"
        :info="true"
        :autoCrop="option1.autoCrop"
        :autoCropWidth="option1.autoCropWidth"
        :autoCropHeight="option1.autoCropHeight"
      ></vueCropper>
      </div>
      <el-button @click="getCrop">完成</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Hub from '../Hub.js';
import vueCropper from "vue-cropper";
export default {
  
  data() {
    return {
      childData: '..',
      number: 0,
      alias: '',
      bookList: [],
      currentDate: new Date(),
      dialogTableVisible: false,
      dialogFormVisible: false,
      addFormVisible: false,
      num1: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      dataURL:'',
      dataURL0:'',
      preview:false,
      file:'',
      
      //addform data
      newbook: {
          name : 'abc',
          alias:'abc',
          bar_code:'abc',
          edition:'abc',
          press:'press',
          image:''
      },
      newbook2:{},
      //editform data
      newbookEdit: {
          name :'',
          alias:'',
          barCode:'',
          edition:'',
          press:'',
          image: '',
          bookId: ''
      },
      rules:{
         name: [
            { required: true, message: '请输入书名', trigger: 'blur' }
          ],
         alias: [
            { required: true, message: '请输入别名', trigger: 'blur' }
          ],
         barCode: [
            { required: true, message: '请输入条形码', trigger: 'blur' }
          ],

      },
      formLabelWidth: '120px',
      imageUrl: '',
      booknum:1,
      showadd:false,
      ok:false,
      showUpload:false,
      imgdalog:false,
      fullscreenLoading:false,
      i:0,
      x:0,
      // 截图
        cropperVisible:false,  
        option1: {
          img: '',
          size: 0.8,
          autoCrop:true,
          autoCropWidth: 308,
          autoCropHeight: 378,
          fixed: true,
          fixedNumber: [22, 27]
        },
    };
  },
  created() {
    this.pageInit();
  },
  methods: {
    pageInit(isLoading){
      this.fullscreenLoading = true;
      this.$http.get('/api/pc/book_list',{isLoading : isLoading}).then(res => {
        this.bookList = res.data.data;
        this.number = res.data.data.length;
        console.log(this.bookList);
      }).then(()=>{
        this.fullscreenLoading = false;
      });
      Hub.$emit('listenToChild', '');
     
      //this.$http.get('/api/pc/illustration_list').then(res1 => {
        //console.log(res1);
      //});
    },
    //删除书籍按钮   
    confirm(index){
    	this.$confirm( '确定删除本书及已绑定在此书上的曲谱?' , '提示', {
    		confirmButtonText: '确定',
    		cancelButtonText: '取消',
    		type: 'warning'
    	}).then(() => {
        	//function
          this.delete(index);
        	this.$message({
        		type: 'success',
        		message: '删除成功!'
        	});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    delete(i){   
      console.log('deletebook',this.bookList[i].id)
      this.$http({
          method: 'delete',
          url: '/api/pc/book/',
          data: {
            bookId : this.bookList[i].id
          }
      }).then(()=>{
        this.bookList.splice(i,1);
      });
      
    },
    //编辑书籍按钮
    edit(i){
      this.dialogFormVisible = true;
      this.newbookEdit.name = this.bookList[i].name;
      this.newbookEdit.alias = this.bookList[i].alias;
      this.newbookEdit.barCode = this.bookList[i].bar_code;
      this.newbookEdit.edition = this.bookList[i].edition;
      this.newbookEdit.press = this.bookList[i].press;
      this.newbookEdit.image = this.bookList[i].cover;
      this.newbookEdit.bookId = this.bookList[i].id;
      this.booknum = i;
      if(this.addFormVisible === false){
          this.showUpload = false;
        }
    },
    editBook(){
      if(this.dataURL === '' && this.newbookEdit.image === '')
      {
        alert("请添加图片")
      }else{
      this.dialogFormVisible = false;
      let formdata2 = new FormData()
      formdata2.append('bookId', this.newbookEdit.bookId)
      formdata2.append('name', this.newbookEdit.name)
      formdata2.append('press', this.newbookEdit.press)
      formdata2.append('alias', this.newbookEdit.alias)
      formdata2.append('barCode', this.newbookEdit.barCode)
      formdata2.append('edition', this.newbookEdit.edition)
      formdata2.append('image', this.newbookEdit.image)
       if(typeof this.newbookEdit.image === "object"){
        // console.log('1');
         formdata2.append('image', this.newbookEdit.image) 
       }else{
         formdata2.append('ossPath', this.newbookEdit.image)
       }
      this.$http({
          method: 'post',
          url: '/api/pc/book',
          data: formdata2
       }).then(()=>{
          this.bookList[this.booknum].name = this.newbookEdit.name;
          this.bookList[this.booknum].alias = this.newbookEdit.alias;
          this.bookList[this.booknum].edition = this.newbookEdit.edition;
          this.bookList[this.booknum].press = this.newbookEdit.press;
          this.bookList[this.booknum].bar_code = this.newbookEdit.barCode;
          this.bookList[this.booknum].cover = this.dataURL;
          if(typeof this.newbookEdit.image === "object"){
           // console.log('1');
           this.bookList[this.booknum].cover = this.dataURL; 
          }else{
            this.bookList[this.booknum].cover = this.newbookEdit.image;
          }   
        }).then(()=>{
          this.dataURL = '';
        });
        this.preview = false;
        this.$message({
            message: '书籍编辑成功！',
            type: 'success'
          });
      }
    },
    editHandleFile(e) {
      this.ok = false;
      this.dataURL = '';
      this.showadd = false;
      this.file = e.target.files[0];
      this.dataURL0 = URL.createObjectURL(this.file);
      this.cropperVisible = true;
       setTimeout(()=>{
        this.$refs.cropper.startCrop()
      },10);
    },
    cancelImg(){
      this.newbookEdit.image = '';
      this.showUpload = true;
      this.showadd = true;
    },
    //增加书籍
    addBookShow(){
      this.addFormVisible = true;
      this.showadd = true;
      this.showUpload = true;
    },
    addBook(){   
      if(this.dataURL === '')
      {
        alert("请添加图片")
      }else{
      // console.log('i',this.i) 
      var x= 0;
      //第一次直接增加，连续两次增加则刷新页面
      console.log('newbook',this.newbook)
      this.newbook2.alias = this.newbook.alias;
      this.newbook2.bar_code = this.newbook.barCode;
      this.newbook2.cover = this.dataURL;
      this.newbook2.edition = this.newbook.edition;
      this.newbook2.press = this.newbook.preview;
      this.newbook2.name = this.newbook.name;
      if(this.i === 0){
       this.bookList.splice(0,0,this.newbook2);
       var x = 1;
      }
      this.i = 1;
      let formdata = new FormData()
      formdata.append('name', this.newbook.name)
      formdata.append('press', this.newbook.press)
      formdata.append('alias', this.newbook.alias)
      formdata.append('barCode', this.newbook.barCode)
      formdata.append('edition', this.newbook.edition)
      formdata.append('image', this.newbook.image)
      this.addFormVisible = false;
      this.$http({
          method: 'post',
          url: '/api/pc/book',
          data: formdata
       }).then((res)=>{
        // console.log(res)
          this.newbook2.id = res.data.data;
          if(x === 0){
          this.pageInit();
          this.i = 0;
         }
       }); 
         this.visible();
         this.showadd = true;
      }
      
    },
     // 截图
      getCrop () {
      console.log("截图")
      this.$refs.cropper.stopCrop() ;
      this.$refs.cropper.getCropData((data) => {
            window.getdata = data; 
        })
      setTimeout(()=>{

        let data = getdata
        if (data.length < 1) { return false }
        let type = data.split(',')[0]
        type = type.split(';')[0]
        data = data.split(',')[1]
        data = window.atob(data)
        let ia = new Uint8Array(data.length)
        for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i)
        }
        let blob = new Blob([ia], { type: type })

      this.dataURL = getdata;
      // console.log('my',this.dataURL)
      this.newbook.image = blob;
      this.newbookEdit.image = blob;
      this.preview = true;
      this.cropperVisible = false;
    },10)
      
    },
    //addformimg
    visible(done){
     this.addFormVisible = false;
     this.preview = false;
     this.dataURL = '';
     this.showUpload = false;
     this.ok = false;
     this.$refs['newbook'].resetFields();
    },
    visible2(done){
     this.dialogFormVisible = false;
     this.preview = false;
     this.dataURL = '';
     this.showUpload = false;
     this.ok = false;
     this.$refs['newbookEdit'].resetFields();
    },
    deleteImg(){
      this.newbook.image = '';
      this.dataURL = '';
      this.preview = false;
      this.showUpload = true;
      this.showadd = true;
    },
    handleFile(e) {
      this.dataURL = '';
      this.showadd = false;
      this.file = e.target.files[0];
      this.dataURL0 = URL.createObjectURL(this.file);
      this.cropperVisible = true;
       setTimeout(()=>{
        this.$refs.cropper.startCrop()
      },10);
    },

    //blob:
    // var reader = new FileReader(); 
    // reader.readAsDataURL(file); 
    // reader.onload = (e)=>{ 
    //   // window.imgdata=this.result;
    //   // console.log('data',window.imgdata)
    //   // window.setTimeOut(trigger(),100)
    
    // var data = e.target.result;
    //     if (data.length < 1) { return false }
    //     let type = data.split(',')[0]
    //     type = type.split(';')[0]
    //     data = data.split(',')[1]
    //     data = window.atob(data)
    //     let ia = new Uint8Array(data.length)
    //     for (var i = 0; i < data.length; i++) {
    //         ia[i] = data.charCodeAt(i)
    //     }
    //     var blob = new Blob([ia], { type: type })

    // console.log(blob);
    // this.newbook.image = blob;
    // }
  
    
  },
     components: {
    vueCropper
  }
}
</script>

<style>
a{
  text-decoration:none;
}
.bookPage{
    padding-top: 80px;
    padding-bottom: 50px;
    z-index: 1;
    margin-left: 5%;
}
/*addcard*/
#addimg{
	margin-left:-15px;
  margin-top: -20px;
  padding:140px 90px;
}
.add:hover{
  background-color: #ccc;
}
.add{
   float: left;
   margin-right: 1.2%;
}
/*card*/
.card{
 display: inline-block;
 width:220px;
 height:340px;
 padding-top: 16px;
 padding-left:10px;
 padding-right:10px;
 margin-top: 20px; 

}
.icon{
  color: white;
  margin-left: 55px; 
}
.icon:hover{
  color: black;
}
.el-card:hover{
  background-color: #ccc;
  
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.addform{
  display: inline-block;
  float: left;
  width: 360px;
}
/*addformimg*/
.editbook{
 margin-top:50%;
 margin-left: 70%;
}
.editform{
  float: left;
}
.editformImg{
  margin-left:110px;
  margin-top: -20px; 
  margin-bottom: 20px;
  display: inline-block;
  float: left;
  padding: 8px;
  border: solid;
  border-radius: 10px;
  border-color:#d9d9d9;
}
.editformImg:hover{
  background-color: #ccc;

}

.dialog-footer{
  margin-right: 42%;
}
.footerbtn{
  display: inline-block;
  margin-left:70%;
  margin-top: 110px;
  width: 150px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>