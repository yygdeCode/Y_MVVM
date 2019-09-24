import {constructProxy} from './proxy.js'
let uid = 0;
export function initMixin(Yue){
    //在vue的prototype上添加_init方法，在function Vue(){}里直接this._init(options)
    Yue.prototype._init = function(options){
        const vm = this
        vm.uid = uid ++
        vm.isYue = true
        if(options && options.data){   // 构建虚拟dom树
            vm._data = constructProxy(vm,options.data,'')
        }
        if(options && options.el){
            vm.$mount(options.el)
        }
    }
}
