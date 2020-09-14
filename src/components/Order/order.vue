<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: './home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >订单管理</el-breadcrumb-item>
            <el-breadcrumb-item >订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <!-- 搜索与添加区域 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="ordersParams.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table :data="orderList" stripe border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" ></el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay == 0">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
                <el-table-column prop="update_tame" label="下单时间" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.update_tame | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="250px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showVisible"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="ordersParams.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="ordersParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <!-- 修改地址-->
          <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClose">
            <el-form :model="addressFrom" :rules="addressFromRules" ref="addressFromRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader v-model="addressFrom.address1" :options="cityData"></el-cascader>
                    <!-- <el-input v-model="addressFrom.address1"></el-input> -->
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressFrom.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度 -->
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%" @close="addressDialogClose">
            <el-timeline reverse>
                <el-timeline-item color="#0bbd87"
                  v-for="activity in progressInfo"
                  :key="activity.time"
                  :timestamp="activity.ftime">
                  {{activity.context}}
                </el-timeline-item>
              </el-timeline>
        </el-dialog>
        </el-card>
    </div>
</template>
<script>
    import cityData from './citydata.js'
export default{
    data() {
        return {
            // 订单列表参数
            ordersParams:{
                    query: '',
                    pagenum: 1,
                    pagesize: 10
            },
            orderList: [],
            total:0,
            addressVisible: false,
            addressFrom: {
                address1: [],
                address2: ''
            },
            addressFromRules:{
                address1:[
                    { required: true, message: `请选择省市区/县`, trigger: 'blur' }  
                ],
                address2:[
                    { required: true, message: `请输入详细地址`, trigger: 'blur' }  
                ]
            },
            cityData,
            progressVisible: false,
            progressInfo: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList(){
            const {data: res} = await this.$http.get('orders',{params: this.ordersParams})
            if(res.meta.status != 200) return this.$message.error('获取数据失败')
            this.orderList = res.data.goods
            this.total = res.data.total
        },
        // 分页大小时触发
        handleSizeChange(val){
            this.ordersParams.pagesize = val
            this.getOrderList()
        },
        // 分页页面改变时触发
        handleCurrentChange(val){
            this.ordersParams.pagenum = val
            this.getOrderList()
        },
        showVisible(){
            this.addressVisible = true
        },
        addressDialogClose(){
            this.$refs.addressFromRef.resetFields()
        },
        async showProgressBox(){
            const {data: res} =await this.$http.get('/kuaidi/1106975712662')
            console.log(res)
            if(res.meta.status != 200) return this.$message.error('获取失败')
            this.progressInfo = res.data
            this.progressVisible = true
        }
    },
}
</script>
<style lang="less" scoped>
</style>