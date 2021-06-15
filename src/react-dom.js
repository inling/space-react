import { addEvent } from './event';
/**
 * 1.把vdom虚拟DOM变成真实DOM dom
 * 2.把虚拟DOM上的属性更新或者说同步到dom上
 * 3.把此虚拟dom的儿子们也都变成真实dom挂载到自己的dom上 dom.appendChild
 * 4.把自己挂载到容器上
 * @param {*} vdom 要渲染的虚拟dom
 * @param {*} container 要把虚拟dom转成真实dom,并插入容器
 */
function render(vdom, container) {
    const dom = createDOM(vdom);
    container.appendChild(dom);
    dom.componentDidMount && dom.componentDidMount();
}

/**
 * 把虚拟dom变成真实dom
 * @param {*} vdom 虚拟dom
 */
export function createDOM(vdom) {
    //TODO 处理vdom是数字或者是字符串的情况
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom);
    }

    //否则 他就是一个虚拟DOM对象了，也就是React元素了
    let { type, props } = vdom;
    let dom;
    if (typeof type === 'function') {//自定义的函数组件
        if (type.isReactComponent) {//说明这是一个类组件
            return mountClassComponent(vdom);
        } else {//否则说明是一个函数组件
            return mountFunctionComponent(vdom);
        }
    } else {//原生组件
        dom = document.createElement(type);
    }
    //使用虚拟dom的属性更新刚创建出来的真实dom的属性
    updateProps(dom,{}, props);
    //在这处理props.children属性
    //如果只有一个儿子，并且这个儿子是一个文本
    if (typeof props.children === 'string' || typeof props.children === 'number') {
        dom.textContent = props.children;
        //如果只有一个儿子，并且这个儿子是一个虚拟dom元素
    } else if (typeof props.children === 'object' && props.children.type) {
        //把儿子变成真实dom插到自己身上
        render(props.children, dom);

        //如果儿子是一个数组，说明儿子不止一个
    } else if (Array.isArray(props.children)) {
        reconcileChildren(props.children, dom)
    } else {
        document.textContent = props.children ? props.children.toString() : '';
    }
    //把真实DOM作为一个dom属性放在虚拟DOM，为以后更新做准备
    //当根据一个vdom创建出来一个真实DOM之后，真实DOM挂载到vdom.dom
    //Cannot add property dom, object is not extensible
    vdom.dom = dom;
    return dom;
}
/**
 * 把一个类型为自定义函数组件的虚拟DOM转换为真实DOM并返回
 * @param {*} vdom 类型为自定义函数组件的虚拟DOM
 */
function mountFunctionComponent(vdom) {
    let { type, props } = vdom;
    let oldRenderVdom = type(props);
    vdom.oldRenderVdom = oldRenderVdom;
    return createDOM(oldRenderVdom)
}
/**
 * 1.创建类组件的实例
 * 2.调用类组件实例的render方法获得返回的虚拟DOM(React元素)
 * 3.把返回的虚拟DOM转成真实DOM进行挂载
 * @param {*} vdom 
 */
function mountClassComponent(vdom) {
    //解构类定义和类的属性对象
    let { type, props } = vdom;
    //创建类的实例
    let classInstance = new type(props);
    //让这个类组件的虚拟DOM的classInstance属性指向这个类组件的实例
    vdom.classInstance = classInstance;
    if (classInstance.componentWillMount) {
        classInstance.componentWillMount();
    }
    //调用实例的render方法返回要渲染的虚拟DOM对象
    let oldRenderVdom = classInstance.render();
    classInstance.oldRenderVdom = oldRenderVdom;
    //把这个将要渲染的虚拟dom添加到类的实例上
    vdom.oldRenderVdom = oldRenderVdom;
    //根据虚拟DOM对象创建真实DOM对象
    let dom = createDOM(oldRenderVdom);
    if (classInstance.componentDidMount) {
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
    }
    //为以后类组件的更新，把真实DOM挂载到了类的实例上
    //classInstance.dom = dom;
    return dom;
}


/**
 * 
 * @param {*} childrenVdom 儿子们的虚拟DOM
 * @param {*} parentDOM 父亲的真实DOM
 */
function reconcileChildren(childrenVdom, parentDOM) {
    for (let i = 0; i < childrenVdom.length; i++) {
        let childVdom = childrenVdom[i];
        render(childVdom, parentDOM);
    }
}

/**
 * 
 * @param {*} dom 真实dom
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') continue;
        if (key === 'style') {
            let styleObj = newProps.style;
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr];
            }
        } else if (key.startsWith('on')) {
            //给真实DOM加属性的话 onclick
            //dom[key.toLocaleLowerCase()] = newProps[key];
            addEvent(dom, key.toLocaleLowerCase(), newProps[key])
        } else {//在JS中 dom.className = 'title'
            dom[key] = newProps[key];
        }
    }
}
/**
 * 对当前组件的进行DOM-DIFF
 * @param {*} parentNode 当前组件挂载父真实DOM节点
 * @param {*} oldRenderVdom 上一次的虚拟DOM
 * @param {*} newRenderVdom 这一次新的虚拟DOM
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
    //老的虚拟DOM和新的虚拟DOM都是null
    if (!oldVdom && !newVdom) {
        //如果老的虚拟DOM有，新的虚拟DOM没有
    } else if (oldVdom && !newVdom) {
        let currentDOM = findDOM(oldVdom);//先找到此虚拟DOM对应的真实DOM
        if (currentDOM)
            parentDOM.removeChild(currentDOM);
        if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
            oldVdom.classInstance.componentWillMount();
        }
        //如果老的是个null，新的有值，新建DOM节点并且插入
    } else if (!oldVdom && newVdom) {
        let newDOM = createDOM(newVdom);
        if (nextDOM)
            parentDOM.insertBefore(newDOM, nextDOM)
        else
            parentDOM.appendChild(newDOM);//不能写死appendChild
        //老的有新的也有,但是类型不同
    } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
        let oldDOM = findDOM(oldVdom);//老的真实DOM
        let newDOM = createDOM(newVdom);//新的真实DOM
        parentDOM.replaceChild(newDOM, oldDOM);
        if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
            oldVdom.classInstance.componentWillMount();
        }
    //如果新的有，老的也有，并且类型一样，就可以复用老的DOM节点，进行深度的DOM-diff
    //更新自己的属性，另一方面要深度比较儿子们
    }else{
        //Counter组件更新的时候oldVdom newVdom {type:'div'}
        updateElement(oldVdom,newVdom);
    }
}
/**
 * 深度比较这两个虚拟dom
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(oldVdom,newVdom){
    //先更新属性
    if(typeof oldVdom.type === 'string'){ //说明是个原生组件 div
        let currentDOM = newVdom.dom = oldVdom.dom;//复用老的DIV的真实DOM
        updateProps(currentDOM,oldVdom.props,newVdom.props);//更新自己的属性
        //更新儿子们
        //updateChildren(currentDOM,oldVdom.props.children,newVdom.props.children);
    }
}
/**
 * 查找此虚拟DOM对应的真实DOM
 * @param {*} vdom 
 */
function findDOM(vdom) {
    let { type } = vdom;
    let dom;
    if (typeof type === 'function') {
        dom = findDOM(vdom.oldRenderVdom);
    } else {
        dom = vdom.dom;
    }
    return dom;
}
const ReactDOM = { render }
export default ReactDOM;