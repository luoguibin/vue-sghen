<template>
  <div class="game">
    <!-- player-panel -->
    <player-panel ref="playerPanel" v-if="isReady"></player-panel>

    <!-- msg-box -->
    <msg-box ref="msgBox" v-if="isReady"></msg-box>

    <!-- normal order -->
    <div
      class="normal-menus"
      v-if="isReady"
      @mouseup="onNothing"
      @mousedown="onNothing"
      @touchstart="onNothing"
    >
      <el-button-group>
        <el-button @click.stop="showFireWork(0)">烟花0</el-button>
        <el-button @click.stop="showFireWork(1)">烟花1</el-button>
      </el-button-group>
      <br/>
      <el-button-group>
        <el-button @click.stop="onShowPlayerPlane()">人物</el-button>
        <el-button @click.stop="onDrug()">药物</el-button>
        <el-button @click.stop="onSkill(0)">单伤1</el-button>
        <el-button @click.stop="onSkill(2)">单伤2</el-button>
        <el-button @click.stop="onSkill(4002)">群伤1</el-button>
      </el-button-group>
    </div>

    <!-- exit -->
    <el-button class="game-close" @click.stop="onCloseOrOpen()" icon="el-icon-close"></el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PlayerPanel from "@/components/player-panel";
import MsgBox from "@/components/msg-box";

import GameScene from "@/common/game-scene";
import GameWS from "@/common/game-ws";
import OrderCenter from "@/common/order-center";

export default {
  name: "game",
  components: {
    "player-panel": PlayerPanel,
    "msg-box": MsgBox
  },

  data() {
    return {
      isReady: false,
      account: {
        uId: 15625045984,
        pw: "123456"
      }
    };
  },

  mounted() {
    window.game = this;
    this.checkLoginGame();
    document.oncontextmenu = function(e) {
      return false;
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  methods: {
    onNothing(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    checkLoginGame() {
      GameWS.connect(this.userInfo.token);
      GameScene.initDom(this.$el, flag => {
        this.$NProgress.done();
        if (flag) {
          this.isReady = true;
        } else {
          this.$message("load failed");
        }
      });
    },

    onShowPlayerPlane() {
      GameScene.playerPanel.showPlayer(GameScene.myModel.userData);
    },

    onDrug() {
      GameWS.sendOrder({
        order: 31000,
        fromType: 10000,
        fromId: GameScene.myModel.userData.id
      });
    },

    onSkill(id) {
      GameWS.sendOrder({
        order: 21000 + id,
        fromType: 10000,
        fromId: GameScene.myModel.userData.id,
        data: {
          toType: 10000,
          toId: GameScene.sTargetId,
          skillId: 21000 + id
        }
      });
    },

    showFireWork(id) {
      GameScene.showFireWork(id);
    },

    onCloseOrOpen() {
      this.$confirm("是否退出游戏？", "系统通知", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        GameWS.release();
        this.setUserInfo();
      });
    },

    ...mapActions({
      setUserInfo: "setUserInfo"
    })
  },

  beforeDestroy() {
    GameScene.release();
  }
};
</script>

<style scoped>
.game {
  height: 100%;
  min-width: 640px;
  min-height: 480px;
  overflow: hidden;
}

.normal-menus {
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 10px;
  transform: translate(-50%, 0);
}

.game-close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 120;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #148acf;
}
</style>
