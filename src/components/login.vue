<template>
    <div>
        <el-breadcrumb  class="header" separator=">">
        <el-breadcrumb-item :to="{ path: '/' }"  class="items">账号登录</el-breadcrumb-item>
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
            <h1>登 录</h1>
            <el-form v-show="showSignIn" :model="ruleForm1" :rules="rules2" ref="ruleForm1" label-width="70px" class="demo-ruleForm" label-position="right">
                <el-form-item prop="email" label="邮箱：">
                    <el-input v-model="ruleForm1.email"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pass" :required="true">
                    <el-input type="password" v-model="ruleForm1.pass" auto-complete="off"></el-input>
                </el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm1')" class="btn">提交</el-button>
                    <el-button @click="resetForm('ruleForm1')" class="btn">重置</el-button>
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
        <div class="login get-in" v-show="showGetIn" >
            <el-alert
                title="已登录"
                type="success"
                show-icon
                :closable="false">
            </el-alert>
            <el-button type="primary" @click="getIn">进入</el-button>
            <el-button @click="reLogin('ruleForm1')">重新登录</el-button>
        </div>
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
            showSignIn:true,
            showSignUp:false,
            notLogin:true,
            islogin:false,
            showGetIn:false,
            userName:'未登录'
        };
        },
        created() {
            this.alreadyLogin();
        },
    methods: {
        //登录
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
                        
                    }else {
                        alert('登录失败,请输入正确的账号或密码!');
                        this.ruleForm1.pass = '';
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        //router.push({path:'/bookLists'});
        },

        //重置表单
        resetForm(formName) {
            this.notLogin = true;
            this.islogin = false;
            this.showGetIn = false;
            this.$refs[formName].resetFields();
        },

        //重新登录
        reLogin(formName) {
            this.notLogin = true;
            this.islogin = false;
            this.showGetIn = false;
            this.$refs[formName].resetFields();
            this.userName = '未登录';
            this.$http.get('/admin/logout');
        },

        //判断是否已经登录
        alreadyLogin() {
            this.$http.get('/admin/userinfo').then(res => {
                console.log('res.data.errorCode',res.data.errorCode);
                if(res.data.errorCode === 2) {
                    this.notLogin = true;
                    this.islogin = false;
                }else if(res.data.errorCode === 0) {
                    this.userName = res.data.data.username;
                    this.notLogin = false;
                    this.islogin = false;
                    this.showGetIn = true;
                }
            });
        },
        getIn() {
            router.push('/bookLists');
        },

        //账号管理
        handleCommand(e) {
            if(e === 'signout'){
                this.$http.get('/admin/logout').then(res => {
                    this.userName = '未登录';
                    router.push('/');
                    this.notLogin = true;
                    this.showGetIn = false;
                    this.islogin = false;
                });
            } else if(e === 'signup') {
                router.push('/signUp');
            }
            
        }
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