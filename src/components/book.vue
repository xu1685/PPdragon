
<template>
<div id='book'>
  <div class="handlebutton">
      <el-button @click="addsong" type="primary">新增乐谱</el-button>
      <router-link to='/homework/' >
      <el-button type="primary">作业管理</el-button>
      </router-link>
  </div>
  <div class="bookcontainer">

    <el-table
      :data="bookMsg1"
      v-loading.body="loading"
      element-loading-text="^-^加载中"
      border
      stripe
      style="width:83%; margin:0 auto">
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="opernName"
        label="曲名"
        width="200">
        <template scope="scope">
        <el-popover class="namespan" trigger="click">
        <!--xml-->
        <el-button type="primary" style="margin-left:35px;" @click="musicxml(scope.row)">显示乐谱</el-button>
        <div slot="reference">
        <span >{{ scope.row.opernName }}</span>
        </div>
        </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="opernEnglishName"
        label="英文名"
        width="270">
        <template scope="scope">
        <el-popover class="namespan" trigger="click">
        <!--xml-->
        <el-button type="primary" style="margin-left:35px;" @click="musicxml(scope.row)">显示乐谱</el-button>
        <div slot="reference">
        <span>{{ scope.row.opernEnglishName }}</span>
        </div>
        </el-popover>
        <div class="imgsmall">
        <el-popover trigger="hover" placement="right">
          <img :src="scope.row.illustrationPath" width="200px" height="180px">
          <div slot="reference">
            <img width="40px" height="36px" :src="scope.row.illustrationPath">
          </div>
        </el-popover>
        </div>
      </template>

      </el-table-column>
      <el-table-column
        prop="opernPageNumber"
        label="页码"
        width="80">
      </el-table-column>
      <el-table-column
        prop="option"
        label="操作"
        width="100">
        <template scope="scope">
          <el-button @click="handleClick(scope.$index)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="deletesongs(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop='songs'
        label="练习曲"
        >
      </el-table-column>
    </el-table>
<!-- book页面 opern编辑-->
    <el-dialog size="large" style="width:700px;margin:0 auto;" title="编辑" :before-close="back" :visible.sync="dialogFormVisible">
          <div class="namespan" trigger="click">
            <!--xml-->
            <div class="view"  slot="reference">
              <el-button @click="musicxml(mybookMsg)" type="info">预 览</el-button>
            </div>
          </div>
          <el-button class="view" type="danger" @click="deletesongs(mybookMsg)">删 除</el-button>

          <el-form style="float:left; width:330px;margin-right:20px;margin-top:40px;" :model="mybookMsg">
          <el-form-item label="曲名" :label-width="formLabelWidth">
            <el-input v-model="mybookMsg.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文名" :label-width="formLabelWidth">
            <el-input v-model="mybookMsg.englishName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="页码" :label-width="formLabelWidth">
              <el-input-number v-model="mybookMsg.pageNumber"></el-input-number>
          </el-form-item>
        </el-form>
        <span style="margin-left:50px;margin-bottom:0px;color:#666">点击编辑图片</span>
        <div>
        <!-- 阴影浮层 -->
        <div @click="ok = false" class="formimg2" v-show="ok">
          <a @click="cancelImg" class="icon" style="margin-left:70px; margin-top:40%;display:inline-block;" >
           <i size="200%" class="el-icon-delete"></i></a>
          <a @click="imgdalog = true" class="icon" style="margin-left:20px; margin-top:40%;display:inline-block;" >
           <i size="200%" class="el-icon-view"></i></a>
        </div>
        <!-- 删除后增加图片 -->
        <div v-if="showUpload" class="upLoad">
          <div>
            <img v-show="showadd" class="inputimg editimg" src="../assets/addimg.png">
            <input class="input" type="file" @change="editHandleFile">
            <img v-if="preview" :src="this.dataURL" style="width:200px; height:180px;" >
          </div>
        </div>
        <!-- 图片显示 -->
        <img @click="ok = true" class="formimg" :src="mybookMsg.illustration" width="200px" height="180px" >
        </div>
        <!-- 选择图片 -->
        <div style="margin-left:62%;margin-top:37%;">
           <el-select @change="changeImg" v-model="c" filterable placeholder="选择更改图片">
             <el-option
               v-for="item in this.selectImg"
               :key="item.opernName"
               :label="item.opernName"
               :value="item.picturePath">
               <span style="float: left;width:75%">{{ item.opernName }}</span>
               <el-popover trigger="hover" placement="right">
                 <img :src="item.picturePath" width="200px" height="180px">
                 <div slot="reference">
                   <img :src="item.picturePath" style="width:50px;margin-top:-10px;padding:4px;">
                 </div>
               </el-popover>
             </el-option>
           </el-select>          
        </div>
        <el-button class="edit" type="primary" @click="back">取消</el-button>
        <el-button class="edit" type="primary" @click="editform(this.item)">修 改</el-button>
    </el-dialog>
     <el-dialog :visible.sync="imgdalog">
       <form>
       <img style="margin-left:8%;width:660px;height:575px;" :src="mybookMsg.illustration">
       </form>
     </el-dialog>


  <el-dialog size='large' style="width:660px;margin:0 auto;margin-top:-5%;overflow:hidden" :before-close="back" title="新增曲谱" :visible.sync="addsongVisible">
        <p style="margin-left:12%;margin-top:-20px;margin-bottom:5px;;font-size:1.1em">添加曲谱xml文件</p>
        <div style="height:270px;width:550px;margin-left:-30px;">
          <span style="font-size: 1.1em;font-family: Hiragino Sans GB;margin-left:85px;"></span>
          <img v-show="showadd2" class="inputimg" style="width:400px;height:200px;" src="../assets/xmlupload.png">
          <input v-show="showinput2" class="input" style="width:400px;height:200px;" type="file" @change="handleXml">
          <div v-if="preview2" 
          style="width:400px;height:200px;padding:5px; border:solid;border-color:#97a8be; border-radius:10px;display:inline-block" >
            <p style="margin-left:16%;
               font-size: 1.5em;font-family: Hiragino Sans GB;">
               《{{file.name}}》就绪</p>
          <el-button type="primary" style="margin-left:30%" @click="showXml">预览</el-button>
          <el-button type="danger">删除</el-button>
        </div>

        <p v-if="preview2" style="margin-left:73%">点击图片更改插图</p>
        <p v-if="!preview2" style="margin-top:40%;margin-left:73%">点击图片更改插图</p>
      </div>
      <el-form style="float:left;width:310px;" :model="addsongForm">
      <el-form-item required label="曲名" :label-width="formLabelWidth">
        <el-input v-model="addsongForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item required label="英文名" :label-width="formLabelWidth">
        <el-input v-model="addsongForm.englishName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item required label="页码" :label-width="formLabelWidth">
          <el-input-number style="margin-right:80px" v-model="addsongForm.pageNumber"></el-input-number>
        </el-form-item>
    </el-form>
    <div style="margin-bottom:10px;">
          <span style="font-size: 1.1em;font-family: Hiragino Sans GB;margin-left:15px;color:white">添加</span>
            <img v-show="showadd" class="inputimg" src="../assets/addimg.png">
            <input v-show="showinpt" class="input" type="file"  @change="handleFile">
            <img v-if="preview" :src="this.dataURL" style="width:130px; height:130px;padding:5px; border:solid;border-color:#97a8be; border-radius:10px;" >
            <p v-if="!preview" style="margin-top:120px;"></p>
          </div>
        <div style="display:inline-block;width:220px;">
           <el-select @change="changeImg2" v-model="c" filterable placeholder="选择图片设为插图">
             <el-option
               v-for="item in this.selectImg"
               :key="item.opernName"
               :label="item.opernName"
               :value="item.picturePath">
               <span style="float: left;width:75%">{{ item.opernName }}</span>
               <el-popover trigger="hover" placement="right">
                 <img :src="item.picturePath" width="200px" height="180px">
                 <div slot="reference">
                   <img :src="item.picturePath" style="width:50px;margin-top:-10px;padding:4px;">
                 </div>
               </el-popover>
             </el-option>
           </el-select>          
        </div>
      <el-button class="btn" @click="back">取消</el-button>
      <el-button class="btn" type="primary" @click="submitAdd()">确定</el-button>
  </el-dialog>


    <div style="margin:0 auto" class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="pageNumber"
        :page-size="option.size"
        :current-page="option.page"
        @current-change="newPage=>{ page = newPage}">

      </el-pagination>
    </div>
  </div>

<!-- 显示 -->
<el-dialog :visible.sync="xmldalog1" size="large" :before-close="handleClose1" >
<div  style="width:800px;height:600px;overflow:hidden;margin:0 auto">
  <div style="width:818px;height:100%;overflow-y: scroll;overflow-x: hidden;" :id="this.xmlkey"></div>
</div>
</el-dialog> 
<!--  预览  -->
<el-dialog :title="this.xmlname" :visible.sync="xmldalog" size="large" :before-close="handleClose2" >
<div  style="width:800px;height:600px;overflow:hidden;margin:0 auto">
  <div style="width:818px;height:100%;overflow-y: scroll;overflow-x: hidden;" :id="this.xmlkey2"></div>
</div>
</el-dialog> 
<!-- 截图 -->
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
import { OSMD } from "opensheetmusicdisplay";
import vueCropper from "vue-cropper";
  export default {
    created: function(){
      // console.log(this.$route.params.id)
      // console.log(bookindex);
      const bookindex = this.$route.params.id;
      this.pageInit(bookindex);
    },
    data() {
      return {
        path:'',
        mybookId: 156,
        length:1,
        deleteId:0,
        tagName: '',
        index:0,
        bookMsg: [],
        bookMsg1:[],
        selectImg:[],
        mybookMsg: {
          opernId:'',
          name:'',
          englishName:'',
          bookId:'',
          pageNumber:'',
          opernPath:'',
          illustration:''
        },
        addsongForm: {
          name: '曲名',
          englishName: 'English Name',
          bookId: '1',
          pageNumber: '1',
          opern: '',
          illustration: ''
        },
        addsongForm2:{
          opernName:'',
          opernEnglishName:'',
          opernPageNumber:'',
          illustrationPath:'',
          opernPath:''
        },
        dataURL:'',
        dataURL0:'',
        xmlURL:'',
        preview:false,
        preview2:false,
        dialogImageUrl:'',
        dialogVisible: false,
        pageNumber: 0,
        dialogFormVisible: false,
        addsongVisible: false,
        value: {},
        item: 1,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '66px',
        page:1,
        option: {
          size:10,
          page:1
        },
        j:0,
        ok:false,
        showUpload:false,
        showadd:true,
        showadd2:true,
        showinpt:true,
        showinput2:true,
        imgdalog:false,
        xmldalog:false,
        xmldalog1:false,
        c:'',
        loading:false,
        xmlkey:1,
        xmlkey2:1,
        xmlname:'',
        i:0,
        x:0,
        // 截图
        cropperVisible:false,  
        option1: {
          img: '',
          size: 0.8,
          autoCrop:true,
          autoCropWidth: 300,
          autoCropHeight: 270,
          fixed: true,
          fixedNumber: [10, 9]
        },
     }
   },
   watch:{
    page(){
      this.option.page = this.page;
      this.$http.get('/api/pc/opern_list_by_page?bookId='+this.mybookId+'&page='+this.option.page+'&number='+this.option.size)
      .then((res3)=>{
         // console.log(res3);
         this.bookMsg1 = res3.data.data.opernList;
      });
    }
   },
    methods: {
       pageInit(bookindex){
        this.loading = true;
        this.$http.get('/api/pc/book_list').then(res => {
          console.log(res)
          this.mybookId = bookindex;
          this.length = res.data.data.length;
          for(var i = 0;i<this.length;i+=1)
          {
            if(res.data.data[i].id == bookindex){
              this.tagName = res.data.data[i].alias;
            }
          }
          console.log('bookId',bookindex);
          this.path = '/book/'+bookindex
          Hub.$emit('listenToChild', this.tagName);
          Hub.$emit('listenToChild2', bookindex);
          Hub.$emit('listenToChild3', this.path);

        }).then(() => {
            this.$http.get('/api/pc/opern_list?bookId=' + this.mybookId).then(res2 => {
            this.bookMsg = res2.data.data;
            this.pageNumber = res2.data.data.length;
            console.log(this.bookMsg)
            });
            this.$http.get('/api/pc/opern_list_by_page?bookId='+this.mybookId+'&page='+this.option.page+'&number='+this.option.size).then((res3)=>{
              console.log(res3)
            this.bookMsg1 = res3.data.data.opernList;
            console.log(this.bookMsg1)
            }).then(()=>{
              this.loading = false;
            });
            
        });

      },
      musicxml(m){
        console.log(m);
        this.xmlkey = m.opernPath;
        // console.log(this.xmlkey);
        this.xmldalog1 = true;
        setTimeout(() => {
          if(m.opernPath === "0"){
          console.log("0")
        }
        else{
        var osmd = new OSMD(String(this.xmlkey));
        osmd
        .load(m.opernPath)
        .then(
          () => osmd.render(),
          (err) => console.err(err)
          )
        .then(
          () => console.log("Sheet music displayed."),
          (err) => console.err(err)
          );
        }
        }, 10);
      },
      musicxml1(m){
        console.log(m)
      },
       showXml(){
        console.log(typeof this.xmlURL);
        this.xmldalog = true;
         setTimeout(() => {
         if(this.xmlURL === "0"){
          console.log("0")
        }
        else{
        var osmd2 = new OSMD(String(this.xmlkey2));
        osmd2
        .load(this.xmlURL)
        .then(
          () => osmd2.render(),
          (err) => console.err(err)
          )
        .then(
          () => console.log("Sheet music displayed."),
          (err) => console.err(err)
          );
        }
        }, 10);
      },
      handleClose1(done){
        this.xmldalog1 = false;
        document.getElementById(this.xmlkey).innerHTML = "";
        // console.log(this.xmlkey)
      },
      handleClose2(done){
        this.xmldalog = false;
        document.getElementById(this.xmlkey2).innerHTML = "";
        // console.log(this.xmlkey2)
      },
      handleClick(i) {
        this.dialogFormVisible = true;
        this.mybookMsg.opernId = this.bookMsg1[i].opernId;
        this.mybookMsg.name = this.bookMsg1[i].opernName;
        this.mybookMsg.englishName = this.bookMsg1[i].opernEnglishName;
        this.mybookMsg.bookId = this.mybookId;
        this.mybookMsg.pageNumber = this.bookMsg1[i].opernPageNumber;
        this.mybookMsg.opernPath = this.bookMsg1[i].opernPath;
        this.mybookMsg.illustration = this.bookMsg1[i].illustrationPath;
        this.item = i;
        this.j = i;
        if(this.addsongVisible === false){
          this.showUpload = false;
        };
        this.$http.get('/api/pc/illustration').then((res)=>{
          this.selectImg = res.data.data;
        });
        
      },
      deletesongs(m){
        console.log(m)
        this.deleteId = this.bookMsg1[m].opernId;
        console.log(this.deleteId)
        this.$http({
          method: 'delete',
          url: '/api/pc/opern',
          data: {
            opernId : this.deleteId
          }
      }).then(()=>{
        this.$message({
            type: 'success',
            message: '删除成功!'
          });
      });
      this.dialogFormVisible = false;
      this.bookMsg1.splice(m,1);
      },
      editform(){
      // console.log( this.mybookMsg.illustration)
      let formdata2 = new FormData()
      formdata2.append('opernId', this.mybookMsg.opernId)
      formdata2.append('name', this.mybookMsg.name)
      formdata2.append('englishName', this.mybookMsg.englishName)
      formdata2.append('bookId', this.mybookMsg.bookId)
      formdata2.append('pageNumber', this.mybookMsg.pageNumber)
      formdata2.append('opernPath', this.mybookMsg.opernPath)
      if(typeof this.mybookMsg.illustration === "object"){
        // console.log('1');
        formdata2.append('illustration', this.mybookMsg.illustration) 
      }else{
        formdata2.append('illustrationPath', this.mybookMsg.illustration)
      }
     console.log(formdata2);
        this.$http({
          method: 'post',
          url: '/api/pc/opern',
          data:formdata2
       }).then(()=>{
        console.log(typeof this.mybookMsg.illustration)
        if(typeof this.mybookMsg.illustration === "object"){
          console.log('1');
          this.bookMsg1[this.j].illustrationPath = this.dataURL;
          // console.log(this.dataURL)
        }else{
          console.log('2');
          this.bookMsg1[this.j].illustrationPath = this.mybookMsg.illustration;
          // console.log(this.bookMsg1[this.j].illustrationPath)
        }
        this.bookMsg1[this.j].opernName = this.mybookMsg.name;
        this.bookMsg1[this.j].opernEnglishName = this.mybookMsg.englishName ;
        this.bookMsg1[this.j].opernPageNumber = this.mybookMsg.pageNumber ;
        
        }).then(()=>{
          this.dataURL = '';
          
        });
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.dialogFormVisible = false;
        this.preview = false;
      },
      changeImg(){
        this.mybookMsg.illustration = this.c;
        this.dataURL = this.c;
        // console.log(typeof this.c);
      },
      changeImg2(){
        console.log(this.c)
      this.addsongForm.illustration = this.c;
      this.preview = true;
      this.dataURL = this.c
      this.showadd = false;
      },
      editHandleFile(e) {
      this.file = e.target.files[0];
      this.mybookMsg.illustration = this.file;
      this.preview = true;
      this.dataURL = URL.createObjectURL(this.file);
      this.showadd = false;
      this.ok = false;
    },
       
      submitAdd(){ 
        if( this.xmlURL === '')
      {
        alert("请添加曲谱xml")
      }else if(this.dataURL === ''){
        alert("请添加图片")
      }else{
          console.log(this.$route.params.id)
        console.log('i',this.i)
        var x= 0;
       this.addsongForm.bookId = this.mybookId; 
       this.addsongVisible = false;
       this.addsongForm2.opernName = this.addsongForm.name;
       this.addsongForm2.opernEnglishName = this.addsongForm.englishName;
       this.addsongForm2.illustrationPath = this.dataURL;
       this.addsongForm2.thumbnail = this.dataURL;
       this.addsongForm2.opernPath = this.xmlURL;
       this.addsongForm2.opernPageNumber = this.addsongForm.pageNumber;
       if(this.i === 0){
         this.bookMsg1.unshift(this.addsongForm2);
         var x = 1;
       }
       this.i = 1;
      let formdata = new FormData()
      formdata.append('name', this.addsongForm.name)
      formdata.append('englishName', this.addsongForm.englishName)
      formdata.append('bookId', this.addsongForm.bookId)
      formdata.append('pageNumber', this.addsongForm.pageNumber)
      formdata.append('opern', this.addsongForm.opern)
      if(typeof this.addsongForm.illustration === "object"){
        // console.log('1');
        formdata.append('illustration', this.addsongForm.illustration) 
      }else{
        formdata.append('illustrationPath', this.addsongForm.illustration)
      }
        this.$http({
          method: 'post',
          url: '/api/pc/opern',
          data: formdata
       }).then(()=>{
         this.back();
         this.showadd = true;
         console.log(x)
         if(x === 0){
          this.pageInit(this.$route.params.id);
          this.i = 0;
         }
         
       });
      }
      
      },
      // 截图
      getCrop () {
      console.log("1")
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
      console.log('my',this.dataURL)
      this.preview = true;
      this.addsongForm.illustration = blob;
      this.cropperVisible = false;
    },10)
      
    },
     back(){
         this.dataURL = ''; 
         this.preview = false;
         this.preview2 = false;
         this.dataURL = '';
         this.addsongVisible=false;
         this.dialogFormVisible = false;
         this.showUpload = false;
         this.ok = false;
         this.showinput2 = true;
         this.c = '';
         this.addsongForm.name = "曲名";
         console.log(this.addsongForm)
     },
     handleFile(e) {
      this.dataURL = '';
      this.file = e.target.files[0];
      this.dataURL0 = URL.createObjectURL(this.file);
      this.showadd = false;
      this.cropperVisible = true;
      setTimeout(()=>{
        this.$refs.cropper.startCrop()
      },10);
      
      // this.$refs.cropper.startCrop();
    },
    handleXml(e2){
      var name = /.xml$/;
      this.file = e2.target.files[0];
      this.addsongForm.opern = this.file;
      this.addsongForm.name = this.file.name.replace(name,'');
      this.xmlURL = URL.createObjectURL(this.file);
      this.xmlkey2 = this.xmlURL;
      this.xmlname = this.addsongForm.name;
      this.preview2 = true;
      this.showadd2 = false;
      this.showinput2 = false;
      console.log(this.xmlkey2);
    },
    deleteImg(){
      this.addsongForm.illustration = '';
      this.dataURL = '';
      this.preview = false;
      this.showUpload = true;
      this.showadd = true;
      this.file = {};
      console.log(this.file);
      this.showinpt = true;
    },
    addsong(){
      this.$http.get('/api/pc/illustration').then((res)=>{
        this.selectImg = res.data.data;
      });

      this.back();
      this.addsongVisible = true;
      this.showUpload = true;
      this.showadd = true;
      this.showadd2 = true;
    },
    cancelImg(){
      this.mybookMsg.illustration = '';
      this.showUpload = true;
      this.showadd = true;
    }
    },
    components: {
    vueCropper
  },

}
</script>
<style>
#book{
  padding-top: 40px;
}
.bookcontainer{
  padding: 100px;

}
.handlebutton{
  float: right;
  padding-top: 40px;
  padding-right: 15%;
}
.imgsmall{
  display: inline-block;
  padding-top: 7px;
}
.namespan{
  position: relative;
  display: inline-block;
  width: 150px;
  padding-bottom:10px; 
}
.namespan{
  cursor:pointer ;
}
.view{
  margin-left:100px;
  margin-top: -20px;
}
.formimg{
   border: 2px solid;
   border-radius: 10px;
    right: 20px;
   width: 200px;
    height: 180px;
   padding: 10px;
   right: 20px;
   position: absolute;
   z-index: 1
}

.formimg:hover{
  background-color: rgba(111,111,111,0.3);
}
.formimg2{
   border: 2px solid;
   border-radius: 10px;
   padding: 10px;
   right: 20px;
   width: 200px;
   height: 180px;
   position:absolute;
   z-index: 4;
   background-color: rgba(111,111,111,0.3);
}
.upLoad{
   border: 2px solid;
   border-radius: 10px;
   padding: 10px;
  right: 20px;
   width: 200px;
   height: 180px;
   position:absolute;
   z-index: 8;
}
.myupload{
  margin-left:140px;
  margin-bottom: 40px;
}
.input{
  opacity: 0;
  width: 100px;
  height: 100px;
  margin-left: 10px;
  position: absolute;
  z-index: 1;
  padding: 10px;
}
.inputimg{
  width: 100px;
  height: 100px;
  margin-left: 10px;
  position: absolute;
  z-index: 0;
  border: 2px dashed;
  border-radius: 10px;
  border-color:rgba(32,160,255,0.5);
  padding: 10px;
}
.input:hover{
  cursor:pointer ;
}
.editimg{
  margin-left:16%;
  margin-top: 13%;
  border:none;
}
.btn{
margin-top: 28px;
margin-bottom: 20px;
margin-left: 20px;
float: right;
}
.edit{
  margin-left: 60%;
  margin-top: 50px;
  margin-bottom: -25px;
}
.block{
  text-align: center;
  padding: 30px;
}
</style>
