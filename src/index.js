import React from 'react';
import ReactDOM from 'react-dom';
/**
 * 3.JSX其实也是一个对象
 * 可以把jsx赋值给变量，还可以作为方法的参数，作为方法的返回值。
 */
let users = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }, { id: 3, name: '王五' }]
let elements = users.map((user, index) => (<li key={index}>{user.name}</li>));
ReactDOM.render(elements, document.getElementById('root'));

setTimeout(()=>{
    let users = [{ id: 2, name: '张三' }, { id: 3, name: '李四' }, { id: 1, name: '王五' }];
    let elements = users.map((user, index) => (<li key={index}>{user.name}</li>));
    ReactDOM.render(elements, document.getElementById('root'));
},3000)

/**
 * React 更新的时候会如何更新？
 * 1.简单粗暴 把删除的，再插入全部的新元素，性能比较差
 * 2.React会把老的虚拟Dom和新的DOM进行比较，这个也就是所谓的dom-diff
 * 找到它们之间的差异，然后通过打补丁的方式更新差异
 */