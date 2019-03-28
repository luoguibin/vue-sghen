<template>
  <div class="home-peotry">
    <div class="header">
      <button class="user" @click="onShowLogin">{{userInfo.name ? userInfo.name : "登录"}}</button>

      <div v-if="showLogin" class="user-login">
        <input v-model.number="account.uId" type="tel" />
        <input v-model="account.pw" type="password" />
        <button @click.stop="onLogin">login</button>
      </div>
    </div>

    <div class="list" ref="listEl">
      <peotry v-for="(peotry, index) in peotries" :key="peotry.id" :peotry="peotry" class="peotry">
        <template>{{(curPage - 1) * limit + index + 1}}</template>
      </peotry>
    </div>

    <div class="footer" v-show="peotries.length">
      <button @click.stop="onPage(-1)">←</button>
      <button @click.stop="onPage(1)">→</button>
      <span>当前第<input class="current-page" v-model.number="curPage" />页，每页{{limit}}条，共{{totalPage}}页，一共{{totalCount}}条</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Peotry from "@/components/peotry/peotry";

export default {
  name: "HomePeotry",
  components: {
    peotry: Peotry
  },
  data() {
    return {
      showLogin: false,
      account: {
        uId: 15625045984,
        pw: "123456"
      },

      peotryUrl: "",
      limit: 10,
      curPage: 1,
      totalPage: 1,
      totalCount: 0,
      peotries: []
    };
  },
  created() {
    window.homePeotry = this;
    const infoStr = sessionStorage.getItem("sghen_user_info");
    if (infoStr) {
      this.setUserInfo(JSON.parse(infoStr));
    }
  },
  watch: {
    userInfo: {
      deep: true,
      handler() {
        this.getPeotries();
      }
    },
    curPage(newVal, oldVal) {
      if (newVal < 1 || newVal > this.totalPage) {
        this.curPage = oldVal;
        return;
      }
      if (!oldVal) return;
      this.getPeotries();
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  },
  methods: {
    onShowLogin() {
      if (!this.userInfo.name) {
        this.showLogin = !this.showLogin;
      } else {
        this.$appTip("hello, " + this.userInfo.name);
      }
    },
    onLogin() {
      axios
        .post("http://localhost:8088/v1/user/login", this.account)
        .then(resp => {
          if (resp.data.code === 1000) {
            const info = resp.data.data;
            sessionStorage.setItem("sghen_user_info", JSON.stringify(info));
            this.setUserInfo(info);
            this.showLogin = false;
          } else {
            this.$appTip(resp.data.msg);
          }
        })
        .catch(e => {
          this.$appTip(e.message);
        });
    },
    onPage(value) {
      this.curPage += value;
    },
    getPeotries() {
      axios
        .get("http://localhost:8088/v1/peotry/query", {
          params: {
            limit: this.limit,
            page: this.curPage
          }
        })
        .then(resp => {
          if (resp.data.code === 1000) {
            const data = resp.data;
            this.curPage = data.curPage;
            this.totalPage = data.totalPage;
            this.totalCount = data.totalCount;
            this.peotries = data.data;

            this.$refs.listEl.scrollTop = 0;
          } else {
            this.$appTip(resp.data.msg);
          }
        })
        .catch(e => {
          this.$appTip(e.message);
        });
    },

    ...mapActions({
      setUserInfo: "setUser"
    })
  }
};
</script>

<style scoped>
.home-peotry {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-peotry .header {
  padding: 5px 0;
  box-shadow: 0 3px 10px 6px rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.5);
}

.header .user {
  float: right;
  margin-right: 30px;
}

.header .user-login {
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

.home-peotry .list {
  flex: 1;
  overflow-y: auto;
  padding-left: 40%;
}

.list .peotry {
  position: relative;
  margin-bottom: 30px;
}

.home-peotry .footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  box-shadow: 0 -3px 10px 6px rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.5);
}

.footer .current-page {
  max-width: 30px;
  text-align: center;
}
</style>
