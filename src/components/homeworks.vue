<template>
  <div class = "main">
    <el-breadcrumb  class="header" separator=">" v-show="showHeader">
      <el-breadcrumb-item :to="{ path: '/bookLists' }"  class="items" @click="showHeader=false">书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item  :to="{ path: '/homeworks' }"   class="items" >作业管理</el-breadcrumb-item>
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
    <!--<div v-for="(user,index) in ipadUser" :key="user" > 
      <el-button @click = "editForm(index)" class="user-name">{{user.name}}</el-button>
    </div>-->
    <!--<div  class="search">
        <el-select v-model="select" slot="prepend" placeholder="请选择"  >
          <el-option label="全部" value="3" ></el-option>
          <el-option label="按昵称" value="1" ></el-option>
          <el-option label="按曲名" value="2" ></el-option>
        </el-select><el-select
          v-model="input5"
          :disabled="dis"
          filterable
          allow-create
          placeholder="输入或选择"><el-option
            v-for="item in options5"
            :key="item[a+'Id']"
            :label="item[a+'Name']"
            :value="item"
            >
          </el-option>
        </el-select><el-button
         :disabled="input5?false:true" type="primary" icon="search" @click="searchRecordinglist">搜索</el-button>
      </el-input>
    </div>-->
 
    
    <!--<el-button type="primary" @click="dialogFormVisible = true" v-show="showButton">布置作业</el-button>
    <el-dialog title="" :visible.sync="dialogFormVisible" size="large">
      <el-form >
        <el-form-item label="书籍：" :label-width="formLabelWidth">
          <el-select v-model="bookId" placeholder="选择书名"  >
            <el-option v-for="book in bookLists" :key="book" :label="book.name" :value="book.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="曲谱：" :label-width="formLabelWidth">
          <el-select v-model="opernId" placeholder="请选择曲谱名称">
            <el-option v-for="opern in opernLists" :key="opern" :label="opern.opernName" :value="opern.opernId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="练习：" :label-width="formLabelWidth" class="number">
          <el-input-number v-model="precticeTimes"  :min="1" >1</el-input-number>
          <span>次</span>
        </el-form-item>
        <el-button type="primary" @click="dialogForm">发 布</el-button>
      </el-form>
      <el-table :data="homeworks">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column property="id" label="作业号" width="100"></el-table-column>
        <el-table-column property="opernName" label="曲名" width="250"></el-table-column>
        <el-table-column property="bookName" label="书名" width="250"></el-table-column>
        <el-table-column property="repeatCount" label="练习遍数"></el-table-column>
        <el-table-column  label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="editTable(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="addHomeworks">确 定</el-button>   
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="dialogFormVisible1" size="small">
      <el-form >
        <el-form-item label="书籍：" :label-width="formLabelWidth">
          <el-select v-model="bookId1" placeholder="选择书名"  >
            <el-option v-for="book in bookLists" :key="book" :label="book.name" :value="book.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="曲谱：" :label-width="formLabelWidth">
          <el-select v-model="opernId1" placeholder="请选择曲谱名称">
            <el-option v-for="opern in opernLists1" :key="opern" :label="opern.opernName" :value="opern.opernId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="练习：" :label-width="formLabelWidth" class="number">
          <el-input-number v-model="precticeTimes1"  :min="1" >1</el-input-number>
          <span>次</span>
        </el-form-item>
        <el-button type="primary" @click="dialogFormVisible1=false">取 消</el-button>
        <el-button type="primary" @click="handleEdit(editIndex)">保 存</el-button>
      </el-form>
    </el-dialog>-->
    <!--<el-button type="primary" @click="sortBy='wechat'" style="margin-left:15px;">按昵称排序</el-button>
    <el-button type="primary" @click="sortBy='time'">按时间排序</el-button>-->
    <div class="search" >
      <el-tag
        v-for="tag in tags"
        :key="tag"
        :closable="true"
        :close-transition="true"
        v-show = "showTag"
        @close = "handleTagClose"
        >
        {{tag}}
      </el-tag>
      <p class="count">当前共有{{opernNumber}}条数据</p>
      <div class="searchInput">
        <el-autocomplete
          v-model="input5"
          :fetch-suggestions="querySearch"
          placeholder="请输入昵称或曲名"
          :trigger-on-focus="false"
          @select="handleSelect"
          icon="search"
          :on-icon-click="searchRecordinglist"
        ></el-autocomplete>
      </div>
      
    </div>
    <el-table 
      :data="form"
      border
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="fullscreenLoading"
      :row-class-name="tableRowClassName">>
      <el-table-column
        type="index"
        label="序号"
        width="90">
      </el-table-column>
      <el-table-column
        label="微信昵称"
        width="120">
        <template scope="scope">
          <el-button @click="input1={wechatId:scope.row.wechatId,wechatName:scope.row.wechatName,type:scope.row.type}">{{scope.row.wechatName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="身份">
        <template scope="scope">
          <span :type="scope.row.type">{{scope.row.type==1?'老师':'家长'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="childName"
        label="孩子名称">
      </el-table-column>
      <el-table-column
        label="曲名"
        width="250">
        <template scope="scope">
          <el-button @click="input1={opernId:scope.row.opernId,opernName:scope.row.opernName}">{{scope.row.opernName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="演奏时间">
      </el-table-column>
      <el-table-column
        prop="star"
        label="得分">
      </el-table-column>
      <el-table-column
        label="音频下载">
        <template scope="scope">
          <a :href="scope.row.playbackPath" :download="scope.row.opernName+'音频'">音频下载</a>
        </template>
      </el-table-column>
      <el-table-column
        label="数据下载">
        <template scope="scope">
          <a :href="scope.row.algorithmPath" :download="scope.row.opernName+'数据'">数据下载</a>
        </template>
      </el-table-column>
      <el-table-column
        label="excle下载">
        <template scope="scope">
          <el-button @click="excleDownload(scope.$index)" type="text" size="small">excle下载</el-button>
          <!-- <a :href="scope.row.algorithmPath" :download="scope.row.opernName+'数据'">数据下载</a> -->
        </template>
      </el-table-column>
    </el-table>
    <!--<homeworkList :form="form"     element-loading-text="拼命加载中"
    v-loading="fullscreenLoading"></homeworkList>-->
    <el-dialog
      title="请登录"
      :visible.sync="showLogin"
      size="tiny"
      :show-close="false"
      top="40%"
      >
      <span>您还未登录，请登录</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeShowLogin" style="font-size:14px;">确 定</el-button>
      </span>
    </el-dialog>
    <div class="block" >
      <el-pagination
        layout="prev, pager, next"
        :total="opernNumber"
         @current-change="currentPage=>{page = currentPage}"
         :current-page="page"
         :page-size="option.number"
         >
      </el-pagination>
    </div>
  </div>
</template>

<script>


  import router from '../router'
  export default {
    name: 'homeworks',

    data() {
      return {    
        // ipadUser:[],
        // dialogFormVisible: false,
        // dialogFormVisible1:false,
        // formLabelWidth :'100px',
        // bookLists:[],
        // opernLists:[],
        // opernLists1:[],
        // editIndex:'',
        // ipadId:'',
        // bookId:'',
        // opernId:'',
        // precticeTimes:'',
        // bookId1:'',
        // opernId1:'',
        // precticeTimes1:'',
        // showButton:false,
        // homework:{},
        // homeworks:[],
        
        form:[],
        page:1,
        option:{
          page:1,
          number:15
          },
        opernNumber:0,
        sortBy:'time',
        fullscreenLoading:false,
        input5:'',
        value1:'',
        value2:'',
        input:'',
        input1:'',
        // select:'',
        // select1:'',
        // options5: [],
        // dis:true,
        wechatNameList:[],
        opernNameList:[],
        filter:false,
        a:'',
        tags:[],
        showTag:false,
        infoClass:'info-class',
        preClass:'info-class',
        showHeader:true,
        showLogin:false,
        userName:'未登录'
      }
    },

    watch:{
      page() {
        var key;
        this.option.page = this.page;
        if(!this.filter) {
          this.$http.get('/recording/time?page='+this.option.page).then( res => {
            if(res.data.errorCode === 2) {
              this.showLogin = true;
            } else if(res.data.errorCode === 0) {
              this.opernNumber = res.data.data.count;
              this.form = res.data.data.recordingList;
            }
          });
        }else {
          if(typeof(this.input) == 'string') {
            // if(this.select1 == 1 ){
            //   key = 'wechat';
            // }else if(this.select1 == 2) {
            //   key = 'opern';
            // }else if(this.select1 == 3) {
            //   key = 'all';
            // }
            this.$http.get('/recording/search_all',{
              params:{
                keyword:this.input,
                page:this.option.page
              }
            }).then(res=>{
                if(res.data.errorCode === 2) {
                  this.showLogin = true;
                } else if(res.data.errorCode === 0) {
                  this.opernNumber = res.data.data.count;
                  console.log('this.opernNumber',this.opernNumber);
                  this.form = res.data.data.recordingList;
                  console.log('res.data.data.recordingList',res.data.data.recordingList);
                }
            });
          } else {
            if(this.input.wechatId){
              this.$http.get('/recording/exact_wechat',{
                params:{
                  type:this.input.type,
                  wechatId:this.input.wechatId,
                  page:this.option.page
                }
              }).then(res=>{
                if(res.data.errorCode === 2) {
                  this.showLogin = true;
                } else if(res.data.errorCode === 0) {
                  this.opernNumber = res.data.data.count;
                  console.log('this.opernNumber',this.opernNumber);
                  this.form = res.data.data.recordingList;
                  console.log('res.data.data.recordingList',res.data.data.recordingList);
                }   
              });
            } else if(this.input.opernId) {
              this.$http.get('/recording/opern',{
                params:{
                  opernId:this.input.opernId,
                  page:this.option.page
                }
              }).then(res=>{
                if(res.data.errorCode === 2) {
                  this.showLogin = true;
                } else if(res.data.errorCode === 0) {
                  this.opernNumber = res.data.data.count;
                  console.log('this.opernNumber',this.opernNumber);
                  this.form = res.data.data.recordingList;
                  console.log('res.data.data.recordingList',res.data.data.recordingList);
                }
              });
            } 
          }

        }
      },
      sortBy() {
        console.log(this.sortBy);
        this.homeworksInit();
      },
      form() {
        this.openFullScreen();
      },
      // select() {
      //   this.input5 = '';
      //   if(this.select) {
      //     this.dis = false;
      //   }
      //   if(this.select == 1) {
      //     this.options5 = this.wechatNameList;
      //     this.a = 'wechat';
      //   }else if(this.select == 2){
      //     this.options5 = this.opernNameList;
      //     this.a='opern'                    
      //   }else {
      //     this.options5 = '';
      //   }
      // },
      input1() {
        this.page = 1;
        this.input = this.input1;
        this.tags = [];
        this.showTag = true;
        this.filter = true;
        if(this.input1.wechatId) {
          this.tags.push(this.input1.wechatName);
          console.log('this.input1',this.input1);
          this.$http.get('/recording/exact_wechat',{
            params:{
              type:this.input1.type,
              wechatId:this.input1.wechatId
              }
          }).then(res=>{
              if(res.data.errorCode === 2) {
                this.showLogin = true;
              } else if(res.data.errorCode === 0) {
                this.opernNumber = res.data.data.count;
                console.log(this.opernNumber);
                this.form = res.data.data.recordingList;
                console.log('res.data.data.recordingList',res.data.data.recordingList);
              }
          });
        }else if(this.input1.opernId) {
          this.tags.push(this.input1.opernName);
          this.$http.get('/recording/opern?opernId='+this.input1.opernId).then(res=>{
              if(res.data.errorCode === 2) {
                this.showLogin = true;
              } else if(res.data.errorCode === 0) {
                this.opernNumber = res.data.data.count;
                this.form = res.data.data.recordingList;
              }

            //console.log('res.data.data.recordingList',res.data.data.recordingList);
          });
        }

      }
    },
    created() {
      this.homeworksInit();
      // this.$http.get('/book_list').then( res => {
      //     this.bookLists = res.data.data;
      //   }); 
      this.Listinit();
      this.openFullScreen();
      this.$http.get('/admin/userinfo').then(res =>{
        if(res.data.data.username) {
          this.userName = res.data.data.username;
          console.log(this.userName);
        }  
      });
    } ,
    methods : {
      openFullScreen() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);
      },
      homeworksInit() {
        // this.$http.get('https://dev.mamasousuo.com/pc/').then( res => {
        //   this.ipadUser = res.data.data;
        //   this.option.number = 10;

        // }); 
        this.page = 1;
        this.showTag = false;
        this.filter = false;
        this.input5 = '';
        this.select = '';
        this.dis = true;
        this.tags = []; 
        this.$http.get('/recording/time?page=1').then( res => {
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            console.log(res);
            this.opernNumber = res.data.data.count;
            console.log('this.opernNumber',this.opernNumber);
            this.form = res.data.data.recordingList;
          }
        });
      },
      Listinit() {
        this.$http.get('/recording/opern_list').then(res=>{
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            this.opernNameList = res.data.data;
            console.log('this.opernNameList',this.opernNameList);
          }          
        });
        this.$http.get('/recording/wechat_list').then(res=>{
          if(res.data.errorCode === 2) {
            this.showLogin = true;
          } else if(res.data.errorCode === 0) {
            this.wechatNameList = res.data.data;
            console.log('this.wechatNameList',this.wechatNameList);
          }         
        });
      },
      searchRecordinglist() {
        if(!this.input5) return ;
        this.filter = true;
        this.showTag = true;
        this.input = this.input5;
        // this.select1 =this.select;
         this.input5 = '';
        // this.select = '';
        // this.dis = true;
        this.tags = [];
        this.page = 1;
        console.log(this.input);
        // if(this.select1 == 1) {
        //   if(!this.input.wechatId) {
        //     this.tags.push(this.input);
        //     this.$http.get('/recording/search_wechat?keyword='+this.input).then(res=>{
        //       this.opernNumber = res.data.data.count;
        //       console.log(this.opernNumber);
        //       this.form = res.data.data.recordingList;
        //       console.log('res.data.data.recordingList',res.data.data.recordingList);
        //     });
        //   } else {
        //     this.tags.push(this.input.wechatName);
        //     this.$http.get('/recording/exact_wechat?type='+this.input.type+'&wechatId='+this.input.wechatId).then(res=>{
        //       this.opernNumber = res.data.data.count;
        //       console.log(this.opernNumber);
        //       this.form = res.data.data.recordingList;
        //       console.log('res.data.data.recordingList',res.data.data.recordingList);
        //     });
        //   }  
        // }else if(this.select1 == 2){
        //   if(!this.input.opernId) {
        //     this.tags.push(this.input);
        //     this.$http.get('/recording/search_opern?keyword='+this.input).then(res=>{
        //       this.opernNumber = res.data.data.count;
        //       this.form = res.data.data.recordingList;
        //       console.log('res.data.data.recordingList',res.data.data.recordingList);
        //     });
        //   }else {
        //     this.tags.push(this.input.opernName);
        //     this.$http.get('/recording/opern?opernId='+this.input.opernId).then(res=>{
        //       this.opernNumber = res.data.data.count;
        //       this.form = res.data.data.recordingList;
        //       console.log('res.data.data.recordingList',res.data.data.recordingList);
        //     });
        //   } 
        // } else if(this.select1 == 3) {
          this.tags.push(this.input);
          this.$http.get('/recording/search_all?keyword='+this.input).then(res=>{
            if(res.data.errorCode === 2) {
              this.showLogin = true;
            } else if(res.data.errorCode === 0) {
              this.opernNumber = res.data.data.count;
              this.form = res.data.data.recordingList;
              console.log('res.data.data.recordingList',res.data.data.recordingList);
            }        
          });
        // }
      },
      querySearch(queryString, cb) {
        var ary = this.opernNameList.concat(this.wechatNameList);
        var results = queryString ? ary.filter(this.createFilter(queryString)):'' ;
        console.log('results',results);
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString) !== -1);
        };
      },
      handleSelect(item) {
        this.input5 = item.opernName?item.opernName:item.wechatName;
      },
      handleIconClick() {
        this.input5 = '';
      },
      handleTagClose() {
        this.homeworksInit();
        this.tags.pop();
       },
      tableRowClassName(row, index) {
        var rowTime = row.createdAt.substring(0,10);
       // var preTime = this.pre ? this.pre.createdAt.substring(0,10) : '';
        console.log('rowTime',rowTime);
        if (index === 0) {
          this.form[0].className = 'info-class';
          return 'info-class';
        } else if(rowTime === this.form[index-1].createdAt.substring(0,10)) {
          this.form[index].className = this.form[index-1].className;
          console.log('相等',index+1,this.form[index].createdAt.substring(0,10),this.form[index].className);
          return this.form[index].className;
        } else {
          this.form[index].className = this.form[index-1].className === 'info-class' ? 'another-class' : 'info-class' ;
          console.log('不相等',index+1,this.form[index].createdAt.substring(0,10),this.form[index].className);
          return this.form[index].className;
        }
      },
      closeShowLogin() {
        this.showLogin  = false;
        router.push({path:'/'});
      },
      handleCommand(e) {
        if(e === 'signout'){
          this.$http.get('/admin/logout').then(res => {
              router.push('/');
          });
        } else if(e === 'signup') {
          router.push('/signUp');
        }  
      },
      excleDownload(j){
        console.log("excle下载");
        if(this.form[j].algorithmPath === null){
          console.log('没有文件呀');
        }
        else{
          console.log(this.form[j].algorithmPath)
          // window.location.href=this.form[j].algorithmPath;
          //post
          this.$http.get('/algorithm/excel',{
                params:{
                  algorithmPath:this.form[j].algorithmPath
                }
          }).then(res => {
              console.log(res.data.data,'excle ');
              window.open(res.data.data);
        }).then(()=>{
             console.log("success")
        });
        }  
      }
      // searchBookInfo(bookId) {
      //   for(var i in this.bookLists) {
      //     if(this.bookLists[i].id == bookId) return this.bookLists[i].name;
      //   }
      // },
      // searchOpernInfo(opernId) {
      //   for(var i in this.opernLists) {
      //     if(this.opernLists[i].opernId == opernId) {
      //       return { name:this.opernLists[i].opernName,
      //                number:this.opernLists[i].opernPageNumber};
      //     }
      //   }
      // },
      // editForm(i) {
      //   this.option.number = 10;
      //   this.$http.get('/homework_recording_list_by_page?ipadId='+this.ipadUser[i].id+'&page='+this.option.page+'&number='+this.option.number).then( res => {
      //     console.log(res);
      //     this.opernNumber = res.data.data.count;
      //     this.ipadId = this.ipadUser[i].id;
      //     this.form = res.data.data.homeworkList;
      //     this.showButton = true; 
      //     //console.log(this.ipadId);
      //   });
      //   this.openFullScreen();
      // },
      // dialogForm() {
      //   if(this.homework.opernName&&this.homework.repeatCount) {
      //     this.$http.post('/homework',this.homework).then( res => {
      //     this.homework.id = res.data.data;
      //     if(!this.homework.id) alert('已发布过作业，请重选');
      //     else this.homeworks.push(this.homework);
      //     this.bookId1 = this.homework.bookId;
      //     this.opernId1 = this.homework.opernId;
      //     this.precticeTimes1 = this.homework.repeatCount;
      //     this.bookId = '';
      //     this.opernId = '';
      //     this.precticeTimes = '';
      //   });
      //   } 
      // },
      // handleDelete(index, row) {
      //   this.$http.delete('/homework',row.id).then(res =>{
      //     this.homeworks.splice(index,1);
      //   });
      // },
      // editTable(index, row) {
      //   this.dialogFormVisible1 = true;
      //   this.editIndex = index ;
      // },
      // handleEdit(i) {
      //   this.dialogFormVisible1=false;
      //   console.log(this.homework);
      //   this.$http.post('/homework',this.homework).then( res => {
      //     this.homeworks.splice(i,1,this.homework);
      //   });

      //   // this.$http.post('/homework',row.id).then(res =>{
      //   //   this.homeworks.splice(index,1);
      //   // });
      // },
      // addHomeworks() {
      //   this.dialogFormVisible = false;
      //   var obj = {} ;
      //   for(var i in this.homework ) {
      //     if(i != 'id') {
      //       obj[i] = this.homework[i];
      //     }
      //   }
      //   obj.homeworkId = this.homework.id;
      //   this.form.unshift(obj);
      // }
    }
  }
</script>

<style scoped>
    .main {
      margin-top:70px;
      padding:0 50px;
      min-width:1000px;
      overflow:hidden;
    }
    .main div.search {
      width:100%;
      position:relative;
      line-height:40px;
      height:40px;
      min-width:1000px;
      margin-top:30px;
    }
    .main div.search .searchInput{
      position:absolute;
      right:140px;
      margin-right:10px;
      margin-left:55px;
      width:230px;
    }
    .main div.search .el-tag {
      position:absolute;
      left:0;
      height:30px;
      padding:auto;
      margin-top:5px;
      line-height:30px;
    }
    .count {
      position:absolute;
      color:gray;
      margin:0;
      right:0;
    }
    .el-table {
        top:30px;
        clear:both;
        text-align:center;
    }

    .el-table .el-button {
      font-weight:normal;
      font-size:14px;
      width:100%;
      border:none;
      margin:0;
      background-color:rgba(0,0,0,0);
    }

    .el-table .el-button:hover {
      border:none;
    }

    a {
      font-size:12px;
      color:#20a0ff;
      text-decoration:none;
    }
    
    a:hover {
      color:#20a0ff;
    }

    a:visited {
      color:#111;
    }

    .el-button {
      width:60px;
      height:30px;
      margin-top:10px;
      margin-bottom:15px;
      display:inline-block;
      float:left;
      text-align:center;
      padding:0;
      font-weight:bold;
      font-size:10px;
    }

    .el-button:hover {
      border:1px solid rgb(196,196,196);
    }
    .el-button:click {
      border:1px solid rgb(16, 142, 233);
      color:rgb(16, 142, 233);
    }

    .main >.el-button {
      margin-top:10px;
      margin-bottom:0
    }
    button.el-button--primary {
      float:right;
      width:80px;
      height:40px;
      margin-top:-3px;
    }

    .el-form {
      width:100%;
    }
    .el-form-item {
      display:inline-block;
    }


  .el-dialog >  .el-button {
      margin-right:40px;
      margin-bottom:20px;
      margin-top:-11px;
    }

  .number {
    width:280px;
  }

  .el-input-number{
    width:120px;
    margin-right:10px;
  }

  div.block {
    margin-top:100px;
    margin-bottom:60px;
  }

  .user-name {
    width:70px;
  }

</style>
