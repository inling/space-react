import React from 'react';
import ReactDOM from 'react-dom';
/**
 * 2. JSX属性和表达式
 * html backgroundColor:'red'
 * class => className
 * for => htmlFor
 * style =>对象
 * 如果想在JSX中读取JS变量的话，可以用{}包起来
 */
//let element1 = <h1 id="title">hello</h1>;
let element1 = <h1 id="title" htmlFor="title" className="title" style={{ color: 'red', backgroundColor:'green' }}>hello <span></span> world</h1>;
console.log(element1)
//jsx编译成createElement是在webpack编译的时候,也就是打包的时候执行的
//打包后的代码在浏览器里执行的时候，会执行函数，返回一个JS对象
let element2 = React.createElement("h1", {
    id: "title"
}, 'hello', 'world')
console.log(element2)
/**
 * {
 *  type:'h1',
 *  props:{
 *    id:'title',
 *    children:['hello','world'] 如果只有一个儿子的话，children就是那个独生子，如果有多个儿子，就是一个数组
 *  }
 * }
 */
//render方法会负责吧虚拟DOM变成真实DOM插入容器里
ReactDOM.render(element1, document.getElementById('root'));