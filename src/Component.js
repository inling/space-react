import { createDOM } from './react-dom';
class Updater{
    constructor(classInstance){
        this.classInstance = classInstance;//类组件的实例
        this.pendingState = [];//等待生效的状态，可能是一个对象，也可能是一个函数
    }
}
class Component {
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.state = {};
        this.updater = new Updater(this);
    }
    setState(partialState) {
        let state = this.state;
        this.state = { ...state, ...partialState };
        //此处调的是子类的render方法
        let newVdom = this.render();
        updateClassComponent(this, newVdom);
    }
    render() {
        throw new Error('此方法为抽象方法，需要子类实现');
    }
}

//TODO更新类组件
function updateClassComponent(classInstance, newVdom) {
    let oldDom = classInstance.dom; //取出这个类组件上次渲染出来的真实DOM
    let newDOM = createDOM(newVdom);
    oldDom.parentNode.replaceChild(newDOM, oldDom);
    classInstance.dom = newDOM;
}

export default Component;