import React from './react';
import ReactDOM from './react-dom';
/**
 * 5.1 函数（定义的）组件
 * React元素不仅可以是DOM标签，还可以是用户自定义的组件
 * 1.自定义组件的名称必须是首字母大写的 原生组件小写开头，自定义组件大写字母开头的
 * 2.组件必须在使用前先定义
 * 3.组件需要返回并且只能返回一个根元素
 */
/*
function ChildFunctionComponent(){
  return <div>ChildFunctionComponent</div>
}*/
function FunctionComponent(props) {
  //return <ChildFunctionComponent />
  return (
    <div className="title" style={{ backgroundColor: 'green', color: 'red' }}>
      <span>
        {props.name}
      </span>
      {props.children}
    </div>
  )
}

let element = (
  <FunctionComponent name="ruijie">
    <span>world</span>
  </FunctionComponent>
)

console.log(JSON.stringify(element, (key, value) => {
  if (key === 'type')
    return value.name
  else {
    return value;
  }
}, 2))
let element2 = React.createElement(FunctionComponent, { name: 'ruijie' }, <span>world</span>)
ReactDOM.render(element2, document.getElementById('root'));