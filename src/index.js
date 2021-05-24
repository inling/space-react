import React from './react';
import ReactDOM from './react-dom';
//import { jsx as _jsx } from 'react/jsx-runtime';//由编译器自动引入

let element1 = (
    <div className="title" style={{ color: 'red' ,backgroundColor:'green'}}>
        <span>hello</span>
        world
    </div>
)

let element2 = React.createElement('div',
    { className: 'title', style: { 'color': 'red' } },
    React.createElement('span', null, 'world'),
    'world'
);

//在React17以前是这样，但是在React17之后不再转换成React.createElement
//let element2 = React.createElement();
//let element2 = _jsx('div');
console.log(JSON.stringify(element1, null, 2));

ReactDOM.render(element1, document.getElementById('root'))

/*
{
  "type": "div",
  "key": null,
  "ref": null,
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": "span",
        "key": null,
        "ref": null,
        "props": {
          "children": "hello"
        },
        "_owner": null,
        "_store": {}
      },
      "world"
    ]
  },
  "_owner": null,
  "_store": {}
}
*/