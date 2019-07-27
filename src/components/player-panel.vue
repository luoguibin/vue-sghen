<template>
  <transition name="fade">
    <div v-if="player" class="player-panel" @click.stop="onNothing()">
      <el-button class="close" icon="el-icon-close" @click="showPlayer()"></el-button>

      <div>
        <span>ID:{{player.id}}</span>
        <span>{{player.name}}</span>
      </div>
      <div>
        <span>等级:{{player.level}}</span>
        <span>血量:{{player.blood}}/{{player.bloodAll}}</span>
      </div>
      <div>
        <span>元力{{player.spear.strength}}</span>
        <span>灵力{{player.spear.mana}}</span>
      </div>
      <div>
        <div>
          <span>五行·破</span>
        </div>
        <div>
          <span>金{{player.spear.metal}}</span>
          <span>木{{player.spear.wood}}</span>
          <span>水{{player.spear.water}}</span>
          <span>火{{player.spear.fire}}</span>
          <span>土{{player.spear.earth}}</span>
        </div>
        <div>
          <span>五行·御</span>
        </div>
        <div>
          <span>金{{player.shield.antiMetal}}</span>
          <span>木{{player.shield.antiWood}}</span>
          <span>水{{player.shield.antiWater}}</span>
          <span>火{{player.shield.antiFire}}</span>
          <span>土{{player.shield.antiEarth}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import GameScene from "@/common/game-scene";

export default {
  name: "PlayerPanel",
  data() {
    return {
      player: null
    };
  },
  mounted() {
    GameScene.playerPanel = this;
  },
  methods: {
    onNothing() {},

    showPlayer(player) {
      this.player = player;
    }
  },
  beforeDestroy() {
    GameScene.playerPanel = null;
  }
};
</script>

<style scoped>
.player-panel {
  width: 400px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 150px;
  padding: 10px 0;
  box-sizing: border-box;
  border: 1px solid white;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 110;
  /* transition-property: opacity; */
  /* transition-duration: 3000ms; */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.close {
  float: right;
  padding: 5px;
  border: none;
  margin-right: 5px;
}

.player-panel span {
  padding: 0 10px;
}
</style>
