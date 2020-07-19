<template>
  <div class='login_container'>
    <div class='login_box'>
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登陆表单区域-->
      <el-form ref="loginFormRef" label-width="0px" class="login_from" :model="loginForm" :rules="loginFormRules">
      <!--用户名-->
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" >
            <i slot="prefix" class="iconfont icon-icon-test2"></i>
          </el-input>
        </el-form-item>
      <!--密码-->
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" type='password'>
            <i slot="prefix" class="iconfont icon-icon-test"></i>
          </el-input>
        </el-form-item>
      <!--按钮-->
        <el-form-item class="btns">
         <el-button type="primary" @click="login">登陆</el-button>
         <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单的数据绑定对象
       loginForm: {
         userName:'ss',
         passWord:'ss'
        },
        //表单的规则验证
        loginFormRules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          passWord: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符',  trigger: 'blur' }
          ],
        }
    }
  },
  methods: {
    resetLoginForm(){
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
      this.loginForm.userName = ''
      this.loginForm.passWord = ''
    },
    login(){
      this.$refs.loginFormRef.validate(valid => {
        if(!valid) return
      })
    }
  },
  }
</script>

<style lang="less" scoped>
.login_container{
      background-color:#2b4b6b;
      height:100%;
 }
.login_box{
  width:450px;
  height:300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 -5px 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_from{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}


</style>
