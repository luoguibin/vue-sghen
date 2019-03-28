<template>
    <div>
        <div>
            <p>SharedWorker test(在另一个标签中打开此链接，进行通信)</p>
            <input v-model="inputStr" />
            <button @click="onSend">send</button>
            <div ref="result"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: "WorkerDemo",
  data() {
    return {
      inputStr: ""
    };
  },
  created() {
    const worker = new SharedWorker(
        "./static/js/shared-worker-test.min.js",
        "shared-woker-test"
      ),
      port = worker.port;
    port.start();

    port.onmessage = e => {
      let data = e.data;
      if (typeof data === "object") data = JSON.stringify(data) || "";
      this.$refs.result.innerHTML = data;
    };
    this.port = port;
  },
  methods: {
    onSend() {
      this.port.postMessage(this.inputStr);
    }
  }
};
</script>

<style scoped>
</style>
