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
                    <el-button type="primary" @click=" addDialogVisible = true">添加用户</el-button>
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
            <tree-table :data="categoriesList" :columns="columns" :show-row-hover="false" :selection-type="false" :expand-type="false" border show-index index-text="#">
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen;"></i>
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
                    }
            ]
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
            handleSizeChange(ps){
                this.queryInfo.pagesize = ps
                this.getCategoriesList()
            },
            handleCurrentChange(pn){
                this.queryInfo.pagenum = pn
                this.getCategoriesList()
            }
        },
    }
</script>
<style lang="less" scoped>
    
</style>