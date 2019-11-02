<template>
  <div class="jsplumb-demo flowContainer">
    <div v-for="plumbItem in plumbItems" :key="plumbItem.id" :id="plumbItem.id" class="plumb-item">
      <span class="plumb-point flow-node-drag"></span>
      <div class="plumb-content">{{plumbItem.content}}</div>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";

export default {
  name: "jsplumb-demo",

  data() {
    return {
      plumbItems: [],
      plumbId: 0,

      // https://gitee.com/xiaoka2017/easy-flow/tree/master/src/components/flow
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          "Top",
          "TopCenter",
          "TopRight",
          "TopLeft",
          "Right",
          "RightMiddle",
          "Bottom",
          "BottomCenter",
          "BottomRight",
          "BottomLeft",
          "Left",
          "LeftMiddle"
        ],
        Container: "flowContainer",
        // 连线的样式 StateMachine、Flowchart、Bezier
        Connector: "Bezier",
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: ["Rectangle", { height: 10, width: 10 }],
        // 线端点的样式
        EndpointStyle: { fill: "rgba(255,255,255,0)", outlineWidth: 1 },
        LogEnabled: true, //是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: { stroke: "black", strokeWidth: 3 },
        // 绘制箭头
        Overlays: [["Arrow", { width: 12, length: 12, location: 1 }]],
        RenderMode: "svg"
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: "Continuous"
      },
      jsplumbSourceOptions: {
        filter:
          ".flow-node-drag" /*"span"表示标签，".className"表示类，"#id"表示元素id*/,
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter:
          ".flow-node-drag" /*"span"表示标签，".className"表示类，"#id"表示元素id*/,
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      }
    };
  },

  mounted() {
    window.jsPlumbDemo = this;

    const jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance = jsPlumbInstance;

    jsPlumbInstance.ready(() => {
      // 导入默认配置
      jsPlumbInstance.importDefaults(this.jsplumbSetting);
      // 会使整个jsPlumb立即重绘。
      jsPlumbInstance.setSuspendDrawing(false, true);

      jsPlumbInstance.bind("connection", evt => {
        console.log("connection", evt);
      });

      for (let i = 0; i < 3; i++) {
        this.addPlumbItem();
      }
    });
  },

  methods: {
    addPlumbItem() {
      const id = this.plumbId++,
        obj = {
          id: "jsplumb-" + id,
          content: new Date().toString(),
          left: 0,
          top: 0
        };
      this.plumbItems.push(obj);
      this.$nextTick(() => {
        const jsPlumbInstance = this.jsPlumbInstance;
        jsPlumbInstance.makeSource(obj.id, this.jsplumbSourceOptions);
        jsPlumbInstance.makeTarget(obj.id, this.jsplumbTargetOptions);
        jsPlumbInstance.draggable(obj.id, {
          containment: "parent"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.jsplumb-demo {
  height: 100%;
  position: relative;

  .plumb-item {
    position: absolute;
    border: 1px solid gray;
    background-color: white;

    .plumb-point {
      position: absolute;
      left: calc(50% - 10px);
      top: -10px;
      display: inline-block;
      padding: 10px;
      border-radius: 50%;
      background-color: green;
    }

    .plumb-content {
      padding: 10px;
    }
  }
}
</style>