import VNode from "../vdom/vnode.js"
import {prepareRender,getTemplate2Vnode,getVnode2Template} from './rander.js'
import { vmodel } from "./directives/vmodel.js"
function mount(vm,elm){
    vm._vnode = constructVNode(vm,elm,null) //进行挂载
    prepareRender(vm,vm._vnode)
    console.log(getTemplate2Vnode())
    console.log(getVnode2Template())
}

export function mountMixin(Yue){
    Yue.prototype.$mount = function(el){
        let vm = this
        let rootDom = document.getElementById(el)
        mount(vm,rootDom)
    }
}

function constructVNode(vm,elm,parent){  //深度优先搜索
    analysisAttr(vm,elm,parent)   //寻找指令
    let vnode = null,
        children = [],
        text = getNodeText(elm),
        nodeType = elm.nodeType,
        tag = elm.nodeName;
        
    vnode = new VNode(tag,elm,children,text,parent,nodeType)
    let childs = vnode.elm.childNodes;
    for(let i = 0;i < childs.length;i++){
        let childNodes = constructVNode(vm,childs[i],vnode)
        if(childNodes instanceof VNode){   //返回的单一节点
            vnode.children.push(childNodes)
        }else{                  //返回了节点数组
            vnode.children = vnode.children.concat(childNodes)
        }
    }
    return vnode

}
function getNodeText(elm){
    if(elm.nodeType == 3){
        return elm.nodeValue
    }else {
        return ''
    }
}

function analysisAttr(vm,elm,parent){
    if(elm.nodeType ==1){
        let attrNames = elm.getAttributeNames();
        if(attrNames.indexOf('v-model') > -1){
            vmodel(vm,elm,elm.getAttribute('v-model'))
        }
    }
}