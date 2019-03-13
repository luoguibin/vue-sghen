<template>
    <div class="g-js">
        <fieldset>
            <legend>JavaScript</legend>
            <p>
                <span class="bold">JavaScript</span> (JS) 是一种具有函数优先的轻量级解释型或即时编译型的编程语言。由三部分组成：核心(ECMAScript)、文档对象模型(DOM)、浏览器对象模型(BOM)</p>

            <div class="part">
                <p>ECMAScript标准定义的
                    <span class="bold">7种数据类型</span>： 六种基本数据类型: 布尔值（Boolean）、 null、undefined、数字（Number）、字符串（String）、代表（Symbol）。以及对象（Object）。
                </p>
                <p>Symbol表示独一无二的值，不能用new命令，其值只能通过Symbol函数生成。</p>
                <p>对于尚未声明过的变量,只能执行一项操作,即使用 typeof 操作符检测其数据类型，而声明过的变量，但又未赋予初始值，使用 typeof 操作符也返回 undefined。</p>
            </div>

            <p>
                <span class="bold">var变量提升</span>：先使用变量稍后再声明变量而不会引发异常。同名声明时，函数声明优先于变量。而在 ECMAScript 6 中，let、const将不会提升变量到代码块的顶部。</p>
            <p>
                <span class="bold">function</span>函数声明：function test0() {};&nbsp;&nbsp;&nbsp;&nbsp; 函数表达式：var baz = function() {};
            </p>
            <p>
                <span class="bold">闭包</span>：当内部函数以某一种方式被任何一个外部函数作用域访问时，一个闭包就产生了</p>
            <p>
                <span class="bold">Object</span>(对象)， var obj = new Object(); obj[1] === obj["1"]; 方括号中的所有键都将转换为字符串类型，因为JavaScript中的对象只能使用String类型作为键类型。自定义get和set方法：①var obj = {_a: 0, set a(v) {this._a = v}, get a(){return this._a;}}　②Object.defineProperties(obj, { "b": { get: function () { return this.a + 1; } } });
            </p>
            <p>删除obj的a属性：delete obj.a;　如果一个全局变量不是用 var 关键字声明的话，可以用 delete 删除它</p>
        </fieldset>
        <fieldset>
            <legend>寄生组合继承</legend>
            <p style="white-space: pre-wrap; text-indent: initial;">{{strData.jicheng}}</p>
        </fieldset>
        <p>
            <span class="bold">es6 class直接定义继承</span>
        </p>
    </div>
</template>

<script>
const StrData = {
  jicheng: `    // 定义一个动物类
    function Animal (name) {
        // 属性
        this.name = name || 'Animal';
        // 实例方法
        this.sleep = function(){
            console.log(this.name + '正在睡觉！');
        }
    }
    // 原型方法
    Animal.prototype.eat = function(food) {
        console.log(this.name + '正在吃：' + food);
    };
    function Cat(name){
        Animal.call(this);
        this.name = name || 'Tom';
    }

    (function(){
        // 创建一个没有实例方法的类
        var Super = function(){};
        Super.prototype = Animal.prototype;
        //将实例作为子类的原型
        Cat.prototype = new Super();
        Cat.prototype.constructor = Cat;
    })();`
};

export default {
  name: "GJs",
  data() {
    return {
      strData: StrData,
      myArray: [
        { id: 0, name: 0 },
        { id: 1, name: 1 },
        { id: 2, name: 2 },
        { id: 3, name: 3 },
        { id: 4, name: 4 }
      ]
    };
  },
  mounted() {
    window.gjs = this;
  },
  methods: {
    setData(dataTransfer, dragEl) {
      // prevent from opening a tab when use txt elements
      dataTransfer.setData("Text", "");
    },
    onDragStart(e) {
      console.log("onDragStart", e);
    },
    onDragEnd(e) {
      console.log("onDragEnd", e);
    }
  }
};
</script>

<style scoped>
.g-js {
  padding: 10px;
}

.part {
  margin: 20px 0;
}

.bold {
  font-weight: bold;
}

p {
  font-size: 16px;
  text-indent: 2em;
  line-height: 1.8em;
}

.drag-item {
  width: 30%;
  font-size: 30px;
  border: 1px solid gray;
  background-color: #eee;
  margin-bottom: 10px;
}
</style>
