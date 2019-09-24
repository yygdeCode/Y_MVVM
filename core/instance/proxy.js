import {renderData} from './rander.js'
const arrayProto = Array.prototype
const arrayProtoFun = ['push', 'pop', 'shift', 'unshift']

export function constructProxy(vm, obj, namespace) { //vm 表示vue对象 obj表示data
    //递归
    let proxyObj = null
    if (Object.prototype.toString.call(obj) === "[object Array]") {
        // proxyObj = new Array(obj.length)
        // for(let i = 0;i < obj.length;i++){

        //     proxyObj[i] = constructArrayProxy(vm,obj[i],namespace)
        //     console.log(obj[i],proxyObj[i])
        // }
        proxyObj = constructArrayProxy(vm, obj, namespace)
        proxyArr(vm, obj, namespace)
    } else if (Object.prototype.toString.call(obj) === "[object Object]") {
        proxyObj = constructObjectProxy(vm, obj, namespace)
    } else {
        throw new Error('proxy err')
    }
    return proxyObj
}

function constructObjectProxy(vm, obj, namespace) {
    let proxyObj = {}
    for (let prop in obj) {
        let temp;
        if (typeof obj[prop] == 'object') {
            if (Object.prototype.toString.call(obj[prop]) == "[object Object]") {
                temp = {}
                constructProxy(temp, obj[prop], getNameSpace(namespace, prop))
            } else {
                temp = obj[prop]
                constructProxy(temp, obj[prop], getNameSpace(namespace, prop))
            }
        } else {
            temp = obj[prop]
        }
        Object.defineProperty(proxyObj, prop, {
            get() {
                return temp
            },
            set(val) {
                // console.log(getNameSpace(namespace, prop))
                temp = val
                renderData(getNameSpace(namespace, prop),vm,prop)
            }
        })
        Object.defineProperty(vm, prop, {
            get() {
                return temp
            },
            set(val) {
                // console.log(getNameSpace(namespace, prop))
                temp = val
                renderData(getNameSpace(namespace, prop),vm,prop)

            }
        })
    }
    // for(let prop in obj){
    //     Object.defineProperty(proxyObj,prop,{
    //         configurable :true,
    //         get(){
    //             return obj[prop]
    //         },
    //         set(newVal){
    //             console.log(getNameSpace(namespace,prop),newVal)
    //             obj[prop] = newVal
    //         }
    //     })
    //     Object.defineProperty(vm,prop,{
    //         configurable :true,
    //         get(){
    //             return obj[prop]
    //         },
    //         set(newVal){
    //             console.log(getNameSpace(namespace,prop))
    //             obj[prop] = newVal
    //         }
    //     })
    //     // Object.prototype.toString.call(obj[prop]) == "[object Object]"
    //     if(obj[prop] instanceof Object){

    //         proxyObj[prop] = constructProxy(vm,obj[prop],getNameSpace(namespace,prop))
    //     }
    // }
    return proxyObj
}

function constructArrayProxy(vm, arr, namespace) {
    arr.forEach((ele,index) => {
        if (typeof ele == 'object') {
            constructProxy(vm[index], ele, `${namespace}[${index}]`)
        }
    })
    return arr
}

function getNameSpace(nowNameSpace, nowProp) {
    if (nowNameSpace == null || nowNameSpace == '') {
        return nowProp
    } else if (nowProp == null || nowProp == '') {
        return nowNameSpace
    } else {
        return nowNameSpace + '.' + nowProp
    }
}

function proxyArr(vm, arr, namespace) {
    arrayProtoFun.forEach((fun) => {
        Object.defineProperty(vm, fun, {
            value(arg) {
                let val = arrayProto[fun].call(this, arg)
                console.log(getNameSpace(namespace, ''))
                return val
            }
        })
    })

    // let obj = {
    //     eleType : 'Array',
    //     toString:function(){
    //         let result = '';
    //         for(let i = 0;i <arr.length;i++){
    //             result += arr[i] + ', ';
    //         }
    //         return result.substring(0,result.length - 2)
    //     },
    //     push(){},
    //     pop(){},

    // }
    // defArrayFun.call(vm,obj,'push',namespace,vm)
    // arr.__proto__ = obj
    // return arr
}
// function defArrayFun(obj,func,namespace,vm){
//     console.log(1)
//     Object.defineProperty(obj,func,{
//         enumerable:true,
//         configurable : true,
//         value (...args){
//             let original = arrayProto[func]
//             const result = original.apply(this,args)
//             console.log(getNameSpace(namespace,''))
//             return result;
//         }
//     })
// }