import React from 'react';
import ReactDOM from 'react-dom';
/**
 * 3.JSX其实也是一个对象
 * 可以把jsx赋值给变量，还可以作为方法的参数，作为方法的返回值。
 */
function greeting(name){
    if(name){
        return <h1>hello,{name}</h1>
    }else{
        return <h1>hello, Stranger</h1>
    }
}

const element = greeting('zhufeng');
ReactDOM.render(element, document.getElementById('root'));