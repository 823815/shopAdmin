<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '.././home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >商品管理</el-breadcrumb-item>
            <el-breadcrumb-item >添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 提示信息 -->
            <el-alert title="添加商品信息" center show-icon type="info"></el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品照片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!-- 步骤标签页 -->
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="leaveOne" @tab-click="tabClick">
                    <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name="0">
                        <!-- 商品名称 -->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <!-- 商品价格 -->
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input type="number" v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <!-- 商品重量 -->
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input type="number" v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <!-- 商品数量 -->
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input type="number" v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <!-- 商品分类 -->
                        <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品参数 -->
                    <el-tab-pane label="商品参数" name="1" before-leave>
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                              </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品属性 -->
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品照片 -->
                    <el-tab-pane label="商品照片" name="3">
                        <el-upload :action="uploadUrl" :on-preview="handlePreview" :headers="headerObj"
                        :on-remove="handleRemove" :on-success="saveUrl" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 显示图片对话框 -->
        <el-dialog title="图片加载" :visible.sync="dialogVisible" width="50%">
            <el-image style="width: 100%; height: 100%" :src="pictureUrl" fit="fit"></el-image>
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default{
data() {
    return {
        activeIndex: '0',
        cateList: [],
        addForm:{
            goods_cat: [],
            goods_name: '',
            goods_price: 0,
            goods_weight: 0,
            goods_number: 0,
            pics: [],
            goods_introduce: '',
            attrs:[]
        },
        addFormRules:{
            goods_name:[
                {required: true,message: '请输入商品名称', trigger: 'blur'}
            ],
            goods_price:[
                {required: true,message: '请输入商品价格', trigger: 'blur'}
            ],
            goods_weight:[
                {required: true,message: '请输入商品重量', trigger: 'blur'}
            ],
            goods_number:[
                {required: true,message: '请输入商品数量', trigger: 'blur'}
            ],
            goods_cat:[
                {required: true,message: '请选择商品分类', trigger: 'blur'}
            ]
        },
        cascaderProps:{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
        },
        manyTableData: [],
        onlyTableData: [],
        uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
        headerObj: {
            Authorization: window.sessionStorage.getItem('token')
        },
        dialogVisible: false,
        pictureUrl: ''
        // 商品分类选择值
        // catChooseValue: []
    }
},
created() {
    this.getCate()
},
methods: {
    async getCate(){
        const {data: res} = await this.$http.get('categories')
        // console.log(res)
        // if(res.meta.msg !== 200) {
        //     return
        // }
        this.cateList = res.data
        // console.log(this.cateList)
    },
    handleChange(){
        console.log(this.addForm.goods_cat)
        if(this.addForm.goods_cat.length !== 3){
            this.addForm.goods_cat = []
        }
    },
    leaveOne(newVal, oldVal){
        if(oldVal === '0' && this.addForm.goods_name === ''){
            this.$message.error('商品名不能为空')
            console.log(this.addForm.goods_price.toString())
            return false
        }else if(this.addForm.goods_price.toString() === ''){
            this.$message.error('商品价格不能为空')
            return false
        }else if(this.addForm.goods_weight.toString() === ''){
            this.$message.error('商品重量不能为空')
            return false
        }else if(this.addForm.goods_number.toString() === ''){
            this.$message.error('商品重量不能为空')
            return false
        }else if(this.addForm.goods_cat.length !== 3){
            this.$message.error('商品分类不能为空')
            return false
        }
    },
    async tabClick(){
        // console.log(this.activeIndex)
            if(this.activeIndex === '1'){
                const {data: res} = await this.$http.get(`categories/${this.addForm.goods_cat.slice(-1)}/attributes`,{params: {sel: 'many'}})
                console.log(res)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' '): []
                })
                this.manyTableData = res.data
            }else if(this.activeIndex === '2'){
                const {data: res} = await this.$http.get(`categories/${this.addForm.goods_cat.slice(-1)}/attributes`,{params: {sel: 'only'}})
                console.log(res)
                this.onlyTableData = res.data
            }
    },
    handlePreview(file){
        this.pictureUrl = file.response.data.url
        this.dialogVisible = true
    },
    handleRemove(file){
        const keyUrl = file.response.data.tmp_path
        for(let i=0; i<this.addForm.pics.length; i++){
            if(this.addForm.pics[i].pic === keyUrl){
                this.addForm.pics.splice(i,1);
            }
        }
        console.log(this.addForm.pics)
    },
    saveUrl(response){
        // console.log(response)
        const picInfo = {pic: response.data.tmp_path}
        this.addForm.pics.push(picInfo)
        console.log(this.addForm.pics)
    },
    add(){
        this.$refs.addFormRef.validate(async val => {
            if(!val){
                return this.$message.error('请填必要的表单项')
            }
            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            // 处理动态参数
            this.manyTableData.forEach(item => {
                item.attr_id
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                }
                this.addForm.attrs.push(newInfo)
            })
            this.onlyTableData.forEach(item => {
                item.attr_id
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            form.attrs = this.addForm.attrs
            // console.log(form)
            const {data: res} =await this.$http.post('goods',form)
            if(res.meta.status !== 201) return this.$message.error('添加商品失败')
            this.$router.push('/goods')
        })
    }
},
 }
</script>
<style lang="less" scoped>
.el-checkbox{
    margin: 0 10px 0 0 !important;
}
.btnAdd{
    margin-top: 15px;
}
</style>