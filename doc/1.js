/**
 * 在React17之前， React规定React元素是不可变的
 */

let element = { type: 'h1' };
Object.freeze(element);
element.type = 'h2';
console.log(element);

//Object.freeze 不可变原有属性不可增加
//OBject.seal 不可增加但可变原有属性