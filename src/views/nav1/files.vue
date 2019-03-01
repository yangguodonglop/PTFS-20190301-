<template>
	<section class="chart-container">
		<el-tabs v-model="activeName" @tab-click="handleClick">
    	<el-tab-pane label="文件查询" name="first">
			<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" ref="findForm" :model="findForm">
				<el-form-item label="开始时间">
					 <el-date-picker
						v-model="findForm.startTime"
						type="datetime"
						@change="getSTimestart"
						 value-format="yyyy-MM-dd HH:mm"
						placeholder="选择日期时间">
   					 </el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					 <el-date-picker
						v-model="findForm.endTime"
            	@change="getSTimeend"
						type="datetime"
            value-format="yyyy-MM-dd HH:mm"
						placeholder="选择日期时间">
   					 </el-date-picker>
				</el-form-item>
				<el-form-item label="用户ID">
					<el-input v-model.trim="findForm.userId"></el-input>
				</el-form-item>
				<el-form-item label="文件名">
					<el-input v-model.trim="findForm.fileName"></el-input>
				</el-form-item>
				<el-form-item label="矿机节点ID">
					<el-input v-model.trim="findForm.minerId" style="width:400px"></el-input>
				</el-form-item>
         <el-form-item label="文件哈希" >
					<el-input v-model.trim="findForm.fileHashId" style="width:468px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="tableData.slice((currentPageCx-1)*pagesizeCx,currentPageCx*pagesizeCx)" highlight-current-row v-loading="listLoading" @sort-change="tabDataChangeList" style="width: 100%;" :border="true">
			<el-table-column prop="fileName" label="文件名" align="center" min-width="150">
			</el-table-column>
			<el-table-column prop="fileSize" label="文件大小" align="center" :formatter="formatByte" sortable>
			</el-table-column>
			<el-table-column prop="fileHashId" label="文件哈希" align="center" min-width="250">
			</el-table-column>
			<el-table-column prop="fileStoreTime" label="上传详情" align="center"  sortable>
			</el-table-column>
			<el-table-column label="操作" width="150" align="center">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			 <el-pagination
           @size-change="handleSizeChangeCx"
           @current-change="handleCurrentChangeCx"
          :current-page="currentPageCx"
           :page-sizes="[5, 10, 20]" 
            :page-size="pagesizeCx"        
            layout="total, sizes, prev, pager, next, jumper"
            style="float:right"
            :total="tableData.length">    
         </el-pagination>
		</el-col>
		</template>
	</el-tab-pane>
    <el-tab-pane label="黑名单" name="second">
			<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" ref="blackListForm" :model="blackListForm">
				<el-form-item label="开始时间">
					 <el-date-picker
						v-model="blackListForm.startTime"
						type="datetime"	
						@change="getSTimestartBlackList"
						 value-format="yyyy-MM-dd HH:mm"
						placeholder="选择日期时间">
   					 </el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					 <el-date-picker
						v-model="blackListForm.endTime"
						type="datetime"
           @change="getSTimeendBlackList"
           value-format="yyyy-MM-dd HH:mm"
						placeholder="选择日期时间">
   					 </el-date-picker>
				</el-form-item>
				<el-form-item label="文件名">
					<el-input v-model.trim="blackListForm.fileName"></el-input>
				</el-form-item>
				<el-form-item label="文件哈希">
					<el-input v-model.trim="blackListForm.fileHashId" style="width:450px;"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model.trim="blackListForm.descript"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="onSubmitBlackList('single')">查询</el-button>
					<el-button type="primary"  @click="onSubmitBlackList('all')">加载所有黑名单</el-button>
					<el-button type="primary"  @click="onCreate('single')">新增</el-button>
					<el-button type="primary"  @click="onCreate('all')">批量新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="tableDataBlacklist.slice((currentPageHmd-1)*pagesizeHmd,currentPageHmd*pagesizeHmd)" highlight-current-row v-loading="loading" :border="true" style="width: 100%;">
				<el-table-column prop="fileName" label="文件名"  min-width="150" align="center" >
				</el-table-column>
				<el-table-column prop="fileHashId" min-width="300" label="文件哈希" align="center" >
				</el-table-column>
				<el-table-column prop="version" label="版本" align="center">
				</el-table-column>
				<el-table-column prop="descript" label="描述" align="center">
				</el-table-column>
	
        <el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
				
			</el-table>
      <el-pagination
        @size-change="handleSizeChangeHmd"
                            @current-change="handleCurrentChangeHmd"
                            :current-page="currentPageHmd"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizeHmd"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right;margin-top:10px;"
                            :total="tableDataBlacklist.length">
			</el-pagination>
		</template>
	</el-tab-pane>

  </el-tabs>

  <!-- 查看详情弹窗 -->
  <el-dialog title="" :visible.sync="dialogTableVisible"   customClass="customWidthActive">
	  <div class="dialog_item_title" style="display:flex;">
		
			 <div class="item_title_text">
				 	文件哈希：{{titleData.fileHashId}}
			 </div>
			 <div class="item_title_text">
				 	大小:{{titleData.fileSize}}
			 </div>
		
		    
			  <div class="item_title_text">
				 	上传时间： {{titleData.fileStoreTime}}
			 </div>
			  <div class="item_title_text">
				 	文件名：{{titleData.fileName}}
			 </div>

		  
			  <div class="item_title_text">
				<el-button type="primary" @click="backUp()">备份</el-button>
				<el-button type="success" @click="getCache()">缓存</el-button>
				<el-button type="info"   @click="getRefresh()">刷新</el-button>
				<el-button type="danger"   @click="deleteData()">删除</el-button>
			 </div>
		 
	  </div>
	  <div class="dialog_item_table">
      <el-tabs v-model="activeNameXq" @tab-click="handleClick">
        <el-tab-pane label="备份/缓存数量" name="first">
            <el-col :span="24">
             
              <div class="item_title_child">
                  <el-table :data="tableDataBf.slice((currentPageBf-1)*pagesizeBf,currentPageBf*pagesizeBf)" :border="true"   @sort-change="tabDataChangeBf">
                    
                    <el-table-column prop="storeNodeId" label="节点哈希" align="center" min-width="300"></el-table-column>
                    <el-table-column property="storeNodeRegionNum" label="分区" align="center" sortable></el-table-column>
                    <el-table-column property="storeNodeGroupNum" label="分组" align="center" sortable></el-table-column>
                    <el-table-column property="storeTimestamp" label="上传时间" align="center" min-width="200" sortable></el-table-column>
                    <el-table-column property="storeType" label="存储类型" align="center" sortable></el-table-column>
                    <el-table-column property="nodeType" label="节点类型" align="center" sortable></el-table-column>
                    <el-table-column property="nodeStoreUsage" label="已占用/总空间" align="center" min-width="100" ></el-table-column>
                    <el-table-column  label="操作" align="center" width="150">
                      <template slot-scope="scope">
                          <el-button size="small" @click="handleDetails(scope.$index, scope.row)">查看详情</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                     @size-change="handleSizeChangeBf"
                            @current-change="handleCurrentChangeBf"
                            :current-page="currentPageBf"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizeBf"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right"
                            :total="tableDataBf.length"> 
                  </el-pagination>
              </div>
		       </el-col>
        </el-tab-pane>
        <el-tab-pane label="文件拥有者" name="second">
           <el-col :span="24">
             
              <div class="item_title_child">
                  <el-table :data="tableDataYyz.slice((currentPageYyz-1)*pagesizeYyz,currentPageYyz*pagesizeYyz)" :border="true" @sort-change="tabDataChangeYyz">
                    <el-table-column prop="owner" label="用户名" align="center" ></el-table-column>
                    <el-table-column property="fileName" label="文件名" align="center" ></el-table-column>
                    <el-table-column property="timestamp" label="上传时间" align="center" sortable></el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChangeYyz"
                            @current-change="handleCurrentChangeYyz"
                            :current-page="currentPageYyz"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizeYyz"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right"
                            :total="tableDataYyz.length">   
                  </el-pagination>
              </div>
            </el-col>

        </el-tab-pane>
        <el-tab-pane label="日志记录" name="third">
             <el-col :span="24">
             
              <div class="item_title_child">
                  <el-table :data="tableDataRzjl.slice((currentPageRz-1)*pagesizeRz,currentPageRz*pagesizeRz)" :border="true" @sort-change="tabDataChangeRzjl">
                    <el-table-column prop="timestamp" label="时间" align="center" sortable ></el-table-column>
                    <el-table-column property="action" label="Action" align="center"   ></el-table-column>
                     <el-table-column property="code" label="Code" align="center" sortable></el-table-column>
                    <el-table-column property="nodeSelf" label="SourceNode" align="center" min-width="200"   ></el-table-column>
                    <el-table-column property="nodeTarget" label="TargetNode" align="center"   min-width="200"  ></el-table-column>
                    
                    <el-table-column property="descript" label="描述" align="center"></el-table-column>
                  </el-table>
                  <el-pagination
                   @size-change="handleSizeChangeRz"
                            @current-change="handleCurrentChangeRz"
                            :current-page="currentPageRz"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizeRz"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right"
                            :total="tableDataRzjl.length">    
                  </el-pagination>
              </div>
		       </el-col>
        </el-tab-pane>
        
    </el-tabs>
	  </div>
</el-dialog>

<!-- 黑名单新增弹窗 -->
 <el-dialog title="" :visible.sync="dialogCreateVisible"   customClass="customWidth1">
	  <div class="dialog_item_title">
		  <el-col :span="24">
			 <div class="item_title_create">
				 	<el-form :inline="true" ref="createForm" :model="createForm">
            <el-col :span="24">
              <div style="width:80%;margin:0 auto;">
              <el-col :span="4">
              <div class="create_div">文件名:</div>
              </el-col>
                <el-col :span="20">
              <div class="create_div_input">
                <el-input v-model.trim="createForm.fileName" placeholder="请输入文件名"></el-input>
              </div>
              </el-col>
              </div>
                
           </el-col>
            <el-col :span="24">
               <div style="width:80%;margin:0 auto;">
              <el-col :span="4">
              <div class="create_div">文件ID:</div>
              </el-col>
                <el-col :span="20">
              <div class="create_div_input">
                <el-input v-model.trim="createForm.fileHashId" placeholder="请输入文件ID"></el-input>
              </div>
              </el-col>
                  </div>
                
           </el-col>
            <el-col :span="24">
               <div style="width:80%;margin:0 auto;">
              <el-col :span="4">
              <div class="create_div">文件描述:</div>
              </el-col>
                <el-col :span="20">
              <div class="create_div_input">
                <el-input v-model.trim="createForm.descript" placeholder="请输入文件描述"></el-input>
              </div>
              </el-col>
                    </div>
           </el-col>
           
        <el-col :span="24">
          <div style="width:60px; margin:20px auto;">
				<el-form-item>
					<el-button type="primary" @click="onSubmitAdd()"  >确定</el-button>
				</el-form-item>
        </div>
          </el-col>
          
			</el-form>
      
			 </div>
		 </el-col>
	  </div>
</el-dialog>

<!-- 黑名单批量新增弹窗 -->
<el-dialog title="" :visible.sync="dialogAllCreateVisible"   customClass="customWidth1">
	  <div class="dialog_item_title">
		  <el-col :span="24">
			 <div class="item_title_create">
				 	<el-form :inline="true" ref="createForm" :model="createForm">
             <el-col :span="24">
              <div style="width:80%;margin:0 auto;">
              <el-col :span="4">
              <div class="create_div">文件名:</div>
              </el-col>
                <el-col :span="20">
              <div class="create_div_input">
                  <el-upload
                   class="upload-demo"
                    ref="upload"
                    drag
                    name="file"
                    :before-upload="beforeAvatarUpload" 
                    action=""
                    :file-list="fileList"
                    :http-request="uploadSectionFile"
                    :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传.bl文件.</div>
                  </el-upload>
              </div>
              </el-col>
              </div>   
           </el-col>
        <el-col :span="24">
          <div style="width:60px; margin:20px auto;">
				<el-form-item>
					<el-button type="primary" @click="submitUpload()"  >确定</el-button>
				</el-form-item>
        </div>
          </el-col>
          
			</el-form>
      
			 </div>
		 </el-col>
	  </div>
</el-dialog>

<!-- 缓存弹窗 -->
<el-dialog title="" :visible.sync="dialogCacheVisible"   customClass="customWidth">
	  <div class="dialog_item_title" style="display:flex;flex-direction: column;">
      <div>
        <el-table style="width:100%;" ref="multipleTable" @selection-change="handleSelectionChange" :data="tableDataDetails.slice((currentPageJd-1)*pagesizeJd,currentPageJd*pagesizeJd)" @row-click="openDetails" :border="true" @sort-change="tabDataChange">
					<el-table-column type="selection" width="110" align="center">	</el-table-column>
					<el-table-column	prop="nodeId"	label="节点ID" min-width="300" align="center">	</el-table-column>
					<el-table-column	prop="backUpUsage"	label="备份已占用" align="center" min-width="90" sortable :formatter="formatByte">	</el-table-column>
					<el-table-column	prop="cacheUsage"	label="缓存已占用" align="center" min-width="90" sortable :formatter="formatByte" >	</el-table-column>
					<el-table-column	prop="totalUsage"	label="占用总空间" align="center" min-width="90" :formatter="formatByte" sortable>	</el-table-column>
					<el-table-column	prop="regionNum"	label="分区号" align="center" min-width="90" sortable>	</el-table-column>
					<el-table-column	prop="groupNum"	label="分组号" align="center" min-width="90"  sortable>	</el-table-column>
				</el-table>
        </div>
        <div>
				 <el-pagination
           @size-change="handleSizeChangeJd"
           @current-change="handleCurrentChangeJd"
          :current-page="currentPageJd"
          :page-sizes="[5, 10, 20]" 
          :page-size="pagesizeJd"        
          layout="total, sizes, prev, pager, next, jumper"
          style="float:right;margin-top:20px;margin-bottom:0px;"
          :total="tableDataDetails.length">    
       </el-pagination>
       </div>
       <div style="margin-top: 20px;display: flex;justify-content: center;">
          <el-button @click="selectionSubmit()">确定</el-button>
          <el-button @click="toggleSelection()">取消</el-button>
      </div>
		 
	  </div>
</el-dialog>   
	

	</section>
</template>
<script>
import { getUserList } from "../../api/api";
//import NProgress from 'nprogress'
import {
  queryFileSummaryByConditions,
  queryOneFileBackupOwnerRecords,
  queryBlackListByCondition,
  deleteFileList,
  addNewForbiddenFile,
  backupFileByCondition,
  uploadBlackListFile,
  updateBlackListFile,
  queryAllNodeProfiesByNodeTypes,
  queryAllNodesProfiles
} from "../../api/api";
export default {
  data() {
    return {
      cmdType: "",
      nodeHash: [],
      multipleSelection: [],
      details_length: "",
      tableDataDetails: [],
      userId: "blackListFile",
      fileList: [],
      loading: false,
      tableDataBlacklist: [],
      titleData: {},
      tableDataYyz: [],
      tableDataBf: [],
      tableDataRzjl: [],
      findForm: {
        startTime: "",
        endTime: "",
        userId: "",
        fileHashId: "",
        fileName: "",
        minerId: ""
      },
      blackListForm: {
        startTime: "",
        endTime: "",
        fileName: "",
        fileHashId: "",
        descript: ""
      },
      createForm: {
        descript: "",
        fileHashId: "",
        fileName: ""
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        startTime: "2018-01-01",
        endTime: "2019-01-01",
        userId: "",
        fileHashId: "",
        fileName: "",
        minerId: ""
      },

      tableData: [],
      currentPage: 1,
      pagesize: 10,
      currentPageCx: 1,
      pagesizeCx: 10,
      currentPageHmd: 1,
      pagesizeHmd: 10,
      currentPageBf: 1,
      pagesizeBf: 10,
      currentPageRz: 1,
      pagesizeRz: 10,
      currentPageYyz: 1,
      pagesizeYyz: 10,
      currentPageJd: 1, //初始页
      pagesizeJd: 10, //    每页的数据

      dialogTableVisible: false,
      dialogCreateVisible: false,
      dialogAllCreateVisible: false,
      dialogCacheVisible: false,
      filters: {
        name: ""
      },
      activeNameXq: "first",
      activeName: "first",
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      allFileHashId: "",
      sels: [] //列表选中列
    };
  },
  mounted() {
    //获取当前时间
    let nowDate = new Date();
    let endTime = this.common.getTimes(nowDate);
    this.findForm.endTime = endTime; // 当前的时间点
    this.blackListForm.endTime = endTime;

    //获取往前往前一星期时间
    let befDate = new Date(nowDate.getTime() - 7 * 24 * 3600 * 1000);
    let startTime = this.common.getTimes(befDate);
    this.findForm.startTime = startTime; // 向前推迟一周的时间点
    this.blackListForm.startTime = startTime;

    this.getUsers();
    this.getBlacklist();
  },
  methods: {
    //字节转化
    formatByte: function(row, column, cellValue, index) {
      var limit = parseInt(cellValue);
      var size = "";
      if (limit < 0.1 * 1024) {
        //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {
        //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        //小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }

      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      // if (dou == "00") {
      //   //判断后两位是否为00，如果是则删除00
      //   return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      // }
      return size;
      titleData.fileSize = size;
    },

    my_desc_sort(a, b) {
      if (a[this.propname] > b[this.propname]) {
        return -1;
      } else if (a[this.propname] < b[this.propname]) {
        return 1;
      } else {
        return 0;
      }
    },
    my_asc_sort(a, b) {
      if (a[this.propname] < b[this.propname]) {
        return -1;
      } else if (a[this.propname] > b[this.propname]) {
        return 1;
      } else {
        return 0;
      }
    },
    //排序改变时触发函数
    tabDataChange(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataDetails = this.tableDataDetails.sort(this.my_desc_sort);
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataDetails = this.tableDataDetails.sort(this.my_asc_sort);
        this.$forceUpdate();
      }
    },

    //文件查询列表排序
    tabDataChangeList(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableData = this.tableData.sort(this.my_desc_sort);
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableData = this.tableData.sort(this.my_asc_sort);
        this.$forceUpdate();
      }
    },
    //备份缓存列表排序
    tabDataChangeBf(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataBf = this.tableDataBf.sort(this.my_desc_sort);
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataBf = this.tableDataBf.sort(this.my_asc_sort);
        this.$forceUpdate();
      }
    },
    //文件拥有者列表排序
    tabDataChangeYyz(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataYyz = this.tableDataYyz.sort(this.my_desc_sort);
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataYyz = this.tableDataYyz.sort(this.my_asc_sort);
        this.$forceUpdate();
      }
    },
    //日志记录列表查询
    tabDataChangeRzjl(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataRzjl = this.tableDataRzjl.sort(this.my_desc_sort);
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataRzjl = this.tableDataRzjl.sort(this.my_asc_sort);
        this.$forceUpdate();
      }
    },

    //备份数量查看详情
    handleDetails(index, row) {
      this.$router.push({
        path: "/nodes",
        query: { tabActive: "second", nowStoreNodeId: row.storeNodeId }
      });
    },
    //黑名单批量上传
    submitUpload() {
      this.dialogAllCreateVisible = false;
      let list = document.getElementsByClassName(
        "el-upload-list__item is-ready"
      );
      if (list.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要导入的模板！"
        });
        return;
      }
      this.$refs.upload.submit();
    },
    uploadSectionFile(param) {
      var fileObj = param.file;
      // FormData 对象
      var form = new FormData();
      // 文件对象
      form.append("file", fileObj);
      uploadBlackListFile(form).then(res => {
        if (res.result == "ok") {
          this.getNewBlacklist();
        } else {
        }
      });
    },

    onSubmitAddall: function() {
      this.dialogAllCreateVisible = false;
    },
    beforeAvatarUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "bl";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$message({
          message: "上传模板只能是.bl格式!",
          type: "warning"
        });
        //
      }
      //                 if (!isLt2M) {
      //                     this.$message({
      //                         message: '上传模板大小不能超过 10MB!',
      //                         type: 'warning'
      //                     });
      // //                    console.log('上传模板大小不能超过 10MB!')
      //                 }
      // if (extension || extension2 && isLt2M == true) {
      //     console.log(file)
      //     let fd = new FormData()
      //     fd.append('invoiceTypeId', this.invoice_type_id)//随文件上传的其他参数
      //     fd.append('epid', this.epid)
      //     fd.append('file', file)
      //     // console.log(fd)
      //     this.newImport(fd).then(function (res) {//校验完成后提交
      //         console.log(res)
      //     }, function () {
      //         console.log('failed');
      //     });
      //     return true
      // }
      return extension;
    },

    //黑名单新增
    onSubmitAdd: function() {
      let param = this.createForm;
      this.dialogCreateVisible = false;
      addNewForbiddenFile(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.getNewBlacklist();
          } else {
            this.$message({
              message: msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //查看详情备份
    backUp: function() {
      this.cmdType = "backup";

      let param = new Object();
      // param.fileHashId = this.titleData.fileHashId;
      // param.backUpCount = 1;
      queryAllNodesProfiles(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.dialogCacheVisible = true;
            this.tableDataDetails = res.data;
          } else {
            this.$message({
              message: msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },

    //查看详情缓存
    getCache: function() {
      this.cmdType = "cache";

      let param = new Object();
      // param.fileHashId = this.titleData.fileHashId;
      // param.backUpCount = 1;
      queryAllNodesProfiles(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.dialogCacheVisible = true;
            this.tableDataDetails = res.data;
          } else {
            this.$message({
              message: msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },

    //查看详情删除
    deleteData: function() {
      let param = new Object();
      param.FileHashId = this.titleData.fileHashId;
      deleteFileList(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.$message({
              message: msg,
              type: "success"
            });
          } else {
            this.$message({
              message: msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //分页
    handleCurrentChangeCx: function(currentPage) {
      this.currentPageCx = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeCx: function(size) {
      this.pagesizeCx = size; //每页下拉显示数据
    },
    handleCurrentChangeHmd: function(currentPage) {
      this.currentPageHmd = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeHmd: function(size) {
      this.pagesizeHmd = size; //每页下拉显示数据
    },
    handleCurrentChangeBf: function(currentPage) {
      this.currentPageBf = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeBf: function(size) {
      this.pagesizeBf = size; //每页下拉显示数据
    },
    handleCurrentChangeYyz: function(currentPage) {
      this.currentPageYyz = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeYyz: function(size) {
      this.pagesizeYyz = size; //每页下拉显示数据
    },
    handleCurrentChangeRz: function(currentPage) {
      this.currentPageRz = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeRz: function(size) {
      this.pagesizeRz = size; //每页下拉显示数据
    },
    //分页
    handleCurrentChangeJd: function(currentPage) {
      this.currentPageJd = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeJd: function(size) {
      this.pagesizeJd = size; //每页下拉显示数据
    },
    //黑名单新增
    onCreate: function(e) {
      if (e === "all") {
        this.dialogAllCreateVisible = true;
      } else {
        this.dialogCreateVisible = true;
      }
    },
    //黑名单批量添加
    onAllCreate: function() {},
    //详情选项卡
    handleClick(tab, event) {
      // console.log(tab, event);
    },

    getSTimestart(val) {
      this.findForm.startTime = val; //获取文件查询开始时间改变是的值
    },
    getSTimeend(val) {
      this.findForm.endTime = val; //获取文件查询结束时间改变是的值
    },
    getSTimestartBlackList(val) {
      this.blackListForm.startTime = val; //获取黑名单开始时间改变是的值
    },
    getSTimeendBlackList(val) {
      this.blackListForm.endTime = val; //获取黑名单结束时间改变是的值
    },

    //获取用户列表
    getUsers() {
      let param = this.findForm;
      this.listLoading = true;
      //NProgress.start();
      queryFileSummaryByConditions(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            this.listLoading = false;
            this.tableData = res.data;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },

    //获取黑名单列表
    getBlacklist() {
      let param = this.blackListForm;
      this.listLoading = true;
      //NProgress.start();
      queryBlackListByCondition(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            this.listLoading = false;
            this.tableDataBlacklist = res.data;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },

    //新增，批量新增，删除后不传结束时间的查询
    getNewBlacklist() {
      let newparam = {};
      newparam.startTime = this.blackListForm.startTime;
      newparam.descript = "";
      newparam.fileHashId = "";
      newparam.fileName = "";
      newparam.endTime = "";

      this.listLoading = true;
      //NProgress.start();

      queryBlackListByCondition(newparam)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            this.listLoading = false;
            this.tableDataBlacklist = res.data;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let param = {
            FileHashId: row.fileHashId
          };
          updateBlackListFile(param).then(res => {
            let { result, msg, data } = res;
            if ((result = "ok")) {
              this.getNewBlacklist();
            }
          });
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //查看详情页面
    handleEdit: function(index, row) {
      this.currentPageBf = 1;
      this.currentPageYyz = 1;
      this.currentPageRz = 1;
      this.activeNameXq = "first";
      this.titleData = {};
      this.titleData.fileHashId = row.fileHashId;
      this.titleData.fileStoreTime = row.fileStoreTime;
      this.titleData.fileName = row.fileName;
      var limit = parseInt(row.fileSize);
      var size = "";
      if (limit < 0.1 * 1024) {
        //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {
        //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        //小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }

      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      // if (dou == "00") {
      //   //判断后两位是否为00，如果是则删除00
      //   return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      // }
      this.titleData.fileSize = size;

      let param = new Object();
      param.FileHashId = row.fileHashId;
      this.allFileHashId = row.fileHashId;

      queryOneFileBackupOwnerRecords(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.dialogTableVisible = true;
            this.tableDataBf = res.data.fileBackUpList;
            this.tableDataYyz = res.data.fileOwnerList;
            this.tableDataRzjl = res.data.fileExpLogList;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },

    handleClick(tab, event) {},
    getUser: function() {},

    //文件查询
    onSubmit() {
      this.currentPageCx = 1;
      let param = this.findForm;
      this.listLoading = true;
      var IEtimetypeStart = param.startTime;
      var IEtimetypeEnd = param.endTime;
      IEtimetypeStart = IEtimetypeStart.replace(/-/g, "/");
      IEtimetypeEnd = IEtimetypeEnd.replace(/-/g, "/");
      // 判断结束时间是否大于起始时间
      var timeStatus = this.common.checkTimes(IEtimetypeStart, IEtimetypeEnd);

      if (timeStatus == false) {
        this.$message.error("结束时间必须大于起始时间");
        this.listLoading = false;
        return false;
      }
      queryFileSummaryByConditions(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.listLoading = false;
            this.tableData = res.data;
          } else {
            this.$message({
              message: "msg",
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //黑名单查询
    onSubmitBlackList(e) {
      this.currentPageHmd = 1;
      let param = "";
      if (e === "all") {
        this.blackListFormAll = {
          startTime: "",
          endTime: "",
          fileName: "",
          fileHashId: "",
          descript: ""
        };
        param = this.blackListFormAll;
      } else {
        param = this.blackListForm;

        var IEtimetypeStart = param.startTime;
        var IEtimetypeEnd = param.endTime;
        IEtimetypeStart = IEtimetypeStart.replace(/-/g, "/");
        IEtimetypeEnd = IEtimetypeEnd.replace(/-/g, "/");
        // 判断结束时间是否大于起始时间
        var timeStatus = this.common.checkTimes(IEtimetypeStart, IEtimetypeEnd);
        if (timeStatus == false) {
          this.$message.error("结束时间必须大于起始时间");
          this.listLoading = false;
          return false;
        }
      }
      this.dialogCreateVisible = false;
      queryBlackListByCondition(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.listLoading = false;
            this.tableDataBlacklist = res.data;
          } else {
            this.$message({
              message: "msg",
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },

    //取消
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //勾选获取的数据ID
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.nodeHash = [];
      for (let i = 0; i < val.length; i++) {
        var nodeId = val[i].nodeId;
        this.nodeHash.push(nodeId);
      }
    },
    //备份，缓存时点击确认发送请求
    selectionSubmit() {
      let param = {
        cmdType: this.cmdType,
        fileHash: this.titleData.fileHashId,
        fileSize: this.titleData.fileSize,
        nodeHash: this.nodeHash
      };
      if (this.nodeHash.length < 1) {
        this.$message.error("请至少勾选一项");
        return false;
      }
      backupFileByCondition(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.dialogCacheVisible = false;
            this.$message({
              message: "指令已发送成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //刷新
    getRefresh() {
      // this.
      let param = new Object();
      param.FileHashId = this.allFileHashId;

      queryOneFileBackupOwnerRecords(param)
        .then(res => {
          let { result, msg, data } = res;
          if (result == "ok") {
            this.tableDataBf = res.data.fileBackUpList;
            this.tableDataYyz = res.data.fileOwnerList;
            this.tableDataRzjl = res.data.fileExpLogList;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="less">
.chart-container {
  // width: 100%;
  float: left;
  min-width: 1450px;
}
.customWidth {
  width: 85%;
}
.customWidthActive {
  width: 95%;
}
.customWidth1 {
  width: 30%;
}
.dialog_item_title {
  width: 100%;
  overflow: hidden;
  height: auto;
}
.item_title_text {
  width: auto;
  margin: 0 auto;
  height: 50px;
  background: #f2f2f2;
  line-height: 50px;
  text-align: center;
  padding: 0px 25px;
  border-radius: 3px;
}
.item_title_h1 {
  width: 90%;
  line-height: 50px;
  margin: 0 auto;
}
.dialog_item_table {
  width: 100%;
  height: auto;

  padding: 30px auto;
  overflow: hidden;
  margin: 50px auto;
  .item_title_child {
    width: 100%;
    margin: 0 auto;
    height: auto;
    background: #f2f2f2;
    overflow: hidden;
    text-align: center;
  }
}
.item_title_create {
  height: auto;
  overflow: hidden;
}
.create_div {
  width: 150px;
  line-height: 38px;
  text-align: left;
  margin-top: 15px;
}
.create_div_input {
  float: left;
  margin-top: 15px;
  .el-input__inner {
    width: 300px;
  }
}
</style>
