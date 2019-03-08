<script>
/*
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签字符串，组件选项对象，或者
  // 解析上述任何一种的一个 async 异步函数。必需参数。
  "div",
  // {Object}
  // 一个包含模板相关属性的数据对象
  // 你可以在 template 中使用这些特性。可选参数。
  {
    // 和`v-bind:class`一样的 API
    // 接收一个字符串、对象或字符串和对象组成的数组
    class: {
      foo: true,
      bar: false
    },
    // 和`v-bind:style`一样的 API
    // 接收一个字符串、对象或对象组成的数组
    style: {
      color: "red",
      fontSize: "14px"
    },
    // 普通的 HTML 特性
    attrs: {
      id: "foo"
    },
    // 组件 props
    props: {
      myProp: "bar"
    },
    // DOM 属性
    domProps: {
      innerHTML: "baz"
    },
    // 事件监听器基于 `on`
    // 所以不再支持如 `v-on:keyup.enter` 修饰器
    // 需要手动匹配 keyCode。
    on: {
      click: this.clickHandler
    },
    // 仅用于组件，用于监听原生事件，而不是组件内部使用
    // `vm.$emit` 触发的事件。
    nativeOn: {
      click: this.nativeClickHandler
    },
    // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
    // 赋值，因为 Vue 已经自动为你进行了同步。
    directives: [
      {
        name: "my-custom-directive",
        value: "2",
        expression: "1 + 1",
        arg: "foo",
        modifiers: {
          bar: true
        }
      }
    ],
    // 作用域插槽格式
    // { name: props => VNode | Array<VNode> }
    scopedSlots: {
      default: props => createElement("span", props.text)
    },
    // 如果组件是其他组件的子组件，需为插槽指定名称
    slot: "name-of-slot",
    // 其他特殊顶层属性
    key: "myKey",
    ref: "myRef",
    // 如果你在渲染函数中向多个元素都应用了相同的 ref 名，
    // 那么 `$refs.myRef` 会变成一个数组。
    refInFor: true
  },
  // {String | Array}
  // 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选参数。
  [
    "先写一些文字",
    createElement("h1", "一则头条"),
    createElement(MyComponent, {
      props: {
        someProp: "foobar"
      }
    })
  ]
)
*/

export default {
  name: "GRender",
  data() {
    return {
      items: [{ name: "This is" }, { name: "a render test" }, { name: "..." }]
    };
  },
  /**
   * 如果 Vue 选项中包含render渲染函数，其template模板将被忽略。
   */
  render(createElement) {
    if (this.items.length) {
      return createElement(
        "ul",
        this.items.map(function(item) {
          return createElement("li", item.name);
        })
      );
    } else {
      return createElement("p", "No items found.");
    }
  }
};
</script>

<style lang="css" scoped>
.bold {
  font-weight: bold;
  font-size: 28px;
}
</style>