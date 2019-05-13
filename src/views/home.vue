<template>
  <div class="home">
    <ul>
      <li>
        <a href="./#/peotry">书三行</a>
      </li>
      <li>
        <a href="./#/game">game</a>
      </li>
      <li>
        <a href="./#/demo/list">demo示威</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  mounted() {
    window.home = this;
    document.body.oncontextmenu = function() {
      return false;
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  
  ul {
    display: inline-block;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    list-style: none;
    font-size: 22px;

    li {
      margin: 10px 0;
    }
  }
}
</style>
