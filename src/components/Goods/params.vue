<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: './home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >商品管理</el-breadcrumb-item>
            <el-breadcrumb-item >参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告 -->
            <el-alert show-icon title="注意:只允许为第三级分类设置参数!" type="warning" :closable="false"></el-alert>
            <!-- 选择商品分类区 -->
            <el-row class="marTop">
                <el-col >
                    <span>选择商品分类:</span>
                    <el-cascader v-model="selectItem" :options="cateList" clearable :props="cascaderProps" @change="saveChooseItem"></el-cascader>
                </el-col>
              </el-row>
            <!-- Tabs标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 动态参数 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable"  @click="addPar">添加参数</el-button>
                    <el-table :data="cateAttributesList" stripe border style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleTag(index, scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope"><!-- slot-scope="scope" -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)" >编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleParOrAttr(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <!-- 静态属性 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addAttr">添加属性</el-button>
                    <el-table :data="cateAttributesList" stripe border style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleTag(index, scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope"><!-- slot-scope="scope" -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleParOrAttr(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
              </el-tabs>
              <!-- 添加参数/属性对话框 -->
              <el-dialog :title="'添加'+onlyOrMany" :visible.sync="addOOrMDialogVisible" width="50%" @close="resetAddDialog">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <!-- 参数/属性名称-->
                    <el-form-item :label="onlyOrMany + '名称:'" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="addOOrMDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setAjaxCateAndAttr">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改参数/属性 -->
            <el-dialog :title="'修改'+onlyOrMany" :visible.sync="editOOrMDialogVisible" width="50%" @close="resetEditDialog">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <!-- 参数/属性名称-->
                    <el-form-item :label="onlyOrMany + '名称:'" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="editOOrMDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editAjaxCateAndAttr">确 定</el-button>
                </span>
            </el-dialog>
        </el-card> 
    </div>
</template>
<script>
export default{
    data() {
        return {
            // 商品分类参数
            cateList:[],
            // cascaderProps
            cascaderProps:{
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 选中的分类数组
            selectItem:[],
            activeName:'many',
            selectId: null,
            cateAttributesList: [],
            // 添加dialog显示初始值
            addOOrMDialogVisible: false,
            // 修改dialog显示初始值
            editOOrMDialogVisible: false,
            addForm:{
                attr_name: ''
            },
            // 添加表单验证规则
            addFormRules:{
                attr_name: [
                    { required: true, message: `请输入名称`, trigger: 'blur' },
                     ]
            },
            editForm:{
                attr_name: '',
                attr_id: null
            },
            // 修改表单验证规则
            editFormRules:{
                attr_name: [
                    { required: true, message: `请输入名称`, trigger: 'blur' },
                     ]
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //获取分类列表数据
        async getCateList(){
                const {data: res} = await this.$http.get('categories')
                console.log(res.data)
                this.cateList = res.data
            },
        // 根据Id值获取参数列表 categories/:id/attributes
        async getCateAttributes(){
            this.cateAttributesList = []
            const {data: res} = await this.$http.get(`categories/${this.selectId}/attributes`,{params: {sel: this.activeName}})
            if(res.meta.status != 200){
                return this.$message.error('获取数据失败')
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' '): []
                item.inputVisible = false
                item.inputValue = ''
            })
             console.log(res.data)
            this.cateAttributesList = res.data
        },
        saveChooseItem(){
            // console.log(this.selectItem)
            this.selectId = this.selectItem.slice(-1)
            this.getCateAttributes()
            // console.log(typeof this.selectId,this.selectId)
        },
        handleClick(){
            // console.log(this.activeName)
            this.getCateAttributes()
        },
        // 重置添加表单
        resetAddDialog(){
            this.$refs.addFormRef.resetFields()
        },
        // 重置修改表单
        resetEditDialog(){
            this.$refs.editFormRef.resetFields()
        },
        // 添加参数
        addPar(){
            this.addOOrMDialogVisible = true
            // console.log(this.activeName)
            // console.log(this.activeName === "only" ? "参数":"属性")
        },
        // 添加属性
        addAttr(){
            this.addOOrMDialogVisible = true
            // console.log(this.activeName === "only" ? "参数":"属性")
            // console.log(this.activeName)
        },
        // 发送请求添加参数或者属性
        setAjaxCateAndAttr(){
            this.$refs.addFormRef.validate(async vali => {
                if (!vali) return
                const {data: res} = await this.$http.post(`categories/${this.selectId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
                // console.log(res)
                if(res.meta.status != 201) return this.$message.error('添加数据失败')
                this.$message.success('添加数据成功')
                this.getCateAttributes()
            })
            this.addOOrMDialogVisible = false
        },
        // 编辑属性/参数
        showEditDialog(value){
            this.editOOrMDialogVisible = true
            this.editForm.attr_name = value.attr_name
            this.editForm.attr_id = value.attr_id
            // console.log(this.selectId)
        },
        // 发送编辑属性/参数请求
        editAjaxCateAndAttr(){
            this.$refs.editFormRef.validate(async vali => {
                if(!vali) return
                const {data: res} = await this.$http.put(`categories/${this.selectId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
                // console.log(res)
                if(res.meta.status != 200) return this.$message.error('编辑数据失败')
                this.$message.success('编辑数据成功')
                this.getCateAttributes()
            })
            this.editOOrMDialogVisible = false
        },
        // 删除当前参数/属性
        async deleParOrAttr(value){
            const str = await this.$confirm(`此操作将永久删除该${this.activeName === "only" ? "属性":"参数"}, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(e => e)
            // console.log(res)
            if(str === 'cancel') return
            const {data: res} = await this.$http.delete(`categories/${this.selectId}/attributes/${value.attr_id}`)
            // console.log(res)
            if(res.meta.status != 200) return this.$message.error(`删除${this.activeName === "only" ? "属性":"参数"}失败`)
                this.$message.success(`删除${this.activeName === "only" ? "属性":"参数"}成功`)
                this.getCateAttributes()
        },
        handleInputConfirm(value){
            if (value.inputValue.trim().length === 0) {
                value.inputValue = ''
                value.inputVisible = false
                return
            }
            value.attr_vals.push(value.inputValue.trim())
            value.inputValue = ''
            value.inputVisible = false
            this.saveArrtValues(value)
        },
        showInput(value){
            value.inputVisible = true
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        async saveArrtValues(value){
            const {data: res} = await this.$http.put(`categories/${this.selectId}/attributes/${value.attr_id}`,{
                attr_name: value.attr_name,
                attr_sel: value.attr_sel,
                attr_vals: value.attr_vals.join(' ')
            })
            if(res.meta.status != 200) return this.$message.error(`修改参数失败`)
                this.$message.success(`修改参数成功`)
        },
        // 删除标签
        deleTag(index,value){
            value.attr_vals.splice(index,1)
            this.saveArrtValues(value)
        }
    },
    computed: {
        isBtnDisable(){
            if(this.selectItem.length !== 3){
                return true
            }
            return false
        },
        onlyOrMany(){
            if(this.activeName === 'only'){
                return '属性'
            }else{
                return '参数'
            }
        }
    },
}
</script>
<style lang="less" scoped>
.marTop{
    margin: 15px 0;
}
.el-cascader{
    margin-left: 5px;
}
.el-tag{
    margin: 10px;
}
/* .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  } */
.input-new-tag {
    width: 90px;
  }
</style>