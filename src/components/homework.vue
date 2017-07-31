<template>
<div>
 <el-button v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="^-^加载中"
            type="primary" @click="addWork" 
            class="homeworkbtn">布置作业</el-button>
 <div class="container">
  <el-tabs style="" v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane  v-for="(myId,index) in userId" :key="myId" :label="myId.name" :name="String(myId.id)">
      <template id="tableme">
      <el-table
        :data="homeworkList1"
        v-loading.body="loading"
        element-loading-text="^-^加载中"
        border
        stripe
        style="width:1100px;margin:0 auto;overflow:hidden">
        <el-table-column
            type="index"
            label="序号"
            width="70">
          </el-table-column>
        <el-table-column
          prop="homeworkId"
          label="作业号"
          width="70">
        </el-table-column>
        <el-table-column
          prop="opernName"
          label="曲名"
          width="170">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书名"
          width="170">
        </el-table-column>
        <el-table-column
          prop="pageNumber"
          label="页码"
          width="80">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="演奏时间"
          width="170">
        </el-table-column>
        <el-table-column
          prop="star"
          label="得分"
          width="60">
        </el-table-column>
        <el-table-column
          prop=""
          label="音频下载"
          width="110">
          <template scope="scope">
            <el-button @click="downLoad(scope.$index)" type="text" size="small">音频下载</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="数据下载"
          width="110">
          <template scope="scope">
            <el-button @click="downLoad2(scope.$index)" type="text" size="small">数据下载</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template scope="scope">
            <el-button @click="deleteWork(scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </template>
    </el-tab-pane>
  </el-tabs>
  </div>

   <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="pageCount"
        :page-size="option.size"
        :current-page="option.page"
        @current-change="newPage=>{ page = newPage}">
        
      </el-pagination>
    </div>
<!-- 布置作业对话框 -->
   <el-dialog size="large" style="width:1200px;margin:0 auto;" :before-close="noput" :visible.sync="dialogFormVisible">
  <el-form style="padding:0 80px;" :model="form" :inline="true">
    <el-form-item required label="书籍">
      <el-select @change="handle(a)" v-model="a" placeholder="请选择书名">
        <el-option
          v-for="item in this.bookList"
          :key="item.id"
          :label="item.alias"
          :value="item.id"
          >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item required label="曲谱">
      <el-select @change="handle2(b)" v-model="b" placeholder="选择选中书籍中的曲谱">
        <el-option
          v-for="item in this.bookMsg"
          :key="item.opernId"
          :label="item.opernName"
          :value="item.opernId"
          >
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
        <span>练习</span>
        <el-input-number @change="getData" v-model="num" :min="1" :max="10"></el-input-number>
        <span>遍</span>
    </el-form-item> 
    <el-form-item style="">
      <el-button type="primary"  @click="putIn">发布</el-button>
    </el-form-item>
     
  </el-form>
  
  <el-table 
        :data="form2"
        border
        stripe
        >
        <el-table-column
            type="index"
            label="序号"
            width="60px">
          </el-table-column>
        <el-table-column
          prop="homeworkId"
          label="作业号"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="opernName"
          label="曲名"
          width="265px">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书名"
          width="265px">
        </el-table-column>
        <el-table-column
          prop="pageNumber"
          label="页码"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          label="练习遍数 "
          width="140px">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="150px">
          <template scope="scope">
          <el-button @click="editwork(scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="cancle(scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
  <div slot="footer" class="dialog-footer">
    <el-button @click="noput">取 消</el-button>
    <el-button type="primary" @click="confirmPut">确 定</el-button>
  </div>
</el-dialog>

<!-- 布置作业-编辑对话框 -->
   <el-dialog size="large" style="width:1200px;margin:0 auto;" :before-close="back" :visible.sync="editFormVisible">
  <el-form style="padding:0 80px;" :model="form3" :inline="true">
    <el-form-item required label="书籍">
      <el-select @change="handle(c)" v-model="c" placeholder="请选择书名">
        <el-option
          v-for="item in this.bookList"
          :key="item.id"
          :label="item.alias"
          :value="item.id"
          >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item required label="曲谱">
      <el-select @change="handle2(d)" v-model="d" placeholder="选择选中书籍中的曲谱">
        <el-option
          v-for="item in this.bookMsg"
          :key="item.opernId"
          :label="item.opernName"
          :value="item.opernId"
          >
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
        <span>练习</span>
        <el-input-number @change="editTimes" v-model="num" :min="1" :max="10"></el-input-number>
        <span>遍</span>
    </el-form-item> 
    <el-form-item style="">
      <el-button type="primary"  @click="back">取消</el-button>
      <el-button type="primary"  @click="confirm">确定</el-button>
    </el-form-item>
     
  </el-form>
  </el-dialog>

  </div>
</template>

<script>
import Hub from '../Hub.js';
  export default {
    data() {
      return {
        path:'',
         userId : [],
         homeworkList: [],
         homeworkList1:[],
         bookList: [],
         bookMsg: [],
         bookName: '',
         pageNumber: '',
         opernName:'',
         ipadId: 1,
         viewData: [{
           repeatCount:'',
           opernId:'',
           bookName:'',
           opernName:'',
           ipadId:'',
           pageNumber:''
         }],
         activeName2: '1',
         dialogFormVisible: false,
         editFormVisible:false,
         form: {},
         form2:[],
         form3:{},
         num: '1',
         a:'',
         b:'',
         c:'',
         d:'',
         page:1,
         option: {
          size:10,
          page:1
         },
         pageCount:1,
         loading:false,
         fullscreenLoading:false,
         noget:false,
         editValue:1

      }
    },
    created(){
      this.pageInit();
    },
    watch:{
     page(){
       this.option.page = this.page;
       console.log(this.ipadId)
       // console.log(this.page)
       this.$http.get('/api/pc/homework_recording_list_by_page?ipadId='+this.ipadId+'&page='+this.option.page+'&number='+this.option.size)
       .then((res3)=>{
          // console.log(res3);
          this.homeworkList1 = res3.data.data.homeworkList;
       });
     },
     ipadId(){
      this.option.page = 1;
      console.log(this.ipadId)
      this.$http.get('/api/pc/homework_recording_list_by_page?ipadId='+this.ipadId+'&page='+this.option.page+'&number='+this.option.size)
       .then((res3)=>{
          // console.log(res3);
          this.homeworkList1 = res3.data.data.homeworkList;
       }).then(()=>{
            this.loading = false
       });
     }
    },
    methods:{
      pageInit(){ 
      this.fullscreenLoading = true;
       this.$http.get('/api/pc/ipad_user').then(res => {
         this.userId = res.data.data;
         // console.log(this.userId);
       });

       this.$http.get('/api/pc/homework_recording_list_by_page?ipadId='+this.ipadId+'&page='+this.option.page+'&number='+this.option.size)
       .then((res3)=>{
          // console.log(res3);
          this.homeworkList1 = res3.data.data.homeworkList;
       }).then(()=>{
         this.fullscreenLoading = false;
       });

       this.$http.get('/api/pc/homework_recording_list?ipadId=1').then(res1 => {
       this.homeworkList = res1.data.data;
       this.pageCount =parseInt( res1.data.data.length );
       });

       this.ipadId = 1;
       this.path = '/homework/';
       Hub.$emit('listenToChild', '作业管理');
       Hub.$emit('listenToChild3', this.path);
      },

      handleClick(tab) {
        this.loading = true;
        this.$http.get('/api/pc/homework_recording_list?ipadId=' + tab.name).then(res3 => {
          this.homeworkList = res3.data.data;
          this.pageCount =parseInt(this.homeworkList.length );
          this.ipadId = tab.name;
          //console.log(tab.name);
          //console.log(this.homeworkList);
          });

      },
      downLoad(j){
        if(this.homeworkList1[j].playbackPath === null){
          console.log('无文件！');
        }
        else{
          window.location.href=this.homeworkList1[j].playbackPath;
        }
      },
      downLoad2(j){
        if(this.homeworkList1[j].algorithmPath === null){
          console.log('没有文件呀');
        }
        else{
          window.location.href=this.homeworkList1[j].algorithmPath;
        }     
      },
      deleteWork(j){
        this.$http({
          method: 'delete',
          url: '/api/pc/homework',
          data: {
            homeworkId: this.homeworkList1[j].homeworkId
        }
       }).then(() =>{
          this.homeworkList1.splice(j,1);
          console.log('ok')
          this.$message({
            message: '作业删除成功！',
            type: 'success'
          });
       });

      },
      addWork(){
        this.dialogFormVisible = true;
        this.form2 = [];
        this.$http.get('/api/pc/book_list').then(res2 => {
          this.bookList = res2.data.data;
          this.number = res2.data.data.length;
       });
      },
      handle(model){
         // console.log('a',model)
         this.$http.get('/api/pc/opern_list?bookId=' + model).then(res4 => {
            this.bookMsg = res4.data.data;
            //console.log(this.bookMsg);
        });
        for(var j in this.bookList){
            if(model === this.bookList[j].id)
              this.bookName = this.bookList[j].alias;
          }
        this.b = '';
        this.d = '';
        this.num = 1;
        //console.log(this.bookName);

      },
      handle2(model){
       // console.log('b',model);
        for(var n in this.bookMsg){
            if(model === this.bookMsg[n].opernId)
              this.pageNumber = this.bookMsg[n].opernPageNumber;
          }
          for(var n in this.bookMsg){
            if(model === this.bookMsg[n].opernId)
              this.opernName = this.bookMsg[n].opernName;
          }
        //console.log(this.pageNumber);
      },
      getData(value){
        this.viewData[0].repeatCount = value;
        this.viewData[0].opernId = this.b;
        this.viewData[0].bookName = this.bookName;
        this.viewData[0].opernName = this.opernName;
        this.viewData[0].ipadId = this.ipadId;
        this.viewData[0].pageNumber = this.pageNumber;
        // console.log(this.viewData[0]);
      },
      confirmPut(){
        // var j = 0;
        // for(var i in this.homeworkList)
        // {
        //   if(this.viewData[0].opernId === this.homeworkList[i].opernId)
        //     {j = 1;} 
        // };
        // if(j === 1)
        //   {alert('此作业已发布过！不可重复发布')}
        // else
        //   {
            this.form2 = this.viewData;
          // };

        this.$http({
          method: 'post',
          url: '/api/pc/homework',
          data: this.viewData[0]
       }).then((res) =>{
          // console.log("id",res)
          this.viewData[0].homeworkId = res.data.data;
          this.homeworkList1.splice(0,0,this.viewData[0]);
          this.$message({
            message: '作业布置成功！',
            type: 'success'
          });

          this.noput();
       });

      },
      noput(){
        this.dialogFormVisible = false;
          this.a = '';
          this.b = '';
          this.num = 1;
      },
      putIn(){
        var j = 0;
        this.getData(1);
        // for(var i in this.homeworkList)
        // {
        //   if(this.viewData[0].opernId === this.homeworkList[i].opernId)
        //   {
        //       j = 1;
        //   }
        // };
        // if(j === 1)
        // {
        //   alert('此作业已发布过！不可重复发布')
        // }
        // else
        // {
          this.form2 = this.viewData;
        // };
        this.form = {};
        
      },
      cancle(){
        this.form2 = [];     
        this.a = '';
        this.b = '';
        this.num = 1;
       // this.dialogFormVisible = false;
      },
      editwork(){
        this.editFormVisible = true;
        this.c = this.a;
        this.d = this.b;
      
      },
      editTimes(value2){
        this.editValue = value2;
        // console.log(this.editValue)
      },
      confirm(){
        this.getData(this.editValue);
        this.editFormVisible = false;
        this.form = this.form3;
        this.a = this.c;
        this.b = this.d;
        this.handle(this.a);
        this.handle2(this.b);
      },
      back(){
        this.editFormVisible = false;
        this.a = '';
        this.c = '';
        this.d = '';
      }

    },
  }
</script>

<style>
  .container{
    padding:0 100px 60px 100px;
   margin-top: -10px
  }
  .homeworkbtn{
    display: inline-block;
     margin-left: 77%;
     margin-bottom: -20px;
     margin-top: 80px;
     z-index: 14;
  }
  .block{
     margin-top: -40px;
     margin-bottom: 40px;
  }

</style>