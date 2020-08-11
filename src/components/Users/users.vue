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
                    <el-button type="primary" @click=" addDialogVisible = true">添加用户</el-button>
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
                    <template slot-scope="scope">
                        <el-row>
                            <!-- 修改按钮 -->
                            <el-tooltip effect="dark" :enterable="false" content="修改"  placement="top">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialogVisible(scope.row.id)" ></el-button>
                            </el-tooltip>
                            <!-- 删除按钮 -->
                            <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleitem(scope.row.id)"></el-button>
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
        <!-- 添加对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="resetDialog">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <!-- 手机 -->
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="resetEditDialog">
            <el-form :model="editForm"  ref="editFormRef" :rules="addFormRules" label-width="70px">
                <!-- 用户名 -->
                <el-form-item label="用户名">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default{
    data() {
        // 验证邮箱的规则
        var checkEmail = (rules, value, callback) =>{
            const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的验证规则'))
        }
        // 验证手机的规则
        var checkMobile = (rules, value, callback) =>{
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize:2
            },
            usersList: [],
            total: 0,
            addDialogVisible: false,
            editDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            editForm: {},
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                ],
            },
            
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
        resetDialog(){
            // console.log('111')
            this.$refs.addFormRef.resetFields()
        },
        addUser(){
            this.$refs.addFormRef.validate(async v => {
                if (v) {
                    //验证通过
                    // console.log(this.addForm)
                    const {data: res} = await this.$http.post('users',this.addForm)
                    if (res.meta.status != 201) {
                        this.$message.error("添加用户失败")
                    }
                    this.$message.success("添加用户成功")
                    this.addDialogVisible = false
                    this.getUserList()
                }
            })
        },
        //编辑用户数据
        async showDialogVisible(id){
            this.editDialogVisible = true
            // console.log(value)
            const {data: res} =await this.$http.get(`users/${id}`)
            if (res.meta.status !== 200 ) {
                this.$message.error('编辑失败')
            }{
                this.editForm = res.data
                console.log(this.editForm)
            }
        },
        editUser(){
            this.$refs.editFormRef.validate(async v => {
                if (v) {
                    //验证通过
                    const {data: res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
                    // console.log(res)
                    if (res.meta.status != 200) {
                        this.$message.error("编辑用户失败")
                    }{
                        this.$message.success("编辑用户成功")
                        this.editDialogVisible = false
                        this.getUserList()
                    }
                }
            })
            
        },
        resetEditDialog(){
            this.$refs.editFormRef.resetFields()
        },
        // 删除数据
        async deleitem(id){
            const res= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            // console.log(res)
            if (res !== 'confirm') {
                return this.$message.info('已取消删除')
            }{
                const {data: res} = await this.$http.delete('users/'+id)
                if (res.meta.status != 200) {
                    this.$message.error("删除用户失败")
                }{
                    this.$message.success("删除用户成功")
                    this.getUserList()
                }
            }
        }
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