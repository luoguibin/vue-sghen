<template>
  <div class="jsplumb-demo" id="jsplumb-demo">
    <div class="plumb-item" id="dragDropWindow1" style="left: 50px; top: 100px;">
      <span>dragDropWindow1</span>
    </div>
    <div class="plumb-item" id="dragDropWindow2" style="left: 350px; top: 100px;">dragDropWindow2</div>
    <div class="plumb-item" id="dragDropWindow3" style="left: 50px; top: 300px;">dragDropWindow3</div>
    <div class="plumb-item" id="dragDropWindow4" style="left: 350px; top: 300px;">dragDropWindow4</div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";

export default {
  name: "jsplumb-demo",

  data() {
    return {
      plumbItems: [],
      plumbId: 0
    };
  },

  mounted() {
    window.jsPlumbDemo = this;

    jsPlumb.ready(() => {
      const instance = jsPlumb.getInstance({
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        PaintStyle: { stroke: "#666" },
        EndpointHoverStyle: { fill: "orange" },
        HoverPaintStyle: { stroke: "orange" },
        EndpointStyle: { width: 20, height: 16, stroke: "#666" },
        Endpoint: "Rectangle",
        Anchors: ["TopCenter", "TopCenter"],
        ConnectionOverlays: [
          ["Arrow", { width: 20, length: 10, foldback: 0.623, location: 0.92, visible: true }]
        ],
        Container: "jsplumb-demo"
      });
      this.plumbInstance = instance

      // suspend drawing and initialise.
      instance.batch(function() {
        // bind to connection/connectionDetached events, and update the list of connections on screen.
        instance.bind("connection", function(info, originalEvent) {
        });
        instance.bind("connectionDetached", function(info, originalEvent) {
        });

        instance.bind("connectionMoved", function(info, originalEvent) {
          //  only remove here, because a 'connection' event is also fired.
          // in a future release of jsplumb this extra connection event will not
          // be fired.
          console.log("connection moved")
        });

        instance.bind("click", function(component, originalEvent) {
          alert("click!");
        });

        // configure some drop options for use by all endpoints.
        var exampleDropOptions = {
          tolerance: "touch",
          hoverClass: "dropHover",
          activeClass: "dragActive"
        };

        //
        // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
        // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
        // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
        // that declares 'exampleEndpoint' as its drop scope, and also that
        // only 'exampleConnection' types can be dropped here.
        //
        // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a strokeWidth of
        // 5 pixels, and a gradient.
        //
        // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
        // or not to allow a particular connection to be established.
        //
        var exampleColor = "#00f";
        var exampleEndpoint = {
          endpoint: "Rectangle",
          paintStyle: { width: 25, height: 21, fill: exampleColor },
          isSource: true,
          reattach: true,
          scope: "blue",
          connectorStyle: {
            gradient: {
              stops: [[0, exampleColor], [0.5, "#09098e"], [1, exampleColor]]
            },
            strokeWidth: 5,
            stroke: exampleColor,
            dashstyle: "2 2"
          },
          isTarget: true,
          beforeDrop: function(params) {
            return true;
          },
          dropOptions: exampleDropOptions
        };

        //
        // the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
        // and has scope 'exampleConnection2'.
        //
        var color2 = "#316b31";
        var exampleEndpoint2 = {
          endpoint: ["Dot", { radius: 10 }],
          paintStyle: { fill: color2 },
          isSource: true,
          scope: "green",
          connectorStyle: { stroke: color2, strokeWidth: 2 },
          connector: ["Bezier", { curviness: 63 }],
          maxConnections: 3,
          isTarget: true,
          beforeDrop: function(params) {
            return true;
          },
          dropOptions: exampleDropOptions
        };

        //
        // the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
        // 'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
        // overriden, so it appears in the same place on every element.
        //
        // this example also demonstrates the beforeDetach interceptor, which allows you to intercept
        // a connection detach and decide whether or not you wish to allow it to proceed.
        //
        var example3Color = "rgba(229,219,61,0.5)";
        var exampleEndpoint3 = {
          endpoint: ["Dot", { radius: 17 }],
          anchor: "BottomLeft",
          paintStyle: { fill: example3Color, opacity: 0.5 },
          isSource: true,
          scope: "yellow",
          connectorStyle: {
            stroke: example3Color,
            strokeWidth: 4
          },
          connector: "Straight",
          isTarget: true,
          dropOptions: exampleDropOptions,
          beforeDetach: function(conn) {
            return confirm("Detach connection?");
          },
          onMaxConnections: function(info) {
            alert(
              "Cannot drop connection " +
                info.connection.id +
                " : maxConnections has been reached on Endpoint " +
                info.endpoint.id
            );
          }
        };

        // setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
        // of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
        var e1 = instance.addEndpoint(
          "dragDropWindow1",
          { anchor: [0.5, 1, 0, 1] },
          exampleEndpoint2
        );

        // setup some DynamicAnchors for use with the blue endpoints
        // and a function to set as the maxConnections callback.
        var anchors = [
            [1, 0.2, 1, 0],
            [0.8, 1, 0, 1],
            [0, 0.8, -1, 0],
            [0.2, 0, 0, -1]
          ],
          maxConnectionsCallback = function(info) {
            alert(
              "Cannot drop connection " +
                info.connection.id +
                " : maxConnections has been reached on Endpoint " +
                info.endpoint.id
            );
          };

        var e1 = instance.addEndpoint(
          "dragDropWindow1",
          { anchor: anchors },
          exampleEndpoint
        );
        // you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
        e1.bind("maxConnections", maxConnectionsCallback);

        var e2 = instance.addEndpoint(
          "dragDropWindow2",
          { anchor: [0.5, 1, 0, 1] },
          exampleEndpoint
        );
        // again we bind manually. it's starting to get tedious.  but now that i've done one of the blue endpoints this way, i have to do them all...
        e2.bind("maxConnections", maxConnectionsCallback);
        instance.addEndpoint(
          "dragDropWindow2",
          { anchor: "RightMiddle" },
          exampleEndpoint2
        );

        var e3 = instance.addEndpoint(
          "dragDropWindow3",
          { anchor: [0.25, 0, 0, -1] },
          exampleEndpoint
        );
        e3.bind("maxConnections", maxConnectionsCallback);
        instance.addEndpoint(
          "dragDropWindow3",
          { anchor: [0.75, 0, 0, -1] },
          exampleEndpoint2
        );

        var e4 = instance.addEndpoint(
          "dragDropWindow4",
          { anchor: [1, 0.5, 1, 0] },
          exampleEndpoint
        );
        e4.bind("maxConnections", maxConnectionsCallback);
        instance.addEndpoint(
          "dragDropWindow4",
          { anchor: [0.25, 0, 0, -1] },
          exampleEndpoint2
        );

        // make .window divs draggable
        instance.draggable(jsPlumb.getSelector(".plumb-item"), {
          // grid: [1, 1],
          // start(e) { console.log('start', e) },
          // stop(e) { console.log('stop', e) },
          // startEvent(e) { console.log('startEvent', e) },
          // drag(e) { console.log('drag', e) },
          // beforeStart(e) { console.log('beforeStart', e) }
        });

        // add endpoint of type 3 using a selector.
        instance.addEndpoint(
          jsPlumb.getSelector(".plumb-item"),
          exampleEndpoint3
        );

        var hideLinks = jsPlumb.getSelector(".plumb-item span");
        instance.on(hideLinks, "click", function(e) {
          console.log(e);
          // instance.toggleVisible(true);
          // instance.toggleDraggable(true);
          // instance.deleteConnectionsForElement(true);
          // instance.detachEveryConnection();
        });
      });

      jsPlumb.fire("jsPlumbDemoLoaded", instance);
    });
  }
};
</script>

<style lang="scss" scoped>
.jsplumb-demo {
  height: 100%;
  position: relative;
  overflow: hidden;

  .plumb-item {
    position: absolute;
    z-index: 10;
    padding: 10px;
    border: 1px solid gray;
    background-color: rgba(255, 255, 255, 0.342);
  }
}
</style>