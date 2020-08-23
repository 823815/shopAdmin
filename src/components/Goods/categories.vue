<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: './home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >商品管理</el-breadcrumb-item>
            <el-breadcrumb-item >商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!-- 添加分类区域 -->
                <el-col>
                    <el-button type="primary" @click="showDialog">添加分类</el-button>
                </el-col>
              </el-row>
            <!-- 分类列表区 -->
            <!-- <el-table :data="categoriesList" stripe border style="width: 100%">
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="cat_name" label="分类名称" ></el-table-column>
                <el-table-column prop="name" label="是否有效" ></el-table-column>
                <el-table-column prop="cat_level" label="排序">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.cat_level == '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </el-table-column>
            </el-table> -->
            <!-- 表格 -->
            <tree-table class='treeMTope' :data="categoriesList" :columns="columns" :show-row-hover="false" :selection-type="false" :expand-type="false" border show-index index-text="#">
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag  v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="danger" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            <!-- 添加分类对话框 -->
            <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="resetAddCateDialog">
                <el-form :model="addCataForm" :rules="addCataFormRules" ref="addCataFormRef" label-width="100px">
                    <!-- 分类名称-->
                    <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCataForm.cat_name"></el-input>
                    </el-form-item>
                    <!-- 父级分类 -->
                    <el-form-item label="父级分类:">
                        <el-cascader v-model="selectItem" :options="parentCatList" clearable :props="cascaderProps" @change="saveChooseItem"></el-cascader>
                    </el-form-item>
                </el-form> 
                <span slot="footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                //查询条件
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                //分类列表数据
                categoriesList:[],
                total: 0,
                columns:[
                    {
                    label:'分类名称',
                    prop:'cat_name'
                    },
                    {
                    label:'是否有效',
                    type:'template',
                    template:'isOk'
                    },
                    {
                    label:'排序',
                    type:'template',
                    template:'order'
                    },
                    {
                    label:'操作',
                    type:'template',
                    template:'opt'
                    }
                ],
                // 添加用户对话框默认显示初始值
                addDialogVisible: false,
                // 添加用户表单
                addCataForm:{
                    // 添加名称
                    cat_name: '',
                    // 添加的父类Id,默认为 0
                    cat_pid: 0,
                    // 添加的等级,默认为一级 0 ,二级 1 ,三级 2
                    cat_level: 0
                },
                // 表单验证规则
                addCataFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                },
                // 父级分类列表
                parentCatList: [],
                // cascaderProps
                cascaderProps:{
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    checkStrictly: true,
                    children: 'children'
                },
                // 选中的父级分类数组
                selectItem:[]
            }
        },
        created() {
            this.getCategoriesList()
        },
        methods: {
            //获取分类列表数据
           async getCategoriesList(){
                const {data: res} = await this.$http.get('categories',{params: this.queryInfo})
                console.log(res.data)
                this.categoriesList = res.data.result
                this.total = res.data.total
                
            },
            // 改变显示页数时
            handleSizeChange(ps){
                this.queryInfo.pagesize = ps
                this.getCategoriesList()
            },
            // 移动分页数时
            handleCurrentChange(pn){
                this.queryInfo.pagenum = pn
                this.getCategoriesList()
            },
            // 展示添加用户对话框
            showDialog(){
                this.getParentCatList()
                this.addDialogVisible = true
            },
            // 获取父级分类的数据列表
            async getParentCatList(){
                const {data: res} = await this.$http.get('categories',{params: {type: 2}})
                if (res.meta.status != 200) {
                this.$message.error("获取数据失败")
                }else{
                    this.parentCatList = res.data
                    // console.log(res)
                    console.log(this.parentCatList)
                }
            },
            // 保存选择框的数据并更新addCataForm的值
            saveChooseItem(){
                // console.log(this.value)
                if (this.selectItem.length > 0) {
                    this.addCataForm.cat_pid = this.selectItem[this.selectItem.length - 1]
                    this.addCataForm.cat_level = this.selectItem.length
                }else{
                    this.addCataForm.cat_pid = 0
                    this.addCataForm.cat_level = 0
                }
            },
            // 重置对话框
            resetAddCateDialog(){
                this.$refs.addCataFormRef.resetFields()
                this.selectItem = []
                this.addCataForm.cat_pid = 0
                this.addCataForm.cat_level = 0
            },
            // 添加分类发送请求
            addCate(){
                this.$refs.addCataFormRef.validate(async vali => {
                    if (!vali) return
                    const {data: res} = await this.$http.post('categories',this.addCataForm)
                    if (res.meta.status != 200) this.$message.error("添加分类失败")
                    this.$message.success("添加分类成功")
                    this.getCategoriesList()
                    // console.log(this.addCataForm)
                    this.addDialogVisible = false
                })
            },
        },
    }
</script>
<style lang="less" scoped>
.treeMTope{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>