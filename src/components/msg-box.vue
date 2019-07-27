<template>
  <div class="msg-box" @click="onNothing" @mousedown="onNothing" @touchstart="onNothing">
    <div class="msg-type">
      <span
        v-for="(item, key) in msgMap"
        :key="key"
        @click="onSelectMsgType(key)"
        :class="{'msg-type-select': msgKey === key}"
      >{{item.name}}</span>

      <span
        @click="onToogle()"
        :class="['msg-box-toogle', isShrink ? 'el-icon-plus' : 'el-icon-minus']"
      ></span>
    </div>

    <div class="msg-content" ref="msgContent">
      <p v-for="(data, index) in mMsg.datas" :key="index">{{data}}</p>
    </div>

    <el-input :maxlength="200" v-model="msgInput" @keyup.native.enter="onSend()"></el-input>
  </div>
</template>

<script>
import GameWS from "@/common/game-ws";
import GameScene from "@/common/game-scene";
import OrderCenter from "@/common/order-center";

export default {
  name: "MsgBox",
  data() {
    return {
      isShow: false,
      isShrink: false,
      msgInput: "",
      msgKey: "",
      mMsg: null,
      msgMap: {
        system: {
          name: "系统",
          datas: []
        },
        person: {
          name: "个人",
          datas: []
        }
      }
    };
  },
  created() {
    this.onSelectMsgType("system");
  },
  mounted() {
    GameScene.msgBox = this;
    OrderCenter.msgBox = this;
    this.myId = GameScene.myModel.userData.id;
  },
  methods: {
    addMsg(msg, type) {
      if (!msg) return;
      if (!type) type = "system";

      const msgObj = this.msgMap[type],
        msgContent = this.$refs.msgContent;
      if (!msgObj) return;
      this.onSelectMsgType(type);

      if (msgObj.datas.length > 50) msgObj.datas.splice(0, 1);
      msgObj.datas.push(msg);

      setTimeout(() => {
        msgContent.scrollTop = msgContent.scrollHeight;
      }, 0);
    },

    onNothing(e) {
      // e.preventDefault();
      e.stopPropagation();
    },

    onSelectMsgType(key) {
      this.msgKey = key;
      this.mMsg = this.msgMap[key];
    },

    onToogle() {
      const isShrink = this.isShrink,
        el = this.$el;
      this.isShrink = !isShrink;
      if (isShrink) {
        el.style.height = "250px";
      } else {
        el.style.height = "80px";
      }
    },

    onSend() {
      const msgInput = this.msgInput,
        order = {
          order: 12002,
          fromType: 10000,
          fromId: this.myId,
          data: {
            toType: 10000,
            toId: 0,
            msg: msgInput
          }
        };
      GameWS.sendOrder(order);

      this.msgInput = "";
    }
  },
  beforeDestroy() {
    GameScene.msgBox = null;
    OrderCenter.msgBox = null;
  }
};
</script>

<style scoped>
.msg-box {
  width: 350px;
  height: 200px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid white;
  border-top-right-radius: 5px;
  box-sizing: border-box;
  z-index: 100;
  transition-property: height;
  transition-duration: 300ms;
}

.msg-type {
  overflow: hidden;
  line-height: 24px;
  word-break: none;
  border-radius: inherit;
  border-bottom: 1px solid white;
}
.msg-type span {
  display: inline-block;
  padding: 3px 5px;
  cursor: pointer;
}
.msg-type .msg-type-select {
  background-color: white;
}
.msg-type .msg-box-toogle {
  float: right;
  font-size: 14px;
  margin-top: 5px;
}

.msg-content {
  flex: 1;
  padding: 5px;
  overflow-x: hidden;
  overflow-y: auto;
}
.msg-content p {
  margin-bottom: 3px;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
