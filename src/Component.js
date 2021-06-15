import { compareTwoVdom } from './react-dom';
export let updateQueue = {
    isBatchingUpdate: false,//当前是否处于批量更新模式，默认值是false
    updaters: new Set(),
    batchUpdate() {//批量更新
        for (let updater of this.updaters) {
            updater.updateComponent();
        }
        this.isBatchingUpdate = false;
    }
}
class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance;//类组件的实例
        this.pendingStates = [];//等待生效的状态，可能是一个对象，也可能是一个函数
        this.callbacks = [];
    }
    addState(partialState, callback) {
        this.pendingStates.push(partialState);//等待更新的或者说等待生效的状态
        if (typeof callback === 'function')
            this.callbacks.push(callback);//状态更新后的回调
        this.emitUpdate();
    }
    //一个组件不管属性变了，还是状态变了，都会更新
    emitUpdate(newProps) {
        if (updateQueue.isBatchingUpdate) {//如果当前是批量模式，先缓存updater
            updateQueue.updaters.add(this);//本次setState调用结束
        } else {
            this.updateComponent();//直接更新组件
        }
    }
    updateComponent() {
        let { classInstance, pendingStates, callbacks } = this;
        // 如果有等待更新的状态对象的话
        if (pendingStates.length > 0) {
            shouldUpdate(classInstance, this.getState());
        }
    }
    getState() {//如何计算最新的状态
        let { classInstance, pendingStates } = this;
        let { state } = classInstance;
        pendingStates.forEach((nextState) => {
            //如果pendingState是一个函数的话，传入老状态，返回新状态，再进行合并
            if (typeof nextState === 'function') {
                nextState = nextState.call(classInstance, state);
            }
            state = { ...state, ...nextState };
        })
        pendingStates.length = 0;//清空数组
        return state;
    }
}
/**
 * 判断组件是否需要更新
 * @param {*} classInstance 组件实例
 * @param {*} nextState 新的状态
 */
function shouldUpdate(classInstance, nextState) {
    classInstance.state = nextState;//不管组件要不要刷新，其实组件的state属性一定会改变
    //如果有这个方法，并且这个方法的返回值为false，则不需要继续向下更新了，否则 就更新
    if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(classInstance.props, classInstance.state)) {
        return;
    }
    classInstance.forceUpdate();
}
class Component {
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.state = {};
        this.updater = new Updater(this);
    }
    setState(partialState, callback) {
        this.updater.addState(partialState, callback);
    }
    forceUpdate() {
        if (this.componentWillUpdate) {
            this.componentWillUpdate();
        }

        let newRenderVdom = this.render(); //重新调用render方法，得到新的虚拟DOM div#counter
        let oldRenderVdom = this.oldRenderVdom;//div#counter
        let oldDOM = oldRenderVdom.dom;//domDOM#counter
        //深度比较新旧两个虚拟DOM
        let currentRenderVdom = compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
        this.oldRenderVdom = currentRenderVdom;

        if (this.componentDidUpdate) {
            this.componentDidUpdate();
        }
    }
    render() {
        throw new Error('此方法为抽象方法，需要子类实现');
    }
}




export default Component;