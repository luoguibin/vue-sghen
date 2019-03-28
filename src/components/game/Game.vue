<template>
  <div class="game">
    <!-- player-panel -->
    <player-panel ref="playerPanel" v-if="isReady"></player-panel>

    <!-- msg-box -->
    <msg-box ref="msgBox" v-if="isReady"></msg-box>

    <!-- normal order -->
    <div class="normal-menus" v-if="isReady" @mouseup="onNothing" @mousedown="onNothing" @touchstart="onNothing">
      <button @click.stop="onShowPlayerPlane()">人物</button>
      <button @click.stop="onDrug()">药物</button>
      <button @click.stop="onSkill(0)">单伤1</button>
      <button @click.stop="onSkill(2)">单伤2</button>
      <button @click.stop="onSkill(4002)">群伤1</button>
    </div>

    <!-- login panel -->
    <div v-if="showLogin" class="user-login">
      <input v-model.number="account.uId" type="tel" />
      <input v-model="account.pw" type="password" />
      <button @click.stop="onLogin()">login</button>
    </div>

    <!-- exit -->
    <span v-else class="game-close" @click.stop="onCloseOrOpen()">×</span>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PlayerPanel from "@/components/game/PlayerPanel";
import MsgBox from "@/components/game/MsgBox";

import http from "@/common/game/http";
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
      showLogin: false,
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
        this.showLogin = false;
        GameWS.connect(token);
        GameScene.initDom(this.$el, flag => {
          if (flag) {
            this.isReady = true;
          } else {
            alert("load failed");
          }
        });
      } else {
        this.showLogin = true;
      }
    },
    onShowLogin() {
      if (this.userInfo.id > 0) {
        return;
      }
      this.showLogin = !this.showLogin;
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

    onLogin() {
      http.post("http://localhost:8088/v1/user/login", this.account, resp => {
        if (resp.data.code === 1000) {
          const info = resp.data.data;
          sessionStorage.setItem("sghen_user_info", JSON.stringify(info));
          this.setUserInfo(info);
          this.checkLoginGame();
        } else {
          console.log(resp.data.msg);
        }
      });
    },
    onCloseOrOpen() {
      GameWS.release();
    },
    ...mapActions({
      setUserInfo: "setUser"
    })
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

.user-login {
  width: 20rem;
  height: 10rem;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 1rem;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 180, 118);
  z-index: 100;
}
.user-login input {
  display: block;
  width: 100%;
  padding: 0.3rem;
  font-size: 18px;
  box-sizing: border-box;
}

.user-login button {
  margin: 0.3rem auto 0;
}
</style>
