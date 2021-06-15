import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  static defaultProps = { //设置初始属性对象
    name: '计数器'
  }

  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log('Counter 1.constructor 初始化属性和状态对象');
  }

  componentWillMount() {
    console.log('Counter 2.componentWillMount 组件将要挂载');
  }

  componentDidMount() {
    console.log('Counter 4.componentDidMount 组件挂载完成');
  }

  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate 决定组件是否需要更新？');
    return nextState.number % 2 === 0; //偶数就是true 奇数false
  }

  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate 组件将要更新');
  }

  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate 组件更新完成');
  }

  render() {
    console.log('Counter 3.render 重新计算新的虚拟DOM');
    return (
      <div id={`counter-${this.state.number}`}>
        <p>{this.state.number}</p>
        {this.state.number % 2 === 0 ? <span></span> : <p></p>}
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handleClick}>
          +
        </button>
      </div>
    )
  }
}

class ChildCounter extends React.Component {
  componentWillUnmount() {
    console.log('ChildCounter 8.componentWillUnmount 组件将要卸载');
  }
  componentWillMount() {
    console.log('ChildCounter 1.componentWillMount 组件将要挂载');
  }
  componentDidMount() {
    console.log('ChildCounter 3.componentDidMount 组件挂载完成');
  }
  componentWillReceiveProps(newProps) {
    console.log('ChildCounter 4.componentWillReceiveProps 组件将要接受到新的属性');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter 5.shouldComponentUpdate 决定组件是否需要更新？');
    return nextProps.count % 3 === 0; //3的倍数就更新，否则不更新
  }
  componentWillUpdate() {
    console.log('ChildCounter 6.componentWillUpdate 组件将要更新');
  }
  componentDidUpdate() {
    console.log('ChildCounter 7.componentDidUpdate 组件更新完成');
  }
  render() {
    console.log('ChildCounter 2.render');
    return (
      <div id="sub-counter">
        {this.props.count}
      </div>
    )
  }
}

let element = <Counter />;

ReactDOM.render(element, document.getElementById('root'));

/*
Counter 1.constructor 初始化属性和状态对象
Counter 2.componentWillMount 组件将要挂载
Counter 3.render
Counter 4.componentDidMount 组件挂载完成
Counter 5.shouldComponentUpdate 决定组件是否需要更新？
Counter 5.shouldComponentUpdate 决定组件是否需要更新？
Counter 6.componentWillUpdate 组件将要更新
Counter 3.render
Counter 7.componentDidUpdate 组件更新完成
*/