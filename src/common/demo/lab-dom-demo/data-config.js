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
        width: "85px",
        height: "85px",
        position: "absolute",
        top: "7.5px",
        left: "7.5px",
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
    tag: "div",
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
    },
    children: [
      {
        tag: "img",
        attribute: {
          id: "cupbottle",
          src: require("@/assets/img/bio/cupbottle.png")
        },
        style: {
          width: "217px",
          height: "343px",
          position: "absolute",
          left: "0px",
          top: "0px",
        }
      },
      {
        tag: "img",
        attribute: {
          id: "water",
          src: require("@/assets/img/bio/water.png")
        },
        style: {
          display: "none",
          width: "217px",
          height: "123px",
          position: "absolute",
          left: "0px",
          top: "221px",
          opacity: 0.5
        }
      }
    ]
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
          left: "-5px",
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
          left: "115px",
          top: "-100px",
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
  },
  {
    tag: "div",
    config: {
      action: 2
    },
    attribute: {
      id: "beaker-set"
    },
    style: {
      display: "none",
      width: "159px",
      height: "162px",
      position: "absolute",
      left: "900px",
      top: "400px",
      zIndex: 15,
      transformOrigin: "0 12px"
    },
    children: [
      {
        tag: "img",
        config: {
          action: 0
        },
        attribute: {
          id: "dropwater",
          src: require("@/assets/img/bio/dropwater.png")
        },
        style: {
          width: "140px",
          height: "81px",
          position: "absolute",
          left: "7px",
          top: "81px",
          opacity: 0.5,
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
          id: "beaker",
          src: require("@/assets/img/bio/beaker.png")
        },
        style: {
          width: "159px",
          height: "162px",
          position: "absolute",
          left: "0px",
          top: "0px",
          opacity: 0.3,
          zIndex: 10,
          pointerEvents: "none"
        }
      }
    ]
  },
  {
    tag: "div",
    config: {
      action: 2
    },
    attribute: {
      id: "tube-set"
    },
    style: {
      display: "none",
      width: "55px",
      height: "228px",
      position: "absolute",
      left: "900px",
      top: "400px",
      zIndex: 5
    },
    children: [
      {
        tag: "img",
        config: {
          action: 0
        },
        attribute: {
          id: "limewater",
          src: require("@/assets/img/bio/limewater.png")
        },
        style: {
          width: "51px",
          height: "153px",
          position: "absolute",
          left: "2px",
          top: "75px",
          opacity: 0.3,
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
          id: "testtube",
          src: require("@/assets/img/bio/testtube.png")
        },
        style: {
          width: "55px",
          height: "228px",
          position: "absolute",
          left: "0px",
          top: "0px",
          zIndex: 10,
          pointerEvents: "none"
        }
      },
      {
        tag: "div",
        attribute: {
          id: "bubble-0"
        },
        style: {
          width: "10px",
          height: "10px",
          display: "none",
          position: "absolute",
          left: "20px",
          top: "150px",
          border: "1px solid white",
          borderRadius: "50%"
        }
      },
      {
        tag: "div",
        attribute: {
          id: "bubble-1"
        },
        style: {
          width: "12px",
          height: "12px",
          display: "none",
          position: "absolute",
          left: "20px",
          top: "150px",
          border: "1px solid white",
          borderRadius: "50%"
        }
      },
      {
        tag: "div",
        attribute: {
          id: "bubble-2"
        },
        style: {
          width: "8px",
          height: "8px",
          display: "none",
          position: "absolute",
          left: "20px",
          top: "150px",
          border: "1px solid white",
          borderRadius: "50%"
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
      left: "-5px",
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
      left: "175px",
      top: "-160px"
    },
    toConfig: {
      action: 0
    }
  },
  {
    id: "tube-set",
    style: {
      display: "block"
    },
    call: "before"
  },
  {
    id: "tube-set",
    wave: true,
    twinkle: true,
    toLocation: {
      left: "795px",
      top: "315px"
    },
    toConfig: {
      action: 0
    }
  },
  {
    id: "cotton",
    animeConfig: {
      duration: 800,
    },
    animeEndStyle: {
      display: "none"
    },
    call: "after"
  },
  {
    id: "clip",
    animeConfig: {
      duration: 800,
    },
    animeEndStyle: {
      display: "none"
    },
    call: "after"
  },
  {
    id: "beaker-set",
    wave: true,
    twinkle: true,
    style: {
      display: "block"
    },
    toLocation: {
      left: "610px",
      top: "140px"
    }
  },
  {
    id: "beaker-set",
    animeConfig: {
      rotate: "-85deg",
      duration: 1800,
    },
    animeEndStyle: {
      display: "none"
    },
    call: "after"
  },
  {
    id: "water",
    style: {
      display: "block"
    },
    call: "before"
  },
  {
    id: "bubble-0",
    style: {
      display: "block",
      top: "150px",
      left: "20px",
    },
    animeConfig: {
      opacity: 1,
      top: "85px",
      left: "25px",
      duration: 4200
    },
    animeEndStyle: {
      top: "85px",
      left: "25px",
      display: "none",
    },
    call: "before",
  },
  {
    id: "bubble-1",
    style: {
      display: "block",
      top: "155px",
      left: "18px",
    },
    animeConfig: {
      opacity: 1,
      top: "85px",
      left: "22px",
      duration: 2800
    },
    animeEndStyle: {
      top: "85px",
      left: "22px",
      display: "none",
    },
    call: "before",
  },
  {
    id: "bubble-2",
    style: {
      display: "block",
      top: "145px",
      left: "22px",
    },
    animeConfig: {
      opacity: 1,
      top: "85px",
      left: "17px",
      duration: 3500
    },
    animeEndStyle: {
      top: "85px",
      left: "17px",
      display: "none",
    },
    call: "before",
  },
  {
    id: "limewater",
    animeConfig: {
      opacity: 1,
      duration: 5000,
    },
    animeEndStyle: {
      opacity: 1
    },
    call: "after"
  }
];


export { waveConfig, labDomDatas, labDomSteps }