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
      <button @click.stop="onShowPlayerPlane()">人物</button>
      <button @click.stop="onDrug()">药物</button>
      <button @click.stop="onSkill(0)">单伤1</button>
      <button @click.stop="onSkill(2)">单伤2</button>
      <button @click.stop="onSkill(4002)">群伤1</button>
    </div>

    <!-- exit -->
    <span class="game-close" @click.stop="onCloseOrOpen()">×</span>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PlayerPanel from "@/components/game/player-panel";
import MsgBox from "@/components/game/msg-box";

import GameScene from "@/common/game/game-scene";
import GameWS from "@/common/game/game-ws";
import OrderCenter from "@/common/game/order-center";

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
    window.gameEl = this;
    this.checkLoginGame();
  },
  methods: {
    onNothing(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    checkLoginGame() {
      const token = this.userInfo.token;
      if (token) {
        GameWS.connect(token);
        GameScene.initDom(this.$el, flag => {
          this.$NProgress.done();
          if (flag) {
            this.isReady = true;
          } else {
            this.$appTip("load failed");
          }
        });
      } else {
        this.showLogin();
      }
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
    onCloseOrOpen() {
      GameWS.release();
      this.$router.replace("/");
    },
    ...mapActions({
      setUserInfo: "setUser",
      showLogin: "showLogin"
    })
  },
  watch: {
    userInfo() {
      if (this.userInfo.token) {
        this.checkLoginGame();
      } else {
        console.log("game watch userinfo null");
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
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
  min-width: 1024px;
  min-height: 768px;
  overflow: hidden;
}

.normal-menus {
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 10px;
  transform: translate(-50%, 0);
  border: 1px solid gray;
  background-color: darksalmon;
}

.game-close {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 120;
  cursor: pointer;
}
</style>
