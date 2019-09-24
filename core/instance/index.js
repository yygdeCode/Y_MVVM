import {initMixin} from './init.js'
import {mountMixin} from './mount.js'
import {renderMixin} from './rander.js'
function Yue(options){
    this._init(options)
    this._render()
}

initMixin(Yue)
mountMixin(Yue)
renderMixin(Yue)
export default Yue