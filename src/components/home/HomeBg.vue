<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMinYMid slice" version="1.1" :class="{'night': !isSun}">
        <!-- background -->
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(20,120,220);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(200,200,200);stop-opacity:1" />
            </linearGradient>
            <linearGradient id="bg-night" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(40,40,40);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(99,99,99);stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="600" :fill="isSun ? 'url(#bg)' : 'url(#bg-night)'" style="filter: blur(1px);" />

        <!-- sun -->
        <circle v-if="isSun" cx="200" cy="200" r="20" class="sun" />

        <!-- moon -->
        <path v-else :d="moonPath" class="moon" />

        <!-- cloud -->
        <g class="clouds">
            <ellipse cx="-20" cy="0" rx="50" ry="10" class="cloud" />
            <ellipse cx="10" cy="30" rx="60" ry="20" class="cloud" />
            <ellipse cx="30" cy="20" rx="80" ry="10" class="cloud" />
            <ellipse cx="-20" cy="20" rx="50" ry="20" class="cloud" />
            <ellipse cx="-30" cy="10" rx="50" ry="10" class="cloud" />
        </g>

        <!-- mountains -->
        <g class="mountains">
            <polygon points="600,450 560,500 400,600 600,600 700,420" class="mountain" />
            <polygon points="800,300 760,320 600,560 580,600 800,600" class="mountain" />
        </g>
    </svg>
</template>

<script>
export default {
  name: "HomeBg",
  data() {
    return {
      isSun: true,
      moonPoints: [
        "M",
        [190, 220],
        "a",
        [25, 25, 0, 1, 0, 25, -40],
        "a",
        [25, 25, 0, 0, 1, -25, 40],
        "z"
      ]
    };
  },
  computed: {
    moonPath() {
      let path = "";
      this.moonPoints.forEach(o => {
        if (typeof o === "string") {
          path += o;
        } else {
          o.forEach(v => {
            path += v + " ";
          });
        }
      });
      console.log(path);
      return path;
    }
  }
};
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  /* border: 1px solid red;
  box-sizing: border-box; */
}

.sun {
  stroke: rgb(255, 144, 144);
  stroke-width: 1;
  fill: rgb(255, 104, 104);
  filter: blur(1px);
}

.moon {
  stroke: rgba(234, 234, 234, 1);
  fill: rgba(234, 234, 234, 1);
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

.night .cloud {
  fill: rgba(88, 88, 88, 0.5);
}

.mountain {
  fill: rgb(144, 213, 162);
  stroke: rgb(142, 253, 171);
  stroke-width: 1;
}

.night .mountain {
  fill: rgb(89, 98, 91);
  stroke: rgb(63, 68, 63);
  filter: blur(1px);
}
</style>
