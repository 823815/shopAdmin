<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: './home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            <el-breadcrumb-item >用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!-- 搜索与添加区域 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
              </el-row>
            <!-- 用户列表区 -->
            <el-table :data="usersList" stripe border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180px"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="180px"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180px"></el-table-column>
                <el-table-column prop="role_name" label="角色" width="150px"></el-table-column>
                <el-table-column prop="mg_state" label="状态" width="100px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStateChange(scope.row)"></el-switch>
                        <!-- {{scope.column}} -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template >
                        <el-row>
                            <!-- 修改按钮 -->
                            <el-tooltip effect="dark" :enterable="false" content="修改" placement="top">
                                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            </el-tooltip>
                            <!-- 删除按钮 -->
                            <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                            </el-tooltip>
                            <!-- 分配角色 -->
                            <el-tooltip effect="dark" :enterable="false" content="分配角色" placement="top">
                                <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
                            </el-tooltip>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default{
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize:2
            },
            usersList: [],
            total: 0
            
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList(){
            const {data:res} = await this.$http.get('users',{params:this.queryInfo})
            // console.log(res)
            if(res.meta.status !==200) return this.$message.error('获取数据失败')
            else {
                this.usersList = res.data.users
                this.total = res.data.total
                console.log(this.usersList, this.total)
            }
        },
        handleSizeChange(pageSize){
            // console.log(pageSize)
            this.queryInfo.pagesize=pageSize
            this.getUserList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        async userStateChange(userInfo){
            // console.log(userInfo)
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            // console.log(res)
            if (res.meta.status != 200) {
                this.$message.error("状态修改失败")
                userInfo.mg_state = !userInfo.mg_state
            }else{
                this.$message.success("状态修改成功")
            }
        },
        // async search(searchId){
        //     // console.log(searchId)
        //     const {data:res} = await this.$http.get(`users/${searchId}`)
        //     console.log(res)
        // }
    },
    /*watch: {
        // 监听queryInfo.query的值的变化实现动态搜索
        'queryInfo.query':function(){
            this.getUserList()
        }
    },*/
}
</script>
<style lang="less" scoped>

</style>