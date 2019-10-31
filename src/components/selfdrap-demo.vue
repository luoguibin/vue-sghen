<template>
  <div class="selfdrap-demo">
    <drap-item v-for="drapItem in drapItems" :key="drapItem.id" :obj="drapItem"></drap-item>
  </div>
</template>

<script>
const DrapItemComp = {
  template: `<div class="drap-item" :drap-id="obj.id" :style="elStyle">
    {{obj.content}}
    <span class="point" :drap-point="obj.id"></span>
  </div>`,

  name: "drap-item",

  props: {
    obj: {
      type: String,
      default: function() {
        const date = new Date();
        return {
          id: date.getTime(),
          content: date.toString(),
          position: {
            left: 0,
            default: 0
          }
        };
      }
    }
  },

  data() {},

  created() {},

  computed: {
    elStyle() {
      const p = this.obj.position;
      return {
        left: p.left + "px",
        top: p.top + "px"
      };
    }
  }
};

export default {
  name: "selfdrap-demo",

  components: {
    "drap-item": DrapItemComp
  },

  data() {
    return {
      drapItems: []
    };
  },

  created() {
    window.selfdrapDemo = this;
    for (let i = 0; i < 3; i++) {
      this.drapItems.push({
        id: i,
        content: "content" + i,
        position: {
          left: 100 * (i + 1),
          top: 50 * (i + 1)
        }
      });
    }

    this.init();
  },

  methods: {
    init() {
      this.drapId = null;
      this.pointId = null;

      window.addEventListener("mousedown", e => {
        const target = e.target;
        let drapId = target.getAttribute("drap-id");
        if (drapId) {
          this.drapId = +drapId;
          this.x = e.clientX;
          this.y = e.clientY;
          window.addEventListener("mousemove", this.moveE);
        } else {
          drapId = target.getAttribute("drap-point");
          if (drapId) {
            this.pointId = +drapId;
          }
        }
      });

      this.moveE = e => {
        const drapId = this.drapId;

        if (drapId !== null) {
          const drapItem = this.drapItems.find(o => o.id === drapId);
          drapItem.position.left += e.clientX - this.x;
          drapItem.position.top += e.clientY - this.y;

          this.x = e.clientX;
          this.y = e.clientY;
        }
      };

      window.addEventListener("mouseup", e => {
        if (this.pointId !== null) {
          const target = e.target;
          let pointId = target.getAttribute("drap-point");
          if (pointId) {
            pointId = +pointId;
            const drapItem0 = this.drapItems.find(o => o.id === this.pointId);
            const drapItem1 = this.drapItems.find(o => o.id === pointId);
            this.$message.info({
              message: drapItem0.content + "->" + drapItem1.content
            });
          }
        }
        this.drapId = null;
        this.pointId = null;
        window.removeEventListener("mousemove", this.moveE);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.selfdrap-demo {
  position: relative;
  height: 100%;

  /deep/.drap-item {
    position: absolute;
    padding: 10px;
    border: 1px solid gainsboro;
    cursor: pointer;

    .point {
      display: inline-block;
      padding: 10px;
      border-radius: 50%;
      background-color: green;
      transition: padding 300ms;

      &:hover {
        padding: 15px;
      }
    }
  }
}
</style>