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
      height: "81px"
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
          zIndex: 20
        }
      }
    ]
  }
];

export { waveConfig, labDomDatas }