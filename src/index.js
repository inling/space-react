import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 合成事件和批量更新
 * 1.在React里，事件的更新可能是异步的，是批量的，不是同步的
 *    调用state之后状态并没有立刻更新，而是先缓存起来了
 *    等事件函数完成后，再进行批量更新，一次更新并重新渲染
 * 因为jsx事件处理函数是react控制的，只要归react控制就是批量，只要不归react管了。就是非批量
 */

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name, number: 0 };
  }
  handleClick = () => {
    //肯定是批量更新，而且这个回调函数是等全部更新完成后才执行的
    this.setState((lastState) => ({ number: lastState.number + 1 }), () => {
      console.log('callback1', this.state.number);
    })
    console.log(this.state.number);
    this.setState((lastState) => ({ number: lastState.number + 1 }), () => {
      console.log('callback2', this.state.number);
    })
    console.log(this.state.number);

    queueMicrotask(() => {
      console.log(this.state.number);
      this.setState((lastState) => ({ number: lastState.number + 1 }), () => {
        console.log('callback3', this.state.number);
      })
      console.log(this.state.number);
      this.setState((lastState) => ({ number: lastState.number + 1 }), () => {
        console.log('callback4', this.state.number);
      })
      console.log(this.state.number);
    });

    setTimeout(() => {
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number);
    }, 1000);
  }
  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter name="qwe" />, document.getElementById('root'));