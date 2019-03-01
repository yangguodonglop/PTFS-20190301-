<template>
	<section class="chart-container">
		<!--工具条-->
	
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-row>
					<el-col :span="24">
						<div class="grid-content bg-purple new_grid-content">
							<el-tabs v-model="activeName" @tab-click="handleClick">
								<el-tab-pane label="节点分布" name="first">
                  <div style="display: flex;justify-content: space-between;">
                  <div>
                    <div class="div_MapDetails" v-if="MapDetailsShow">
            
                      <p  style=" width:260px;word-wrap:break-word;margin-top:20px;overflow:hidden;"><span style="float:left;width:auto;">节点ID:</span><span style="float:left;width:180px;text-indent: 0px; padding-top:2px;">{{details_minerId}}</span></p>
                      <p>节点类型:{{details_lx}}</p>
                      <p>节点所在地：{{details_city}}-{{details_region}}</p>
                      <p>分区-分组：{{details_RgnGrpInfo}}</p>
                      <p style=" width:260px;word-wrap:break-word;margin-top:0px;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">节点IP：{{details_Ip}}</p>
                      <p>节点状态：{{details_nodeState}}</p>
                       <p>存储量/存储空间：{{details_storeUsage}}/{{details_totalCap}}</p>
                       <p style="padding-bottom:30px">	<el-button type="primary" @click="getMoreDetails()">更多详情</el-button></p>

                    </div>
									<div class="item_one_child" id="chartColumn">
										<ve-map :data="chartData" width="740px" height="600px" :settings="chartSettings" ></ve-map>
									</div>
                  <!-- <div id="chartColumn" style="width: 100%;height:800px;"></div> -->
								</div>
									
									<div class="item_one_child_r">
										<div class="child_r_t">
												<el-checkbox-group v-model="checkList">
                          <el-checkbox v-for="item in testarray"  :key="item.id" :label="item.name" :value="item.id"  @change="handleCheckedChange(item)">{{item.name}}</el-checkbox>
											</el-checkbox-group>
										</div>
                    	<div class="child_r_t">
                          <el-checkbox style="color:#ffb980;margin-top:10px;" v-model="showOnelineOnly">只显示在线节点</el-checkbox>
										</div>
                    <div class="child_r_t"  style="margin-top:20px;">
                    		<el-button type="primary" @click="getNodesNewDetails()">刷新</el-button>
                    </div>
										<div class="child_r_b" v-for="item in nodeTypeCount" :key="item.id">
											{{item.nodeType}}：	{{item.nodeCount}}
										</div>
										<div class="child_r_table" style="margin-top:30px;">
											<el-table ref="container"	:data="tableDataDetails.slice((currentPageJd-1)*pagesizeJd,currentPageJd*pagesizeJd)" @row-click="openDetails" :border="true" @sort-change="tabDataChange">
												<el-table-column prop="nodeType" label="类型" width="110" align="center">	</el-table-column>
												<el-table-column	prop="nodeId"	label="节点ID" min-width="300" align="center">	</el-table-column>
												<el-table-column	prop="backUpUsage"	label="备份已占用" align="center" min-width="90" sortable :formatter="formatByte">	</el-table-column>
												<el-table-column	prop="cacheUsage"	label="缓存已占用" align="center" min-width="90" sortable :formatter="formatByte" >	</el-table-column>
												<el-table-column	prop="totalUsage"	label="占用总空间" align="center" min-width="90" :formatter="formatByte" sortable>	</el-table-column>
											</el-table>
											  <el-pagination
                           @size-change="handleSizeChangeJd"
                            @current-change="handleCurrentChangeJd"
                            :current-page="currentPageJd"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizeJd"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right"
                            :total="tableDataDetails.length">    
                  </el-pagination>
										</div>
									</div>
                  </div>
									
								</el-tab-pane>
                <el-tab-pane label="分区/分组" name="four">
									<div class="item_three_table">
                    <el-button type="primary" style="margin-bottom:15px;" @click="reFresh">刷新</el-button>
										 <el-table ref="container" @click="handlerClick11" :data="tableGroupInfo.slice((currentPageFq-1)*pagesizeFq,currentPageFq*pagesizeFq)" :border="true" @sort-change="tabDataChangeGroupInfo" style="width: 100%">
												<el-table-column prop="nodeType" align="center"  label="类型" > </el-table-column>
												<el-table-column prop="nodeHashId" align="center"  label="哈希" min-width="400">	</el-table-column>
												<el-table-column	prop="regionNum" align="center" sortable		label="分区号">	</el-table-column>
                        <el-table-column	prop="groupCnt" align="center" sortable	label="组数">
                            <template slot-scope="scope">
                                <div style="cursor: pointer;color:blue;" @click="groupInfoMore(scope.row)">{{scope.row.groupCnt}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="minerCnt" align="center" sortable label="矿机总数"></el-table-column>
                       
											</el-table>
											<el-pagination
                             @size-change="handleSizeChangeFq"
                            @current-change="handleCurrentChangeFq"
                            :current-page="currentPageFq"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizeFq"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right"
                            :total="tableGroupInfo.length">    
                  </el-pagination>
									</div>
								</el-tab-pane>
								<el-tab-pane label="节点查询" name="second">
									<div class="item_two_child">
										<div class="item_top">
											<div class="item_top_id">节点ID</div>
											<div class="item_top_input">
												<el-input v-model.trim="input_nodeId" placeholder="请输入节点ID查询"></el-input>
											</div>
											<div class="item_top_button">
												<el-button type="primary" @click="getNodesDetails()">查询</el-button>
											</div>
										</div>
										<div class="item-bottom">
												 <p>节点ID:<span style=" width:200px;word-wrap:break-word;margin-top:20px;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">{{details_minerId}}</span></p>
                      <p>节点类型:{{details_lx}}</p>
                      <p>节点所在地：{{details_city}}-{{details_region}}</p>
                      <p>分区-分组：{{details_RgnGrpInfo}}</p>
                      <p >节点IP：<span style=" width:200px;word-wrap:break-word;margin-top:0px;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">{{details_Ip}}</span></p>
                      <p>节点状态：{{details_nodeState}}</p>
                       <p>存储量/存储空间：{{details_storeUsage}}/{{details_totalCap}}</p>
                       <p style="padding-bottom:30px">	<el-button type="primary" @click="getMoreDetails()">更多详情</el-button></p>
										</div>
									</div>
								</el-tab-pane>
								<el-tab-pane label="更新节点配置" name="three">
                 
									<div class="item_three_child">
										<div class="three_child_button">
											<el-button type="primary" @click="createFrom">新增</el-button>
											<el-button type="primary" @click="getNodeslist()">刷新</el-button>
										</div>
									</div>
                  <div class="item_three_table">
                      <el-table :data="tableDataNodeConfig.slice((currentPagePz-1)*pagesizePz,currentPagePz*pagesizePz)" :border="true"  @sort-change="tabDataChangeNodeConfig" style="width: 100%">
												<el-table-column prop="timeStamp" align="center" sortable label="时间" > </el-table-column>
												<el-table-column prop="msgId" align="center"  label="命令编号" min-width="150">	</el-table-column>
												<el-table-column	prop="commandTargetId" align="center" 		label="目标节点">	</el-table-column>
                        <el-table-column	prop="commandExecResult" align="center" 	label="执行结果"></el-table-column>
                        <el-table-column prop="commandExecData" align="center" label="命令附件参数" min-width="150"></el-table-column>
                        <el-table-column		prop="descript"   align="center"   	label="描述"> 	</el-table-column>
                         <el-table-column  align="center"	label="操作">
                            <template slot-scope="scope">
                                <el-button  type="text" size="small" @click.native="downLoadFile(scope.row)">下载</el-button>
                            </template>
												</el-table-column>
											</el-table>
											<el-pagination
                             @size-change="handleSizeChangePz"
                            @current-change="handleCurrentChangePz"
                            :current-page="currentPagePz"
                            :page-sizes="[5, 10, 20]" 
                            :page-size="pagesizePz"        
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right"
                            :total="tableDataNodeConfig.length">    
                  </el-pagination>
                  </div>
                  
								</el-tab-pane>
                 
            
							</el-tabs>
						</div>
					</el-col>
					<!-- <el-col :span="6"><div class="grid-content bg-purple-light">2</div></el-col> -->
				</el-row>
		</el-col>

    <!-- 节点更多详情弹窗  -->
  <el-dialog title="" :visible.sync="dialogTableVisible"  id="el-dialog-new" customClass="customWidth">
	 
	  <div class="dialog_item_table" style="margin-top:0px">
      <el-tabs v-model="activeNameTab" @tab-click="handleClick">
          <el-tab-pane label="备份文件列表" name="firstBackUp">
           <el-col :span="24">
            <div class="item_title_child" style="text-align:left;">
                <el-table :data="tableDataMoreDetailsBackUp.slice((currentPageBackUp-1)*pagesizeBackUp,currentPageBackUp*pagesizeBackUp)" :border="true" @sort-change="tabDataChangeBackUp">
                  <el-table-column prop="fileName" label="文件名" align="center" sortable ></el-table-column>
                  <el-table-column property="fileSize" label="文件大小" align="center" sortable :formatter="formatByte"></el-table-column>
                  <el-table-column property="fileCreateTime" label="上传时间" align="center" sortable></el-table-column>
                  <el-table-column property="fileHashId" label="文件哈希" align="center" min-width="250"></el-table-column>
                   <el-table-column property="fileOwner" label="上传者哈希" align="center" min-width="200" ></el-table-column>

                </el-table>
                <el-pagination
                  @size-change="handleSizeChangeBackUp"
                                  @current-change="handleCurrentChangeBackUp"
                                  :current-page="currentPageBackUp"
                                  :page-sizes="[5, 10, 20]" 
                                  :page-size="pagesizeBackUp"        
                                  layout="total, sizes, prev, pager, next, jumper"
                                  style="float:right"
                                  :total="tableDataMoreDetailsBackUp.length">  
                </el-pagination>
            </div>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="缓存文件列表" name="secondCache">
              <el-col :span="24">
                  <div class="item_title_child" style="text-align:left;">
                      <el-table :data="tableDataMoreDetailsCache.slice((currentPageCache-1)*pagesizeCache,currentPageCache*pagesizeCache)" :border="true" @sort-change="tabDataChangeCache">
                        <el-table-column prop="fileName" label="文件名" align="center" sortable ></el-table-column>
                        <el-table-column property="fileSize" label="文件大小" align="center" sortable :formatter="formatByte"></el-table-column>
                        <el-table-column property="fileCreateTime" label="上传时间" align="center" sortable></el-table-column>
                        <el-table-column property="fileHashId" label="文件哈希" align="center" min-width="250"></el-table-column>
                        <el-table-column property="fileOwner" label="上传者哈希" align="center" min-width="200" ></el-table-column>

                      </el-table>
                      <el-pagination
                        @size-change="handleSizeChangeCache"
                                        @current-change="handleCurrentChangeCache"
                                        :current-page="currentPageCache"
                                        :page-sizes="[5, 10, 20]" 
                                        :page-size="pagesizeCc1"        
                                        layout="total, sizes, prev, pager, next, jumper"
                                        style="float:right"
                                        :total="tableDataMoreDetailsCache.length">  
                      </el-pagination>
                  </div>
                  </el-col>
          </el-tab-pane>
  </el-tabs>
	  </div>
	
</el-dialog>

<!-- 更新节点配置新增弹窗 -->
 <el-dialog title="" :visible.sync="dialogCreateVisible"   customClass="customWidth1">
	   <div class="dialog_item_title">
		  <el-col :span="24">
			 <div class="item_title_create">
				 	<el-form :inline="true" ref="form" :model="form">
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
                    name="configFile"
                    :before-upload="beforeAvatarUpload" 
                    action=""
                    :file-list="fileList"
                    :http-request="uploadSectionFile"
                    :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传.cfg文件.</div>
                  </el-upload>
              </div>
              </el-col>
              </div>
           </el-col>
            <el-col :span="24">
              <div style="width:80%;margin:0 auto;">
              <el-col :span="4">
              <div class="create_div">描述:</div>
              </el-col>
                <el-col :span="20">
              <div class="create_div_input">
                <el-input v-model.trim="descript" placeholder="请输入文件名"></el-input>
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

<!-- 分组详情弹窗  -->
  <el-dialog title="" :visible.sync="dialogGroupInfoVisible"  id="el-dialog-new" customClass="customWidth">
	 
	  <div class="dialog_item_table" style="margin-top:0px">
      <el-tabs v-model="activeNameTab" @tab-click="handleClick">
          <el-tab-pane label="分组详情" name="firstBackUp">
           <el-col :span="24">
            <div class="item_title_child" style="text-align:left;">
                <el-table :data="tableQueryGroupInfo.slice((currentPageGroup-1)*pagesizeGroup,currentPageGroup*pagesizeGroup)" :border="true" @sort-change="tabDataChangeQueryGroupInfo">
                  <el-table-column prop="groupNum" label="分组号" align="center" sortable  ></el-table-column>
                  <el-table-column property="nodeHash" label="矿机哈希" align="center"  min-width="500"></el-table-column>
                  <el-table-column  label="操作" align="center" >
                      <template slot-scope="scope">
                          <el-button size="small" @click="groupInfoLink(scope.row)">查看详情</el-button>
                      </template>
                  </el-table-column>

                </el-table>
                
                <el-pagination
                  @size-change="handleSizeChangeGroup"
                                  @current-change="handleCurrentChangeGroup"
                                  :current-page="currentPageGroup"
                                  :page-sizes="[5, 10, 20]" 
                                  :page-size="pagesizeGroup"        
                                  layout="total, sizes, prev, pager, next, jumper"
                                  style="float:right"
                                  :total="queryGroupInfoLength">  
                </el-pagination>
            </div>
            </el-col>
          </el-tab-pane>
  </el-tabs>
	  </div>
	
</el-dialog>


	

	</section>
</template>

<script>

import newUrl, { deleteFileList } from "../../api/api";
import echarts from "echarts";
import {
  queryMinerGeographDist,
  queryOneCityMinerDistDetails,
  queryNodeStoredFileListByNodeId,
  queryNodeInfoById,
  queryAllConfigRecords,
  updateNodeConfig,
  uploadBlackListFile,
  queryAllNodeProfiesByNodeTypes,
  queryRegionGroupInfo,
  queryGroupInfo
} from "../../api/api";
import { error } from "util";

export default {
  data() {
        this.chartSettings = {
        position: 'china',
        label: false,
        itemStyle: {
          normal: {
            borderColor: '#409EFF'
          }
        },
      }
    return {
      // totalUsasgeArr:[],
      newUrl: newUrl.customData(), //获取服务器 或则本地请求base
      nodeTypeCount: [],
      descript: "6",
      fileList: [],
      currentPageJd: 1, //初始页
      pagesizeJd: 10, //    每页的数据
      currentPagePz: 1, //初始页
      pagesizePz: 10, //    每页的数据
      currentPageFq: 1, //初始页
      pagesizeFq: 10, //    每页的数据
      currentPage: 1, //初始页
      pagesizePz: 10, //    每页的数据
      currentPageBackUp: 1, //初始页
      pagesizeBackUp: 10, //    每页的数据
      currentPageGroup: 1, //初始页
      pagesizeGroup: 10, //    每页的数据

      currentPageCache: 1, //初始页
      pagesizeCache: 10, //    每页的数据

      tableData1: [],
      tableData: [],
      tableDataNodeConfig: [],
      tableDataNodeConfig: [],
      tableGroupInfo: [],
      chartEvents: "",
      testarray: [
        {
          id: "1",
          name: "超级管理节点"
        },
        {
          id: "2",
          name: "超级存储节点"
        },
        {
          id: "3",
          name: "矿机节点"
        },
        {
          id: "4",
          name: "应用层节点"
        }
      ],
      dialogTableVisible: false,
      dialogCreateVisible: false,
      dialogGroupInfoVisible: false,
      activeName: "first",
      activeNameTab: "firstBackUp",
      MapDetailsShow: false,
      chartColumn: null,
      details_gl: "",
      details_No: "",
      details_lx: "",
      details_time: "",
      details_minerId: "",
      details_length: "",
      details_Ip: "",
      details_nodeState: "",
      details_city: "",
      details_region: "",
      input_nodeId: "",
      details_RgnGrpInfo: "",
      details_storeUsage: "",
      details_totalCap: "",
      downLoadfileName: "",
      input: "请输入",
      showOnelineOnly:true,
      chartData: {
        columns: ["位置", "",],
        rows: [
           { 位置: "",}
          // { 位置: "北京", 超级管理员: 555551, 超级储存节点: 444441,应用层节点:8888881,矿工节点:66666661}
        ]
      },
      checkList: ["位置", "超级管理节点"],
      checkListActive: ["位置", ""],
      tableDataDetails: [],
      tableDataMoreDetailsBackUp: [],
      tableDataMoreDetailsCache: [],
      tableQueryGroupInfo: [],
      queryGroupInfoLength: "",
      propname: ""
    };
  },
  mounted() {
     
    //判断从备份数量查看详情传递过来的
    if (this.$route.query.tabActive == undefined) {
      this.activeName = "first";
    } else {
      this.activeName = this.$route.query.tabActive;
      this.input_nodeId = this.$route.query.nowStoreNodeId;
      this.MapDetailsShow=false
          //输入节点查询详情
    this.getNodesDetails();
    }

    //获取分区分组信息
    this.getGroupInfo();
    // 获取节点分布列表
    this.getDetails();
    //获取节点配置列表
    this.getNodeslist();
    this.chartData.columns = this.checkList;
  },
  methods: {
    //
    //将字节大小转化成GB/KB/KB/
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

    //缓存文件列表排序
    tabDataChangeCache(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataMoreDetailsCache = this.tableDataMoreDetailsCache.sort(
          this.my_desc_sort
        );
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataMoreDetailsCache = this.tableDataMoreDetailsCache.sort(
          this.my_asc_sort
        );
        this.$forceUpdate();
      }
    },

    //备份文件列表排序
    tabDataChangeBackUp(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataMoreDetailsBackUp = this.tableDataMoreDetailsBackUp.sort(
          this.my_desc_sort
        );
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataMoreDetailsBackUp = this.tableDataMoreDetailsBackUp.sort(
          this.my_asc_sort
        );
        this.$forceUpdate();
      }
    },
    //分区/分组列表品排序
    tabDataChangeGroupInfo(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableGroupInfo = this.tableGroupInfo.sort(this.my_desc_sort);
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableGroupInfo = this.tableGroupInfo.sort(this.my_asc_sort);
        this.$forceUpdate();
      }
    },
    //分组详情列表品排序
    tabDataChangeQueryGroupInfo(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableQueryGroupInfo = this.tableQueryGroupInfo.sort(
          this.my_desc_sort
        );
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableQueryGroupInfo = this.tableQueryGroupInfo.sort(
          this.my_asc_sort
        );
        this.$forceUpdate();
      }
    },
    //更新节点配置
    tabDataChangeNodeConfig(column) {
      this.propname = column.prop;
      if (column.order === "descending") {
        this.tableDataNodeConfig = this.tableDataNodeConfig.sort(
          this.my_desc_sort
        );
        this.$forceUpdate();
      } else if (column.order === "ascending") {
        this.tableDataNodeConfig = this.tableDataNodeConfig.sort(
          this.my_asc_sort
        );
        this.$forceUpdate();
      }
    },

    getNodesNewDetails() {
      // this.chartData.rows = [{ 位置: "湖北", 税收: 888, 人口: 888, 面积: 666 }];
      this.getDetails();
    },
    //下载
    downLoadFile(row) {
      this.downLoadfileName = row.commandExecData;
      location.href =
        `${this.newUrl}/PTFSFileManage/downloadConfigFile?fileName=` +
        this.downLoadfileName;
    },

    //刷新节点配置更新列表
    getNodeslist() {
      this.getNodeslist();
    },
    //文件上传
    submitUpload() {
      this.dialogCreateVisible = false;
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
      form.append("setConfigDescript", this.descript);
      updateNodeConfig(form)
        .then(res => {
          if (res.result == "success") {
            this.currentPagePz=1;
            this.$message({
              type: "success",
              message: res.msg
            });
            this.getNodeslist();
          } else {
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //c上传前验证
    beforeAvatarUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "cfg";
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

    //输入节点查询详情
    getNodesDetails() {
     // this.MapDetailsShow = true;
      let param = {
        NodeId: this.input_nodeId
      };
      this.listLoading = true;
      queryNodeInfoById(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            this.listLoading = false;
            this.details_lx = res.data.nodeType;
            this.details_minerId = res.data.minerId;
            this.details_Ip = res.data.ip;
            this.details_nodeState = res.data.nodeState;
            this.details_city = res.data.city;
            this.details_region = res.data.region;
            this.details_RgnGrpInfo = res.data.RgnGrpInfo;
            this.details_storeUsage = res.data.storeUsage;
            this.details_totalCap = res.data.totalCap;
          }
        })
        .catch(error => {
          this.$message({
            message: "请输入正确节点ID",
            type: "error"
          });
        });
    },

    //获取更多详情
    getMoreDetails() {
      this.currentPageBackUp=1;
      this.currentPageCache=1;
      this.dialogTableVisible = true;
      let param = {
        Nodeid: this.details_minerId
      };
      this.listLoading = true;
      queryNodeStoredFileListByNodeId(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            this.listLoading = false;
            this.tableDataMoreDetailsBackUp = res.data.backUpFileList;
            this.tableDataMoreDetailsCache = res.data.cacheFileList;
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
    handleCurrentChangeJd: function(currentPage) {
      this.currentPageJd = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeJd: function(size) {
      this.pagesizeJd = size; //每页下拉显示数据
    },
    //分页
    handleCurrentChangePz: function(currentPage) {
      this.currentPagePz = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangePz: function(size) {
      this.pagesizePz = size; //每页下拉显示数据
    },
    //分页
    handleCurrentChangeFq: function(currentPage) {
      this.currentPageFq = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeFq: function(size) {
      this.pagesizeFq = size; //每页下拉显示数据
    },
    //分页
    handleCurrentChangeBackUp: function(currentPage) {
      this.currentPageBackUp = currentPage; //点击第几页
    },

    //改变下拉分页
    handleSizeChangeBackUp: function(size) {
      this.pagesizeBackUp = size; //每页下拉显示数据
    },
    //分页
    handleCurrentChangeGroup: function(currentPage) {
      this.currentPageGroup = currentPage; //点击第几页
    },

    //改变下拉分页
    handleSizeChangeGroup: function(size) {
      this.pagesizeGroup = size; //每页下拉显示数据
    },
    //分页
    handleCurrentChangeCache: function(currentPage) {
      this.currentPageCache = currentPage; //点击第几页
    },
    //改变下拉分页
    handleSizeChangeCache: function(size) {
      this.pagesizeCache = size; //每页下拉显示数据
    },

    //选择节点发生改变时。checklist发生改变
    handleCheckedChange: function(val) {

      if(this.checkList.length<=1){
          this.chartData.columns = this.checkListActive;
        this.chartData.columns
      }
      else{
        this.chartData.columns = this.checkList;
       }
      
    },

    //新增
    createFrom: function() {
      this.dialogCreateVisible = true;
    },

    // getDetails: function() {
    //   this.dialogTableVisible = true;
    // },
    handleClick(tab) {
      var nowTab=tab.$options.propsData.name
       if(nowTab!="first"){
         this.MapDetailsShow=false
       }
    },
    //点击表格获取每一行数据
    openDetails(row) {
      this.MapDetailsShow = true;
      let param = {
        NodeId: row.nodeId
      };
      this.listLoading = true;
      queryNodeInfoById(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            this.listLoading = false;
            this.details_lx = res.data.nodeType;
            this.details_minerId = res.data.minerId;
            this.details_Ip = res.data.ip;
            this.details_nodeState = res.data.nodeState;
            this.details_city = res.data.city;
            this.details_region = res.data.region;
            this.details_RgnGrpInfo = res.data.RgnGrpInfo;
            this.details_storeUsage = res.data.storeUsage;
            this.details_totalCap = res.data.totalCap;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //获取节点详细信息
    getDetails() {
     // this.dialogTableVisible = true;currentPageJd
      this.currentPageJd=1
     // this.pagesizeJd=10;
      var nowparam = this.checkList.slice(1, this.checkList.length);
      for (var i = 0; i < nowparam.length; i++) {
        if (
          nowparam[i] == "" ||
          nowparam[i] == null ||
          typeof nowparam[i] == undefined
        ) {
          nowparam.splice(i, 1);
          i = i - 1;
        }
      }
      if (nowparam.length == 0) {
        this.$message({
          message: "请至少选择一种节点类型",
          type: "warning"
        });
        return false;
      }
      let param = {
        nodeTypeArr: nowparam,
        showOnelineOnly:this.showOnelineOnly
      };
      this.listLoading = true;
      queryAllNodeProfiesByNodeTypes(param).then(res => {
        let { result, msg, data } = res;
        if ((result = "ok")) {
          this.listLoading = false;
          this.tableDataDetails = res.data.allNodeProfiles;
          this.nodeTypeCount = res.data.totalNodeCnt;
          this.details_length = res.data.length;
          this.chartData.rows = res.data.regionNodeDist;
        }
      });
    },
    getNodeslist() {
      let param = {};
      this.listLoading = true;
      //NProgress.start();
      queryAllConfigRecords(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "success")) {
            this.listLoading = false;
            this.tableDataNodeConfig = res.data;
            this.details_length = res.data.length;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //分区分组展示信息
    getGroupInfo() {
      this.currentPageFq=1
      let param = {};
      queryRegionGroupInfo(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            // this.listLoading = false;
            this.tableGroupInfo = res.data;
            // this.details_length = res.data.length;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //点击组数查看详情
    groupInfoMore(row) {
      //alert(JSON.stringify(row))
      let param = {};
      param.regionNum = row.regionNum;
      this.dialogGroupInfoVisible = true;
      queryGroupInfo(param)
        .then(res => {
          let { result, msg, data } = res;
          if ((result = "ok")) {
            // this.listLoading = false;
            this.tableQueryGroupInfo = res.data;
            this.queryGroupInfoLength = res.data.length;
          }
        })
        .catch(error => {
          this.$message({
            message: "网络出错，请重新请求",
            type: "error"
          });
        });
    },
    //查看详情跳转
    groupInfoLink(row) {
      this.dialogGroupInfoVisible = false;
      this.activeName = "second";
      this.input_nodeId = row.nodeHash;
    },
    //刷新分区分组信息
    reFresh() {
      this.getGroupInfo();
    }
  },
};
</script>

<style  lang="less">
.chart-container {
  // width: 100%;
  float: initial !important;
  min-width: 1920px;
}
.new_grid-content {
  height: auto;
  //background: #999999;
  .item_one_child_r {
    .el-checkbox__inner {
      margin-left: 15px;
    }

    width: 100%;
    height: auto;
    margin: 50px auto;

    overflow: hidden;
    .child_r_b {
      width: auto;
      padding: 0 10px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 30px;
      float: left;
      border: 1px solid #dfe6ec;
      margin-left: 15px;
      background: #20a0ff;
      color: #ffffff;
      &:nth-child(2) {
        margin-left: 0px;
      }
    }
    .child_r_table {
      .el-table .cell {
        line-height: 18px;
      }
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0px;
      width: 100%;
      margin-top: 10px;
    }
    .child_checkbox {
      width: 100%;
      float: left;
    }
  }
}
.new_grid-content .item_one_child {
  width: 740px;
  height: 600px;
  //background: #666666;
  margin: 50px auto;
}
.new_grid-content {
  .item_three_child {
    width: 800px;
    height: auto;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 35px;

    .three_child_load {
      float: left;
      margin-left: 50px;
      .el-button--small {
        padding: 11px 9px;
      }
    }
    .three_child_input {
      float: left;
      width: 350px;
      margin-left: 50px;
    }
    .three_child_button {
      float: left;
    }
  }
  .item_two_child {
    width: 800px;
    height: 600px;

    margin: 50px auto;
    .item_top {
      width: 700px;
      height: 50px;
      margin: 0 auto;
      .item_top_id {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        float: left;
      }
      .item_top_input {
        width: 500px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        float: left;
      }
      .item_top_button {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        float: left;
      }
    }
    .item-bottom {
      width: 500px;
      height: auto;
      margin-top: 50px;
      margin: 100px auto;
      background: #e4e8f1;
      padding-top: 15px;
      background-image: linear-gradient(-53deg, #3d5bd9 0%, #71a2e0 100%),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      box-shadow: 3px 0px 7px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      color: #ffffff;

      p {
        width: 100%;
        text-align: center;
        font-size: 14px;
      }
    }
  }
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
  margin-top: 0px;
  .item_title_child {
    width: 100%;
    margin: 0 auto;
    height: auto;
    background: #f2f2f2;
    overflow: hidden;
    text-align: center;
  }
}
.customWidth1 {
  width: 80%;
}
.div_MapDetails {
  width: 260px;
  height: auto;
  background: #999999;
  position: absolute;
  top: 100px;
  z-index: 1;
  background-image: linear-gradient(-53deg, #3d5bd9 0%, #71a2e0 100%),
    linear-gradient(#ffffff, #ffffff);
  background-blend-mode: normal, normal;
  box-shadow: 3px 0px 7px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  opacity: 0.6;
  color: #ffffff;
  p {
    text-indent: 10px;
    width: 230px;
  }
}
.child_r_t .el-button--primary {
  margin-left: 15px;
}
</style>