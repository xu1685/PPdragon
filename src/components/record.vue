<template>
	<div class="record">
	    <el-breadcrumb  class="header" separator=">" v-show="showHeader">
	      <el-breadcrumb-item :to="{ path: '/bookLists' }"  class="items" @click="showHeader=false">书籍管理</el-breadcrumb-item>
	      <el-breadcrumb-item  :to="{ path: '/record' }"   class="items" >日志分析</el-breadcrumb-item>
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

	    <div class="recmain">
        <div style="display:flex;flex-direction:row;justify-content:flex-start ">
         
	        <div class="date">
  			    <el-date-picker
  			      v-model="date0"
  			      type="daterange"
  			      align="right"
  			      placeholder="选择日期范围"
  			      style="width:180px"
  			      @change="getDate"
  			      :picker-options="pickerOptions">
  			    </el-date-picker>
  			    <el-button @click="changeOrder" type="primary">倒序</el-button>
	        </div>

		      <div class="search" >
  		      <div class="searchInput">
  		        <el-autocomplete
  		          icon="search"
  		          popper-class="my-autocomplete"
  		          v-model="input"
                custom-item="my-item-zh"
  		          :fetch-suggestions="querySearch"
  		          placeholder="请输入用户昵称"
  		          :trigger-on-focus="false"
  		          @select="handleSelect">
  		          </el-autocomplete>
  		      </div>
		      </div>
           <!--  昵称 -->
           <el-tag
            style="font-size:16px;margin-top:5px;margin-left:50px;"
            :key="tag"
            v-for="tag in Tags"
            :closable="true"
            :close-transition="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag> 
           <!-- 身份1 -->
          <el-tag
            style="font-size:16px;margin-top:5px;margin-left:50px;"
            :key="tag1"
            v-for="tag1 in Tags1"
            :closable="true"
            :close-transition="false"
            @close="handleCloseType1(tag1)">
            {{tag1}}
          </el-tag>
           <!-- 身份2 -->
          <el-tag
            style="font-size:16px;margin-top:5px;margin-left:50px;"
            :key="tag2"
            v-for="tag2 in Tags2"
            :closable="true"
            :close-transition="false"
            @close="handleCloseType2(tag2)">
            {{tag2}}
          </el-tag>
           <!-- 学校 -->
          <el-tag
            style="font-size:16px;margin-top:5px;margin-left:50px;"
            :key="tag3"
            v-for="tag3 in Tags3"
            :closable="true"
            :close-transition="false"
            @close="handleCloseSchool(tag3)">
            {{tag3}}
          </el-tag>

        </div>
          
        <div class="recTable">
			  <el-table
			    :data="this.list"
			    style="width: 100%;"
			    border
          :row-class-name="tableRowClassName0"
          v-loading="loading"
          element-loading-text="拼命加载中">
			    <el-table-column
			      prop="createdAt"
			      label="日期"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="userName"
			      label="微信昵称"
			      width="160">
            <template scope="scope">
             <a class="name" @click="handle(scope.row)">
               <span>{{ scope.row.userName }}</span>
             </a>
            </template>
			    </el-table-column>
          <el-table-column
            prop="Type"
            label="身份">
            <template scope="scope">
             <a class="name" @click="handleType(scope.row)">
               <span>{{ scope.row.Type }}</span>
             </a>
             <a class="name" @click="handlePad(scope.row)">
               <span>{{scope.row.pad}}</span>
             </a>
                 
              </template>
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="学校">
            <template scope="scope">
             <a class="name" @click="handleSchool(scope.row)">
               <span>{{ scope.row.schoolName }}</span>
             </a>
              </template>
          </el-table-column>
			    <el-table-column
            prop="clickName"
            label="按钮名称">
			    </el-table-column>
          <el-table-column
            prop="clickId"
            label="操作按钮"
            width="100px">
          </el-table-column>
			  </el-table>
        <p style="float:left">共有{{this.pageCount}}条记录</p>

				<div class="block">
			      <el-pagination
			        style="margin-top:60px"
			        layout="prev, pager, next"
			        :total="pageCount"
			         @current-change="currentPage=>{page = currentPage}"
			         :current-page="page"
			         :page-size="15"
			         >
			      </el-pagination>
	            </div>
		    </div>
		    <div class="side">
		    	<el-table
            stripe
            :row-class-name="tableRowClassName"
		    	  max-height="645"
			      :data="this.sideTable"
			      style="width: 100%;padding-bottom:30px;"
            v-loading="loading2"
            element-loading-text="拼命加载中">
			      <el-table-column
			        prop="click_id"
			        label="点击排名">
              <template scope="scope">
                 <span>{{ scope.row.click_name }}</span>
                 <p>（{{scope.row.click_id}}）</p>
              </template>
			      </el-table-column>
			      <el-table-column
			        prop="count"
			        label="点击次数"
              width="100px">
			      </el-table-column>
			    </el-table>

		    </div>

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
  import Vue from 'vue'
  import $ from 'jquery'

  Vue.component('my-item-zh', {
    functional: true,
    render: function (h, ctx) {
      var item = ctx.props.item;
      console.log(item,'item')
        if(item.type == '1'){
          item.typeName = '--家长（微信）'
        }else if(item.type == '2'){
          item.typeName = '--老师（微信）'
        }else if(item.type == '3'){
          item.typeName = '--校长（微信）'
        }else if(item.type == '5'){
          item.typeName = '--小孩（平板）'
        }else if(item.type == '6'){
          item.typeName = '--老师（平板）'
        }else if(item.type == '7'){
          item.typeName = '--游客（平板）'
        }
      return h('li', ctx.data, [
        h('span', { attrs: { class: 'username' } }, [item.value]),
        h('span', { attrs: { class: 'type' } }, [item.typeName])
      ]);
    },
    props: {
      item: { type: Object, required: true }
    }
  });

  export default{
  	name: 'record',
  	data() {
  		return{
        loading: true,
        loading2:true,
  			showHeader: true,
  			userName:'未登录',
        userId:'',
        pad: "平板",
        wechat: "微信",
        school:'',
        userPage:false,

            tableData2:[],
            color0:[],
            color:[],
            time:[],
            sideTable:[],
            Tags: [],
            Tags1:[],
            Tags2:[],
            Tags3:[],
            state:0,
            state0:0,
            input: '',
            name:[],
            results:'',
            Type:'',
            id:'',
            type:'',
            typeArr:[],
            typeArr0:[],
            typeArr1:[],
            //date
            date0:[],
            startTime:'',
            stopTime:'',
            list:[],
            pageCount:0,
            page:0,
            pageChange:0,
            order:0,
            showLogin:false,
            restaurant:[],
		    pickerOptions: {
	          shortcuts: [{
	            text: '最近三天',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近一周',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近一个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	              picker.$emit('pick', [start, end]);
	            }
	          }]
	        },
	       //other
  		}
  	},
  	created() {
  		this.$http.get('/admin/userinfo').then(res =>{
        if(res.data.data.username) {
          this.userName = res.data.data.username;
          console.log(this.userName);
        }  
      });
       //时间格式化函数
  		Date.prototype.Format = function (fmt) {  
		    var o = {
		        "M+": this.getMonth() + 1, //月份 
		        "d+": this.getDate(), //日 
		        "h+": this.getHours(), //小时 
		        "m+": this.getMinutes(), //分 
		        "s+": this.getSeconds(), //秒 
		        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		        "S": this.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
	    }

  		this.pageInit();

  	},
  	watch: {
  	  page(){
  	  	if(this.page == 0){
  	  		this.page = 1;
  	  	}
	    	if(this.pageChange == 0){
            this.loading = true;
	        this.$http.get('/click_log/all',{
	                params:{
	                  isAsc:this.order,
	                  page:this.page,
	                  count:15,
                    userType: this.typeArr,
                    schoolId:this.school
	                }
	          }).then(res=>{
              if(res.data.errorCode === 2) {
                this.showLogin = true;
              } else if(res.data.errorCode === 0) {
                
               this.list = res.data.data.clickInfo;
               console.log(this.list,'all')
               this.initDay();
               this.pageCount = res.data.data.totalCount;

               for(var i in this.list){
                if(this.list[i].userType == '1'){
                  this.list[i].Type = '家长 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '2'){
                  this.list[i].Type = '老师 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '3'){
                  this.list[i].Type = '校长 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '5'){
                  this.list[i].Type = '小孩 ';
                  this.list[i].pad = '(平板)';
                }else if(this.list[i].userType == '6'){
                  this.list[i].Type = '老师 ';
                  this.list[i].pad = '(平板)';
                }else if(this.list[i].userType == '7'){
                  this.list[i].Type = '游客 ';
                  this.list[i].pad = '(平板)';
                }
               }
               this.loading = false;
              }             
	          });
          this.loading2 = true;
		      this.$http.get('/click_log/all/rank').then(res1=>{
	          	this.sideTable = res1.data.data;
               this.loading2 = false;
	          });
	  	  }else if(this.pageChange == 1){  //时间筛选
          this.loading = true;
	        this.$http.get('/click_log/all',{
	                params:{
	                  isAsc:this.order,
	                  page:this.page,
	                  count:15,
                    userType: this.typeArr,
                    schoolId:this.school,
	                  startTime:this.startTime,
                    stopTime:this.stopTime
	                }
	          }).then(res2=>{
              if(res2.data.errorCode === 2) {
                this.showLogin = true;
              } else if(res2.data.errorCode === 0) {
               this.list = res2.data.data.clickInfo;
               this.initDay();
               this.pageCount = res2.data.data.totalCount;
               console.log(this.list,'时间');
               for(var i in this.list){
                if(this.list[i].userType == '1'){
                  this.list[i].Type = '家长 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '2'){
                  this.list[i].Type = '老师 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '3'){
                  this.list[i].Type = '校长 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '5'){
                  this.list[i].Type = '小孩 ';
                  this.list[i].pad = '(平板)';
                }else if(this.list[i].userType == '6'){
                  this.list[i].Type = '老师 ';
                  this.list[i].pad = '(平板)';
                }else if(this.list[i].userType == '7'){
                  this.list[i].Type = '游客 ';
                  this.list[i].pad = '(平板)';
                  this.list[i].Type = '校长（微信）'
                }else if(this.list[i].userType == '5'){
                  this.list[i].Type = '小孩（平板）'
                }else if(this.list[i].userType == '6'){
                  this.list[i].Type = '老师（平板）'
                }else if(this.list[i.userType == '7']){
                  this.list[i].Type = '游客（平板）'
                }
               }
               this.loading = false;
              }
            });	  		
            this.$http.get('/click_log/all/rank',{  
                  params:{
                    userType: this.typeArr,
                    startTime:this.startTime,
                    stopTime:this.stopTime,
                    schoolId:this.school
                  }
            }).then(res3=>{
               this.sideTable = res3.data.data;
            });
	    	}else if(this.pageChange == 2){  //user筛选
          this.loading = true;
          console.log('uer筛时间',this.id,'id',this.type,'type',this.startTime,'start',this.stopTime,'stop')
          this.$http.get('/click_log/user',{
                params:{
                  isAsc:this.order,
                  page:this.page,
                  count:15,
                  startTime:this.startTime,
                  stopTime :this.stopTime,
                  userId:this.id,
                  userType:this.type
                }
          }).then(res => {
              if(res.data.errorCode === 2) {
                this.showLogin = true;
              } else if(res.data.errorCode === 0) {
              this.list = res.data.data.clickInfo;
                console.log(res,'user ')
              this.initDay();
              this.pageCount = res.data.data.totalCount;  
              for(var i in this.list){
                if(this.list[i].userType == '1'){
                  this.list[i].Type = '家长 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '2'){
                  this.list[i].Type = '老师 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '3'){
                  this.list[i].Type = '校长 ';
                  this.list[i].pad = '(微信)';
                }else if(this.list[i].userType == '5'){
                  this.list[i].Type = '小孩 ';
                  this.list[i].pad = '(平板)';
                }else if(this.list[i].userType == '6'){
                  this.list[i].Type = '老师 ';
                  this.list[i].pad = '(平板)';
                }else if(this.list[i].userType == '7'){
                  this.list[i].Type = '游客 ';
                  this.list[i].pad = '(平板)';
                }
               }
               this.loading = false;
              }                                                                               
          });

          this.$http.get('/click_log/user/rank',{  //特定用户的时间筛选的点击次数
                  params:{
                    userId: this.id,
                    userType: this.type,
                    startTime:this.startTime,
                    stopTime:this.stopTime,
                    schoolId:this.school
                  }
            }).then(res3=>{
               console.log(res3,'时间筛选点击排序')
               this.sideTable = res3.data.data;
            });

        }
	  },
	  order(){
	  	if(this.pageChange == 0){
	  		this.page = 0;
	  	}else{
	  		this.getDate();
	  	}
	  },
    input(){
      if(this.input == ''){
        console.log('cler');
        this.queryString = ' ';
      }
    }
          
  	},
  	methods: {
  	  pageInit(){
  	  	//get所有数据
  	  	 
         this.$http.get('/click_log/all',{
                params:{
                  isAsc:this.order,
                  page:1,
                  count:15
                }
          }).then(res=>{
            console.log(res,'pageinitrs')
            if(res.data.errorCode === 2) {
              this.showLogin = true;
            } else if(res.data.errorCode === 0) {
             this.pageCount = res.data.data.totalCount;
             this.page = 1;
             this.pageChange = 0;
             this.initDay();
             console.log(this.pageCount,'pageCount');
             this.loading = false;
            }
          	 
          });

          this.$http.get('/click_log/all/rank').then(res1=>{
          	this.sideTable = res1.data.data;
            this.loading2 = false;
          });

  	  	//table日期颜色分类
  	  	//click标签跳转
  	  },
  	  getDate(){
  	  	console.log(this.date0,"date0")
        console.log(this.pageChange,"change")
  	  	if(this.date0[0] == null && this.pageChange == 1){ 
  	  		console.log("清空")
          this.order = 0;
  	  		this.page = 0;
          this.pageChange = 0;
  	  	}else if (this.date0[0] == null && this.pageChange == 2){
          this.startTime = '';
          this.stopTime = '';
          this.page = 0;     
        }else{
    	  	 console.log("时间筛选")
    	  	 this.startTime = this.date0[0].Format("yyyy-MM-dd hh:mm:ss");
    	  	 this.stopTime = this.date0[1].Format("yyyy-MM-dd hh:mm:ss");
           console.log(this.stopTime,'stop')
           if(this.pageChange == 2){ //特定用户的时间筛选
             this.page = 0;
             console.log(this.id,'id',this.type,'type',this.startTime,'start',this.stopTime,'stop')
             console.log("特定用户的时间筛选")
           }else{                    //所有用户的时间筛选
             this.pageChange = 1;
             this.page = 0;
            } 
        }
           	 
  	  },
  	  changeOrder(){
  	  	if(this.order == 1){
  	  	  this.order = 0;
          this.$message({
            message: '时间降序',
            type: 'success'
          });
  	  	}else{
          this.$message({
            message: '时间升序',
            type: 'success'
          });
  	  	  this.order = 1;
  	  	}

  	  	console.log(this.order,"order")
  	  },
       //关闭提示未登录窗口，跳转登录界面
      closeShowLogin() {
        this.showLogin  = false;
        router.push({path:'/'});
      },
  	  //header
  	  handleCommand(e) {
        if(e === 'signout'){
          this.$http.get('/admin/logout').then(res => {
              router.push('/');
          });
        } else if(e === 'signup') {
          router.push('/signUp');
        }  
      },
      initDay(){
         for(var i = 0;i<this.list.length;i+=1){
          this.color[i] = '';
         } //初始化数组

        var dayMatch = /\d{4}-\d{2}-\d{2}/g;
         for(var i = 0;i<this.list.length;i+=1){
          this.time[i] = this.list[i].createdAt.match(dayMatch)[0];
         }
         // console.log(this.time)
         this.color[0] = '1';

        for(var i = 0;i<this.list.length-1;i+=1){
          if(this.time[i+1] === this.time[i]){
              this.color[i+1] = this.color[i];
          }else if((this.time[i+1] !== this.time[i]) && this.color[i] !== '2'){
            this.color[i+1] = '2'
          }else{
            this.color[i+1] = '1'
          }
        }
        // console.log(this.color)    
     },
     tableRowClassName0(row, index) {
       
        if (this.color[index] === '1') {
            if(index%2 == 0){
             return 'info-row'; 
           }else{
             return 'info-row0'
           }
        } else {
            if(index%2 == 0){
              return 'positive-row';
            }else{
              return 'positive-row0';
            }
        }
      },
      tableRowClassName(row, index) {
       if (index%2 === 0) {
          return 'info-row';
        } else {
          return 'positive-row';
        }
      },
      //联想search
        //模糊搜索  微信昵称  获取下拉列表  点击返回id
  	  	// 模糊搜索  按钮  获取下拉列表  点击返回按钮id
      querySearch(queryString, cb) {
          this.queryString = queryString;
          this.name = [];
          this.name = [];
          this.getres(this.queryString);
          setTimeout(()=>{
            console.log(this.restaurants,"restaurants");
            var restaurants = this.restaurants;
            var results = this.queryString ? restaurants.filter(this.createFilter(this.queryString)):restaurants;
            console.log(results,"re1")
            cb(results);
          },800)
          
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString) !== -1);
        };
      },     
      getres(queryString){
        console.log(queryString,'queryString')
          this.$http.get('/click_log/user/search',{
                params:{
                  keyword:this.input
                }
          }).then(res4 => {
           if(res4.data.errorCode === 2) {
                this.showLogin = true;
              } else if(res4.data.errorCode === 0) {
                this.reData = res4.data.data;
                console.log(this.reData)
                for(var i in this.reData){
                  var obj = {
                    value: (this.reData[i].userName),
                    type: this.reData[i].userType,
                    id: this.reData[i].userId
                  }
                  this.name.push(obj);
                }
                this.restaurants = this.name;
                this.backData(this.restaurants);
              }
            
          })
          
      },       
      handleSelect(item) {
        // $("#clickme").click()
        console.log(item,'item')
        this.id = item.id;
        this.type = item.type;
        console.log(this.id,'id',this.type,'type')
        if(this.Tags.length == 1){
          this.Tags.pop();
        }
        this.Tags.push(item.value);
        console.log(item.type,'sele')
        this.$http.get('/click_log/user',{
                params:{
                  isAsc:0,
                  page:1,
                  count:15,
                  userId:this.id,
                  userType:this.type
                }
          }).then(res => {
              console.log(res,'teding ')
              this.page = 0;
              this.pageChange = 2;
        });
      },
      // searchClick(){
      //   console.log('click标签跳转')
      // },
      handle(model0){
       if(this.pageChange == 0){
        this.startTime = '';
        this.stopTime = '';
       }
          var nameTag = model0.userName;//添加过滤标签
          if(this.Tags.length == 1){
          this.Tags.pop();
          }
          this.Tags.push(nameTag);
          this.id = model0.userId;
          this.type = model0.userType;
          this.page = 0;
          this.pageChange = 2;
      },
      handleClose(tag){
        this.Tags.pop();
        this.pageChange = 1;
        this.input = '';
        this.order = 0;
        this.page = 0;
      },
      handleType(model0){
        console.log(model0,"type");
        this.Tags1 = [];
        if(model0.userType == 6 || model0.userType == 2 ){
          this.typeArr0 = [];
          this.typeArr0.push(2,6);
          this.Tags1.push('老师');
          this.state0 = 1;
        }else if(model0.userType == 1){
          this.typeArr0 = [];
          this.typeArr0.push(1);
          this.Tags1.push('家长');
          this.state0 = 1;
        }else if(model0.userType == 3){
          this.typeArr0 = [];
          this.typeArr0.push(3);
          this.Tags1.push('校长');
          this.state0 = 1;
        }else if(model0.userType == 5){
          this.typeArr0 = [];
          this.typeArr0.push(5);
          this.Tags1.push('小孩');
          this.state0 = 1;
        }else if(model0.userType == 6){
          this.typeArr0 = [];
          this.typeArr0.push(6);
          this.Tags1.push('游客');
          this.state0 = 1;
        }
        if(this.state == 0){
          this.typeArr = this.typeArr0;
        }else{
          this.typeArr = this.typeArr0.filter(v => this.typeArr1.includes(v))
        }
        console.log(this.typeArr,'typeArr');
        this.page = 0;
      },
      handleCloseType1(){
        this.typeArr0 = [];
        this.typeArr = this.typeArr1;
        this.Tags1.pop();
        this.page = 0;
        this.state0 = 0;
      },
      handlePad(model0){
        console.log("pad");
        this.Tags2.pop();
        if(model0.userType == 1 || model0.userType == 2 || model0.userType == 3 ){
          this.typeArr1 = [];
          this.typeArr1.push(1,2,3);
          this.Tags2.push('微信');
          this.state = 1;
        }else if(model0.userType == 5 || model0.userType == 6 || model0.userType == 7 ){
          this.typeArr1 = [];
          this.typeArr1.push(5,6,7);
          this.Tags2.push('平板');
          this.state = 1;
        }
        if(this.state0 == 0){
          this.typeArr = this.typeArr1;
        }else if(this.state != 0){
          this.typeArr = this.typeArr1.filter(v => this.typeArr0.includes(v))
        }
        console.log(this.typeArr);
        this.page = 0;
      },
      handleCloseType2(){
        this.typeArr1 = [];
        this.typeArr = this.typeArr0;
        this.Tags2.pop();
        this.page = 0;
        this.state = 0;
      },
      handleSchool(model0){
        console.log(model0,'school')
        this.school = model0.schoolId;
        this.Tags3.push(model0.schoolName);
        this.page = 0;
      },
      handleCloseSchool(){
        this.Tags3.pop();
        this.school = '';
        this.page = 0;
      },
      backData(restaurants){
        this.restaurants = restaurants;
      },
      change(){
        console.log("change ")
      }

  	},

  }
 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .record{
  	height: 100%;
  }

  .recmain{
  	padding-top: 100px;
    width: 85%;
  	max-width: 1350px;
    min-width: 960px;
  	margin: 0 auto;
  }
  
  .date{
  	display: inline-block;
  	margin-bottom: 20px;
  	float: left;
  }
  .search{
  	display: inline-block;
  	margin-bottom: 20px;
  }

  .search div.searchInput{
     width: 200px;
     margin-left: 50px;
  }

  .recmain div.recTable{
    display: inline-block;
    width:71.5%;
    float: left;
    padding-right: 1%;
    padding-bottom: 70px;
  }

  .name:hover{
    cursor:pointer;
    color: #4db3ff;
  }

  .recmain div.side{
  	display: inline-block;
  	width: 26.5%;
  	float: right;
  	background-color: lightgray;
  	border-radius: 8px;
  }

 .el-table .info-row {
    background-color: rgba(201, 229, 245, 0.72);
  }
  .el-table .info-row0 {
    background-color: rgba(201, 229, 245, 0.4);
  }

  .el-table .positive-row {
    background-color: #e4e4e4;
  }
  .el-table .positive-row0 {
    background-color: rgba(228, 228, 228, 0.44);
  }

</style>