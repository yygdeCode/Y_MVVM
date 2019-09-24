export default class VNode{
    constructor(
        tag,//标签类型DIV,SPAN,#TEXT
        elm,//对应的真实节点
        children,//当前节点下的子节点
        text,//当前虚拟节点中的文本
        parent,
        nodeType//节点类型
    ){
        this.tag = tag
        this.elm = elm
        this.children = children
        this.text = text
        this.parent = parent
        this.nodeType = nodeType
        this.env = {}   //当前节点的环境变量
        this.instructions = null
        this.template = []
        
    }
}