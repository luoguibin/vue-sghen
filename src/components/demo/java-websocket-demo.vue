<template>
  <div>
    <el-form :data="account" label-width="100px" v-if="!ws">
      <el-form-item prop="userId" label="userId">
        <el-input v-model="account.userId"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="password">
        <el-input v-model="account.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onLogin">login</el-button>
      </el-form-item>
    </el-form>

    <div v-show="ws">
      <el-button v-for="order in orders" :key="order.id" @click="onClick(order.id)">{{order.label}}</el-button>
    </div>
    <div v-html="dataHTML"></div>
    <div>
      <div
        v-for="player in players"
        :class="{'player': true, 'current': player.id === playerId}"
        :key="player.id"
        @click="onClickPlayer(player.id)"
      >
        <span>{{player.id}}</span>
        <span>{{player.blood}}</span>
        <span>{{player.power}}</span>
        <span>{{player.defense}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "java-websocket-demo",

  data() {
    return {
      account: {
        userId: 15625045984,
        password: "123456"
      },
      orders: [
        { id: 101, label: "小药" },
        { id: 102, label: "大药" },
        { id: 201, label: "小招" },
        { id: 202, label: "大招" },
        { id: 301, label: "天赋加成" },
        { id: 404, label: "退出" }
      ],
      players: [],
      ws: null,
      dataHTML: "",
      playerId: 0
    };
  },

  created() {
    window.javaWebsocketDemo = this;
  },

  methods: {
    onLogin() {
      this.initSocket();
    },

    initSocket() {
      this.closeSocket();

      const account = this.account;
      const ws = new WebSocket(
        "ws://localhost:8088/websocket/" +
          account.userId +
          "/" +
          account.password
      );
      if (!ws) {
        console.log("ws create error");
        return;
      }

      ws.onopen = () => {
        console.log("connectServer() ws onopen");
        this.ws = ws;
        this.ws.send(
          JSON.stringify({
            fromId: this.account.userId,
            toId: 0,
            orderId: 0
          })
        );
      };

      ws.onmessage = e => {
        // console.log(e.data);
        const obj = JSON.parse(e.data);
        if (obj.id === 1) {
          this.players = obj.data;
        } else {
          this.dataHTML = obj.result;
        }
      };

      ws.onerror = e => {
        console.log("ws error", e);
        if (!this.ws) {
          alert("connect error");
        }
      };

      ws.onclose = e => {
        console.log("ws close", e);
        this.ws = null;
      };
    },

    onClick(id) {
      if (this.ws) {
        this.ws.send(
          JSON.stringify({
            fromId: this.account.userId,
            toId: this.playerId,
            orderId: id
          })
        );
      }
    },

    onClickPlayer(id) {
      console.log("onClickPlayer", id)
      this.playerId = id;
    },

    closeSocket() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;

        this.dataHTML = "";
        this.players = [];
        this.playerId = -1;
      }
    }
  },

  beforeDestroy() {
    this.closeSocket();
  }
};
</script>

<style lang="scss" scoped>
.player {
  padding: 10px;
  span {
    margin-right: 10px;
  }
}

.player.current {
  border: 1px solid red;
}
</style>
