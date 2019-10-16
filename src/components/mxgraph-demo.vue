<template>
  <div class="mxgraph-demo">
    <div class="mxgraph-demo_header">
      <button v-for="menu in menus" :key="menu.key" @click="onMenu(menu.key)">{{menu.key}}</button>
    </div>
    <div ref="mxgraphEl" class="mxgraph-demo_content"></div>
  </div>
</template>

<script>
import("mxgraph/javascript/src/css/common.css");

const mxGraphObj = require("mxgraph")({
  mxImageBasePath: "./static/mxgraph/images",
  mxBasePath: "./static/mxgraph/"
});
const {
  mxGraph,
  mxGeomentry,
  mxClient,
  mxCell,
  mxImage,
  mxGeometry,
  mxEvent,
  mxRubberband,
  mxShape,
  mxVertexHandler,
  mxConnectionConstraint,
  mxCellState,
  mxPoint,
  mxPolyline,
  mxUtils,
  mxConstants,
  mxPerimeter
} = mxGraphObj;

// Overridden to define per-shape connection points
mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
  if (terminal != null && terminal.shape != null) {
    if (terminal.shape.stencil != null) {
      if (terminal.shape.stencil != null) {
        return terminal.shape.stencil.constraints;
      }
    } else if (terminal.shape.constraints != null) {
      return terminal.shape.constraints;
    }
  }

  return null;
};

// Defines the default constraints for all shapes
mxShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.25, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.75, 1), true)
];

// Edges have no connection points
mxPolyline.prototype.constraints = null;

mxVertexHandler.prototype.livePreview = true;
mxVertexHandler.prototype.rotationEnabled = true;

// Rounded edge and vertex handles
var touchHandle = new mxImage("./static/mxgraph/images/handle-main.png", 17, 17);
mxVertexHandler.prototype.handleImage = touchHandle;

export default {
  name: "mxgraph-demo",
  data() {
    return {
      menus: [
        { key: "insert-vertex" },
        { key: "image" },
        { key: "edge" },
        { key: "setValue" },
        { key: "delete" },
        { key: "zoom" }
      ],

      currentCell: null
    };
  },

  mounted() {
    window.mxGraphDemo = this;
    this.init();

    // console.log(mxGraphObj);
  },
  methods: {
    init() {
      // Program starts here. Creates a sample graph in the
      // DOM node with the specified ID. This function is invoked
      // from the onLoad event handler of the document (see below).

      // Checks if the browser is supported
      if (!mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is not supported.
        mxUtils.error("Browser is not supported!", 200, false);
        return;
      }

      const container = this.$refs.mxgraphEl;
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);

      // Creates the graph inside the given container
      const graph = new mxGraph(container);
      graph.setConnectable(true);

      // Enables connect preview for the default edge style
      graph.connectionHandler.createEdgeState = function(me) {
        const edge = graph.createEdge(null, null, null, null, null);

        return new mxCellState(
          this.graph.view,
          edge,
          this.graph.getCellStyle(edge)
        );
      };

      // Specifies the default edge style
      graph.getStylesheet().getDefaultEdgeStyle()["edgeStyle"] =
        "orthogonalEdgeStyle";

      // 开启区域选择
      new mxRubberband(graph);

      // Allows moving of relative cells
      graph.isCellLocked = function(cell) {
        return this.isCellsLocked();
      };

      this.graph = graph;

      graph.setPanning(true);
      // graph.panningHandler.useLeftButtonForPanning = false;

      graph.isPart = function(cell) {
        const state = this.view.getState(cell);
        const style = state != null ? state.style : this.getCellStyle(cell);
        return style["constituent"] == "1";
      };

      graph.addListener(mxEvent.CELLS_ADDED, (sender, evt) => {
        const cell = evt.properties.cells[0];
        if (graph.isPart(cell)) {
          return;
        }

        if (cell.vertex) {
          this.$message.info("添加了一个节点");
        } else if (cell.edge) {
          this.$message.info("添加了一条线");
        }
      });

      // graph.addListener(mxEvent.CLICK, (sender, evt) => {
      //   const cell = evt.properties.cell;
      //   console.log(cell);
      //   this.currentCell = cell;
      // });
    },

    onMenu(key) {
      const graph = this.graph,
        model = graph.getModel(),
        currentCell = graph.getSelectionCell();
      console.log(currentCell);
      model.beginUpdate();

      try {
        switch (key) {
          case "insert-vertex":
            const vertex = graph.insertVertex(
              currentCell ? currentCell : graph.getDefaultParent(),
              null,
              "content",
              currentCell ? 1.5 : 150,
              currentCell ? 1.5 : 50,
              120,
              40,
              null,
              currentCell ? true : false
            );

            graph.graphHandler.removeCellsFromParent = false;

            break;
          case "image":
            graph.vertexLabelsMovable = true;
            graph.insertVertex(
              currentCell ? currentCell : graph.getDefaultParent(),
              null,
              "user",
              100,
              100,
              100,
              100,
              "shape=label;indicatorShape=actor;indicatorWidth=40;indicatorHeight=50;indicatorColor=#00FFFF;imageVerticalAlign=center;verticalAlign=middle;imageAlign=left;align=left;spacingLeft=60"
            );

            // require("images/mxgraph/earth.png");
            break;

          case "edge":
            const edge = new mxCell(
              "我是边描述",
              new mxGeometry(),
              "exitX=0.75;exitY=1;"
            );
            edge.setId(null);
            edge.setEdge(true);
            edge.geometry.setTerminalPoint(new mxPoint(100, 100), true);
            edge.geometry.setTerminalPoint(new mxPoint(200, 200), false);
            edge.geometry.relative = true;

            graph.addCell(edge, graph.getDefaultParent());
            console.log(edge);
            break;

          case "setValue":
            if (currentCell) {
              model.setValue(currentCell, "双击输入...");
            }
            break;

          case "delete":
            if (currentCell) {
              graph.removeCells([currentCell], true);
              this.currentCell = null;
            }
            break;
          default:
            break;
        }
      } finally {
        model.endUpdate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mxgraph-demo {
  height: 100%;
  display: flex;
  flex-direction: column;

  #{&}_header {
    padding: 10px;

    button + button {
      margin-left: 10px;
    }
  }

  #{&}_content {
    flex: 1;
    background-image: url("~images/mxgraph/grid.gif");
    background-repeat: repeat;
    background-color: white;
  }
}
</style>
