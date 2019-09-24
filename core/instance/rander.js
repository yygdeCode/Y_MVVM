import {
    getValue
} from '../util/util.js'
const template2Vnode = new Map()
const vnode2Template = new Map()

export function getTemplate2Vnode() {
    return template2Vnode
}
export function getVnode2Template() {
    return vnode2Template
}

export function renderMixin(Yue) {
    Yue.prototype._render = function () {
        renderNode(this, this._vnode)
    }
}

export function renderData(data,vm,prop) {
    let vnodes = template2Vnode.get(data)
    if (vnodes) {
        for(let i = 0;i < vnodes.length;i++){
            renderNode(vm,vnodes[i],prop)
        }
    }
}

export function prepareRender(vm, vnode) {
    if (vnode == null) {
        return
    }
    if (vnode.nodeType == 3) { //是个文本节点
        analysisTemplate(vnode)
    }
    if (vnode.nodeType == 1) { //是个标签
        for (let i = 0; i < vnode.children.length; i++) {
            prepareRender(vm, vnode.children[i])
        }
    }
}

function renderNode(vm, vnode,prop = '') { //递归渲染
    if (vnode.nodeType == 3) { //是个文本节点就渲染
        let templates = vnode2Template.get(vnode)
        if (templates) {
            let result = vnode.text
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data,vm], prop ? prop:templates[i]) 
                // let templateValue =  getTemplateValue([vm._data,vnode.env],templates[i])
                if (templateValue) {
                    result = result.replace(`{{${templates[i]}}}`, templateValue)
                }
            }
            vnode.elm.nodeValue = result
        }
    } else {
        for (let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i])
        }
    }
}


function analysisTemplate(vnode) {
    let templateList = vnode.text.match(/{{[a-zA-Z0-9_.\[\]]+}}/g)
    for (let i = 0; templateList && i < templateList.length; i++) {
        setTemplate2Vnode(templateList[i], vnode)
        setTemolate2Vnode(templateList[i], vnode)
    }
}

function setTemplate2Vnode(template, vnode) {
    let templateName = getTemplateName(template)
    let vnodeSet = template2Vnode.get(templateName)
    if (vnodeSet) {
        vnodeSet.push(vnode)
    } else {
        template2Vnode.set(templateName, [vnode])
    }
}

function setTemolate2Vnode(template, vnode) {
    let templateSet = vnode2Template.get(vnode)
    if (templateSet) {
        templateSet.push(getTemplateName(template))
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)])
    }
}

function getTemplateName(template) {
    //判断是否有花括号，有就截掉，没有直接返回
    if (template.substring(0, 2) == '{{' && //有花括号
        template.substring(template.length - 2, template.length) == '}}') {
        return template.substring(2, template.length - 2)
    } else {
        return template
    }
}

function getTemplateValue(objs, templateName) {
    for (let i = 0; i < objs.length; i++) {
        let temp = getValue(objs[i], templateName)
        if (temp) {
            return temp
        }
    }
    return null
}