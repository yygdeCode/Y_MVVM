import { setValue } from "../../util/util.js"


export function vmodel(vm,elm,data){
    elm.oninput = function(e){
        console.log(elm.value)
        setValue(vm,data,elm.value)  //vue对象，该元素绑定的属性，该元素的value
    }
}