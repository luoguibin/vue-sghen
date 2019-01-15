<template>
  <div class="home">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" version="1.1">
      <!-- background -->
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(20,120,220);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(200,200,200);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect cx="0" cy="0" width="800" height="600" fill="url(#bg)" style="filter: blur(1px);" />

      <!-- sun -->
      <circle cx="200" cy="200" r="20" class="sun" />

      <!-- moon -->
      <!-- <path :d="moonPath" style="stroke: gray; fill: rgba(14, 20, 120, 1);" /> -->

      <!-- cloud -->
      <g class="clouds">
        <ellipse cx="-20" cy="0" rx="50" ry="10" class="cloud" />
        <ellipse cx="10" cy="30" rx="60" ry="20" class="cloud" />
        <ellipse cx="30" cy="20" rx="80" ry="10" class="cloud" />
        <ellipse cx="-20" cy="20" rx="50" ry="20" class="cloud" />
        <ellipse cx="-30" cy="10" rx="50" ry="10" class="cloud" />
      </g>

      <!-- mountains -->
      <polygon points="600,450 560,500 400,600 600,600 700,420" style="fill:rgb(144, 213, 162); stroke:#aaaaaa;stroke-width:1" />
      <polygon points="800,300 760,320 600,560 580,600 800,600" style="fill:rgb(144, 213, 162); stroke:#aaaaaa;stroke-width:1" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      moonPoints: [
        "M",
        { x: 200, y: 200 },
        "c",
        { x: 33, y: 0 },
        { x: 33, y: 50 },
        { x: 0, y: 50 },
        "Z"
      ]
    };
  },
  mounted() {
    window.home = this;
  },
  computed: {
    moonPath() {
      let path = "";
      this.moonPoints.forEach(o => {
        if (typeof o === "string") {
          path += o;
        } else {
          path += `${o.x} ${o.y} `;
        }
      });
      console.log(path);
      return path;
    }
  }
};
</script>

<style scoped>
.home {
  height: 100%;
  overflow: hidden;
}

svg {
  width: 100%;
  /* height: 100%; */
  /* border: 1px solid red;
  box-sizing: border-box; */
}

.sun {
  stroke: rgb(255, 144, 144);
  stroke-width: 1;
  fill: rgb(255, 104, 104);
  filter: blur(1px);
}

.clouds {
  transform: translate(200px, 200px);
}
.cloud {
  stroke: transparent;
  fill: rgba(220, 220, 220, 0.5);
  filter: blur(3px);
}
</style>
