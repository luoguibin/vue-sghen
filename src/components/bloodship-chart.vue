<template>
  <div class="bloodship-chart">
    <div ref="chartEl" class="bloodship-chart_main"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {};
  },
  created() {
    window.bloodshipChart = this;
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const myChart = echarts.init(this.$refs.chartEl);
      const option = {
        title: { text: "title" },
        tooltip: {
          formatter: function(x) {
            return x.data.des;
          }
        },
        // legend: {
        //   show: true,
        //   data: [
        //     {
        //       name: "task-0",
        //       icon: "rect" //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        //     }
        //   ]
        // },
        series: [
          {
            type: "graph",
            left: 100,
            top: 100,
            layout: "none", //circular，none，force
            // symbolSize: 80,
            roam: true,
            edgeSymbol: ["circle", "arrow"],
            // force: {
            //   repulsion: 2500,
            //   edgeLength: [10, 100]
            // },
            draggable: false,
            itemStyle: {
              normal: {
                color: "#4b565b"
              }
            },
            // lineStyle: {
            //   normal: {
            //     width: 2,
            //     color: "#4b565b"
            //   }
            // },
            edgeLabel: {
              normal: {
                show: true,
                formatter: function(x) {
                  return x.data.name;
                },
                textStyle: {
                  fontSize: 20
                }
              }
            },
            label: {
              normal: {
                show: true,
                textStyle: {}
              }
            },
            data: [
              {
                name: "task-0",
                x: 0,
                y: 0,
                des: "des:task-0",
                symbol: "roundRect",
                symbolSize: [100, 40],
                itemStyle: {
                  normal: {
                    color: "red"
                  }
                }
              },
              {
                name: "task-01",
                x: 100,
                y: 30,
                des: "des:task-01",
                symbol: "roundRect",
                symbolSize: [100, 40],
                itemStyle: {
                  normal: {
                    color: "red"
                  }
                }
              },
              {
                name: "task-1",
                x: 100,
                y: 200,
                des: "des:task-1",
                symbol: "rect",
                symbolSize: [100, 40]
              },
              {
                name: "task-2",
                x: 300,
                y: 300,
                des: "des:task-2",
                symbol: "rect",
                symbolSize: [100, 40]
              },
              {
                name: "task-3",
                x: 400,
                y: 100,
                des: "des:task-3",
                symbol: "rect",
                symbolSize: [100, 40]
              }
            ],
            // categories: [
            //   //symbol name：用于和 legend 对应以及格式化 tooltip 的内容。 label有效
            //   {
            //     name: "task-0",
            //     symbol: "rect",
            //     label: {
            //       //标签样式
            //     }
            //   }
            // ],
            links: [
              {
                source: "task-0",
                target: "task-1",
                name: "call",
                lineStyle: {
                  normal: {
                    type: "dotted",
                    color: "#148acf"
                  }
                }
              },
              {
                source: "task-01",
                target: "task-1",
                name: "wait",
                lineStyle: {
                  normal: {
                    type: "solid",
                    color: "green"
                  }
                }
              },
              {
                source: "task-1",
                target: "task-01",
                name: "callback",
                lineStyle: {
                  normal: {
                    curveness: 0.3,
                    type: "dashed",
                    color: "green"
                  }
                }
              },
              {
                source: "task-01",
                target: "task-3",
                name: "wait",
                lineStyle: {
                  normal: {
                    type: "solid",
                    color: "yellow"
                  }
                }
              },
              {
                source: "task-1",
                target: "task-2",
                name: "call",
                lineStyle: {
                  normal: {
                    type: "dotted",
                    color: "#148acf"
                  }
                }
              }
            ]
          }
        ]
      };
      myChart.setOption(option);

      const resize = () => {
        myChart.resize();
      };
      window.addEventListener("resize", resize);
      this.$once("hook:destroy", () => {
        window.removeEventListener("resize", resize);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bloodship-chart {
  height: 100%;

  #{&}_main {
    height: 100%;
  }
}
</style>
