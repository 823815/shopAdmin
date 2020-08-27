<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: './home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >商品管理</el-breadcrumb-item>
            <el-breadcrumb-item >商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <!-- 搜索与添加区域 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="goodsParams.query" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" >添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table :data="goodsList" stripe border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                <el-table-column prop="goods_price" label="商品价格" width="90px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
                <el-table-column prop="add_time" label="创建日期" width="120px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleGood(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="goodsParams.pagenum"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="goodsParams.pagesize"
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
                // 商品列表参数
                goodsParams:{
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                //商品列表
                goodsList: [],
                // 数据数目
                total: 0
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            // 获取商品列表
            async getGoodsList(){
                const {data: res} =await this.$http.get('goods',{ params: this.goodsParams})
                console.log(res)
                if(res.meta.status != 200) return this.$message.error('获取数据失败')
                this.goodsList = res.data.goods
                this.total = res.data.total
            },
            // 页码大小改变时触发
            handleSizeChange(ps){
              this.goodsParams.pagesize = ps
              this.getGoodsList()
            },
            // 当前页变动时候触发
            handleCurrentChange(pn){
              this.goodsParams.pagenum = pn
              this.getGoodsList()
            },
            //   删除商品
            async deleGood(id){
                // console.log(id)
                const str = await this.$confirm(`此操作将永久删除该${this.activeName === "only" ? "属性":"参数"}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(e => e)
                if(str === 'cancel') return
                const {data: res} =await this.$http.delete(`goods/${id}`)
                if(res.meta.status != 200) return this.$message.error('删除商品失败')
                this.$message.success('删除商品成功')
            }
        },
    }
</script>
<style lang="less" scoped>
    
</style>