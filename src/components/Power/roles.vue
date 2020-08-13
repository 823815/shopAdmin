<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >权限管理</el-breadcrumb-item>
        <el-breadcrumb-item >角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click=" addDialogVisible = true">添加角色</el-button>
                </el-col>
              </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" stripe border style="width: 100%">
                <el-table-column type="expand" width="60px">
                    <template slot-scope="scope">
                        <el-row :class="['bdbuttom', index===0? 'bdtop':'']" v-for="(item1,index) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span= "5">
                                <el-tag closable>
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级权限 -->
                            <el-col :span="19"></el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#" width="60px"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" ></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
                <el-table-column label="操作" width="500px">
                    <template slot-scope="scope"><!--slot-scope="scope"-->
                        <el-row>
                            <!-- 编辑按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showRoleDialog(scope.row.id)">编辑</el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleRole(scope.row.id)">删除</el-button>
                            <!-- 分配权限 -->
                            <el-button type="warning" icon="el-icon-s-tools" size="mini">分配权限</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加对话框 -->
            <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="resetDialog">
                <el-form :model="addRoleForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <!-- 用户名 -->
                    <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRole">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 编辑对话框 -->
            <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="reseteditDialog">
                <el-form :model="editRoleFrom" :rules="addFormRules" ref="editRoleFromRef" label-width="80px">
                    <!-- 用户名 -->
                    <el-form-item label="角色名称">
                    <el-input v-model="editRoleFrom.roleName" disabled></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editRoleFrom.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRole">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
        data() {
            // // 验证邮箱的规则
            // var checkEmail = (rules, value, callback) =>{
            //     const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            //     if (regEmail.test(value)) {
            //         return callback()
            //     }
            //     callback(new Error('请输入合法的验证规则'))
            // }
            // // 验证手机的规则
            // var checkMobile = (rules, value, callback) =>{
            //     const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            //     if (regMobile.test(value)) {
            //         return callback()
            //     }
            //     callback(new Error('请输入合法的手机号'))
            // }
            return {
                // 所有角色列表数据
                rolesList: [],
                // 添加角色数据
                addRoleForm: {
                    roleName: '',
                    roleDesc: ''
                },
                // 编辑角色数据
                editRoleFrom:{},
                // 添加角色匹配规则
                addFormRules:{
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                    ]
                },
                addDialogVisible: false,
                editRoleDialogVisible: false
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList(){
                const {data: res} = await this.$http.get('roles')
                // console.log(res)
                if (res.meta.status !== 200) return this.$message.error('获取失败')
                this.rolesList =  res.data
                // console.log(this.rolesList)
            },
            //重置
            resetDialog(){
            // console.log('111')
            this.$refs.addFormRef.resetFields()
            },
            // 添加角色
            addRole(){
            this.$refs.addFormRef.validate(async v => {
                if (v) {
                    //验证通过
                    // console.log(this.addForm)
                    const {data: res} = await this.$http.post('roles',this.addRoleForm)
                    if (res.meta.status != 201) {
                        this.$message.error("添加角色失败")
                    }
                    this.$message.success("添加角色成功")
                    this.addDialogVisible = false
                    this.getRolesList()
                    }
                })
            },
            async showRoleDialog(id){
                const {data: res} = await this.$http.get("roles/"+id)
                if (res.meta.status != 200) {
                        return this.$message.error("获取角色失败")
                }
                this.editRoleDialogVisible = true
                this.editRoleFrom = res.data
            },
            reseteditDialog(){
                this.$refs.editRoleFromRef.resetFields()
            },
            editRole(){
                this.$refs.editRoleFromRef.validate(async v => {
                    if(v){
                        // console.log(this.editRoleFrom)
                        const {data: res} = await this.$http.put("roles/"+this.editRoleFrom.roleId,{roleName:this.editRoleFrom.roleName,roleDesc:this.editRoleFrom.roleDesc})
                        // console.log(res)
                        if (res.meta.status != 200) {
                            return this.$message.error("编辑角色失败")
                        }
                        this.$message.success("编辑角色成功")
                        this.editRoleDialogVisible = false
                        this.getRolesList()
                    }
                })
            },
           async deleRole(id){
                const val = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).catch(err => err)
                // console.log(res)
                if (val === 'confirm') {
                    const {data: res} = await this.$http.delete("roles/"+id)
                    if (res.meta.status != 200) {
                            return this.$message.error("删除角色失败")
                        }
                        this.$message.success("删除角色成功")
                        this.getRolesList()
                }
            }
        },
}
</script>
<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbuttom{
        border-bottom: 1px solid #eee;
    }
</style>