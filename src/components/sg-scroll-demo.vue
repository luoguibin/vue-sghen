<template>
  <div class="sg-scroll-demo scroll-vertical">
    <div class="menus">
      <span
        v-for="menu in menus"
        :key="menu.key"
        :class="{'active': menuKey === menu.key}"
        @click="onClickMenu(menu)"
      >{{menu.name}}</span>
    </div>
    <div class="flex-one">
      <!-- 粘滞定位演示 -->
      <div
        v-show="menuKey === 'sticky'"
        sg-scroll="vertical_stop"
        sg-sticky="sg-sticky-item"
        sg-edge
        class="scroll-vertical"
      >
        <h3>sg-sticky自粘滞定位</h3>
        <p
          style=" padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px solid gray;"
        >父容器添加attribute: sg-sticky="sg-sticky-item",其祖父容器的布局自动被设置为display: relative;</p>
        <div class="sg-sticky-item">逍遥游·北冥有鱼</div>
        <p>北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。是鸟也，海运则将徙于南冥。南冥者，天池也。《齐谐》者，志怪者也。《谐》之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。”野马也，尘埃也，生物之以息相吹也。天之苍苍，其正色邪？其远而无所至极邪？其视下也，亦若是则已矣。且夫水之积也不厚，则其负大舟也无力。覆杯水于坳堂之上，则芥为之舟，置杯焉则胶，水浅而舟大也。风之积也不厚，则其负大翼也无力。故九万里，则风斯在下矣，而后乃今培风；背负青天，而莫之夭阏者，而后乃今将图南。蜩与学鸠笑之曰：“我决起而飞，抢榆枋而止，时则不至，而控于地而已矣，奚以之九万里而南为？”适莽苍者，三餐而反，腹犹果然；适百里者，宿舂粮；适千里者，三月聚粮。之二虫又何知！...</p>
        <div class="sg-sticky-item">译文</div>
        <p>北方的海里有一条大鱼，名字叫鲲。鲲非常巨大，不知道有几千里长；变化为鸟，名字叫鹏。鹏的脊背，不知道有几千里长；当它振动翅膀奋起直飞的时候，翅膀就好像挂在天边的云彩。这只鸟，大风吹动海水的时候就要迁徙到南方的大海去了。南方的大海，那就是‘天池’。《齐谐》是一部专门记载怪异事情的书，这本书上记载说：“鹏鸟迁徙时，翅膀拍击水面激起三千里的波涛，鹏鸟奋起而飞，旋转扶摇而上直冲九万里高空，乘着六月的大风离开了北海。”像野马奔腾一样的游气，飘飘扬扬的尘埃，仿佛是由生物气息吹拂。我们所见湛蓝的天空，那是它真正的颜色吗？它是无边无际的吗？鹏鸟所见，大概也是这个样子吧。水汇积不深，它浮载大船就没有力量。倒杯水在庭堂的低洼处，可以用芥草作船，而搁个杯子当船就会粘住不动了，因为水太浅而船太大了。风聚积的力量不雄厚，它便无法托负巨大的翅膀。所以，鹏鸟飞到九万里高空，风就在它的身下，然后方能凭借风力飞行，背负着青天，毫无阻挡，这样就能飞到南方了。寒蝉与小灰雀对此觉得很奇怪，它说：“我猛地起飞，力图到达榆树和檀树的树枝，有时飞不到，也就落在地上而已，为什么要到九万里的高空再而向南飞呢？...</p>
        <div class="sg-sticky-item">注释</div>
        <p style="white-space: pre-line;">
          (1)冥：通假“溟”，指海色深黑。“北冥”，北海。下文“南冥”，指南海。传说北海无边无际，水深而黑。
          (2)鲲（kūn）：传说中的大鱼。
          (3)之：主谓之间取消句子独立性。
          (4)其：表推测。
          (5)鹏：本为古“凤”字，这里指传说中的大鸟。
          (6)怒：奋起的样子，这里指鼓起翅膀。
          (7)垂：同“陲”，边际。
          (8)海运：海动。古有“六月海动”之说。海运之时必有大风，因此大鹏可以乘风南行。
          (9)徙：迁移。
          (10)天池：天然形成的大海。
          (11)《齐谐》：书名。出于齐国，多载诙谐怪异之事，故名“齐谐”。一说人名。
          (12)志怪：记载怪异的事物。志，记载。
          (13)水击：指鹏鸟的翅膀拍击水面。击：拍打。
          (14)抟（tuán）：回旋而上。一作“搏”（bó），拍。
          (15)扶摇：一种旋风，又名飙，由地面急剧盘旋而上的暴风。
          (16)九：表虚数，不是实指。
          (17)去：离，这里指离开北海。“去以六月息者也”指大鹏飞行六个月才止息于南冥。一说息为大风，大鹏乘着六月间的大风飞往南冥。
          (18)以：凭借。
          (19)息：风。
          (20)野马：指游动的雾气。古人认为：春天万物生机萌发，大地之上游气奔涌如野马一般。
          (21)尘埃：扬在空中的土叫“尘”，细碎的尘粒叫“埃”。
          (22)生物：概指各种有生命的东西。
          (23)息：这里指有生命的东西呼吸所产生的气息。
          (24)相：互相。
          (25)吹：吹拂。
          (26)苍苍：深蓝。
          (27)其正色邪：或许是上天真正的颜色？其，抑，或许。正色，真正的颜色。邪，同“耶”，疑问语气词。
          (28)极：尽。
          (29)下：向下。
          (30)亦：也。
          (31)是：这样。
          (32)已：罢了。
          (33)覆：倾倒。
          (34)坳堂：指堂中低凹处。坳（ào）：凹陷不平。
          (35)芥：小草。
          (36)置杯焉则胶：将杯子放于其中则胶着搁浅。置，放。焉，于此。胶，指着地。
          (37)斯：则，就。
          (38)而后乃今：“今而后乃”的倒文，意为“这样，然后才……”。
          (39)培：凭。
          (40)莫之夭阏（yāo è）：无所滞碍。夭，挫折。阏，遏制，阻止。“莫之夭阏”即“莫夭阏之”的倒装。
        </p>
      </div>

      <!-- 自定义滚动 -->
      <div v-show="menuKey === 'scroll'" class="scroll-vertical" sg-scroll="vertical_stop">
        <div style="height: 50%">
          <div class="scroll-vertical bg1" sg-scroll="vertical_stop" sg-edge>
            <div class="text">sg-scroll="vertical_stop"
              竖直方向非冒泡滚动
            </div>
            <div class="text">sg-edge作用于滚动容器，同时滚动容器的父元素将被设置position:relative，需要导入目录下的/style/edge.css样式文件</div>
            <div v-for="item in items" :key="item.id" class="item">{{item.id }}</div>
          </div>
        </div>
        

        <div class="scroll-vertical bg2" sg-scroll="vertical_base" style="height: 50%;">
          <div class="text">sg-scroll="vertical_base"
            基于手势方向冒泡滚动
          </div>
          <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
        </div>

        <div class="scroll-vertical bg0" sg-scroll style="height: 50%;">
          <div class="text">sg-scroll(default value is `vertical`)
            默认竖直冒泡滚动
          </div>
          <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
        </div>

        <div style="height: 50%;">
          <div class="scroll-horizontal bg1" sg-scroll="horizontal_base">
            <div class="item text" style="margin: 0;">sg-scroll="horizontal"
              横向冒泡滚动
            </div>
            <div class="item">
              <div class="scroll-vertical" sg-scroll="vertical_base">
                <div class="text">sg-scroll="vertical_base"</div>
                <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
              </div>
            </div>
            <div v-for="item in items" :key="item.id" class="item">{{item.id}}</div>
          </div>
        </div>

        <div style="height: 50%;" class="scroll-normal bg2" sg-scroll="normal">
          <div class="text">sg-scroll="normal"
            双向冒泡滚动
          </div>
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
    </div>
  </div>
</template>

<script>
import { sgScroll, sgSticky, sgEdge } from "sg-scroll";
import 'sg-scroll/style/edge.css';

export default {
  name: "App",

  data() {
    return {
      items: [],
      menuKey: "scroll",
      menus: [
        { key: "scroll", name: "sg-scroll滚动" },
        { key: "sticky", name: "sg-stiky粘滞定位" },
      ],
    };
  },

  created() {
    window.sgScrollDemo = this;
    for (let index = 0; index < 33; index++) {
      this.items.push({ id: index });
    }
    if (!this.$checkToTip(this, "wap")) {
      sgScroll.init();
      sgSticky.init();
      sgEdge.init();
    }
  },

  beforeDestroy () {
    sgScroll.release()
  },

  methods: {
    onClickMenu({ key }) {
      this.menuKey = key;
    },
  },
};
</script>

<style scoped>
.sg-scroll-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.flex-one {
  flex: 1;
  overflow: hidden;
}
.menus {
  padding: 0.5rem;
  background-color: white;
}
.menus span {
  display: inline-block;
  padding: 0 1rem;
  line-height: 1.8rem;
  border-radius: 10px;
  color: white;
  background-color: rgba(95, 133, 155, 0.3);
}
.menus .active {
  background-color: rgb(95, 133, 155);
}
.menus span {
  margin-right: 1rem;
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
.text {
  color: white;
  margin: 1rem 0;
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
.sg-sticky-item {
  font-size: 2rem;
  line-height: 4rem;
  color: white;
  background-color: rgb(95, 133, 155);
}
p {
  text-indent: 2em;
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
