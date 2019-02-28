//数据定义参见LabDom的数据规范
const waveConfig = {
  tag: "div",
  config: {
    action: 0
  },
  attribute: {
    id: "lab-wave"
  },
  style: {
    width: "100px",
    height: "100px",
    position: "absolute",
    top: "0px",
    left: "0px",
    zIndex: 100,
    pointerEvents: "none"
  },
  children: [
    {
      tag: "div",
      config: {
        action: 0
      },
      style: {
        width: "100px",
        height: "100px",
        position: "absolute",
        top: "0px",
        left: "0px",
        border: "2px solid white",
        borderRadius: "50%",
        pointerEvents: "none"
      }
    },
    {
      tag: "div",
      config: {
        action: 0
      },
      style: {
        width: "80px",
        height: "80px",
        position: "absolute",
        top: "10px",
        left: "10px",
        border: "2px solid white",
        borderRadius: "50%",
        pointerEvents: "none"
      }
    },
    {
      tag: "div",
      config: {
        action: 0
      },
      style: {
        width: "60px",
        height: "60px",
        position: "absolute",
        top: "20px",
        left: "20px",
        border: "2px solid white",
        borderRadius: "50%",
        pointerEvents: "none"
      }
    }
  ]
};

// 定义元素集合及初始状态
const labDomDatas = [
  {
    tag: "img",
    config: {
      action: 0
    },
    attribute: {
      id: "cupbottle",
      src: require("@/assets/img/bio/cupbottle.png")
    },
    style: {
      width: "217px",
      height: "343px",
      position: "absolute",
      left: "500px",
      top: "300px",
      zIndex: 10
    }
  },
  {
    tag: "div",
    config: {
      action: 2
    },
    attribute: {
      id: "cap-set"
    },
    style: {
      position: "absolute",
      left: "800px",
      top: "300px",
      width: "157px",
      height: "81px",
      zIndex: 0
    },
    children: [
      {
        tag: "img",
        config: {
          action: 0
        },
        attribute: {
          src: require("@/assets/img/bio/cap.png")
        },
        style: {
          width: "157px",
          height: "81px",
          position: "absolute",
          left: "0px",
          top: "0px",
          zIndex: 10,
          pointerEvents: "none"
        }
      },
      {
        tag: "img",
        config: {
          action: 0
        },
        attribute: {
          src: require("@/assets/img/bio/funnel.png")
        },
        style: {
          width: "91px",
          height: "352px",
          position: "absolute",
          left: "15px",
          top: "-100px",
          zIndex: 5,
          pointerEvents: "none"
        }
      },
      {
        tag: "img",
        config: {
          action: 0
        },
        attribute: {
          src: require("@/assets/img/bio/tube.png")
        },
        style: {
          width: "180px",
          height: "322px",
          position: "absolute",
          left: "95px",
          top: "-50px",
          zIndex: 5,
          pointerEvents: "none"
        }
      },
      {
        tag: "img",
        config: {
          action: 2
        },
        attribute: {
          id: "cotton",
          src: require("@/assets/img/bio/cotton.png")
        },
        style: {
          width: "93px",
          height: "86px",
          position: "absolute",
          left: "450px",
          top: "0px",
          zIndex: 0,
          display: "none",
          zIndex: 20
        }
      },
      {
        tag: "img",
        config: {
          action: 2
        },
        attribute: {
          id: "clip",
          src: require("@/assets/img/bio/clip.png")
        },
        style: {
          width: "59px",
          height: "77px",
          position: "absolute",
          left: "450px",
          top: "0px",
          display: "none",
          zIndex: 15
        }
      }
    ]
  }
];


// 定义元素过程状态，因点击或拖动元素时自动添加了z-index属性，故需熟知z-index改变造成的影响
// 总的过程分为三种：anime动画过程，鼠标点击或拖动过程，自动设置样式、配置参数过程
const labDomSteps = [
  {
    id: "cap-set",    // 必须属性
    wave: true,       // 可选，是否波纹提示自身
    twinkle: true,    // 可选，是否闪烁提示目标位置，配合toLocation使用，用于拖动元素至toLocation
    toLocation: {     // 可选，配合twinkle使用
      left: "530px",
      top: "250px"
    },
    toConfig: {       // 可选，拖动至目标位置后，设置配置参数（配置参数见LabDom中定义）
      action: 0
    }
  },
  {
    id: "cotton",
    animeConfig: {    // 可选，用于配置anime动画，可配合animeEndStyle使用
      duration: 0,
      delay: 300
    },
    animeEndStyle: {  // 可选，用于在anime动画结束后设置LabDom样式
      display: "block"
    },
    call: "after"     // 可选"before"、"after::selfFunction"、"before::selfFunction"；可自定义扩展回调方法
  },
  {
    id: "cotton",
    wave: true,
    twinkle: true,
    toLocation: {
      left: "15px",
      top: "-110px"
    },
    toConfig: {
      action: 0
    }
  },
  {
    id: "cotton",
    animeConfig: {
      scale: 0.6,
      duration: 1000,
      delay: 300
    },
    animeEndStyle: {
      transform: "scale(0.6)",
      zIndex: 0
    },
    call: "after::showTip"
  },
  {
    id: "clip",
    style: {
      display: "block"
    },
    call: "before"
  },
  {
    id: "clip",
    wave: true,
    twinkle: true,
    toLocation: {
      left: "155px",
      top: "-110px"
    },
    toConfig: {
      action: 0
    }
  }
];


export { waveConfig, labDomDatas, labDomSteps }