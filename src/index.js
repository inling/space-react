import React from 'react';
import ReactDOM from 'react-dom';
/**
 * 4.6 更新元素渲染
 * 4.7 React只会变更必要的部分
 * React元素是不可变的
 */

function tick(){
    const element = (
        <div>
            <div>当前时间</div>
            {new Date().toLocaleTimeString()}
            <div>中国</div>
        </div>
    )
    ReactDOM.render(element,document.getElementById('root'))
}

setInterval(tick, 1000);