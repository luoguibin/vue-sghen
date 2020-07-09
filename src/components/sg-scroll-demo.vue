<template>
  <div class="sg-scroll-demo scroll-vertical" sg-scroll="vertical_base">
    <div class="scroll-vertical bg1" sg-scroll="vertical_stop" style="height: 30%;">
      <div class="item">sg-scroll="vertical_stop"</div>
      <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
    </div>

    <div class="scroll-vertical bg2" sg-scroll="vertical_base" style="height: 30%;">
      <div class="item">sg-scroll="vertical_base"</div>
      <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
    </div>

    <div class="scroll-vertical bg0" sg-scroll style="height: 30%;">
      <div class="item">sg-scroll(default value is `vertical`)</div>
      <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
    </div>

    <div style="height: 50%;">
      <div class="scroll-horizontal bg1" sg-scroll="horizontal_base">
        <div class="item">sg-scroll="horizontal"</div>
        <div class="item">
          <div class="scroll-vertical" sg-scroll="vertical_base">
            <div class="item">sg-scroll="vertical_base"</div>
            <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
          </div>
        </div>
        <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
      </div>
    </div>

    <div class="scroll-normal bg2" sg-scroll="normal">
      <div class="item">sg-scroll="normal"</div>
      <div
        class="item"
        style="width: 200%; height: 100%"
      >ABCDEFGHIJKLMNOPQRESTUVWXYZABCDEFGHIJKLMNOPQRESTUVWXYZABCDEFGHIJKLMNOPQRESTUVWXYZABCDEFGHIJKLMNOPQRESTUVWXYZ</div>
      <div
        class="item"
        style="width: 200%; height: 100%"
      >1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890</div>
    </div>
  </div>
</template>

<script>
import sgScroll from "sg-scroll";

export default {
  name: "App",

  data() {
    return {
      items: []
    };
  },

  created() {
    for (let index = 0; index < 33; index++) {
      this.items.push({ id: index });
    }
    if (!this.$checkToTip(this, 'wap')) {
      sgScroll.sgScrollInit();
    }
  }
};
</script>

<style scoped>
.sg-scroll-demo {
  height: 100%;
}

.scroll-vertical {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.scroll-horizontal {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  box-sizing: border-box;
  white-space: nowrap;
}
.scroll-normal {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.item {
  color: white;
  font-size: 1.2rem;
  line-height: 3rem;
  padding: 0 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
}
.scroll-vertical > .item {
  margin-bottom: 1.6rem;
}
.scroll-horizontal > .item {
  display: inline-block;
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.scroll-normal > .item {
  white-space: wrap;
  word-break: break-all;
  box-sizing: border-box;
}

.bg0 {
  background-color: rgb(255, 107, 107);
}
.bg1 {
  background-color: rgb(69, 141, 69);
}
.bg2 {
  background-color: rgb(112, 112, 173);
}
</style>
