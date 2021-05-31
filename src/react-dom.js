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
    updateProps(dom, props);
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
    //Cannot add property dom, object is not extensible
    //vdom.dom = dom;
    return dom;
}
/**
 * 把一个类型为自定义函数组件的虚拟DOM转换为真实DOM并返回
 * @param {*} vdom 类型为自定义函数组件的虚拟DOM
 */
function mountFunctionComponent(vdom) {
    let { type: FunctionComponent, props } = vdom;
    let renderVdom = FunctionComponent(props);
    return createDOM(renderVdom)
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
    //调用实例的render方法返回要渲染的虚拟DOM对象
    let renderVdom = classInstance.render();
    //根据虚拟DOM对象创建真实DOM对象
    let dom = createDOM(renderVdom);
    //为以后类组件的更新，把真实DOM挂载到了类的实例上
    classInstance.dom = dom;
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
function updateProps(dom, newProps) {
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

const ReactDOM = { render }
export default ReactDOM;