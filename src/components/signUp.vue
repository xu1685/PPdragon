<template>
    <div>
        <el-breadcrumb  class="header" separator=">">
        <el-breadcrumb-item :to="{ path: '/bookLists' }"  class="items">首 页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/signUp' }"  class="items">账号注册</el-breadcrumb-item>
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
        <div class="login" v-show="notLogin">
            <h1 >注 册</h1>
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="80px" class="demo-ruleForm" label-position="right" style="margin-top:-30px;">
                <el-form-item prop="email" label="邮箱：">
                    <el-input v-model="ruleForm2.email"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pass" :required="true">
                    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass" :required="true">
                    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                </el-form-item>
                    <el-button type="primary" @click="submitForm1('ruleForm2')" >提交</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form>
            
        </div>
        <div class="login" v-show="islogin">
            <el-alert
                title="登录成功"
                type="success"
                show-icon
                :closable="false">
            </el-alert>
        </div>
        <div class="login" v-show="signUp">
            <el-alert
                title="注册成功"
                type="success"
                show-icon
                :closable="false">
            </el-alert>
            <el-button type="primary" @click="signIn">立即登录</el-button>
            <el-button  @click="returnTo">返回首页</el-button>
        </div>
        <el-dialog
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
    
</template>

<script>

  import router from '../router'
  import md5 from 'js-md5'

  export default {
    name: 'login',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else {
            if (this.ruleForm2.checkPass !== '') {
                this.$refs.ruleForm2.validateField('checkPass');
            }
            callback();
            }
        };
        // var validaEmail = 
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm2.pass) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            ruleForm1: {
                pass: '',
                email: ''
            },
            ruleForm2: {
                pass: '',
                checkPass: '',
                email: ''
            },
            rules2: {
            pass: [
                { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
                { validator: validatePass2, trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ]
            },
            notLogin:true,
            islogin:false,
            userName:'未登录',
            signUp:false,
            showLogin:false
        };
        },
        created() {
            this.alreadyLogin();
        },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                let data = {};
                data.username = this[formName].email;
                data.password = md5(this[formName].pass);
                this.$http.post('admin/login',data).then(res=>{
                    if(res.data.errorCode === 0) {
                        this.islogin = true;
                        this.notLogin = false;
                        setTimeout(()=>{
                            router.push('/bookLists');
                        },1000);   
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        //router.push({path:'/bookLists'});
        },
        submitForm1(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                let data = {};
                data.username = this[formName].email;
                data.password = md5(this[formName].pass);
                this.$http.post('admin/register',data).then(res=>{
                    if(res.data.errorCode === 0) {
                        this.signUp = true;
                        this.notLogin = false;
                        this.ruleForm1.pass = this.ruleForm2.pass;
                        this.ruleForm1.email = data.username;
                        
                    }else {
                        alert('注册失败！')
                        this.ruleForm1.pass = '';
                        this.ruleForm1.checkPass = '';
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        //router.push({path:'/bookLists'});
        },
        resetForm(formName) {
            this.notLogin = true;
            this.islogin = false;
            this.showGetIn = false;
            this.$refs[formName].resetFields();
            document.cookie = "admin_token=''";
        },
        getIn() {
            router.push('/bookLists');
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
        signIn() {
            this.$http.get('/admin/logout').then(res => {
                this.submitForm('ruleForm2');
            });
        },
        returnTo() {
            this.getIn();
        },
        alreadyLogin() {
            this.$http.get('/admin/userinfo').then(res => {
                console.log('res.data',res.data);
                if(res.data.errorCode === 2) {
                    this.showLogin = true;
                    this.notlogin = false;
                }else if(res.data.errorCode === 0) {
                    this.userName = res.data.data.username;
                    this.notLogin = true;
                    this.islogin = false;
                    this.showLogin = false;
                }
            });
        },
        closeShowLogin() {
            this.showLogin  = false;
            router.push({path:'/'});
        },
    }


  }

</script>

<style scoped>
    .el-form-item {
        margin-top:50px;
        margin-bottom:36px;
    }
    form {
        text-align:center;
    }
    .sign {
        position:absolute;
        left:50%;
        top:20px;
        margin-left:-58px;
        border:none;
        border-radius:0;
        color:#5d5757;
    }

    .login {
        width:500px;;
        height:340px;
        border:1px solid lightgray;
        padding:20px;
        padding-top:28px;
        position:relative;
        background:white;
        border-radius:5px;
        position:absolute;
        left:50%;
        top:50%;
        margin-left:-250px;
        margin-top:-183px;
    }

    .login h1 {
        margin:0;
        font-size:20px;
    }

    .login .el-button {
        position:absolute;
        bottom:20px;
        left:50%;
        width:90px;
        margin-left:-100px;
    }

    .login .el-button + .el-button {
        margin-left:10px;
    }

    .el-alert {
        width:120px;
        line-height:30px;
        position:absolute;
        left:50%;
        top:50%;
        margin-left:-60px;
        margin-top:-60px;
    }

    .get-in button,.btn {
        position:absolute;
        bottom:50px;
        left:50%;
        width:75px;
        padding:10px;
        margin-left:-100px;
    }

    .get-in button + button,.btn + .btn{
        position:absolute;
        bottom:50px;
        left:50%;
        margin-left:25px;
    }



</style>