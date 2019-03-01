//数据定义参见LabDom的数据规范
const waveConfig = {
  tag: "div",
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
const labDomDatas0 = [
  {
    tag: "div",
    attribute: {
      id: "cupbottle-set",
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
    attribute: {
      id: "cap-set"
    },
    style: {
      width: "157px",
      height: "81px",
      position: "absolute",
      left: "800px",
      top: "300px",
      zIndex: 0
    },
    children: [
      {
        tag: "img",
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
        attribute: {
          id: "cotton",
          src: require("@/assets/img/bio/cotton.png")
        },
        style: {
          display: "none",
          width: "93px",
          height: "86px",
          position: "absolute",
          left: "450px",
          top: "0px",
          zIndex: 20
        }
      },
      {
        tag: "img",
        attribute: {
          id: "clip",
          src: require("@/assets/img/bio/clip.png")
        },
        style: {
          display: "none",
          width: "59px",
          height: "77px",
          position: "absolute",
          left: "450px",
          top: "0px",
          zIndex: 15
        }
      }
    ]
  },
  {
    tag: "div",
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
          zIndex: 10,
          opacity: 0.5,
          pointerEvents: "none"
        }
      },
      {
        tag: "img",
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
          display: "none",
          width: "10px",
          height: "10px",
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
          display: "none",
          width: "12px",
          height: "12px",
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
          display: "none",
          width: "8px",
          height: "8px",
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
const labDomSteps0 = [
  {
    id: "cap-set",    // 必须属性

    /* 步骤开始时的属性设置 */
    // config: {},
    // attribute: {},
    // style: {},
    wave: true,       // 可选，是否波纹提示自身
    config: {
      action: 2
    },

    /* 步骤过程中的属性设置 */
    twinkle: true,    // 可选，是否闪烁提示目标位置，配合style_使用，用于拖动元素至style_指定的位置
    // limit: 30,     // 可选，拖动到指定位置与目标位置的距离容差
    // follow: {         // 可选，跟随的元素，暂时只设置位置属性
    //   id: "cap-set-1",
    //   style: {},      
    //   style_: {}
    // },

    /*　步骤结束前的属性设置 */
    config_: {        // 可选，拖动至目标位置后，设置配置参数（配置参数见LabDom中定义）
      action: 0
    },
    style_: {         // 可选,一步骤结束前、或拖动到指定位置后设置样式
      left: "530px",
      top: "250px"
    },
    // attribute: {}
  },
  {
    id: "cotton",
    anime: {    // 可选，用于配置anime动画，可配合style_使用
      duration: 0,
      delay: 300
    },
    style_: {  // 可选，用于在anime动画结束后设置LabDom样式
      display: "block"
    },
    call: "after"     // 可选"before"、"after::selfFunction"、"before::selfFunction"；可自定义扩展回调方法
  },
  {
    id: "cotton",
    wave: true,
    config: {
      action: 2
    },
    twinkle: true,
    style_: {
      left: "-5px",
      top: "-110px"
    },
    config_: {
      action: 0
    }
  },
  {
    id: "cotton",
    anime: {
      scale: 0.6,
      duration: 1000,
      delay: 300
    },
    style_: {
      transform: "scale(0.6)",
      zIndex: 0
    },
    call: "after::showTip"
  },
  {
    id: "clip",
    wave: true,
    config: {
      action: 2
    },
    style: {
      display: "block"
    },
    twinkle: true,
    style_: {
      left: "175px",
      top: "-160px"
    },
    config_: {
      action: 0
    }
  },
  {
    id: "tube-set",
    wave: true,
    config: {
      action: 2
    },
    style: {
      display: "block"
    },
    twinkle: true,
    style_: {
      left: "795px",
      top: "315px"
    },
    config_: {
      action: 0
    }
  },
  {
    id: "cotton",
    wave: true,
    config: {
      action: 1
    },
    style_: {
      display: "none"
    },
    config_: {
      action: 0
    }
  },
  {
    id: "clip",
    wave: true,
    config: {
      action: 1
    },
    style_: {
      display: "none"
    },
    config_: {
      action: 0
    }
  },
  {
    id: "beaker-set",
    wave: true,
    config: {
      action: 2
    },
    style: {
      display: "block"
    },
    twinkle: true,
    style_: {
      left: "610px",
      top: "140px"
    },
    config_: {
      action: 0
    }
  },
  {
    id: "beaker-set",
    anime: {
      rotate: "-85deg",
      duration: 1800,
    },
    style_: {
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
    anime: {
      top: "85px",
      left: "25px",
      opacity: 1,
      duration: 4200
    },
    style_: {
      display: "none",
      top: "85px",
      left: "25px",
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
    anime: {
      top: "85px",
      left: "22px",
      opacity: 1,
      duration: 2800
    },
    style_: {
      display: "none",
      top: "85px",
      left: "22px",
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
    anime: {
      opacity: 1,
      top: "85px",
      left: "17px",
      duration: 3500
    },
    style_: {
      top: "85px",
      left: "17px",
      display: "none",
    },
    call: "before",
  },
  {
    id: "limewater",
    anime: {
      opacity: 1,
      duration: 5000,
    },
    style_: {
      opacity: 1
    },
    call: "after"
  }
];



const labDomDatas1 = [
  {
    tag: "div",
    attribute: {
      id: "cupbottle-set-0",
    },
    style: {
      width: "217px",
      height: "343px",
      position: "absolute",
      left: "300px",
      top: "450px",
      zIndex: 10
    },
    children: [
      {
        tag: "img",
        attribute: {
          id: "cupbottle-0",
          src: require("@/assets/img/bio/cupbottle.png")
        },
        style: {
          width: "217px",
          height: "343px",
          position: "absolute",
          left: "0px",
          top: "0px",
          zIndex: 10,
          pointerEvents: "none"
        }
      },
      {
        tag: "div",
        style: {
          width: "192px",
          height: "61px",
          position: "absolute",
          left: "10px",
          top: "140px",
          zIndex: 10,
          border: "3px solid white",
          borderRadius: "12px",
          backgroundColor: "#fee79b",
          color: "#2d3e50",
          fontSize: "22px",
          textAlign: "center",
          lineHeight: "61px",
          pointerEvents: "none"
        },
        innerHTML: "萌发的大豆"
      },
      {
        tag: "img",
        attribute: {
          id: "cap-0",
          src: require("@/assets/img/bio/cap.png")
        },
        style: {
          width: "157px",
          height: "81px",
          position: "absolute",
          left: "29px",
          top: "-48px",
          zIndex: 5
        }
      }
    ]
  },
  {
    tag: "div",
    attribute: {
      id: "cupbottle-set-1",
    },
    style: {
      width: "217px",
      height: "343px",
      position: "absolute",
      left: "800px",
      top: "450px",
      zIndex: 10
    },
    children: [
      {
        tag: "img",
        attribute: {
          id: "cupbottle-1",
          src: require("@/assets/img/bio/cupbottle.png")
        },
        style: {
          width: "217px",
          height: "343px",
          position: "absolute",
          left: "0px",
          top: "0px",
          zIndex: 10,
          pointerEvents: "none"
        }
      },
      {
        tag: "div",
        style: {
          width: "192px",
          height: "61px",
          position: "absolute",
          left: "10px",
          top: "140px",
          zIndex: 10,
          border: "3px solid white",
          borderRadius: "12px",
          backgroundColor: "#fee79b",
          color: "#2d3e50",
          fontSize: "22px",
          textAlign: "center",
          lineHeight: "61px",
          pointerEvents: "none"
        },
        innerHTML: "煮熟放冷的大豆"
      },
      {
        tag: "img",
        attribute: {
          id: "cap-1",
          src: require("@/assets/img/bio/cap.png")
        },
        style: {
          width: "157px",
          height: "81px",
          position: "absolute",
          left: "29px",
          top: "-48px",
          zIndex: 5
        }
      }
    ]
  },
  {
    tag: "img",
    attribute: {
      id: "sun",
      src: require("@/assets/img/bio/sun.png")
    },
    style: {
      display: "none",
      width: "381px",
      height: "230px",
      position: "absolute",
      zIndex: 200,
      left: "100px",
      top: "100px"
    }
  },
  {
    tag: "div",
    config: {
      zIndex: 0
    },
    attribute: {
      id: "candle-set-0"
    },
    style: {
      display: "none",
      width: "127px",
      height: "304px",
      position: "absolute",
      top: "100px",
      left: "550px",
      zIndex: 5
    },
    children: [
      {
        tag: "img",
        attribute: {
          id: "candle-0",
          src: require("@/assets/img/bio/candle.png")
        },
        style: {
          width: "127px",
          height: "304px",
          pointerEvents: "none"
        }
      },
      {
        tag: "img",
        attribute: {
          id: "fire-0",
          src: require("@/assets/img/bio/fire.png")
        },
        style: {
          width: "21px",
          height: "68px",
          position: "absolute",
          top: "136px",
          left: "25px",
          transformOrigin: "center bottom",
          pointerEvents: "none"
        }
      }
    ]
  },
  {
    tag: "div",
    config: {
      zIndex: 0
    },
    attribute: {
      id: "candle-set-1"
    },
    style: {
      display: "none",
      width: "127px",
      height: "304px",
      position: "absolute",
      top: "100px",
      left: "1050px",
      zIndex: 5
    },
    children: [
      {
        tag: "img",
        attribute: {
          id: "candle-1",
          src: require("@/assets/img/bio/candle.png")
        },
        style: {
          width: "127px",
          height: "304px",
          pointerEvents: "none"
        }
      },
      {
        tag: "img",
        attribute: {
          id: "fire-1",
          src: require("@/assets/img/bio/fire.png")
        },
        style: {
          width: "21px",
          height: "68px",
          position: "absolute",
          top: "136px",
          left: "25px",
          transformOrigin: "center bottom",
          pointerEvents: "none"
        }
      }
    ]
  }
];

const labDomSteps1 = [
  {
    id: "sun",
    style: {
      display: "block"
    },
    call: "before"
  },
  {
    id: "sun",
    anime: {
      delay: 3000
    },
    style_: {
      display: "none"
    },
    call: "after"
  },
  {
    id: "cap-0",
    wave: true,
    config: {
      action: 2
    },
    twinkle: true,
    style_: {
      left: "300px",
      top: "100px",
      display: "none"
    },
    follow: {
      id: "cap-1",
      style_: {
        left: "300px",
        top: "100px",
        display: "none"
      }
    }
  },
  {
    id: "candle-set-0",
    wave: true,
    config: {
      action: 2
    },
    style: {
      display: "block"
    },
    twinkle: true,
    style_: {
      left: "360px",
      top: "380px"
    },
    config_: {
      action: 0
    },
    follow: {
      id: "candle-set-1",
      style: {
        display: "block"
      },
      style_: {
        left: "860px",
        top: "380px"
      }
    }
  },
  {
    id: "fire-0",
    anime: {
      duration: 2500,
      delay: 300,
      scale: 0
    },
    style_: {
      transform: "scale(0)"
    },
    call: "before"
  },
  {
    id: "fire-1",
    anime: {
      duration: 3500,
      delay: 3200,
      scale: 0
    },
    style_: {
      transform: "scale(0)"
    },
    call: "after"
  },
];


export { waveConfig, labDomDatas0, labDomSteps0, labDomDatas1, labDomSteps1 }