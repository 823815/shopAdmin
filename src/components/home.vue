<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边区域 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapes">{{isCollapse ? '|||': '〓'}}</div>
        <el-menu background-color="#333744" text-color="#fff" router active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" :default-active="navPath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObject[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menulist: [],
        iconObject: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
        },
        isCollapse: false,
        navPath: ''
      }
    },
    created() {
      this.getMenuList()
      this.navPath = window.sessionStorage.getItem('navPath')
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList(){
        const {data: res} = await this.$http.get('menus')
        console.log(res)
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        } else this.menulist = res.data
      },
      toggleCollapes(){
        this.isCollapse = !this.isCollapse
      },
      // 保存链接的激活状态
      saveNavState(data){
        window.sessionStorage.setItem('navPath',data)
        this.navPath = data
      },
    },
  }
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
  }
  .el-header > div {
    display: flex;
    align-items: center;
  }
  .el-header > div > span{
    margin-left: 15px;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #EAEDF1;
  }
  .el-menu{
    border-right: none;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    color: #fff;
    cursor: pointer;
  }
</style>