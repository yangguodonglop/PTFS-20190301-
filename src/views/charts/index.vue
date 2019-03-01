<template>
    <section class="chart-container">
         <el-row>
            <el-col :span="6">
                <div class="new_cont new_cont_active1" style="width:100%;">
                    <div class="item_one">在线节点个数</div>
                    <div class="item_two">{{dataOne}}</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="new_cont" style="width:100%;">
                    <div class="item_one">存储量/存储空间</div>
                    <div class="item_two">{{datatwo}}TB/{{datatwoactive}}TB</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="new_cont" style="width:100%;">
                    <div class="item_one">实际存储数据量</div>
                    <div class="item_two">{{datathree}}</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="new_cont" style="width:100%;">
                    <div class="item_one">实际存储文件个数</div>
                    <div class="item_two">{{datafour}}</div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="div_item" style="width:100%;height:50px;">
                    <div class="item_start">
                         <span class="demonstration">开始时间:</span>
                       <el-date-picker
                            v-model="valueOnlinestrat"
                            type="datetime"
                            placeholder="选择日期时间"
                            @change="getSTimeOnlinestrat"
						     format="yyyy-MM-dd HH:mm">
                         </el-date-picker>
                    </div>
                     <div class="item_end" style="">
                         <span class="demonstration">结束时间:</span>
                        <el-date-picker
                            v-model="valueOnlineend"
                            type="datetime"
                            placeholder="选择日期"
                              @change="getSTimeOnlineend"
						     format="yyyy-MM-dd HH:mm">
                            >
                         </el-date-picker>
                    </div>
                    <div class="item_button">
                          <el-button type="primary" @click="getData(1)">刷新</el-button>
                    </div>
                </div>
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div class="div_item" style="width:100%;height:50px;">
                    <div class="item_start">
                         <span class="demonstration">开始时间:</span>
                        <el-date-picker
                            v-model="valueDevStorestart"
                            type="datetime"
                             @change="getSTimeDevStorestart"
						     format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期">
                         </el-date-picker>
                    </div>
                     <div class="item_end" style="">
                         <span class="demonstration">结束时间:</span>
                        <el-date-picker
                            v-model="valueDevStoreend"
                            type="datetime"
                               @change="getSTimeDevStoreend"
						     format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期">
                         </el-date-picker>
                    </div>
                    <div class="item_button">
                           <el-button type="primary" @click="getData(2)">刷新</el-button>
                    </div>
                </div>
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div class="div_item" style="width:100%;height:50px;">
                    <div class="item_start">
                         <span class="demonstration">开始时间:</span>
                        <el-date-picker
                            v-model="valueUsagestart"
                            type="datetime"
                               @change="getSTimeUsagestart"
						     format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期">
                         </el-date-picker>
                    </div>
                     <div class="item_end" style="">
                         <span class="demonstration">结束时间:</span>
                        <el-date-picker
                            v-model="valueUsageend"
                            type="datetime"
                               @change="getSTimeUsageend"
						     format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期">
                         </el-date-picker>
                    </div>
                    <div class="item_button">
                           <el-button type="primary" @click="getData(3)">刷新</el-button>
                    </div>
                </div>
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div class="div_item" style="width:100%;height:50px;">
                    <div class="item_start">
                         <span class="demonstration">开始时间:</span>
                        <el-date-picker
                            v-model="valueFilestart"
                             type="datetime"
                               @change="getSTimeFilestart"
						     format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期">
                         </el-date-picker>
                    </div>
                     <div class="item_end" style="">
                         <span class="demonstration">结束时间:</span>
                        <el-date-picker
                            v-model="valueFileend"
                             type="datetime"
                               @change="getSTimeFileend"
						     format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期">
                         </el-date-picker>
                    </div>
                    <div class="item_button">
                           <el-button type="primary" @click="getData(4)">刷新</el-button>
                    </div>
                </div>
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <!-- <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col> -->
        </el-row>
    </section>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
import "axios";
import {
  queryOnlineNodeHistgraphs,
  querySummary,
  queryStoreUsageHistgraph,
  queryDevStoreHistgraph,
  queryFileCntHistgraph
} from "../../api/api";
export default {
  data() {
    return {
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      dataOne: "",
      datatwo: "",
      datatwoactive: "",
      datathree: "",
      datafour: "",
      valueOnlinestrat: "",
      valueOnlineend: "",
      valueDevStorestart: "",
      valueDevStoreend: "",
      valueUsagestart: "",
      valueUsageend: "",
      valueFilestart: "",
      valueFileend: "",
      NodeHistgraphsDataX: "",
      NodeHistgraphsDataY: "",
      UsageHistgraphDataX: "",
      UsageHistgraphDataY: "",
      DevStoreHistgraphDataX: "",
      DevStoreHistgraphDataY: "",
      DevStoreHistgraphDataYY: "",
      FileCntHistgraphDataX: "",
      FileCntHistgraphDataY: ""
    };
  },
  mounted: function() {

    //获取当前时间
    let nowDate = new Date();
    let endTime = this.common.getTimes(nowDate);
    this.valueOnlineend = endTime; // 当前的时间点
    this.valueDevStoreend=endTime
    this.valueUsageend=endTime
    this.valueFileend=endTime

    //获取往前往前一星期时间
    let befDate = new Date(nowDate.getTime() - 7 * 24 * 3600 * 1000)
    let startTime = this.common.getTimes(befDate);
    this.valueOnlinestrat = startTime; // 向前推迟一周的时间点
    this.valueDevStorestart=startTime
    this.valueUsagestart=startTime
    this.valueFilestart=startTime


    //this.getNowFormatDate()

    let _this = this;
    var timeParams = {
      startTime: this.valueOnlinestrat,
      endTime: this.valueOnlineend
    };


    //tilte展示数据
    querySummary().then(data => {
      //this.logining = false;
      //NProgress.done();

      if (data.data.OnlineNodeCount == "--") {
        this.datatwoactive = 0; //存储空间
        this.dataOne = 0; //在线节点个数
        this.datatwo = 0; //存储量
      } else {
        this.dataOne = data.data.OnlineNodeCount;
        this.datatwo = data.data.OnlineNodeCount / 1000;
        this.datatwoactive = data.data.OnlineNodeCount;
      }

      this.datafour = data.data.TotalFileCnt; //实际存储数据量
      this.datathree = data.data.TotalStoreUsage; //实际存储文件个数
      let { msg, result } = data;
      if (result !== "ok") {
        this.$message({
          message: msg,
          type: "error"
        });
      } else {
      }
    });

    //在线结点数
    queryOnlineNodeHistgraphs(timeParams).then(data => {
      let { msg, result } = data;
      if (result == "ok") {
        this.NodeHistgraphsDataX = data.data.dateList;
        this.NodeHistgraphsDataY = data.data.onlineNodeCntDailyList;
        this.drawColumnChart();
      } else {
        this.$message({
          message: msg,
          type: "error"
        });
      }
    });

    //存储量/存储空间
    queryDevStoreHistgraph(timeParams).then(data => {
      let { msg, result } = data;
      if (result == "ok") {
        this.DevStoreHistgraphDataX = data.data.dateList;
        this.DevStoreHistgraphDataY = data.data.totalDevCapList;
        this.DevStoreHistgraphDataYY = data.data.ipfsCapList;
        this.drawBarChart();
      } else {
        this.$message({
          message: msg,
          type: "error"
        });
      }
    });

    //实际存储数据量
    queryStoreUsageHistgraph(timeParams).then(data => {
      let { msg, result } = data;
      if (result == "ok") {
        this.UsageHistgraphDataX = data.data.dateList;
        this.UsageHistgraphDataY = data.data.storeUsage;
        this.drawLineChart();
      } else {
        this.$message({
          message: msg,
          type: "error"
        });
      }
    });

    //储存文件数
    queryFileCntHistgraph(timeParams).then(data => {
      let { msg, result } = data;
      if (result == "ok") {
        this.FileCntHistgraphDataX = data.data.dateList;
        this.FileCntHistgraphDataY = data.data.fileCnt;
        this.drawPieChart();
      } else {
        this.$message({
          message: msg,
          type: "error"
        });
      }
    });
    //this.drawCharts();
  },

  methods: {
    //获取当前时间
    //    getNowFormatDate() {
    //      alert("***")
    //     var date = new Date();
    //     var seperator1 = "-";
    //     var year = date.getFullYear();
    //     var month = date.getMonth() + 1;
    //     var strDate = date.getDate();
    //     if (month >= 1 && month <= 9) {
    //         month = "0" + month;
    //     }
    //     if (strDate >= 0 && strDate <= 9) {
    //         strDate = "0" + strDate;
    //     }
    //     var currentdate = year + seperator1 + month + seperator1 + strDate;
    //     return currentdate
    // },
    //在线节点数
    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById("chartColumn"));
      this.chartColumn.setOption({
        title: {
          text: "在线节点数"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["在线节点数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.NodeHistgraphsDataX
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "在线节点数",
            type: "line",
            stack: "总量",
            data: this.NodeHistgraphsDataY
          }
        ]
      });
    },
    //储存量/储存空间
    drawBarChart() {
      this.chartBar = echarts.init(document.getElementById("chartBar"));
      this.chartBar.setOption({
        title: {
          text: "储存量/储存空间"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["储存量", "储存空间"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.DevStoreHistgraphDataX
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "储存量",
            type: "line",
            stack: "总量",
            data: this.DevStoreHistgraphDataY
          },
          {
            name: "储存空间",
            type: "line",
            stack: "总量",
            data: this.DevStoreHistgraphDataYY
          }
        ]
      });
    },
    //实际存储数据量
    drawLineChart() {
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.setOption({
        title: {
          text: "实际存储数据量"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["实际存储数据量"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.UsageHistgraphDataX
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "世界存储数据量",
            type: "line",
            stack: "总量",
            data: this.UsageHistgraphDataY
          }
        ]
      });
    },
    //存储文件数
    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById("chartPie"));
      this.chartPie.setOption({
        title: {
          text: "储存文件数"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["储存文件数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.FileCntHistgraphDataX
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "储存文件数",
            type: "line",
            stack: "总量",
            data: this.FileCntHistgraphDataY
          }
        ]
      });
    },
    // drawCharts() {
    //   this.drawColumnChart();
    //   this.drawBarChart();
    //   this.drawLineChart();
    //   this.drawPieChart();
    // },
    getSTimeOnlinestrat(val) {
      this.valueOnlinestrat = val;
    },
    //
    getSTimeOnlineend(val) {
      //valueOnlineend
      this.valueOnlineend = val;
    },
    getSTimeDevStorestart(val) {
      this.valueDevStorestart = val;
    },
    getSTimeDevStoreend(val) {
      this.valueDevStoreend = val;
    },
    getSTimeUsagestart(val) {
      this.valueUsagestart = val;
    },
    getSTimeUsageend(val) {
      this.valueUsageend = val;
    },
    getSTimeFilestart(val) {
      this.valueFilestart = val;
    },
    getSTimeFileend(val) {
      this.valueFileend = val;
    },

    //点击刷新请求数据
    getData(e) {
  
      switch (e) {
        case 1: 
          var timeParams = {
            startTime: this.valueOnlinestrat,
            endTime: this.valueOnlineend
          };
          //在线节点数
          queryOnlineNodeHistgraphs(timeParams).then(data => {
            let { msg, result } = data;
            if (result == "ok") {
              this.NodeHistgraphsDataX = data.data.dateList;
              this.NodeHistgraphsDataY = data.data.onlineNodeCntDailyList;
              this.drawColumnChart();
            } else {
              this.$message({
                message: msg,
                type: "error"
              });
            }
          });
          break;
        case 2:
          var timeParams = {
            startTime: this.valueDevStorestart,
            endTime: this.valueDevStoreend
          };
          //存储量/存储空间
          queryDevStoreHistgraph(timeParams).then(data => {
            let { msg, result } = data;
            if (result == "ok") {
              this.DevStoreHistgraphDataX = data.data.dateList;
              this.DevStoreHistgraphDataY = data.data.totalDevCapList;
              this.DevStoreHistgraphDataYY = data.data.ipfsCapList;
              this.drawBarChart();
            } else {
              this.$message({
                message: msg,
                type: "error"
              });
            }
          });
          break;
        case 3:
          var timeParams = {
            startTime: this.valueUsagestart,
            endTime: this.valueUsageend
          };
          //实际存储数据量
          queryStoreUsageHistgraph(timeParams).then(data => {
            let { msg, result } = data;
            if (result == "ok") {
              this.UsageHistgraphDataX = data.data.dateList;
              this.UsageHistgraphDataY = data.data.storeUsage;
              this.drawLineChart();
            } else {
              this.$message({
                message: msg,
                type: "error"
              });
            }
          });
          break;
        case 4:
          var timeParams = {
            startTime: this.valueFilestart,
            endTime: this.valueFileend
          };
          //储存文件数
          queryFileCntHistgraph(timeParams).then(data => {
            let { msg, result } = data;
            if (result == "ok") {
              this.FileCntHistgraphDataX = data.data.dateList;
              this.FileCntHistgraphDataY = data.data.fileCnt;
              this.drawPieChart();
            } else {
              this.$message({
                message: msg,
                type: "error"
              });
            }
          });
          break;
      }
    }
  }

};
</script>

<style scoped lang="less">
.chart-container {
  // width: 100%;
  float: left;
  min-width: 1450px;

}

.el-col {
  padding: 30px 20px;
}
.new_cont {
 
  height: 80px;
  text-align: center;
  color: #48576a;
  font-size: 16px;
}
.new_cont_active1{
  background-image: linear-gradient(159deg, 
		#b87cf6 0%, 
		#903be7 100%), 
	linear-gradient(
		#ffffff, 
		#ffffff);
	background-blend-mode: normal, 
		normal;
	box-shadow: 3px 0px 7px 0px 
		rgba(0, 0, 0, 0.12);
	border-radius: 4px;
}
.new_cont .item_one {
  padding-top: 20px;
  overflow: hidden;
}
.div_item {
  .item_start {
    float: left;
    margin-left: 20px;
  }
  .item_end {
    float: left;
    margin-left: 20px;
  }
  .item_button {
    float: left;
    margin-left: 20px;
  }
}

</style>
