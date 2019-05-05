<template>
  <div class="driver-demo">
    <div
      v-for="(code, index) in codes"
      :key="index"
      @click.stop="onHightLight($event, code.type)"
      v-html="code.content"
    ></div>
  </div>
</template>

<script>
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

export default {
  data() {
    return {
      codes: [
        {
          type: 0,
          content: `
                    const driver = new Driver();
                    driver.highlight('#create-post');
                    `
        },
        {
          type: 1,
          content: `
                    const driver = new Driver();
                    driver.highlight({
                        element: '#some-element',
                        popover: {
                            title: 'Title for the Popover',
                            description: 'Description for it',
                        }
                    });
                    `
        },
        {
          type: 2,
          content: `
                    <p>const driver = new Driver();</p>
                    <p>// Define the steps for introduction
                    driver.defineSteps([
                    {
                        element: '#first-element-introduction',
                        popover: {
                        className: 'first-step-popover-class',
                        title: 'Title on Popover',
                        description: 'Body of the popover',
                        position: 'left'
                        }
                    },
                    {
                        element: '#second-element-introduction',
                        popover: {
                        title: 'Title on Popover',
                        description: 'Body of the popover',
                        position: 'top'
                        }
                    },
                    {
                        element: '#third-element-introduction',
                        popover: {
                        title: 'Title on Popover',
                        description: 'Body of the popover',
                        position: 'right'
                        }
                    },
                    ]);</p>
                    <p>driver.start();</p>
                    `
        }
      ]
    };
  },
  mounted() {},
  methods: {
    onHightLight(e, type) {
      const driver = new Driver();

      switch (type) {
        case 0:
          driver.highlight(e.target);
          break;
        case 1:
          driver.highlight({
            element: e.target,
            popover: {
              title: "Title for the Popover",
              description: "Description for it"
            }
          });
          break;
        case 2:
          const target = e.target;
          const el = target.tagName === "P" ? target.parentElement : target;
          driver.defineSteps([
            {
              element: el.children[0],
              popover: {
                className: "first-step-popover-class",
                title: "Title on Popover",
                description: "Body of the popover",
                position: "top"
              }
            },
            {
              element: el.children[1],
              popover: {
                title: "Title on Popover",
                description: "Body of the popover",
                position: "top"
              }
            },
            {
              element: el.children[2],
              popover: {
                title: "Title on Popover",
                description: "Body of the popover",
                position: "top"
              }
            }
          ]);
          driver.start();
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.driver-demo {
  padding: 20px;
  background-color: white;
}

.driver-demo > div {
  border-bottom: 2px solid #aaa;
  padding-bottom: 10px;
  white-space: pre-wrap;
}
</style>
